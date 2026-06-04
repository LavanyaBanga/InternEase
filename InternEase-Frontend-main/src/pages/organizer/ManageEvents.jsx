import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiService from '../../services/api'
import Card from '../../components/Card'
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/api$/, '')

const ManageEvents = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [eventbriteEvents, setEventbriteEvents] = useState([])
  const [eventbriteStats, setEventbriteStats] = useState({})
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showEventbriteEvents, setShowEventbriteEvents] = useState(true)
  const [studentRegistrations, setStudentRegistrations] = useState([])
  const [showStudentRegistrations, setShowStudentRegistrations] = useState(false)
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)

  // Reload events when component mounts or location changes
  useEffect(() => {
    loadEvents()
    loadEventbriteEvents()
  }, [location])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading organizer events...')
      const response = await apiService.getOrganizerEvents()
      console.log('Events response:', response)
      
      // Handle different response formats
      const eventsData = response.data || response.events || response
      setEvents(Array.isArray(eventsData) ? eventsData : [])
    } catch (error) {
      console.error('Failed to load events:', error)
      setError(error.message || 'Failed to load events')
      // Don't show alert, just set error state
    } finally {
      setLoading(false)
    }
  }

  const loadEventbriteEvents = async () => {
    try {
      console.log('Loading tech events...')
      const [eventsResponse, statsResponse] = await Promise.all([
        apiService.getEventbriteEvents({ status: 'live' }),
        apiService.getEventbriteStats()
      ])
      
      console.log('Tech events response:', eventsResponse)
      console.log('Tech events stats response:', statsResponse)
      
      const eventsData = eventsResponse.data || eventsResponse || []
      const statsData = statsResponse.data || statsResponse || []
      
      setEventbriteEvents(Array.isArray(eventsData) ? eventsData : [])
      
      // Create a map of stats by eventbriteId for quick lookup
      const statsMap = {}
      statsData.forEach(stat => {
        statsMap[stat._id] = {
          views: stat.views || 0,
          registrations: stat.registrations || 0
        }
      })
      setEventbriteStats(statsMap)
    } catch (error) {
      console.error('Failed to load tech events:', error)
      // Don't fail if external events fail to load
      if (!error.message?.includes('not configured')) {
        console.warn('Tech events integration error:', error.message)
      }
    }
  }

  const loadStudentRegistrations = async () => {
    try {
      setLoadingRegistrations(true)
      console.log('Loading student registrations...')
      const response = await apiService.getAllStudentRegistrations()
      console.log('Student registrations response:', response)
      
      const data = response.data || response || []
      setStudentRegistrations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load student registrations:', error)
      alert('Failed to load student registrations')
    } finally {
      setLoadingRegistrations(false)
    }
  }

  const handleViewRegistrations = () => {
    if (!showStudentRegistrations) {
      loadStudentRegistrations()
    }
    setShowStudentRegistrations(!showStudentRegistrations)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-800'
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'Expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiService.deleteEvent(eventId)
        setEvents(events.filter(event => event._id !== eventId))
        alert('Event deleted successfully!')
      } catch (error) {
        console.error('Failed to delete event:', error)
        alert('Failed to delete event. Please try again.')
      }
    }
  }

  const handleEdit = (event) => {
    // Navigate to create event page with event data for editing
    navigate('/create-event', { 
      state: { 
        editMode: true, 
        eventData: event 
      } 
    })
  }

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const handleRepublish = (eventId) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, status: 'Live' } : event
    )
    setEvents(updatedEvents)
    
    // Update localStorage
    const savedEvents = updatedEvents.filter(event => !mockOrganizerEvents.find(mock => mock.id === event.id))
    localStorage.setItem('organizer_events', JSON.stringify(savedEvents))
  }

  const EventCard = ({ event }) => (
    <Card className="hover:shadow-xl transition-all duration-300">
      <div className="flex gap-4">
        {/* Event Poster */}
        {event.poster && (
          <div className="flex-shrink-0">
            <img 
              src={`${API_ORIGIN}${event.poster}`}
              alt={event.title}
              className="w-32 h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
        
        {/* Event Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {event.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {event.currentParticipants || event.registrations?.length || 0}/{event.maxParticipants}
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleViewDetails(event)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="View Details"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEdit(event)}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Edit"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">{event.views || 0}</div>
                  <div className="text-gray-500">Views</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">{event.registrations?.length || 0}</div>
                  <div className="text-gray-500">Registrations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Events
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all your published events
            </p>
          </div>
          <Link to="/create-event" className="btn-primary flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="Live">Live</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading events...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load events
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button onClick={loadEvents} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {events.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Events</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {events.filter(e => e.status === 'Live').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Live Events</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {events.filter(e => e.status === 'Upcoming').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Upcoming</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-600 mb-1">
            {events.reduce((sum, event) => sum + (event.applications || 0), 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Applications</div>
        </Card>
      </div>

      {/* InternEase Events Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Your InternEase Events
        </h2>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CalendarIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {filter === 'all' 
                ? 'You haven\'t created any events yet' 
                : `No events with status "${filter}"`
              }
            </p>
            <Link to="/create-event" className="btn-primary">
              Create Your First Event
            </Link>
          </div>
        )}
      </div>

      {/* Tech Events Section */}
      {eventbriteEvents.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🌐 Tech Community Events
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({eventbriteEvents.length} events)
              </span>
            </h2>
            <button
              onClick={() => setShowEventbriteEvents(!showEventbriteEvents)}
              className="text-sm text-primary hover:underline"
            >
              {showEventbriteEvents ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showEventbriteEvents && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {eventbriteEvents.map((event) => (
                <Card key={event.eventbriteId} className="hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4">
                    {/* Event Poster */}
                    {event.poster && (
                      <div className="flex-shrink-0">
                        <img 
                          src={event.poster}
                          alt={event.title}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-white">
                              🌐 Tech Event
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {event.date}
                            </div>
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm">
                            <div className="text-center">
                              <div className="font-bold text-gray-900 dark:text-white">
                                {eventbriteStats[event.eventbriteId]?.views || 0}
                              </div>
                              <div className="text-gray-500">Views</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-gray-900 dark:text-white">
                                {eventbriteStats[event.eventbriteId]?.registrations || 0}
                              </div>
                              <div className="text-gray-500">Registrations</div>
                            </div>
                          </div>
                          <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Event Details →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Registrations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            👥 Student Event Registrations
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Track student progress)
            </span>
          </h2>
          <button
            onClick={handleViewRegistrations}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            disabled={loadingRegistrations}
          >
            {loadingRegistrations ? 'Loading...' : showStudentRegistrations ? 'Hide Registrations' : 'View All Registrations'}
          </button>
        </div>

        {showStudentRegistrations && (
          <div className="space-y-4">
            {studentRegistrations.length === 0 ? (
              <Card>
                <p className="text-center text-gray-500 py-8">
                  No student registrations yet
                </p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {studentRegistrations.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                    </div>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-900/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {studentRegistrations.reduce((sum, s) => sum + s.totalEvents, 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Registrations</div>
                    </div>
                  </Card>
                  <Card className="bg-purple-50 dark:bg-purple-900/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {(studentRegistrations.reduce((sum, s) => sum + s.totalEvents, 0) / studentRegistrations.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg Events/Student</div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-3">
                  {studentRegistrations.map((item) => (
                    <Card key={item.student.id} className="hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                              {item.student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {item.student.name}
                              </h3>
                              <p className="text-sm text-gray-500">{item.student.email}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span className="flex items-center">
                                <UsersIcon className="h-4 w-4 mr-1" />
                                {item.totalEvents} events registered
                              </span>
                              <span className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Joined: {new Date(item.student.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="border-t pt-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Registered Events:
                            </h4>
                            <div className="space-y-2">
                              {item.registrations.slice(0, 3).map((reg, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  <span className="text-gray-900 dark:text-white font-medium">{reg.eventTitle}</span>
                                  <span className="text-gray-500 text-xs">
                                    {new Date(reg.registeredAt).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                              {item.registrations.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{item.registrations.length - 3} more events
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-cardDark rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-cardDark border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Event Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Event Poster */}
              {selectedEvent.poster && (
                <img 
                  src={`${API_ORIGIN}${selectedEvent.poster}`}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              
              {/* Event Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedEvent.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedEvent.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedEvent.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedEvent.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Time</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedEvent.time}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Fee</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedEvent.registrationFee}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Participants</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {selectedEvent.currentParticipants}/{selectedEvent.maxParticipants}
                    </p>
                  </div>
                </div>
                
                {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requirements</label>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {selectedEvent.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-900 dark:text-white">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  )
}

export default ManageEvents