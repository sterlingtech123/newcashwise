'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    Search,
    Filter,
    Bell,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    Download,
    Send,
    History,
    BarChart3,
    Calendar,
    User,
    Building2,
    DollarSign,
    TrendingUp,
    Check,
    X,
    MessageSquare,
    Calculator,
    PieChart,
    Activity,
    Settings,
    Trash2,
    Eye,
    EyeOff,
    Star,
    StarOff,
    Archive,
    RefreshCw,
    MoreHorizontal,
    Mail,
    Phone,
    Globe,
    Zap
} from 'lucide-react';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
    category: 'budget' | 'payment' | 'workflow' | 'system' | 'user' | 'general';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'unread' | 'read' | 'archived' | 'deleted';
    isStarred: boolean;
    sender: string;
    senderRole: string;
    recipient: string;
    recipientRole: string;
    createdAt: string;
    readAt?: string;
    expiresAt?: string;
    actions: NotificationAction[];
    metadata: Record<string, any>;
    channels: NotificationChannel[];
}

export interface NotificationAction {
    id: string;
    label: string;
    action: string;
    url?: string;
    requiresConfirmation: boolean;
}

export interface NotificationChannel {
    type: 'email' | 'sms' | 'push' | 'in_app' | 'webhook';
    status: 'sent' | 'pending' | 'failed';
    sentAt?: string;
    errorMessage?: string;
}

