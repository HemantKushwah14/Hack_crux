import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Clock, 
  Shield, 
  BellOff, 
  BarChart2, 
  Circle, 
  CheckCircle, 
  XCircle,
  Zap,
  Battery,
  Coffee
} from "react-feather";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import BoostMode from "./BoostMode";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [focusMode, setFocusMode] = useState(false);
  // const [smartNotifications, setSmartNotifications] = useState(true);
  // const [breakReminders, setBreakReminders] = useState(true);

  // Sample data for charts
  const timeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Productive Time',
        data: [6.2, 7.1, 6.8, 7.5, 6.9, 3.2, 1.5],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Distracted Time',
        data: [1.8, 0.9, 1.2, 0.5, 1.1, 2.8, 3.5],
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const appUsageData = {
    labels: ['VS Code', 'Chrome', 'Slack', 'Spotify', 'Other'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#8b5cf6',
          '#6366f1',
          '#ec4899',
          '#f59e0b',
          '#6b7280'
        ],
        borderWidth: 0
      }
    ]
  };

  const productivityScore = 82;
  const todayStats = {
    focusedHours: 6.8,
    distractions: 12,
    tasksCompleted: 7,
    totalTasks: 9,
    breaksTaken: 3
  };

  const blockedSites = ['socialmedia.com', 'news.site', 'shopping.site'];
  const suggestedActivities = ['Meditate for 5 mins', 'Review daily goals', 'Drink water'];

  // Simulate break recommendation
  const [showBreakRecommendation, setShowBreakRecommendation] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBreakRecommendation(true);
    }, 10000); // Show after 10 seconds for demo
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Productivity Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Battery className="text-green-500 mr-2" />
              <span className="font-medium">Daily Score: {productivityScore}/100</span>
            </div>
         <BoostMode/>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Break Recommendation Modal */}
        {showBreakRecommendation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-300 p-6 rounded-xl max-w-md w-full shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center">
                  <Coffee className="text-yellow-500 mr-2" />
                  Time for a Break!
                </h3>
                <button 
                  onClick={() => setShowBreakRecommendation(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <p className="mb-4">You've been working for 52 minutes. Take a 5-minute break to maintain productivity.</p>
              <div className="space-y-2 mb-4">
                <h4 className="font-medium">Suggested Activities:</h4>
                <ul className="space-y-1">
                  {suggestedActivities.map((activity, i) => (
                    <li key={i} className="flex items-center">
                      <Circle className="w-3 h-3 mr-2 text-purple-500" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowBreakRecommendation(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => {
                    setShowBreakRecommendation(false);
                    // Start 5 minute break timer
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Start Break (5:00)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'time-tracking', 'focus-mode', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Focused Time</p>
                    <p className="text-2xl font-bold mt-1">{todayStats.focusedHours} hrs</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                    <Clock size={20} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {todayStats.focusedHours > 6 ? 'Excellent focus today!' : 'Keep building your focus!'}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</p>
                    <p className="text-2xl font-bold mt-1">
                      {todayStats.tasksCompleted}/{todayStats.totalTasks}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(todayStats.tasksCompleted / todayStats.totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Distractions</p>
                    <p className="text-2xl font-bold mt-1">{todayStats.distractions}</p>
                  </div>
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300">
                    <XCircle size={20} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {todayStats.distractions < 10 ? 'Great focus!' : 'Try focus mode to reduce distractions'}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Breaks Taken</p>
                    <p className="text-2xl font-bold mt-1">{todayStats.breaksTaken}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <Coffee size={20} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {todayStats.breaksTaken >= 3 ? 'Good work-life balance!' : 'Remember to take breaks'}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 className="font-medium mb-4">Weekly Time Analysis</h3>
                <Line 
                  data={timeData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }} 
                />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 className="font-medium mb-4">App Usage Distribution</h3>
                <div className="h-64">
                  <Pie 
                    data={appUsageData} 
                    options={{ 
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                      },
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time Tracking Tab */}
        {activeTab === 'time-tracking' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Activity className="mr-2 text-purple-500" />
              Time Tracking & Analysis
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Today's Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span>VS Code</span>
                    <span className="font-medium">3h 42m</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span>Chrome</span>
                    <span className="font-medium">1h 15m</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span>Slack</span>
                    <span className="font-medium">45m</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Work Sessions</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Morning Work</span>
                      <span>9:00 AM - 11:30 AM</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Productivity: 92%</span>
                      <span>2h 30m</span>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Afternoon Work</span>
                      <span>1:15 PM - 4:45 PM</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Productivity: 78%</span>
                      <span>3h 30m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">Automatic Time Tracking</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Track time spent in applications automatically</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium">Idle Time Detection</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pause tracking when inactive for more than 5 minutes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Focus Mode Tab */}
        {activeTab === 'focus-mode' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Shield className="mr-2 text-purple-500" />
              Focus Mode
            </h2>
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium mb-2">Focus Mode</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Block distracting websites and apps to maintain concentration
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={focusMode}
                    onChange={() => setFocusMode(!focusMode)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {focusMode && (
                <>
                  <div>
                    <h3 className="font-medium mb-3">Blocked Websites</h3>
                    <div className="space-y-2">
                      {blockedSites.map((site, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <span>{site}</span>
                          <button className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                            <XCircle size={18} />
                          </button>
                        </div>
                      ))}
                      <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        + Add Website
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Suggested Activities</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-3">
                      When you're tempted to visit blocked sites, try these instead:
                    </p>
                    <div className="space-y-2">
                      {suggestedActivities.map((activity, i) => (
                        <div key={i} className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="text-green-500 mr-3" size={16} />
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Focus Sessions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[25, 50, 90, 120].map((minutes) => (
                        <button
                          key={minutes}
                          className="py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                        >
                          <span className="font-medium">{minutes} min</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <BarChart2 className="mr-2 text-purple-500" />
              Productivity Reports
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Daily Productivity Score</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Today</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{productivityScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${productivityScore}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mt-4">
                    {[65, 72, 78, 85, 80, 45, productivityScore].map((score, i) => (
                      <div key={i} className="text-center">
                        <div 
                          className="mx-auto w-full bg-purple-600 rounded-t-sm" 
                          style={{ height: `${score * 0.6}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Weekly Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-2">Day</th>
                        <th className="pb-2">Focus Time</th>
                        <th className="pb-2">Distractions</th>
                        <th className="pb-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { day: 'Monday', focus: 6.2, distractions: 8, score: 78 },
                        { day: 'Tuesday', focus: 7.1, distractions: 5, score: 85 },
                        { day: 'Wednesday', focus: 6.8, distractions: 7, score: 80 },
                        { day: 'Thursday', focus: 7.5, distractions: 4, score: 88 },
                        { day: 'Friday', focus: 6.9, distractions: 6, score: 82 },
                        { day: 'Saturday', focus: 3.2, distractions: 15, score: 45 },
                        { day: 'Sunday', focus: 1.5, distractions: 18, score: 30 }
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3">{row.day}</td>
                          <td>{row.focus} hrs</td>
                          <td>{row.distractions}</td>
                          <td className={`font-medium ${row.score > 70 ? 'text-green-500' : row.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {row.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Export Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    PDF Report
                  </button>
                  <button className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    CSV Data
                  </button>
                  <button className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Share Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;