import mongoose, { model, Schema } from 'mongoose';
import dotenv from 'dotenv';
import { title } from 'process';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined in .env file");
}

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

export const UserModel = model("User", userSchema);

// Document Schema
const documentSchema = new mongoose.Schema({
  type: { type: String, default: "text" },
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: { type: String, default: "#hashtags" },
});

export const DocumentModel = model("Document", documentSchema);

// Shape Schema
const ShapeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  x: { type: Number, required: false },
  y: { type: Number, required: false },
  width: { type: Number, required: false },
  height: { type: Number, required: false },
  radius: { type: Number, required: false },
  radiusX: { type: Number, required: false },
  radiusY: { type: Number, required: false },
  x1: { type: Number, required: false },
  y1: { type: Number, required: false },
  x2: { type: Number, required: false },
  y2: { type: Number, required: false },
  content: { type: String, required: false },
  bold: { type: Boolean, required: false },
  italic: { type: Boolean, required: false },
  underline: { type: Boolean, required: false }
});

// Canvas Schema
const CanvasSchema = new mongoose.Schema({
  type: { type: String, default: "canvas" },
  title: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shapes: [ShapeSchema],
  createdAt: { type: Date, default: Date.now }
});

export const CanvasModel = mongoose.model("Canvas", CanvasSchema);

const tldraw = new mongoose.Schema({
  type: { type: String, default: "canvas" },
  data: {
    type: mongoose.Schema.Types.Mixed, 
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const TldrawModel = mongoose.model("Tldraw", tldraw);