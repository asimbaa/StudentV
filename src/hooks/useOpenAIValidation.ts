import { useState, useEffect } from 'react';
import { testOpenAIConnection } from '@/lib/ai/utils/testConnection';

export function useOpenAIValidation() {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);

  useEffect(() => {
    const validateConnection = async () => {
      const result = await testOpenAIConnection();
      setIsValid(result.isValid);
      setError(result.error || null);
      setDetails(result.details || null);

      if (!result.isValid && import.meta.env.DEV) {
        console.error('OpenAI Validation Error:', {
          error: result.error,
          details: result.details
        });
      }
    };

    validateConnection();
  }, []);

  return { isValid, error, details };
}