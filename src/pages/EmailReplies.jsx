import React, { useState, useEffect } from 'react';
import { authenticate, getEmails, generateResponse, sendReply } from "./Api";
import { useUser } from "@clerk/clerk-react";
import { Button } from '@/components/ui/button';

function EmailReplies() {
  const { user, isSignedIn } = useUser();
  const [emails, setEmails] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const [theme, setTheme] = useState('light');
  const [error, setError] = useState('');

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    try {
      await authenticate();
      const response = await getEmails();
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to fetch emails. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResponse = async (emailId, emailBody) => {
    try {
      const response = await generateResponse(emailBody);
      setResponses((prev) => ({ ...prev, [emailId]: response.data.response }));
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Failed to generate a response. Please try again.');
    }
  };

  const handleSendReply = async (emailId, recipient, subject) => {
    try {
      const replyText = responses[emailId];
      if (!replyText) {
        alert('Generate a response first!');
        return;
      }
      await sendReply(recipient, subject, replyText);
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send reply. Please try again.');
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className={`${theme} min-h-screen py-10  dark:from-gray-900 dark:to-gray-800 transition-all duration-500`}>      
      <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white"> Email Replies</h1>

          {isSignedIn ? (
            <div className="text-gray-600 dark:text-gray-300">
              Welcome, <span className="font-semibold">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
          ) : (
            <p className="text-red-500">Please sign in to access emails.</p>
          )}

<Button
            onClick={() => setShowHtml(!showHtml)}
          
          >
            {showHtml ? 'Close HTML Page' : 'Show HTML Page'}
         </Button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showHtml && (
          <iframe
            src={`http://localhost:5000?theme=${theme}`}
            title="Email Review"
            className="w-full h-[800px] border rounded-lg mb-6"
          />
        )}

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Fetching emails, please wait...</p>
          </div>
        ) : emails.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No new emails available.</p>
        ) : (
          emails.map((email) => (
            <div key={email.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">From: {email.sender}</h3>
              <p className="text-gray-600 dark:text-gray-300">Subject: {email.subject}</p>
              <p className="text-gray-700 dark:text-gray-400 my-4">{email.body}</p>

              <button
                onClick={() => handleGenerateResponse(email.id, email.body)}
                className="px-4 py-2 mr-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Generate Response
              </button>

              {responses[email.id] && (
                <>
                  <textarea
                    className="w-full p-3 mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    value={responses[email.id]}
                    readOnly
                  />
                  <button
                    onClick={() => handleSendReply(email.id, email.sender, email.subject)}
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Send Reply
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmailReplies;
