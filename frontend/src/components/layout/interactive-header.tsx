'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, BarChart3, Bot, Shield } from 'lucide-react';

export function InteractiveHeader() {
  const pathname = usePathname();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
      if (isDashboardDropdownOpen && !target.closest('.dashboard-dropdown')) {
        setIsDashboardDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen, isDashboardDropdownOpen]);

  const handleLogout = async () => {
    try {
      // For now, just close the dropdown
      // TODO: Implement actual logout when auth store is ready
      console.log('Logout clicked');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsProfileDropdownOpen(false);
  };

  // Default user data (will be replaced with real data when auth store is ready)
  const userName = 'System Administrator';
  const userEmail = 'admin@cashwise.com';
  const userRoles = ['admin'];
  const userInitial = 'S';

  const dashboardMenuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    { name: 'Automation Agents', href: '/automation', icon: Bot },
    { name: 'System Admin', href: '/admin', icon: Shield },
  ];

  const profileMenuItems = [
    { name: 'View Profile', href: '/profile', icon: User },
    { name: 'Account Settings', href: '/profile/settings', icon: Settings },
  ];

  return (
    <div className="bg-blue-500 text-white shadow-lg border-b border-blue-600 h-16 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left Side - Dashboard Menu */}
          <div className="flex items-center space-x-6">
            <div className="relative dashboard-dropdown">
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-600 hover:text-white flex items-center gap-2"
                onClick={() => setIsDashboardDropdownOpen(!isDashboardDropdownOpen)}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
                <ChevronDown className={`h-4 w-4 transition-transform ${isDashboardDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* Dashboard Dropdown Menu */}
              {isDashboardDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {dashboardMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 ${
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          onClick={() => setIsDashboardDropdownOpen(false)}
                        >
                          <IconComponent className="h-4 w-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <h1 className="text-xl font-bold text-white">CashWise</h1>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/reports" 
              className={`text-blue-100 hover:text-white transition-colors ${pathname === '/reports' ? 'text-white' : ''}`}
            >
              Reports & Analytics
            </Link>
            <Link 
              href="/automation" 
              className={`text-blue-100 hover:text-white transition-colors ${pathname === '/automation' ? 'text-white' : ''}`}
            >
              Automation Agents
            </Link>
            <Link 
              href="/notifications" 
              className={`text-blue-100 hover:text-white transition-colors relative ${pathname === '/notifications' ? 'text-white' : ''}`}
            >
              Notifications
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
            </Link>
          </div>

          {/* Right Side - User Profile */}
          <div className="flex items-center gap-4">
            <div className="relative profile-dropdown">
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-600 hover:text-white flex items-center gap-2"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{userName}</span>
                <span className="hidden lg:block text-blue-200">({userRoles.join(', ')})</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-600 text-white text-lg">
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                          <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {userRoles.map((role, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="py-1">
                      {profileMenuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <IconComponent className="h-4 w-4 text-gray-400" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-1"></div>

                    {/* Sign Out */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