export default function NotificationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showArchived, setShowArchived] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
    const [bulkAction, setBulkAction] = useState<string>('');
    const [showSettings, setShowSettings] = useState(false);

    // Mock notifications data
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 'notif-001',
            title: 'Budget Approval Required',
            message: 'Healthcare Infrastructure Development budget is pending your approval. Please review and take action.',
            type: 'warning',
            category: 'budget',
            priority: 'high',
            status: 'unread',
            isStarred: true,
            sender: 'Budget Team',
            senderRole: 'Budget Officer',
            recipient: 'Mr. John Smith',
            recipientRole: 'Senior Budget Analyst',
            createdAt: '2025-01-17T10:30:00Z',
            expiresAt: '2025-01-20T10:30:00Z',
            actions: [
                {
                    id: 'approve',
                    label: 'Approve',
                    action: 'approve_budget',
                    url: '/budgets/governor-approval',
                    requiresConfirmation: true
                },
                {
                    id: 'reject',
                    label: 'Reject',
                    action: 'reject_budget',
                    url: '/budgets/governor-approval',
                    requiresConfirmation: true
                },
                {
                    id: 'view',
                    label: 'View Details',
                    action: 'view_budget',
                    url: '/budgets/verification',
                    requiresConfirmation: false
                }
            ],
            metadata: {
                budgetId: 'wf-001',
                budgetAmount: '₦2.5B',
                dueDate: '2025-01-20'
            },
            channels: [
                { type: 'email', status: 'sent', sentAt: '2025-01-17T10:30:00Z' },
                { type: 'in_app', status: 'sent', sentAt: '2025-01-17T10:30:00Z' }
            ]
        },
        {
            id: 'notif-002',
            title: 'Payment Request Approved',
            message: 'Your payment request for ₦150M has been approved and is being processed.',
            type: 'success',
            category: 'payment',
            priority: 'medium',
            status: 'read',
            isStarred: false,
            sender: 'Finance Department',
            senderRole: 'Finance Officer',
            recipient: 'Ms. Sarah Johnson',
            recipientRole: 'Department Head',
            createdAt: '2025-01-17T09:15:00Z',
            readAt: '2025-01-17T09:20:00Z',
            actions: [
                {
                    id: 'view',
                    label: 'View Details',
                    action: 'view_payment',
                    url: '/payment-requests',
                    requiresConfirmation: false
                },
                {
                    id: 'download',
                    label: 'Download Receipt',
                    action: 'download_receipt',
                    requiresConfirmation: false
                }
            ],
            metadata: {
                paymentId: 'pay-001',
                amount: '₦150M',
                approvedBy: 'Finance Director'
            },
            channels: [
                { type: 'email', status: 'sent', sentAt: '2025-01-17T09:15:00Z' },
                { type: 'sms', status: 'sent', sentAt: '2025-01-17T09:15:00Z' }
            ]
        },
        {
            id: 'notif-003',
            title: 'System Maintenance Scheduled',
            message: 'Scheduled system maintenance will occur on January 20th, 2025 from 2:00 AM to 4:00 AM. Please plan accordingly.',
            type: 'info',
            category: 'system',
            priority: 'medium',
            status: 'unread',
            isStarred: false,
            sender: 'IT Department',
            senderRole: 'System Administrator',
            recipient: 'All Users',
            recipientRole: 'System Users',
            createdAt: '2025-01-17T08:00:00Z',
            expiresAt: '2025-01-20T04:00:00Z',
            actions: [
                {
                    id: 'acknowledge',
                    label: 'Acknowledge',
                    action: 'acknowledge_maintenance',
                    requiresConfirmation: false
                }
            ],
            metadata: {
                maintenanceType: 'scheduled',
                duration: '2 hours',
                impact: 'minimal'
            },
            channels: [
                { type: 'email', status: 'sent', sentAt: '2025-01-17T08:00:00Z' },
                { type: 'in_app', status: 'sent', sentAt: '2025-01-17T08:00:00Z' },
                { type: 'push', status: 'sent', sentAt: '2025-01-17T08:00:00Z' }
            ]
        },
        {
            id: 'notif-004',
            title: 'Workflow Stage Completed',
            message: 'Budget verification stage for Educational Facilities Upgrade has been completed successfully.',
            type: 'success',
            category: 'workflow',
            priority: 'low',
            status: 'read',
            isStarred: false,
            sender: 'Workflow System',
            senderRole: 'System',
            recipient: 'Mr. David Wilson',
            recipientRole: 'Budget Analyst',
            createdAt: '2025-01-17T07:45:00Z',
            readAt: '2025-01-17T08:00:00Z',
            actions: [
                {
                    id: 'view',
                    label: 'View Workflow',
                    action: 'view_workflow',
                    url: '/budgets/verification',
                    requiresConfirmation: false
                }
            ],
            metadata: {
                workflowId: 'wf-002',
                stage: 'verification',
                completedBy: 'Ms. Sarah Johnson'
            },
            channels: [
                { type: 'in_app', status: 'sent', sentAt: '2025-01-17T07:45:00Z' }
            ]
        },
        {
            id: 'notif-005',
            title: 'Urgent: Budget Overrun Alert',
            message: 'Healthcare Infrastructure budget has exceeded 90% of allocated amount. Immediate action required.',
            type: 'error',
            category: 'budget',
            priority: 'urgent',
            status: 'unread',
            isStarred: true,
            sender: 'Budget Monitoring System',
            senderRole: 'System',
            recipient: 'Finance Director',
            recipientRole: 'Finance Director',
            createdAt: '2025-01-17T06:30:00Z',
            expiresAt: '2025-01-18T06:30:00Z',
            actions: [
                {
                    id: 'review',
                    label: 'Review Budget',
                    action: 'review_budget',
                    url: '/budgets',
                    requiresConfirmation: false
                },
                {
                    id: 'freeze',
                    label: 'Freeze Budget',
                    action: 'freeze_budget',
                    requiresConfirmation: true
                }
            ],
            metadata: {
                budgetId: 'wf-001',
                currentSpending: '₦2.25B',
                allocatedAmount: '₦2.5B',
                utilization: '90%'
            },
            channels: [
                { type: 'email', status: 'sent', sentAt: '2025-01-17T06:30:00Z' },
                { type: 'sms', status: 'sent', sentAt: '2025-01-17T06:30:00Z' },
                { type: 'push', status: 'sent', sentAt: '2025-01-17T06:30:00Z' },
                { type: 'in_app', status: 'sent', sentAt: '2025-01-17T06:30:00Z' }
            ]
        }
    ]);

    // Filter notifications based on search and filters
    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || notification.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
        const matchesArchived = showArchived ? true : notification.status !== 'archived';

        return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesPriority && matchesArchived;
    });

    // Statistics
    const stats = {
        total: notifications.length,
        unread: notifications.filter(n => n.status === 'unread').length,
        urgent: notifications.filter(n => n.priority === 'urgent').length,
        starred: notifications.filter(n => n.isStarred).length
    };

    // Action handlers
    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId
                ? { ...n, status: 'read' as const, readAt: new Date().toISOString() }
                : n
        ));
    };

    const handleMarkAsUnread = (notificationId: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId
                ? { ...n, status: 'unread' as const, readAt: undefined }
                : n
        ));
    };

    const handleToggleStar = (notificationId: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId
                ? { ...n, isStarred: !n.isStarred }
                : n
        ));
    };

    const handleArchive = (notificationId: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId
                ? { ...n, status: 'archived' as const }
                : n
        ));
    };

    const handleDelete = (notificationId: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId
                ? { ...n, status: 'deleted' as const }
                : n
        ));
    };

    const handleBulkAction = () => {
        if (bulkAction && selectedNotifications.size > 0) {
            selectedNotifications.forEach(id => {
                switch (bulkAction) {
                    case 'mark_read':
                        handleMarkAsRead(id);
                        break;
                    case 'mark_unread':
                        handleMarkAsUnread(id);
                        break;
                    case 'archive':
                        handleArchive(id);
                        break;
                    case 'delete':
                        handleDelete(id);
                        break;
                }
            });
            setSelectedNotifications(new Set());
            setBulkAction('');
        }
    };

    const handleSelectAll = () => {
        if (selectedNotifications.size === filteredNotifications.length) {
            setSelectedNotifications(new Set());
        } else {
            setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
            case 'urgent': return <AlertCircle className="h-5 w-5 text-red-600" />;
            default: return <Bell className="h-5 w-5 text-blue-600" />;
        }
    };

    const getTypeBadgeVariant = (type: string) => {
        switch (type) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'error': return 'destructive';
            case 'urgent': return 'destructive';
            default: return 'default';
        }
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority) {
            case 'low': return 'secondary';
            case 'medium': return 'default';
            case 'high': return 'warning';
            case 'urgent': return 'destructive';
            default: return 'secondary';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'budget': return <Calculator className="h-4 w-4" />;
            case 'payment': return <DollarSign className="h-4 w-4" />;
            case 'workflow': return <Activity className="h-4 w-4" />;
            case 'system': return <Settings className="h-4 w-4" />;
            case 'user': return <User className="h-4 w-4" />;
            default: return <Bell className="h-4 w-4" />;
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-2">Manage your system notifications and alerts</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setShowSettings(true)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Bell className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Eye className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Unread</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Urgent</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Star className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Starred</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.starred}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="budget">Budget</SelectItem>
                                    <SelectItem value="payment">Payment</SelectItem>
                                    <SelectItem value="workflow">Workflow</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="general">General</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="unread">Unread</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedNotifications.size > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedNotifications.size === filteredNotifications.length}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">
                                    {selectedNotifications.size} notification(s) selected
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Select value={bulkAction} onValueChange={setBulkAction}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Bulk Actions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mark_read">Mark as Read</SelectItem>
                                        <SelectItem value="mark_unread">Mark as Unread</SelectItem>
                                        <SelectItem value="archive">Archive</SelectItem>
                                        <SelectItem value="delete">Delete</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleBulkAction} disabled={!bulkAction}>
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                    <Card
                        key={notification.id}
                        className={`transition-all duration-200 hover:shadow-lg ${notification.status === 'unread' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                {/* Checkbox for bulk selection */}
                                <input
                                    type="checkbox"
                                    checked={selectedNotifications.has(notification.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedNotifications(prev => new Set(Array.from(prev).concat(notification.id)));
                                        } else {
                                            setSelectedNotifications(prev => {
                                                const newSet = new Set(Array.from(prev));
                                                newSet.delete(notification.id);
                                                return newSet;
                                            });
                                        }
                                    }}
                                    className="mt-1 rounded border-gray-300"
                                />

                                {/* Notification Icon */}
                                <div className="flex-shrink-0">
                                    {getTypeIcon(notification.type)}
                                </div>

                                {/* Notification Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {notification.title}
                                            </h3>
                                            <Badge variant={getTypeBadgeVariant(notification.type)}>
                                                {notification.type}
                                            </Badge>
                                            <Badge variant={getPriorityBadgeVariant(notification.priority)}>
                                                {notification.priority}
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                {getCategoryIcon(notification.category)}
                                                <span className="text-sm text-gray-500 capitalize">
                                                    {notification.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleStar(notification.id)}
                                            >
                                                {notification.isStarred ? (
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                ) : (
                                                    <StarOff className="h-4 w-4 text-gray-400" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleArchive(notification.id)}
                                            >
                                                <Archive className="h-4 w-4 text-gray-400" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(notification.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-3">{notification.message}</p>

                                    {/* Metadata */}
                                    {Object.keys(notification.metadata).length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                                            {Object.entries(notification.metadata).map(([key, value]) => (
                                                <div key={key}>
                                                    <p className="text-xs text-gray-500 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {typeof value === 'string' ? value : JSON.stringify(value)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {notification.actions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {notification.actions.map((action) => (
                                                <Button
                                                    key={action.id}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        if (action.url) {
                                                            window.open(action.url, '_blank');
                                                        }
                                                        if (action.action === 'acknowledge_maintenance') {
                                                            handleMarkAsRead(notification.id);
                                                        }
                                                    }}
                                                >
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <span>From: {notification.sender} ({notification.senderRole})</span>
                                            <span>To: {notification.recipient} ({notification.recipientRole})</span>
                                            <span>{formatTimeAgo(notification.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {notification.status === 'unread' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Mark as Read
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMarkAsUnread(notification.id)}
                                                >
                                                    <EyeOff className="h-4 w-4 mr-1" />
                                                    Mark as Unread
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                        <p className="text-gray-600">
                            {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'You\'re all caught up! No new notifications at the moment.'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Notification Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Settings className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                                        <p className="text-gray-600">Configure your notification preferences</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <Tabs defaultValue="channels" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="channels">Channels</TabsTrigger>
                                    <TabsTrigger value="categories">Categories</TabsTrigger>
                                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                                </TabsList>

                                <TabsContent value="channels" className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium">Email Notifications</p>
                                                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium">In-App Notifications</p>
                                                    <p className="text-sm text-gray-600">Show notifications in the application</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-5 w-5 text-purple-600" />
                                                <div>
                                                    <p className="font-medium">SMS Notifications</p>
                                                    <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
                                                </div>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Zap className="h-5 w-5 text-orange-600" />
                                                <div>
                                                    <p className="font-medium">Push Notifications</p>
                                                    <p className="text-sm text-gray-600">Browser push notifications</p>
                                                </div>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="categories" className="space-y-4">
                                    <div className="space-y-4">
                                        {['budget', 'payment', 'workflow', 'system', 'user', 'general'].map((category) => (
                                            <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {getCategoryIcon(category)}
                                                    <div>
                                                        <p className="font-medium capitalize">{category} Notifications</p>
                                                        <p className="text-sm text-gray-600">
                                                            Receive notifications for {category} related activities
                                                        </p>
                                                    </div>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="schedule" className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Quiet Hours</p>
                                                <p className="text-sm text-gray-600">Mute non-urgent notifications during quiet hours</p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Weekly Digest</p>
                                                <p className="text-sm text-gray-600">Receive a weekly summary of notifications</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex gap-3 pt-6">
                                <Button onClick={() => setShowSettings(false)} className="flex-1">
                                    Save Settings
                                </Button>
                                <Button variant="outline" onClick={() => setShowSettings(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
