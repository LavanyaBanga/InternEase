import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../../components/Card'
import { 
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  BanknotesIcon,
  ShareIcon,
  HeartIcon,
  ChevronLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { mockOrganizerEvents } from '../../data/organizerMockData'

const EventPreview = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    // Find the event by ID
    const foundEvent = mockOrganizerEvents.find(e => e.id === parseInt(id))
    setEvent(foundEvent)
  }, [id])

  const handleShare = (platform) => {
    const url = window.location.href
    const text = `Check out this amazing event: ${event.title}`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
      default:
        break
    }
    setShowShareMenu(false)
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

  const getDeadlineStatus = () => {
    if (!event) return null
    
    const today = new Date()
    const deadline = new Date(event.deadline)
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    
    if (daysLeft < 0) return { text: 'Registration Closed', color: 'text-red-600' }
    if (daysLeft === 0) return { text: 'Last Day to Register', color: 'text-orange-600' }
    if (daysLeft <= 3) return { text: `${daysLeft} days left`, color: 'text-orange-600' }
    return { text: `${daysLeft} days left`, color: 'text-green-600' }
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Event not found
          </h3>
          <Link to="/manage-events" className="text-primary hover:text-secondary">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const deadlineStatus = getDeadlineStatus()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg">
      {/* Header */}
      <div className="bg-white dark:bg-cardDark shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/manage-events"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Back to Events</span>
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <HeartIcon className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 text-gray-400 hover:text-primary rounded-full transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-cardDark rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {event.type}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Organized by {event.organizer}
                  </p>
                </div>
              </div>

              {event.poster && (
                <div className="mb-6">
                  <img 
                    src={event.poster} 
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.date}
                    </div>
                    <div className="text-xs text-gray-500">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.location}
                    </div>
                    <div className="text-xs text-gray-500">Location</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.currentParticipants}/{event.maxParticipants}
                    </div>
                    <div className="text-xs text-gray-500">Registered</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <BanknotesIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.registrationFee}
                    </div>
                    <div className="text-xs text-gray-500">Registration</div>
                  </div>
                </div>
              </div>

              {deadlineStatus && (
                <div className={`flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6`}>
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Registration deadline: {event.deadline}
                  </span>
                  <span className={`text-sm font-medium ${deadlineStatus.color}`}>
                    ({deadlineStatus.text})
                  </span>
                </div>
              )}
            </Card>

            {/* Description */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About This Event
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </Card>

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Registration
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {event.registrationFee}
                  </div>
                  <div className="text-sm text-gray-500">Registration Fee</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Spots Available</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.maxParticipants - event.currentParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {event.currentParticipants} of {event.maxParticipants} registered
                  </div>
                </div>

                <button 
                  disabled={event.status === 'Expired' || deadlineStatus?.text === 'Registration Closed'}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    event.status === 'Expired' || deadlineStatus?.text === 'Registration Closed'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary hover:bg-secondary text-white'
                  }`}
                >
                  {event.status === 'Expired' || deadlineStatus?.text === 'Registration Closed'
                    ? 'Registration Closed'
                    : 'Register Now'
                  }
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By registering, you agree to our terms and conditions
                </p>
              </div>
            </Card>

            {/* Event Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Event Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Views</span>
                  <span className="font-medium text-gray-900 dark:text-white">{event.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Applications</span>
                  <span className="font-medium text-gray-900 dark:text-white">{event.applications || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Created</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Organizer Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Organizer
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {event.organizer}
                  </div>
                  <div className="text-sm text-gray-500">Event Organizer</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Leading technology company focused on innovation and talent development.
              </p>
              <button className="w-full btn-secondary">
                View Profile
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventPreview