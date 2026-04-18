import { z } from 'zod';

// Define the environment schema with Zod
export const envSchema = z.object({
  PORT: z.coerce.number().default(3000), // Default to 3000, parse strings to numbers
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates a configuration object (usually process.env) against our strict schema.
 * Throws an error if invalid, fulfilling the 'Fail-Fast' architecture pillar.
 * 
 * @param config Record of environment variables (process.env)
 * @returns Validated and typed configuration object
 */
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    // Log clearly to the console the variables that are missing or invalid
    console.error('❌ Environment validation error:', result.error.format());
    throw new Error('Environment configuration is missing or invalid.');
  }

  return result.data;
}
