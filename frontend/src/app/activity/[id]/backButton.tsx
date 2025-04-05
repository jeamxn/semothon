"use client";

import { useRouter } from "next/navigation";
import React from "react";

const BackButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      {children}
    </button>
  );
};

export default BackButton;
