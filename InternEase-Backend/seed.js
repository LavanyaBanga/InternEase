const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Opportunity = require('./models/Opportunity');

// Ek dummy organizer ID — apna koi existing User _id daalo
const ORGANIZER_ID = '6a1aaa54aee52e4019e66624'

const internships = [
  {
    type: 'internship',
    title: 'Frontend Developer Intern',
    company: 'Razorpay',
    description: 'Work on Razorpay dashboard UI using React and TypeScript. Build reusable components and improve performance.',
    location: 'Bangalore',
    workMode: 'Hybrid',
    duration: '3 months',
    stipend: '₹15,000/month',
    skills: ['React', 'TypeScript', 'CSS', 'Git'],
    requirements: ['2nd/3rd year CS student', 'React basics required'],
    lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    poster: 'https://logo.clearbit.com/razorpay.com',
    organizer: ORGANIZER_ID,
  },
  {
    type: 'internship',
    title: 'Backend Developer Intern - Node.js',
    company: 'Zerodha',
    description: 'Build and maintain REST APIs for Zerodha\'s trading platform. Work with Node.js, MongoDB and Redis.',
    location: 'Bangalore',
    workMode: 'On-site',
    duration: '6 months',
    stipend: '₹20,000/month',
    skills: ['Node.js', 'MongoDB', 'Redis', 'REST APIs'],
    requirements: ['Strong JS knowledge', 'Database fundamentals'],
    lastDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    poster: 'https://logo.clearbit.com/zerodha.com',
    organizer: ORGANIZER_ID,
  },
  {
    type: 'internship',
    title: 'Full Stack Intern - MERN',
    company: 'CRED',
    description: 'Develop full stack features for CRED app. Work across React frontend and Node.js backend with a top-tier engineering team.',
    location: 'Bangalore',
    workMode: 'Hybrid',
    duration: '4 months',
    stipend: '₹25,000/month',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    requirements: ['MERN stack basics', 'Final year student preferred'],
    lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    poster: 'https://logo.clearbit.com/cred.club',
    organizer: ORGANIZER_ID,
  },
  {
    type: 'internship',
    title: 'Data Science Intern',
    company: 'Swiggy',
    description: 'Analyze food delivery data to improve recommendations and logistics. Use Python, SQL and ML models.',
    location: 'Bangalore / Remote',
    workMode: 'Remote',
    duration: '3 months',
    stipend: '₹18,000/month',
    skills: ['Python', 'SQL', 'Pandas', 'Machine Learning'],
    requirements: ['Statistics knowledge', 'Python proficiency'],
    lastDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    poster: 'https://logo.clearbit.com/swiggy.com',
    organizer: ORGANIZER_ID,
  },
  {
    type: 'internship',
    title: 'Android Developer Intern',
    company: 'PhonePe',
    description: 'Build features for PhonePe Android app used by 400M+ users. Work with Kotlin and Jetpack Compose.',
    location: 'Bangalore',
    workMode: 'On-site',
    duration: '6 months',
    stipend: '₹22,000/month',
    skills: ['Kotlin', 'Android', 'Jetpack Compose', 'REST APIs'],
    requirements: ['Android development basics', 'Kotlin knowledge'],
    lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    poster: 'https://logo.clearbit.com/phonepe.com',
    organizer: ORGANIZER_ID,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Pehle purani internships delete karo
    await Opportunity.deleteMany({ type: 'internship' });
    console.log('Old internships deleted');

    await Opportunity.insertMany(internships);
    console.log('✅ 5 internships seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();