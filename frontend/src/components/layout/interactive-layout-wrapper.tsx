'use client';

import { UserProfileDropdown } from './user-profile-dropdown';
import { ClientNavigationWrapper } from './client-navigation-wrapper';

export function InteractiveLayoutWrapper() {
  return (
    <>
      {/* Top Header Bar - Full Width */}
      <div className="bg-blue-500 text-white shadow-lg border-b border-blue-600 h-16 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-8">
              <a href="/dashboard" className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2H9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                Dashboard
              </a>
              <a href="/reports" className="text-blue-100 hover:text-white transition-colors">Reports & Analytics</a>
              <a href="/automation" className="text-blue-100 hover:text-white transition-colors">Automation Agents</a>
              <a href="/notifications" className="text-blue-100 hover:text-white transition-colors relative">
                Notifications
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </div>
      
      {/* Left Sidebar - Fixed Position */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 overflow-y-auto z-10">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">CashWise</h1>
        </div>
        <ClientNavigationWrapper />
      </div>
    </>
  );
}
