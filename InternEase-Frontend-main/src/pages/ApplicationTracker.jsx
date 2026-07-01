import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import apiService from '../services/api'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'

const ApplicationTracker = () => {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    loadInternships()
  }, [])

  const loadInternships = async () => {
    try {
      setLoading(true)
      
      const response = await apiService.getMyApplications()
      console.log('Full response:', JSON.stringify(response, null, 2))
      console.log('My applications response:', response)
      
      let applicationsData = []
      if (response.data && Array.isArray(response.data)) {
        applicationsData = response.data
      } else if (Array.isArray(response)) {
        applicationsData = response
      }
      
      const internshipApplications = applicationsData.map(application => {
        const snapshot = application.opportunitySnapshot || {}
        const opportunity = application.opportunity || {}
        
        return {
          id: application._id,
          company: snapshot.company || opportunity.company || opportunity.organizer?.organizationName || opportunity.organizer?.name || 'Company Name',
          position: snapshot.title || opportunity.title || 'Position',
          type: snapshot.type || opportunity.type || 'Internship',
          location: snapshot.location || opportunity.location || 'Remote',
          appliedDate: application.createdAt ? new Date(application.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          deadline: snapshot.deadline || opportunity.deadline,
          status: application.status === 'applied' ? 'Applied' : 
                  application.status === 'accepted' ? 'Selected' : 
                  application.status === 'rejected' ? 'Rejected' :
                  application.status === 'in_review' ? 'In Review' :
                  application.status === 'interview' ? 'Interview' : 'Applied',
          stipend: snapshot.stipend || opportunity.stipend || 'Unpaid',
          duration: snapshot.duration || opportunity.duration || 'Not specified',
          description: snapshot.description || opportunity.description || '',
          requirements: snapshot.requirements || opportunity.requirements || [],
          skills: snapshot.skills || opportunity.skills || [],
          responsibilities: snapshot.responsibilities || opportunity.responsibilities || [],
          coverLetter: application.coverLetter || '',
          resume: application.resume || '',
          notes: application.notes || ''
        }
      })
      
      console.log('Converted applications:', internshipApplications)
      setInternships(internshipApplications)
    } catch (error) {
      console.error('Error loading applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    setShowDetailsModal(true)
  }

  const closeModal = () => {
    setShowDetailsModal(false)
    setSelectedApplication(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800'
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Interview':
        return 'bg-purple-100 text-purple-800'
      case 'Selected':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return ClockIcon
      case 'In Review':
        return EyeIcon
      case 'Interview':
        return ClockIcon
      case 'Selected':
        return CheckCircleIcon
      case 'Rejected':
        return XCircleIcon
      default:
        return ClockIcon
    }
  }

  // Only real API data — no mock data merged in
  const allApplications = internships

  const filteredApplications = allApplications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const statusCounts = {
    all: allApplications.length,
    'Applied': allApplications.filter(app => app.status === 'Applied').length,
    'In Review': allApplications.filter(app => app.status === 'In Review').length,
    'Interview': allApplications.filter(app => app.status === 'Interview').length,
    'Selected': allApplications.filter(app => app.status === 'Selected').length,
    'Rejected': allApplications.filter(app => app.status === 'Rejected').length
  }

  const TimelineStep = ({ status, isActive, isCompleted }) => {
    const Icon = getStatusIcon(status)
    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          isCompleted 
            ? 'bg-green-500 border-green-500' 
            : isActive 
            ? 'bg-primary border-primary' 
            : 'bg-gray-200 border-gray-200'
        }`}>
          <Icon className={`h-4 w-4 ${isCompleted || isActive ? 'text-white' : 'text-gray-400'}`} />
        </div>
        <span className={`ml-2 text-sm ${isActive ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500'}`}>
          {status}
        </span>
      </div>
    )
  }

  const ApplicationCard = ({ application }) => {
    const stages = ['Applied', 'In Review', 'Interview', 'Selected']
    const currentStageIndex = stages.indexOf(application.status)
    const isRejected = application.status === 'Rejected'
    
    return (
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {application.internshipTitle || application.position}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {application.company}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Applied: {application.appliedDate}</span>
              {application.deadline && <span>Deadline: {application.deadline}</span>}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Application Progress
          </h4>
          {isRejected ? (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500">
                <XCircleIcon className="h-4 w-4 text-white" />
              </div>
              <span className="ml-2 text-sm text-red-600 font-medium">Rejected</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-3 sm:space-y-0 flex-wrap">
              {stages.map((stage, index) => (
                <TimelineStep
                  key={stage}
                  status={stage}
                  isActive={index === currentStageIndex}
                  isCompleted={index < currentStageIndex}
                />
              ))}
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Next Step
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {application.nextStep || 'Waiting for response'}
              </p>
            </div>
            <div className="flex space-x-2">
              {application.status === 'Selected' && (
                <button className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  Download Offer
                </button>
              )}
              <button 
                onClick={() => handleViewDetails(application)}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Application Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track the status of all your internship applications
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
              {['all', 'Applied', 'In Review', 'Interview', 'Selected', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === status
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                  {statusCounts[status] > 0 && (
                    <span className="ml-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                      {statusCounts[status]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))
            ) : (
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No applications found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {filter === 'all' 
                    ? "You haven't applied to any internships yet" 
                    : `You have no applications with status "${filter}"`
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-cardDark rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-cardDark border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Company & Position */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedApplication.internshipTitle || selectedApplication.position}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  {selectedApplication.company}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>

              {/* Application Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Applied Date</p>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.appliedDate}</p>
                </div>
                {selectedApplication.deadline && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                    <p className="text-gray-900 dark:text-white">{selectedApplication.deadline}</p>
                  </div>
                )}
              </div>

              {/* Next Step */}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Next Step</p>
                <p className="text-gray-900 dark:text-white">{selectedApplication.nextStep || 'Waiting for response'}</p>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Application Progress</p>
                {selectedApplication.status === 'Rejected' ? (
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500">
                      <XCircleIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="ml-2 text-sm text-red-600 font-medium">Rejected</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {['Applied', 'In Review', 'Interview', 'Selected'].map((stage, index) => {
                      const stages = ['Applied', 'In Review', 'Interview', 'Selected']
                      const currentStageIndex = stages.indexOf(selectedApplication.status)
                      const isCompleted = index < currentStageIndex
                      const isActive = index === currentStageIndex
                      
                      return (
                        <div key={stage} className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500' 
                              : isActive 
                              ? 'bg-primary border-primary' 
                              : 'bg-gray-200 border-gray-200'
                          }`}>
                            {isCompleted ? (
                              <CheckCircleIcon className="h-4 w-4 text-white" />
                            ) : (
                              <ClockIcon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            )}
                          </div>
                          <span className={`ml-3 ${isActive ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                            {stage}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {selectedApplication.status === 'Selected' && (
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Download Offer Letter
                  </button>
                )}
                <button 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationTracker