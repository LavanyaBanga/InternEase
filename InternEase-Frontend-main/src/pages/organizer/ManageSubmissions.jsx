import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../../components/Card'
import { 
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { mockEventSubmissions, mockOrganizerEvents } from '../../data/organizerMockData'

const ManageSubmissions = () => {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('appliedAt')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubmissions, setSelectedSubmissions] = useState([])
  const itemsPerPage = 10

  useEffect(() => {
    // Find the event
    const foundEvent = mockOrganizerEvents.find(e => e.id === parseInt(eventId))
    setEvent(foundEvent)

    // Filter submissions for this event
    const eventSubmissions = mockEventSubmissions.filter(sub => sub.eventId === parseInt(eventId))
    setSubmissions(eventSubmissions)
    setFilteredSubmissions(eventSubmissions)
  }, [eventId])

  useEffect(() => {
    let filtered = submissions.filter(submission => {
      const matchesSearch = submission.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.college.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort submissions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'appliedAt':
          return new Date(b.appliedAt) - new Date(a.appliedAt)
        case 'name':
          return a.applicantName.localeCompare(b.applicantName)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    setFilteredSubmissions(filtered)
    setCurrentPage(1)
  }, [submissions, searchTerm, statusFilter, sortBy])

  const handleStatusChange = (submissionId, newStatus) => {
    const updatedSubmissions = submissions.map(sub =>
      sub.id === submissionId ? { ...sub, status: newStatus } : sub
    )
    setSubmissions(updatedSubmissions)
  }

  const handleBulkAction = (action) => {
    if (selectedSubmissions.length === 0) {
      alert('Please select submissions first')
      return
    }

    const updatedSubmissions = submissions.map(sub =>
      selectedSubmissions.includes(sub.id) ? { ...sub, status: action } : sub
    )
    setSubmissions(updatedSubmissions)
    setSelectedSubmissions([])
  }

  const handleSelectSubmission = (submissionId) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    )
  }

  const handleSelectAll = () => {
    const currentPageSubmissions = getCurrentPageSubmissions().map(sub => sub.id)
    setSelectedSubmissions(prev =>
      prev.length === currentPageSubmissions.length
        ? []
        : currentPageSubmissions
    )
  }

  const getCurrentPageSubmissions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredSubmissions.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const statusCounts = {
    all: submissions.length,
    Pending: submissions.filter(sub => sub.status === 'Pending').length,
    Shortlisted: submissions.filter(sub => sub.status === 'Shortlisted').length,
    Rejected: submissions.filter(sub => sub.status === 'Rejected').length
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Event not found
          </h3>
          <Link to="/manage-events" className="text-primary hover:text-secondary">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Link
            to="/manage-events"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {event.title} - Submissions
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage applications for your event
            </p>
          </div>
        </div>

        {/* Event Info */}
        <Card className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">{event.type[0]}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {event.date} • {event.location} • {event.currentParticipants}/{event.maxParticipants} registered
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{submissions.length}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Card key={status} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {status === 'all' ? 'Total' : status}
              </div>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="appliedAt">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSubmissions.length > 0 && (
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedSubmissions.length} submissions selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('Shortlisted')}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleBulkAction('Rejected')}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Submissions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedSubmissions.length === getCurrentPageSubmissions().length && getCurrentPageSubmissions().length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Applicant
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  College & Year
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Skills
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Applied
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageSubmissions().map((submission) => (
                <tr key={submission.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.includes(submission.id)}
                      onChange={() => handleSelectSubmission(submission.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {submission.applicantName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <EnvelopeIcon className="h-3 w-3 mr-1" />
                          {submission.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {submission.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {submission.college}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.year} • {submission.branch}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {submission.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {submission.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{submission.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={submission.status}
                      onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-medium border-0 focus:ring-2 focus:ring-primary ${getStatusColor(submission.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {new Date(submission.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Download Resume"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                        title="View Details"
                      >
                        <UserIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} submissions
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No submissions found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'No one has applied to this event yet'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default ManageSubmissions