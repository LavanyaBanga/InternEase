import React, { useEffect, useState } from 'react'
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
    localStorage.setItem(
      'applied_internships',
      JSON.stringify(appliedInternships)
    )
  }, [appliedInternships])

  const loadMyApplications = async () => {
    const token = localStorage.getItem('internease_token')
    if (!token) return

    try {
      const response = await apiService.getMyApplications()
      const applicationsData = response.data || response

      if (Array.isArray(applicationsData)) {
        const appliedIds = applicationsData
          .map((app) => app.opportunity?._id || app.opportunity)
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
      } else if (
        response.opportunities &&
        Array.isArray(response.opportunities)
      ) {
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
        setAppliedInternships((previous) => [
          ...previous,
          internship._id
        ])

        alert(
          `Successfully applied to "${internship.title}"!\n\nCompany: ${internship.company}\nLocation: ${internship.location}`
        )
      } else {
        alert('Application submitted! Check console for details.')
      }
    } catch (error) {
      console.error('Error applying:', error)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to apply'

      alert(message)
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
    if (!deadline) return 'bg-slate-100 text-slate-700'

    const daysLeft = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    )

    if (daysLeft <= 3) return 'bg-red-50 text-red-700'
    if (daysLeft <= 7) return 'bg-amber-50 text-amber-700'
    return 'bg-emerald-50 text-emerald-700'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredInternships = internships.filter((internship) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const matchesSearch =
      internship.title?.toLowerCase().includes(normalizedSearch) ||
      internship.company?.toLowerCase().includes(normalizedSearch)

    const matchesType =
      selectedFilters.type === 'all' ||
      internship.type === selectedFilters.type

    const matchesLocation =
      selectedFilters.location === 'all' ||
      internship.location
        ?.toLowerCase()
        .includes(selectedFilters.location.toLowerCase())

    const stipendString = internship.stipend
      ? String(internship.stipend)
      : '0'

    const stipendValue =
      parseInt(stipendString.replace(/[₹$,/a-zA-Z]/g, '')) || 0

    let matchesStipend = true

    if (selectedFilters.stipend === '0-10000') {
      matchesStipend = stipendValue >= 0 && stipendValue <= 10000
    } else if (selectedFilters.stipend === '10000-20000') {
      matchesStipend = stipendValue > 10000 && stipendValue <= 20000
    } else if (selectedFilters.stipend === '20000+') {
      matchesStipend = stipendValue > 20000
    }

    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesStipend
    )
  })

  const InternshipCard = ({ internship, isListView = false }) => {
    const isApplied = appliedInternships.includes(internship._id)
    const skills =
      internship.skills?.length > 0
        ? internship.skills
        : internship.requirements || []

    return (
      <Card
        className="h-full !p-4 sm:!p-5 bg-white border border-slate-100 shadow-sm transition-shadow hover:shadow-md"
        onMouseEnter={() =>
          internship._id && handleViewTracking(internship._id)
        }
      >
        <div
          className={
            isListView
              ? 'flex h-full min-w-0 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-6'
              : 'flex h-full min-w-0 flex-col'
          }
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="min-w-0 break-words text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                {internship.title}
              </h3>

              <span
                className={`w-fit shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${getDeadlineColor(
                  internship.lastDate
                )}`}
              >
                {formatDate(internship.lastDate)}
              </span>
            </div>

            <p className="mb-3 break-words text-sm font-medium text-slate-500">
              {internship.company}
            </p>

            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500 sm:text-sm">
              <div className="flex min-w-0 items-center">
                <MapPinIcon className="mr-1 h-4 w-4 shrink-0" />
                <span className="break-words">
                  {internship.location || 'Not specified'}
                </span>
              </div>

              {internship.duration && (
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-4 w-4 shrink-0" />
                  <span>{internship.duration}</span>
                </div>
              )}

              {internship.stipend && (
                <div className="flex items-center">
                  <CurrencyDollarIcon className="mr-1 h-4 w-4 shrink-0" />
                  <span>{internship.stipend}</span>
                </div>
              )}

              <span className="rounded-md bg-sky-50 px-2 py-1 text-xs text-sky-700">
                {internship.workMode || 'Remote'}
              </span>
            </div>

            <p
              className={`mb-3 text-sm leading-6 text-slate-500 ${
                isListView ? 'line-clamp-3 lg:line-clamp-2' : 'line-clamp-3'
              }`}
            >
              {internship.description || 'No description available.'}
            </p>

            {skills.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {skills.slice(0, 5).map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="max-w-full break-words rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div
            className={
              isListView
                ? 'mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between lg:mt-0 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0'
                : 'mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between'
            }
          >
            <span className="break-words text-xs capitalize text-slate-400 sm:text-sm">
              {internship.type || 'Internship'}
            </span>

            <button
              type="button"
              onClick={() => handleApply(internship)}
              disabled={isApplied}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:w-auto lg:w-full ${
                isApplied
                  ? 'cursor-not-allowed bg-emerald-600 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              }`}
            >
              {isApplied ? 'Applied ✓' : 'Apply Now'}
            </button>
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="mb-5 sm:mb-7">
          <h1 className="mb-2 break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Explore Internships
            <span className="ml-2 whitespace-nowrap text-base font-medium text-slate-500 sm:text-lg">
              ({internships.length} total)
            </span>
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Discover amazing internship opportunities from top companies
          </p>
        </header>

        {error && (
          <div className="mb-5 break-words rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700 sm:mb-6 sm:p-4">
            {error}
          </div>
        )}

        <section className="mb-5 space-y-4 sm:mb-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="relative min-w-0 flex-1">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by role or company..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-base"
              />
            </div>

            <div className="flex w-full items-stretch gap-2 sm:w-auto sm:items-center">
              <button
                type="button"
                onClick={() => setShowFilters((previous) => !previous)}
                aria-expanded={showFilters}
                className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none"
              >
                <FunnelIcon className="h-5 w-5 shrink-0" />
                <span>Filters</span>
              </button>

              <div className="flex h-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`flex w-11 items-center justify-center transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`flex w-11 items-center justify-center border-l border-slate-200 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <Card className="!p-4 bg-white border border-slate-100 shadow-sm sm:!p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Type
                  </label>

                  <select
                    value={selectedFilters.type}
                    onChange={(event) =>
                      setSelectedFilters((previous) => ({
                        ...previous,
                        type: event.target.value
                      }))
                    }
                    className="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Types</option>
                    <option value="internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>

                  <select
                    value={selectedFilters.location}
                    onChange={(event) =>
                      setSelectedFilters((previous) => ({
                        ...previous,
                        location: event.target.value
                      }))
                    }
                    className="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Locations</option>
                    <option value="Remote">Remote</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                <div className="min-w-0 sm:col-span-2 xl:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Stipend Range
                  </label>

                  <select
                    value={selectedFilters.stipend}
                    onChange={(event) =>
                      setSelectedFilters((previous) => ({
                        ...previous,
                        stipend: event.target.value
                      }))
                    }
                    className="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
        </section>

        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 sm:text-base">
            Showing {filteredInternships.length}{' '}
            {filteredInternships.length === 1 ? 'internship' : 'internships'}
          </p>

          {(searchTerm ||
            selectedFilters.type !== 'all' ||
            selectedFilters.location !== 'all' ||
            selectedFilters.stipend !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setSelectedFilters({
                  type: 'all',
                  location: 'all',
                  stipend: 'all'
                })
              }}
              className="w-fit text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6'
              : 'space-y-4'
          }
        >
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship._id}
              internship={internship}
              isListView={viewMode === 'list'}
            />
          ))}
        </div>

        {filteredInternships.length === 0 && !loading && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center sm:py-16">
            <MagnifyingGlassIcon className="mx-auto mb-4 h-10 w-10 text-slate-300 sm:h-12 sm:w-12" />

            <h3 className="mb-2 text-base font-medium text-slate-900 sm:text-lg">
              No internships found
            </h3>

            <p className="mx-auto max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InternshipExplorer