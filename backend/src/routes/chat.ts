import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { validateEnv } from '../utils/validation.js';

const router = Router();

const messageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string()
  })),
  model: z.string().optional(),
  temperature: z.number().optional(),
  max_tokens: z.number().optional()
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', async (req, res, next) => {
  try {
    // Validate environment
    validateEnv();

    // Validate request body
    const { messages, model = 'gpt-4-turbo-preview', ...params } = messageSchema.parse(req.body);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 4096,
      response_format: { type: "json_object" },
      ...params
    });

    res.json(completion);
  } catch (error) {
    next(error);
  }
});

export { router as chatRouter };
