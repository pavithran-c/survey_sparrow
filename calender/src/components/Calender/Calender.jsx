"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md"
import UpcomingEvents from "../Events/UpcomingEvents"
import EventsForDay from "../Events/EventsForDay"
import CalendarGrid from "./CalendarGrid"
import EventPanel from "../Events/EventPanel"
import ReactDOM from "react-dom"
import initialEvents from "../../data/events.json";
import AddEvent from "../Events/AddEvent";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Returns an array of objects: { day, monthOffset }
// monthOffset: 0 = current, -1 = prev, 1 = next
function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const grid = []

  // Previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({ day: daysInPrevMonth - i, monthOffset: -1 })
  }
  // Current month's days
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push({ day: d, monthOffset: 0 })
  }
  // Next month's days to fill the grid (up to 35 cells, i.e., 5 rows)
  while (grid.length < 35) {
    grid.push({ day: grid.length - (daysInMonth + firstDay) + 1, monthOffset: 1 })
  }
  return grid
}

const Calendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearInput, setYearInput] = useState(year);
  // Set selectedDate to today's date string on initial load
  const [selectedDate, setSelectedDate] = useState(() => {
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : initialEvents;
  });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  const gridRef = useRef(null)
  const monthPickerRef = useRef(null)
  const yearPickerRef = useRef(null)
  const monthBtnRef = useRef(null)
  const yearBtnRef = useRef(null)
  const calendarRef = useRef(null)

  // Example events data
  const eventsData = {
    "2025-06-23": [
      { title: "Team Meeting", time: "07:30 PM", description: "Discuss project milestones and assign new tasks.", color: "#3b82f6" },
      { title: "Lunch with Alex", time: "1:00 PM", description: "Catch up with Alex at the downtown cafe.", color: "#f59e42" },
      { title: "Team Meeting", time: "07:30 PM", description: "Discuss project milestones and assign new tasks.", color: "#3b82f6" },
    ],
    "2025-06-24": [
      { title: "Doctor Appointment", time: "9:00 AM", description: "Annual health checkup at City Clinic.", color: "#10b981" }
    ]
  }

  // Get all events for the selected day
  const eventsForDay = selectedEvent
    ? (eventsData[selectedEvent.date] || [])
    : [];

  const days = getMonthGrid(year, month)

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.02, duration: 0.3, ease: "power2.out" }
      )
    }
  }, [month, year])

  // Animate month picker open/close
  useEffect(() => {
    if (showMonthPicker && monthPickerRef.current) {
      gsap.fromTo(
        monthPickerRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
      )
    }
  }, [showMonthPicker])

  const closeMonthPicker = () => {
    if (monthPickerRef.current) {
      gsap.to(monthPickerRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => setShowMonthPicker(false),
      })
    } else {
      setShowMonthPicker(false)
    }
  }

  // Animate year picker open/close
  useEffect(() => {
    if (showYearPicker && yearPickerRef.current) {
      gsap.fromTo(
        yearPickerRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
      )
    }
  }, [showYearPicker])

  const closeYearPicker = () => {
    if (yearPickerRef.current) {
      gsap.to(yearPickerRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => setShowYearPicker(false),
      })
    } else {
      setShowYearPicker(false)
    }
  }

  const handlePrevMonth = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1))
    if (month === 0) setYear((y) => y - 1)
  }

  const handleNextMonth = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1))
    if (month === 11) setYear((y) => y + 1)
  }

  const handlePrevYear = () => setYear((y) => y - 1)
  const handleNextYear = () => setYear((y) => y + 1)

  const handleMonthClick = () => setShowMonthPicker(true)

  const handleMonthSelect = (idx) => {
    console.log("Selecting month:", idx) // Debug log
    setMonth(idx)
    closeMonthPicker()
  }

  const minYear = 1901
  const maxYear = 2100
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).filter(y => y >= Math.max(year - 10, minYear) && y <= Math.min(year + 10, maxYear))

  const handleYearClick = () => {
    setShowYearPicker(true)
    setYearInput(year)
  }

  const handleYearSelect = (y) => {
    console.log("Selecting year:", y) // Debug log
    let selectedYear = Math.max(minYear, Math.min(maxYear, y))
    setYear(selectedYear)
    closeYearPicker()
  }

  const handleYearInputChange = (e) => setYearInput(e.target.value.replace(/\D/, ""))
  const handleYearInputKeyDown = (e) => {
    if (e.key === "Enter" && yearInput) {
      let inputYear = Number(yearInput)
      inputYear = Math.max(minYear, Math.min(maxYear, inputYear))
      setYear(inputYear)
      closeYearPicker()
    }
  }

  const handleDateClick = (day, monthOffset) => {
    let newMonth = month;
    let newYear = year;

    if (monthOffset === -1) {
      // Previous month
      newMonth = month === 0 ? 11 : month - 1;
      newYear = month === 0 ? year - 1 : year;
    } else if (monthOffset === 1) {
      // Next month
      newMonth = month === 11 ? 0 : month + 1;
      newYear = month === 11 ? year + 1 : year;
    }

    // Always update month/year if needed
    setMonth(newMonth);
    setYear(newYear);

    // Set the selected date (for the new month/year)
    const dateStr = `${newYear}-${String(newMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  }

  const handleMonthHover = () => {
    if (monthBtnRef.current) gsap.to(monthBtnRef.current, { scale: 1.08, backgroundColor: "#e0edff", duration: 0.1, ease: "power2.out" })
  }
  const handleMonthUnhover = () => {
    if (monthBtnRef.current) gsap.to(monthBtnRef.current, { scale: 1, backgroundColor: "#fff", duration: 0.1, ease: "power2.in" })
  }
  const handleYearHover = () => {
    if (yearBtnRef.current) gsap.to(yearBtnRef.current, { scale: 1.08, backgroundColor: "#e0edff", duration: 0.1, ease: "power2.out" })
  }
  const handleYearUnhover = () => {
    if (yearBtnRef.current) gsap.to(yearBtnRef.current, { scale: 1, backgroundColor: "#fff", duration: 0.1, ease: "power2.in" })
  }

  // Navigation handlers
  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [time, meridian] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian && meridian.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (meridian && meridian.toLowerCase() === "am" && hours === 12) hours = 0;
    return hours * 60 + (minutes || 0);
  }

  const handlePrevEvent = () => {
    if (!selectedEvent) return;
    const dayEvents = (events[selectedEvent.date] || []).slice().sort((a, b) =>
      parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
    );
    const idx = dayEvents.findIndex(ev =>
      ev.title === selectedEvent.title &&
      ev.time === selectedEvent.time &&
      ev.color === selectedEvent.color
    );
    if (idx > 0) {
      setSelectedEvent({ ...dayEvents[idx - 1], date: selectedEvent.date });
    }
  };

  const handleNextEvent = () => {
    if (!selectedEvent) return;
    const dayEvents = (events[selectedEvent.date] || []).slice().sort((a, b) =>
      parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
    );
    const idx = dayEvents.findIndex(ev =>
      ev.title === selectedEvent.title &&
      ev.time === selectedEvent.time &&
      ev.color === selectedEvent.color
    );
    if (idx < dayEvents.length - 1) {
      setSelectedEvent({ ...dayEvents[idx + 1], date: selectedEvent.date });
    }
  };

  const handleAddEvent = (event) => {
    setEvents(prev => {
      const dateEvents = prev[event.date] ? [...prev[event.date]] : [];
      if (typeof event.editIndex === "number" && event.editIndex >= 0) {
        // Edit existing event
        dateEvents[event.editIndex] = {
          title: event.title,
          color: event.color,
          time: event.time,
          endTime: event.endTime,
          description: event.description,
        };
      } else {
        // Add new event
        dateEvents.push({
          title: event.title,
          color: event.color,
          time: event.time,
          endTime: event.endTime,
          description: event.description,
        });
      }
      return { ...prev, [event.date]: dateEvents };
    });
    setShowAddEvent(false);
    setEventToEdit(null);
  };

  const handleEditEvent = (event, idx) => {
    setEventToEdit({ ...event, editIndex: idx });
    setShowAddEvent(true);
  };

  const handleDeleteEvent = (event, idx) => {
    setEvents(prev => {
      const dateEvents = prev[event.date] ? [...prev[event.date]] : [];
      dateEvents.splice(idx, 1); // Remove the event at idx
      const updated = { ...prev, [event.date]: dateEvents };
      localStorage.setItem("events", JSON.stringify(updated)); // Persist to localStorage
      return updated;
    });
  };

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-full mx-auto">
      <div className={`flex flex-col lg:flex-row w-full min-h-[500px] relative overflow-visible transition-all duration-300 ${selectedEvent ? "filter pointer-events-none" : ""}`}>
        {/* Calendar Panel */}
        <div className="flex-1 flex flex-col z-10 overflow-x-auto order-1 lg:order-none">
          <div
            ref={calendarRef}
            className="flex justify-center w-full"
            style={{ minWidth: 0 }}
          >
            <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl" style={{ minWidth: 0 }}>
              <CalendarGrid
                year={year}
                month={month}
                days={days}
                today={today}
                selectedDate={selectedDate}
                events={events}
                handlePrevYear={handlePrevYear}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                handleNextYear={handleNextYear}
                handleMonthClick={handleMonthClick}
                handleYearClick={handleYearClick}
                showMonthPicker={showMonthPicker}
                showYearPicker={showYearPicker}
                monthBtnRef={monthBtnRef}
                yearBtnRef={yearBtnRef}
                monthPickerRef={monthPickerRef}
                yearPickerRef={yearPickerRef}
                handleMonthHover={handleMonthHover}
                handleMonthUnhover={handleMonthUnhover}
                handleYearHover={handleYearHover}
                handleYearUnhover={handleYearUnhover}
                closeMonthPicker={closeMonthPicker}
                closeYearPicker={closeYearPicker}
                monthNames={monthNames}
                years={years}
                minYear={minYear}
                maxYear={maxYear}
                yearInput={yearInput}
                setYearInput={setYearInput}
                setYear={setYear}
                handleMonthSelect={handleMonthSelect}
                handleYearSelect={handleYearSelect}
                handleDateClick={handleDateClick}
                gridRef={gridRef}
                setSelectedEvent={setSelectedEvent}
              />
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-full lg:w-[260px] min-w-0 max-w-full lg:min-w-[200px] lg:max-w-[300px] p-2 sm:p-4 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 m-0 z-10 order-2 lg:order-none relative overflow-visible">
          {/* Moving line and circle head */}
          <span className="moving-circle pointer-events-none z-20">
            <span className="circle-line"></span>
            <span className="circle-head"></span>
          </span>
          <div className="mb-4 bg-white rounded-xl shadow-md border border-gray-200 p-3 relative z-30">
            <UpcomingEvents events={events} setSelectedEvent={setSelectedEvent} />
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 relative z-30">
            <EventsForDay
              events={events}
              selectedDate={selectedDate}
              setSelectedEvent={setSelectedEvent}
              onAddEvent={() => { setShowAddEvent(true); setEventToEdit(null); }}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>
      {/* Overlay for pickers */}
      {(showMonthPicker || showYearPicker) && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={(e) => {
            e.stopPropagation();
            if (showMonthPicker) closeMonthPicker();
            if (showYearPicker) closeYearPicker();
          }}
        />
      )}
      {/* Month Picker Portal */}
      {showMonthPicker &&
        ReactDOM.createPortal(  
          <div
            ref={monthPickerRef}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
            style={{ width: "20rem", maxWidth: "95vw" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-3 w-full">
              {monthNames.map((m, idx) => (
                <button
                  key={m}
                  onClick={() => handleMonthSelect(idx)}
                  className={`block w-full text-center px-2 py-3 rounded-lg transition-all duration-200 text-base font-medium
                    ${idx === month
                      ? "bg-blue-500 text-white shadow hover:bg-blue-600 hover:shadow-md"
                      : "text-gray-900 hover:bg-blue-200 hover:shadow-sm"}`}
                  style={{ minHeight: "2.5rem" }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )
      }

      {/* Year Picker Portal */}
      {showYearPicker &&
        ReactDOM.createPortal(
          <div
            ref={yearPickerRef}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-48 sm:w-64"
            onClick={e => e.stopPropagation()}
          >
            <input
              type="text"
              value={yearInput}
              onChange={e => setYearInput(e.target.value.replace(/\D/, ""))}
              onKeyDown={handleYearInputKeyDown}
              className="w-full mb-2 px-2 py-1 border rounded focus:outline-none focus:ring"
              placeholder="Type year"
              maxLength={4}
              inputMode="numeric"
              min={minYear}
              max={maxYear}
            />
            <div className="max-h-48 overflow-y-auto grid grid-cols-2 gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => handleYearSelect(y)}
                  className={`block w-full text-center px-2 py-2 rounded-lg transition text-base font-medium
                    ${y === year
                      ? "bg-blue-500 text-white shadow"
                      : "hover:bg-blue-100"}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )
      }
      {/* EventPanel overlay (not blurred) */}
      {selectedEvent && (
        <EventPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          eventsForDay={events[selectedEvent?.date] || []}
          onPrev={handlePrevEvent}
          onNext={handleNextEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
      {showAddEvent && (
        <AddEvent
          selectedDate={selectedDate}
          onSave={handleAddEvent}
          onCancel={() => { setShowAddEvent(false); setEventToEdit(null); }}
          eventToEdit={eventToEdit}
        />
      )}
    </div>
  )
}

export default Calendar
