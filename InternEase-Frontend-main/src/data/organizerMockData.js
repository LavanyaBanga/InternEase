
export const mockOrganizerEvents = [
  {
    id: 1,
    title: 'React Conference 2024',
    description: 'Join us for the biggest React conference of the year with industry experts sharing insights on the latest React features and best practices.',
    type: 'Conference',
    date: '2024-03-15',
    time: '10:00 AM',
    deadline: '2024-03-10',
    maxParticipants: 500,
    currentParticipants: 342,
    status: 'Live',
    poster: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    requirements: ['Basic React knowledge', 'Laptop required'],
    organizer: 'TechCorp',
    location: 'Online',
    registrationFee: 'Free',
    createdAt: '2024-01-15',
    views: 1250,
    applications: 342
  },
  {
    id: 2,
    title: 'AI/ML Hackathon 2024',
    description: 'Build innovative AI solutions in this 48-hour hackathon. Win prizes worth ₹5 lakhs and get mentorship from industry leaders.',
    type: 'Hackathon',
    date: '2024-04-20',
    time: '9:00 AM',
    deadline: '2024-04-15',
    maxParticipants: 200,
    currentParticipants: 156,
    status: 'Live',
    poster: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    requirements: ['Python/R knowledge', 'Team of 2-4 members'],
    organizer: 'TechCorp',
    location: 'Bangalore',
    registrationFee: '₹500',
    createdAt: '2024-02-01',
    views: 890,
    applications: 156
  },
  {
    id: 3,
    title: 'Web Development Workshop',
    description: 'Learn modern web development with hands-on projects. Perfect for beginners looking to start their coding journey.',
    type: 'Workshop',
    date: '2024-02-28',
    time: '2:00 PM',
    deadline: '2024-02-25',
    maxParticipants: 100,
    currentParticipants: 89,
    status: 'Upcoming',
    poster: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    requirements: ['Basic computer knowledge', 'Enthusiasm to learn'],
    organizer: 'TechCorp',
    location: 'Mumbai',
    registrationFee: '₹1000',
    createdAt: '2024-01-20',
    views: 567,
    applications: 89
  },
  {
    id: 4,
    title: 'Startup Pitch Competition',
    description: 'Present your startup idea to investors and win funding. Great opportunity for aspiring entrepreneurs.',
    type: 'Competition',
    date: '2024-01-15',
    time: '11:00 AM',
    deadline: '2024-01-10',
    maxParticipants: 50,
    currentParticipants: 45,
    status: 'Expired',
    poster: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    requirements: ['Business plan', 'Presentation slides'],
    organizer: 'TechCorp',
    location: 'Delhi',
    registrationFee: 'Free',
    createdAt: '2023-12-01',
    views: 234,
    applications: 45
  }
]

export const mockEventSubmissions = [
  {
    id: 1,
    eventId: 1,
    applicantName: 'Arjun Sharma',
    email: 'arjun.sharma@email.com',
    phone: '+91 9876543210',
    college: 'IIT Delhi',
    year: '3rd Year',
    branch: 'Computer Science',
    experience: 'Intermediate',
    resume: 'arjun_sharma_resume.pdf',
    coverLetter: 'Passionate about React development with 2 years of experience...',
    status: 'Pending',
    appliedAt: '2024-01-20T10:30:00Z',
    skills: ['React', 'JavaScript', 'Node.js']
  },
  {
    id: 2,
    eventId: 1,
    applicantName: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 9876543211',
    college: 'NIT Surat',
    year: '4th Year',
    branch: 'Information Technology',
    experience: 'Advanced',
    resume: 'priya_patel_resume.pdf',
    coverLetter: 'Experienced frontend developer with strong React skills...',
    status: 'Shortlisted',
    appliedAt: '2024-01-19T14:15:00Z',
    skills: ['React', 'TypeScript', 'Redux', 'CSS']
  },
  {
    id: 3,
    eventId: 1,
    applicantName: 'Rahul Kumar',
    email: 'rahul.kumar@email.com',
    phone: '+91 9876543212',
    college: 'BITS Pilani',
    year: '2nd Year',
    branch: 'Computer Science',
    experience: 'Beginner',
    resume: 'rahul_kumar_resume.pdf',
    coverLetter: 'Eager to learn React and contribute to the community...',
    status: 'Rejected',
    appliedAt: '2024-01-18T09:45:00Z',
    skills: ['HTML', 'CSS', 'JavaScript']
  },
  {
    id: 4,
    eventId: 2,
    applicantName: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 9876543213',
    college: 'IIIT Hyderabad',
    year: '3rd Year',
    branch: 'Computer Science',
    experience: 'Advanced',
    resume: 'sneha_reddy_resume.pdf',
    coverLetter: 'AI/ML enthusiast with experience in deep learning projects...',
    status: 'Shortlisted',
    appliedAt: '2024-02-05T16:20:00Z',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning']
  },
  {
    id: 5,
    eventId: 2,
    applicantName: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 9876543214',
    college: 'IIT Bombay',
    year: '4th Year',
    branch: 'Computer Science',
    experience: 'Expert',
    resume: 'vikram_singh_resume.pdf',
    coverLetter: 'Experienced in building AI solutions with strong mathematical background...',
    status: 'Pending',
    appliedAt: '2024-02-03T11:10:00Z',
    skills: ['Python', 'R', 'Deep Learning', 'Computer Vision']
  }
]

