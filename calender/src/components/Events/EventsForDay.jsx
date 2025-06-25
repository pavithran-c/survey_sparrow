import React, { useState } from "react"
import { MdEvent } from "react-icons/md"

const EventsForDay = ({ events, selectedDate, setSelectedEvent, onAddEvent }) => {
  const dayEvents = events[selectedDate] || []

  if (!selectedDate) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-base">Events for {selectedDate}</h3>
        <button
          className="flex items-center gap-1 text-xs px-2 py-1 bg-black text-white rounded hover:bg-gray-700 transition"
          onClick={onAddEvent}
        >
          <MdEvent size={18} className="text-white" />
        </button>
      </div>
      <ul className="space-y-2">
        {dayEvents.length === 0 && (
          <li className="text-gray-400 text-sm">No events for this day.</li>
        )}
        {dayEvents.map((ev, i) => (
          <li
            key={i}
            className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1"
            onClick={() => setSelectedEvent && setSelectedEvent({ ...ev, date: selectedDate })}
          >
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: ev.color }} />
            <span className="font-medium flex-1 truncate">{ev.title}</span>
            <span className="text-xs text-gray-500 ml-2">{ev.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventsForDay