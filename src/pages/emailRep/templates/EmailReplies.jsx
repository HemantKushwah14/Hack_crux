// import { useState, useEffect } from "react";

// const EmailReview = () => {
//     const [emails, setEmails] = useState([]);

//     // Fetch emails from backend
//     useEffect(() => {
//         fetch("/api/emails")
//             .then((res) => res.json())
//             .then((data) => setEmails(data))
//             .catch((err) => console.error("Error fetching emails:", err));
//     }, []);

//     // Handle form submission
//     const handleSendResponse = async (e, emailId) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const responseText = formData.get("user_response");

//         const response = await fetch(`/send/${emailId}`, {
//             method: "POST",
//             body: JSON.stringify({ user_response: responseText }),
//             headers: { "Content-Type": "application/json" },
//         });

//         if (response.ok) {
//             alert("Response sent successfully!");
//         } else {
//             alert("Error sending response.");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-6">
//             <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">Email Review and Approval</h1>
            
//             {emails.length > 0 ? (
//                 emails.map((email) => (
//                     <div key={email.id} className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-purple-500">
//                         <h3 className="text-xl font-semibold">From: {email.sender}</h3>
//                         <p className="text-gray-300"><strong>Subject:</strong> {email.subject}</p>
//                         <p className="text-gray-400">{email.body}</p>

//                         <h4 className="text-lg font-medium mt-4 text-purple-300">Generated Response:</h4>
//                         <textarea 
//                             defaultValue={email.response} 
//                             rows="5" 
//                             className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500"
//                         />

//                         {/* Form to Edit and Send Response */}
//                         <form onSubmit={(e) => handleSendResponse(e, email.id)} className="mt-4">
//                             <label className="block text-sm text-gray-400 mb-2">Review or Edit the Response:</label>
//                             <textarea 
//                                 name="user_response" 
//                                 defaultValue={email.response} 
//                                 rows="5" 
//                                 className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-purple-500"
//                             />

//                             <input type="hidden" name="recipient" value={email.sender} />
//                             <input type="hidden" name="subject" value={email.subject} />

//                             <button 
//                                 type="submit" 
//                                 className="mt-3 w-full bg-purple-600 hover:bg-purple-500 transition p-2 rounded-md font-medium"
//                             >
//                                 Send Response
//                             </button>
//                         </form>
//                     </div>
//                 ))
//             ) : (
//                 <p className="text-center text-gray-400">No new emails available.</p>
//             )}
//         </div>
//     );
// };

// export default EmailReview;
import React from 'react'

function EmailReplies() {
  return (
    <div>EmailReplies</div>
  )
}

export default EmailReplies