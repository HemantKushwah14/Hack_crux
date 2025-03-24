import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import CustomCursor from "./components/CustomCursor";
import DashboardPage from "./pages/DashboardPage";

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
