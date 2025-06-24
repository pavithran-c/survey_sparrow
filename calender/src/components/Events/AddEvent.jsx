import React, { useState, useEffect } from "react"

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e42", // Orange
  "#ef4444", // Red
  "#a855f7", // Purple
  "#fbbf24", // Yellow
]

const AddEvent = ({ selectedDate, onSave, onCancel, eventToEdit }) => {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState(COLORS[0])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  // Prefill form if editing
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "")
      setColor(eventToEdit.color || COLORS[0])
      setStartTime(eventToEdit.time || "")
      setEndTime(eventToEdit.endTime || "")
      setDescription(eventToEdit.description || "")
    } else {
      setTitle("")
      setColor(COLORS[0])
      setStartTime("")
      setEndTime("")
      setDescription("")
    }
  }, [eventToEdit])

  // Helper to compare times and handle next day
  function isStartBeforeEnd(start, end) {
    if (!start || !end) return true
    // If end < start, allow as "next day"
    return true
  }

  function isNextDay(start, end) {
    if (!start || !end) return false
    return end < start
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!title || !startTime || !endTime) {
      setError("Please fill all required fields.")
      return
    }

    if (startTime === endTime) {
      setError("Start time and end time cannot be the same.")
      return
    }

    // If endTime < startTime, treat as next day, else must be after start
    if (!isStartBeforeEnd(startTime, endTime)) {
      setError("Start time must be before end time.")
      return
    }

    let eventDate = selectedDate
    let eventEndDate = selectedDate
    if (isNextDay(startTime, endTime)) {
      // Calculate next day string
      const dateObj = new Date(selectedDate)
      dateObj.setDate(dateObj.getDate() + 1)
      eventEndDate = dateObj.toISOString().slice(0, 10)
    }

    onSave({
      title,
      color,
      time: startTime,
      endTime,
      description,
      date: eventDate,
      endDate: eventEndDate,
      editIndex: eventToEdit?.editIndex, // Pass index if editing
    })
  }

  return (
    <>
      {/* Only the overlay is faded, modal stays vibrant */}
      <div className="fixed inset-0 z-40 bg-black opacity-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <form
          className="pointer-events-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-[95vw] max-w-xs sm:max-w-sm space-y-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-bold mb-2 text-center">
            {eventToEdit ? "Edit Event" : "Add Event"} for{" "}
            <span className="text-blue-600">{selectedDate}</span>
          </h2>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Event name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`w-7 h-7 rounded-full border-2 transition
                  ${color === c ? "border-blue-600 ring-2 ring-blue-300 scale-110" : "border-gray-300"}
                  shadow-md
                `}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
              {isNextDay(startTime, endTime) && (
                <span className="block text-xs text-blue-500 mt-1">Ends next day</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Event description"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {eventToEdit ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddEvent

const handleAddEvent = (event) => {
  setEvents(prev => {
    const dateEvents = prev[event.date] ? [...prev[event.date]] : [];
    if (typeof event.editIndex === "number") {
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