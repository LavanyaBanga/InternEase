import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'
import Card from '../components/Card'
import { 
  BriefcaseIcon, 
  CalendarIcon,
  ChevronRightIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { mockUserStats } from '../data/mockData'

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/api$/, '')

const StudentDashboard = () => {
  const { user } = useAuth()
  const [allEvents, setAllEvents] = useState([])
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
    loadInternships()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await apiService.getEvents()
      const eventsData = response.data || response.events || response
      setAllEvents(Array.isArray(eventsData) ? eventsData : [])
    } catch (error) {
      setAllEvents([])
    } finally {
      setLoading(false)
    }
  }

  const loadInternships = async () => {
    try {
      const response = await apiService.getInternships()
      const internshipsData = response.data || response.opportunities || response
      setInternships(Array.isArray(internshipsData) ? internshipsData : [])
    } catch (error) {
      setInternships([])
    }
  }

  const stats = [
    
    { 
      name: 'Events', 
      value: allEvents.length, 
      icon: CalendarIcon, 
      color: 'text-violet-600', 
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      border: 'border-violet-100 dark:border-violet-800',
      desc: 'Available now'
    },
    { 
      name: 'Internships', 
      value: internships.length, 
      icon: ArrowTrendingUpIcon, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-800',
      desc: 'Open roles'
    },
  ]

  const tips = [
    { icon: '', text: 'Complete your profile to get better internship matches' },
    { icon: '', text: 'Apply to at least 5 internships per week' },
    { icon: '', text: 'Attend networking events to build connections' },
    { icon: '', text: 'Update your resume regularly with new skills' }
  ]

  return (
    <div className="p-6 space-y-5">

    
      <div className="relative bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-12 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
        
           
          </div>
          <h1 className="text-2xl font-bold mb-1">Hi, {user?.name?.split(' ')[0] || 'Student'} </h1>
          <p className="text-white/80 text-sm">
            Ready to take the next step in your career journey?
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className={`!p-4 border ${stat.border}`}>
              <div className={`${stat.bg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{stat.name}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.desc}</div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recommended Internships */}
        <Card className="!p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recommended Internships
            </h2>
            <Link to="/internships" className="text-primary hover:text-secondary flex items-center text-xs font-medium">
              View all <ChevronRightIcon className="h-3.5 w-3.5 ml-0.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {internships.length > 0 ? (
              internships.slice(0, 3).map((internship) => (
                <div key={internship._id} className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {internship.poster ? (
                    <img
                      src={`${API_ORIGIN}/${internship.poster}`}
                      alt={internship.company}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {internship.company?.charAt(0) || 'C'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {internship.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                        {internship.location}
                      </span>
                    </div>
                  </div>
                  {internship.stipend && (
                    <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      <CurrencyDollarIcon className="h-3.5 w-3.5" />
                      {internship.stipend}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-400 py-6">No internships available yet</p>
            )}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="!p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Upcoming Events
              <span className="ml-2 text-xs font-normal text-gray-400">({allEvents.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={loadEvents}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                disabled={loading}
              >
                {loading ? '...' : 'Refresh'}
              </button>
              <Link to="/events" className="text-primary hover:text-secondary flex items-center text-xs font-medium">
                View all <ChevronRightIcon className="h-3.5 w-3.5 ml-0.5" />
              </Link>
            </div>
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : allEvents.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">No events available</p>
            ) : (
              allEvents.slice(0, 3).map((event) => (
                <div key={event._id || event.id} className="flex gap-3 p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {event.poster ? (
                    <img
                      src={`${API_ORIGIN}${event.poster}`}
                      alt={event.title}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.date} • {event.time}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        {event.type}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {event.registrationFee || 'Free'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Daily Tips */}
      <Card className="!p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Daily Tips</h2>
          <Link to="/gamification" className="btn-primary !py-1.5 !px-3 !text-xs">
            View Achievements
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
              <span className="text-base flex-shrink-0">{tip.icon}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}

export default StudentDashboard