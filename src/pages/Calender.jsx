import React, { useState, useEffect } from "react";
import { Trash2, Plus, CalendarCheck, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import schedule from "../schedule.json";

const Calendar = () => {
  const [customSlots, setCustomSlots] = useState([{ startTime: "", endTime: "" }]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (schedule[today]) {
      setBookedSlots(schedule[today]);
    } else {
      console.log("No schedule found for today");
      setBookedSlots([]);
    }
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const validateTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) {
      showNotification("Please fill in both time fields", "error");
      return false;
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      showNotification("End time must be after start time", "error");
      return false;
    }

    return true;
  };

  const checkSlotAvailability = (startTime, endTime) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    for (const { start, end, status } of bookedSlots) {
      const slotStart = timeToMinutes(start);
      const slotEnd = timeToMinutes(end);

      if (!(endMinutes <= slotStart || startMinutes >= slotEnd)) {
        return { available: false, status };
      }
    }
    return { available: true, status: "Free" };
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...customSlots];
    newSlots[index][field] = value;
    setCustomSlots(newSlots);
  };

  const addSlot = () => {
    if (customSlots.length >= 5) {
      showNotification("Maximum 5 slots allowed at once", "warning");
      return;
    }
    setCustomSlots([...customSlots, { startTime: "", endTime: "" }]);
  };

  const deleteSlot = (index) => {
    if (customSlots.length === 1) {
      setCustomSlots([{ startTime: "", endTime: "" }]);
    } else {
      setCustomSlots(customSlots.filter((_, i) => i !== index));
    }
  };

  const submitSlots = async () => {
    setIsSubmitting(true);
    const validSlots = customSlots.filter(slot => 
      validateTimeSlot(slot.startTime, slot.endTime)
    );

    if (validSlots.length === 0) {
      setIsSubmitting(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    let successfulSubmissions = 0;

    for (const slot of validSlots) {
      const { available, status } = checkSlotAvailability(slot.startTime, slot.endTime);
      
      if (!available) {
        showNotification(`Slot ${slot.startTime}-${slot.endTime} conflicts with existing booking`, "warning");
        continue;
      }

      try {
        const response = await fetch("http://localhost:5000/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            date: today, 
            start: slot.startTime, 
            end: slot.endTime, 
            status: status || "Free" 
          }),
        });

        if (!response.ok) throw new Error("Failed to save slot");

        const data = await response.json();
        setBookedSlots(prev => [...prev, { 
          start: slot.startTime, 
          end: slot.endTime, 
          status: status || "Free" 
        }]);
        successfulSubmissions++;
      } catch (error) {
        console.error("Error submitting slot:", error);
        showNotification("Failed to save slot. Please try again.", "error");
      }
    }

    if (successfulSubmissions > 0) {
      showNotification(`Successfully added ${successfulSubmissions} slot(s)`, "success");
      setCustomSlots([{ startTime: "", endTime: "" }]);
    }

    setIsSubmitting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Busy": 
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
      case "Free": 
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
      case "Tentative": 
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
      default: 
        return "bg-gray-100 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Busy": return <AlertTriangle className="w-4 h-4" />;
      case "Free": return <CheckCircle2 className="w-4 h-4" />;
      case "Tentative": return <Clock className="w-4 h-4" />;
      default: return <CalendarCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen  p-4 md:p-8 transition-colors duration-200">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === "error" 
                ? "bg-red-500 text-white" 
                : notification.type === "warning" 
                  ? "bg-yellow-500 text-white" 
                  : "bg-green-500 text-white"
            }`}
          >
            {notification.type === "error" ? (
              <AlertTriangle className="w-5 h-5" />
            ) : notification.type === "warning" ? (
              <Clock className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6"
        >
          {/* Calendar Section */}
          <motion.div 
            className="w-full md:w-2/3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold flex items-center gap-2 text-purple-600 dark:text-purple-600">
                  <CalendarCheck className="w-8 h-8" />
                  <span>AI Calendar</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-400 mt-1">
                  View and manage your schedule
                </p>
              </div>
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                  <iframe
                    src="https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKolkata"
                    className="w-full h-[500px]"
                    frameBorder="0"
                    scrolling="no"
                  ></iframe>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Slots Management Section */}
          <motion.div 
            className="w-full md:w-1/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className=" rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Clock className="w-6 h-6" />
                  <span>Time Slot Management</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Add and manage your availability
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <AnimatePresence>
                    {customSlots.map((slot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
                              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
                              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            />
                          </div>
                        </div>
                        {customSlots.length > 1 && (
                          <button
                            onClick={() => deleteSlot(index)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex flex-col space-y-2">
                  <button
                    onClick={addSlot}
                    className="flex items-center justify-center gap-2 w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Another Slot</span>
                  </button>
                  <button
                    onClick={submitSlots}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Submit Slots</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Booked Slots */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    <span>Current Bookings</span>
                  </h3>
                  {bookedSlots.length > 0 ? (
                    <div className="space-y-2">
                      <AnimatePresence>
                        {bookedSlots.map((slot, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`p-3 rounded-lg flex justify-between items-center border ${getStatusColor(slot.status)}`}
                          >
                            <div className="flex items-center gap-2">
                              {getStatusIcon(slot.status)}
                              <span className="font-medium">
                                {slot.start} - {slot.end}
                              </span>
                            </div>
                            <span className="text-sm font-semibold capitalize">
                              {slot.status}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="p-4 text-center bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      No bookings scheduled for today
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;