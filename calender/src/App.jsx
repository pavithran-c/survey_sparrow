import React, { useState } from "react";
import Calendar from "./components/Calender/Calender";
import AnalogClock from "./components/Clock/AnalogClock";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-4">
        {activeTab === "calendar" && <Calendar />}
        {activeTab === "clock" && <AnalogClock />}
      </div>
    </div>
  );
};

export default App;