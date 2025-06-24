import React, { useState } from "react"
import { MdEvent, MdEdit, MdDelete } from "react-icons/md"

const EventsForDay = ({ events, selectedDate, setSelectedEvent, onAddEvent, onEditEvent, onDeleteEvent }) => {
  const [confirmIdx, setConfirmIdx] = useState(null)
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
            <button
              className="p-1 hover:bg-gray-200 rounded"
              title="Edit"
              onClick={e => {
                e.stopPropagation();
                onEditEvent && onEditEvent({ ...ev, date: selectedDate }, i);
              }}
            >
              <MdEdit size={16} className="text-blue-500" />
            </button>
            {confirmIdx === i ? (
              <>
                <span className="text-xs text-red-600 ml-2">Confirm?</span>
                <button
                  className="p-1 hover:bg-gray-200 rounded text-xs text-red-600"
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteEvent && onDeleteEvent({ ...ev, date: selectedDate }, i);
                    setConfirmIdx(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="p-1 hover:bg-gray-200 rounded text-xs"
                  onClick={e => {
                    e.stopPropagation();
                    setConfirmIdx(null);
                  }}
                >
                  No
                </button>
              </>
            ) : (
              <button
                className="p-1 hover:bg-gray-200 rounded"
                title="Delete"
                onClick={e => {
                  e.stopPropagation();
                  setConfirmIdx(i);
                }}
              >
                <MdDelete size={16} className="text-red-500" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventsForDay