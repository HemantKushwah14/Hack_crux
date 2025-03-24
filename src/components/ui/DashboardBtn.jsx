"use client";

import { Link } from "react-router-dom"; 
import { Button } from "./button";
import { SparklesIcon } from "lucide-react";


function DashboardBtn() {


  return (
    <Link to="/dashboard">
      <Button className="gap-2 font-medium" size="sm">
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}

export default DashboardBtn;
