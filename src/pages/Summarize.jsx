import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2, Sparkles, Search, BookText, FileText, ClipboardList } from "lucide-react";

export default function ResearchAssistant() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState("summarize");
  const [researchQuery, setResearchQuery] = useState("");
  const [researchResults, setResearchResults] = useState([]);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");
    setError("");

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyAvhH2qm6Mc361dstY4eZaekhR7NqzvBJk");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      let prompt;
      switch(activeTab) {
        case "summarize":
          prompt = `Summarize this in 3-5 bullet points: ${text}`;
          break;
        case "analyze":
          prompt = `Analyze this text and identify key arguments, evidence, and conclusions: ${text}`;
          break;
        case "literature":
          prompt = `Create a literature review summary of this text, highlighting main themes and contributions: ${text}`;
          break;
        default:
          prompt = `Summarize this: ${text}`;
      }

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      if (activeTab === "research") {
        setResearchResults(prev => [...prev, responseText]);
      } else {
        setSummary(responseText);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate result. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) {
      setError("Please enter a research question.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyAvhH2qm6Mc361dstY4eZaekhR7NqzvBJk");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Act as a research assistant. Provide detailed information about: ${researchQuery}. 
      Include key concepts, relevant studies, and current understanding. Format with clear sections.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setResearchResults(prev => [...prev, response.text()]);
    } catch (err) {
      console.error("Research error:", err);
      setError("Failed to conduct research. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleResearchQueryChange = (e) => {
    setResearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-400">
              AI Research Assistant
            </h1>
            <p className="text-gray-400 mt-2">
              Advanced tools for summarization, analysis, and research
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">Powered by Gemini AI</span>
          </div>
        </motion.header>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("summarize")}
            className={`flex items-center gap-2 px-4 py-2 font-medium ${activeTab === "summarize" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
          >
            <FileText className="w-5 h-5" />
            Summarize
          </button>
          <button
            onClick={() => setActiveTab("analyze")}
            className={`flex items-center gap-2 px-4 py-2 font-medium ${activeTab === "analyze" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
          >
            <ClipboardList className="w-5 h-5" />
            Analyze
          </button>
          <button
            onClick={() => setActiveTab("literature")}
            className={`flex items-center gap-2 px-4 py-2 font-medium ${activeTab === "literature" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
          >
            <BookText className="w-5 h-5" />
            Literature Review
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-2 px-4 py-2 font-medium ${activeTab === "research" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
          >
            <Search className="w-5 h-5" />
            Research
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg"
          >
            {activeTab !== "research" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-text" className="block text-sm font-medium text-gray-300">
                    {activeTab === "summarize" ? "Text to summarize" : 
                     activeTab === "analyze" ? "Text to analyze" : 
                     "Text for literature review"}
                  </label>
                  <span className="text-xs text-gray-500">{charCount}/5000 characters</span>
                </div>
                <textarea
                  id="input-text"
                  placeholder={
                    activeTab === "summarize" ? "Paste text to summarize..." :
                    activeTab === "analyze" ? "Paste text to analyze..." :
                    "Paste text for literature review..."
                  }
                  className="w-full min-h-[200px] bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  value={text}
                  onChange={handleTextChange}
                  maxLength={5000}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSummarize}
                    disabled={loading || !text.trim()}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {activeTab === "summarize" ? "Generate Summary" : 
                         activeTab === "analyze" ? "Analyze Text" : 
                         "Generate Review"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="research-query" className="block text-sm font-medium text-gray-300">
                    Research question or topic
                  </label>
                </div>
                <input
                  id="research-query"
                  type="text"
                  placeholder="Enter your research question..."
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={researchQuery}
                  onChange={handleResearchQueryChange}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleResearch}
                    disabled={loading || !researchQuery.trim()}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Conduct Research
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Results Section */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200"
            >
              {error}
            </motion.div>
          )}

          {(summary || researchResults.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-400">
                  {activeTab === "summarize" ? "AI Summary" : 
                   activeTab === "analyze" ? "Text Analysis" : 
                   activeTab === "literature" ? "Literature Review" : 
                   "Research Results"}
                </h2>
              </div>
              
              {activeTab !== "research" ? (
                <div className="prose prose-invert max-w-none">
                  {summary.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-200 mb-3">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {researchResults.map((result, index) => (
                    <div key={index} className="prose prose-invert max-w-none">
                      {result.split('\n').map((paragraph, i) => (
                        <p key={i} className="text-gray-200 mb-3">{paragraph}</p>
                      ))}
                      <div className="border-t border-gray-700 my-4"></div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
                <span>Generated by Gemini AI</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </motion.div>
          )}

          {/* Tips Section */}
          {!summary && researchResults.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/30 rounded-lg p-4 border border-dashed border-gray-700"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-2">Tips for best results:</h3>
              <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                {activeTab === "summarize" && (
                  <>
                    <li>Paste articles, research papers, or long-form content</li>
                    <li>Minimum 100 characters works best</li>
                    <li>Clear, well-structured text yields better summaries</li>
                  </>
                )}
                {activeTab === "analyze" && (
                  <>
                    <li>Include complete arguments or sections for thorough analysis</li>
                    <li>Academic texts work best for detailed analysis</li>
                    <li>Highlight key points you want analyzed specifically</li>
                  </>
                )}
                {activeTab === "literature" && (
                  <>
                    <li>Provide multiple related texts for comprehensive review</li>
                    <li>Include full citations if available</li>
                    <li>Specify any particular themes to focus on</li>
                  </>
                )}
                {activeTab === "research" && (
                  <>
                    <li>Be specific with your research questions</li>
                    <li>Ask follow-up questions to dive deeper</li>
                    <li>Request citations or sources when needed</li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}