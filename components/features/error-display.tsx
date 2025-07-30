'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return null; // This component does not render anything
}