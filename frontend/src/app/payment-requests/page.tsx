"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Download,
    Send,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    CreditCard,
    Building2,
    User,
    Calendar,
    DollarSign,
    Shield,
    TrendingUp,
    BarChart3,
    Receipt,
    Upload,
    MoreHorizontal,
    RefreshCw,
    ArrowRight,
    Check,
    X,
    MessageSquare,
    History,
    Settings,
    Zap,
    Star,
    StarOff,
    Archive,
    ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { CreatePaymentRequestModal } from '@/components/modals/CreatePaymentRequestModal';
import { ViewPaymentRequestModal } from '@/components/modals/ViewPaymentRequestModal';
import { WorkflowModal } from '@/components/modals/WorkflowModal';
import { DeletePaymentRequestModal } from '@/components/modals/DeletePaymentRequestModal';
import { EditPaymentRequestModal } from '@/components/modals/EditPaymentRequestModal';

// Types
interface PaymentRequest {
    id: string;
    requestNumber: string;
    requestType: string;
    status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'processing' | 'completed';
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
    projectTitle: string;
    description: string;
    justification: string;
    amount: number;
    beneficiaryName: string;
    beneficiaryBank: string;
    beneficiaryAccount: string;
    beneficiaryPhone: string;
    beneficiaryEmail: string;
    dueDate: string;
    expectedCompletionDate: string;
    initiatorName: string;
    currentApproverName: string;
    departmentName: string;
    isEmergency: boolean;
    isBudgeted: boolean;
    budgetLine: string;
    accountCode: string;
    createdAt: string;
    submittedAt: string;
    approvedAt: string;
    rejectedAt: string;
    rejectionReason: string;
    progress: number;
    currentStage: string;
    attachments: string[];
    comments: string[];
    workflowSteps: WorkflowStep[];
}

interface WorkflowStep {
    id: string;
    stepName: string;
    stepOrder: number;
    status: 'pending' | 'in_progress' | 'completed' | 'skipped';
    assignedToName: string;
    completedByName: string;
    completedAt: string;
    comments: string;
}

interface PaymentRequestType {
    id: string;
    name: string;
    category: 'Recurrent' | 'Capital' | 'Un-Budgeted';
    description: string;
    requiresApproval: boolean;
    approvalLevel: string;
    maxAmount: number;
}

interface PaymentRequestStatus {
    id: string;
    name: string;
    description: string;
    color: string;
    isFinal: boolean;
    canEdit: boolean;
}

interface PaymentRequestPriority {
    id: string;
    name: string;
    description: string;
    color: string;
    slaHours: number;
}

