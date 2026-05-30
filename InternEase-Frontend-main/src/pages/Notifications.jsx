import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import apiService from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  BellIcon, 
  CheckIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load notifications from API
  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      console.log('=== LOADING NOTIFICATIONS ===')
      setLoading(true)
      setError(null)
      const response = await apiService.getNotifications()
      console.log('Notifications response:', response)
      console.log('Response type:', typeof response)
      console.log('Response.data:', response.data)
      console.log('Response.data type:', typeof response.data)
      
      // Handle different response structures
      let notificationsData = []
      if (response.data && Array.isArray(response.data)) {
        notificationsData = response.data
      } else if (response.notifications && Array.isArray(response.notifications)) {
        notificationsData = response.notifications
      } else if (Array.isArray(response)) {
        notificationsData = response
      }
      
      console.log('Parsed notifications:', notificationsData)
      console.log('Notifications count:', notificationsData.length)
      
      setNotifications(notificationsData)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      console.error('Error details:', error.response)
      setError(error.response?.data?.message || 'Failed to load notifications')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event':
        return CheckCircleIcon
      case 'internship':
        return InformationCircleIcon
      case 'broadcast':
        return ExclamationTriangleIcon
      case 'application':
        return CheckIcon
      default:
        return BellIcon
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event':
        return 'text-purple-600'
      case 'internship':
        return 'text-green-600'
      case 'broadcast':
        return 'text-red-600'
      case 'application':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const getNotificationBg = (type) => {
    switch (type) {
      case 'event':
        return 'bg-purple-50 dark:bg-purple-900/20'
      case 'internship':
        return 'bg-green-50 dark:bg-green-900/20'
      case 'broadcast':
        return 'bg-red-50 dark:bg-red-900/20'
      case 'application':
        return 'bg-blue-50 dark:bg-blue-900/20'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const markAsRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id)
      
      // Update local state
      const updatedNotifications = notifications.map(notif => 
        notif._id === id ? { ...notif, read: true } : notif
      )
      setNotifications(updatedNotifications)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Mark all as read in local state
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
      setNotifications(updatedNotifications)
      
      // Mark each notification as read in the backend
      for (const notif of notifications) {
        if (!notif.read) {
          await apiService.markNotificationAsRead(notif._id)
        }
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await apiService.deleteNotification(id)
      
      // Update local state
      const updatedNotifications = notifications.filter(notif => notif._id !== id)
      setNotifications(updatedNotifications)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'read') return notif.read
    return true
  })

  const unreadCount = notifications.filter(notif => !notif.read).length

  console.log('=== RENDER STATE ===')
  console.log('Total notifications:', notifications.length)
  console.log('Filtered notifications:', filteredNotifications.length)
  console.log('Unread count:', unreadCount)
  console.log('Current filter:', filter)
  console.log('Loading:', loading)
  console.log('Error:', error)

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications ({notifications.length} total)
          </h1>
          <div className="flex gap-2">
            <button
              onClick={loadNotifications}
              className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
            >
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-primary hover:text-secondary text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          You have {unreadCount} unread notifications
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
              onClick={loadNotifications}
              className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && (
        <>
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {['all', 'unread', 'read'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'unread' && unreadCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)
                const bgColor = getNotificationBg(notification.type)
                
                return (
                  <Card 
                    key={notification._id}
                    className={`${!notification.read ? 'border-l-4 border-l-primary' : ''} ${bgColor}`}
                  >
                    <div className="flex items-start space-x-3">
                  <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm ${!notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>From: {notification.senderName}</span>
                          <span>•</span>
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-primary hover:text-secondary text-sm"
                            title="Mark as read"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-gray-400 hover:text-red-500 text-sm"
                          title="Delete"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {filter === 'unread' 
                ? 'You have no unread notifications' 
                : filter === 'read'
                ? 'You have no read notifications'
                : 'You have no notifications yet'
              }
            </p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  )
}

export default Notifications