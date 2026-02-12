import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-7xl gap-6">
      <p>No Items To Explore</p>

      <Link href="/dashboard">
        <Button variant="white">Go to Dashboard</Button>
      </Link>
    </div>
  );
}

export default Page;
