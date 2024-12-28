import React from "react";

const Calendar = () => {
  return (
    <div className="h-[calc(100vh-2rem)] w-full">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=patrick%40relationshipofsales.com&ctz=Europe%2FVilnius"
        className="w-full h-full"
        style={{ border: 0 }}
        scrolling="no"
      />
    </div>
  );
};

export default Calendar;