import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import apiService from '../services/api'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  })

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      setLoading(true)
      console.log('Loading notes from API...')
      const response = await apiService.getNotes()
      console.log('Notes response:', response)
      
      const notesData = response.data || response
      setNotes(Array.isArray(notesData) ? notesData : [])
    } catch (error) {
      console.error('Error loading notes:', error)
      // If API fails, try to load from localStorage as fallback
      const savedNotes = localStorage.getItem('internease_notes')
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredNotes = notes.filter(note => 
    note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const handleCreateNote = () => {
    setSelectedNote(null)
    setIsEditing(false)
    setFormData({ title: '', content: '', tags: '' })
    setShowModal(true)
  }

  const handleEditNote = (note) => {
    setSelectedNote(note)
    setIsEditing(true)
    setFormData({
      title: note.title,
      content: note.content,
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : ''
    })
    setShowModal(true)
  }

  const handleSaveNote = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      const noteData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      console.log('=== SAVING NOTE ===')
      console.log('Is Editing:', isEditing)
      console.log('Note Data:', noteData)
      console.log('Token:', localStorage.getItem('internease_token') ? 'Present' : 'Missing')

      if (isEditing) {
        console.log('Updating note:', selectedNote._id)
        const response = await apiService.updateNote(selectedNote._id, noteData)
        console.log('Update response:', response)
        
        // Update local state
        setNotes(notes.map(note => 
          note._id === selectedNote._id ? (response.data || response) : note
        ))
        alert('Note updated successfully!')
      } else {
        console.log('Creating new note with URL:', '/api/notes')
        const response = await apiService.createNote(noteData)
        console.log('Create response:', response)
        
        // Add to local state
        setNotes([response.data || response, ...notes])
        alert('Note created successfully!')
      }

      setShowModal(false)
      setFormData({ title: '', content: '', tags: '' })
    } catch (error) {
      console.error('=== ERROR SAVING NOTE ===')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      alert(`Failed to save note: ${error.message}`)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      console.log('Deleting note:', noteId)
      await apiService.deleteNote(noteId)
      setNotes(notes.filter(note => note._id !== noteId))
      alert('Note deleted successfully!')
    } catch (error) {
      console.error('Error deleting note:', error)
      alert(error.message || 'Failed to delete note')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const NoteCard = ({ note }) => (
    <Card className="h-full">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {note.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditNote(note)}
            className="p-1 text-gray-500 hover:text-primary transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteNote(note._id || note.id)}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {note.content}
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {formatDate(note.updatedAt || note.createdAt)}
      </div>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          My Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Organize your thoughts and ideas
        </p>
      </div>

      {/* Search and Create */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleCreateNote}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id || note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <DocumentTextIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first note to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateNote}
              className="btn-primary"
            >
              Create Note
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-cardDark rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? 'Edit Note' : 'Create Note'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter note title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Write your note content here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-cardDark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., study, work, ideas"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="btn-primary"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notes