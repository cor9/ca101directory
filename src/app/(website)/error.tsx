'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error({ reset }: { reset: () => void; }) {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo className="size-12" />
      
      <h1 className="text-2xl text-center">Oops! Something went wrong!</h1>
      
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant="default"
          onClick={() => reset()}
        >
          Please try again
        </Button>

        <Button
          type="submit"
          variant="outline"
          onClick={() => router.push('/')}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
}