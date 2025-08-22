'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentRequestPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the new enhanced payment requests page
        router.replace('/payment-requests');
    }, [router]);

    // Show loading while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to enhanced Payment Requests...</p>
                <p className="text-sm text-gray-500 mt-2">You will be automatically redirected to the new enhanced payment requests system.</p>
            </div>
        </div>
    );
}
