import React, { useState, useEffect } from "react";

const EmailReplies = () => {
  const [email, setEmail] = useState("");
  const [slots, setSlots] = useState([{ date: "", startTime: "", endTime: "" }]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Handle slot change
  const handleSlotChange = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  // Add new slot
  const addSlot = () => {
    setSlots([...slots, { date: "", startTime: "", endTime: "" }]);
  };

  // Remove slot
  const removeSlot = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  // Submit availability
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting:", { email, freeSlots: slots });
      alert("Free time slots updated!");
    } catch (error) {
      console.error("Error saving slots:", error);
      alert("Failed to save slots. Please try again.");
    }
  };

  return (
    <div className="  flex flex-col items-center justify-center min-h-fit p-6 transition-all duration-500 text-gray-900 dark:text-white">
      <div className="w-full max-w-xl p-6 rounded-2xl shadow-lg border transition-all duration-500 bg-white border-purple-900 dark:bg-gray-800 dark:border-purple-700">
        <h2 className="text-3xl font-bold text-center mb-6">📅 Set Your Availability</h2>

        {/* Email Input Field */}
        <div className="relative w-full mb-4">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-purple-600 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition"
          />
        </div>

        {/* Date & Time Slot Inputs */}
        {slots.map((slot, index) => (
          <div key={index} className="flex flex-col space-y-3 mb-4 p-4 rounded-lg border border-purple-600 dark:border-purple-600 bg-gray-50 dark:bg-gray-900">
            <label className="text-sm font-medium">Select Date:</label>
            <input
              type="date"
              value={slot.date}
              onChange={(e) => handleSlotChange(index, "date", e.target.value)}
              className="p-3 rounded-lg border border-purple-600 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition"
            />

            <div className="flex space-x-2">
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium">Start Time:</label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
                  className="p-3 rounded-lg border border-purple-600 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition"
                />
              </div>

           
            </div>

            <button
              onClick={() => removeSlot(index)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 shadow-lg w-full"
            >
              ❌ Remove Slot
            </button>
          </div>
        ))}

        {/* Add Slot Button */}
        <button
          onClick={addSlot}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg mb-4"
        >
          ➕ Add Slot
        </button>

        {/* Save Availability Button */}
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform hover:scale-105 shadow-lg"
        >
          ✅ Save Availability
        </button>
      </div>
    </div>
  );
};

export default EmailReplies;
