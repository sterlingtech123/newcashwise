'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentConfirmationPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the new enhanced payment confirmation page
        router.replace('/payment-confirmation');
    }, [router]);

    // Show loading while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to enhanced Payment Confirmation...</p>
                <p className="text-sm text-gray-500 mt-2">You will be automatically redirected to the new enhanced payment confirmation system.</p>
            </div>
        </div>
    );
}
