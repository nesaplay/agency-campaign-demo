import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';

import cors from 'cors';
import uploadHandler from './upload'; // Import the adapted handler
import streamHandler from './chat/stream';
import welcomeHandler from './chat/welcome';
import initHandler from './chat/init';
import messagesHandler from './chat/messages';
import threadDetailHandler from './chat/threads/threadDetail'; // Updated import path
// We will import and use routes from other files here later
// import uploadRouter from './upload'; // Example: We'll need to adapt upload.ts

// TODO: Import handlers from api/chat/* once they are adapted for Express
// import streamHandler from './chat/stream';
// import welcomeHandler from './chat/welcome';
// import initHandler from './chat/init';
// import messagesHandler from './chat/messages';
// We might also need a way to handle routes from api/chat/threads/*

// Debug logging
console.log('Environment variables loaded:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('SUPABASE_SERVICE_ROLE_UID:', process.env.SUPABASE_SERVICE_ROLE_UID);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SERVICE_ROLE_UID',
  'OPENAI_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Express API is up and running!' });
});

// Mount the upload handler for all methods on /api/upload
app.all('/api/upload', uploadHandler);

// Mount API routes
app.post('/api/chat/stream', streamHandler); // stream.ts only handles POST
app.post('/api/chat/welcome', welcomeHandler); // welcome.ts only handles POST
app.get('/api/chat/init', initHandler); // init.ts only handles GET
app.all('/api/chat/messages', messagesHandler); // messages.ts handles GET and POST
app.patch('/api/chat/threads/:threadId', threadDetailHandler); // [threadId].ts handles PATCH, route param :threadId

// Basic error handling middleware (optional, can be expanded)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).send('Something broke!');
  } else {
    next(err);
  }
});

// Only start listening if the file is run directly (not imported by Vercel)
if (process.env.NODE_ENV !== 'test') { // Avoid listening during tests or when Vercel imports it
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

// Export the app for Vercel
export default serverless(app);