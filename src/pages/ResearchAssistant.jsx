import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2, Sparkles, Search, BookText, FileText, ClipboardList, Copy, Check, ChevronDown, ChevronUp, X } from "lucide-react";

export default function ResearchAssistant() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState("summarize");
  const [researchQuery, setResearchQuery] = useState("");
  const [researchResults, setResearchResults] = useState([]);
  const [copied, setCopied] = useState(false);
  const [expandedResult, setExpandedResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Sample prompts for quick start
  const samplePrompts = {
    summarize: "Paste an article or research paper to get a concise summary",
    analyze: "Enter text to analyze its arguments, evidence, and conclusions",
    literature: "Provide text for a comprehensive literature review summary",
    research: "Ask a research question like 'What are the latest advancements in AI ethics?'"
  };

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
          prompt = `Summarize this in 3-5 concise bullet points, focusing on key ideas:\n\n${text}`;
          break;
        case "analyze":
          prompt = `Analyze this text and identify:
1. Main arguments
2. Supporting evidence
3. Potential biases
4. Conclusions\n\n${text}`;
          break;
        case "literature":
          prompt = `Create a literature review summary of this text:
- Highlight main themes
- Identify gaps in research
- Note significant contributions
- Mention methodologies used\n\n${text}`;
          break;
        default:
          prompt = `Summarize this: ${text}`;
      }

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setSummary(responseText);
      addToHistory({
        type: activeTab,
        input: text,
        output: responseText,
        timestamp: new Date().toISOString()
      });
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
Include:
1. Key concepts and definitions
2. Relevant studies and their findings
3. Current understanding and debates
4. Potential future directions
Format with clear headings and bullet points for readability.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const newResult = {
        query: researchQuery,
        answer: response.text(),
        timestamp: new Date().toISOString()
      };
      setResearchResults(prev => [...prev, newResult]);
      addToHistory({
        type: 'research',
        input: researchQuery,
        output: response.text(),
        timestamp: new Date().toISOString()
      });
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addToHistory = (item) => {
    setHistory(prev => [item, ...prev].slice(0, 10)); // Keep last 10 items
  };

  const clearCurrent = () => {
    if (activeTab !== "research") {
      setText("");
      setSummary("");
    } else {
      setResearchQuery("");
    }
    setError("");
  };

  const toggleExpandResult = (index) => {
    setExpandedResult(expandedResult === index ? null : index);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              ResearchMind AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Your intelligent assistant for academic research and analysis
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/70 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-300 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-yellow-500/20 dark:bg-yellow-300/20 animate-ping"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Powered by Gemini 1.5 Flash</span>
          </motion.div>
        </motion.header>

        {/* Tab Navigation */}
        <motion.div 
          className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { id: "summarize", icon: FileText, label: "Summarize" },
            { id: "analyze", icon: ClipboardList, label: "Analyze" },
            { id: "literature", icon: BookText, label: "Literature" },
            { id: "research", icon: Search, label: "Research" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === tab.id ? 
                "text-purple-600 dark:text-purple-300 border-b-2 border-purple-600 dark:border-purple-400 bg-gray-100 dark:bg-gray-800/50" : 
                "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/20"}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {activeTab === "summarize" ? "Text to Summarize" : 
                 activeTab === "analyze" ? "Text to Analyze" : 
                 activeTab === "literature" ? "Literature for Review" : 
                 "Research Question"}
              </h2>
              <button 
                onClick={clearCurrent}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            </div>

            {activeTab !== "research" ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    placeholder={samplePrompts[activeTab]}
                    className="w-full min-h-[200px] bg-white dark:bg-gray-700/40 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
                    value={text}
                    onChange={handleTextChange}
                    maxLength={5000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 px-2 py-1 rounded">
                    {charCount}/5000
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Tip: {activeTab === "summarize" ? "Paste complete articles for best results" :
                          activeTab === "analyze" ? "Include arguments and evidence for thorough analysis" :
                          "Provide multiple related texts for comprehensive review"}
                  </div>
                  <Button
                    onClick={handleSummarize}
                    disabled={loading || !text.trim()}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg transition-all"
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
                        {activeTab === "summarize" ? "Summarize" : 
                         activeTab === "analyze" ? "Analyze" : 
                         "Review"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={samplePrompts.research}
                    className="w-full bg-white dark:bg-gray-700/40 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={researchQuery}
                    onChange={handleResearchQueryChange}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Tip: Be specific with your research questions for better results
                  </div>
                  <Button
                    onClick={handleResearch}
                    disabled={loading || !researchQuery.trim()}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg transition-all"
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
                        Find Answers
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200 flex items-start gap-3"
              >
                <div className="bg-red-200 dark:bg-red-700/50 p-1 rounded-full">
                  <X className="w-4 h-4 text-red-600 dark:text-red-300" />
                </div>
                <div>{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {(summary || researchResults.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                      {activeTab === "summarize" ? "AI Summary" : 
                       activeTab === "analyze" ? "Text Analysis" : 
                       activeTab === "literature" ? "Literature Review" : 
                       "Research Findings"}
                    </h2>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(activeTab !== "research" ? summary : researchResults.map(r => r.answer).join('\n\n'))}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
                
                {activeTab !== "research" ? (
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {summary.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-700 dark:text-gray-300 mb-3">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {researchResults.map((result, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800/30 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div 
                          className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                          onClick={() => toggleExpandResult(index)}
                        >
                          <h3 className="font-medium text-purple-600 dark:text-purple-300">{result.query}</h3>
                          {expandedResult === index ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                        {expandedResult === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 pb-4"
                          >
                            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                              {result.answer.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-3">{paragraph}</p>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                              {new Date(result.timestamp).toLocaleString()}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800/70 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>AI-generated content</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </motion.div>
          )}

          {/* Quick Tips Section */}
          {!summary && researchResults.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                How to get the best results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === "summarize" && (
                  <>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Academic Papers</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Paste full papers for comprehensive summaries including methodology and findings.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Articles & Reports</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Include complete articles to capture all key points and context.</p>
                    </div>
                  </>
                )}
                {activeTab === "analyze" && (
                  <>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Argument Structure</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Provide complete arguments to analyze premises, evidence, and conclusions.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Critical Analysis</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Include opposing views for a balanced analysis of strengths and weaknesses.</p>
                    </div>
                  </>
                )}
                {activeTab === "literature" && (
                  <>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Multiple Sources</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Combine several related works to identify themes and gaps.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Citations</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Include references if you want them incorporated in the review.</p>
                    </div>
                  </>
                )}
                {activeTab === "research" && (
                  <>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Specific Questions</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ask precise questions like "What are recent advancements in quantum computing?"</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">Follow-up</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Refine your questions based on initial answers for deeper exploration.</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* History Section (only shown when there's history) */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <BookText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {history.slice(0, 3).map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-300 capitalize">{item.type}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{item.input}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}