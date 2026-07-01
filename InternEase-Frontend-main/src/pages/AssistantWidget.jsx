import React, { useState } from 'react'
import Card from '../components/Card'
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const AssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your internEase AI assistant. I can help you with finding internships, preparing for interviews, and career guidance. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const predefinedQuestions = [
    'How do I improve my resume?',
    'What internships match my skills?',
    'How to prepare for technical interviews?',
    'What skills are in demand?',
    'How to write a good cover letter?'
  ]

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

   
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 1000)
  }

  const getAIResponse = (question) => {
    const responses = {
      'resume': 'To improve your resume, focus on: 1) Quantifying your achievements with numbers, 2) Using action verbs, 3) Tailoring it to each job, 4) Including relevant keywords, 5) Keeping it concise and well-formatted.',
      'internships': 'Based on your profile, I recommend checking out frontend development, backend development, and full-stack roles. Make sure to filter by your preferred location and company size.',
      'interviews': 'For technical interviews: 1) Practice coding problems on platforms like LeetCode, 2) Review fundamental concepts, 3) Prepare for behavioral questions, 4) Mock interviews with friends, 5) Research the company beforehand.',
      'skills': 'Currently in-demand skills include: JavaScript, React, Node.js, Python, Data Science, Machine Learning, Cloud Computing (AWS/Azure), DevOps, and mobile development.',
      'cover letter': 'A good cover letter should: 1) Be personalized for each company, 2) Highlight relevant achievements, 3) Show enthusiasm for the role, 4) Be concise (max 1 page), 5) Include a clear call to action.'
    }

    const lowerQuestion = question.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuestion.includes(key)) {
        return response
      }
    }

    return 'That\'s a great question! I\'d be happy to help you with that. Could you provide a bit more context so I can give you a more specific answer?'
  }

  const handlePredefinedQuestion = (question) => {
    setInputMessage(question)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-secondary text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Get instant help with your career questions and internship search
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="h-[calc(100vh-200px)] min-h-[400px] md:h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  AI Assistant
                </h3>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary' 
                      : 'bg-gradient-to-br from-primary to-secondary'
                  }`}>
                    {message.type === 'user' ? (
                      <UserIcon className="h-4 w-4 text-white" />
                    ) : (
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' 
                        ? 'text-white/70' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Predefined Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handlePredefinedQuestion(question)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about internships, careers, or job search..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary hover:bg-secondary text-white rounded-full transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AssistantWidget