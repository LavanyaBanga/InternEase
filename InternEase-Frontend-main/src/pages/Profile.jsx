import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import {
  UserIcon,
  EnvelopeIcon,
  PencilIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  PlusIcon
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

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }))
    }
  }, [user])

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleAddSkill = () => {
    const skill = prompt('Enter a new skill:')

    if (skill && skill.trim()) {
      const newSkill = skill.trim()

      const alreadyExists = profileData.skills.some(
        (item) => item.toLowerCase() === newSkill.toLowerCase()
      )

      if (alreadyExists) {
        alert('This skill is already added')
        return
      }

      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }))
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove)
    }))
  }

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB')
      event.target.value = ''
      return
    }

    setUploading(true)

    setTimeout(() => {
      setUploadedResume({
        name: file.name,
        size:
          file.size >= 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
        uploadDate: new Date().toLocaleDateString('en-IN')
      })

      setUploading(false)
      event.target.value = ''
      alert('Resume uploaded successfully!')
    }, 1500)
  }

  const handleRemoveResume = () => {
    if (window.confirm('Are you sure you want to remove your resume?')) {
      setUploadedResume(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-8 lg:px-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your profile information and showcase your achievements.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          <aside className="lg:col-span-1">
            <Card className="border border-slate-100 bg-white !p-5 shadow-sm sm:!p-6 lg:sticky lg:top-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 sm:h-24 sm:w-24">
                  <UserIcon className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                </div>

                <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                  {profileData.name}
                </h2>

                <p className="mt-1 text-sm capitalize text-slate-500 sm:text-base">
                  {user?.role === 'student' ? 'Student' : 'Organizer'}
                </p>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <PencilIcon className="mr-2 h-4 w-4" />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </button>

                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={uploading}
                    className="hidden"
                  />

                  <label
                    htmlFor="resume-upload"
                    className={`flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors ${
                      uploading
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer hover:bg-slate-50 hover:text-indigo-600'
                    }`}
                  >
                    <DocumentArrowUpIcon className="mr-2 h-5 w-5" />
                    {uploading
                      ? 'Uploading...'
                      : uploadedResume
                        ? 'Change Resume'
                        : 'Upload Resume'}
                  </label>
                </div>

                {uploadedResume && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-emerald-800">
                          {uploadedResume.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-emerald-600">
                          {uploadedResume.size} • Uploaded on{' '}
                          {uploadedResume.uploadDate}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        className="flex-shrink-0 rounded-md p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                        aria-label="Remove resume"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  PDF, DOC or DOCX. Maximum size: 5MB.
                </p>
              </div>
            </Card>
          </aside>

          <section className="space-y-5 lg:col-span-2 lg:space-y-6">
            <Card className="border border-slate-100 bg-white !p-4 shadow-sm sm:!p-6">
              <h3 className="mb-5 text-lg font-semibold text-slate-900">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 sm:text-base"
                    />
                  ) : (
                    <div className="flex min-h-12 items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                      <UserIcon className="h-5 w-5 flex-shrink-0 text-slate-400" />
                      <span className="min-w-0 break-words text-sm text-slate-900 sm:text-base">
                        {profileData.name}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 sm:text-base"
                    />
                  ) : (
                    <div className="flex min-h-12 items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                      <EnvelopeIcon className="h-5 w-5 flex-shrink-0 text-slate-400" />
                      <span className="min-w-0 break-all text-sm text-slate-900 sm:text-base">
                        {profileData.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 sm:w-auto"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </Card>

            <Card className="border border-slate-100 bg-white !p-4 shadow-sm sm:!p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Skills
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add skills that represent your expertise.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                >
                  <PlusIcon className="mr-1 h-4 w-4" />
                  Add Skill
                </button>
              </div>

              {profileData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="flex max-w-full items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600"
                    >
                      <span className="truncate">{skill}</span>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="flex-shrink-0 text-indigo-400 hover:text-red-500"
                        aria-label={`Remove ${skill}`}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm text-slate-500">
                    No skills added yet
                  </p>
                </div>
              )}
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Profile