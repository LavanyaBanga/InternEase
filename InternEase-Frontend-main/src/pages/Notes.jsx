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
    <Card className="h-full !p-4 sm:!p-5 border border-slate-100 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 truncate">
          {note.title}
        </h3>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => handleEditNote(note)}
            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteNote(note._id || note.id)}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="text-slate-500 mb-4 line-clamp-3">
        {note.content}
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-xs text-slate-400">
        {formatDate(note.updatedAt || note.createdAt)}
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto mb-6 w-full max-w-7xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          My Notes
        </h1>
        <p className="text-slate-500">
          Organize your thoughts and ideas
        </p>
      </div>

      {/* Search and Create */}
      <div className="mx-auto mb-6 flex w-full max-w-7xl flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleCreateNote}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700 sm:w-auto"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredNotes.length > 0 ? (
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note._id || note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-slate-300 mb-4">
            <DocumentTextIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchTerm ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-slate-500 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first note to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreateNote}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Create Note
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {isEditing ? 'Edit Note' : 'Create Note'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter note title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write your note content here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., study, work, ideas"
                />
              </div>
            </div>
            
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
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