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
      
      // Handle different response structures
      let notificationsData = []
      if (response.data && Array.isArray(response.data)) {
        notificationsData = response.data
      } else if (response.notifications && Array.isArray(response.notifications)) {
        notificationsData = response.notifications
      } else if (Array.isArray(response)) {
        notificationsData = response
      }
      
      setNotifications(notificationsData)
    } catch (error) {
      console.error('Failed to load notifications:', error)
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
        return 'text-indigo-600'
      default:
        return 'text-slate-500'
    }
  }

  const getNotificationBg = (type) => {
    switch (type) {
      case 'event':
        return 'bg-purple-50'
      case 'internship':
        return 'bg-green-50'
      case 'broadcast':
        return 'bg-red-50'
      case 'application':
        return 'bg-indigo-50'
      default:
        return 'bg-slate-50'
    }
  }

  const markAsRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id)
      
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
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
      setNotifications(updatedNotifications)
      
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

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto mb-6 w-full max-w-6xl">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
            Notifications ({notifications.length} total)
          </h1>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              onClick={loadNotifications}
              className="w-full rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 sm:w-auto"
            >
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="w-full rounded-lg px-3 py-2 text-center text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-500 sm:text-base">
          You have {unreadCount} unread notifications
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mx-auto mb-6 w-full max-w-6xl rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadNotifications}
              className="w-full rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 sm:w-auto"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && (
        <>
          <div className="mx-auto mb-6 w-full max-w-6xl overflow-x-auto">
            <div className="flex min-w-max gap-1 rounded-xl border border-slate-200 bg-white p-1 sm:min-w-0">
              {['all', 'unread', 'read'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === tab
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-indigo-600'
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
          <div className="mx-auto w-full max-w-6xl space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)
                const bgColor = getNotificationBg(notification.type)
                
                return (
                  <Card 
                    key={notification._id}
                    className={`${!notification.read ? 'border-l-4 border-l-indigo-600' : ''} ${bgColor} border border-slate-100 !p-4 shadow-sm sm:!p-5`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className={`break-words text-sm font-semibold sm:text-base ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                              {notification.title}
                            </h3>
                            <p className={`mt-1 break-words text-sm leading-6 ${!notification.read ? 'text-slate-700' : 'text-slate-500'}`}>
                              {notification.message}
                            </p>
                            <div className="mt-2 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                              <span>From: {notification.senderName}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{new Date(notification.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-2 self-end sm:self-start">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-indigo-600"
                                title="Mark as read"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-red-500"
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
              <div className="mx-auto w-full max-w-6xl rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center">
                <BellIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No notifications
                </h3>
                <p className="text-slate-500">
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