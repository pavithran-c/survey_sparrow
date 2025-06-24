import React from "react"

const EventsForDay = ({ events, selectedDate }) => {
  const dayEvents = events[selectedDate] || []
  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Events for {selectedDate || "..."}</h3>
      <ul className="space-y-2">
        {dayEvents.length === 0 ? (
          <li className="text-gray-400 text-sm">No events for this day.</li>
        ) : (
          dayEvents.map((ev, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: ev.color }} />
              <span className="font-medium">{ev.title}</span>
              <span className="text-xs text-gray-500 ml-auto">{ev.time}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default EventsForDay