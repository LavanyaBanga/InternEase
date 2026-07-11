import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline'
import apiService from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary'

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/api$/, '')

const EventExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [eventbriteEvents, setEventbriteEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewedEvents, setViewedEvents] = useState(new Set())

  
  useEffect(() => {
    loadEvents()
    loadEventbriteEvents()
    loadRegisteredEvents()
  }, [])

  const loadEvents = async () => {
    try {
      console.log('EVENT EXPLORER: Loading events from API')
      setLoading(true)
      setError(null)
      const response = await apiService.getEvents()
      console.log('EVENT EXPLORER: Response:', response)
      
    
      const events = response.data || response.events || response || []
      console.log('EVENT EXPLORER: Loaded events:', events)
      setAllEvents(events)
    } catch (error) {
      console.error('EVENT EXPLORER: Error loading events:', error)
      setError(error.response?.data?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const loadEventbriteEvents = async () => {
    try {
      console.log('EVENT EXPLORER: Loading GitHub tech events')
      const response = await apiService.getEventbriteEvents({ status: 'live' })
      console.log('EVENT EXPLORER: GitHub events response:', response)
      
      const events = response.data || response || []
      console.log('EVENT EXPLORER: Loaded GitHub events:', events)
      setEventbriteEvents(events)
    } catch (error) {
      console.error('EVENT EXPLORER: Error loading GitHub events:', error)
      
      if (!error.message?.includes('not configured')) {
        console.warn('GitHub events integration error:', error.message)
      }
    }
  }

  const loadRegisteredEvents = () => {
   
    const registered = JSON.parse(localStorage.getItem('registered_events') || '[]')
    const eventbriteRegistered = JSON.parse(localStorage.getItem('eventbrite_registered') || '[]')
    setRegisteredEvents([...registered, ...eventbriteRegistered])
  }

  const handleRegister = async (event) => {
    const eventId = event._id || event.id || event.eventbriteId

    if (registeredEvents.includes(eventId)) {
      alert(`You're already registered for "${event.title}"`)
      return
    }

    try {
    
      if (event.isEventbrite) {
        console.log('Registering for external event:', event.eventbriteId)
        const response = await apiService.registerForEventbriteEvent(event.eventbriteId)
        console.log('External event registration response:', response)
        
       
        const eventbriteRegistered = JSON.parse(localStorage.getItem('eventbrite_registered') || '[]')
        eventbriteRegistered.push(event.eventbriteId)
        localStorage.setItem('eventbrite_registered', JSON.stringify(eventbriteRegistered))
        
        
        setRegisteredEvents([...registeredEvents, event.eventbriteId])
        
        alert(`Registration tracked!\n\nYou'll now be redirected to Eventbrite to complete your registration for "${event.title}"`)
        
     
        window.open(response.redirectUrl || event.url, '_blank')
      } else {
        console.log('Registering for InternEase event:', eventId)
        const response = await apiService.registerForEvent(eventId)
        console.log('Registration response:', response)
        
       
        const updatedRegistered = [...registeredEvents, eventId]
        setRegisteredEvents(updatedRegistered)
        localStorage.setItem('registered_events', JSON.stringify(updatedRegistered))
        
        alert(`Successfully registered for "${event.title}"!\n\nEvent: ${event.title}\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}`)
        
       
        loadEvents()
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert(error.response?.data?.message || error.message || 'Failed to register for event. Please try again.')
    }
  }

  const handleEventHover = async (event) => {
    const eventId = event._id || event.id || event.eventbriteId
    
    
    if (!viewedEvents.has(eventId)) {
      try {
        if (event.isEventbrite) {
          await apiService.trackEventbriteView(event.eventbriteId)
        } else {
          await apiService.trackEventView(eventId)
        }
        setViewedEvents(prev => new Set([...prev, eventId]))
        console.log('View tracked for event:', eventId)
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }
  }

  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-slate-100 text-slate-700' },
    { id: 'Conference', name: 'Conference', color: 'bg-sky-50 text-sky-700' },
    { id: 'Workshop', name: 'Workshop', color: 'bg-emerald-50 text-emerald-700' },
    { id: 'Competition', name: 'Competition', color: 'bg-violet-50 text-violet-700' },
    { id: 'Webinar', name: 'Webinar', color: 'bg-amber-50 text-amber-700' },
    { id: 'Hackathon', name: 'Hackathon', color: 'bg-rose-50 text-rose-700' }
  ]

 
  const combinedEvents = [...allEvents, ...eventbriteEvents]

  const filteredEvents = combinedEvents.filter(event => {
    if (!event) return false
    
    const title = event.title || ''
    const description = event.description || ''
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.type === selectedCategory
    return matchesSearch && matchesCategory
  })

  const EventCard = ({ event, isListView = false }) => {
    const eventId = event._id || event.id || event.eventbriteId
    const isEventbriteEvent = event.isEventbrite
    const posterUrl = isEventbriteEvent ? event.poster : `${API_ORIGIN}${event.poster}`
    
    return (
    <Card 
      className={`bg-white border border-slate-100 shadow-sm ${isListView ? 'flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4' : ''}`}
      onMouseEnter={() => handleEventHover(event)}
    >
      <div className={`${isListView ? 'flex-shrink-0 w-full sm:w-auto' : 'w-full'}`}>
        {event.poster ? (
          <img 
            src={posterUrl}
            alt={event.title}
            className={`${isListView ? 'w-full sm:w-16 h-40 sm:h-16' : 'w-full h-40 sm:h-32'} object-cover rounded-lg mb-4 sm:mb-0`}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className={`${isListView ? 'w-full sm:w-16 h-40 sm:h-16' : 'w-full h-40 sm:h-32'} bg-indigo-500 rounded-lg flex items-center justify-center mb-4 sm:mb-0`}>
            <CalendarIcon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
      <div className={`${isListView ? 'flex-1 min-w-0 w-full' : ''}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 break-words">
              {event.title}
            </h3>
            {isEventbriteEvent && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-white">
                🌐 Tech Event
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
            categories.find(cat => cat.id === event.type)?.color || 'bg-slate-100 text-slate-700'
          }`}>
            {event.type}
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-500 mb-3 line-clamp-3 sm:line-clamp-none">
          {event.description}
        </p>
        <div className="space-y-2 mb-4 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            Max {event.maxParticipants} participants
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-400 truncate">
              {event.organizerName || event.organizer?.name || 'Unknown Organizer'}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {event.registrationFee || (event.isFree ? 'Free' : 'Paid')}
            </span>
          </div>
          <button 
            onClick={() => handleRegister(event)}
            disabled={registeredEvents.includes(eventId)}
            className={
              registeredEvents.includes(eventId)
                ? 'bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed w-full sm:w-auto'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full sm:w-auto'
            }
          >
            {registeredEvents.includes(eventId) ? 'Registered ✓' : 'Register'}
          </button>
        </div>
      </div>
    </Card>
  )
  }

  return (
    <ErrorBoundary>
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Explore Events
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Discover conferences, workshops, hackathons and more
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
            <button
              onClick={loadEvents}
              className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex-shrink-0 self-start sm:self-auto"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search and Controls */}
      {!loading && (
        <>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadEvents}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
                >
                  Refresh
                </button>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white flex-shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <ViewColumnsIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm sm:text-base text-slate-500">
              Showing {filteredEvents.length} events
            </p>
          </div>

          {/* Events Grid/List */}
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4'}`}>
            {filteredEvents.map((event) => (
              <EventCard 
                key={event._id || event.id || event.eventbriteId} 
                event={event} 
                isListView={viewMode === 'list'}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-12 px-4">
              <div className="text-slate-300 mb-4">
                <CalendarIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No events found
              </h3>
              <p className="text-sm sm:text-base text-slate-500">
                Try adjusting your search criteria or category filter
              </p>
            </div>
          )}
        </>
      )}
    </div>
    </ErrorBoundary>
  )
}

export default EventExplorer