import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma'; // Adjusted path

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-jwt-secret';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    // Add other user properties you might need from the token payload
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

      // Attach user to request object (omitting password)
      // We fetch the user from DB to ensure they still exist and are active, etc.
      // although for some stateless scenarios, the decoded token data might be enough.
      const userFromDb = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, name: true }});
      
      if (!userFromDb) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = userFromDb;

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
}; 