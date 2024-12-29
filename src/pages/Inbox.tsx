const Inbox = () => {
  return (
    <div className="h-[calc(100vh-2rem)] w-full animate-fade-in">
      <iframe 
        src="https://mail.superhuman.com/"
        className="w-full h-full border-none"
        title="Superhuman Inbox"
      />
    </div>
  );
};

export default Inbox;