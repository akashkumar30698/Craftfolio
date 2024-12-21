import mongoose, { Schema, Document, model, models } from 'mongoose';

// Define the schema for the "users" collection
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define the User interface for TypeScript
interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
}

// Check if the model already exists, and if so, use it instead of redefining
const User = models.User || model<UserDocument>('User', UserSchema);

export default User;