import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiService from '../../services/api'
import Card from '../../components/Card'
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

const CreateInternship = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Check if we're in edit mode
  const editMode = location.state?.editMode || false
  const internshipData = location.state?.internshipData || null
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    type: 'internship',
    duration: '',
    stipend: '',
    location: '',
    workMode: 'Remote',
    lastDate: '',
    skills: '',
    requirements: '',
    responsibilities: '',
    poster: null
  })

  // Pre-fill form data when in edit mode
  useEffect(() => {
    if (editMode && internshipData) {
      console.log('Edit mode detected, pre-filling form with:', internshipData)
      
      // Format the date for input field (YYYY-MM-DD)
      let formattedDate = ''
      if (internshipData.deadline || internshipData.lastDate) {
        const date = new Date(internshipData.deadline || internshipData.lastDate)
        formattedDate = date.toISOString().split('T')[0]
      }
      
      setFormData({
        title: internshipData.title || '',
        company: internshipData.company || '',
        description: internshipData.description || '',
        type: internshipData.type || 'internship',
        duration: internshipData.duration || '',
        stipend: internshipData.stipend || '',
        location: internshipData.location || '',
        workMode: internshipData.workMode || 'Remote',
        lastDate: formattedDate,
        skills: Array.isArray(internshipData.skills) ? internshipData.skills.join(', ') : '',
        requirements: Array.isArray(internshipData.requirements) ? internshipData.requirements.join(', ') : '',
        responsibilities: Array.isArray(internshipData.responsibilities) ? internshipData.responsibilities.join(', ') : '',
        poster: null
      })
    }
  }, [editMode, internshipData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB')
        return
      }
      setFormData(prev => ({
        ...prev,
        poster: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.company || !formData.description || !formData.location || !formData.lastDate) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      console.log(editMode ? '=== UPDATING INTERNSHIP ===' : '=== CREATING INTERNSHIP ===')
      console.log('User:', user)
      console.log('User Role:', user?.role)
      console.log('Form Data:', formData)
      console.log('Token exists:', !!localStorage.getItem('internease_token'))

      if (editMode) {
        // Update existing internship
        const updateData = {
          title: formData.title,
          company: formData.company,
          description: formData.description,
          type: formData.type,
          duration: formData.duration,
          stipend: formData.stipend,
          location: formData.location,
          workMode: formData.workMode,
          lastDate: formData.lastDate,
          organizerName: user?.name || 'Unknown',
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
          requirements: formData.requirements ? formData.requirements.split(',').map(r => r.trim()).filter(r => r) : [],
          responsibilities: formData.responsibilities ? formData.responsibilities.split(',').map(r => r.trim()).filter(r => r) : []
        }

        console.log('Update data:', updateData)
        const response = await apiService.updateInternship(internshipData._id, updateData)
        console.log('API Response:', response)
        console.log('Internship updated successfully!')

        alert('Internship updated successfully!')
        navigate('/organizer/manage-internships')
      } else {
        // Create new internship
        // Create FormData for file upload
        const submitData = new FormData()
        submitData.append('title', formData.title)
        submitData.append('company', formData.company)
        submitData.append('description', formData.description)
        submitData.append('type', formData.type)
        submitData.append('duration', formData.duration)
        submitData.append('stipend', formData.stipend)
        submitData.append('location', formData.location)
        submitData.append('workMode', formData.workMode)
        submitData.append('lastDate', formData.lastDate)
        submitData.append('organizerName', user?.name || 'Unknown')
        
        // Convert comma-separated strings to arrays
        if (formData.skills) {
          const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s)
          submitData.append('skills', JSON.stringify(skillsArray))
        }
        if (formData.requirements) {
          const reqArray = formData.requirements.split(',').map(r => r.trim()).filter(r => r)
          submitData.append('requirements', JSON.stringify(reqArray))
        }
        if (formData.responsibilities) {
          const respArray = formData.responsibilities.split(',').map(r => r.trim()).filter(r => r)
          submitData.append('responsibilities', JSON.stringify(respArray))
        }
        
        if (formData.poster) {
          submitData.append('poster', formData.poster)
        }

        // Log FormData contents
        console.log('FormData contents:')
        for (let [key, value] of submitData.entries()) {
          console.log(`  ${key}:`, value)
        }

        console.log('Submitting internship data to API...')
        const response = await apiService.createInternship(submitData)
        console.log('API Response:', response)
        console.log('Internship created successfully!')

        alert('Internship posted successfully!')
        navigate('/organizer/manage-internships')
      }
    } catch (error) {
      console.error(editMode ? '=== ERROR UPDATING INTERNSHIP ===' : '=== ERROR CREATING INTERNSHIP ===')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      alert(error.message || 'Failed to create internship. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Requirements' }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {editMode ? 'Edit Internship' : 'Post New Internship'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {editMode ? 'Update the internship details' : 'Fill in the details to post a new internship opportunity'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  currentStep >= step.number
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step.number
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > step.number
                    ? 'bg-primary'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BriefcaseIcon className="h-4 w-4 inline mr-1" />
                  Internship Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Full Stack Developer Intern"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., TechCorp Solutions"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the internship role and what the intern will do..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 3 months, 6 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                    Stipend
                  </label>
                  <input
                    type="text"
                    value={formData.stipend}
                    onChange={(e) => handleInputChange('stipend', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., ₹10,000/month or Unpaid"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary"
                >
                  Next Step
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Internship Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPinIcon className="h-4 w-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Bangalore, India"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Work Mode
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => handleInputChange('workMode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.lastDate}
                    onChange={(e) => handleInputChange('lastDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="internship">Internship</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <PhotoIcon className="h-4 w-4 inline mr-1" />
                  Company Logo / Poster (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {formData.poster && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.poster.name}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-primary"
                >
                  Next Step
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Requirements */}
        {currentStep === 3 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Requirements & Responsibilities
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Skills (comma-separated)
                </label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., React, Node.js, MongoDB, JavaScript, Git"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate skills with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements (comma-separated)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Bachelor's degree in Computer Science, Strong problem-solving skills, Good communication"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate each requirement with a comma
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Responsibilities (comma-separated)
                </label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Develop web applications, Write clean code, Collaborate with team, Participate in code reviews"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate each responsibility with a comma
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-secondary text-white'
                  }`}
                >
                  {loading ? (editMode ? 'Updating...' : 'Posting...') : (editMode ? 'Update Internship' : 'Post Internship')}
                </button>
              </div>
            </div>
          </Card>
        )}
      </form>
    </div>
  )
}

export default CreateInternship
