'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Workflow,
    Plus,
    Save,
    Edit,
    Trash2,
    Eye,
    Settings,
    Users,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    FileText,
    Building2,
    RefreshCw,
    Play,
    Square
} from 'lucide-react';

export default function WorkflowConfigurationPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('workflows');
    const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock data for workflows
    const workflows = [
        {
            id: '1',
            name: 'Budget Approval Workflow',
            description: 'Multi-level approval for budget requests',
            type: 'budget',
            status: 'active',
            approvalLevels: 3,
            autoApproval: false,
            requireDocuments: true,
            minAmount: 1000000,
            maxAmount: 100000000,
            stages: [
                { level: 1, role: 'Department Head', amount: 1000000, autoApprove: false },
                { level: 2, role: 'Finance Director', amount: 10000000, autoApprove: false },
                { level: 3, role: 'State Governor', amount: 100000000, autoApprove: false }
            ],
            createdAt: '2025-01-15',
            updatedAt: '2025-01-20'
        },
        {
            id: '2',
            name: 'Payment Approval Workflow',
            description: 'Payment request approval process',
            type: 'payment',
            status: 'active',
            approvalLevels: 2,
            autoApproval: true,
            requireDocuments: true,
            minAmount: 100000,
            maxAmount: 50000000,
            stages: [
                { level: 1, role: 'Accountant', amount: 100000, autoApprove: true },
                { level: 2, role: 'Finance Manager', amount: 50000000, autoApprove: false }
            ],
            createdAt: '2025-01-10',
            updatedAt: '2025-01-18'
        },
        {
            id: '3',
            name: 'Contract Approval Workflow',
            description: 'Contract and procurement approval process',
            type: 'contract',
            status: 'draft',
            approvalLevels: 4,
            autoApproval: false,
            requireDocuments: true,
            minAmount: 5000000,
            maxAmount: 500000000,
            stages: [
                { level: 1, role: 'Procurement Officer', amount: 5000000, autoApprove: false },
                { level: 2, role: 'Legal Officer', amount: 50000000, autoApprove: false },
                { level: 3, role: 'Finance Director', amount: 200000000, autoApprove: false },
                { level: 4, role: 'State Governor', amount: 500000000, autoApprove: false }
            ],
            createdAt: '2025-01-12',
            updatedAt: '2025-01-19'
        }
    ];

    // Mock data for workflow policies
    const policies = [
        {
            id: '1',
            name: 'High-Value Transaction Policy',
            description: 'Special approval requirements for transactions above 100M',
            workflowId: '1',
            conditions: ['amount > 100000000', 'department = Finance'],
            actions: ['require_governor_approval', 'audit_trail'],
            status: 'active'
        },
        {
            id: '2',
            name: 'Emergency Fund Policy',
            description: 'Fast-track approval for emergency fund releases',
            workflowId: '2',
            conditions: ['category = Emergency', 'urgency = High'],
            actions: ['reduce_approval_levels', 'notify_management'],
            status: 'active'
        }
    ];

    // Mock data for automation rules
    const automationRules = [
        {
            id: '1',
            name: 'Auto-Approval for Small Amounts',
            description: 'Automatically approve transactions below threshold',
            trigger: 'amount < 100000',
            action: 'auto_approve',
            status: 'active',
            priority: 1
        },
        {
            id: '2',
            name: 'Document Validation Rule',
            description: 'Ensure required documents are uploaded',
            trigger: 'document_count < required_documents',
            action: 'reject_with_message',
            status: 'active',
            priority: 2
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'budget': return 'bg-blue-100 text-blue-800';
            case 'payment': return 'bg-green-100 text-green-800';
            case 'contract': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const tabs = [
        { id: 'workflows', name: 'Workflows', icon: Workflow },
        { id: 'policies', name: 'Policies', icon: FileText },
        { id: 'automation', name: 'Automation Rules', icon: Settings }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div>
                <main className="py-8">
                    <div className="mx-auto max-w-7xl pr-4 sm:pr-6 lg:pr-8 pl-0">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Workflow className="h-8 w-8 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Workflow Configuration
                                    </h1>
                                    <p className="text-gray-600">
                                        Configure approval workflows, policies, and automation rules
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className="flex space-x-8 border-b border-gray-200">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                                                ? 'border-purple-500 text-purple-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <tab.icon className="h-4 w-4" />
                                            {tab.name}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {/* Workflows Tab */}
                            {activeTab === 'workflows' && (
                                <div className="space-y-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                                                        <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
                                                    </div>
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Workflow className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Active</p>
                                                        <p className="text-2xl font-bold text-green-600">
                                                            {workflows.filter(w => w.status === 'active').length}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Draft</p>
                                                        <p className="text-2xl font-bold text-yellow-600">
                                                            {workflows.filter(w => w.status === 'draft').length}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Auto-Approval</p>
                                                        <p className="text-2xl font-bold text-purple-600">
                                                            {workflows.filter(w => w.autoApproval).length}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <Play className="h-6 w-6 text-purple-600" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Workflows Table */}
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>Workflow Definitions</CardTitle>
                                                <Button onClick={() => setShowCreateModal(true)}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    New Workflow
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Workflow Name</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Approval Levels</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Amount Range</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {workflows.map((workflow) => (
                                                            <tr key={workflow.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="py-4 px-4">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{workflow.name}</p>
                                                                        <p className="text-sm text-gray-500">{workflow.description}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge variant="secondary" className={getTypeColor(workflow.type)}>
                                                                        {workflow.type}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge variant="secondary" className={getStatusColor(workflow.status)}>
                                                                        {workflow.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <span className="font-medium">{workflow.approvalLevels}</span>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="text-sm">
                                                                        <p>Min: {formatCurrency(workflow.minAmount)}</p>
                                                                        <p>Max: {formatCurrency(workflow.maxAmount)}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Button variant="ghost" size="sm">
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Settings className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Policies Tab */}
                            {activeTab === 'policies' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>Workflow Policies</CardTitle>
                                                <Button variant="outline">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    New Policy
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Policy Name</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Workflow</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {policies.map((policy) => (
                                                            <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="py-4 px-4">
                                                                    <p className="font-medium text-gray-900">{policy.name}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="text-sm text-gray-600">{policy.description}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <span className="text-sm text-gray-600">Workflow {policy.workflowId}</span>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge variant="secondary" className={getStatusColor(policy.status)}>
                                                                        {policy.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Button variant="ghost" size="sm">
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Automation Rules Tab */}
                            {activeTab === 'automation' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>Automation Rules</CardTitle>
                                                <Button variant="outline">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    New Rule
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Rule Name</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Trigger</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {automationRules.map((rule) => (
                                                            <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="py-4 px-4">
                                                                    <p className="font-medium text-gray-900">{rule.name}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="text-sm text-gray-600">{rule.description}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                        {rule.trigger}
                                                                    </code>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                                                                        {rule.action}
                                                                    </code>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <span className="font-medium">{rule.priority}</span>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge variant="secondary" className={getStatusColor(rule.status)}>
                                                                        {rule.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Button variant="ghost" size="sm">
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm">
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => console.log('Export workflows')}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </Button>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => console.log('Test workflows')}
                                >
                                    Test Workflows
                                </Button>
                                <Button
                                    onClick={() => console.log('Deploy workflows')}
                                    className="flex items-center gap-2"
                                >
                                    <Play className="h-4 w-4" />
                                    Deploy All
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
