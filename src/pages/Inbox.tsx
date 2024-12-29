import { useEffect } from "react";

const Inbox = () => {
  useEffect(() => {
    window.location.href = "https://mail.superhuman.com/";
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-2rem)] w-full animate-fade-in">
      <p className="text-gray-500">Redirecting to Superhuman...</p>
    </div>
  );
};

export default Inbox;