import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";

const Featureds = [
  {
    company: "AI-BASED",
    year: "2025",
    title: "Email Replies",
    results: [
      "Automated email responses save 60% of time",
      "Improved response accuracy by 45%",
      "Increased customer engagement by 30%",
    ],
    link: "/emailreplies",
    media: "image",
  },
  {
    company: "AI-BASED",
    year: "2025",
    title: "Calendar",
    results: [
      "Smart scheduling reduced conflicts by 50%",
      "AI reminders increased meeting attendance by 40%",
      "Seamless sync with third-party apps",
    ],
    link: "/calender",
    media: "image",
  },
  {
    company: "AI-BASED",
    year: "2025",
    title: "Summarize",
    results: [
      "AI-driven summarization reduced reading time by 70%",
      "Generated concise and accurate summaries",
      "Improved knowledge retention for professionals",
    ],
    link: "/summarize",
    media: "image",
  },
  {
    company: "AI-BASED",
    year: "2025",
    title: "Research Assistant",
    results: [
      "Accelerated research process by 65%",
      "Automated data analysis and insights",
      "Enhanced accuracy with AI-powered citation suggestions",
    ],
    link: "/researchassistant",
    media: "image",
  },
];

const FeaturedSection = () => {
  return (
    <section className="py-16 px-6 md:px-16 text-gray-900 dark:text-white transition-colors duration-300 ">
      <div className="max-w-5xl mx-auto text-center ">
        <p className="text-purple-500 dark:text-purple-300 text-sm uppercase tracking-widest">
          Real-World Results
        </p>
        <h2 className="text-4xl font-bold mt-2">Featureds by AI</h2>
        <p className="text-purple-600 dark:text-gray-400 mt-2">
          See how I transformed concepts into engaging digital experiences.
        </p>
      </div>

      <div className="mt-12 space-y-10 ">
        {Featureds.map((project, index) => (
          <motion.div
            key={index}
            className="flex flex-col md:flex-row bg-gray-100 dark:bg-[#0D1117] p-6 rounded-lg shadow-lg hover:scale-[1.02] transition-transform gap-6 border border-purple-500 dark:border-purple-400"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            {/* Left Side (Text) */}
            <div className="flex-1">
              <p className="text-purple-600 dark:text-purple-300 text-sm uppercase">
                {project.company} • {project.year}
              </p>
              <h3 className="text-xl font-semibold mt-1">{project.title}</h3>
              <ul className="mt-3 space-y-1 text-gray-600 dark:text-gray-400">
                {project.results.map((point, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <FaCheckCircle className="text-purple-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {project.link && (
                <Link to={project.link}>
                  <Button className="mt-4" variant="default">
                    Visit Live Site →
                  </Button>
                </Link>
              )}
            </div>

            {/* Right Side (Image/Video) */}
            <div className="w-full md:w-1/3 flex justify-center items-center">
              {project.media.endsWith(".mp4") ? (
                <video
                  src={project.media}
                  controls
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : (
                <img
                  src={project.media}
                  alt={project.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
