import base64
import time
import json
import os
import logging
from datetime import datetime, timezone
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import pytz
import google.generativeai as genai

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
INDIA_TZ = pytz.timezone('Asia/Kolkata')
replied_threads = set()

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] - %(message)s')

def log_message(level, message):
    if level == "info":
        logging.info(message)
    elif level == "error":
        logging.error(message)
    elif level == "warning":
        logging.warning(message)

# Configure Gemini API
API_KEY = 'AIzaSyBRmd7uyL5FJnLkQnyHpbFzPythzREH-FE'  # Replace with actual API key
genai.configure(api_key=API_KEY)

# Authenticate Gmail
def authenticate_gmail():
    try:
        flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
        creds = flow.run_local_server(port=8080)
        service = build('gmail', 'v1', credentials=creds)
        log_message("info", "✅ Gmail Authentication Successful!")
        return service
    except Exception as e:
        log_message("error", f"❗ Error during Gmail authentication: {e}")
        return None

# Load Schedule
def load_schedule():
    try:
        with open('schedule.json', 'r') as f:
            schedule = json.load(f)
            log_message("info", "✅ Schedule loaded successfully.")
            return schedule
    except FileNotFoundError:
        log_message("error", "❗ Schedule not found. Please create schedule.json.")
    except json.JSONDecodeError as e:
        log_message("error", f"❗ Error decoding JSON: {e}")
    except Exception as e:
        log_message("error", f"❗ Unexpected error: {e}")
    return None

# Classify Email Using Gemini
def predict_meeting_request(body):
    try:
        log_message("info", "🔎 Classifying email using Gemini...")
        prompt = f"""
        Carefully analyze the following email body and determine if the sender is requesting a meeting. 
        The presence of the word "meet" does not necessarily mean a request for a meeting.
        
        Examples of actual meeting requests:
        - Can we schedule a meeting to discuss the project?
        - I would like to set up a meeting with you.
        - Let's plan a call or a meeting.
        - Are you available for a quick meeting tomorrow?
        - Please confirm our meeting time.

        Examples of emails that are **not** meeting requests:
        - I have a meet scheduled already.
        - I attended the meet yesterday.
        - We missed the meet last week.
        - No further meetings are planned.

        Your task: Answer with **Yes** if the sender is requesting a meeting, or **No** if they are not. 
        Provide only **Yes** or **No** as the response.

        Email: {body}
        """

        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        answer = response.text.strip().lower() if response.text else 'no'

        if answer in ['yes', 'no']:
            log_message("info", f"✅ Gemini's Response: {answer}")
            return answer
        else:
            log_message("error", "❗ Unexpected response from Gemini. Defaulting to 'No'.")
            return 'no'
    except Exception as e:
        log_message("error", f"❗ Error in classification: {e}")
        return 'no'



# Suggest Meeting Time
def suggest_meeting_time():
    schedule = load_schedule()
    if not schedule:
        return "No available slots."

    # Get today's date in the format of the schedule key
    today_date = datetime.now().strftime('%Y-%m-%d')
    day_schedule = schedule.get(today_date, [])

    # Remove duplicates (optional)
    unique_slots = {f"{slot['start']}-{slot['end']}": slot for slot in day_schedule}
    day_schedule = list(unique_slots.values())

    # Find the first "Free" slot
    for slot in day_schedule:
        status = slot.get('status', '').strip().lower()
        if status == 'free':
            start_time = slot.get('start')
            slot['status'] = 'Busy'  # Mark the slot as busy

            # Update the schedule
            try:
                with open('schedule.json', 'w') as f:
                    json.dump(schedule, f, indent=4)
                log_message("info", f"✅ Meeting Scheduled at {start_time}")
                return start_time
            except Exception as e:
                log_message("error", f"❗ Error updating schedule: {e}")
                return "Error updating schedule."

    log_message("info", "❗ No available slots for a meeting.")
    return "No available slots."



# Fetch New Emails
def fetch_new_emails(service, since_timestamp):
    try:
        query = f"after:{int(since_timestamp.timestamp())}"
        results = service.users().messages().list(userId='me', q=query, maxResults=10).execute()
        return results.get('messages', [])
    except Exception as e:
        log_message("error", f"❗ Error while fetching emails: {e}")
        return []

# Extract Sender and Subject
def extract_sender_and_subject(service, msg_id):
    try:
        msg_data = service.users().messages().get(userId='me', id=msg_id).execute()
        headers = msg_data.get('payload', {}).get('headers', [])
        sender_email = next((h['value'] for h in headers if h['name'].lower() == 'from'), None)
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), 'No Subject')
        
        # Extract Email Body
        body = extract_email_body(msg_data)

        timestamp = int(msg_data.get('internalDate', 0)) / 1000.0
        received_at = datetime.fromtimestamp(timestamp, tz=timezone.utc)

        return sender_email, subject, body, received_at, msg_data.get('threadId', msg_id)
    except Exception as e:
        log_message("error", f"❗ Error extracting email data: {e}")
        return None, None, None, None, None

# Extract Email Body
def extract_email_body(msg_data):
    try:
        payload = msg_data.get('payload', {})
        parts = payload.get('parts', [])
        
        # Check for plain text in parts or directly in the body
        if not parts and 'body' in payload:
            return base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8', errors='ignore')
        
        for part in parts:
            if part.get('mimeType') == 'text/plain':
                return base64.urlsafe_b64decode(part['body']['data']).decode('utf-8', errors='ignore')
        return ""
    except Exception as e:
        log_message("error", f"❗ Error extracting email body: {e}")
        return ""


# Send Email Response
def send_reply(service, msg_id, sender_email, subject, is_meeting_request):
    try:
        if not sender_email or msg_id in replied_threads:
            return

        if is_meeting_request == 'yes':
            meeting_time = suggest_meeting_time()
            reply_text = f"Let's schedule a meeting at {meeting_time}." if meeting_time != "No available slots." else "I'm currently unavailable."
            
            message = MIMEText(reply_text)
            message['to'] = sender_email
            message['from'] = 'me'
            message['subject'] = f"Re: {subject}"
            raw_message = base64.urlsafe_b64encode(message.as_string().encode()).decode()

            service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
            replied_threads.add(msg_id)  # Track replied threads
            log_message("info", "✅ Successfully replied.")
        else:
            log_message("info", "🚫 No meeting request detected. No reply sent.")
    except Exception as e:
        log_message("error", f"❗ Error sending reply: {e}")



# Main Loop
def main():
    service = authenticate_gmail()
    if not service:
        return

    start_time = datetime.now(timezone.utc)
    log_message("info", f"⏱️ Monitoring for new emails from: {start_time.astimezone(INDIA_TZ).strftime('%I:%M:%S %p %Y-%m-%d')}")

    while True:
        time.sleep(10)
        messages = fetch_new_emails(service, start_time)

        for msg in messages:
            sender_email, subject, body, received_at, msg_id = extract_sender_and_subject(service, msg['id'])
            if sender_email and msg_id and msg_id not in replied_threads:
                log_message("info", f"📧 New Email - From: {sender_email}, Subject: {subject}")
                is_meeting_request = predict_meeting_request(body)
                send_reply(service, msg_id, sender_email, subject, is_meeting_request)

if __name__ == '__main__':
    main()
