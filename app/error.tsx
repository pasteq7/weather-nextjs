'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-destructive mb-2">Something went wrong!</h2>
        <p className="text-muted-foreground mb-4">
          {error.message.includes('City not found')
            ? 'The location you searched for could not be found. Please try a different one.'
            : 'We could not load the weather data at this time.'}
        </p>
        <Button onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}