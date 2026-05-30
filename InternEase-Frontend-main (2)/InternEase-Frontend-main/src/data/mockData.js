
export const mockInternships = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechCorp',
    location: 'Remote',
    type: 'Full-time',
    stipend: '₹25,000/month',
    duration: '3 months',
    deadline: '2024-02-15',
    description: 'Join our frontend team and work on cutting-edge React applications.',
    requirements: ['React', 'JavaScript', 'HTML/CSS'],
    logo: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: 'Backend Developer Intern',
    company: 'StartupXYZ',
    location: 'Bangalore',
    type: 'Part-time',
    stipend: '₹20,000/month',
    duration: '6 months',
    deadline: '2024-02-20',
    description: 'Work on scalable backend systems using Node.js and MongoDB.',
    requirements: ['Node.js', 'MongoDB', 'Express.js'],
    logo: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: 'UI/UX Design Intern',
    company: 'DesignHub',
    location: 'Mumbai',
    type: 'Full-time',
    stipend: '₹18,000/month',
    duration: '4 months',
    deadline: '2024-02-25',
    description: 'Create beautiful and intuitive user interfaces.',
    requirements: ['Figma', 'Adobe XD', 'UI/UX Design'],
    logo: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
]

export const mockEvents = [
  {
    id: 1,
    title: 'React Conference 2024',
    date: '2024-03-15',
    time: '10:00 AM',
    location: 'Online',
    type: 'Conference',
    description: 'Learn the latest in React development from industry experts.',
    registrationFee: 'Free',
    maxParticipants: 500,
    organizer: 'React Community'
  },
  {
    id: 2,
    title: 'Startup Pitch Competition',
    date: '2024-03-20',
    time: '2:00 PM',
    location: 'Delhi',
    type: 'Competition',
    description: 'Pitch your startup idea to win funding and mentorship.',
    registrationFee: '₹500',
    maxParticipants: 50,
    organizer: 'StartupIndia'
  },
  {
    id: 3,
    title: 'AI/ML Workshop',
    date: '2024-03-25',
    time: '11:00 AM',
    location: 'Bangalore',
    type: 'Workshop',
    description: 'Hands-on workshop on Machine Learning fundamentals.',
    registrationFee: '₹1000',
    maxParticipants: 100,
    organizer: 'TechAcademy'
  }
]

export const mockCourses = [
  {
    id: 1,
    title: 'Complete React Developer Course',
    instructor: 'John Smith',
    duration: '40 hours',
    level: 'Beginner',
    rating: 4.8,
    price: 'Free',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Learn React from scratch with hands-on projects.',
    topics: ['React Basics', 'Components', 'State Management', 'Hooks']
  },
  {
    id: 2,
    title: 'Node.js Backend Development',
    instructor: 'Sarah Johnson',
    duration: '35 hours',
    level: 'Intermediate',
    rating: 4.6,
    price: '₹2,999',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Build scalable backend applications with Node.js.',
    topics: ['Express.js', 'MongoDB', 'Authentication', 'API Design']
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    instructor: 'Mike Brown',
    duration: '50 hours',
    level: 'Advanced',
    rating: 4.9,
    price: '₹4,999',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Master the art of user interface and experience design.',
    topics: ['Design Principles', 'Figma', 'Prototyping', 'User Research']
  }
]

export const mockApplications = [
  {
    id: 1,
    internshipTitle: 'Frontend Developer Intern',
    company: 'TechCorp',
    appliedDate: '2024-01-15',
    status: 'In Review',
    nextStep: 'Technical Interview',
    deadline: '2024-02-15'
  },
  {
    id: 2,
    internshipTitle: 'Backend Developer Intern',
    company: 'StartupXYZ',
    appliedDate: '2024-01-20',
    status: 'Selected',
    nextStep: 'Onboarding',
    deadline: '2024-02-20'
  },
  {
    id: 3,
    internshipTitle: 'UI/UX Design Intern',
    company: 'DesignHub',
    appliedDate: '2024-01-25',
    status: 'Rejected',
    nextStep: 'Apply to similar roles',
    deadline: '2024-02-25'
  },
  {
    id: 4,
    internshipTitle: 'Full Stack Developer Intern',
    company: 'WebSolutions',
    appliedDate: '2024-01-28',
    status: 'Applied',
    nextStep: 'Wait for initial screening',
    deadline: '2024-03-01'
  },
  {
    id: 5,
    internshipTitle: 'Data Science Intern',
    company: 'DataTech Inc',
    appliedDate: '2024-01-30',
    status: 'Applied',
    nextStep: 'Application under review',
    deadline: '2024-03-05'
  },
  {
    id: 6,
    internshipTitle: 'Mobile App Developer Intern',
    company: 'AppMakers',
    appliedDate: '2024-01-22',
    status: 'Interview',
    nextStep: 'Technical round scheduled for Feb 5',
    deadline: '2024-02-28'
  },
  {
    id: 7,
    internshipTitle: 'DevOps Intern',
    company: 'CloudServe',
    appliedDate: '2024-01-18',
    status: 'Interview',
    nextStep: 'HR interview on Feb 2',
    deadline: '2024-02-18'
  }
]

export const mockNotifications = [
  {
    id: 1,
    title: 'Application Status Update',
    message: 'Your application for Frontend Developer Intern has been shortlisted!',
    type: 'success',
    read: false,
    timestamp: '2024-01-28T10:30:00Z'
  },
  {
    id: 2,
    title: 'New Internship Posted',
    message: 'A new internship matching your profile has been posted.',
    type: 'info',
    read: false,
    timestamp: '2024-01-27T15:45:00Z'
  },
  {
    id: 3,
    title: 'Event Reminder',
    message: 'React Conference 2024 is starting in 2 days. Don\'t miss out!',
    type: 'warning',
    read: true,
    timestamp: '2024-01-26T09:15:00Z'
  }
]

export const mockUserStats = {
  applications: 12,
  interviews: 5,
  offers: 2,
  xp: 1250,
  level: 5,
  streak: 7
}

export const mockBadges = [
  { id: 1, name: 'Early Bird', description: 'Applied to 5+ internships', earned: true },
  { id: 2, name: 'Networking Pro', description: 'Attended 3+ events', earned: true },
  { id: 3, name: 'Skill Builder', description: 'Completed 2+ courses', earned: false },
  { id: 4, name: 'Interview Master', description: 'Cleared 5+ interviews', earned: true },
  { id: 5, name: 'Industry Expert', description: 'Got hired by top company', earned: false }
]

export const mockAnalytics = {
  applications: [
    { month: 'Jan', count: 8 },
    { month: 'Feb', count: 12 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 18 },
    { month: 'May', count: 22 },
    { month: 'Jun', count: 25 }
  ],
  internshipTypes: [
    { name: 'Frontend', value: 35 },
    { name: 'Backend', value: 25 },
    { name: 'Full Stack', value: 20 },
    { name: 'Mobile', value: 12 },
    { name: 'DevOps', value: 8 }
  ]
}