'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
    User, 
    Settings, 
    LogOut, 
    ChevronDown, 
    Shield, 
    Bell,
    Key,
    HelpCircle,
    Moon,
    Sun
} from 'lucide-react';

export function UserProfileDropdown() {
    const { user, logout } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            setIsDropdownOpen(false);
            // The logout function will handle the redirect
            logout();
        } catch (error) {
            console.error('Logout failed:', error);
            // Fallback redirect if logout fails
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // In a real app, this would update the theme
        document.documentElement.classList.toggle('dark');
    };

    // Default user data if auth store is not loaded
    const userName = user?.name || 'System Administrator';
    const userEmail = user?.email || 'admin@cashwise.com';
    const userRoles = user?.roles || ['admin'];
    const userAvatar = user?.avatar;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Profile Button */}
            <Button
                variant="ghost"
                className="text-white hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Avatar className="h-8 w-8">
                    {userAvatar ? (
                        <AvatarImage src={userAvatar} alt={userName} />
                    ) : (
                        <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                            {userInitial}
                        </AvatarFallback>
                    )}
                </Avatar>
                <span className="hidden md:block text-left">
                    <div className="text-sm font-medium leading-none">{userName}</div>
                    <div className="text-xs text-blue-200 leading-none">
                        {userRoles.join(', ')}
                    </div>
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border border-gray-200">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-16 w-16">
                                {userAvatar ? (
                                    <AvatarImage src={userAvatar} alt={userName} />
                                ) : (
                                    <AvatarFallback className="bg-blue-600 text-white text-xl font-semibold">
                                        {userInitial}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {userName}
                                </h3>
                                <p className="text-sm text-gray-600 truncate">
                                    {userEmail}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    {userRoles.map((role, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-lg font-semibold text-gray-900">156</div>
                                <div className="text-xs text-gray-500">Logins</div>
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-gray-900">24</div>
                                <div className="text-xs text-gray-500">Days Active</div>
                            </div>
                            <div>
                                <div className="text-lg font-semibold text-gray-900">2</div>
                                <div className="text-xs text-gray-500">Sessions</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-2">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <User className="h-4 w-4 text-gray-400" />
                            <span>View Profile</span>
                        </Link>

                        <Link
                            href="/profile/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <Settings className="h-4 w-4 text-gray-400" />
                            <span>Account Settings</span>
                        </Link>

                        <Link
                            href="/profile/security"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <Shield className="h-4 w-4 text-gray-400" />
                            <span>Security Settings</span>
                        </Link>

                        <Link
                            href="/profile/notifications"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <Bell className="h-4 w-4 text-gray-400" />
                            <span>Notification Preferences</span>
                        </Link>

                        <Link
                            href="/profile/password"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <Key className="h-4 w-4 text-gray-400" />
                            <span>Change Password</span>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Theme Toggle */}
                    <div className="py-2">
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
                        >
                            {isDarkMode ? (
                                <Sun className="h-4 w-4 text-gray-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-gray-400" />
                            )}
                            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        <Link
                            href="/help"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                            <span>Help & Support</span>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Sign Out */}
                    <div className="py-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <div className="text-xs text-gray-500 text-center">
                            CashWise v1.0 • Last login: Today, 10:30 AM
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
