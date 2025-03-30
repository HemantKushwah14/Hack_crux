import React, { useState, useEffect } from "react";
import { Zap, BellOff, Clock, X, Volume2, Minimize2 } from "react-feather";

const BoostMode = () => {
  const [isBoosted, setIsBoosted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [selectedSound, setSelectedSound] = useState("rain");
  const [showSoundOptions, setShowSoundOptions] = useState(false);

  // Sound options for focus enhancement
  const soundOptions = [
    { id: "rain", name: "Rain" },
    { id: "forest", name: "Forest" },
    { id: "coffee", name: "Coffee Shop" },
    { id: "white", name: "White Noise" },
  ];

  // Toggle Boost Mode
  const toggleBoostMode = () => {
    if (!isBoosted) {
      // Activate all boost features
      setIsBoosted(true);
      setIsActive(true);
      // Here you would implement actual blocking of sites/notifications
      console.log("Boost Mode activated - blocking distractions...");
    } else {
      // Deactivate boost features
      setIsBoosted(false);
      setIsActive(false);
      setTimeRemaining(25 * 60);
      console.log("Boost Mode deactivated");
    }
  };

  // Pomodoro timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((timeRemaining) => timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Timer completed - switch to break or work mode
      if (isActive) {
        // Play completion sound
        new Audio("/sounds/complete.mp3").play();
        alert("Time for a 5 minute break!");
        setTimeRemaining(5 * 60); // 5 minute break
      } else {
        alert("Break over - back to work!");
        setTimeRemaining(25 * 60); // 25 minute work session
        setIsActive(true);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Format time display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleBoostMode}
        className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
          isBoosted
            ? "bg-purple-700 hover:bg-purple-800 text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        <Zap className="inline mr-2" size={16} />
        {isBoosted ? "Boosted!" : "Boost Mode"}
      </button>

      {/* Boost Mode Panel */}
      {isBoosted && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg flex items-center">
              <Zap className="mr-2 text-yellow-500" size={18} />
              Boost Mode Active
            </h3>
            <button
              onClick={toggleBoostMode}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* Timer Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium flex items-center">
                <Clock className="mr-2" size={16} />
                {isActive ? "Focus Time" : "Break Time"}
              </span>
              <span className="text-xl font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${((isActive ? 25 * 60 : 5 * 60 - timeRemaining) / 
                    (isActive ? 25 * 60 : 5 * 60)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{isActive ? "Focusing" : "On Break"}</span>
              <span>{isActive ? "25:00" : "5:00"}</span>
            </div>
          </div>

          {/* Sound Selection */}
          <div className="mb-4">
            <button
              onClick={() => setShowSoundOptions(!showSoundOptions)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <span className="flex items-center">
                <Volume2 className="mr-2" size={16} />
                Ambient Sound: {soundOptions.find(s => s.id === selectedSound)?.name}
              </span>
              <span>{showSoundOptions ? "▲" : "▼"}</span>
            </button>

            {showSoundOptions && (
              <div className="mt-2 space-y-1">
                {soundOptions.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => {
                      setSelectedSound(sound.id);
                      // Here you would play the selected sound
                      console.log(`Playing ${sound.name} sound`);
                    }}
                    className={`w-full text-left p-2 rounded flex items-center ${
                      selectedSound === sound.id
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {sound.name}
                    {selectedSound === sound.id && (
                      <span className="ml-auto text-purple-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Features */}
          <div className="space-y-2">
            <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <BellOff className="mr-2" size={16} />
              <span>Notifications silenced</span>
            </div>
            <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <Minimize2 className="mr-2" size={16} />
              <span>Minimal UI enabled</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsActive(!isActive);
              setTimeRemaining(isActive ? 5 * 60 : 25 * 60);
            }}
            className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            {isActive ? "Take a Break Now" : "Back to Work"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BoostMode;