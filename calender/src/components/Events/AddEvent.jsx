import React, { useState, useEffect } from "react"

const PRIORITY_COLORS = {
  High: "#ef4444",    // Red
  Medium: "#f59e42",  // Orange
  Low: "#10b981",     // Green
}

const PRIORITIES = ["High", "Medium", "Low"]

const AddEvent = ({ selectedDate, onSave, onCancel, eventToEdit }) => {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [reminder, setReminder] = useState("0") // New state for reminder

  // Prefill form if editing
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "")
      setPriority(eventToEdit.priority || "Medium")
      setStartTime(eventToEdit.time || "")
      setEndTime(eventToEdit.endTime || "")
      setDescription(eventToEdit.description || "")
      setReminder(eventToEdit?.reminder || "0"); // Prefill reminder
    } else {
      setTitle("")
      setPriority("Medium")
      setStartTime("")
      setEndTime("")
      setDescription("")
      setReminder("0")
    }
  }, [eventToEdit])

  function isStartBeforeEnd(start, end) {
    if (!start || !end) return true
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

    if (!isStartBeforeEnd(startTime, endTime)) {
      setError("Start time must be before end time.")
      return
    }

    let eventDate = selectedDate
    let eventEndDate = selectedDate
    if (isNextDay(startTime, endTime)) {
      const dateObj = new Date(selectedDate)
      dateObj.setDate(dateObj.getDate() + 1)
      eventEndDate = dateObj.toISOString().slice(0, 10)
    }

    // Assign color based on priority
    const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS["Medium"]

    onSave({
      title,
      color,
      priority,
      time: startTime,
      endTime,
      description,
      date: eventDate,
      endDate: eventEndDate,
      editIndex: eventToEdit?.editIndex,
      reminder, // Include reminder in the event data
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-40"
        onClick={onCancel}
      ></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <form
          className="pointer-events-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-[95vw] max-w-xs sm:max-w-sm space-y-4"
          onSubmit={handleSubmit}
          onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the form
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
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-gray-500">Color preview:</span>
              <span
                className="inline-block w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ background: PRIORITY_COLORS[priority] }}
              />
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
          <div>
            <label className="block text-sm font-medium mb-1">Reminder</label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={reminder}
              onChange={e => setReminder(e.target.value)}
            >
              <option value="0">No Reminder</option>
              <option value="5">5 minutes before</option>
              <option value="10">10 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
            </select>
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
    if (typeof event.editIndex === "number" && event.editIndex >= 0) {
      // Edit existing event
      dateEvents[event.editIndex] = {
        title: event.title,
        color: event.color,
        time: event.time,
        endTime: event.endTime,
        description: event.description,
        reminder: event.reminder, // Include reminder in the edited event
      };
    } else {
      // Add new event
      dateEvents.push({
        title: event.title,
        color: event.color,
        time: event.time,
        endTime: event.endTime,
        description: event.description,
        reminder: event.reminder, // Include reminder in the new event
      });
    }
    return { ...prev, [event.date]: dateEvents };
  });
  setShowAddEvent(false);
  setEventToEdit(null);
};