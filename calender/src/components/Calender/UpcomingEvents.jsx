import React from "react"

const UpcomingEvents = ({ events }) => {
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
          <li key={i} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: ev.color }} />
            <span className="font-medium">{ev.title}</span>
            <span className="text-xs text-gray-500 ml-auto">{ev.date} {ev.time}</span>
          </li>
        ))}
        {upcoming.length === 0 && (
          <li className="text-gray-400 text-sm">No upcoming events.</li>
        )}
      </ul>
    </div>
  )
}

export default UpcomingEvents