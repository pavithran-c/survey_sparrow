"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md"

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
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [yearInput, setYearInput] = useState(year)
  const gridRef = useRef(null)
  const monthPickerRef = useRef(null)
  const yearPickerRef = useRef(null)
  const monthBtnRef = useRef(null)
  const yearBtnRef = useRef(null)

  const days = getMonthGrid(year, month)

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.02, duration: 0.3, ease: "power2.out" },
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
    setMonth((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1)
        return 11
      }
      return prev - 1
    })
  }

  const handleNextMonth = () => {
    setMonth((prev) => {
      if (prev === 11) {
        setYear((y) => y + 1)
        return 0
      }
      return prev + 1
    })
  }

  const handlePrevYear = () => setYear((y) => y - 1)
  const handleNextYear = () => setYear((y) => y + 1)

  const handleMonthClick = () => setShowMonthPicker(true)

  const handleMonthSelect = (idx) => {
    setMonth(idx)
    closeMonthPicker()
  }

  // Year picker logic
  const minYear = 1901
  const maxYear = 2100
  const years = []
  const startYear = Math.max(year - 10, minYear)
  const endYear = Math.min(year + 10, maxYear)
  for (let i = startYear; i <= endYear; i++) years.push(i)

  const handleYearClick = () => {
    setShowYearPicker(true)
    setYearInput(year)
  }
  const handleYearSelect = (y) => {
    let selectedYear = y
    if (selectedYear < minYear) selectedYear = minYear
    if (selectedYear > maxYear) selectedYear = maxYear
    setYear(selectedYear)
    closeYearPicker()
  }
  const handleYearInputChange = (e) => {
    setYearInput(e.target.value.replace(/\D/, ""))
  }
  const handleYearInputKeyDown = (e) => {
    if (e.key === "Enter" && yearInput) {
      let inputYear = Number(yearInput)
      if (inputYear < minYear) inputYear = minYear
      if (inputYear > maxYear) inputYear = maxYear
      setYear(inputYear)
      closeYearPicker()
    }
  }

  // GSAP hover handlers
  const handleMonthHover = () => {
    if (monthBtnRef.current) {
      gsap.to(monthBtnRef.current, { scale: 1.08, backgroundColor: "#e0edff", duration: 0.1, ease: "power2.out" })
    }
  }
  const handleMonthUnhover = () => {
    if (monthBtnRef.current) {
      gsap.to(monthBtnRef.current, { scale: 1, backgroundColor: "#fff", duration: 0.1, ease: "power2.in" })
    }
  }
  const handleYearHover = () => {
    if (yearBtnRef.current) {
      gsap.to(yearBtnRef.current, { scale: 1.08, backgroundColor: "#e0edff", duration: 0.1, ease: "power2.out" })
    }
  }
  const handleYearUnhover = () => {
    if (yearBtnRef.current) {
      gsap.to(yearBtnRef.current, { scale: 1, backgroundColor: "#fff", duration: 0.1, ease: "power2.in" })
    }
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-full md:max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevYear}
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm"
            aria-label="Previous Year"
          >
            <MdKeyboardDoubleArrowLeft size={22} />
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm"
            aria-label="Previous Month"
          >
            <MdKeyboardArrowLeft size={22} />
          </button>
        </div>
        <span className="text-lg sm:text-xl font-bold relative flex flex-col items-center">
          <button
            ref={monthBtnRef}
            onClick={handleMonthClick}
            onMouseEnter={handleMonthHover}
            onMouseLeave={handleMonthUnhover}
            className="focus:outline-none px-2 py-1 rounded transition"
            style={{ background: "#fff" }}
          >
            {monthNames[month]}
          </button>{" "}
          <button
            ref={yearBtnRef}
            onClick={handleYearClick}
            onMouseEnter={handleYearHover}
            onMouseLeave={handleYearUnhover}
            className="focus:outline-none px-2 py-1 rounded transition ml-1"
            style={{ background: "#fff" }}
          >
            {year}
          </button>
          {/* Month Picker Overlay */}
          {showMonthPicker && (
            <>
              <div
                className="fixed inset-0 bg-black opacity-50 z-10 transition-all"
                onClick={closeMonthPicker}
              />
              <div
                ref={monthPickerRef}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 grid grid-cols-3 gap-3 w-64 sm:w-100"
              >
                {monthNames.map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMonth(idx)
                      closeMonthPicker()
                    }}
                    className={`block w-full text-center px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium
                      ${idx === month
                        ? "bg-blue-500 text-white shadow hover:bg-blue-600 hover:shadow-md"
                        : "text-gray-900 hover:bg-blue-200 hover:shadow-sm"}`}
                    style={{ minHeight: "2.5rem" }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
          {/* Year Picker Overlay */}
          {showYearPicker && (
            <>
              <div
                className="fixed inset-0 bg-black opacity-50 z-30 transition-all"
                onClick={closeYearPicker}
              />
              <div
                ref={yearPickerRef}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-48 sm:w-64"
              >
                <input
                  type="text"
                  value={yearInput}
                  onChange={handleYearInputChange}
                  onKeyDown={e => {
                    if (e.key === "Enter" && yearInput) {
                      let inputYear = Number(yearInput)
                      if (inputYear < minYear) inputYear = minYear
                      if (inputYear > maxYear) inputYear = maxYear
                      setYear(inputYear)
                      closeYearPicker()
                    }
                  }}
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
                      onClick={() => {
                        let selectedYear = y
                        if (selectedYear < minYear) selectedYear = minYear
                        if (selectedYear > maxYear) selectedYear = maxYear
                        setYear(selectedYear)
                        closeYearPicker()
                      }}
                      className={`block w-full text-center px-2 py-2 rounded-lg transition text-base font-medium
                        ${y === year
                          ? "bg-blue-500 text-white shadow"
                          : "hover:bg-blue-100"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm"
            aria-label="Next Month"
          >
            <MdKeyboardArrowRight size={22} />
          </button>
          <button
            onClick={handleNextYear}
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition shadow-sm"
            aria-label="Next Year"
          >
            <MdKeyboardDoubleArrowRight size={22} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 text-xs sm:text-base">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2" ref={gridRef}>
        {days.map(({ day, monthOffset }, idx) => {
          // Highlight today only if it's in the current month
          const isToday =
            monthOffset === 0 && day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

          return (
            <div
              key={idx}
              className={`h-10 w-10 sm:h-16 sm:w-16 flex items-center justify-center cursor-pointer transition-all duration-200
                ${
                  isToday
                    ? "bg-blue-500 text-white font-bold shadow-lg rounded-full transform hover:scale-110"
                    : monthOffset === 0
                      ? "bg-white text-gray-800 hover:bg-blue-100 rounded-full transform hover:scale-105"
                      : "bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200"
                }
              `}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
