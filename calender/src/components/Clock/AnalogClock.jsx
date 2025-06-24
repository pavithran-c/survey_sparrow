import React, { useState, useEffect } from "react";

const AnalogClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours() % 12;
  const minute = currentTime.getMinutes();
  const second = currentTime.getSeconds();

  // Calculate hand angles
  const hourAngle = (hour + minute / 60) * 30; // 360/12 = 30deg per hour
  const minuteAngle = minute * 6; // 360/60 = 6deg per minute
  const secondAngle = second * 6;

  return (
    <div className="analog-clock-container">
      <style>{`
        .analog-clock-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #e0f7fa, #e5e7eb);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 300px;
          margin: 0 auto;
        }

        .analog-clock-svg {
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
        }

        .digital-display {
          margin-top: 16px;
          width: 100%;
          background: #ffffff;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-family: 'Arial', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .hour-hand, .minute-hand, .second-hand {
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));
        }
      `}</style>
      <svg
        width="250"
        height="250"
        viewBox="0 0 200 200"
        className="analog-clock-svg"
      >
        {/* Clock face with gradient */}
        <defs>
          <linearGradient id="clockFaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e5e7eb', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle
          cx={100}
          cy={100}
          r={95}
          fill="url(#clockFaceGradient)"
          stroke="#1f2937"
          strokeWidth={3}
        />
        {/* Hour and minute marks */}
        {[...Array(60)].map((_, i) => {
          const isMajorMark = i % 5 === 0;
          const angle = (i / 60) * 2 * Math.PI;
          const length = isMajorMark ? 10 : 5;
          const x1 = 100 + 85 * Math.sin(angle);
          const y1 = 100 - 85 * Math.cos(angle);
          const x2 = 100 + (85 - length) * Math.sin(angle);
          const y2 = 100 - (85 - length) * Math.cos(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMajorMark ? "#1f2937" : "#6b7280"}
              strokeWidth={isMajorMark ? 3 : 1}
            />
          );
        })}
        {/* Hour numbers for 12, 3, 6, 9 */}
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * 2 * Math.PI;
          const x = 100 + 70 * Math.sin(angle);
          const y = 100 - 70 * Math.cos(angle);
          const number = i === 0 ? 12 : i * 3;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={16}
              fill="#1f2937"
              style={{ fontWeight: "600", fontFamily: "Arial, sans-serif" }}
            >
              {number}
            </text>
          );
        })}
        {/* Hour hand */}
        <line
          x1={100}
          y1={100}
          x2={100 + 50 * Math.sin((Math.PI / 180) * hourAngle)}
          y2={100 - 50 * Math.cos((Math.PI / 180) * hourAngle)}
          stroke="#1f2937"
          strokeWidth={6}
          strokeLinecap="round"
          className="hour-hand"
        />
        {/* Minute hand */}
        <line
          x1={100}
          y1={100}
          x2={100 + 70 * Math.sin((Math.PI / 180) * minuteAngle)}
          y2={100 - 70 * Math.cos((Math.PI / 180) * minuteAngle)}
          stroke="#2563eb"
          strokeWidth={4}
          strokeLinecap="round"
          className="minute-hand"
        />
        {/* Second hand */}
        <line
          x1={100}
          y1={100}
          x2={100 + 80 * Math.sin((Math.PI / 180) * secondAngle)}
          y2={100 - 80 * Math.cos((Math.PI / 180) * secondAngle)}
          stroke="#ef4444"
          strokeWidth={2}
          strokeLinecap="round"
          className="second-hand"
        />
        {/* Center dot */}
        <circle cx={100} cy={100} r={6} fill="#2563eb" />
      </svg>
      <div className="digital-display">
        {currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  );
};

export default AnalogClock;