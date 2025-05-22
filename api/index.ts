import 'dotenv/config';
import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

// Import your handler directly
import streamHandler from './chat/stream'; // Vercel handles this directly

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Basic endpoint (if you need)
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Express API is up and running!' });
});

// Remove route mounting for specific methods, just let each handler file work independently
// No need for app.post('/api/chat/stream', streamHandler); anymore
// Instead, `api/chat/stream.ts` will handle POST by default.

export default serverless(app);
