import React, { useRef } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({
  year, month, days, today, selectedDate,
  handlePrevYear, handlePrevMonth, handleNextMonth, handleNextYear,
  handleMonthClick, handleYearClick,
  showMonthPicker, showYearPicker,
  monthBtnRef, yearBtnRef, monthPickerRef, yearPickerRef,
  handleMonthHover, handleMonthUnhover, handleYearHover, handleYearUnhover,
  closeMonthPicker, closeYearPicker,
  monthNames, years, minYear, maxYear, yearInput, setYearInput, setYear,
  events,
  handleDateClick, gridRef, handleMonthSelect, handleYearSelect,
  setSelectedEvent
}) => {
  const eventsPerPage = 3;
  const pageRefs = useRef({});

  return (
    <div className="flex flex-col w-full px-2">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <button onClick={handlePrevYear} className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm" aria-label="Previous Year">
            <MdKeyboardDoubleArrowLeft size={22} />
          </button>
          <button onClick={handlePrevMonth} className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm" aria-label="Previous Month">
            <MdKeyboardArrowLeft size={22} />
          </button>
        </div>

        <span className="text-lg sm:text-xl font-bold relative flex flex-col items-center sm:flex-row sm:gap-2">
          <button
            ref={monthBtnRef}
            onClick={handleMonthClick}
            onMouseEnter={handleMonthHover}
            onMouseLeave={handleMonthUnhover}
            className="focus:outline-none px-2 py-1 rounded transition bg-white"
          >
            {monthNames[month]}
          </button>
          <button
            ref={yearBtnRef}
            onClick={handleYearClick}
            onMouseEnter={handleYearHover}
            onMouseLeave={handleYearUnhover}
            className="focus:outline-none px-2 py-1 rounded transition bg-white"
          >
            {year}
          </button>
        </span>

        <div className="flex items-center gap-2">
          <button onClick={handleNextMonth} className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm" aria-label="Next Month">
            <MdKeyboardArrowRight size={22} />
          </button>
          <button onClick={handleNextYear} className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm" aria-label="Next Year">
            <MdKeyboardDoubleArrowRight size={22} />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 text-xs sm:text-base">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2" ref={gridRef}>
        {days.map(({ day, monthOffset }, idx) => {
          const now = new Date();
          const isToday =
            monthOffset === 0 &&
            day === now.getDate() &&
            month === now.getMonth() &&
            year === now.getFullYear();

          const cellMonth = month + monthOffset;
          const cellYear = cellMonth < 0 ? year - 1 : cellMonth > 11 ? year + 1 : year;
          const realMonth = (cellMonth + 12) % 12;
          const cellDateStr = `${cellYear}-${String(realMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = events[cellDateStr] || [];

          function parseTimeToMinutes(timeStr) {
            if (!timeStr) return 0;
            const [time, meridian] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (meridian?.toLowerCase() === "pm" && hours !== 12) hours += 12;
            if (meridian?.toLowerCase() === "am" && hours === 12) hours = 0;
            return hours * 60 + (minutes || 0);
          }

          let sortedDayEvents = dayEvents.slice().sort((a, b) =>
            parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
          );

          if (isToday && sortedDayEvents.length > 0) {
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const currentIdx = sortedDayEvents.findIndex(ev => {
              const evMinutes = parseTimeToMinutes(ev.time);
              return Math.abs(evMinutes - nowMinutes) <= 30;
            });
            if (currentIdx > 0) {
              const [currentEvent] = sortedDayEvents.splice(currentIdx, 1);
              sortedDayEvents.unshift(currentEvent);
            }
          }

          const totalPages = Math.ceil(sortedDayEvents.length / eventsPerPage);
          if (pageRefs.current[cellDateStr] === undefined) pageRefs.current[cellDateStr] = 0;
          const page = pageRefs.current[cellDateStr];
          const visibleEvents = sortedDayEvents.slice(page * eventsPerPage, (page + 1) * eventsPerPage);

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(day, monthOffset)}
              className={`relative min-h-[4rem] sm:min-h-[5rem] w-full flex flex-col items-start justify-start cursor-pointer transition-all duration-200 p-1 sm:p-2
                ${monthOffset === 0
                  ? "bg-white text-gray-800 hover:bg-blue-100 rounded-xl transform hover:scale-[1.02]"
                  : "bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200"
                }
                ${selectedDate === cellDateStr
                  ? "ring-2 ring-blue-400"
                  : ""
                }
              `}
              style={{ minWidth: 0, wordBreak: "break-word" }}
            >
              <span
                className={`font-semibold inline-flex items-center justify-center mb-1 text-xs sm:text-sm
                  ${isToday ? "rounded-full bg-blue-500 text-white w-6 h-6 sm:w-7 sm:h-7" : ""}
                `}
              >
                {day}
              </span>

              {/* Events list */}
              {sortedDayEvents.length > 0 && (
                <div
                  className="mt-1 w-full overflow-y-auto no-scrollbar"
                  style={{ maxHeight: "4.5rem" }}
                >
                  <style>{`
                    .no-scrollbar {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                    .no-scrollbar::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <ul className="space-y-1">
                    {visibleEvents.map((ev, i) => (
                      <li
                        key={i}
                        className="flex flex-col items-start text-[10px] sm:text-sm rounded px-1 py-0.5 cursor-pointer"
                        style={{ background: ev.color ? `${ev.color}22` : "#e0edff" }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedEvent && setSelectedEvent({ ...ev, date: cellDateStr });
                        }}
                      >
                        {/* Title fills the box, no overflow */}
                        <span className="w-full truncate max-w-full">
                          <span className="block sm:hidden">{ev.title?.split(" ")[0]}</span>
                          <span className="hidden sm:block">{ev.title}</span>
                        </span>
                        {ev.time && (
                          <span className="text-[9px] text-gray-500">{ev.time}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
