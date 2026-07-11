import React, { useState } from 'react'
import Card from '../components/Card'
import { 
  DocumentArrowUpIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const ResumeAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setAnalyzing(true)
      
      // Simulate analysis
      setTimeout(() => {
        setAnalysis({
          score: 94,
          strengths: [
            'Strong technical skills section',
            'Good project descriptions',
            'Relevant work experience',
            'Clear contact information',
            'Proper formatting and structure'
          ],
          weaknesses: [
            'Missing keywords for ATS optimization',
            'Could use more quantified achievements',
            'Summary section needs improvement',
            'Missing certifications section'
          ],
          suggestions: [
            'Add relevant keywords from job descriptions',
            'Include more metrics and numbers in experience section',
            'Write a compelling professional summary',
            'Add a certifications section',
            'Use action verbs to start bullet points',
            'Optimize for ATS compatibility'
          ],
          atsScore: 65,
          keywords: {
            found: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
            missing: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Agile']
           
          }
        })
        setAnalyzing(false)
      }, 3000)
    }
  }

  const handleDownloadReport = () => {
    if (!analysis) return
    const report = `Resume Analysis Report
File: ${uploadedFile?.name}

Overall Score: ${analysis.score}%
ATS Compatibility: ${analysis.atsScore}%

Strengths:
${analysis.strengths.map(s => `- ${s}`).join('\n')}

Areas for Improvement:
${analysis.weaknesses.map(w => `- ${w}`).join('\n')}

Suggestions:
${analysis.suggestions.map(s => `- ${s}`).join('\n')}

Found Keywords: ${analysis.keywords.found.join(', ')}
Missing Keywords: ${analysis.keywords.missing.join(', ')}
`
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume-analysis-report.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const ScoreCircle = ({ score, label }) => {
    const circumference = 2 * Math.PI * 40
    const strokeDashoffset = circumference - (score / 100) * circumference
    
    return (
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-slate-900">
              {score}%
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    )
  }

  const ChecklistItem = ({ item, type }) => {
    const Icon = type === 'strength' ? CheckCircleIcon : 
                type === 'weakness' ? XCircleIcon : 
                ExclamationTriangleIcon
    
    const colorClass = type === 'strength' ? 'text-green-600' : 
                      type === 'weakness' ? 'text-red-600' : 
                      'text-yellow-600'
    
    return (
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${colorClass} flex-shrink-0 mt-0.5`} />
        <span className="text-slate-700 text-sm sm:text-base">{item}</span>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Resume Analyzer
        </h1>
        <p className="text-slate-500">
          Get AI-powered feedback to improve your resume and increase your chances of getting hired
        </p>
      </div>

      {!uploadedFile ? (
        <Card className="text-center py-12">
          <div className="max-w-md mx-auto px-4">
            <DocumentArrowUpIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Upload Your Resume
            </h3>
            <p className="text-slate-500 mb-6">
              Upload your resume in PDF format to get detailed analysis and suggestions
            </p>
            <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer inline-block">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              Choose File
            </label>
            <p className="text-sm text-slate-400 mt-2">
              Supports PDF, DOC, and DOCX files
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <Card>
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-indigo-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">
                  {uploadedFile.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => {
                  setUploadedFile(null)
                  setAnalysis(null)
                }}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </Card>

          {analyzing && (
            <Card>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Analyzing Your Resume...
                </h3>
                <p className="text-slate-500">
                  This may take a few moments. Please wait while we analyze your resume.
                </p>
              </div>
            </Card>
          )}

          {analysis && (
            <>
              {/* Score Overview */}
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Resume Analysis Score
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <ScoreCircle score={analysis.score} label="Overall Score" />
                  <ScoreCircle score={analysis.atsScore} label="ATS Compatibility" />
                </div>
              </Card>

              {/* Strengths */}
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Strengths
                </h3>
                <div className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <ChecklistItem key={index} item={strength} type="strength" />
                  ))}
                </div>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {analysis.weaknesses.map((weakness, index) => (
                    <ChecklistItem key={index} item={weakness} type="weakness" />
                  ))}
                </div>
              </Card>

              {/* Suggestions */}
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Improvement Suggestions
                </h3>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <ChecklistItem key={index} item={suggestion} type="suggestion" />
                  ))}
                </div>
              </Card>

              {/* Keywords Analysis */}
              <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Keywords Analysis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">
                      Found Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.found.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.missing.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <Card>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleDownloadReport}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Download Report
                  </button>
                  <label className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                    Upload New Resume
                  </label>
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ResumeAnalyzer