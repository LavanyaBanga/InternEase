const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

/* =====================================================
   DATABASE CONNECTION
===================================================== */

connectDB().catch((error) => {
  console.error('Database connection failed:', error.message);
});

/* =====================================================
   SECURITY MIDDLEWARE
===================================================== */

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

/* =====================================================
   CORS CONFIGURATION
===================================================== */

const normalizeOrigin = (url) => {
  if (!url) return null;

  return url.trim().replace(/\/+$/, '');
};

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',

  // Deployed frontend
  'https://internease-1.onrender.com',

  // Render environment variables
  process.env.CLIENTURL,
  process.env.FRONTEND_URL
]
  .map(normalizeOrigin)
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman, Thunder Client, Render health checks
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.error('CORS blocked origin:', normalizedOrigin);
    console.log('Allowed origins:', allowedOrigins);

    const corsError = new Error(
      `CORS policy does not allow requests from ${normalizedOrigin}`
    );

    corsError.statusCode = 403;

    return callback(corsError);
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin'
  ],

  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

/*
  Explicit preflight handling
*/
app.options('*', cors(corsOptions));

/* =====================================================
   BODY PARSERS
===================================================== */

app.use(
  express.json({
    limit: '10mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

/* =====================================================
   REQUEST LOGGER
===================================================== */

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`
  );

  console.log(
    'Request origin:',
    req.headers.origin || 'No origin'
  );

  next();
});

/* =====================================================
   BASE ROUTES
===================================================== */

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'InternEase Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      opportunities: '/api/opportunities',
      applications: '/api/applications',
      events: '/api/events',
      eventbrite: '/api/eventbrite',
      githubInternships: '/api/github-internships',
      githubCourses: '/api/github-courses',
      notifications: '/api/notifications',
      notes: '/api/notes',
      upload: '/api/upload',
      contact: '/api/contact'
    }
  });
});

app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello from the InternEase backend!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  const databaseStatus =
    mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected';

  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: databaseStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

/* =====================================================
   API ROUTES
===================================================== */

app.use('/api/auth', require('./routes/authRoutes'));

app.use(
  '/api/opportunities',
  require('./routes/opportunityRoutes')
);

app.use(
  '/api/applications',
  require('./routes/applicationRoutes')
);

app.use(
  '/api/notifications',
  require('./routes/notificationRoutes')
);

app.use(
  '/api/events',
  require('./routes/eventRoutes')
);

app.use(
  '/api/eventbrite',
  require('./routes/eventbriteRoutes')
);

app.use(
  '/api/github-internships',
  require('./routes/githubInternshipsRoutes')
);

app.use(
  '/api/github-courses',
  require('./routes/githubCoursesRoutes')
);

app.use(
  '/api/notes',
  require('./routes/noteRoutes')
);

app.use(
  '/api/upload',
  require('./routes/uploadRoutes')
);

app.use(
  '/api/contact',
  require('./routes/contactRoutes')
);

/* =====================================================
   404 ROUTE
===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use(errorHandler);

/* =====================================================
   SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log('========================================');
    console.log(`Server running on port: ${PORT}`);
    console.log(
      `Environment: ${process.env.NODE_ENV || 'development'}`
    );
    console.log('Allowed CORS origins:', allowedOrigins);
    console.log('========================================');
  });
}

module.exports = app;
