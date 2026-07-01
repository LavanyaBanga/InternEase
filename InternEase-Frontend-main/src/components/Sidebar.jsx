import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon,
  BriefcaseIcon,
  CalendarIcon,
  BookOpenIcon,
  DocumentTextIcon,
  UserIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  DocumentMagnifyingGlassIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  Cog6ToothIcon,
  PaperAirplaneIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

const Sidebar = ({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) => {
  const { user } = useAuth()
  const location = useLocation()

  const studentItems = [
    {
      name: 'Dashboard',
      href: '/student',
      icon: HomeIcon
    },
    {
      name: 'Internships',
      href: '/internships',
      icon: BriefcaseIcon
    },
    {
      name: 'Events',
      href: '/events',
      icon: CalendarIcon
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpenIcon
    },
    {
      name: 'Notes',
      href: '/notes',
      icon: DocumentTextIcon
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: BellIcon
    },
    {
      name: 'Tracker',
      href: '/tracker',
      icon: ClipboardDocumentListIcon
    },
    {
      name: 'Resume Analyzer',
      href: '/resume-analyzer',
      icon: DocumentMagnifyingGlassIcon
    },
   
    {
      name: 'AI Assistant',
      href: '/ai-assistant',
      icon: ChatBubbleLeftRightIcon
    }
  ]

  const organizerItems = [
    {
      name: 'Dashboard',
      href: '/organizer',
      icon: HomeIcon
    },
    {
      name: 'Create Event',
      href: '/create-event',
      icon: PlusIcon
    },
    {
      name: 'Manage Events',
      href: '/manage-events',
      icon: CalendarIcon
    },
    {
      name: 'Create Internship',
      href: '/organizer/create-internship',
      icon: PlusIcon
    },
    {
      name: 'Manage Internships',
      href: '/organizer/manage-internships',
      icon: BriefcaseIcon
    },
    {
      name: 'Send Notifications',
      href: '/send-notifications',
      icon: PaperAirplaneIcon
    },
    {
      name: 'Profile',
      href: '/organizer-profile',
      icon: UserIcon
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: BellIcon
    },
    {
      name: 'AI Assistant',
      href: '/ai-assistant',
      icon: ChatBubbleLeftRightIcon
    }
  ]

  const sidebarItems = user?.role === 'organizer' ? organizerItems : studentItems

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 top-16 bg-black/40 z-30 lg:hidden"
        />
      )}

      <div className={`fixed left-0 top-16 h-full bg-white dark:bg-cardDark shadow-lg z-40 transition-all duration-300 
        ${collapsed ? 'lg:w-16' : 'lg:w-64'} 
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Collapse button - only show on desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block absolute -right-3 top-6 bg-white dark:bg-cardDark border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Sidebar content */}
        <div className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={collapsed ? item.name : ''}
                onClick={() => {
                  if (setSidebarOpen) {
                    setSidebarOpen(false)
                  }
                }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={`text-sm font-medium ${collapsed ? 'lg:hidden' : 'block'}`}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Sidebar