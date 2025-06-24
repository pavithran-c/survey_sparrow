import React, { useState, useMemo } from "react";

const AllEventsList = ({ events }) => {
  const [search, setSearch] = useState("");

  // Flatten events: [{date, ...event}]
  const allEvents = useMemo(() =>
    Object.entries(events)
      .flatMap(([date, evs]) =>
        evs.map(ev => ({ ...ev, date }))
      ), [events]
  );

  // Filter by search (title, description, date)
  const filtered = allEvents.filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    (ev.description && ev.description.toLowerCase().includes(search.toLowerCase())) ||
    ev.date.includes(search)
  );

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search events by title, description, or date..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        {filtered.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No events found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((ev, idx) => (
              <li
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
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
                    <span className="text-xs text-blue-600">{ev.time}</span>
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
    </div>
  );
};

export default AllEventsList;