export default function PaymentRequestsPage() {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const priorityFilterState = useState('all');
    const priorityFilter = priorityFilterState[0];
    const setPriorityFilter = priorityFilterState[1];
    const [typeFilter, setTypeFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    // Mock data - replace with API calls
    const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([
        {
            id: 'PR-001',
            requestNumber: 'PR-2025-001',
            requestType: 'Budgeted Payment Requests',
            status: 'submitted',
            priority: 'high',
            projectTitle: 'Medical Equipment Procurement',
            description: 'Purchase of medical equipment for State Hospital',
            justification: 'Critical equipment needed for patient care',
            amount: 25000000,
            beneficiaryName: 'Medical Supplies Ltd',
            beneficiaryBank: 'First Bank',
            beneficiaryAccount: '0123456789',
            beneficiaryPhone: '+234 801 234 5678',
            beneficiaryEmail: 'info@medsupplies.com',
            dueDate: '2025-02-15',
            expectedCompletionDate: '2025-03-15',
            initiatorName: 'Dr. Sarah Johnson',
            currentApproverName: 'Finance Director',
            departmentName: 'Ministry of Health',
            isEmergency: false,
            isBudgeted: true,
            budgetLine: 'Capital Equipment - Health',
            accountCode: 'HE-001',
            createdAt: '2025-01-15T09:00:00Z',
            submittedAt: '2025-01-16T14:30:00Z',
            approvedAt: '',
            rejectedAt: '',
            rejectionReason: '',
            progress: 25,
            currentStage: 'Department Review',
            attachments: ['medical_equipment_specs.pdf', 'vendor_quotation.pdf'],
            comments: ['Request submitted for review', 'Documents verified'],
            workflowSteps: [
                {
                    id: 'ws-1',
                    stepName: 'Department Review',
                    stepOrder: 1,
                    status: 'completed',
                    assignedToName: 'Department Head',
                    completedByName: 'Department Head',
                    completedAt: '2025-01-16T15:00:00Z',
                    comments: 'Approved at department level'
                },
                {
                    id: 'ws-2',
                    stepName: 'Finance Review',
                    stepOrder: 2,
                    status: 'in_progress',
                    assignedToName: 'Finance Director',
                    completedByName: '',
                    completedAt: '',
                    comments: 'Under review'
                },
                {
                    id: 'ws-3',
                    stepName: 'Final Approval',
                    stepOrder: 3,
                    status: 'pending',
                    assignedToName: 'Governor',
                    completedByName: '',
                    completedAt: '',
                    comments: 'Pending'
                }
            ]
        },
        {
            id: 'PR-002',
            requestNumber: 'PR-2025-002',
            requestType: 'Project Milestone Payment Request',
            status: 'approved',
            priority: 'normal',
            projectTitle: 'Road Construction Phase 1',
            description: 'Payment for completed road construction milestone',
            justification: 'Phase 1 completed on schedule',
            amount: 75000000,
            beneficiaryName: 'Road Construction Co.',
            beneficiaryBank: 'Zenith Bank',
            beneficiaryAccount: '0987654321',
            beneficiaryPhone: '+234 802 345 6789',
            beneficiaryEmail: 'info@roadconstruction.com',
            dueDate: '2025-01-30',
            expectedCompletionDate: '2025-02-28',
            initiatorName: 'Engr. Michael Brown',
            currentApproverName: 'Project Manager',
            departmentName: 'Ministry of Works',
            isEmergency: false,
            isBudgeted: true,
            budgetLine: 'Infrastructure Development',
            accountCode: 'IW-001',
            createdAt: '2025-01-10T10:00:00Z',
            submittedAt: '2025-01-12T11:00:00Z',
            approvedAt: '2025-01-14T16:00:00Z',
            rejectedAt: '',
            rejectionReason: '',
            progress: 100,
            currentStage: 'Completed',
            attachments: ['milestone_report.pdf', 'inspection_certificate.pdf'],
            comments: ['Milestone verified', 'Payment approved'],
            workflowSteps: [
                {
                    id: 'ws-4',
                    stepName: 'Project Review',
                    stepOrder: 1,
                    status: 'completed',
                    assignedToName: 'Project Manager',
                    completedByName: 'Project Manager',
                    completedAt: '2025-01-13T14:00:00Z',
                    comments: 'Milestone verified'
                },
                {
                    id: 'ws-5',
                    stepName: 'Finance Approval',
                    stepOrder: 2,
                    status: 'completed',
                    assignedToName: 'Finance Director',
                    completedByName: 'Finance Director',
                    completedAt: '2025-01-14T16:00:00Z',
                    comments: 'Payment approved'
                }
            ]
        }
    ]);

    const [requestTypes] = useState<PaymentRequestType[]>([
        { id: '1', name: 'Budgeted Payment Requests', category: 'Recurrent', description: 'Regular budgeted overhead expenditures', requiresApproval: true, approvalLevel: 'Department Head', maxAmount: 10000000 },
        { id: '2', name: 'Project Milestone Payment Request', category: 'Recurrent', description: 'Payments for completed project milestones', requiresApproval: true, approvalLevel: 'Project Manager', maxAmount: 50000000 },
        { id: '3', name: 'Capital Expenditure - Governors Limit', category: 'Capital', description: 'Capital expenditure within governors approval limit', requiresApproval: true, approvalLevel: 'Governor', maxAmount: 100000000 },
        { id: '4', name: 'Capital Expenditure - EXCO Approval', category: 'Capital', description: 'Capital expenditure requiring EXCO approval', requiresApproval: true, approvalLevel: 'EXCO', maxAmount: 500000000 },
        { id: '5', name: 'Un-Budgeted Payment Requests', category: 'Un-Budgeted', description: 'Emergency or exceptional unbudgeted payments', requiresApproval: true, approvalLevel: 'Finance Director', maxAmount: 25000000 }
    ]);

    const [statuses] = useState<PaymentRequestStatus[]>([
        { id: '1', name: 'Draft', description: 'Request is being prepared', color: 'gray', isFinal: false, canEdit: true },
        { id: '2', name: 'Submitted', description: 'Request submitted for approval', color: 'blue', isFinal: false, canEdit: false },
        { id: '3', name: 'Under Review', description: 'Request is being reviewed', color: 'yellow', isFinal: false, canEdit: false },
        { id: '4', name: 'Approved', description: 'Request has been approved', color: 'green', isFinal: true, canEdit: false },
        { id: '5', name: 'Rejected', description: 'Request has been rejected', color: 'red', isFinal: true, canEdit: false },
        { id: '6', name: 'Processing', description: 'Payment is being processed', color: 'purple', isFinal: false, canEdit: false },
        { id: '7', name: 'Completed', description: 'Payment has been completed', color: 'green', isFinal: true, canEdit: false }
    ]);

    const [priorities] = useState<PaymentRequestPriority[]>([
        { id: '1', name: 'Low', description: 'Low priority requests', color: 'gray', slaHours: 168 },
        { id: '2', name: 'Normal', description: 'Standard priority requests', color: 'blue', slaHours: 72 },
        { id: '3', name: 'High', description: 'High priority requests', color: 'yellow', slaHours: 48 },
        { id: '4', name: 'Urgent', description: 'Urgent requests', color: 'orange', slaHours: 24 },
        { id: '5', name: 'Emergency', description: 'Emergency requests', color: 'red', slaHours: 4 }
    ]);

    const getStatusColor = (status: string) => {
        const statusObj = statuses.find(s => s.name.toLowerCase().replace(' ', '_') === status);
        return statusObj?.color || 'gray';
    };

    const getPriorityColor = (priority: string) => {
        const priorityObj = priorities.find(p => p.name.toLowerCase() === priority);
        return priorityObj?.color || 'gray';
    };

    const getStatusBadge = (status: string) => {
        const statusObj = statuses.find(s => s.name.toLowerCase().replace(' ', '_') === status);
        const colorMap: { [key: string]: string } = {
            'gray': 'bg-gray-100 text-gray-800 border-gray-200',
            'blue': 'bg-blue-100 text-blue-800 border-blue-200',
            'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'green': 'bg-green-100 text-green-800 border-green-200',
            'red': 'bg-red-100 text-red-800 border-red-200',
            'purple': 'bg-purple-100 text-purple-800 border-purple-200',
            'orange': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return (
            <Badge
                variant="secondary"
                className={colorMap[statusObj?.color || 'gray']}
            >
                {statusObj?.name || status}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityObj = priorities.find(p => p.name.toLowerCase() === priority);
        const colorMap: { [key: string]: string } = {
            'gray': 'bg-gray-100 text-gray-800 border-gray-200',
            'blue': 'bg-blue-100 text-blue-800 border-blue-200',
            'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'green': 'bg-green-100 text-green-800 border-green-200',
            'red': 'bg-red-100 text-red-800 border-red-200',
            'purple': 'bg-purple-100 text-purple-800 border-purple-200',
            'orange': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return (
            <Badge
                variant="secondary"
                className={colorMap[priorityObj?.color || 'gray']}
            >
                {priorityObj?.name || priority}
            </Badge>
        );
    };

    const filteredRequests = paymentRequests.filter(request => {
        const matchesSearch = request.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.initiatorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
        const matchesType = typeFilter === 'all' || request.requestType === typeFilter;
        const matchesDepartment = departmentFilter === 'all' || request.departmentName === typeFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesDepartment;
    });

    const stats = {
        total: paymentRequests.length,
        draft: paymentRequests.filter(r => r.status === 'draft').length,
        submitted: paymentRequests.filter(r => r.status === 'submitted').length,
        underReview: paymentRequests.filter(r => r.status === 'under_review').length,
        approved: paymentRequests.filter(r => r.status === 'approved').length,
        rejected: paymentRequests.filter(r => r.status === 'rejected').length,
        processing: paymentRequests.filter(r => r.status === 'processing').length,
        completed: paymentRequests.filter(r => r.status === 'completed').length
    };

    const handleCreateRequest = () => {
        setShowCreateModal(true);
    };

    const handleRefresh = () => {
        // Simulate refreshing data from server
        // In a real app, this would make an API call
        console.log('Refreshing payment requests data...');
        // You can add loading state here if needed
    };

    const handleExport = () => {
        // Export payment requests data to CSV/Excel
        const csvContent = generateCSV(paymentRequests);
        downloadCSV(csvContent, 'payment-requests.csv');
    };

    const generateCSV = (data: PaymentRequest[]) => {
        const headers = [
            'Request Number',
            'Project Title',
            'Status',
            'Priority',
            'Amount',
            'Beneficiary',
            'Department',
            'Created Date',
            'Expected Date'
        ];
        
        const rows = data.map(request => [
            request.requestNumber,
            request.projectTitle,
            request.status,
            request.priority,
            request.amount,
            request.beneficiaryName,
            request.departmentName,
            new Date(request.createdAt).toLocaleDateString(),
            request.expectedCompletionDate
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCreateSubmit = (data: any) => {
        // Add the new request to the list
        const newRequest: PaymentRequest = {
            ...data,
            id: data.id,
            requestNumber: data.requestNumber,
            status: data.status,
            progress: data.progress,
            currentStage: data.currentStage,
            initiatorName: user?.name || 'Unknown User',
            currentApproverName: '',
            createdAt: data.createdAt,
            submittedAt: '',
            approvedAt: '',
            rejectedAt: '',
            rejectionReason: '',
            attachments: data.attachments.map((file: File) => file.name),
            comments: data.comments ? [data.comments] : [],
            workflowSteps: [
                {
                    id: 'ws-1',
                    stepName: 'Department Review',
                    stepOrder: 1,
                    status: 'pending',
                    assignedToName: 'Department Head',
                    completedByName: '',
                    completedAt: '',
                    comments: ''
                }
            ]
        };
        
        setPaymentRequests(prev => [newRequest, ...prev]);
        setShowCreateModal(false);
    };

    const handleViewRequest = (request: PaymentRequest) => {
        setSelectedRequest(request);
        setShowViewModal(true);
    };

    const handleEditRequest = (request: PaymentRequest) => {
        setSelectedRequest(request);
        setShowEditModal(true);
    };

    const handleEditSubmit = (updatedData: any) => {
        // Update the payment request in the list
        setPaymentRequests(prev => prev.map(request =>
            request.id === updatedData.id ? { ...request, ...updatedData } : request
        ));
        setShowEditModal(false);
        setSelectedRequest(null);
        console.log('Payment request updated:', updatedData);
    };

    const handleWorkflowRequest = (request: PaymentRequest) => {
        setSelectedRequest(request);
        setShowWorkflowModal(true);
    };

    const handleDeleteRequest = (request: PaymentRequest) => {
        setSelectedRequest(request);
        setShowDeleteModal(true);
    };

    const handleDeleteSubmit = async (requestId: string, reason: string, comments: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Remove the request from the list
            setPaymentRequests(prev => prev.filter(request => request.id !== requestId));
            setShowDeleteModal(false);
            setSelectedRequest(null);
            
            console.log('Payment request deleted:', { requestId, reason, comments });
        } catch (error) {
            console.error('Failed to delete payment request:', error);
        }
    };

    const handleSubmitRequest = (requestId: string) => {
        setPaymentRequests(prev => prev.map(request =>
            request.id === requestId
                ? { ...request, status: 'submitted', progress: 25, currentStage: 'Department Review' }
                : request
        ));
    };

    const handleApproveRequest = (requestId: string) => {
        setPaymentRequests(prev => prev.map(request =>
            request.id === requestId
                ? { ...request, status: 'approved', progress: 100, currentStage: 'Completed' }
                : request
        ));
    };

    const handleRejectRequest = (requestId: string) => {
        setPaymentRequests(prev => prev.map(request =>
            request.id === requestId
                ? { ...request, status: 'rejected', progress: 100, currentStage: 'Rejected' }
                : request
        ));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payment Requests</h1>
                    <p className="text-gray-600 mt-2">Manage and track payment requests across all departments</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Button onClick={handleCreateRequest} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Request
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All payment requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.submitted + stats.underReview}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approved}</div>
                        <p className="text-xs text-muted-foreground">Successfully approved</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completed}</div>
                        <p className="text-xs text-muted-foreground">Payments processed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <Input
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statuses.map(status => (
                                        <SelectItem key={status.id} value={status.name.toLowerCase().replace(' ', '_')}>
                                            {status.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    {priorities.map(priority => (
                                        <SelectItem key={priority.id} value={priority.name.toLowerCase()}>
                                            {priority.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {requestTypes.map(type => (
                                        <SelectItem key={type.id} value={type.name}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Department</label>
                            <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem value="Ministry of Health">Ministry of Health</SelectItem>
                                    <SelectItem value="Ministry of Works">Ministry of Works</SelectItem>
                                    <SelectItem value="Ministry of Finance">Ministry of Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="w-full">
                <div className="grid w-full grid-cols-8 gap-1 mb-6">
                    <Button
                        variant={activeTab === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('all')}
                        className="text-xs"
                    >
                        All ({stats.total})
                    </Button>
                    <Button
                        variant={activeTab === 'draft' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('draft')}
                        className="text-xs"
                    >
                        Draft ({stats.draft})
                    </Button>
                    <Button
                        variant={activeTab === 'submitted' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('submitted')}
                        className="text-xs"
                    >
                        Submitted ({stats.submitted})
                    </Button>
                    <Button
                        variant={activeTab === 'under_review' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('under_review')}
                        className="text-xs"
                    >
                        Review ({stats.underReview})
                    </Button>
                    <Button
                        variant={activeTab === 'approved' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('approved')}
                        className="text-xs"
                    >
                        Approved ({stats.approved})
                    </Button>
                    <Button
                        variant={activeTab === 'rejected' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('rejected')}
                        className="text-xs"
                    >
                        Rejected ({stats.rejected})
                    </Button>
                    <Button
                        variant={activeTab === 'processing' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('processing')}
                        className="text-xs"
                    >
                        Processing ({stats.processing})
                    </Button>
                    <Button
                        variant={activeTab === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('completed')}
                        className="text-xs"
                    >
                        Completed ({stats.completed})
                    </Button>
                </div>

                <div className="mt-6">
                    {/* Payment Requests List */}
                    <div className="space-y-4">
                        {filteredRequests.map(request => (
                            <Card key={request.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {request.projectTitle}
                                                        </h3>
                                                        {request.isEmergency && (
                                                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                                                                Emergency
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="font-medium">{request.requestNumber}</span>
                                                        <span>•</span>
                                                        <span>{request.departmentName}</span>
                                                        <span>•</span>
                                                        <span>{request.initiatorName}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                                        {formatCurrency(request.amount)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(request.status)}
                                                        {getPriorityBadge(request.priority)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">Beneficiary:</span>
                                                    <div className="text-gray-600">{request.beneficiaryName}</div>
                                                    <div className="text-gray-500">{request.beneficiaryBank}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Due Date:</span>
                                                    <div className="text-gray-600">{formatDate(request.dueDate)}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Current Stage:</span>
                                                    <div className="text-gray-600">{request.currentStage}</div>
                                                    <Progress value={request.progress} className="mt-2" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Created: {formatDate(request.createdAt)}</span>
                                                    {request.submittedAt && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Submitted: {formatDate(request.submittedAt)}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewRequest(request)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                    {request.status === 'draft' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditRequest(request)}
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleWorkflowRequest(request)}
                                                    >
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Workflow
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteRequest(request)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Payment Request Modal */}
            <CreatePaymentRequestModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateSubmit}
            />

            {/* View Payment Request Modal */}
            <ViewPaymentRequestModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                request={selectedRequest}
            />

            {/* Edit Payment Request Modal */}
            <EditPaymentRequestModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditSubmit}
                paymentRequest={selectedRequest}
            />

            {/* Workflow Modal */}
            <WorkflowModal
                isOpen={showWorkflowModal}
                onClose={() => setShowWorkflowModal(false)}
                request={selectedRequest}
            />

            {/* Delete Payment Request Modal */}
            <DeletePaymentRequestModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDeleteSubmit}
                request={selectedRequest}
            />
        </div>
    );
}
