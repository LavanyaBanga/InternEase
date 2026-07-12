# 🚀 InternEase

**InternEase** is a full-stack career management platform designed to help students discover opportunities, track applications, explore professional events, manage certifications, and receive AI-powered career guidance—all from one centralized dashboard.

🌐 **Live Application:** https://internease-1.onrender.com/

---

## 📌 Overview

Managing internships, job applications, events, certifications, and career preparation across multiple platforms can become overwhelming for students.

InternEase solves this problem by providing a unified platform where students can organize their professional journey, monitor application progress, explore opportunities, and access personalized career assistance.

---

## ✨ Features

### 🔍 Internship and Opportunity Discovery

* Explore available internships and career opportunities.
* View important opportunity details.
* Save relevant opportunities for later.
* Apply directly through the provided application links.

### 📊 Application Tracker

* Add and manage job and internship applications.
* Track applications using different statuses:

  * Applied
  * Interview
  * OA Pending
  * Wishlist
  * Rejected
  * Offer
* Update or delete application records.
* Monitor overall application progress through the dashboard.

### 📅 Events and Certification Programs

* Discover professional events, workshops, webinars, and certification programs.
* View event details and registration information.
* Keep track of useful learning and networking opportunities.

### 🤖 AI-Powered Career Assistance

* Receive personalized career guidance.
* Get assistance with interview preparation.
* Ask career-related questions.
* Access suggestions for improving professional skills and preparation strategies.

### 👤 User Profile Management

* Create and manage a personal student profile.
* Update academic and professional information.
* Maintain career preferences and skills.
* Access personalized platform recommendations.

### 🔐 Secure Authentication

* User registration and login.
* JWT-based authentication.
* Protected routes and secure user sessions.
* Password encryption for improved account security.

### 📱 Responsive User Interface

* Fully responsive design.
* Optimized for desktop, tablet, and mobile devices.
* Clean and user-friendly student dashboard.
* Smooth navigation across different platform sections.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* React Router
* Axios
* Heroicons

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt.js

### Database

* MongoDB
* Mongoose

### Deployment

* Render

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Postman
* MongoDB Atlas

---

## 🏗️ System Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ HTTP Requests using Axios
  ▼
Express.js REST API
  │
  ├── Authentication Middleware
  ├── User Management
  ├── Application Management
  ├── Opportunity Management
  ├── Event Management
  └── AI Career Assistance
  │
  ▼
MongoDB Database
```

---

## 📂 Project Structure

```text
InternEase/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd InternEase
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend application:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable         | Description                            |
| ---------------- | -------------------------------------- |
| `PORT`           | Port on which the backend server runs  |
| `MONGO_URI`      | MongoDB Atlas connection string        |
| `JWT_SECRET`     | Secret key used to generate JWT tokens |
| `JWT_EXPIRES_IN` | JWT token expiration duration          |
| `CLIENT_URL`     | URL of the frontend application        |
| `VITE_API_URL`   | Base URL of the backend API            |
| `NODE_ENV`       | Application environment                |

> Never commit your `.env` files or secret credentials to GitHub.

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### User Profile

```http
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/profile
```

### Applications

```http
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
DELETE /api/applications/:id
```

### Opportunities

```http
GET  /api/opportunities
GET  /api/opportunities/:id
POST /api/opportunities
```

### Events

```http
GET /api/events
GET /api/events/:id
```

> Endpoint names may vary depending on the final backend route configuration.

---

## 🔐 Authentication Flow

1. The user registers or logs into the platform.
2. The backend verifies the user credentials.
3. A JSON Web Token is generated.
4. The token is stored securely on the client side.
5. The token is included in protected API requests.
6. Authentication middleware validates the token.
7. Authorized users receive access to protected resources.

---

## 🚀 Deployment

InternEase is deployed using **Render**.

### Frontend Deployment

* Build command:

```bash
npm install && npm run build
```

* Publish directory:

```text
dist
```

### Backend Deployment

* Build command:

```bash
npm install
```

* Start command:

```bash
npm start
```

Make sure all production environment variables are configured in the Render dashboard.

---

## 📈 Future Enhancements

* Resume upload and AI-powered resume analysis.
* Personalized internship recommendations.
* Email notifications for application deadlines.
* Interview scheduling and reminder system.
* Advanced application analytics.
* Company review and interview experience section.
* Recruiter and administrator dashboards.
* Real-time notifications.
* Calendar integration.
* Saved searches and opportunity alerts.
* AI-generated cover letters.
* Mock interview assistance.

---

## 💡 Key Learnings

Building InternEase provided practical experience in:

* Developing a complete MERN stack application.
* Creating responsive and reusable React components.
* Designing and integrating REST APIs.
* Managing MongoDB databases using Mongoose.
* Implementing JWT-based authentication.
* Handling protected frontend and backend routes.
* Managing CORS and environment configurations.
* Debugging deployment and API integration issues.
* Deploying full-stack applications on Render.
* Structuring scalable frontend and backend codebases.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push your branch.

```bash
git push origin feature/your-feature-name
```

5. Open a pull request.

---

## 👩‍💻 Author

**Lavanya Banga**

B.Tech Computer Science Engineering Student
Full-Stack MERN Developer

---

## 📄 License

This project is developed for educational, portfolio, and learning purposes.

---

## ⭐ Support

If you found InternEase useful or interesting, consider giving the repository a star.

Your feedback and suggestions are always appreciated.
