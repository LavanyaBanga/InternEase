import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'
import Card from '../components/Card'
import {
  CalendarIcon,
  ChevronRightIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/api$/, '')

const StudentDashboard = () => {
  const { user } = useAuth()

  const [allEvents, setAllEvents] = useState([])
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)

    try {
      await Promise.all([loadEvents(), loadInternships()])
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    try {
      const response = await apiService.getEvents()

      const eventsData =
        response?.data ||
        response?.events ||
        response ||
        []

      setAllEvents(
        Array.isArray(eventsData) ? eventsData : []
      )
    } catch (error) {
      console.error('Failed to load events:', error)
      setAllEvents([])
    }
  }

  const loadInternships = async () => {
    try {
      const response = await apiService.getInternships()

      const internshipsData =
        response?.data ||
        response?.opportunities ||
        response ||
        []

      setInternships(
        Array.isArray(internshipsData)
          ? internshipsData
          : []
      )
    } catch (error) {
      console.error('Failed to load internships:', error)
      setInternships([])
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''

    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://')
    ) {
      return imagePath
    }

    if (!API_ORIGIN) {
      return imagePath
    }

    const normalizedPath = imagePath.startsWith('/')
      ? imagePath
      : `/${imagePath}`

    return `${API_ORIGIN}${normalizedPath}`
  }

  const formatEventDate = (date) => {
    if (!date) return 'Date not available'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const stats = [
    {
      name: 'Events',
      value: allEvents.length,
      icon: CalendarIcon,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      desc: 'Available now'
    },
    {
      name: 'Internships',
      value: internships.length,
      icon: ArrowTrendingUpIcon,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      desc: 'Open roles'
    }
  ]

  const tips = [
    {
      icon: '💡',
      text: 'Complete your profile to get better internship matches'
    },
    {
      icon: '📨',
      text: 'Apply to at least 5 internships per week'
    },
    {
      icon: '🤝',
      text: 'Attend networking events to build connections'
    },
    {
      icon: '📝',
      text: 'Update your resume regularly with new skills'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-7xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-50 sm:-right-12 sm:-top-20 sm:h-56 sm:w-56" />

          <div className="pointer-events-none absolute -bottom-10 right-6 h-20 w-20 rounded-full bg-sky-50 sm:right-16 sm:h-28 sm:w-28" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-indigo-500">
              <SparklesIcon className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wide">
                Dashboard
              </span>
            </div>

            <h1 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
              Hi, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>

            <p className="text-sm leading-6 text-slate-500 sm:text-base">
              Ready to take the next step in your career journey?
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <Card
                key={stat.name}
                className={`border bg-white !p-3 shadow-sm sm:!p-4 ${stat.border}`}
              >
                <div
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${stat.bg}`}
                >
                  <Icon
                    className={`h-5 w-5 ${stat.color}`}
                  />
                </div>

                <div className="mb-1 text-xl font-bold leading-none text-slate-900 sm:text-2xl">
                  {stat.value}
                </div>

                <div className="truncate text-xs font-medium text-slate-700 sm:text-sm">
                  {stat.name}
                </div>

                <div className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                  {stat.desc}
                </div>
              </Card>
            )
          })}
        </section>

        {/* Internships and Events */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Recommended Internships */}
          <Card className="border border-slate-100 bg-white !p-4 shadow-sm sm:!p-5">
            <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Recommended Internships
              </h2>

              <Link
                to="/internships"
                className="flex items-center whitespace-nowrap text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 sm:text-sm"
              >
                View all
                <ChevronRightIcon className="ml-0.5 h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-b-indigo-500" />
                </div>
              ) : internships.length > 0 ? (
                internships
                  .slice(0, 3)
                  .map((internship) => (
                    <div
                      key={
                        internship._id ||
                        internship.id ||
                        internship.title
                      }
                      className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                    >
                      {internship.poster ? (
                        <img
                          src={getImageUrl(internship.poster)}
                          alt={
                            internship.company ||
                            internship.title ||
                            'Internship'
                          }
                          className="h-11 w-11 flex-shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              'none'
                          }}
                        />
                      ) : (
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500 sm:h-12 sm:w-12">
                          <span className="text-sm font-bold text-white sm:text-base">
                            {internship.company
                              ?.charAt(0)
                              ?.toUpperCase() || 'C'}
                          </span>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                          {internship.title ||
                            'Internship Opportunity'}
                        </h3>

                        {internship.company && (
                          <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                            {internship.company}
                          </p>
                        )}

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex min-w-0 max-w-full items-center gap-1 text-xs text-slate-500">
                            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />

                            <span className="truncate">
                              {internship.location ||
                                'Location not specified'}
                            </span>
                          </span>

                          {internship.stipend && (
                            <span className="flex flex-shrink-0 items-center gap-0.5 text-xs font-medium text-emerald-600">
                              <CurrencyDollarIcon className="h-3.5 w-3.5" />
                              {internship.stipend}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    No internships available yet
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="border border-slate-100 bg-white !p-4 shadow-sm sm:!p-5">
            <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Upcoming Events

                <span className="ml-2 text-xs font-normal text-slate-400">
                  ({allEvents.length})
                </span>
              </h2>

              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={loadDashboardData}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-center text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>

                <Link
                  to="/events"
                  className="flex items-center whitespace-nowrap text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 sm:text-sm"
                >
                  View all
                  <ChevronRightIcon className="ml-0.5 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-b-indigo-500" />
                </div>
              ) : allEvents.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    No events available
                  </p>
                </div>
              ) : (
                allEvents.slice(0, 3).map((event) => (
                  <div
                    key={
                      event._id ||
                      event.id ||
                      event.title
                    }
                    className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                  >
                    {event.poster ? (
                      <img
                        src={getImageUrl(event.poster)}
                        alt={event.title || 'Event'}
                        className="h-11 w-11 flex-shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
                        onError={(eventObject) => {
                          eventObject.currentTarget.style.display =
                            'none'
                        }}
                      />
                    ) : (
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-sky-500 sm:h-12 sm:w-12">
                        <CalendarIcon className="h-5 w-5 text-white" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                        {event.title || 'Upcoming Event'}
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                        {formatEventDate(event.date)}
                        {event.time
                          ? ` • ${event.time}`
                          : ''}
                      </p>

                      <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="max-w-full truncate rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-600">
                          {event.type || 'Event'}
                        </span>

                        <span className="text-xs font-medium text-emerald-600">
                          {event.registrationFee || 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        {/* Daily Tips */}
        <section>
          <Card className="border border-slate-100 bg-white !p-4 shadow-sm sm:!p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Daily Tips
              </h2>

              <Link
                to="/gamification"
                className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-indigo-700 sm:w-auto sm:text-sm"
              >
                View Achievements
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 sm:p-4"
                >
                  <span className="flex-shrink-0 text-lg">
                    {tip.icon}
                  </span>

                  <p className="text-sm leading-relaxed text-slate-600">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}

              
export default StudentDashboard