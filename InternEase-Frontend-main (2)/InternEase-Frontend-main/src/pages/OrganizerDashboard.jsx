import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Chart from '../components/Chart'
import { 
  PlusIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  UserGroupIcon,
  EyeIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { mockOrganizerStats, mockRecentActivity } from '../data/organizerMockData'

const OrganizerDashboard = () => {
  const { user } = useAuth()
  
  console.log('=== ORGANIZER DASHBOARD ===')
  console.log('User:', user)
  console.log('User role:', user?.role)
  
  if (!user) {
    return <div className="p-6">Loading...</div>
  }
  
  const stats = [
   
  ]

  const quickActions = [
    { 
      name: 'Create Event', 
      icon: CalendarIcon, 
      href: '/create-event', 
      color: 'bg-blue-500',
      description: 'Organize hackathons, workshops, and conferences'
    },
    { 
      name: 'Post Internship', 
      icon: BriefcaseIcon, 
      href: '/organizer/create-internship', 
      color: 'bg-green-500',
      description: 'Find talented interns for your organization'
    },
    { 
      name: 'Send Notifications', 
      icon: PaperAirplaneIcon, 
      href: '/send-notifications', 
      color: 'bg-purple-500',
      description: 'Notify participants about updates'
    },
    { 
      name: 'Manage Events', 
      icon: UserGroupIcon, 
      href: '/manage-events', 
      color: 'bg-orange-500',
      description: 'View and manage all your events'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'application':
        return UserGroupIcon
      case 'event':
        return CalendarIcon
      case 'milestone':
        return CheckCircleIcon
      default:
        return ClockIcon
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'application':
        return 'text-blue-600'
      case 'event':
        return 'text-green-600'
      case 'milestone':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Organizer'} 👋</h1>
        <p className="text-white/90 mb-4">
          Manage your events, track applications, and connect with talented students.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/create-event" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Create Event</span>
          </Link>
          <Link to="/send-notifications" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <PaperAirplaneIcon className="h-5 w-5" />
            <span>Send Update</span>
          </Link>
          <Link to="/manage-events" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Manage Events</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.change.startsWith('+')
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {action.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>

        {/* Application Trends */}
     
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
        {/* Event Types Distribution */}
        
      </div>

      {/* Performance Metrics */}
      
    </div>
  )
}

export default OrganizerDashboard