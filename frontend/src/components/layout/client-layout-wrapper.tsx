'use client';

import { usePathname } from 'next/navigation';
import { InteractiveLayoutWrapper } from './interactive-layout-wrapper';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Don't render navigation for auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col h-screen">
      <InteractiveLayoutWrapper />
      <main className="flex-1 overflow-y-auto ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
