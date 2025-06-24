import React from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [time, meridian] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (meridian && meridian.toLowerCase() === "pm" && hours !== 12) hours += 12;
  if (meridian && meridian.toLowerCase() === "am" && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
}

const EventPanel = ({ event, onClose, eventsForDay, onPrev, onNext }) => {
  if (!event) return null

  // Sort events for the day by time
  const sortedEvents = (eventsForDay || []).slice().sort((a, b) =>
    parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
  );

  // Find current event index for navigation
  const currentIdx = sortedEvents.findIndex(ev =>
    ev.title === event.title &&
    ev.time === event.time &&
    ev.color === event.color
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-40 z-50" onClick={onClose} />
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white border border-blue-100 rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center gap-2 mb-2">
          {/* Prev Arrow */}
          {sortedEvents.length > 1 && (
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={onPrev}
              disabled={currentIdx === 0}
              aria-label="Previous Event"
            >
              <MdKeyboardArrowLeft size={22} />
            </button>
          )}
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: event.color }} />
          <span className="font-bold text-lg">{event.title}</span>
          {event.time && <span className="ml-auto text-sm text-gray-500">{event.time}</span>}
          {/* Next Arrow */}
          {sortedEvents.length > 1 && (
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={onNext}
              disabled={currentIdx === sortedEvents.length - 1}
              aria-label="Next Event"
            >
              <MdKeyboardArrowRight size={22} />
            </button>
          )}
        </div>
        <div className="text-sm text-gray-700 mb-1">{event.date}</div>
        {event.description && (
          <div className="text-gray-600">{event.description}</div>
        )}
        <button
          className="mt-4 text-xs text-blue-500 hover:underline"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </>
  )
}

export default EventPanel