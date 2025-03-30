import traceback
from flask import Flask, jsonify
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
import google.generativeai as genai
from datetime import datetime, timezone
import os
import pickle
from google.auth.transport.requests import Request
from datetime import datetime, timezone, timedelta
import time
import re

app = Flask(__name__)
genai.configure(api_key="AIzaSyBRmd7uyL5FJnLkQnyHpbFzPythzREH-FE")  # Replace with actual API key

# Configuration
REPLIED_EMAILS_FILE = 'replied_emails.txt'
MAX_RESULTS = 50
DELAY_BETWEEN_EMAILS = 3  # seconds
REFRESH_INTERVAL = 3  # seconds for page refresh

# Store App Start Time in UTC with buffer
app_start_time = datetime.now(timezone.utc) - timedelta(minutes=5)

# Global variable for user's name
user_name = None

def get_user_name(service):
    """Extract user's name from their Gmail profile"""
    # Check if we already have the name stored
    if os.path.exists('user_name.txt'):
        with open('user_name.txt', 'r') as f:
            return f.read().strip()
    try:
        # First try to get the name from the Gmail profile
        profile = service.users().getProfile(userId='me').execute()
        if 'name' in profile and profile['name']:
            name = profile['name']
            # Save the name for future use
            with open('user_name.txt', 'w') as f:
                f.write(name)
            return name    
        
        # Fallback: Extract name from email address
        email_address = profile['emailAddress']
        email_prefix = email_address.split('@')[0]
        if '.' in email_prefix:
            name = ' '.join(part.capitalize() for part in email_prefix.split('.'))
        elif '_' in email_prefix:
            name = ' '.join(part.capitalize() for part in email_prefix.split('_'))
        else:
            name = None
        
        if name:
            # Save the name for future use
            with open('user_name.txt', 'w') as f:
                f.write(name)
            return name
        
    except Exception as e:
        print(f"Error getting user name: {e}")
        
        # If we get here, we need to ask the user
    print("Could not automatically determine your name from your Google account.")
    while True:
        name = input("Please enter your full name to use in email signatures (this will be saved for future use): ").strip()
        if name:
            # Save the name for future use
            with open('user_name.txt', 'w') as f:
                f.write(name)
            return name
        print("Name cannot be empty. Please try again.")

# Load replied emails from file
def load_replied_emails():
    replied_emails = set()
    if os.path.exists(REPLIED_EMAILS_FILE):
        with open(REPLIED_EMAILS_FILE, 'r') as f:
            replied_emails = set(line.strip() for line in f if line.strip())
    return replied_emails

# Save replied email to file
def save_replied_email(email_id):
    with open(REPLIED_EMAILS_FILE, 'a') as f:
        f.write(f"{email_id}\n")

# Initialize replied emails set
replied_emails = load_replied_emails()

# Extract name from email address
def extract_name_from_email(email_address):
    # Pattern for "Name <email@domain.com>" format
    name_match = re.search(r'"?([^"<]+)"?\s*<', email_address)
    if name_match:
        return name_match.group(1).strip()
    
    # Pattern for email prefix (first.last@domain.com)
    email_prefix = email_address.split('@')[0]
    if '.' in email_prefix:
        return ' '.join(part.capitalize() for part in email_prefix.split('.'))
    elif '_' in email_prefix:
        return ' '.join(part.capitalize() for part in email_prefix.split('_'))
    
    return None

# Authenticate with Gmail API
def authenticate_gmail():
    global user_name
    SCOPES = ['https://www.googleapis.com/auth/gmail.modify',
              'https://www.googleapis.com/auth/userinfo.profile']
    
    creds = None
    if os.path.exists('token.json'):
        with open('token.json', 'rb') as token_file:
            creds = pickle.load(token_file)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=8080)
        
        with open('token.json', 'wb') as token_file:
            pickle.dump(creds, token_file)
    
    service = build('gmail', 'v1', credentials=creds)
    user_name = get_user_name(service)
    print(f"Authenticated as: {user_name}")
    return service

# Convert to readable time format
def format_time(dt):
    local_time = dt.astimezone()
    return local_time.strftime('%I:%M:%S %p %Y-%m-%d')

