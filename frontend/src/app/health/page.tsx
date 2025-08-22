'use client';

export default function HealthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-green-500">✅</h1>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Application is Healthy
        </h2>
        <p className="mb-6 text-gray-600">
          The CashWise application is running successfully.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Status: Running</p>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}
