// src/services/api.js

const DEFAULT_API_URL = 'https://internease-2.onrender.com'

const normalizeBaseUrl = (url) => {
  const cleanedUrl = String(url || '')
    .trim()
    .replace(/\/+$/, '')

  if (!cleanedUrl) {
    return DEFAULT_API_URL
  }

  // Environment variable mein /api na ho to automatically add karega
  return cleanedUrl.endsWith('/api')
    ? cleanedUrl
    : `${cleanedUrl}/api`
}

const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
)

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL

    console.log('InternEase API URL:', this.baseURL)
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

  buildUrl(endpoint = '') {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`

    return `${this.baseURL}${normalizedEndpoint}`
  }

  async parseResponse(response) {
    if (response.status === 204) {
      return null
    }

    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return response.json()
    }

    const text = await response.text()

    return text
      ? { message: text }
      : {}
  }

  async request(endpoint, options = {}) {
    const url = this.buildUrl(endpoint)
    const token = this.getToken()

    const {
      headers: customHeaders = {},
      body,
      timeout = 30000,
      ...otherOptions
    } = options

    const isFormData =
      typeof FormData !== 'undefined' &&
      body instanceof FormData

    const headers = {
      Accept: 'application/json',

      ...(!isFormData && body !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),

      ...customHeaders
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const controller = new AbortController()

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeout)

    const config = {
      method: 'GET',
      mode: 'cors',
      ...otherOptions,
      headers,
      signal: controller.signal,
      ...(body !== undefined && { body })
    }

    console.log('API Request:', {
      method: config.method,
      url
    })

    try {
      const response = await fetch(url, config)

      const data = await this.parseResponse(response)

      console.log('API Response:', {
        status: response.status,
        url,
        data
      })

      if (response.status === 401) {
        this.removeToken()
        localStorage.removeItem('internease_user')
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        )
      }

      return data
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'Backend response timeout.'
        )
      }

      if (error instanceof TypeError) {
        console.error('Network or CORS error:', error)

        throw new Error(
          `Backend connection error: ${url}`
        )
      }

      console.error('API request failed:', error)

      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // ==================== HEALTH ====================

  async healthCheck() {
    return this.request('/health', {
      method: 'GET'
    })
  }

  // ==================== AUTH ====================

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    if (response?.token) {
      this.setToken(response.token)
    }

    return response
  }

  async signup(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    if (response?.token) {
      this.setToken(response.token)
    }

    return response
  }

  async logout() {
    this.removeToken()
    localStorage.removeItem('internease_user')
  }

  async getProfile() {
    return this.request('/auth/me', {
      method: 'GET'
    })
  }

  async updateProfile(data) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // ==================== OPPORTUNITIES ====================

  async getInternships(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()

    const endpoint = queryParams
      ? `/opportunities?${queryParams}`
      : '/opportunities'

    return this.request(endpoint, {
      method: 'GET'
    })
  }

  async getInternshipById(id) {
    return this.request(`/opportunities/${id}`, {
      method: 'GET'
    })
  }

  async createInternship(formData) {
    return this.request('/opportunities', {
      method: 'POST',
      body: formData
    })
  }

  async updateInternship(id, data) {
    return this.request(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteInternship(id) {
    return this.request(`/opportunities/${id}`, {
      method: 'DELETE'
    })
  }

  async getOrganizerInternships() {
    return this.request(
      '/opportunities/organizer/my-opportunities',
      {
        method: 'GET'
      }
    )
  }

  async incrementOpportunityViews(id) {
    return this.request(`/opportunities/${id}/view`, {
      method: 'POST'
    })
  }

  async applyForInternship(internshipId) {
    return this.request(
      `/applications/apply/${internshipId}`,
      {
        method: 'POST'
      }
    )
  }

  async trackInternshipView(internshipId) {
    return this.request(
      `/opportunities/${internshipId}/view`,
      {
        method: 'POST'
      }
    )
  }

  // ==================== EVENTS ====================

  async getEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()

    const endpoint = queryParams
      ? `/events?${queryParams}`
      : '/events'

    return this.request(endpoint, {
      method: 'GET'
    })
  }

  async getEventById(id) {
    return this.request(`/events/${id}`, {
      method: 'GET'
    })
  }

  async createEvent(formData) {
    return this.request('/events', {
      method: 'POST',
      body: formData,
      timeout: 60000
    })
  }

  async updateEvent(id, formData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: formData,
      timeout: 60000
    })
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE'
    })
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
    return this.request('/events/organizer/my-events', {
      method: 'GET'
    })
  }

  // ==================== APPLICATIONS ====================

  async getApplications(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()

    const endpoint = queryParams
      ? `/applications?${queryParams}`
      : '/applications'

    return this.request(endpoint, {
      method: 'GET'
    })
  }

  async getMyApplications() {
    return this.request('/applications/me', {
      method: 'GET'
    })
  }

  async getApplicationsByOpportunity(opportunityId) {
    return this.request(
      `/applications?opportunity=${encodeURIComponent(
        opportunityId
      )}`,
      {
        method: 'GET'
      }
    )
  }

  async getApplicationById(id) {
    return this.request(`/applications/${id}`, {
      method: 'GET'
    })
  }

  async applyToInternship(opportunityId, data = {}) {
    return this.request(
      `/applications/apply/${opportunityId}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    )
  }

  async updateApplicationStatus(id, status) {
    return this.request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  async deleteApplication(id) {
    return this.request(`/applications/${id}`, {
      method: 'DELETE'
    })
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications() {
    return this.request('/notifications', {
      method: 'GET'
    })
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
    return this.request(`/notifications/${id}`, {
      method: 'DELETE'
    })
  }

  // ==================== FILE UPLOAD ====================

  async uploadFile(file, type = 'resume') {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('type', type)

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      timeout: 60000
    })
  }

  // ==================== COURSES ====================

  async getCourses(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()

    const endpoint = queryParams
      ? `/courses?${queryParams}`
      : '/courses'

    return this.request(endpoint, {
      method: 'GET'
    })
  }

  async enrollInCourse(courseId) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST'
    })
  }

  // ==================== NOTES ====================

  async getNotes() {
    return this.request('/notes', {
      method: 'GET'
    })
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
    return this.request(`/notes/${id}`, {
      method: 'DELETE'
    })
  }

  // ==================== ANALYTICS ====================

  async getDashboardStats() {
    return this.request('/analytics/dashboard', {
      method: 'GET'
    })
  }

  async getOrganizerStats() {
    return this.request('/analytics/organizer', {
      method: 'GET'
    })
  }

  // ==================== EVENTBRITE ====================

  async getEventbriteEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()

    const endpoint = queryParams
      ? `/eventbrite/events?${queryParams}`
      : '/eventbrite/events'

    return this.request(endpoint, {
      method: 'GET'
    })
  }

  async getEventbriteEventById(eventId) {
    return this.request(
      `/eventbrite/events/${eventId}`,
      {
        method: 'GET'
      }
    )
  }

  async trackEventbriteView(eventId) {
    return this.request(
      `/eventbrite/events/${eventId}/view`,
      {
        method: 'POST'
      }
    )
  }

  async registerForEventbriteEvent(eventId) {
    return this.request(
      `/eventbrite/events/${eventId}/register`,
      {
        method: 'POST'
      }
    )
  }

  async getEventbriteStats() {
    return this.request('/eventbrite/stats', {
      method: 'GET'
    })
  }

  async getEventbriteEventStats(eventId) {
    return this.request(
      `/eventbrite/stats/${eventId}`,
      {
        method: 'GET'
      }
    )
  }

  async getMyEventbriteRegistrations() {
    return this.request(
      '/eventbrite/my-registrations',
      {
        method: 'GET'
      }
    )
  }

  async getAllStudentRegistrations() {
    return this.request(
      '/eventbrite/admin/registrations',
      {
        method: 'GET'
      }
    )
  }

  async getStudentActivity(studentId) {
    return this.request(
      `/eventbrite/admin/student/${studentId}`,
      {
        method: 'GET'
      }
    )
  }

  // ==================== GITHUB INTERNSHIPS ====================

  async getGitHubInternships(limit = 50) {
    return this.request(
      `/github-internships?limit=${encodeURIComponent(limit)}`,
      {
        method: 'GET'
      }
    )
  }

  async getGitHubInternshipById(internshipId) {
    return this.request(
      `/github-internships/${internshipId}`,
      {
        method: 'GET'
      }
    )
  }

  // ==================== GITHUB COURSES ====================

  async getGitHubCourses(limit = 50) {
    return this.request(
      `/github-courses?limit=${encodeURIComponent(limit)}`,
      {
        method: 'GET'
      }
    )
  }

  async getGitHubCourseById(courseId) {
    return this.request(
      `/github-courses/${courseId}`,
      {
        method: 'GET'
      }
    )
  }
}

const apiService = new ApiService()


export default apiService
