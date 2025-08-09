'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, X, AlertCircle } from 'lucide-react';
import { UserNote } from '@/app/types'; 

interface NotesWidgetProps {
  userId?: string;
  maxNotes?: number;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({ 
  userId = 'default-user', 
  maxNotes = 5 
}) => {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/notes?userId=${userId}`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newNote.trim(),
          userId,
          priority: 'medium',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(prev => [data.note, ...prev]);
        setNewNote('');
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const toggleNote = async (noteId: string, isCompleted: boolean) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: noteId,
          isCompleted,
        }),
      });

      if (response.ok) {
        setNotes(prev =>
          prev.map(note =>
            note._id === noteId ? { ...note, isCompleted } : note
          )
        );
      }
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'medium':
        return <AlertCircle size={16} className="text-yellow-400" />;
      case 'low':
        return <AlertCircle size={16} className="text-green-400" />;
      default:
        return null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addNote();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewNote('');
    }
  };

  if (loading) {
    return <div className="text-white">Loading notes...</div>;
  }

  const activeNotes = notes.filter(note => !note.isCompleted).slice(0, maxNotes);
  const completedNotes = notes.filter(note => note.isCompleted).slice(0, 3);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 text-white max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notes & Reminders</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add new note */}
      {isAdding && (
        <div className="mb-4 p-3 bg-white/10 rounded-lg">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a note or reminder..."
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setNewNote('');
              }}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X size={16} />
            </button>
            <button
              onClick={addNote}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Active notes */}
      <div className="space-y-2 mb-4">
        {activeNotes.map((note) => (
          <div
            key={note._id}
            className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors"
          >
            <button
              onClick={() => toggleNote(note._id, true)}
              className="mt-1 w-4 h-4 border border-gray-400 rounded hover:border-white transition-colors flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm break-words">{note.content}</p>
              <div className="flex items-center gap-1 mt-1">
                {getPriorityIcon(note.priority)}
                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {activeNotes.length === 0 && !isAdding && (
          <div className="text-gray-400 text-sm text-center py-4">
            No active notes. Click + to add one.
          </div>
        )}
      </div>

      {/* Completed notes */}
      {completedNotes.length > 0 && (
        <div className="border-t border-gray-600 pt-3">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Completed</h4>
          <div className="space-y-1">
            {completedNotes.map((note) => (
              <div
                key={note._id}
                className="flex items-start gap-3 p-1 opacity-60"
              >
                <button
                  onClick={() => toggleNote(note._id, false)}
                  className="mt-1 w-4 h-4 bg-green-500 rounded flex-shrink-0 flex items-center justify-center"
                >
                  <Check size={12} />
                </button>
                <p className="text-sm line-through text-gray-400 break-words">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesWidget;