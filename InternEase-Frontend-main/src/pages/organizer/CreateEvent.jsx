import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiService from '../../services/api'
import Card from '../../components/Card'
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  PhotoIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const CreateEvent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Check if we're in edit mode
  const editMode = location.state?.editMode || false
  const eventData = location.state?.eventData || null
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Conference',
    date: '',
    time: '',
    deadline: '',
    maxParticipants: '',
    location: '',
    registrationFee: '',
    requirements: [''],
    poster: null,
    posterPreview: null,
    organizer: user?.name || 'TechCorp'
  })

  // Pre-populate form if in edit mode
  useEffect(() => {
    if (editMode && eventData) {
      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        type: eventData.type || 'Conference',
        date: eventData.date ? eventData.date.split('T')[0] : '',
        time: eventData.time || '',
        deadline: eventData.deadline ? eventData.deadline.split('T')[0] : '',
        maxParticipants: eventData.maxParticipants || '',
        location: eventData.location || '',
        registrationFee: eventData.registrationFee || '',
        requirements: Array.isArray(eventData.requirements) && eventData.requirements.length > 0 
          ? eventData.requirements 
          : [''],
        poster: null,
        posterPreview: eventData.poster || null,
        organizer: eventData.organizer || user?.name || 'TechCorp'
      })
    }
  }, [editMode, eventData, user])

  const steps = [
    { id: 1, name: 'Event Info', icon: DocumentTextIcon },
    { id: 2, name: 'Requirements', icon: UsersIcon },
    { id: 3, name: 'Upload', icon: PhotoIcon },
    { id: 4, name: 'Preview', icon: EyeIcon }
  ]

  const eventTypes = ['Conference', 'Workshop', 'Hackathon', 'Competition', 'Webinar', 'TechFest']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }))
  }

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }))
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        poster: file
      }))
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      console.log(editMode ? '=== Updating Event ===' : '=== Creating Event ===')
      console.log('User:', user)
      console.log('Token:', localStorage.getItem('internease_token'))
      
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('type', formData.type)
      submitData.append('date', formData.date)
      submitData.append('time', formData.time)
      submitData.append('deadline', formData.deadline)
      submitData.append('maxParticipants', formData.maxParticipants)
      submitData.append('location', formData.location)
      submitData.append('registrationFee', formData.registrationFee || 'Free')
      submitData.append('requirements', JSON.stringify(formData.requirements.filter(r => r.trim())))
      submitData.append('organizerName', user?.name || 'Unknown')
      
      if (formData.poster) {
        submitData.append('poster', formData.poster)
        console.log('Poster file:', formData.poster.name)
      }
      
      // Send to backend
      console.log('Sending request to backend...')
      let response
      if (editMode && eventData?._id) {
        response = await apiService.updateEvent(eventData._id, submitData)
        console.log('Event updated successfully:', response)
        alert('Event updated successfully!')
      } else {
        response = await apiService.createEvent(submitData)
        console.log('Event created successfully:', response)
        alert('Event created successfully!')
      }
      
      navigate('/manage-events')
    } catch (error) {
      console.error(editMode ? 'Failed to update event:' : 'Failed to create event:', error)
      alert(error.message || `Failed to ${editMode ? 'update' : 'create'} event. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = currentStep === step.id
        const isCompleted = currentStep > step.id
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              isCompleted 
                ? 'bg-green-500 border-green-500' 
                : isActive 
                ? 'bg-primary border-primary' 
                : 'bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
            }`}>
              <Icon className={`h-5 w-5 ${
                isCompleted || isActive ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <span className={`ml-2 text-sm font-medium ${
              isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your event"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Online / City name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Participants *
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration Fee
                </label>
                <input
                  type="text"
                  value={formData.registrationFee}
                  onChange={(e) => handleInputChange('registrationFee', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Free / ₹500"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Event Requirements
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter requirement"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      onClick={() => removeRequirement(index)}
                      className="px-3 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addRequirement}
                className="text-primary hover:text-secondary font-medium text-sm"
              >
                + Add Requirement
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Event Poster
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                {formData.poster ? (
                  <div>
                    <img 
                      src={URL.createObjectURL(formData.poster)} 
                      alt="Event poster preview"
                      className="max-w-full h-64 object-cover mx-auto rounded-lg mb-4"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formData.poster.name}
                    </p>
                    <button
                      onClick={() => handleInputChange('poster', null)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Upload event poster (optional)
                    </p>
                    <label className="btn-primary cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Event Preview
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-start space-x-4 mb-4">
                {formData.poster && (
                  <img 
                    src={URL.createObjectURL(formData.poster)} 
                    alt="Event poster"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {formData.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {formData.type}
                    </span>
                    <span>{formData.date} at {formData.time}</span>
                    <span>{formData.location}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {formData.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formData.maxParticipants}
                  </div>
                  <div className="text-sm text-gray-500">Max Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formData.registrationFee || 'Free'}
                  </div>
                  <div className="text-sm text-gray-500">Registration Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formData.deadline}
                  </div>
                  <div className="text-sm text-gray-500">Deadline</div>
                </div>
              </div>

              {formData.requirements.filter(req => req.trim()).length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                    Requirements:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                    {formData.requirements.filter(req => req.trim()).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {editMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {editMode 
            ? 'Update your event details and settings' 
            : 'Create and publish your event to attract talented participants'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <StepIndicator />
          
          <div className="mb-8">
            {renderStepContent()}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 btn-primary"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                {editMode ? 'Update Event' : 'Create Event'}
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CreateEvent