// src/lib/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  settings: {
    location: string;
    units: 'metric' | 'imperial';
    newsCategories: string[];
    displayBrightness: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  settings: {
    location: { type: String, default: 'New York' },
    units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    newsCategories: { type: [String], default: ['technology', 'science'] },
    displayBrightness: { type: Number, default: 80 },
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);