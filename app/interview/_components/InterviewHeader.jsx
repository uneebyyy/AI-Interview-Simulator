import Image from "next/image";
import React from "react";

function InterviewHeader() {
  return (
    <div className="w-full px-2  border-b border-gray-200 bg-white shadow-md">
      <Image
        src="/logo.png"
        alt="logo"
        width={80}
        height={40}
        className="object-contain"
      />
    </div>
  );
}

export default InterviewHeader;