import React, { useState } from "react";
import Calendar from "./components/Calender/Calender";
import AnalogClock from "./components/Clock/AnalogClock";
import Navbar from "./components/Navbar/Navbar";
import AllEventsList from "./components/Clock/AllEventsList";
import initialEvents from "./data/events"; // Make sure the filename and export match

const App = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [events, setEvents] = useState(initialEvents); // Use initialEvents here

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-4">
        {activeTab === "calendar" && (
          <Calendar events={events} setEvents={setEvents} />
        )}
        {activeTab === "clock" && (
          <>
            <AnalogClock />
            <AllEventsList events={events} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;