'use client';

export default function PaymentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="lg-64">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
