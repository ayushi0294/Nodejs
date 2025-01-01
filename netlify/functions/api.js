import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // Import CORS
import { handler } from '@netlify/functions'; // Import handler from Netlify
import dotenv from 'dotenv';
import serverless from 'serverless-http'; // Import serverless-http for deploying Express on Netlify
import appointmentRoutes from "../../routes/appointments";

// Load .env file for local environment
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Use CORS middleware
app.use('/api/appointments', appointmentRoutes);

// Database connection (use MongoDB Atlas URI in production)
let mongoURI;

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

// Set Mongo URI based on the environment
if (process.env.NODE_ENV === 'production') {
  mongoURI = process.env.MONGO_URI; // Mongo URI from environment variables in production
} else {
  mongoURI = 'mongodb://localhost:27017/calenders'; // Local MongoDB for development
}

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Example route for appointments
app.get('/api/appointments', (req, res) => {
  res.json({ message: 'Fetching appointments' });
});

// Export the Express app as a handler for Netlify
export const handler = serverless(app);

// Local development server for local environments
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
