// import "./App.css";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Navbar from "./pages/Navbar";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
// import CustomCursor from "./components/CustomCursor";
// import DashboardPage from "./pages/DashboardPage";
// // import EmailReplies from "./pages/EmailReplies";
// import Calender from "./pages/Calender";
// import ResearchAssistant from "./pages/ResearchAssistant";
// import Summarize from "./pages/Summarize";

// function App() {
//   return (
//     <>
//       <SignedIn>
//         <CustomCursor />
//         <div className="overflow-hidden w-full min-h-screen">
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/dashboard" element={<DashboardPage />} />
//             {/* <Route path="/emailreplies" element={ <EmailReplies/>} /> */}
//             {/* <Route path="/emailreplies" element={<iframe src="/emailRep.../index.html"/>} /> */}

//             <Route path="/calender" element={ <Calender/>} />
//             <Route path="/researchassistant" element={<ResearchAssistant/> } />
//             <Route path="/summarize" element={ <Summarize/> } />
//           </Routes>
//         </div>
//       </SignedIn>
//       <SignedOut>
//         <div className="flex flex-col items-center justify-center h-screen">
//           <h1 className="text-3xl font-bold mb-4">Welcome to My App</h1>
//           <SignInButton />
//         </div>
//       </SignedOut>
//     </>
//   );
// }

// export default App;

// {/* <EmailReplies/>
//         <Calendar/>
//         <Summarize/>
//         <ResearchAssistant/> */}

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import CustomCursor from "./components/CustomCursor";
import DashboardPage from "./pages/DashboardPage";
// import EmailReplies from "./pages/EmailReplies"; // Uncommented this to include the EmailReplies component
import Calender from "./pages/Calender";
import ResearchAssistant from "./pages/ResearchAssistant";
import Summarize from "./pages/Summarize";
import EmailReplies from "./pages/EmailReplies";


function App() {
  return (
    <>
      <SignedIn>
        <CustomCursor />
        <div className="overflow-hidden w-full min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* <Route path="/emailreplies" element={<iframe src="/index.html" style={{ width: "100%", height: "100vh", border: "none" }} />} /> */}
            <Route path="/emailreplies" element={<EmailReplies/>} /> 
            <Route path="/calender" element={<Calender />} />
            <Route path="/researchassistant" element={<ResearchAssistant />} />
            <Route path="/summarize" element={<Summarize/>} />
          </Routes>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold mb-4">Welcome to My App</h1>
          <SignInButton />
        </div>
      </SignedOut>
    </>
  );
}


export default App;


