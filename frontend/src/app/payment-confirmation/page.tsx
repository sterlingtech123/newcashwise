'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
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
    Building2,
    User,
    Shield,
    TrendingUp,
    BarChart3,
    Receipt,
    CreditCard,
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
    ExternalLink,
    DollarSign,
    Banknote,
    Wallet,
    Calculator,
    Trash2
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ViewPaymentConfirmationModal } from '@/components/modals/ViewPaymentConfirmationModal';
import { PaymentConfirmationWorkflowModal } from '@/components/modals/PaymentConfirmationWorkflowModal';
import { DeletePaymentConfirmationModal } from '@/components/modals/DeletePaymentConfirmationModal';

// Types
interface PaymentConfirmation {
    id: string;
    confirmationNumber: string;
    paymentRequestId: string;
    paymentRequestNumber: string;
    projectTitle: string;
    amount: number;
    status: 'pending_confirmation' | 'confirmed' | 'rejected' | 'processing' | 'completed';
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
    approverName: string;
    approvalLevel: string;
    approvalDate: string;
    paymentVoucher: string;
    paymentMethod: string;
    bankReference: string;
    transactionId: string;
    approvedAmount: number;
    paymentDate: string;
    notes: string;
    rejectionReason: string;
    createdAt: string;
    updatedAt: string;
    progress: number;
    currentStage: string;
    workflowSteps: ConfirmationWorkflowStep[];
    attachments: string[];
    beneficiaryName: string;
    beneficiaryBank: string;
    beneficiaryAccount: string;
    departmentName: string;
    initiatorName: string;
}

interface ConfirmationWorkflowStep {
    id: string;
    stepName: string;
    stepOrder: number;
    status: 'pending' | 'in_progress' | 'completed' | 'skipped';
    assignedToName: string;
    completedByName: string;
    completedAt: string;
    comments: string;
}

interface ConfirmationStatus {
    id: string;
    name: string;
    description: string;
    color: string;
    isFinal: boolean;
}

