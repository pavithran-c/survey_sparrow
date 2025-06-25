import React, { useState, useMemo } from "react";
import EventPanel from "../Events/EventPanel";

const SEARCH_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Title", value: "title" },
  { label: "Description", value: "description" },
  { label: "Date", value: "date" },
];

const AllEventsList = ({ events }) => {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Flatten events: [{date, ...event}]
  const allEvents = useMemo(() =>
    Object.entries(events)
      .flatMap(([date, evs]) =>
        evs.map(ev => ({ ...ev, date }))
      ), [events]
  );

  // Filter by search type
  const filtered = allEvents.filter(ev => {
    const s = search.toLowerCase();
    if (!s) return true;
    if (searchType === "title") return ev.title.toLowerCase().includes(s);
    if (searchType === "description") return (ev.description || "").toLowerCase().includes(s);
    if (searchType === "date") return ev.date.includes(s);
    // all
    return (
      ev.title.toLowerCase().includes(s) ||
      (ev.description && ev.description.toLowerCase().includes(s)) ||
      ev.date.includes(s)
    );
  });

  // Find all events for the selected event's date (for navigation in EventPanel)
  const eventsForDay = selectedEvent ? allEvents.filter(ev => ev.date === selectedEvent.date) : [];

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center relative">
        <div className="relative w-full sm:w-auto flex-1">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-gradient-to-r from-purple-50 to-green-50 transition-all duration-200"
            placeholder={`Search events by ${searchType === 'all' ? 'title, description, or date' : searchType}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ boxShadow: '0 2px 8px 0 rgba(124,110,230,0.08)' }}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
        </div>
        <select
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white shadow-sm transition-all duration-200 hover:bg-purple-50"
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
        >
          {SEARCH_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        {filtered.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No events found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((ev, idx) => (
              <li
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 cursor-pointer hover:bg-purple-50 rounded transition-all duration-150"
                onClick={() => setSelectedEvent(ev)}
              >
                {/* Date on the left */}
                <div className="sm:w-28 w-full text-xs text-gray-500 sm:text-right sm:pr-4">
                  {ev.date}
                </div>
                {/* Event details on the right */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: ev.color }}
                  />
                  <span className="font-semibold text-gray-800">{ev.title}</span>
                  {ev.time && (
                    <span className="text-xs text-purple-600">{ev.time}</span>
                  )}
                  {ev.description && (
                    <span className="text-xs text-gray-500">{ev.description}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedEvent && (
        <EventPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          eventsForDay={eventsForDay}
        />
      )}
    </div>
  );
};

export default AllEventsList;