'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    Download,
    Eye,
    Edit,
    Send,
    History,
    Filter,
    Search,
    Calendar,
    DollarSign,
    Building2,
    User,
    ArrowRight,
    Check,
    X,
    Clock3,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';

interface BudgetSubmission {
    id: string;
    title: string;
    department: string;
    submittedBy: string;
    submittedAt: string;
    amount: number;
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_changes';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    description: string;
    attachments: string[];
    reviewNotes: string[];
    currentStage: string;
    progress: number;
}

export default function BudgetVerificationPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState<BudgetSubmission | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Mock data
    const [budgetSubmissions, setBudgetSubmissions] = useState<BudgetSubmission[]>([
        {
            id: 'BS-001',
            title: 'Healthcare Infrastructure Development',
            department: 'Ministry of Health',
            submittedBy: 'Dr. Sarah Johnson',
            submittedAt: '2025-01-17T10:30:00Z',
            amount: 2500000000,
            status: 'under_review',
            priority: 'high',
            category: 'Infrastructure',
            description: 'Development of healthcare facilities and medical equipment procurement',
            attachments: ['budget_proposal.pdf', 'technical_specs.pdf', 'cost_breakdown.xlsx'],
            reviewNotes: [
                'Initial review completed - requires additional documentation',
                'Cost estimates need validation from engineering team'
            ],
            currentStage: 'Technical Review',
            progress: 65
        },
        {
            id: 'BS-002',
            title: 'Education Technology Enhancement',
            department: 'Ministry of Education',
            submittedBy: 'Prof. Michael Chen',
            submittedAt: '2025-01-16T14:20:00Z',
            amount: 800000000,
            status: 'pending',
            priority: 'medium',
            category: 'Technology',
            description: 'Digital learning platforms and computer lab upgrades',
            attachments: ['edtech_proposal.pdf', 'vendor_quotes.pdf'],
            reviewNotes: [],
            currentStage: 'Initial Review',
            progress: 25
        },
        {
            id: 'BS-003',
            title: 'Road Network Expansion',
            department: 'Ministry of Transportation',
            submittedBy: 'Eng. David Wilson',
            submittedAt: '2025-01-15T09:15:00Z',
            amount: 3500000000,
            status: 'approved',
            priority: 'high',
            category: 'Infrastructure',
            description: 'Construction of new highways and road maintenance',
            attachments: ['road_plan.pdf', 'environmental_assessment.pdf', 'contractor_bids.pdf'],
            reviewNotes: [
                'All requirements met - approved for next stage',
                'Environmental impact assessment satisfactory'
            ],
            currentStage: 'Governor Approval',
            progress: 90
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
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
            case 'pending': return Clock;
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

    const filteredSubmissions = budgetSubmissions.filter(submission => {
        const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
        const matchesDepartment = departmentFilter === 'all' || submission.department === departmentFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });

    const handleReview = (submission: BudgetSubmission) => {
        setSelectedSubmission(submission);
        setShowReviewModal(true);
    };

    const handleViewDetails = (submission: BudgetSubmission) => {
        setSelectedSubmission(submission);
        setShowDetailsModal(true);
    };

    const handleApprove = (submissionId: string) => {
        setBudgetSubmissions(prev => prev.map(sub =>
            sub.id === submissionId
                ? { ...sub, status: 'approved', progress: 90, currentStage: 'Governor Approval' }
                : sub
        ));
    };

    const handleReject = (submissionId: string) => {
        setBudgetSubmissions(prev => prev.map(sub =>
            sub.id === submissionId
                ? { ...sub, status: 'rejected', progress: 100, currentStage: 'Rejected' }
                : sub
        ));
    };

    const handleRequestChanges = (submissionId: string) => {
        setBudgetSubmissions(prev => prev.map(sub =>
            sub.id === submissionId
                ? { ...sub, status: 'requires_changes', progress: 40, currentStage: 'Changes Requested' }
                : sub
        ));
    };

    const stats = {
        total: budgetSubmissions.length,
        pending: budgetSubmissions.filter(s => s.status === 'pending').length,
        underReview: budgetSubmissions.filter(s => s.status === 'under_review').length,
        approved: budgetSubmissions.filter(s => s.status === 'approved').length,
        rejected: budgetSubmissions.filter(s => s.status === 'rejected').length,
        requiresChanges: budgetSubmissions.filter(s => s.status === 'requires_changes').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Budget Verification</h1>
                    <p className="text-gray-600 mt-2">Review and verify budget submissions before approval</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        New Verification
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
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
                                    placeholder="Search submissions..."
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
                                <SelectItem value="pending">Pending</SelectItem>
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

            {/* Budget Submissions */}
            <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                    const StatusIcon = getStatusIcon(submission.status);

                    return (
                        <Card key={submission.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Shield className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{submission.title}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-4 w-4" />
                                                        {submission.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        {submission.submittedBy}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(submission.submittedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4">{submission.description}</p>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-gray-500" />
                                                <span className="font-semibold text-gray-900">{formatCurrency(submission.amount)}</span>
                                            </div>
                                            <Badge className={getPriorityColor(submission.priority)}>
                                                {submission.priority.toUpperCase()}
                                            </Badge>
                                            <Badge className={getStatusColor(submission.status)}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {submission.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                <span>Progress: {submission.currentStage}</span>
                                                <span>{submission.progress}%</span>
                                            </div>
                                            <Progress value={submission.progress} className="h-2" />
                                        </div>

                                        {/* Attachments */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-sm text-gray-600">Attachments:</span>
                                            {submission.attachments.map((attachment, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {attachment}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Review Notes */}
                                        {submission.reviewNotes.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Review Notes:</h4>
                                                <div className="space-y-2">
                                                    {submission.reviewNotes.map((note, index) => (
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
                                            onClick={() => handleViewDetails(submission)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>

                                        {submission.status === 'pending' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleReview(submission)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Start Review
                                            </Button>
                                        )}

                                        {submission.status === 'under_review' && (
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(submission.id)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRequestChanges(submission.id)}
                                                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Request Changes
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleReject(submission.id)}
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}

                                        {submission.status === 'requires_changes' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleReview(submission)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Review Changes
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredSubmissions.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No budget submissions found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || departmentFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'No budget submissions are currently pending verification'
                            }
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