export default function PaymentConfirmationPage() {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedConfirmation, setSelectedConfirmation] = useState<PaymentConfirmation | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Mock data - replace with API calls
    const [paymentConfirmations, setPaymentConfirmations] = useState<PaymentConfirmation[]>([
        {
            id: 'PC-001',
            confirmationNumber: 'PC-2025-001',
            paymentRequestId: 'PR-2025-001',
            paymentRequestNumber: 'PR-2025-001',
            projectTitle: 'Medical Equipment Procurement',
            amount: 25000000,
            status: 'pending_confirmation',
            priority: 'high',
            approverName: 'Finance Director',
            approvalLevel: 'Finance Director',
            approvalDate: '',
            paymentVoucher: 'PV-2025-001',
            paymentMethod: 'Bank Transfer',
            bankReference: 'BR-2025-001',
            transactionId: '',
            approvedAmount: 0,
            paymentDate: '',
            notes: 'Awaiting finance confirmation',
            rejectionReason: '',
            createdAt: '2025-01-16T15:00:00Z',
            updatedAt: '2025-01-16T15:00:00Z',
            progress: 50,
            currentStage: 'Finance Confirmation',
            workflowSteps: [
                {
                    id: 'cws-1',
                    stepName: 'Department Review',
                    stepOrder: 1,
                    status: 'completed',
                    assignedToName: 'Department Head',
                    completedByName: 'Department Head',
                    completedAt: '2025-01-16T15:00:00Z',
                    comments: 'Approved at department level'
                },
                {
                    id: 'cws-2',
                    stepName: 'Finance Confirmation',
                    stepOrder: 2,
                    status: 'in_progress',
                    assignedToName: 'Finance Director',
                    completedByName: '',
                    completedAt: '',
                    comments: 'Under review'
                },
                {
                    id: 'cws-3',
                    stepName: 'Payment Processing',
                    stepOrder: 3,
                    status: 'pending',
                    assignedToName: 'Payment Officer',
                    completedByName: '',
                    completedAt: '',
                    comments: 'Pending'
                }
            ],
            attachments: ['payment_voucher.pdf', 'approval_document.pdf'],
            beneficiaryName: 'Medical Supplies Ltd',
            beneficiaryBank: 'First Bank',
            beneficiaryAccount: '0123456789',
            departmentName: 'Ministry of Health',
            initiatorName: 'Dr. Sarah Johnson'
        },
        {
            id: 'PC-002',
            confirmationNumber: 'PC-2025-002',
            paymentRequestId: 'PR-2025-002',
            paymentRequestNumber: 'PR-2025-002',
            projectTitle: 'Road Construction Phase 1',
            amount: 75000000,
            status: 'confirmed',
            priority: 'normal',
            approverName: 'Finance Director',
            approvalLevel: 'Finance Director',
            approvalDate: '2025-01-14T16:00:00Z',
            paymentVoucher: 'PV-2025-002',
            paymentMethod: 'Bank Transfer',
            bankReference: 'BR-2025-002',
            transactionId: 'TXN-2025-002',
            approvedAmount: 75000000,
            paymentDate: '2025-01-15T10:00:00Z',
            notes: 'Payment confirmed and processed',
            rejectionReason: '',
            createdAt: '2025-01-14T16:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z',
            progress: 100,
            currentStage: 'Completed',
            workflowSteps: [
                {
                    id: 'cws-4',
                    stepName: 'Project Review',
                    stepOrder: 1,
                    status: 'completed',
                    assignedToName: 'Project Manager',
                    completedByName: 'Project Manager',
                    completedAt: '2025-01-14T16:00:00Z',
                    comments: 'Milestone verified'
                },
                {
                    id: 'cws-5',
                    stepName: 'Finance Confirmation',
                    stepOrder: 2,
                    status: 'completed',
                    assignedToName: 'Finance Director',
                    completedByName: 'Finance Director',
                    completedAt: '2025-01-14T16:00:00Z',
                    comments: 'Payment confirmed'
                },
                {
                    id: 'cws-6',
                    stepName: 'Payment Processing',
                    stepOrder: 3,
                    status: 'completed',
                    assignedToName: 'Payment Officer',
                    completedByName: 'Payment Officer',
                    completedAt: '2025-01-15T10:00:00Z',
                    comments: 'Payment processed'
                }
            ],
            attachments: ['milestone_report.pdf', 'inspection_certificate.pdf', 'payment_receipt.pdf'],
            beneficiaryName: 'Road Construction Co.',
            beneficiaryBank: 'Zenith Bank',
            beneficiaryAccount: '0987654321',
            departmentName: 'Ministry of Works',
            initiatorName: 'Engr. Michael Brown'
        }
    ]);

    const [statuses] = useState<ConfirmationStatus[]>([
        { id: '1', name: 'Pending Confirmation', description: 'Awaiting confirmation', color: 'yellow', isFinal: false },
        { id: '2', name: 'Confirmed', description: 'Payment confirmed', color: 'green', isFinal: true },
        { id: '3', name: 'Rejected', description: 'Payment rejected', color: 'red', isFinal: true },
        { id: '4', name: 'Processing', description: 'Payment being processed', color: 'blue', isFinal: false },
        { id: '5', name: 'Completed', description: 'Payment completed', color: 'green', isFinal: true }
    ]);

    const getStatusColor = (status: string) => {
        const statusObj = statuses.find(s => s.name.toLowerCase().replace(' ', '_') === status);
        return statusObj?.color || 'gray';
    };

    const getStatusBadge = (status: string) => {
        const statusObj = statuses.find(s => s.name.toLowerCase().replace(' ', '_') === status);
        const colorMap: { [key: string]: string } = {
            'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'green': 'bg-green-100 text-green-800 border-green-200',
            'red': 'bg-red-100 text-red-800 border-red-200',
            'blue': 'bg-blue-100 text-blue-800 border-blue-200',
            'gray': 'bg-gray-100 text-gray-800 border-gray-200'
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
        const colorMap: { [key: string]: string } = {
            'low': 'bg-gray-100 text-gray-800 border-gray-200',
            'normal': 'bg-blue-100 text-blue-800 border-blue-200',
            'high': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'urgent': 'bg-orange-100 text-orange-800 border-orange-200',
            'emergency': 'bg-red-100 text-red-800 border-red-200'
        };
        return (
            <Badge
                variant="secondary"
                className={colorMap[priority] || 'bg-gray-100 text-gray-800 border-gray-200'}
            >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        );
    };

    const filteredConfirmations = paymentConfirmations.filter(confirmation => {
        const matchesSearch = confirmation.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            confirmation.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            confirmation.paymentRequestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            confirmation.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            confirmation.initiatorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || confirmation.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || confirmation.priority === priorityFilter;
        const matchesDepartment = departmentFilter === 'all' || confirmation.departmentName === departmentFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });

    const stats = {
        total: paymentConfirmations.length,
        pendingConfirmation: paymentConfirmations.filter(c => c.status === 'pending_confirmation').length,
        confirmed: paymentConfirmations.filter(c => c.status === 'confirmed').length,
        rejected: paymentConfirmations.filter(c => c.status === 'rejected').length,
        processing: paymentConfirmations.filter(c => c.status === 'processing').length,
        completed: paymentConfirmations.filter(c => c.status === 'completed').length
    };

    // Handler functions
    const handleViewConfirmation = (confirmation: PaymentConfirmation) => {
        setSelectedConfirmation(confirmation);
        setShowViewModal(true);
    };

    const handleApproveConfirmation = (confirmation: PaymentConfirmation) => {
        setSelectedConfirmation(confirmation);
        setShowApproveModal(true);
    };

    const handleRejectConfirmation = (confirmation: PaymentConfirmation) => {
        setSelectedConfirmation(confirmation);
        setShowRejectModal(true);
    };

    const handleWorkflowConfirmation = (confirmation: PaymentConfirmation) => {
        setSelectedConfirmation(confirmation);
        setShowWorkflowModal(true);
    };

    const handleDeleteConfirmation = (confirmation: PaymentConfirmation) => {
        setSelectedConfirmation(confirmation);
        setShowDeleteModal(true);
    };

    const confirmApproval = () => {
        if (selectedConfirmation && approvalNotes.trim()) {
            setPaymentConfirmations(prev => prev.map(confirmation =>
                confirmation.id === selectedConfirmation.id
                    ? {
                        ...confirmation,
                        status: 'confirmed',
                        progress: 100,
                        currentStage: 'Payment Processing',
                        approvalDate: new Date().toISOString(),
                        notes: approvalNotes
                    }
                    : confirmation
            ));
            setShowApproveModal(false);
            setApprovalNotes('');
            setSelectedConfirmation(null);
        }
    };

    const confirmRejection = () => {
        if (selectedConfirmation && rejectionReason.trim()) {
            setPaymentConfirmations(prev => prev.map(confirmation =>
                confirmation.id === selectedConfirmation.id
                    ? {
                        ...confirmation,
                        status: 'rejected',
                        progress: 100,
                        currentStage: 'Rejected',
                        rejectionReason: rejectionReason
                    }
                    : confirmation
            ));
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedConfirmation(null);
        }
    };

    const handleDelete = (confirmationId: string, reason: string, comments: string) => {
        setPaymentConfirmations(prev => prev.filter(confirmation => confirmation.id !== confirmationId));
        setShowDeleteModal(false);
        setSelectedConfirmation(null);
        
        // Here you would typically make an API call to delete the confirmation
        console.log('Deleting confirmation:', { confirmationId, reason, comments });
    };

    // Export functionality
    const handleExport = () => {
        const csvData = generateCSV();
        downloadCSV(csvData, 'payment_confirmations.csv');
    };

    const generateCSV = () => {
        const headers = [
            'Confirmation Number',
            'Payment Request Number',
            'Project Title',
            'Amount (NGN)',
            'Status',
            'Priority',
            'Department',
            'Beneficiary',
            'Created Date',
            'Current Stage'
        ];

        const rows = filteredConfirmations.map(confirmation => [
            confirmation.confirmationNumber,
            confirmation.paymentRequestNumber,
            confirmation.projectTitle,
            confirmation.amount.toLocaleString(),
            confirmation.status.replace('_', ' '),
            confirmation.priority,
            confirmation.departmentName,
            confirmation.beneficiaryName,
            formatDate(confirmation.createdAt),
            confirmation.currentStage
        ]);

        return [headers, ...rows];
    };

    const downloadCSV = (data: (string | number)[][], filename: string) => {
        const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
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

    // Refresh functionality
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Here you would typically fetch fresh data from the API
            console.log('Refreshing payment confirmations...');
            
            // For demo purposes, we'll just update the timestamp
            setPaymentConfirmations(prev => prev.map(confirmation => ({
                ...confirmation,
                updatedAt: new Date().toISOString()
            })));
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
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
                    <h1 className="text-3xl font-bold text-gray-900">Payment Confirmation</h1>
                    <p className="text-gray-600 mt-2">Review and confirm payment requests for processing</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Confirmations</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All confirmations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Confirmation</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pendingConfirmation}</div>
                        <p className="text-xs text-muted-foreground">Awaiting review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                        <p className="text-xs text-muted-foreground">Approved for payment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                        <p className="text-xs text-muted-foreground">Being processed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <p className="text-xs text-muted-foreground">Payments completed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <Input
                                placeholder="Search confirmations..."
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
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="emergency">Emergency</SelectItem>
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
                <div className="grid w-full grid-cols-5 gap-1 mb-6">
                    <Button
                        variant={activeTab === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('all')}
                        className="text-xs"
                    >
                        All ({stats.total})
                    </Button>
                    <Button
                        variant={activeTab === 'pending_confirmation' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('pending_confirmation')}
                        className="text-xs"
                    >
                        Pending ({stats.pendingConfirmation})
                    </Button>
                    <Button
                        variant={activeTab === 'confirmed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('confirmed')}
                        className="text-xs"
                    >
                        Confirmed ({stats.confirmed})
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
                    {/* Payment Confirmations List */}
                    <div className="space-y-4">
                        {filteredConfirmations.map(confirmation => (
                            <Card key={confirmation.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {confirmation.projectTitle}
                                                        </h3>
                                                        {confirmation.priority === 'emergency' && (
                                                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                                                                Emergency
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="font-medium">{confirmation.confirmationNumber}</span>
                                                        <span>•</span>
                                                        <span>{confirmation.paymentRequestNumber}</span>
                                                        <span>•</span>
                                                        <span>{confirmation.departmentName}</span>
                                                        <span>•</span>
                                                        <span>{confirmation.initiatorName}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                                        {formatCurrency(confirmation.amount)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(confirmation.status)}
                                                        {getPriorityBadge(confirmation.priority)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">Beneficiary:</span>
                                                    <div className="text-gray-600">{confirmation.beneficiaryName}</div>
                                                    <div className="text-gray-500">{confirmation.beneficiaryBank}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Payment Voucher:</span>
                                                    <div className="text-gray-600">{confirmation.paymentVoucher}</div>
                                                    <div className="text-gray-500">{confirmation.paymentMethod}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Current Stage:</span>
                                                    <div className="text-gray-600">{confirmation.currentStage}</div>
                                                    <Progress value={confirmation.progress} className="mt-2" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Created: {formatDate(confirmation.createdAt)}</span>
                                                    {confirmation.approvalDate && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Approved: {formatDate(confirmation.approvalDate)}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewConfirmation(confirmation)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                    {confirmation.status === 'pending_confirmation' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleApproveConfirmation(confirmation)}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                <Check className="w-4 h-4 mr-2" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRejectConfirmation(confirmation)}
                                                            >
                                                                <X className="w-4 h-4 mr-2" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleWorkflowConfirmation(confirmation)}
                                                    >
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Workflow
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteConfirmation(confirmation)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

            {/* Modals */}
            {showViewModal && selectedConfirmation && (
                <ViewPaymentConfirmationModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    confirmation={selectedConfirmation}
                />
            )}

            {showWorkflowModal && selectedConfirmation && (
                <PaymentConfirmationWorkflowModal
                    isOpen={showWorkflowModal}
                    onClose={() => setShowWorkflowModal(false)}
                    confirmation={selectedConfirmation}
                />
            )}

            {showDeleteModal && selectedConfirmation && (
                <DeletePaymentConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    confirmation={selectedConfirmation}
                    onDelete={handleDelete}
                />
            )}

            {showApproveModal && selectedConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">Approve Payment Confirmation</h2>
                        <p className="text-gray-600 mb-4">
                            Approve payment confirmation for: <strong>{selectedConfirmation.projectTitle}</strong>
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Approval Notes
                                </label>
                                <Textarea
                                    placeholder="Enter approval notes..."
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmApproval}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={!approvalNotes.trim()}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Approve Confirmation
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showRejectModal && selectedConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">Reject Payment Confirmation</h2>
                        <p className="text-gray-600 mb-4">
                            Reject payment confirmation for: <strong>{selectedConfirmation.projectTitle}</strong>
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rejection Reason
                                </label>
                                <Textarea
                                    placeholder="Enter rejection reason..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmRejection}
                                disabled={!rejectionReason.trim()}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Reject Confirmation
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
