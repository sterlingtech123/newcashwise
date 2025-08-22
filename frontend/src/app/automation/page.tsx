'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Bot,
    Zap,
    Play,
    Pause,
    Square,
    Settings,
    Plus,
    Search,
    Filter,
    Clock,
    Activity,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    Calendar,
    Target,
    Workflow,
    Database,
    FileText,
    CreditCard,
    Building2,
    Calculator
} from 'lucide-react';

export default function AutomationPage() {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const automationAgents = [
        {
            id: '1',
            name: 'Payment Approval Bot',
            description: 'Automatically routes payments based on amount thresholds',
            type: 'workflow',
            status: 'active',
            lastRun: '2 minutes ago',
            nextRun: '5 minutes',
            successRate: 98.5,
            totalRuns: 1247,
            lastSuccess: '2 minutes ago',
            lastError: null,
            triggers: ['payment_created', 'amount_threshold'],
            actions: ['route_approval', 'send_notification'],
            schedule: 'Every 5 minutes',
            isEnabled: true
        },
        {
            id: '2',
            name: 'Budget Alert Monitor',
            description: 'Monitors budget utilization and sends alerts',
            type: 'monitoring',
            status: 'active',
            lastRun: '1 hour ago',
            nextRun: '1 hour',
            successRate: 100,
            totalRuns: 876,
            lastSuccess: '1 hour ago',
            lastError: null,
            triggers: ['budget_update', 'utilization_threshold'],
            actions: ['send_alert', 'update_dashboard'],
            schedule: 'Every hour',
            isEnabled: true
        },
        {
            id: '3',
            name: 'Invoice Processing Bot',
            description: 'Automatically processes and validates invoices',
            type: 'processing',
            status: 'paused',
            lastRun: '3 hours ago',
            nextRun: 'Paused',
            successRate: 94.2,
            totalRuns: 2156,
            lastSuccess: '3 hours ago',
            lastError: 'Validation failed for invoice #12345',
            triggers: ['invoice_received', 'vendor_whitelist'],
            actions: ['validate_invoice', 'extract_data', 'create_record'],
            schedule: 'Every 15 minutes',
            isEnabled: false
        },
        {
            id: '4',
            name: 'Reconciliation Agent',
            description: 'Automatically reconciles bank transactions',
            type: 'reconciliation',
            status: 'active',
            lastRun: '30 minutes ago',
            nextRun: '1 hour',
            successRate: 96.8,
            totalRuns: 543,
            lastSuccess: '30 minutes ago',
            lastError: null,
            triggers: ['bank_statement', 'transaction_import'],
            actions: ['match_transactions', 'flag_unmatched', 'generate_report'],
            schedule: 'Every hour',
            isEnabled: true
        },
        {
            id: '5',
            name: 'Expense Categorization AI',
            description: 'Uses AI to automatically categorize expenses',
            type: 'ai',
            status: 'active',
            lastRun: '10 minutes ago',
            nextRun: '30 minutes',
            successRate: 89.7,
            totalRuns: 1892,
            lastSuccess: '10 minutes ago',
            lastError: 'Low confidence categorization for 5 transactions',
            triggers: ['expense_upload', 'manual_review'],
            actions: ['categorize_expense', 'confidence_score', 'flag_low_confidence'],
            schedule: 'Every 30 minutes',
            isEnabled: true
        }
    ];

    const filteredAgents = automationAgents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
        const matchesType = typeFilter === 'all' || agent.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            case 'stopped': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'workflow': return Workflow;
            case 'monitoring': return Activity;
            case 'processing': return RefreshCw;
            case 'reconciliation': return Database;
            case 'ai': return Bot;
            default: return Bot;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'workflow': return 'bg-blue-100 text-blue-800';
            case 'monitoring': return 'bg-purple-100 text-purple-800';
            case 'processing': return 'bg-orange-100 text-orange-800';
            case 'reconciliation': return 'bg-indigo-100 text-indigo-800';
            case 'ai': return 'bg-pink-100 text-pink-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleToggleAgent = (agentId: string) => {
        // Toggle agent status logic would go here
        console.log('Toggling agent:', agentId);
    };

    const handleRunNow = (agentId: string) => {
        // Run agent now logic would go here
        console.log('Running agent now:', agentId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Automation Agents
                        </h1>
                        <p className="text-gray-600">
                            Manage automated workflows, bots, and intelligent agents
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="error">Error</option>
                            <option value="stopped">Stopped</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            <option value="workflow">Workflow</option>
                            <option value="monitoring">Monitoring</option>
                            <option value="processing">Processing</option>
                            <option value="reconciliation">Reconciliation</option>
                            <option value="ai">AI</option>
                        </select>

                        <Button onClick={() => console.log('Create new agent')}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Agent
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Automation Agents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAgents.map((agent) => {
                    const TypeIcon = getTypeIcon(agent.type);

                    return (
                        <Card key={agent.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                {/* Agent Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <TypeIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                                                <Badge
                                                    variant="secondary"
                                                    className={getTypeColor(agent.type)}
                                                >
                                                    {agent.type.toUpperCase()}
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className={getStatusColor(agent.status)}
                                                >
                                                    {agent.status}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-600 text-sm">{agent.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{agent.successRate}%</p>
                                        <p className="text-xs text-gray-500">Success Rate</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{agent.totalRuns}</p>
                                        <p className="text-xs text-gray-500">Total Runs</p>
                                    </div>
                                </div>

                                {/* Agent Details */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Last Run:</span>
                                        <span className="font-medium">{agent.lastRun}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Next Run:</span>
                                        <span className="font-medium">{agent.nextRun}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Schedule:</span>
                                        <span className="font-medium">{agent.schedule}</span>
                                    </div>
                                </div>

                                {/* Triggers and Actions */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700">Triggers</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {agent.triggers.map((trigger, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {trigger}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">Actions</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {agent.actions.map((action, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {action}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Agent Controls */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleAgent(agent.id)}
                                            className={agent.isEnabled ? 'text-yellow-600' : 'text-green-600'}
                                        >
                                            {agent.isEnabled ? (
                                                <>
                                                    <Pause className="h-4 w-4 mr-1" />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-4 w-4 mr-1" />
                                                    Start
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRunNow(agent.id)}
                                        >
                                            <RefreshCw className="h-4 w-4 mr-1" />
                                            Run Now
                                        </Button>
                                    </div>

                                    <Button variant="ghost" size="sm">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredAgents.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No automation agents found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Get started by creating your first automation agent'
                            }
                        </p>
                        <Button onClick={() => console.log('Create new agent')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Automation Agent
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
