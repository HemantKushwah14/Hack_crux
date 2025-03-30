import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const authenticate = async () => {
  return await axios.get(`${API_URL}/authenticate`);
};

export const getEmails = async () => {
  return await axios.get(`${API_URL}/emails`);
};

export const generateResponse = async (emailBody) => {
  return await axios.post(`${API_URL}/generate-response`, { email_body: emailBody });
};

export const sendReply = async (recipient, subject, replyText) => {
  return await axios.post(`${API_URL}/send-reply`, { recipient, subject, reply_text: replyText });
};
