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
    { id: 'all', name: 'All Events', color: 'bg-gray-100 text-gray-800' },
    { id: 'Conference', name: 'Conference', color: 'bg-blue-100 text-blue-800' },
    { id: 'Workshop', name: 'Workshop', color: 'bg-green-100 text-green-800' },
    { id: 'Competition', name: 'Competition', color: 'bg-purple-100 text-purple-800' },
    { id: 'Webinar', name: 'Webinar', color: 'bg-orange-100 text-orange-800' },
    { id: 'Hackathon', name: 'Hackathon', color: 'bg-red-100 text-red-800' }
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
      className={`${isListView ? 'flex items-center space-x-4' : ''}`}
      onMouseEnter={() => handleEventHover(event)}
    >
      <div className={`${isListView ? 'flex-shrink-0' : ''}`}>
        {event.poster ? (
          <img 
            src={posterUrl}
            alt={event.title}
            className={`${isListView ? 'w-16 h-16' : 'w-full h-32'} object-cover rounded-lg mb-4`}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className={`${isListView ? 'w-16 h-16' : 'w-full h-32'} bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4`}>
            <CalendarIcon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
      <div className={`${isListView ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {event.title}
            </h3>
            {isEventbriteEvent && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                🌐 Tech Event
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            categories.find(cat => cat.id === event.type)?.color || 'bg-gray-100 text-gray-800'
          }`}>
            {event.type}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          {event.description}
        </p>
        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {event.date} at {event.time}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-2" />
            Max {event.maxParticipants} participants
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {event.organizerName || event.organizer?.name || 'Unknown Organizer'}
            </span>
            <span className="text-sm font-medium text-green-600">
              {event.registrationFee || (event.isFree ? 'Free' : 'Paid')}
            </span>
          </div>
          <button 
            onClick={() => handleRegister(event)}
            disabled={registeredEvents.includes(eventId)}
            className={
              registeredEvents.includes(eventId)
                ? 'btn-primary !bg-green-600 hover:!bg-green-600 cursor-not-allowed' 
                : 'btn-primary'
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Explore Events
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={loadEvents}
              className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60"
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
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadEvents}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                >
                  Refresh
                </button>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <ViewColumnsIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
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
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {filteredEvents.length} events
            </p>
          </div>

          {/* Events Grid/List */}
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}`}>
            {filteredEvents.map((event) => (
              <EventCard 
                key={event._id || event.id || event.eventbriteId} 
                event={event} 
                isListView={viewMode === 'list'}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <CalendarIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
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