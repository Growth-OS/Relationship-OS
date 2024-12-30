import React from "react";

export const SidebarLogo = () => {
  return (
    <div className="flex items-center justify-between mb-8 px-2">
      <h1 className="text-xl font-bold text-black">Relationship OS</h1>
      <img 
        src="/lovable-uploads/e379ed5f-5e79-4d2c-875f-811689e17b3c.png" 
        alt="The Relationship of Sales"
        className="h-10 w-auto" // Increased height from h-8 to h-10
      />
    </div>
  );
};