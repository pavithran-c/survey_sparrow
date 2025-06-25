"use client"
import { useEffect, useRef } from "react"
import { Calendar, Clock } from "lucide-react"
import { gsap } from "gsap"

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
    },
    {
      id: "clock",
      label: "Events",
      icon: Clock,
    },
  ]

  const tabRefs = useRef([])

  useEffect(() => {
    // Animate tabs on mount and when activeTab changes
    tabRefs.current.forEach((el, i) => {
      if (el) {
        gsap.fromTo(
          el,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: "power2.out" }
        )
      }
    })
  }, [activeTab])

  return (
    <nav className="relative bg-gradient-to-r from-purple-50 to-green-100 shadow-lg border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center sm:justify-start gap-2 py-4">
          {tabs.map((tab, i) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                ref={el => (tabRefs.current[i] = el)}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group relative flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium text-sm sm:text-base
                  transition-all duration-300 ease-in-out transform
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-400 to-green-400 text-white shadow-lg shadow-purple-400/25 scale-105"
                      : "bg-white/80 text-gray-700 hover:bg-purple-100 hover:text-purple-700 hover:shadow-md hover:scale-102 backdrop-blur-sm"
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
                  active:scale-95
                `}
              >
                {/* Background glow effect for active tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-purple-300 rounded-xl blur-sm opacity-30 -z-10 animate-pulse" />
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
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-200 rounded-full animate-ping" />
                  )}
                </span>

                {/* Hover effect underline */}
                {!isActive && (
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full group-hover:left-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active tab indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
      </div>
    </nav>
  )
}

export default Navbar
