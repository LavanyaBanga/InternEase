import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  PencilIcon,
  DocumentArrowUpIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [uploadedResume, setUploadedResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    
  
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    education: [
      {
        degree: 'Bachelor of Technology',
        field: 'Computer Science',
        school: 'IIT Bombay',
        year: '2020-2024'
      }
    ],
    experience: [
      {
        title: 'Software Developer Intern',
        company: 'TechCorp',
        duration: 'Jun 2023 - Aug 2023',
        description: 'Developed React applications and REST APIs'
      }
    ],
    achievements: [
      { title: 'Winner - React Hackathon 2023', date: '2023' },
      { title: 'Certified AWS Cloud Practitioner', date: '2023' },
      { title: 'Top 100 - Google Code Jam', date: '2022' }
    ]
  })

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }))
    }
  }, [user])

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false)
  }

  const handleAddSkill = () => {
    const skill = prompt('Enter a new skill:')
    if (skill && skill.trim()) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skill.trim()]
      })
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleResumeUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB')
        return
      }

      setUploading(true)
      
      // Simulate upload process
      setTimeout(() => {
        setUploadedResume({
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type,
          uploadDate: new Date().toLocaleDateString()
        })
        setUploading(false)
        alert('Resume uploaded successfully!')
      }, 1500)
    }
  }

  const handleRemoveResume = () => {
    if (window.confirm('Are you sure you want to remove your resume?')) {
      setUploadedResume(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your profile information and showcase your achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {profileData.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {user?.role === 'student' ? 'Student' : 'Organizer'}
            </p>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="text-center">
                
               
              </div>
              <div className="text-center">
              
              </div>
              <div className="text-center">
               
               
              </div>
            </div>
            
            {/* Edit Profile Button */}
            <div className="w-full mb-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary w-full flex items-center justify-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {/* Resume Upload Button */}
            <div className="w-full">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
              <label
                htmlFor="resume-upload"
                className={`btn-secondary w-full flex items-center justify-center cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : uploadedResume ? 'Change Resume' : 'Upload Resume'}
              </label>
            </div>

            {/* Resume Info */}
            {uploadedResume && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-400">
                      {uploadedResume.name}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      {uploadedResume.size} • Uploaded on {uploadedResume.uploadDate}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveResume}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{profileData.name}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{profileData.email}</span>
                  </div>
                )}
              </div>
              
            </div>
            
         
            
            {isEditing && (
              <div className="mt-4">
                <button onClick={handleSave} className="btn-primary mr-2">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            )}
          </Card>

          {/* Skills */}
         
             
              

          {/* Achievements */}
         
        </div>
      </div>
    </div>
  )
}

export default Profile