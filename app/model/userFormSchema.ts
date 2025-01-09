import mongoose, { Document, Schema } from 'mongoose';

// Interface for the user document
export interface IUser extends Document {
  name: string;
  email: string;
  profession: string;
  bio: string;
  aboutMe: string;
  photo: string;
  resume: string;
  projects: string[];
  skills: string[];
  socialLinks: {
    [key: string]: string;
  };
  initiatingUser: boolean;
  randomId: string;
}

// Schema definition
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profession: { type: String, required: true },
  bio: { type: String, required: true },
  aboutMe: { type: String, required: true },
  photo: { type: String, required: true },
  resume: { type: String, required: true },
  projects: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  socialLinks: { type: Map, of: String, default: {} },
  initiatingUser: { type: Boolean, default: false },
  randomId: { type: String, required: true }
}, {
  timestamps: true
});

// Create and export the model
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);

