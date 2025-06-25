import React from "react"

const UpcomingEvents = ({ events, setSelectedEvent }) => {
  const now = new Date()
  const upcoming = Object.entries(events)
    .flatMap(([date, evs]) =>
      evs.map(ev => {
        // Parse event date and time into a Date object
        const [year, month, day] = date.split("-").map(Number)
        let [hour, minute] = [0, 0]
        if (ev.time) {
          const [t, meridian] = ev.time.split(" ")
          let [h, m] = t.split(":").map(Number)
          if (meridian && meridian.toLowerCase().includes("pm") && h < 12) h += 12
          if (meridian && meridian.toLowerCase().includes("am") && h === 12) h = 0
          hour = h
          minute = m
        }
        const eventDate = new Date(year, month - 1, day, hour, minute)
        return { ...ev, date, eventDate }
      })
    )
    .filter(ev => ev.eventDate > now)
    .sort((a, b) => a.eventDate - b.eventDate)
    .slice(0, 5)

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Upcoming Events</h3>
      <ul className="space-y-2">
        {upcoming.map((ev, i) => (
          <li
            key={i}
            className="flex items-center gap-2 cursor-pointer bg-white/90 rounded-xl shadow-md border border-gray-200 px-3 py-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:bg-blue-50 min-h-[3.2rem] min-w-[180px] sm:min-w-[200px] md:min-w-[220px]"
            onClick={() => setSelectedEvent && setSelectedEvent({ ...ev, date: ev.date })}
          >
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: ev.color }} />
            <span className="font-medium truncate max-w-[calc(100%-90px)]">
              {ev.title?.split(' ')[0] || ev.title}
            </span>
            <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">{ev.date} {ev.time}</span>
          </li>
        ))}
        {upcoming.length === 0 && (
          <li className="text-gray-400 text-sm min-h-[3.2rem] min-w-[180px] sm:min-w-[200px] md:min-w-[220px] flex items-center">No upcoming events.</li>
        )}
      </ul>
    </div>
  )
}

export default UpcomingEvents