export const mockOrganizerStats = {
  totalEvents: 12,
  totalApplicants: 1250,
  livePosts: 8,
  pendingReviews: 45,
  monthlyViews: [
    { month: 'Jan', views: 1200, applications: 89 },
    { month: 'Feb', views: 1800, applications: 156 },
    { month: 'Mar', views: 2400, applications: 234 },
    { month: 'Apr', views: 2100, applications: 198 },
    { month: 'May', views: 2800, applications: 267 },
    { month: 'Jun', views: 3200, applications: 342 }
  ],
  eventTypes: [
    { name: 'Hackathons', value: 35, color: '#9B5DE5' },
    { name: 'Workshops', value: 25, color: '#F15BB5' },
    { name: 'Conferences', value: 20, color: '#00BBF9' },
    { name: 'Competitions', value: 20, color: '#00F5D4' }
  ]
}

export const mockRecentActivity = [
  {
    id: 1,
    type: 'application',
    message: 'Arjun Sharma applied for React Conference 2024',
    timestamp: '2 hours ago',
    eventId: 1
  },
  {
    id: 2,
    type: 'application',
    message: 'Priya Patel applied for AI/ML Hackathon 2024',
    timestamp: '4 hours ago',
    eventId: 2
  },
  {
    id: 3,
    type: 'event',
    message: 'Web Development Workshop reached 80% capacity',
    timestamp: '6 hours ago',
    eventId: 3
  },
  {
    id: 4,
    type: 'application',
    message: 'Rahul Kumar applied for React Conference 2024',
    timestamp: '8 hours ago',
    eventId: 1
  },
  {
    id: 5,
    type: 'milestone',
    message: 'AI/ML Hackathon 2024 reached 150 applications',
    timestamp: '1 day ago',
    eventId: 2
  }
]

export const mockOrganizerProfile = {
  id: 1,
  orgName: 'TechCorp Solutions',
  about: 'Leading technology company focused on innovation and talent development. We organize world-class events and provide opportunities for students to grow their careers.',
  website: 'https://techcorp.com',
  linkedin: 'https://linkedin.com/company/techcorp',
  email: 'contact@techcorp.com',
  phone: '+91 9876543210',
  address: 'Bangalore, Karnataka, India',
  logo: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
  founded: '2015',
  employees: '500-1000',
  industry: 'Technology',
  specialties: ['Software Development', 'AI/ML', 'Cloud Computing', 'Mobile Apps'],
  socialMedia: {
    twitter: 'https://twitter.com/techcorp',
    instagram: 'https://instagram.com/techcorp',
    youtube: 'https://youtube.com/techcorp'
  },
  achievements: [
    'Best Tech Employer 2023',
    'Innovation Award 2022',
    'Top Startup Accelerator 2021'
  ]
}