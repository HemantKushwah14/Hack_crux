"use client";

import { Link } from "react-router-dom"; // Importing Link from react-router-dom
import { ModeToggle } from "./ModeToggle";
import { CodeIcon } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"; // ✅ Added SignedOut & SignInButton
import DashboardBtn from "../components/ui/DashboardBtn";

function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* LEFT SIDE - LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-purple-500" />
          <span className="bg-gradient-to-r text-purple-500 bg-clip-text">
            Hack-Crux
          </span>
        </Link>

        {/* RIGHT SIDE - USER OR SIGN IN */}
        <div className="flex items-center space-x-4 ml-auto">
          <ModeToggle />
          <SignedIn>
            <DashboardBtn />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
