import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // Import CORS
import dotenv from 'dotenv'; // Import dotenv

import appointmentRoutes from './routes/appointments.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Use CORS middleware

// Routes
app.use('/api/appointments', appointmentRoutes);

// Database connection
let mongoURI;

// Check for production environment (e.g., Heroku)
if (process.env.NODE_ENV === 'production') {
  mongoURI = process.env.MONGO_URI; // Use MONGO_URI from environment variables (e.g., Atlas URI)
} else {
  mongoURI = 'mongodb://localhost:27017/calenders'; // Local MongoDB connection
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