# Fetch emails received after the script started
def fetch_emails(service):
    try:
        print("Fetching emails...")
        query = f"after:{int(app_start_time.timestamp())}"
        
        results = service.users().messages().list(
            userId='me',
            labelIds=['INBOX'],
            maxResults=MAX_RESULTS,
            q=query
        ).execute()
        
        messages = results.get('messages', [])
        email_data = []

        for msg in messages:
            try:
                msg_data = service.users().messages().get(userId='me', id=msg['id']).execute()
                headers = msg_data['payload']['headers']
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown Sender')
                body = msg_data.get('snippet', '')
                
                timestamp = int(msg_data.get('internalDate', 0)) / 1000.0
                received_at = datetime.fromtimestamp(timestamp, tz=timezone.utc)
                formatted_received_at = format_time(received_at)
                
                email_data.append({
                    'id': msg['id'],
                    'subject': subject,
                    'sender': sender,
                    'body': body,
                    'received_at': formatted_received_at
                })
                
            except Exception as e:
                print(f"Error processing email {msg.get('id')}: {e}")
                continue

        print(f"Found {len(email_data)} emails to process.")
        return email_data
        
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return []

# Generate personalized response using Gemini
def generate_response(email_body, sender_name, email_subject):
    global user_name
    try:
        model = genai.GenerativeModel("models/gemini-1.5-flash")
        
        prompt = f"""
        You are {user_name} composing an email response. Follow these guidelines:
        
        1. Recipient: {sender_name}
        2. Original Subject: {email_subject}
        3. Email Content: {email_body}
        
        Response Requirements:
        - Start with appropriate greeting (Hi/Dear [Name])
        - Respond specifically to the email content
        - Maintain professional but friendly tone
        - Keep it concise (2-3 sentences)
        - End with: "Best regards,\n{user_name}"
        
        Example:
        Hi John,
        
        Thank you for your email about the project. I've reviewed the details and will send my feedback by Friday.
        
        Best regards,
        {user_name}
        """
        
        response = model.generate_content(prompt)
        
        # Ensure proper signature format
        if not response.text.strip().endswith(user_name):
            response_text = response.text.rstrip()  # Remove any trailing whitespace
            if not response_text.endswith(('Best regards,', 'Regards,', 'Sincerely,')):
                response_text += f"\n\nBest regards,\n{user_name}"
            else:
                response_text += f"\n{user_name}"
            return response_text
            
        return response.text
        
    except Exception as e:
        print(f"Error generating response: {e}")
        return f"Hi {sender_name},\n\nThank you for your email. I'll respond more fully soon.\n\nBest regards,\n{user_name}"

# Send Email
def send_reply(service, recipient, subject, reply_text):
    try:
        message = MIMEText(reply_text)
        message['to'] = recipient
        message['from'] = 'me'
        message['subject'] = f"Re: {subject}"
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        
        service.users().messages().send(
            userId='me',
            body={'raw': raw_message}
        ).execute()
        
        print(f"Email sent to {recipient}")
        return True
        
    except Exception as e:
        print(f"Failed to send to {recipient}: {str(e)}")
        return False

# Main endpoint
@app.route('/')
def index():
    try:
        service = authenticate_gmail()
        emails = fetch_emails(service)
        results = []

        for email_data in emails:
            email_id = email_data['id']
            
            # Skip if already replied
            if email_id in replied_emails:
                print(f"Skipping already replied email: {email_data['subject']}")
                results.append({
                    'status': 'skipped',
                    'to': email_data['sender'],
                    'subject': email_data['subject']
                })
                continue

            try:
                # Extract sender name
                sender_name = extract_name_from_email(email_data['sender']) or "there"
                
                # Generate personalized response
                response = generate_response(
                    email_data['body'],
                    sender_name,
                    email_data['subject']
                )
                
                # Send reply
                if send_reply(service, email_data['sender'], email_data['subject'], response):
                    replied_emails.add(email_id)
                    save_replied_email(email_id)
                    results.append({
                        'status': 'success',
                        'to': email_data['sender'],
                        'subject': email_data['subject'],
                        'response': response  # Include generated response in results
                    })
                else:
                    results.append({
                        'status': 'failed',
                        'to': email_data['sender'],
                        'subject': email_data['subject']
                    })

                time.sleep(DELAY_BETWEEN_EMAILS)
                
            except Exception as e:
                print(f"Error processing email: {traceback.format_exc()}")
                results.append({
                    'status': 'error',
                    'to': email_data.get('sender', 'unknown'),
                    'subject': email_data.get('subject', 'no subject'),
                    'message': str(e)
                })
                continue

        return jsonify({
            'status': 'completed',
            'processed_emails': len(results),
            'results': results
        })

    except Exception as e:
        print(f"Critical error: {traceback.format_exc()}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print(f"App started at: {format_time(app_start_time)}")
    app.run(debug=True, port=5000, use_reloader=False)