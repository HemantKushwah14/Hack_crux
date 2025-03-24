"use client";
import { useEffect, useState, useRef } from "react";

const useCustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const smoothMove = () => {
      setPosition((prev) => ({
        x: prev.x + (mouse.x - prev.x) * 0.2, // Smooth effect
        y: prev.y + (mouse.y - prev.y) * 0.2,
      }));
      requestRef.current = requestAnimationFrame(smoothMove);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.querySelectorAll("a, button, .custom-hover").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    requestRef.current = requestAnimationFrame(smoothMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current as number);

      document.querySelectorAll("a, button, .custom-hover").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return { position, isHovered };
};

export default useCustomCursor;
