'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    PieChart,
    Plus,
    Search,
    TrendingUp,
    TrendingDown,
    Target,
    Calendar,
    Building2,
    DollarSign,
    Upload,
    Download,
    Eye,
    Edit,
    Trash2,
    ChevronRight,
    ChevronDown,
    Settings,
    FileText,
    Calculator,
    BarChart3
} from 'lucide-react';

export default function BudgetSetupPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('fiscal-years');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedBudgets, setExpandedBudgets] = useState<Set<string>>(new Set());

    // Mock data for Fiscal Years
    const fiscalYears = [
        {
            id: '1',
            year: 2025,
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            isActive: true,
            totalBudget: 2500000000,
            totalAllocated: 2000000000,
            totalSpent: 1500000000,
            status: 'active'
        },
        {
            id: '2',
            year: 2024,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            isActive: false,
            totalBudget: 2000000000,
            totalAllocated: 1800000000,
            totalSpent: 1750000000,
            status: 'closed'
        }
    ];

    // Mock data for Budget Versions
    const budgetVersions = [
        {
            id: '1',
            fiscalYearId: '1',
            versionNumber: 1,
            name: 'Initial Budget 2025',
            description: 'Initial budget allocation for fiscal year 2025',
            status: 'approved',
            budgetType: 'recurrent',
            totalAmount: 1500000000,
            approvedAt: '2025-01-15',
            approvedBy: 'Jane Smith',
            budgetLines: [
                {
                    id: '1.1',
                    lineNumber: 'BL-001',
                    organization: 'Health Department',
                    fund: 'General Fund',
                    function: 'Healthcare Services',
                    economicHead: 'Personnel',
                    program: 'Primary Healthcare',
                    project: null,
                    description: 'Medical staff salaries and benefits',
                    approvedAmount: 500000000,
                    allocatedAmount: 450000000,
                    spentAmount: 300000000,
                    remainingAmount: 200000000
                }
            ]
        }
    ];

    // Mock data for Allotments
    const allotments = [
        {
            id: '1',
            budgetLineId: '1.1',
            amount: 100000000,
            allotmentDate: '2025-01-15',
            referenceNumber: 'ALT-2025-001',
            description: 'Q1 2025 allotment for health personnel',
            status: 'active',
            createdBy: 'John Doe'
        }
    ];

    // Mock data for Commitments
    const commitments = [
        {
            id: '1',
            budgetLineId: '1.1',
            amount: 50000000,
            commitmentDate: '2025-01-20',
            referenceNumber: 'COM-2025-001',
            description: 'Medical supplies procurement contract',
            vendorName: 'Medical Supplies Ltd',
            status: 'active',
            createdBy: 'John Doe'
        }
    ];

    const toggleBudgetExpansion = (budgetId: string) => {
        const newExpanded = new Set(expandedBudgets);
        if (newExpanded.has(budgetId)) {
            newExpanded.delete(budgetId);
        } else {
            newExpanded.add(budgetId);
        }
        setExpandedBudgets(newExpanded);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'closed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'recurrent': return 'bg-blue-100 text-blue-800';
            case 'capital': return 'bg-purple-100 text-purple-800';
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

    const renderBudgetVersions = () => {
        return budgetVersions.map((version) => (
            <div key={version.id} className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-gray-50 border-gray-200">
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            onClick={() => toggleBudgetExpansion(version.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            {expandedBudgets.has(version.id) ?
                                <ChevronDown className="h-4 w-4" /> :
                                <ChevronRight className="h-4 w-4" />
                            }
                        </button>
                        <div>
                            <h3 className="font-semibold text-lg">{version.name}</h3>
                            <p className="text-sm text-gray-600">{version.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className={getTypeColor(version.budgetType)}>
                            {version.budgetType}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(version.status)}>
                            {version.status}
                        </Badge>
                        <span className="font-mono text-lg font-bold">
                            {formatCurrency(version.totalAmount)}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {expandedBudgets.has(version.id) && (
                    <div className="ml-8 space-y-3">
                        <h4 className="font-medium text-gray-700">Budget Lines</h4>
                        {version.budgetLines.map((line) => (
                            <div key={line.id} className="p-3 rounded-lg border bg-white border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{line.lineNumber} - {line.description}</p>
                                        <p className="text-sm text-gray-600">
                                            {line.organization} • {line.fund} • {line.function}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Approved</p>
                                            <p className="font-mono font-medium">{formatCurrency(line.approvedAmount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Allocated</p>
                                            <p className="font-mono font-medium">{formatCurrency(line.allocatedAmount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Spent</p>
                                            <p className="font-mono font-medium">{formatCurrency(line.spentAmount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Remaining</p>
                                            <p className="font-mono font-medium text-green-600">{formatCurrency(line.remainingAmount)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div>
                <main className="py-8">
                    <div className="mx-auto max-w-7xl pr-4 sm:pr-6 lg:pr-8 pl-0">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <PieChart className="h-8 w-8 text-purple-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Budget Setup Management
                                    </h1>
                                    <p className="text-gray-600">
                                        Configure fiscal years, budget versions, and budget structure
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active Fiscal Year</p>
                                            <p className="text-2xl font-bold text-blue-600">2025</p>
                                        </div>
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Calendar className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Budget</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {formatCurrency(2500000000)}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Allocated</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {formatCurrency(2000000000)}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Target className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Utilization</p>
                                            <p className="text-2xl font-bold text-orange-600">75%</p>
                                        </div>
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <BarChart3 className="h-6 w-6 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Navigation Tabs */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className="flex space-x-8 border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('fiscal-years')}
                                        className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'fiscal-years'
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Calendar className="h-4 w-4 inline mr-2" />
                                        Fiscal Years
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('budget-versions')}
                                        className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'budget-versions'
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <FileText className="h-4 w-4 inline mr-2" />
                                        Budget Versions
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('allotments')}
                                        className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'allotments'
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <TrendingUp className="h-4 w-4 inline mr-2" />
                                        Allotments
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('commitments')}
                                        className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'commitments'
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Calculator className="h-4 w-4 inline mr-2" />
                                        Commitments
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tab Content */}
                        {activeTab === 'fiscal-years' && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Fiscal Years</CardTitle>
                                        <div className="flex items-center gap-4">
                                            <Button variant="outline">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Import
                                            </Button>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Fiscal Year
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Year</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Period</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Budget</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Allocated</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Spent</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fiscalYears.map((year) => (
                                                    <tr key={year.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-4 px-4">
                                                            <span className="text-lg font-bold">{year.year}</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="text-sm text-gray-600">
                                                                {year.startDate} - {year.endDate}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <Badge variant="secondary" className={getStatusColor(year.status)}>
                                                                {year.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-4 font-mono">
                                                            {formatCurrency(year.totalBudget)}
                                                        </td>
                                                        <td className="py-4 px-4 font-mono">
                                                            {formatCurrency(year.totalAllocated)}
                                                        </td>
                                                        <td className="py-4 px-4 font-mono">
                                                            {formatCurrency(year.totalSpent)}
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
                        )}

                        {activeTab === 'budget-versions' && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Budget Versions</CardTitle>
                                        <div className="flex items-center gap-4">
                                            <Button variant="outline">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Import
                                            </Button>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Budget Version
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {renderBudgetVersions()}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'allotments' && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Budget Allotments</CardTitle>
                                        <div className="flex items-center gap-4">
                                            <Button variant="outline">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Import
                                            </Button>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Allotment
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Reference</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created By</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allotments.map((allotment) => (
                                                    <tr key={allotment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-4 px-4 font-mono">{allotment.referenceNumber}</td>
                                                        <td className="py-4 px-4">{allotment.allotmentDate}</td>
                                                        <td className="py-4 px-4">{allotment.description}</td>
                                                        <td className="py-4 px-4 font-mono font-medium">
                                                            {formatCurrency(allotment.amount)}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <Badge variant="secondary" className={getStatusColor(allotment.status)}>
                                                                {allotment.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-4">{allotment.createdBy}</td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="sm">
                                                                    <Edit className="h-4 w-4" />
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
                        )}

                        {activeTab === 'commitments' && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Budget Commitments</CardTitle>
                                        <div className="flex items-center gap-4">
                                            <Button variant="outline">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Import
                                            </Button>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Commitment
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Reference</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vendor</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commitments.map((commitment) => (
                                                    <tr key={commitment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-4 px-4 font-mono">{commitment.referenceNumber}</td>
                                                        <td className="py-4 px-4">{commitment.commitmentDate}</td>
                                                        <td className="py-4 px-4">{commitment.description}</td>
                                                        <td className="py-4 px-4">{commitment.vendorName}</td>
                                                        <td className="py-4 px-4 font-mono font-medium">
                                                            {formatCurrency(commitment.amount)}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <Badge variant="secondary" className={getStatusColor(commitment.status)}>
                                                                {commitment.status}
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
