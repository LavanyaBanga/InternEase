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
      }
      
      let response
      if (editMode && eventData?._id) {
        response = await apiService.updateEvent(eventData._id, submitData)
        alert('Event updated successfully!')
      } else {
        response = await apiService.createEvent(submitData)
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
    <div className="flex items-start sm:items-center justify-center mb-8 overflow-x-auto">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = currentStep === step.id
        const isCompleted = currentStep > step.id
        
        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                isCompleted 
                  ? 'bg-green-500 border-green-500' 
                  : isActive 
                  ? 'bg-indigo-600 border-indigo-600' 
                  : 'bg-slate-100 border-slate-200'
              }`}>
                <Icon className={`h-5 w-5 ${
                  isCompleted || isActive ? 'text-white' : 'text-slate-400'
                }`} />
              </div>
              <span className={`mt-1 sm:mt-0 sm:ml-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap ${
                isActive ? 'text-slate-900' : 'text-slate-500'
              }`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-6 sm:w-12 h-0.5 mx-2 sm:mx-4 flex-shrink-0 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-slate-200'
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your event"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Event Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Online / City name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Participants *
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Registration Fee
                </label>
                <input
                  type="text"
                  value={formData.registrationFee}
                  onChange={(e) => handleInputChange('registrationFee', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Event Requirements
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 min-w-0 px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter requirement"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      onClick={() => removeRequirement(index)}
                      className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addRequirement}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
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
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Event Poster
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 sm:p-8 text-center">
                {formData.poster ? (
                  <div>
                    <img 
                      src={URL.createObjectURL(formData.poster)} 
                      alt="Event poster preview"
                      className="max-w-full h-64 object-cover mx-auto rounded-lg mb-4"
                    />
                    <p className="text-sm text-slate-500">
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
                    <PhotoIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">
                      Upload event poster (optional)
                    </p>
                    <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer inline-block">
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Event Preview
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                {formData.poster && (
                  <img 
                    src={URL.createObjectURL(formData.poster)} 
                    alt="Event poster"
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    {formData.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-2">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                      {formData.type}
                    </span>
                    <span>{formData.date} at {formData.time}</span>
                    <span>{formData.location}</span>
                  </div>
                  <p className="text-slate-500 mb-4">
                    {formData.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900">
                    {formData.maxParticipants}
                  </div>
                  <div className="text-sm text-slate-500">Max Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900">
                    {formData.registrationFee || 'Free'}
                  </div>
                  <div className="text-sm text-slate-500">Registration Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900">
                    {formData.deadline}
                  </div>
                  <div className="text-sm text-slate-500">Deadline</div>
                </div>
              </div>

              {formData.requirements.filter(req => req.trim()).length > 0 && (
                <div>
                  <h5 className="font-medium text-slate-900 mb-2">
                    Requirements:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-slate-500">
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
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          {editMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-slate-500">
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

          <div className="flex justify-between gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 sm:px-6 py-3 rounded-lg transition-colors"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 sm:px-6 py-3 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : editMode ? 'Update Event' : 'Create Event'}
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CreateEvent