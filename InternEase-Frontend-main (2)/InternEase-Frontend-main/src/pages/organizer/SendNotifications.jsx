import React, { useState } from 'react'
import Card from '../../components/Card'
import apiService from '../../services/api'
import { 
  PaperAirplaneIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const SendNotifications = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'students', // Changed from 'audience' to match backend
    type: 'general',
    link: ''
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'students', label: 'All Students' },
    { value: 'organizers', label: 'All Organizers' }
  ]

  const typeOptions = [
    { value: 'general', label: 'General', color: 'text-blue-600' },
    { value: 'event', label: 'Event Related', color: 'text-purple-600' },
    { value: 'internship', label: 'Internship Related', color: 'text-green-600' },
    { value: 'broadcast', label: 'Important Announcement', color: 'text-red-600' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSend = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in title and message')
      return
    }

    setSending(true)
    setError(null)
    
    try {
      console.log('Sending notification:', formData)
      const response = await apiService.createNotification(formData)
      console.log('Notification sent:', response)

      setSent(true)
      
      // Show success message
      alert('Notification sent successfully!')
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        targetAudience: 'students',
        type: 'general',
        link: ''
      })
      
      setTimeout(() => setSent(false), 3000)
    } catch (error) {
      console.error('Error sending notification:', error)
      setError(error.response?.data?.message || 'Failed to send notification')
      alert('Failed to send notification. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const MessagePreview = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Preview
      </h3>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-primary">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${
            formData.type === 'broadcast' ? 'bg-red-500' :
            formData.type === 'internship' ? 'bg-green-500' :
            formData.type === 'event' ? 'bg-purple-500' : 'bg-blue-500'
          }`} />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formData.title || 'Notification Title'}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {formData.message || 'Your notification message will appear here...'}
        </p>
        <div className="mt-3 text-xs text-gray-500">
          Target: {audienceOptions.find(opt => opt.value === formData.targetAudience)?.label} • {new Date().toLocaleDateString()}
        </div>
        {formData.link && (
          <div className="mt-2">
            <span className="text-xs text-primary">🔗 {formData.link}</span>
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Send Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Send important updates and announcements to your audience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Form */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Compose Notification
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter notification title"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Write your message here..."
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/500 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {typeOptions.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="/events or /internships"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Target Audience
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Send to
                </label>
                <div className="space-y-2">
                  {audienceOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <input
                        type="radio"
                        name="targetAudience"
                        value={option.value}
                        checked={formData.targetAudience === option.value}
                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Ready to send?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This notification will be sent to {audienceOptions.find(opt => opt.value === formData.targetAudience)?.label}
                </p>
              </div>
              <button
                onClick={handleSend}
                disabled={sending || !formData.title.trim() || !formData.message.trim()}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  sending || !formData.title.trim() || !formData.message.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-secondary text-white'
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Send Notification</span>
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>

        {/* Preview and Stats */}
        <div className="space-y-6">
          <MessagePreview />

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">This Month</span>
                <span className="font-bold text-gray-900 dark:text-white">24 sent</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Average Open Rate</span>
                <span className="font-bold text-green-600">78%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Last Sent</span>
                <span className="font-bold text-gray-900 dark:text-white">2 hours ago</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Best Practices
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Keep titles under 50 characters
                  </p>
                  <p className="text-xs text-gray-500">
                    Short titles have higher open rates
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Personalize your message
                  </p>
                  <p className="text-xs text-gray-500">
                    Use recipient names when possible
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Avoid spam words
                  </p>
                  <p className="text-xs text-gray-500">
                    Words like "urgent" or "free" may trigger spam filters
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SendNotifications