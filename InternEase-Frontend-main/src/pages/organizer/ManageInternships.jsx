import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../../services/api'
import Card from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const ManageInternships = () => {
  const navigate = useNavigate()
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, active, closed, draft
  const [locationFilter, setLocationFilter] = useState('all')
  const [showApplicantsModal, setShowApplicantsModal] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [viewedInternships, setViewedInternships] = useState(new Set())

  useEffect(() => {
    loadInternships()
    // Load viewed internships from localStorage
    const viewed = localStorage.getItem('viewedInternships')
    if (viewed) {
      setViewedInternships(new Set(JSON.parse(viewed)))
    }
  }, [])

  const loadInternships = async () => {
    try {
      console.log('=== LOADING ORGANIZER INTERNSHIPS ===')
      setLoading(true)
      setError(null)
      
      const response = await apiService.getOrganizerInternships()
      console.log('Response:', response)
      
      let internshipsData = []
      if (response.data && Array.isArray(response.data)) {
        internshipsData = response.data
      } else if (response.opportunities && Array.isArray(response.opportunities)) {
        internshipsData = response.opportunities
      } else if (Array.isArray(response)) {
        internshipsData = response
      }
      
      console.log('Loaded internships:', internshipsData)
      setInternships(internshipsData)
    } catch (error) {
      console.error('Error loading internships:', error)
      setError(error.message || 'Failed to load internships')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) {
      return
    }

    try {
      console.log('Deleting internship:', id)
      await apiService.deleteInternship(id)
      alert('Internship deleted successfully')
      loadInternships() // Reload the list
    } catch (error) {
      console.error('Error deleting internship:', error)
      alert(error.message || 'Failed to delete internship')
    }
  }

  const handleEdit = (internship) => {
    console.log('Edit internship:', internship)
    navigate('/organizer/create-internship', {
      state: {
        editMode: true,
        internshipData: internship
      }
    })
  }

  const handleViewApplicants = async (internship) => {
    setSelectedInternship(internship)
    setShowApplicantsModal(true)
    setLoadingApplicants(true)
    
    try {
      // Fetch applications for this internship
      const response = await apiService.getApplicationsByOpportunity(internship._id)
      console.log('Applications response:', response)
      
      // Extract applicant data
      const applicantsData = response.data || response.applications || []
      setApplicants(applicantsData)
    } catch (error) {
      console.error('Error loading applicants:', error)
      setApplicants([])
    } finally {
      setLoadingApplicants(false)
    }
  }

  const closeApplicantsModal = () => {
    setShowApplicantsModal(false)
    setSelectedInternship(null)
    setApplicants([])
  }

  const handleInternshipHover = async (internshipId) => {
    // Check if this internship has already been viewed by this user
    if (viewedInternships.has(internshipId)) {
      return // Already counted this view
    }

    try {
      // Increment view count on backend
      await apiService.incrementOpportunityViews(internshipId)
      
      // Mark as viewed locally
      const newViewed = new Set(viewedInternships)
      newViewed.add(internshipId)
      setViewedInternships(newViewed)
      
      // Save to localStorage
      localStorage.setItem('viewedInternships', JSON.stringify([...newViewed]))
      
      // Reload internships to get updated count
      loadInternships()
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const filteredInternships = internships.filter(internship => {
    // Status filter
    const matchesStatus = filter === 'all' || internship.status?.toLowerCase() === filter.toLowerCase()
    
    // Location filter
    const matchesLocation = locationFilter === 'all' || 
                           internship.location?.toLowerCase().includes(locationFilter.toLowerCase())
    
    return matchesStatus && matchesLocation
  })

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(internships.map(i => i.location).filter(Boolean))]

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Internships
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your posted internship opportunities
          </p>
        </div>
        <button
          onClick={() => navigate('/organizer/create-internship')}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Post New Internship
        </button>
      </div>

      {/* Filter Tabs and Location Dropdown */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'closed', 'draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                filter === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab} ({internships.filter(i => tab === 'all' || i.status?.toLowerCase() === tab.toLowerCase()).length})
            </button>
          ))}
        </div>

        {/* Location Filter Dropdown */}
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-gray-500" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Internships List */}
      {filteredInternships.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'No internships posted yet' : `No ${filter} internships`}
            </p>
            <button
              onClick={() => navigate('/organizer/create-internship')}
              className="btn-primary"
            >
              Post Your First Internship
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInternships.map((internship) => (
            <Card 
              key={internship._id}
              onMouseEnter={() => handleInternshipHover(internship._id)}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Poster/Logo */}
                {internship.poster && (
                  <div className="flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace(/\/api$/, '')}/${internship.poster}`}
                      alt={internship.company}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {internship.title}
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {internship.company}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(internship.status)}`}>
                      {internship.status || 'Active'}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {internship.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{internship.location}</span>
                    </div>
                    {internship.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4" />
                        <span>{internship.duration}</span>
                      </div>
                    )}
                    {internship.stipend && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>{internship.stipend}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Deadline: {formatDate(internship.lastDate)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <UserGroupIcon className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">
                        {internship.applicants?.length || 0} Applicants
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <EyeIcon className="h-5 w-5 text-green-500" />
                      <span className="font-semibold">
                        {internship.views || 0} Views
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  {internship.skills && internship.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {internship.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {internship.skills.length > 5 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                          +{internship.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(internship)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(internship._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewApplicants(internship)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                    >
                      <UserGroupIcon className="h-4 w-4" />
                      View Applicants ({internship.applicants?.length || 0})
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-cardDark rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Applicants
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedInternship?.title}
                </p>
              </div>
              <button
                onClick={closeApplicantsModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {loadingApplicants ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No applicants yet for this internship
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applicants.map((application, index) => (
                    <div
                      key={application._id || index}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                          {(application.user?.name || application.studentName || 'Unknown').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {application.user?.name || application.studentName || 'Unknown Student'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {application.user?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {application.status || 'Applied'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeApplicantsModal}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageInternships
