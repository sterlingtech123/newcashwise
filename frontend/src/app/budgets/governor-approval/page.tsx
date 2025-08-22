'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
    Crown,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    Download,
    Eye,
    Edit,
    Send,
    Filter,
    Search,
    Calendar,
    DollarSign,
    Building2,
    User,
    Check,
    X,
    Clock3,
    TrendingUp,
    TrendingDown,
    Shield,
    Gavel,
    Award,
    FileCheck,
} from 'lucide-react';

interface BudgetApproval {
    id: string;
    title: string;
    department: string;
    submittedBy: string;
    submittedAt: string;
    verifiedBy: string;
    verifiedAt: string;
    amount: number;
    status: 'pending_approval' | 'approved' | 'rejected' | 'under_review' | 'requires_changes';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    description: string;
    attachments: string[];
    verificationNotes: string[];
    currentStage: string;
    progress: number;
    fiscalYear: string;
    budgetType: string;
}

export default function GovernorApprovalPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedApproval, setSelectedApproval] = useState<BudgetApproval | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Mock data
    const [budgetApprovals, setBudgetApprovals] = useState<BudgetApproval[]>([
        {
            id: 'BA-001',
            title: 'Healthcare Infrastructure Development',
            department: 'Ministry of Health',
            submittedBy: 'Dr. Sarah Johnson',
            submittedAt: '2025-01-17T10:30:00Z',
            verifiedBy: 'Finance Director',
            verifiedAt: '2025-01-18T14:20:00Z',
            amount: 2500000000,
            status: 'pending_approval',
            priority: 'high',
            category: 'Infrastructure',
            description: 'Development of healthcare facilities and medical equipment procurement',
            attachments: ['budget_proposal.pdf', 'technical_specs.pdf', 'cost_breakdown.xlsx', 'verification_report.pdf'],
            verificationNotes: [
                'Budget verification completed - all requirements met',
                'Cost estimates validated by engineering team',
                'Environmental impact assessment satisfactory'
            ],
            currentStage: 'Governor Approval',
            progress: 85,
            fiscalYear: '2025',
            budgetType: 'Capital'
        },
        {
            id: 'BA-002',
            title: 'Education Technology Enhancement',
            department: 'Ministry of Education',
            submittedBy: 'Prof. Michael Chen',
            submittedAt: '2025-01-16T14:20:00Z',
            verifiedBy: 'Finance Director',
            verifiedAt: '2025-01-17T11:15:00Z',
            amount: 800000000,
            status: 'under_review',
            priority: 'medium',
            category: 'Technology',
            description: 'Digital learning platforms and computer lab upgrades',
            attachments: ['edtech_proposal.pdf', 'vendor_quotes.pdf', 'verification_report.pdf'],
            verificationNotes: [
                'Initial verification completed',
                'Additional vendor documentation required'
            ],
            currentStage: 'Documentation Review',
            progress: 70,
            fiscalYear: '2025',
            budgetType: 'Recurrent'
        },
        {
            id: 'BA-003',
            title: 'Road Network Expansion',
            department: 'Ministry of Transportation',
            submittedBy: 'Eng. David Wilson',
            submittedAt: '2025-01-15T09:15:00Z',
            verifiedBy: 'Finance Director',
            verifiedAt: '2025-01-16T16:30:00Z',
            amount: 3500000000,
            status: 'approved',
            priority: 'high',
            category: 'Infrastructure',
            description: 'Construction of new highways and road maintenance',
            attachments: ['road_plan.pdf', 'environmental_assessment.pdf', 'contractor_bids.pdf', 'verification_report.pdf'],
            verificationNotes: [
                'All requirements met - approved for execution',
                'Environmental impact assessment satisfactory',
                'Contractor selection process validated'
            ],
            currentStage: 'Execution Phase',
            progress: 95,
            fiscalYear: '2025',
            budgetType: 'Capital'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_approval': return 'bg-purple-100 text-purple-800';
            case 'under_review': return 'bg-blue-100 text-blue-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'requires_changes': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending_approval': return Crown;
            case 'under_review': return AlertCircle;
            case 'approved': return CheckCircle;
            case 'rejected': return XCircle;
            case 'requires_changes': return Edit;
            default: return Clock;
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredApprovals = budgetApprovals.filter(approval => {
        const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || approval.priority === priorityFilter;
        const matchesDepartment = departmentFilter === 'all' || approval.department === departmentFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });

    const handleReview = (approval: BudgetApproval) => {
        setSelectedApproval(approval);
        setShowReviewModal(true);
    };

    const handleViewDetails = (approval: BudgetApproval) => {
        setSelectedApproval(approval);
        setShowDetailsModal(true);
    };

    const handleApprove = (approvalId: string) => {
        setBudgetApprovals(prev => prev.map(approval =>
            approval.id === approvalId
                ? { ...approval, status: 'approved', progress: 100, currentStage: 'Execution Phase' }
                : approval
        ));
    };

    const handleReject = (approvalId: string) => {
        setBudgetApprovals(prev => prev.map(approval =>
            approval.id === approvalId
                ? { ...approval, status: 'rejected', progress: 100, currentStage: 'Rejected' }
                : approval
        ));
    };

    const handleRequestChanges = (approvalId: string) => {
        setBudgetApprovals(prev => prev.map(approval =>
            approval.id === approvalId
                ? { ...approval, status: 'requires_changes', progress: 60, currentStage: 'Changes Requested' }
                : approval
        ));
    };

    const stats = {
        total: budgetApprovals.length,
        pendingApproval: budgetApprovals.filter(a => a.status === 'pending_approval').length,
        underReview: budgetApprovals.filter(a => a.status === 'under_review').length,
        approved: budgetApprovals.filter(a => a.status === 'approved').length,
        rejected: budgetApprovals.filter(a => a.status === 'rejected').length,
        requiresChanges: budgetApprovals.filter(a => a.status === 'requires_changes').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Governor's Approval</h1>
                    <p className="text-gray-600 mt-2">Final approval for verified budget submissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button>
                        <FileCheck className="h-4 w-4 mr-2" />
                        New Approval
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-6 w-6 text-blue-600" />
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
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Crown className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending Approval</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingApproval}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Under Review</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Edit className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Changes Required</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.requiresChanges}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Rejected</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
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
                                    placeholder="Search approvals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                                <SelectItem value="under_review">Under Review</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="requires_changes">Changes Required</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                <SelectItem value="Ministry of Health">Ministry of Health</SelectItem>
                                <SelectItem value="Ministry of Education">Ministry of Education</SelectItem>
                                <SelectItem value="Ministry of Transportation">Ministry of Transportation</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            More Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Budget Approvals */}
            <div className="space-y-4">
                {filteredApprovals.map((approval) => {
                    const StatusIcon = getStatusIcon(approval.status);

                    return (
                        <Card key={approval.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Crown className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-4 w-4" />
                                                        {approval.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        {approval.submittedBy}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(approval.submittedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4">{approval.description}</p>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-gray-500" />
                                                <span className="font-semibold text-gray-900">{formatCurrency(approval.amount)}</span>
                                            </div>
                                            <Badge className={getPriorityColor(approval.priority)}>
                                                {approval.priority.toUpperCase()}
                                            </Badge>
                                            <Badge className={getStatusColor(approval.status)}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {approval.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                            <Badge variant="outline">
                                                {approval.budgetType}
                                            </Badge>
                                            <Badge variant="outline">
                                                FY {approval.fiscalYear}
                                            </Badge>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                <span>Progress: {approval.currentStage}</span>
                                                <span>{approval.progress}%</span>
                                            </div>
                                            <Progress value={approval.progress} className="h-2" />
                                        </div>

                                        {/* Verification Info */}
                                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm text-green-800 mb-2">
                                                <Shield className="h-4 w-4" />
                                                <span className="font-medium">Verified by {approval.verifiedBy}</span>
                                                <span>•</span>
                                                <span>{formatDate(approval.verifiedAt)}</span>
                                            </div>
                                            <div className="text-sm text-green-700">
                                                Budget verification completed and approved for governor review
                                            </div>
                                        </div>

                                        {/* Attachments */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-sm text-gray-600">Attachments:</span>
                                            {approval.attachments.map((attachment, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {attachment}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Verification Notes */}
                                        {approval.verificationNotes.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Notes:</h4>
                                                <div className="space-y-2">
                                                    {approval.verificationNotes.map((note, index) => (
                                                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                            {note}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(approval)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>

                                        {approval.status === 'pending_approval' && (
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(approval.id)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRequestChanges(approval.id)}
                                                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Request Changes
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleReject(approval.id)}
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}

                                        {approval.status === 'under_review' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleReview(approval)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Review
                                            </Button>
                                        )}

                                        {approval.status === 'requires_changes' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleReview(approval)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Review Changes
                                            </Button>
                                        )}

                                        {approval.status === 'approved' && (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="h-5 w-5" />
                                                <span className="text-sm font-medium">Approved</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredApprovals.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No budget approvals found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || departmentFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'No budget approvals are currently pending governor review'
                            }
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
