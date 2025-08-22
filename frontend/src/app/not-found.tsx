'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-400">404</h1>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mb-6 text-gray-600 max-w-md">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-x-4">
          <Link href="/dashboard">
            <Button>
              Go to Dashboard
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
