'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useAccessControl, type NavigationItem } from '@/hooks/use-access-control';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogoutConfirmation } from '@/components/ui/logout-confirmation';
import { NotificationBell } from '@/components/ui/notification-bell';
import {
  LayoutDashboard,
  PieChart,
  BarChart3,
  Bot,
  Search,
  Bell,
  Users,
  Building2,
  BookOpen,
  Settings,
  Workflow,
  CreditCard,
  FileText,
  CheckCircle,
  User,
  ChevronDown,
  Calculator,
  Eye,
  Edit,
  Download,
  Trash2,
  Plus,
  Check,
  XCircle,
  Crown,
  DollarSign,
  Shield,
} from 'lucide-react';

export function MainNavigation() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { getAccessibleNavigation, getAccessiblePages } = useAccessControl();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [expandedItems] = useState<Set<string>>(new Set());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Get navigation items based on user role
  const sidebarNavigation = user ? getAccessibleNavigation() : [];
  const topMenuPages = user ? getAccessiblePages() : [];

  // Get header color based on header name
  const getHeaderColor = (headerName: string) => {
    switch (headerName) {
      case 'Payment Initiation':
        return 'bg-blue-600 text-white border-blue-700';
      case 'Payment Approvals':
        return 'bg-green-600 text-white border-green-700';
      case 'Financial Management':
        return 'bg-purple-600 text-white border-purple-700';
      case 'User & Organization Admin':
        return 'bg-orange-600 text-white border-orange-700';
      case 'System Administration':
        return 'bg-red-600 text-white border-red-700';
      default:
        return 'bg-gray-600 text-white border-gray-700';
    }
  };

  // Get header icon color based on header name
  const getHeaderIconColor = (headerName: string) => {
    switch (headerName) {
      case 'Payment Initiation':
        return 'text-blue-200';
      case 'Payment Approvals':
        return 'text-green-200';
      case 'Financial Management':
        return 'text-purple-200';
      case 'User & Organization Admin':
        return 'text-orange-200';
      case 'System Administration':
        return 'text-red-200';
      default:
        return 'text-gray-200';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setShowLogoutConfirmation(false);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      LayoutDashboard,
      PieChart,
      BarChart3,
      Bot,
      Search,
      Bell,
      Users,
      Building2,
      BookOpen,
      Settings,
      Workflow,
      CreditCard,
      FileText,
      CheckCircle,
      User,
      Calculator,
      Eye,
      Edit,
      Download,
      Trash2,
      Plus,
      Check,
      XCircle,
      Crown,
      DollarSign,
      Shield,
    };

    return iconMap[iconName] || User;
  };

  const renderSidebarNavigationItem = (item: NavigationItem) => {
    const IconComponent = getIconComponent(item.icon);
    const isActive = pathname === item.href;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    if (item.isHeader) {
      // Render header item with sub-menus
      return (
        <div key={item.name} className="space-y-1">
          <div className="px-3 py-2">
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider rounded-lg px-3 py-2 border ${getHeaderColor(item.name)}`}>
              <IconComponent className={`h-4 w-4 ${getHeaderIconColor(item.name)}`} />
              {item.name}
            </div>
          </div>
          {hasSubItems && (
            <div className="space-y-1">
              {item.subItems!.map((subItem) => {
                const SubIconComponent = getIconComponent(subItem.icon);
                const isSubActive = pathname === subItem.href;

                return (
                  <Link
                    key={subItem.name}
                    href={subItem.href || '#'}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-purple-100 hover:text-purple-900 ${isSubActive
                      ? 'bg-purple-100 text-purple-900'
                      : 'text-gray-700 hover:bg-purple-50'
                      }`}
                  >
                    <SubIconComponent className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{subItem.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Render regular navigation item
    return (
      <Link
        key={item.name}
        href={item.href || '#'}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-purple-100 hover:text-purple-900 ${isActive
          ? 'bg-purple-100 text-purple-900'
          : 'text-gray-700 hover:bg-purple-50'
          }`}
      >
        <IconComponent className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{item.name}</span>
      </Link>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Left Sidebar Content */}
      <div className="flex flex-col h-full">
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarNavigation.map(renderSidebarNavigationItem)}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 text-center">
            CashWise v1.0
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {topMenuPages.map((page) => {
              const IconComponent = getIconComponent(page.icon);
              const isActive = pathname === page.href;

              return (
                <Link
                  key={page.name}
                  href={page.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  {page.name}
                </Link>
              );
            })}

            {/* Mobile Profile Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-gray-400" />
                  View Profile
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLogoutConfirmation(true);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <XCircle className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
