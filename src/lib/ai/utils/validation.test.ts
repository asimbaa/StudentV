import { describe, it, expect } from 'vitest';
import { validateApiKey } from './validation';

describe('validateApiKey', () => {
  it('should detect missing API key', () => {
    expect(validateApiKey()).toBe(false);
  });

  it('should validate correct API key format', () => {
    expect(validateApiKey('sk-1234567890abcdef1234567890abcdef1234567890abcdef')).toBe(true);
  });

  it('should reject invalid API key format', () => {
    expect(validateApiKey('invalid-key')).toBe(false);
  });
});