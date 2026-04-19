import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Activity, Calendar, FlaskConical, FileText, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/',            label: 'Home',       icon: Activity },
  { path: '/symptoms',    label: 'Symptoms',   icon: Activity },
  { path: '/book-doctor', label: 'Doctors',    icon: Calendar },
  { path: '/lab-tests',   label: 'Lab Tests',  icon: FlaskConical },
  { path: '/prescription',label: 'Rx Reader',  icon: FileText },
  { path: '/dashboard',   label: 'My Records', icon: LayoutDashboard },
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface flex">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-60 border-r border-border flex-col fixed h-screen">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">M</span>
            </div>
            <span className="font-display font-semibold text-lg text-white tracking-tight">MEDLI</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-body">Smarter hospital visits</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3">
            <p className="text-xs text-brand-400 font-body font-medium">Powered by Gemini AI</p>
            <p className="text-xs text-gray-500 mt-0.5">Not a substitute for medical advice</p>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">M</span>
          </div>
          <span className="font-display font-semibold text-white">MEDLI</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-400 hover:text-white">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-surface pt-14">
          <nav className="p-4 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
