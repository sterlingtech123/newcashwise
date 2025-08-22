'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings,
    Save,
    RefreshCw,
    Database,
    Shield,
    Bell,
    Globe,
    Users,
    FileText,
    Calendar,
    DollarSign,
    Lock,
    Eye,
    EyeOff,
    Key,
    Server,
    HardDrive,
    Network,
    Clock,
    AlertTriangle,
    CheckCircle,
} from 'lucide-react';

interface SystemConfig {
    id: string;
    category: string;
    name: string;
    value: string | boolean | number;
    type: 'string' | 'boolean' | 'number' | 'select';
    description: string;
    isRequired: boolean;
    isSensitive: boolean;
    lastModified: string;
    modifiedBy: string;
}

export default function SystemConfigurationPage() {
    const [configs, setConfigs] = useState<SystemConfig[]>([
        {
            id: '1',
            category: 'Security',
            name: 'Session Timeout (minutes)',
            value: 30,
            type: 'number',
            description: 'User session timeout in minutes',
            isRequired: true,
            isSensitive: false,
            lastModified: '2025-01-20T10:30:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '2',
            category: 'Security',
            name: 'Password Policy',
            value: 'Strong',
            type: 'select',
            description: 'Password complexity requirements',
            isRequired: true,
            isSensitive: false,
            lastModified: '2025-01-19T14:20:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '3',
            category: 'Security',
            name: 'Two-Factor Authentication',
            value: true,
            type: 'boolean',
            description: 'Enable 2FA for all users',
            isRequired: false,
            isSensitive: false,
            lastModified: '2025-01-18T16:45:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '4',
            category: 'Database',
            name: 'Connection Pool Size',
            value: 20,
            type: 'number',
            description: 'Database connection pool size',
            isRequired: true,
            isSensitive: false,
            lastModified: '2025-01-17T09:15:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '5',
            category: 'Database',
            name: 'Backup Retention (days)',
            value: 30,
            type: 'number',
            description: 'Number of days to retain backups',
            isRequired: true,
            isSensitive: false,
            lastModified: '2025-01-16T11:30:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '6',
            category: 'Notifications',
            name: 'Email Notifications',
            value: true,
            type: 'boolean',
            description: 'Enable email notifications',
            isRequired: false,
            isSensitive: false,
            lastModified: '2025-01-15T13:20:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '7',
            category: 'Notifications',
            name: 'SMS Notifications',
            value: false,
            type: 'boolean',
            description: 'Enable SMS notifications',
            isRequired: false,
            isSensitive: false,
            lastModified: '2025-01-14T15:45:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '8',
            category: 'General',
            name: 'System Name',
            value: 'CashWise Budget Management System',
            type: 'string',
            description: 'Display name for the system',
            isRequired: true,
            isSensitive: false,
            lastModified: '2025-01-13T10:00:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '9',
            category: 'General',
            name: 'Default Currency',
            value: 'NGN',
            type: 'select',
            description: 'Default currency for the system',
            isRequired: true,
            isSensitive: false,
            lastModified: '2025-01-12T12:30:00Z',
            modifiedBy: 'System Admin'
        },
        {
            id: '10',
            category: 'General',
            name: 'Time Zone',
            value: 'Africa/Lagos',
            type: 'select',
            description: 'System time zone',
            isRequired: true,
            isSensitive: false,
            lastModified: '2025-01-11T14:15:00Z',
            modifiedBy: 'System Admin'
        }
    ]);

    const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = ['Security', 'Database', 'Notifications', 'General'];
    const passwordPolicies = ['Weak', 'Medium', 'Strong', 'Very Strong'];
    const currencies = ['NGN', 'USD', 'EUR', 'GBP'];
    const timeZones = ['Africa/Lagos', 'UTC', 'America/New_York', 'Europe/London'];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Security': return 'bg-red-100 text-red-800';
            case 'Database': return 'bg-blue-100 text-blue-800';
            case 'Notifications': return 'bg-green-100 text-green-800';
            case 'General': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Security': return Shield;
            case 'Database': return Database;
            case 'Notifications': return Bell;
            case 'General': return Settings;
            default: return Settings;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredConfigs = configs.filter(config => {
        const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            config.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || config.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const handleEdit = (config: SystemConfig) => {
        setEditingConfig(config);
    };

    const handleSave = (configId: string, newValue: string | boolean | number) => {
        setConfigs(prev => prev.map(config =>
            config.id === configId
                ? {
                    ...config,
                    value: newValue,
                    lastModified: new Date().toISOString(),
                    modifiedBy: 'Current User'
                }
                : config
        ));
        setEditingConfig(null);
    };

    const handleCancel = () => {
        setEditingConfig(null);
    };

    const renderConfigValue = (config: SystemConfig) => {
        if (editingConfig?.id === config.id) {
            switch (config.type) {
                case 'boolean':
                    return (
                        <Switch
                            checked={config.value as boolean}
                            onCheckedChange={(checked) => handleSave(config.id, checked)}
                        />
                    );
                case 'select':
                    let options: string[] = [];
                    switch (config.name) {
                        case 'Password Policy':
                            options = passwordPolicies;
                            break;
                        case 'Default Currency':
                            options = currencies;
                            break;
                        case 'Time Zone':
                            options = timeZones;
                            break;
                        default:
                            options = [];
                    }
                    return (
                        <Select value={config.value as string} onValueChange={(value) => handleSave(config.id, value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );
                case 'number':
                    return (
                        <Input
                            type="number"
                            value={config.value as number}
                            onChange={(e) => handleSave(config.id, Number(e.target.value))}
                            className="w-32"
                        />
                    );
                default:
                    return (
                        <Input
                            value={config.value as string}
                            onChange={(e) => handleSave(config.id, e.target.value)}
                            className="w-64"
                        />
                    );
            }
        } else {
            switch (config.type) {
                case 'boolean':
                    return (
                        <div className="flex items-center gap-2">
                            {config.value ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-gray-400" />
                            )}
                            <span className={config.value ? 'text-green-600' : 'text-gray-500'}>
                                {config.value ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    );
                case 'select':
                case 'string':
                case 'number':
                    return (
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {config.value}
                        </span>
                    );
                default:
                    return <span>{String(config.value)}</span>;
            }
        }
    };

    const stats = {
        total: configs.length,
        security: configs.filter(c => c.category === 'Security').length,
        database: configs.filter(c => c.category === 'Database').length,
        notifications: configs.filter(c => c.category === 'Notifications').length,
        general: configs.filter(c => c.category === 'General').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
                    <p className="text-gray-600 mt-2">Manage system settings, security, and preferences</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save All Changes
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Settings className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Settings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Shield className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Security</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.security}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Database className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Database</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.database}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Bell className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Notifications</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.notifications}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Settings className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">General</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.general}</p>
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
                                <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search configurations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Configuration Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuration Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {categories.map((category) => {
                            const categoryConfigs = filteredConfigs.filter(config => config.category === category);
                            if (categoryConfigs.length === 0) return null;

                            const CategoryIcon = getCategoryIcon(category);

                            return (
                                <div key={category} className="space-y-4">
                                    <div className="flex items-center gap-3 pb-2 border-b">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <CategoryIcon className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                                        <Badge className={getCategoryColor(category)}>
                                            {categoryConfigs.length} settings
                                        </Badge>
                                    </div>

                                    <div className="space-y-4 pl-8">
                                        {categoryConfigs.map((config) => (
                                            <div key={config.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-medium text-gray-900">{config.name}</h4>
                                                        {config.isRequired && (
                                                            <Badge variant="outline" className="text-red-600 border-red-600">
                                                                Required
                                                            </Badge>
                                                        )}
                                                        {config.isSensitive && (
                                                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                                                                Sensitive
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-3">{config.description}</p>

                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span>Last modified: {formatDate(config.lastModified)}</span>
                                                        <span>by {config.modifiedBy}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="min-w-[200px]">
                                                        {renderConfigValue(config)}
                                                    </div>

                                                    {editingConfig?.id === config.id ? (
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="outline" onClick={handleCancel}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredConfigs.length === 0 && (
                        <div className="text-center py-12">
                            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No configurations found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || categoryFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'No system configurations are available'
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
