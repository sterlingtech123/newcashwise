'use client';

import { useAuthStore } from '@/stores/auth-store';

export default function TestNavigationPage() {
    const { user } = useAuthStore();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Navigation Test Page</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current User Status</h2>

                {user ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Name:</span>
                            <span className="text-gray-600">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Email:</span>
                            <span className="text-gray-600">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Roles:</span>
                            <span className="text-gray-600">{user.roles?.join(', ') || 'No roles'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">MDA:</span>
                            <span className="text-gray-600">{user.mda || 'No MDA'}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-500">No user logged in</div>
                )}
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Navigation Features</h2>
                <ul className="space-y-2 text-gray-600">
                    <li>✅ Top horizontal menu bar (Light blue)</li>
                    <li>✅ Left sidebar with colored menu headers</li>
                    <li>✅ Role-based navigation</li>
                    <li>✅ User profile and notifications</li>
                    <li>✅ Responsive design</li>
                </ul>
            </div>

            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Navigation Working!</h2>
                <p className="text-green-700">
                    If you can see this page with the navigation bar and sidebar, then the navigation system is working correctly!
                </p>
            </div>
        </div>
    );
}
