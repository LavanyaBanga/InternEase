// services/githubEventsService.js
const axios = require('axios');

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;
const EVENTBRITE_BASE = 'https://www.eventbriteapi.com/v3';

/**
 * Transform Eventbrite API event to InternEase format
 */
const transformEventbriteEvent = (event) => {
  const start = event.start?.local || '';
  const dateObj = start ? new Date(start) : null;

  return {
    eventbriteId: event.id,
    title: event.name?.text || 'Untitled Event',
    description: event.description?.text || event.summary || '',
    type: mapEventCategory(event.category_id),
    date: dateObj ? dateObj.toLocaleDateString('en-IN') : 'TBA',
    time: dateObj ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'TBA',
    location: event.online_event
      ? 'Online'
      : event.venue?.address?.localized_address_display || 'Location TBA',
    maxParticipants: event.capacity || 500,
    registrationFee: event.is_free ? 'Free' : 'Paid',
    poster: event.logo?.url || null,
    organizerName: event.organizer?.name || 'Unknown Organizer',
    url: event.url,
    status: event.status,
    isEventbrite: true,
    isFree: event.is_free,
    onlineEvent: event.online_event
  };
};

/**
 * Map Eventbrite category IDs to readable types
 */
const mapEventCategory = (categoryId) => {
  const categoryMap = {
    '102': 'Conference',   // Science & Technology
    '101': 'Conference',   // Business & Professional
    '110': 'Workshop',     // Food & Drink (fallback)
    '113': 'Workshop',     // Community & Culture
    '105': 'Hackathon',    // Performing & Visual Arts (fallback)
  };
  return categoryMap[categoryId] || 'Conference';
};

/**
 * Fetch real events from Eventbrite API
 */
const getEventbriteEvents = async (options = {}) => {
  if (!EVENTBRITE_TOKEN) {
    console.error('EVENTBRITE_TOKEN not set in .env');
    return [];
  }

  try {
    console.log('=== FETCHING REAL EVENTBRITE EVENTS ===');

    const params = {
      'q': 'technology',
      'sort_by': 'date',
      'online_events_only': false,
      'expand': 'organizer,venue,logo',
      'page_size': options.page_size || 20,
      'categories': '102', // Science & Technology category
    };

    const response = await axios.get(`${EVENTBRITE_BASE}/events/search/`, {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
      },
      params,
    });

    const events = response.data?.events || [];
    console.log(`Fetched ${events.length} real events from Eventbrite`);

    return events.map(transformEventbriteEvent);
  } catch (error) {
    console.error('Eventbrite API error:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Get a single event by Eventbrite ID
 */
const getEventbriteEventById = async (eventId) => {
  if (!EVENTBRITE_TOKEN) throw new Error('EVENTBRITE_TOKEN not configured');

  try {
    const response = await axios.get(`${EVENTBRITE_BASE}/events/${eventId}/`, {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
      },
      params: { expand: 'organizer,venue,logo' },
    });

    return transformEventbriteEvent(response.data);
  } catch (error) {
    console.error('Error fetching Eventbrite event:', error.response?.data || error.message);
    throw new Error('Failed to fetch event details');
  }
};

/**
 * Get attendees for an event
 */
const getEventbriteAttendees = async (eventId) => {
  if (!EVENTBRITE_TOKEN) return [];

  try {
    const response = await axios.get(`${EVENTBRITE_BASE}/events/${eventId}/attendees/`, {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
      },
    });

    return response.data?.attendees || [];
  } catch (error) {
    console.error('Error fetching attendees:', error.message);
    return [];
  }
};

module.exports = {
  getEventbriteEvents,
  getEventbriteEventById,
  getEventbriteAttendees,
};