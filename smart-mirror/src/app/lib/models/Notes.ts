// src/lib/models/Note.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  userId: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isCompleted: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);