'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X, Eye, Archive, Trash2, Star, StarOff, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'unread' | 'read';
    isStarred: boolean;
    createdAt: string;
    actions?: Array<{
        id: string;
        label: string;
        action: string;
        url?: string;
    }>;
}

interface NotificationBellProps {
    className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const router = useRouter();

    // Mock notifications data
    useEffect(() => {
        setNotifications([
            {
                id: '1',
                title: 'Budget Approved',
                message: 'Your budget request for Q1 2024 has been approved by the finance team.',
                type: 'success',
                category: 'budget',
                priority: 'high',
                status: 'unread',
                isStarred: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
                actions: [
                    { id: 'view', label: 'View Budget', action: 'view', url: '/budgets' }
                ]
            },
            {
                id: '2',
                title: 'Payment Request Pending',
                message: 'A new payment request requires your approval.',
                type: 'warning',
                category: 'payment',
                priority: 'medium',
                status: 'unread',
                isStarred: true,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                actions: [
                    { id: 'approve', label: 'Approve', action: 'approve', url: '/payment-confirmation' },
                    { id: 'reject', label: 'Reject', action: 'reject', url: '/payment-confirmation' }
                ]
            },
            {
                id: '3',
                title: 'System Maintenance',
                message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM.',
                type: 'info',
                category: 'system',
                priority: 'low',
                status: 'read',
                isStarred: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
            }
        ]);
    }, []);

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    const handleToggleStar = (id: string) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, isStarred: !n.isStarred } : n
            )
        );
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, status: 'read' as const } : n
            )
        );
    };

    const handleArchive = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleAction = (action: { id: string; label: string; action: string; url?: string }) => {
        if (action.url) {
            router.push(action.url);
        }
        setIsOpen(false);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'warning':
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            case 'error':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'urgent':
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-blue-500" />;
        }
    };

    const getTypeBadgeVariant = (type: string) => {
        switch (type) {
            case 'success':
                return 'default';
            case 'warning':
                return 'secondary';
            case 'error':
                return 'destructive';
            case 'urgent':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative ${className}`}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Notifications</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="h-6 w-6 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${notification.status === 'unread' ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getTypeIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                                            {notification.title}
                                                        </h4>
                                                        <Badge
                                                            variant={getTypeBadgeVariant(notification.type)}
                                                            className="text-xs"
                                                        >
                                                            {notification.type}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => handleToggleStar(notification.id)}
                                                        >
                                                            {notification.isStarred ? (
                                                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                            ) : (
                                                                <StarOff className="h-3 w-3 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => handleArchive(notification.id)}
                                                        >
                                                            <Archive className="h-3 w-3 text-gray-400" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>

                                                {notification.actions && notification.actions.length > 0 && (
                                                    <div className="flex gap-2 mb-2">
                                                        {notification.actions.map((action) => (
                                                            <Button
                                                                key={action.id}
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-6 text-xs"
                                                                onClick={() => handleAction(action)}
                                                            >
                                                                {action.label}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{formatTimeAgo(notification.createdAt)}</span>
                                                    {notification.status === 'unread' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 text-xs"
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                        >
                                                            Mark as Read
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
