import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import apiService from '../services/api'
import {
  MapPinIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const InternshipExplorer = () => {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    location: 'all',
    stipend: 'all'
  })
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [appliedInternships, setAppliedInternships] = useState(() => {
    const saved = localStorage.getItem('applied_internships')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    loadInternships()
    loadMyApplications()
  }, [])

  useEffect(() => {
    localStorage.setItem('applied_internships', JSON.stringify(appliedInternships))
  }, [appliedInternships])

  const loadMyApplications = async () => {
    const token = localStorage.getItem('internease_token')
    if (!token) return
    try {
      const response = await apiService.getMyApplications()
      const applicationsData = response.data || response
      if (Array.isArray(applicationsData)) {
        const appliedIds = applicationsData
          .map(app => app.opportunity?._id || app.opportunity)
          .filter(Boolean)
        setAppliedInternships(appliedIds)
      }
    } catch (error) {
      console.error('Error loading my applications:', error)
    }
  }

  const loadInternships = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getInternships()

      let internshipsData = []
      if (response.data && Array.isArray(response.data)) {
        internshipsData = response.data
      } else if (response.opportunities && Array.isArray(response.opportunities)) {
        internshipsData = response.opportunities
      } else if (Array.isArray(response)) {
        internshipsData = response
      }

      setInternships(internshipsData)
    } catch (error) {
      console.error('Error loading internships:', error)
      setError(error.message || 'Failed to load internships')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (internship) => {
    if (appliedInternships.includes(internship._id)) {
      alert(`You've already applied to "${internship.title}"`)
      return
    }
    try {
      const response = await apiService.applyForInternship(internship._id)
      if (response && (response.success || response.data)) {
        setAppliedInternships([...appliedInternships, internship._id])
        alert(`Successfully applied to "${internship.title}"!\n\nCompany: ${internship.company}\nLocation: ${internship.location}`)
      } else {
        alert('Application submitted! Check console for details.')
      }
    } catch (error) {
      console.error('Error applying:', error)
      const msg = error?.response?.data?.message || error?.message || 'Failed to apply'
      alert(msg)
    }
  }

  const handleViewTracking = async (internshipId) => {
    try {
      await apiService.trackInternshipView(internshipId)
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const getDeadlineColor = (deadline) => {
    if (!deadline) return 'bg-gray-100 text-gray-800'
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 3) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const filteredInternships = internships.filter(internship => {
    const matchesSearch =
      internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      selectedFilters.type === 'all' || internship.type === selectedFilters.type

    const matchesLocation =
      selectedFilters.location === 'all' ||
      internship.location?.toLowerCase().includes(selectedFilters.location.toLowerCase())

    const stipendStr = internship.stipend ? String(internship.stipend) : '0'
    const stipendValue = parseInt(stipendStr.replace(/[₹$,/a-zA-Z]/g, '')) || 0

    let matchesStipend = true
    if (selectedFilters.stipend === '0-10000') {
      matchesStipend = stipendValue >= 0 && stipendValue <= 10000
    } else if (selectedFilters.stipend === '10000-20000') {
      matchesStipend = stipendValue > 10000 && stipendValue <= 20000
    } else if (selectedFilters.stipend === '20000+') {
      matchesStipend = stipendValue > 20000
    }

    return matchesSearch && matchesType && matchesLocation && matchesStipend
  })

  const InternshipCard = ({ internship, isListView = false }) => {
    const imageUrl = internship.poster
      ? internship.poster.startsWith('http')
        ? internship.poster
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${internship.poster}`
      : null

    return (
      <Card
        className={`!p-3 ${isListView ? 'flex items-center space-x-3' : ''}`}
        onMouseEnter={() => internship._id && handleViewTracking(internship._id)}
      >
        
          
       

        <div className={`${isListView ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex-1 leading-tight">
              {internship.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs ml-2 whitespace-nowrap ${getDeadlineColor(internship.lastDate)}`}>
              {formatDate(internship.lastDate)}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{internship.company}</p>

          <div className="flex items-center flex-wrap gap-2 mb-1 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <MapPinIcon className="h-3.5 w-3.5 mr-0.5" />
              {internship.location}
            </div>
            {internship.duration && (
              <div className="flex items-center">
                <ClockIcon className="h-3.5 w-3.5 mr-0.5" />
                {internship.duration}
              </div>
            )}
            {internship.stipend && (
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-3.5 w-3.5 mr-0.5" />
                {internship.stipend}
              </div>
            )}
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">
              {internship.workMode || 'Remote'}
            </span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 line-clamp-2">
            {internship.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {(internship.skills?.length > 0 ? internship.skills : internship.requirements || [])
              .slice(0, 5)
              .map((item, index) => (
                <span key={index} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs">
                  {item}
                </span>
              ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 capitalize">{internship.type}</span>
            <button
              onClick={() => handleApply(internship)}
              disabled={appliedInternships.includes(internship._id)}
              className={
                appliedInternships.includes(internship._id)
                  ? 'btn-primary !bg-green-600 hover:!bg-green-600 cursor-not-allowed'
                  : 'btn-primary'
              }
            >
              {appliedInternships.includes(internship._id) ? 'Applied ✓' : 'Apply Now'}
            </button>
          </div>
        </div>
      </Card>
    )
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Explore Internships ({internships.length} total)
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover amazing internship opportunities from top companies
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select
                  value={selectedFilters.type}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <select
                  value={selectedFilters.location}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Locations</option>
                  <option value="Remote">Remote</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stipend Range</label>
                <select
                  value={selectedFilters.stipend}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, stipend: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Ranges</option>
                  <option value="0-10000">₹0 - ₹10,000</option>
                  <option value="10000-20000">₹10,000 - ₹20,000</option>
                  <option value="20000+">₹20,000+</option>
                </select>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          Showing {filteredInternships.length} internships
        </p>
      </div>

      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-0'}`}>
        {filteredInternships.map((internship) => (
          <InternshipCard
            key={internship._id}
            internship={internship}
            isListView={viewMode === 'list'}
          />
        ))}
      </div>

      {filteredInternships.length === 0 && !loading && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No internships found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  )
}

export default InternshipExplorer