import { validateEnv } from './env.validation';

describe('Environment Validation', () => {
  it('should validate a valid environment', () => {
    const validEnv = {
      PORT: '3000',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_KEY: 'test-key',
    };

    const result = validateEnv(validEnv);
    expect(result).toBeDefined();
    expect(result.PORT).toBe(3000);
    expect(result.SUPABASE_URL).toBe('https://example.supabase.co');
    expect(result.SUPABASE_KEY).toBe('test-key');
  });

  it('should throw an error if SUPABASE_URL is missing', () => {
    const invalidEnv = {
      PORT: '3000',
      SUPABASE_KEY: 'test-key',
    };

    expect(() => validateEnv(invalidEnv)).toThrow();
  });

  it('should throw an error if SUPABASE_KEY is missing', () => {
    const invalidEnv = {
      PORT: '3000',
      SUPABASE_URL: 'https://example.supabase.co',
    };

    expect(() => validateEnv(invalidEnv)).toThrow();
  });

  it('should set default PORT if missing', () => {
    const envWithoutPort = {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_KEY: 'test-key',
    };

    const result = validateEnv(envWithoutPort);
    expect(result.PORT).toBe(3000); // Expecting default to be 3000
  });
});
