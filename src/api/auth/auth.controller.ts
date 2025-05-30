import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      // Add more validation as needed (e.g., password strength)

      const user = await AuthService.register({ email, password, name });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const result = await AuthService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      // Customize error messages for login failures
      if (error instanceof Error && (error.message === 'Invalid email or password' || error.message === 'User with this email already exists')) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      next(error);
    }
  },
}; 