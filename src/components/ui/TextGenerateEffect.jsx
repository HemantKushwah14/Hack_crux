"use client";

import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const TextGenerateEffect = ({ words, className }) => {
  const { resolvedTheme } = useTheme(); // Get current theme
  const [mounted, setMounted] = useState(false);
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    setMounted(true);

    // ✅ Ensure that the animation runs only when the component is mounted
    if (scope.current) {
      animate(
        scope.current.querySelectorAll("span"), // ✅ Animate individual words
        { opacity: 1, y: 0 }, // ✅ Fade-in and slight upward movement
        {
          duration: 0.5, // ✅ Faster effect
          delay: stagger(0.1),
        }
      );
    }
  }, [scope, animate]);

  // ✅ Prevent hydration mismatch in Next.js SSR
  if (!mounted) return null;

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <motion.div ref={scope} className="leading-snug tracking-wide">
          {wordsArray.map((word, idx) => (
            <motion.span
              key={word + idx}
              initial={{ opacity: 0, y: 10 }} // ✅ Start hidden
              animate={{ opacity: 1, y: 0 }} // ✅ Fade in & move up
              transition={{ duration: 0.5, delay: idx * 0.1 }} // ✅ Delay effect per word
              className={cn(
                "inline-block mx-1 transition-colors",
                idx > 3
                  ? "text-purple-500"
                  : resolvedTheme === "dark"
                  ? "text-white"
                  : "text-black"
              )}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
