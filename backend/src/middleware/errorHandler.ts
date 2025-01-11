import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { OpenAI } from 'openai';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid request data',
      details: error.errors
    });
  }

  if (error instanceof OpenAI.APIError) {
    return res.status(error.status || 500).json({
      error: error.message,
      type: error.type
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
}