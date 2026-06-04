// API service for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getToken() {
    return localStorage.getItem('internease_token')
  }

  setToken(token) {
    localStorage.setItem('internease_token', token)
  }

  removeToken() {
    localStorage.removeItem('internease_token')
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    console.log('API Request:', url, options) // Debug log
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const token = this.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      console.log('API Response:', response.status, data) // Debug log

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // ========== AUTH METHODS ==========
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async signup(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async logout() {
    this.removeToken()
    localStorage.removeItem('internease_user')
  }

  async getProfile() {
    return this.request('/auth/me', { method: 'GET' })
  }

  async updateProfile(data) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // ========== INTERNSHIP/OPPORTUNITY METHODS ==========
  async getInternships(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/opportunities${queryParams ? '?' + queryParams : ''}`, { 
      method: 'GET' 
    })
  }

  async getInternshipById(id) {
    return this.request(`/opportunities/${id}`, { method: 'GET' })
  }

  async createInternship(formData) {
    console.log('=== API SERVICE: createInternship ===')
    console.log('API: Creating internship with FormData')
    const token = this.getToken()
    console.log('Token:', token ? 'EXISTS' : 'MISSING')
    console.log('Base URL:', this.baseURL)
    console.log('Full URL:', `${this.baseURL}/opportunities`)
    
    try {
      const response = await fetch(`${this.baseURL}/opportunities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const error = await response.json()
        console.error('Error response:', error)
        throw new Error(error.message || 'Failed to create internship')
      }

      const data = await response.json()
      console.log('Success response:', data)
      return data
    } catch (error) {
      console.error('=== API SERVICE ERROR ===')
      console.error('Error:', error)
      throw error
    }
  }

  async updateInternship(id, data) {
    try {
      console.log('Updating internship:', id)
      console.log('Update data:', data)
      
      return this.request(`/opportunities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.error('Error in updateInternship:', error)
      throw new Error(error.message || 'Failed to update internship')
    }
  }

  async deleteInternship(id) {
    return this.request(`/opportunities/${id}`, { method: 'DELETE' })
  }

  async getOrganizerInternships() {
    return this.request('/opportunities/organizer/my-opportunities', { method: 'GET' })
  }

  async incrementOpportunityViews(id) {
    return this.request(`/opportunities/${id}/view`, { 
      method: 'POST'
    })
  }

  async applyForInternship(internshipId) {
    // Use the application endpoint for proper tracking
    return this.request(`/applications/apply/${internshipId}`, {
      method: 'POST'
    })
  }

  async trackInternshipView(internshipId) {
    return this.request(`/opportunities/${internshipId}/view`, {
      method: 'POST'
    })
  }

  // ========== EVENT METHODS ==========
  async getEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/events${queryParams ? '?' + queryParams : ''}`, { 
      method: 'GET' 
    })
  }

  async getEventById(id) {
    return this.request(`/events/${id}`, { method: 'GET' })
  }

  async createEvent(formData) {
    // FormData for file upload - don't set Content-Type header
    const url = `${this.baseURL}/events`
    const token = this.getToken()
    
    const config = {
      method: 'POST',
      body: formData, // FormData object
      headers: {}
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Create event failed:', error)
      throw error
    }
  }

  async updateEvent(id, formData) {
    // FormData for file upload - don't set Content-Type header
    const url = `${this.baseURL}/events/${id}`
    const token = this.getToken()
    
    const config = {
      method: 'PUT',
      body: formData, // FormData object
      headers: {}
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Update event failed:', error)
      throw error
    }
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, { method: 'DELETE' })
  }

  async registerForEvent(eventId) {
    return this.request(`/events/${eventId}/register`, {
      method: 'POST'
    })
  }

  async trackEventView(eventId) {
    return this.request(`/events/${eventId}/view`, {
      method: 'POST'
    })
  }

  async getOrganizerEvents() {
    return this.request('/events/organizer/my-events', { method: 'GET' })
  }

  // ========== APPLICATION METHODS ==========
  async getApplications(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/applications${queryParams ? '?' + queryParams : ''}`, { 
      method: 'GET' 
    })
  }

  async getMyApplications() {
    return this.request('/applications/me', { method: 'GET' })
  }

  async getApplicationsByOpportunity(opportunityId) {
    return this.request(`/applications?opportunity=${opportunityId}`, { method: 'GET' })
  }

  async getApplicationById(id) {
    return this.request(`/applications/${id}`, { method: 'GET' })
  }

  async applyToInternship(opportunityId, data = {}) {
    return this.request(`/applications/apply/${opportunityId}`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateApplicationStatus(id, status) {
    return this.request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  async deleteApplication(id) {
    return this.request(`/applications/${id}`, { method: 'DELETE' })
  }

  // ========== NOTIFICATION METHODS ==========
  async getNotifications() {
    return this.request('/notifications', { method: 'GET' })
  }

  async createNotification(data) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT'
    })
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, { method: 'DELETE' })
  }

  // ========== FILE UPLOAD METHODS ==========
  async uploadFile(file, type = 'resume') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const token = this.getToken()
    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'File upload failed')
    }

    return data
  }

  // ========== COURSE METHODS ==========
  async getCourses(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/courses${queryParams ? '?' + queryParams : ''}`, { 
      method: 'GET' 
    })
  }

  async enrollInCourse(courseId) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST'
    })
  }

  // ========== NOTES METHODS ==========
  async getNotes() {
    return this.request('/notes', { method: 'GET' })
  }

  async createNote(data) {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateNote(id, data) {
    return this.request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteNote(id) {
    return this.request(`/notes/${id}`, { method: 'DELETE' })
  }

  // ========== ANALYTICS METHODS ==========
  async getDashboardStats() {
    return this.request('/analytics/dashboard', { method: 'GET' })
  }

  async getOrganizerStats() {
    return this.request('/analytics/organizer', { method: 'GET' })
  }

  // ========== EVENTBRITE METHODS ==========
  async getEventbriteEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/eventbrite/events${queryParams ? '?' + queryParams : ''}`, { 
      method: 'GET' 
    })
  }

  async getEventbriteEventById(eventId) {
    return this.request(`/eventbrite/events/${eventId}`, { method: 'GET' })
  }

  async trackEventbriteView(eventId) {
    return this.request(`/eventbrite/events/${eventId}/view`, { 
      method: 'POST' 
    })
  }

  async registerForEventbriteEvent(eventId) {
    return this.request(`/eventbrite/events/${eventId}/register`, { 
      method: 'POST' 
    })
  }

  async getEventbriteStats() {
    return this.request('/eventbrite/stats', { method: 'GET' })
  }

  async getEventbriteEventStats(eventId) {
    return this.request(`/eventbrite/stats/${eventId}`, { method: 'GET' })
  }

  async getMyEventbriteRegistrations() {
    return this.request('/eventbrite/my-registrations', { method: 'GET' })
  }

  // Admin - View all student registrations
  async getAllStudentRegistrations() {
    return this.request('/eventbrite/admin/registrations', { method: 'GET' })
  }

  async getStudentActivity(studentId) {
    return this.request(`/eventbrite/admin/student/${studentId}`, { method: 'GET' })
  }

  // ========== GITHUB INTERNSHIPS METHODS ==========
  async getGitHubInternships(limit = 50) {
    return this.request(`/github-internships?limit=${limit}`, { method: 'GET' })
  }

  async getGitHubInternshipById(internshipId) {
    return this.request(`/github-internships/${internshipId}`, { method: 'GET' })
  }

  // ========== GITHUB COURSES METHODS ==========
  async getGitHubCourses(limit = 50) {
    return this.request(`/github-courses?limit=${limit}`, { method: 'GET' })
  }

  async getGitHubCourseById(courseId) {
    return this.request(`/github-courses/${courseId}`, { method: 'GET' })
  }
}

// Create and export a single instance
const apiService = new ApiService()
export default apiService