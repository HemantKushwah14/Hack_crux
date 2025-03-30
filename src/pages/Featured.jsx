import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FaCheckCircle, 
  FaRocket, 
  FaLightbulb, 
  FaChartLine,
  FaEnvelope,
  FaCalendarAlt,
  FaFileAlt,
  FaSearch
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const Featureds = [
  {
    company: "AI-BASED",
    year: "2025",
    title: "Email Replies",
    icon: <FaRocket className="text-purple-500" />,
    featureIcon: <FaEnvelope className="text-5xl text-purple-400" />,
    results: [
      "Automated email responses save 60% of time",
      "Improved response accuracy by 45%",
      "Increased customer engagement by 30%",
    ],
    link: "/emailreplies",
    accentColor: "bg-gradient-to-r from-purple-500 to-purple-600",
  },
  {
    company: "AI-BASED",
    year: "2025",
    title: "Calendar",
    icon: <FaLightbulb className="text-blue-500" />,
    featureIcon: <FaCalendarAlt className="text-5xl text-blue-400" />,
    results: [
      "Smart scheduling reduced conflicts by 50%",
      "AI reminders increased meeting attendance by 40%",
      "Seamless sync with third-party apps",
    ],
    link: "/calender",
    accentColor: "bg-gradient-to-r from-blue-500 to-blue-600",
  },
  {
    company: "AI-BASED",
    year: "2025",
    title: "Summarize",
    icon: <FaChartLine className="text-teal-500" />,
    featureIcon: <FaFileAlt className="text-5xl text-teal-400" />,
    results: [
      "AI-driven summarization reduced reading time by 70%",
      "Generated concise and accurate summaries",
      "Improved knowledge retention for professionals",
    ],
    link: "/summarize",
    accentColor: "bg-gradient-to-r from-teal-500 to-teal-600",
  },
  {
    company: "AI-BASED",
    year: "2025",
    title: "Research Assistant",
    icon: <FaRocket className="text-pink-500" />,
    featureIcon: <FaSearch className="text-5xl text-pink-400" />,
    results: [
      "Accelerated research process by 65%",
      "Automated data analysis and insights",
      "Enhanced accuracy with AI-powered citation suggestions",
    ],
    link: "/researchassistant",
    accentColor: "bg-gradient-to-r from-pink-500 to-pink-600",
  },
];

const FeaturedSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 mb-4 shadow-sm"
          >
            AI-Powered Solutions
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
          >
            Transform Your Workflow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Discover how our AI tools can revolutionize your daily tasks with measurable results.
          </motion.p>
        </motion.div>

        {/* Featured Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {Featureds.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative h-full flex flex-col rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Icon Header */}
              <div className={`pt-8 px-6 ${project.accentColor} h-32 flex items-center justify-center`}>
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm p-4 rounded-full">
                  {project.featureIcon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-10 h-10 rounded-full ${project.accentColor} bg-opacity-10 flex items-center justify-center shadow-inner`}>
                    {project.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {project.company} • {project.year}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {project.title}
                </h3>

                <ul className="space-y-2 mb-6 flex-1">
                  {project.results.map((point, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start"
                    >
                      <FaCheckCircle className={`flex-shrink-0 mt-1 mr-2 ${project.accentColor.replace('bg-gradient-to-r', 'text')}`} />
                      <span className="text-gray-600 dark:text-gray-300">{point}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link to={project.link}>
                    <Button
                      variant="outline"
                      className={`w-full group-hover:bg-gradient-to-r ${project.accentColor} group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border-gray-300 dark:border-gray-600`}
                    >
                      Explore Feature
                      <FiExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
         
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;