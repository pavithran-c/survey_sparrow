"use client"
import { Calendar, Clock } from "lucide-react"

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
    },
    {
      id: "clock",
      label: "Analog Clock",
      icon: Clock,
    },
  ]

  return (
    <nav className="relative bg-gradient-to-r from-slate-50 to-gray-100 shadow-lg border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center sm:justify-start gap-2 py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium text-sm sm:text-base
                  transition-all duration-300 ease-in-out transform
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105"
                      : "bg-white/80 text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md hover:scale-102 backdrop-blur-sm"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  active:scale-95
                `}
              >
                {/* Background glow effect for active tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-blue-400 rounded-xl blur-sm opacity-30 -z-10 animate-pulse" />
                )}

                {/* Icon */}
                <Icon
                  size={18}
                  className={`transition-transform duration-300 ${isActive ? "rotate-0" : "group-hover:rotate-12"}`}
                />

                {/* Label */}
                <span className="relative">
                  {tab.label}

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-200 rounded-full animate-ping" />
                  )}
                </span>

                {/* Hover effect underline */}
                {!isActive && (
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full group-hover:left-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active tab indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      </div>
    </nav>
  )
}

export default Navbar
