"use client"

import type React from "react"
import { useAuth } from "@/context/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 flex flex-col">
          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-24" />
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-16" />
                </div>
              </div>
            ) : profile ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {profile.public_username.charAt(5).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{profile.display_name || profile.public_username}</p>
                  <p className="text-gray-400 text-xs">@{profile.public_username}</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No profile</div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4">
            <ul>
              <li className="mb-2">
                <a href="#" className="block p-2 rounded hover:bg-gray-700">
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="block p-2 rounded hover:bg-gray-700">
                  Settings
                </a>
              </li>
              {/* Add more navigation items here */}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout
