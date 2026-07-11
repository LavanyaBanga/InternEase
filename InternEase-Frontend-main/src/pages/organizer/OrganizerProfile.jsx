import React, { useState, useEffect } from 'react'
import Card from '../../components/Card'
import {
  BuildingOfficeIcon,
  UsersIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import apiService from '../../services/api'

const OrganizerProfile = () => {
  const [userData, setUserData] = useState(null)
  const [eventCount, setEventCount] = useState(0)
  const [internshipCount, setInternshipCount] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.getProfile()
        const user = response.success ? response.data : response
        setUserData(user)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    const fetchEventCount = async () => {
      try {
        const response = await apiService.getOrganizerEvents()
        const events = response.data || response.events || []
        setEventCount(events.length)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    const fetchInternshipCount = async () => {
      try {
        const response = await apiService.getOrganizerInternships()
        const internships = response.data || response.opportunities || []
        setInternshipCount(internships.length)
      } catch (error) {
        console.error('Error fetching internships:', error)
      }
    }

    fetchUserData()
    fetchEventCount()
    fetchInternshipCount()
  }, [])

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Organization Profile
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Your organization's profile
        </p>
      </div>

      <Card className="w-full max-w-md mx-auto sm:mx-0">
        <div className="text-center py-4">
          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mx-auto mb-4">
            <BuildingOfficeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 break-words px-2">
            {userData?.name || 'Loading...'}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 break-words px-2">
            {userData?.email || ''}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 px-2">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <BriefcaseIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{internshipCount}</div>
              <div className="text-xs sm:text-sm text-gray-500">Internships</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{eventCount}</div>
              <div className="text-xs sm:text-sm text-gray-500">Events</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default OrganizerProfile