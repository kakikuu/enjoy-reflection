"use client";
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <SignIn redirectUrl={"/"} />
    </div>
  );
}
