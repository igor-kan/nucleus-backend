import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './api/auth/auth.routes'; // Import auth routes

const app = express();
const port = process.env.PORT || 3002; // Different port from frontend apps

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes); // Use auth routes under /api/auth

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Nucleus AI Backend is running!');
});

// Placeholder for AI Receptionist routes
app.get('/api/ai-receptionist/status', (req: Request, res: Response) => {
  res.json({ service: 'AI Receptionist', status: 'pending_implementation' });
});

// Placeholder for AI Customer Service routes
app.get('/api/ai-customer-service/status', (req: Request, res: Response) => {
  res.json({ service: 'AI Customer Service', status: 'pending_implementation' });
});

// Placeholder for AI SDR routes
app.get('/api/ai-sdr/status', (req: Request, res: Response) => {
  res.json({ service: 'AI SDR', status: 'pending_implementation' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  // Check for specific error types or messages for more granular responses
  if (err.message === 'User with this email already exists') {
    return res.status(409).json({ message: err.message }); // Conflict
  }
  if (err.message === 'Invalid email or password' || err.message === 'Invalid credentials') {
    return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
  }
  // Default to 500 for other errors
  res.status(500).json({ message: 'Something broke on the server!', error: err.message });
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
}); 