import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
// import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";


export default function Summarize() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");
    setError("");

    // const apiKey = process.env.VITE_GEMINI_API_KEY;
    try {
      // if (!apiKey) {
      //   throw new Error("API key is missing. Check your .env file.");
      // }

      // const response = await fetch(
      //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAvhH2qm6Mc361dstY4eZaekhR7NqzvBJk`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       prompt: { text: `Summarize this: ${text}` }
      //     }),          
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error(`API Error: ${response.status}`);
      // }

      // const data = await response.json();
      // const summaryText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";

      // setSummary(summaryText);

      // const genAI = new GoogleGenAI({apiKey:"AIzaSyAvhH2qm6Mc361dstY4eZaekhR7NqzvBJk" });
      const genAI = new GoogleGenerativeAI("AIzaSyAvhH2qm6Mc361dstY4eZaekhR7NqzvBJk");

      // const response = await genAI.models.generateContent({
      //   model: "gemini-2.0-flash",
      //   contents: "Explain how AI works in a few words",
      // });
      // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'});

const result = await model.generateContent(`Summarize this: ${text}`);
// const response = await result.response;
const summaryText =result.response.text();

setSummary(summaryText);
      console.log(result.text);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch summary. Check API key and model name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">AI Summary Dashboard</h1>
        <Button className="bg-purple-600 hover:bg-purple-800">Get Started</Button>
      </header>

      <div className="my-4 flex flex-col items-center">
        <Input 
          placeholder="Enter text to summarize..." 
          className="bg-gray-800 text-white w-full max-w-lg" 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button 
          className="mt-2 bg-purple-600 hover:bg-purple-800"
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </Button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {summary && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <Card className="bg-gray-900 p-4 rounded-2xl shadow-lg w-full max-w-lg">
            <CardContent>
              <h2 className="text-xl font-semibold">Summary</h2>
              <p className="text-gray-400 text-sm mt-2">{summary}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
