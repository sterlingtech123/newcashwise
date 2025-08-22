'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    LayoutDashboard,
    BarChart3,
    Bot,
    Bell,
    ChevronDown,
    Search,
    Menu,
    X
} from 'lucide-react';

// Top navigation items for admin pages
const getTopNavigationItems = () => [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and analytics'
    },
    {
        name: 'Reports & Analytics',
        href: '/reports',
        icon: BarChart3,
        description: 'Financial reports and analytics'
    },
    {
        name: 'Automation Agents',
        href: '/automation',
        icon: Bot,
        description: 'Automated workflows and tasks'
    }
];

export function TopNavigationOnly() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const topNavigationItems = getTopNavigationItems();

    const handleLogout = () => {
        logout();
    };

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Top Navigation Bar Only */}
            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gradient-to-r from-purple-700 to-purple-800 px-4 py-4 shadow-lg border-b border-purple-600">
                {/* Top Navigation Items */}
                <div className="flex-1 flex items-center gap-6">
                    {topNavigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive(item.href)
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'text-purple-100 hover:text-white hover:bg-purple-600/50'
                            )}
                            title={item.description}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="inline">{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                        <input
                            type="text"
                            placeholder="Search budgets, payments, reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-purple-500 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/90 backdrop-blur-sm"
                            aria-label="Search the platform"
                        />
                    </div>
                </div>

                {/* Notifications and User Profile */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Button variant="ghost" size="sm" className="text-purple-100 hover:bg-purple-600 hover:text-white relative">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                            {/* Notification badge */}
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full text-xs text-white flex items-center justify-center">
                                3
                            </span>
                        </Button>
                        <span className="sr-only">3 new notifications</span>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-purple-600/50 hover:text-white transition-colors text-purple-100"
                            aria-label="User profile menu"
                        >
                            <div className="text-right">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-purple-200">{user?.roles?.[0]}</p>
                            </div>
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-sm font-semibold bg-purple-600 text-white">
                                    {user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className={cn(
                                'h-4 w-4 text-purple-200 transition-transform',
                                isProfileOpen ? 'rotate-180' : ''
                            )} />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-purple-200 rounded-md shadow-lg py-2 z-50">
                                {/* User Info Header */}
                                <div className="px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-purple-100">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="text-lg font-semibold bg-purple-600 text-white">
                                                {user?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-purple-900 truncate">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-purple-600 truncate">
                                                {user?.email}
                                            </p>
                                            <p className="text-xs text-purple-500 mt-1">
                                                {user?.roles?.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Menu Items */}
                                <div className="py-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-purple-600 uppercase tracking-wider border-b border-purple-100">
                                        Profile Menu
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                    >
                                        <span>View Profile</span>
                                    </Link>
                                    <Link
                                        href="/profile/settings"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                    >
                                        <span>Account Settings</span>
                                    </Link>
                                </div>

                                {/* Account Actions */}
                                <div className="py-2 border-t border-purple-100">
                                    <div className="px-4 py-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
                                        Account Actions
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                    >
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
