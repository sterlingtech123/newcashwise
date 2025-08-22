'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import {
    PieChart,
    Calculator,
    TrendingUp,
    FileText,
    BarChart3,
    Calendar,
    Building2,
    Search,
    Filter,
    Plus,
    Download,
    Eye,
    Edit,
    Trash2,
    DollarSign,
    Users,
    Target,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingDown,
    Activity,
    RefreshCw,
    Upload
} from 'lucide-react';
import { BudgetReportsModal } from '@/components/budgets/budget-reports-modal';
import { CreateBudgetModal } from '@/components/budgets/create-budget-modal';
import { ImportBudgetModal } from '@/components/budgets/import-budget-modal';
import {
    EditBudgetModal,
    BudgetReportsModal as BudgetReportsModalComponent,
    BudgetDetailsModal,
    DeleteBudgetModal
} from '@/components/budgets/budget-action-modals';

export default function BudgetsPage() {
    const [showReportsModal, setShowReportsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isExporting, setIsExporting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<any>(null);

    // Budget overview statistics
    const budgetStats = {
        totalBudget: '₦12.6B',
        totalUtilized: '₦9.8B',
        totalAvailable: '₦2.8B',
        utilizationRate: '78%',
        activeCycles: 3,
        pendingApprovals: 12,
        overdueItems: 5
    };

    // Recent budget activities
    const recentActivities = [
        {
            id: 1,
            type: 'budget_created',
            title: 'New Economic Head Created',
            description: 'Healthcare Equipment budget line added to Q1 2025',
            amount: '₦150M',
            status: 'completed',
            timestamp: '2 hours ago',
            user: 'Dr. Sarah Johnson'
        },
        {
            id: 2,
            type: 'budget_approved',
            title: 'Capital Project Approved',
            description: 'School Construction Phase 2 budget approved',
            amount: '₦500M',
            status: 'completed',
            timestamp: '1 day ago',
            user: 'Mr. David Wilson'
        },
        {
            id: 3,
            type: 'budget_adjusted',
            title: 'Budget Adjustment',
            description: 'Agricultural Development budget increased by 15%',
            amount: '₦75M',
            status: 'pending',
            timestamp: '2 days ago',
            user: 'Mrs. Maria Garcia'
        },
        {
            id: 4,
            type: 'budget_rejected',
            title: 'Budget Request Rejected',
            description: 'Infrastructure Development budget request rejected',
            amount: '₦200M',
            status: 'rejected',
            timestamp: '3 days ago',
            user: 'Finance Committee'
        }
    ];

    const budgetModules = [
        {
            title: 'Economic Heads',
            description: 'Manage recurrent budget economic heads and line items with hierarchical structure',
            href: '/budgets/economic-heads',
            icon: Calculator,
            color: 'bg-blue-500',
            status: 'active',
            budgetAmount: '₦2.5B',
            utilization: '78%',
            features: [
                'Economic Cycles as parent containers',
                'Economic Heads with MDA and category classification',
                'Economic Line Items with detailed breakdowns',
                'Budget allocation and utilization tracking'
            ]
        },
        {
            title: 'Budget Creation',
            description: 'Create and manage comprehensive budgets across organizations',
            href: '/budgets/create',
            icon: PieChart,
            color: 'bg-green-500',
            status: 'active',
            budgetAmount: '₦1.8B',
            utilization: '65%',
            features: [
                'Multi-dimensional budget creation',
                'Organization and fund allocation',
                'Budget versioning and approval workflow',
                'Real-time budget tracking'
            ]
        },
        {
            title: 'Budget Cycles',
            description: 'Manage fiscal year budget cycles and periods',
            href: '/budget-cycles',
            icon: Calendar,
            color: 'bg-purple-500',
            status: 'active',
            budgetAmount: '₦4.2B',
            utilization: '82%',
            features: [
                'Fiscal year management',
                'Budget period configuration',
                'Cycle status tracking',
                'Historical budget analysis'
            ]
        },
        {
            title: 'Capital Projects',
            description: 'Manage capital expenditure budgets and project allocations',
            href: '/budgets/capital-projects',
            icon: Target,
            color: 'bg-indigo-500',
            status: 'planning',
            budgetAmount: '₦3.1B',
            utilization: '45%',
            features: [
                'Project-based budget allocation',
                'Capital expenditure planning',
                'Project milestone tracking',
                'ROI and performance metrics'
            ]
        },
        {
            title: 'Budget Reports',
            description: 'Generate comprehensive budget reports and analytics',
            href: '/budgets/reports',
            icon: BarChart3,
            color: 'bg-orange-500',
            status: 'active',
            budgetAmount: '₦0.0B',
            utilization: '100%',
            features: [
                'Utilization reports',
                'Variance analysis',
                'Performance metrics',
                'Export capabilities'
            ]
        }
    ];

    // Helper functions
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'planning': return 'secondary';
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'destructive';
            default: return 'default';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'budget_created': return Plus;
            case 'budget_approved': return CheckCircle;
            case 'budget_adjusted': return TrendingUp;
            case 'budget_rejected': return AlertCircle;
            default: return FileText;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'budget_created': return 'text-blue-600';
            case 'budget_approved': return 'text-green-600';
            case 'budget_adjusted': return 'text-orange-600';
            case 'budget_rejected': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    // Filter budget modules based on search and status
    const filteredModules = budgetModules.filter(module => {
        const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Action button handlers
    const handleViewDetails = (budget: any) => {
        setSelectedBudget(budget);
        setShowDetailsModal(true);
    };

    const handleEditBudget = (budget: any) => {
        setSelectedBudget(budget);
        setShowEditModal(true);
    };

    const handleGenerateReports = (budget: any) => {
        setSelectedBudget(budget);
        setShowReportsModal(true);
    };

    const handleDeleteBudget = (budget: any) => {
        setSelectedBudget(budget);
        setShowDeleteModal(true);
    };

    const confirmDeleteBudget = () => {
        // Handle budget deletion
        console.log('Deleting budget:', selectedBudget);
        setShowDeleteModal(false);
        setSelectedBudget(null);
    };

    // Create Budget handler
    const handleCreateBudget = (budgetData: any) => {
        console.log('Creating new budget:', budgetData);
        // Here you would typically send the data to your API
        // For now, we'll just log it and show a success message
        alert('Budget created successfully!');
        // You could also add the new budget to your local state here
    };

    // Export functionality
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate CSV data
            const csvData = generateCSV();
            downloadCSV(csvData, 'budget-management-report.csv');
            
            alert('Export completed successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const generateCSV = () => {
        const headers = [
            'Module',
            'Status',
            'Budget Amount',
            'Utilization',
            'Features'
        ];

        const rows = budgetModules.map(module => [
            module.title,
            module.status,
            module.budgetAmount,
            module.utilization,
            module.features.join('; ')
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    };

    const downloadCSV = (csvContent: string, filename: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (importData: any) => {
        console.log('Import data:', importData);
        
        const { dataType, results, settings } = importData;
        let message = '';
        
        switch (dataType) {
            case 'budget_cycle':
                message = `Successfully imported ${results.summary.cyclesCreated} budget cycles!`;
                break;
            case 'economic_head':
                message = `Successfully imported ${results.summary.headsCreated} economic heads!`;
                break;
            case 'economic_line_item':
                message = `Successfully imported ${results.summary.lineItemsCreated} economic line items!`;
                break;
            case 'budget_allocation':
                message = `Successfully imported ${results.summary.allocationsCreated} budget allocations!`;
                break;
            default:
                message = `Successfully imported ${results.validRows} items!`;
        }
        
        // Here you would typically:
        // 1. Send the data to your backend API
        // 2. Update local state
        // 3. Refresh the page data
        // 4. Show success/error notifications
        
        alert(message);
        
        // Example of what you might do:
        // if (dataType === 'economic_head') {
        //     // Update economic heads list
        //     setEconomicHeads(prev => [...prev, ...importData.file.content]);
        // } else if (dataType === 'budget_cycle') {
        //     // Update budget cycles
        //     setBudgetCycles(prev => [...prev, ...importData.file.content]);
        // }
    };

    // Refresh functionality
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Simulate refresh process
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Here you would typically refetch data from your API
            console.log('Data refreshed successfully');
            alert('Data refreshed successfully!');
        } catch (error) {
            console.error('Refresh failed:', error);
            alert('Refresh failed. Please try again.');
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
                    <p className="text-gray-600 mt-2">Comprehensive budget planning, allocation, and monitoring system</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isExporting ? 'Exporting...' : 'Export Reports'}
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => setShowImportModal(true)}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Budget
                    </Button>
                    <Button variant="outline" onClick={() => setShowReportsModal(true)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Reports
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Budget
                    </Button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search budget modules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <PieChart className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Budget</p>
                                <p className="text-2xl font-bold text-gray-900">{budgetStats.totalBudget}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Utilization Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{budgetStats.utilizationRate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Active Cycles</p>
                                <p className="text-2xl font-bold text-gray-900">{budgetStats.activeCycles}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending Approvals</p>
                                <p className="text-2xl font-bold text-gray-900">{budgetStats.pendingApprovals}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Budget Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredModules.map((module, index) => {
                    const IconComponent = module.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-lg ${module.color}`}>
                                            <IconComponent className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{module.title}</CardTitle>
                                            <p className="text-gray-600 text-sm">{module.description}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(module.status)}>
                                        {module.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Budget Information */}
                                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Budget Amount</p>
                                            <p className="text-lg font-semibold text-gray-900">{module.budgetAmount}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Utilization</p>
                                            <p className="text-lg font-semibold text-gray-900">{module.utilization}</p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Key Features:</p>
                                        <ul className="space-y-1">
                                            {module.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t space-y-2">
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => handleViewDetails(module)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditBudget(module)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                className="flex-1"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleGenerateReports(module)}
                                            >
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                Reports
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteBudget(module)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                            <Button
                                                className="flex-1"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleExport()}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Export
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Recent Activities
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => {
                            const IconComponent = getActivityIcon(activity.type);
                            return (
                                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className={`p-2 rounded-lg bg-white ${getActivityColor(activity.type)}`}>
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                            <Badge variant={getStatusBadgeVariant(activity.status)}>
                                                {activity.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Amount: {activity.amount}</span>
                                            <span>By: {activity.user}</span>
                                            <span>{activity.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/budgets/economic-heads">
                            <Button variant="outline" className="w-full h-20 flex-col">
                                <Calculator className="h-6 w-6 mb-2" />
                                <span>Economic Heads</span>
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="w-full h-20 flex-col"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus className="h-6 w-6 mb-2" />
                            <span>Create Budget</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-20 flex-col"
                            onClick={() => setShowReportsModal(true)}
                        >
                            <BarChart3 className="h-6 w-6 mb-2" />
                            <span>Generate Reports</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modals */}
            {showCreateModal && (
                <CreateBudgetModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateBudget}
                />
            )}

            {showEditModal && (
                <EditBudgetModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    budget={selectedBudget}
                    onSave={handleEditBudget}
                />
            )}

            {showDetailsModal && (
                <BudgetDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    budget={selectedBudget}
                />
            )}

            {showReportsModal && (
                <BudgetReportsModal
                    isOpen={showReportsModal}
                    onClose={() => setShowReportsModal(false)}
                    budget={selectedBudget}
                />
            )}

            {showDeleteModal && (
                <DeleteBudgetModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    budget={selectedBudget}
                    onDelete={confirmDeleteBudget}
                />
            )}

            {showImportModal && (
                <ImportBudgetModal
                    isOpen={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImport}
                />
            )}
        </div>
    );
}
