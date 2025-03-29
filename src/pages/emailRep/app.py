# from flask import Flask, render_template, request, redirect, url_for
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build
# from email.mime.text import MIMEText
# import base64
# import google.generativeai as genai
# from datetime import datetime, timezone, timedelta
# import os
# import pickle
# from google.auth.transport.requests import Request

# app = Flask(__name__)
# genai.configure(api_key="AIzaSyBRmd7uyL5FJnLkQnyHpbFzPythzREH-FE")

# # Store App Start Time in UTC
# app_start_time = datetime.now(timezone.utc)

# # Authenticate with Gmail API
# def authenticate_gmail():
#     SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
#     creds = None

#     # Check if token file exists
#     if os.path.exists('token.json'):
#         with open('token.json', 'rb') as token_file:
#             creds = pickle.load(token_file)

#     # If no valid credentials, initiate login
#     if not creds or not creds.valid:
#         if creds and creds.expired and creds.refresh_token:
#             creds.refresh(Request())  # Refresh if expired
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
#             creds = flow.run_local_server(port=8080)
        
#         # Save credentials for future use
#         with open('token.json', 'wb') as token_file:
#             pickle.dump(creds, token_file)

#     return build('gmail', 'v1', credentials=creds)

# # Convert to 12-hour format with local timezone
# def format_time(dt):
#     local_time = dt.astimezone()
#     return local_time.strftime('%I:%M:%S %p %Y-%m-%d')

# # Fetch emails continuously
# def fetch_emails(service, max_results=5):
#     try:
#         results = service.users().messages().list(userId='me', labelIds=['INBOX'], maxResults=max_results).execute()
#         messages = results.get('messages', [])
#         email_data = []

#         for msg in messages:
#             msg_data = service.users().messages().get(userId='me', id=msg['id']).execute()
#             headers = msg_data['payload']['headers']
#             subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
#             sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown Sender')
#             timestamp = int(msg_data.get('internalDate', 0)) / 1000.0
#             received_at = datetime.fromtimestamp(timestamp, tz=timezone.utc)

#             # Update start time to the latest email received
#             global app_start_time
#             if received_at > app_start_time:
#                 app_start_time = received_at

#                 body = msg_data.get('snippet', '')
#                 formatted_received_at = format_time(received_at)
#                 email_data.append({
#                     'id': msg['id'], 
#                     'subject': subject, 
#                     'sender': sender, 
#                     'body': body, 
#                     'received_at': formatted_received_at
#                 })
#         return email_data
#     except Exception as e:
#         print(f"Error fetching emails: {e}")
#         return []

# # Generate Response using Gemini
# def generate_response(email_body):
#     try:
#         model = genai.GenerativeModel("models/gemini-1.5-flash")
#         chat = model.start_chat()
#         prompt = f"Generate a polite and professional response to this email:\n{email_body}"
#         response = chat.send_message(prompt)
#         return response.text
#     except Exception as e:
#         print(f"Error generating response: {e}")
#         return "Failed to generate response."

# # Send Email
# def send_reply(service, recipient, subject, reply_text):
#     try:
#         message = MIMEText(reply_text)
#         message['to'] = recipient
#         message['from'] = 'me'
#         message['subject'] = f"Re: {subject}"
#         raw_message = base64.urlsafe_b64encode(message.as_string().encode()).decode()
        
#         service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
#         return True
#     except Exception as e:
#         print(f"Error sending email: {e}")
#         return False

# # Routes
# @app.route('/')
# def index():
#     service = authenticate_gmail()
#     emails = fetch_emails(service)
#     email_responses = []

#     for email_data in emails:
#         response = generate_response(email_data['body'])
#         email_data['response'] = response
#         email_responses.append(email_data)

#     return render_template('EmailReplies', emails=email_responses)

# @app.route('/send/<msg_id>', methods=['POST'])
# def approve_and_send(msg_id):
#     try:
#         user_response = request.form.get('user_response', '').strip()
#         recipient = request.form.get('recipient', '')
#         subject = request.form.get('subject', '')

#         if not user_response:
#             return "Error: No response provided."
        
#         service = authenticate_gmail()
#         if send_reply(service, recipient, subject, user_response):
#             print("Email sent successfully!")
#             # Re-authenticate and fetch new emails
#             service = authenticate_gmail()
#             fetch_emails(service)
#             return redirect(url_for('index'))
#         else:
#             return "Error sending email."
#     except Exception as e:
#         print(f"Error: {e}")
#         return str(e)

# if __name__ == '__main__':
#     print(f"App started at: {format_time(app_start_time)}")
#     app.run(debug=True)