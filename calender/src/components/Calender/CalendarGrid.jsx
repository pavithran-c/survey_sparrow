import React, { useRef, useEffect } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { gsap } from "gsap";

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
  const navButtonRefs = useRef([]);
  const headerRef = useRef(null);

  // GSAP Animations for Header
  useEffect(() => {
    // Animate navigation buttons
    navButtonRefs.current.forEach((button, index) => {
      gsap.fromTo(
        button,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: index * 0.1,
          ease: "back.out(2)",
        }
      );
    });

    // Animate month/year selector
    gsap.fromTo(
      headerRef.current.querySelector(".month-year-selector"),
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, [month, year]);

  function scheduleReminder(event) {
    if (!("Notification" in window)) return;
    if (event.reminder === "0") return;

    // Parse event date and time
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const reminderTime = new Date(eventDateTime.getTime() - Number(event.reminder) * 60000);
    const now = new Date();

    const timeout = reminderTime.getTime() - now.getTime();
    if (timeout > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("Event Reminder", {
            body: `${event.title} at ${event.time}`,
          });
        }
      }, timeout);
    }
  }

  return (
    <div className="flex flex-col w-full px-2">
      {/* Navigation Header */}
      <div
        ref={headerRef}
        className="flex flex-row items-center justify-between mb-4 gap-1 sm:gap-2"
        style={{
          background: "linear-gradient(90deg, #edeaff 0%, #eafff6 100%)",
          borderRadius: "0.75rem",
          padding: "1rem",
          boxShadow: "0 8px 24px 0 rgba(124,110,230,0.10)",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Navigation Buttons (Prev) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            ref={el => (navButtonRefs.current[0] = el)}
            onClick={handlePrevYear}
            className="p-2 rounded-full bg-[var(--surface)] text-[var(--primary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Previous Year"
          >
            <MdKeyboardDoubleArrowLeft size={24} />
          </button>
          <button
            ref={el => (navButtonRefs.current[1] = el)}
            onClick={handlePrevMonth}
            className="p-2 rounded-full bg-[var(--surface)] text-[var(--primary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Previous Month"
          >
            <MdKeyboardArrowLeft size={24} />
          </button>
        </div>

        {/* Month/Year Selector */}
        <span className="month-year-selector flex flex-col items-center text-lg sm:text-xl font-semibold text-[var(--primary)] drop-shadow">
          <button
            ref={monthBtnRef}
            onClick={handleMonthClick}
            onMouseEnter={handleMonthHover}
            onMouseLeave={handleMonthUnhover}
            className="focus:outline-none px-3 py-1 rounded-lg bg-[var(--surface)] text-[var(--primary)] hover:bg-[var(--accent-light)] transition-all duration-200 shadow-sm hover:shadow-md mb-1"
          >
            {monthNames[month]}
          </button>
          <button
            ref={yearBtnRef}
            onClick={handleYearClick}
            onMouseEnter={handleYearHover}
            onMouseLeave={handleYearUnhover}
            className="focus:outline-none px-3 py-1 rounded-lg bg-[var(--surface)] text-[var(--primary)] hover:bg-[var(--accent-light)] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {year}
          </button>
        </span>

        {/* Navigation Buttons (Next) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            ref={el => (navButtonRefs.current[2] = el)}
            onClick={handleNextMonth}
            className="p-2 rounded-full bg-[var(--surface)] text-[var(--primary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Next Month"
          >
            <MdKeyboardArrowRight size={24} />
          </button>
          <button
            ref={el => (navButtonRefs.current[3] = el)}
            onClick={handleNextYear}
            className="p-2 rounded-full bg-[var(--surface)] text-[var(--primary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Next Year"
          >
            <MdKeyboardDoubleArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Main Calendar Box */}
      <div
        className="bg-white/90 rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 transition-all duration-300"
        style={{
          boxShadow: "0 6px 32px 0 rgba(124,110,230,0.08)",
          marginBottom: '1.5rem',
        }}
      >
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

            const visibleEvents = sortedDayEvents;

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
                          <span className="w-full truncate max-w-full">
                            <span className="block sm:hidden">{ev.title?.split (" ")[0]}</span>
                            <span className="hidden sm:block">{ev.title}</span>
                          </span>
                          {ev.time && (
                            <span className="text-[9px] text-gray-500">{ev.time}</span>
                          )}
                          {ev.reminder && ev.reminder !== "0" && (
                            <span className="text-xs text-blue-500 ml-2">
                              Reminder: {ev.reminder} min before
                            </span>
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
    </div>
  );
};

export default CalendarGrid;