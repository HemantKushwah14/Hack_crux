// import React, { useState } from "react";
// import axios from "axios";

// const ResearchAssistant = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchResearchData = async () => {
//     if (!query) return;
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/research?query=${query}`);
//       setResults(response.data);
//     } catch (error) {
//       console.error("Error fetching research data:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">AI Research Assistant</h1>
//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Enter your research topic..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="border p-2 w-full"
//         />
//         <button onClick={fetchResearchData} disabled={loading} className="bg-blue-500 text-white p-2">
//           Search
//         </button>
//       </div>
//       {loading && <p className="mt-4">Fetching data...</p>}
//       <div className="mt-6">
//         {results.map((item, index) => (
//           <div key={index} className="border p-4 mb-4">
//             <h2 className="text-lg font-semibold">{item.title}</h2>
//             <p className="text-sm text-gray-600">{item.summary}</p>
//             <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//               Read more
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ResearchAssistant;
