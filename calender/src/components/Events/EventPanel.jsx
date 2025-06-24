import React, { useState } from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdClose, MdEdit, MdDelete } from "react-icons/md"

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [time, meridian] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (meridian && meridian.toLowerCase() === "pm" && hours !== 12) hours += 12;
  if (meridian && meridian.toLowerCase() === "am" && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
}

const EventPanel = ({ event, onClose, eventsForDay, onPrev, onNext, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

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

  // Handle delete with confirmation and show previous/next/close
  const handleDeleteConfirmed = () => {
    setShowConfirm(false);
    if (onDelete) onDelete(event, currentIdx);

    // After deletion, show previous event if exists, else next, else close
    setTimeout(() => {
      if (sortedEvents.length > 1) {
        if (currentIdx > 0) {
          // Show previous event
          onPrev();
        } else if (currentIdx === 0 && sortedEvents.length > 1) {
          // Show next event
          onNext();
        }
      } else {
        // No events left, close panel
        onClose();
      }
    }, 0);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-40 z-50" onClick={onClose} />
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white border border-blue-100 rounded-xl shadow-xl p-6 w-full max-w-md">
        {/* Close (cross) icon */}
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <MdClose size={22} />
        </button>
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
        <div className="flex gap-2 mt-4">
          <button
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-medium"
            onClick={() => onEdit && onEdit(event, currentIdx)}
          >
            <MdEdit size={16} /> Edit
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium"
            onClick={() => setShowConfirm(true)}
          >
            <MdDelete size={16} /> Delete
          </button>
        </div>
        {/* Confirm Delete Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 max-w-xs w-full">
              <div className="mb-4 text-center text-gray-800 font-semibold">Delete this event?</div>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteConfirmed}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default EventPanel