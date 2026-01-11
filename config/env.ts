import { z } from 'zod';

// Environment variables schema
const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth secret is required"),
  NEXTAUTH_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  IMGBB_API_KEY: z.string().min(1, "ImgBB API key is required"),
});

// Validate environment variables
export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NODE_ENV: process.env.NODE_ENV,
  IMGBB_API_KEY: process.env.IMGBB_API_KEY,
});

export type Env = z.infer<typeof envSchema>;
