"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
    X,
    Download,
    Eye,
    FileText,
    User,
    Building2,
    CreditCard,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Shield,
    TrendingUp,
    Receipt,
    MessageSquare,
    History,
    ExternalLink,
    Phone,
    Mail,
    MapPin,
    Banknote,
    FileCheck,
    CheckCircle2,
    Clock2
} from 'lucide-react';

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

interface ViewPaymentRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: PaymentRequest | null;
}

const STATUS_CONFIG = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: FileText },
    submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: Clock },
    under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Eye },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: TrendingUp },
    completed: { label: 'Completed', color: 'bg-green-600 text-white', icon: CheckCircle2 }
};

const PRIORITY_CONFIG = {
    low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
    normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
    urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
    emergency: { label: 'Emergency', color: 'bg-red-600 text-white' }
};

export const ViewPaymentRequestModal: React.FC<ViewPaymentRequestModalProps> = ({
    isOpen,
    onClose,
    request
}) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!isOpen || !request) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
        return config ? config.icon : FileText;
    };

    const getStatusConfig = (status: string) => {
        return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
    };

    const getPriorityConfig = (priority: string) => {
        return PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.normal;
    };

    const getWorkflowStepIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle2;
            case 'in_progress': return Clock2;
            case 'skipped': return XCircle;
            default: return Clock;
        }
    };

    const getWorkflowStepColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-600';
            case 'in_progress': return 'bg-blue-600';
            case 'skipped': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Receipt className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Payment Request Details</h2>
                            <p className="text-gray-600 mt-1">{request.requestNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="beneficiary">Beneficiary</TabsTrigger>
                            <TabsTrigger value="workflow">Workflow</TabsTrigger>
                            <TabsTrigger value="attachments">Attachments</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6 mt-6">
                            {/* Status & Progress */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-blue-600" />
                                            Status & Progress
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusConfig(request.status).color}>
                                                {getStatusConfig(request.status).label}
                                            </Badge>
                                            {request.isEmergency && (
                                                <Badge className="bg-red-600 text-white">Emergency</Badge>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium">{request.progress}%</span>
                                            </div>
                                            <Progress value={request.progress} className="h-2" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Current Stage: </span>
                                            <span className="font-medium">{request.currentStage}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            Financial Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="text-2xl font-bold text-green-600">
                                            {formatCurrency(request.amount)}
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Budgeted:</span>
                                                <Badge variant={request.isBudgeted ? "default" : "secondary"}>
                                                    {request.isBudgeted ? 'Yes' : 'No'}
                                                </Badge>
                                            </div>
                                            {request.isBudgeted && (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Budget Line:</span>
                                                        <span className="font-medium">{request.budgetLine}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Account Code:</span>
                                                        <span className="font-medium">{request.accountCode}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            Timeline
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Created:</span>
                                                <span className="font-medium">{formatDateTime(request.createdAt)}</span>
                                            </div>
                                            {request.submittedAt && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Submitted:</span>
                                                    <span className="font-medium">{formatDateTime(request.submittedAt)}</span>
                                                </div>
                                            )}
                                            {request.approvedAt && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Approved:</span>
                                                    <span className="font-medium">{formatDateTime(request.approvedAt)}</span>
                                                </div>
                                            )}
                                            {request.rejectedAt && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Rejected:</span>
                                                    <span className="font-medium">{formatDateTime(request.rejectedAt)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Due Date:</span>
                                                <span className="font-medium">{formatDate(request.dueDate)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Project Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                        Project Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Request Type:</span>
                                                    <span className="font-medium">{request.requestType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Priority:</span>
                                                    <Badge className={getPriorityConfig(request.priority).color}>
                                                        {getPriorityConfig(request.priority).label}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Department:</span>
                                                    <span className="font-medium">{request.departmentName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Initiator:</span>
                                                    <span className="font-medium">{request.initiatorName}</span>
                                                </div>
                                                {request.currentApproverName && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Current Approver:</span>
                                                        <span className="font-medium">{request.currentApproverName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Project Information</h4>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600 block mb-1">Project Title:</span>
                                                    <span className="font-medium">{request.projectTitle}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 block mb-1">Description:</span>
                                                    <span className="font-medium">{request.description}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 block mb-1">Justification:</span>
                                                    <span className="font-medium">{request.justification}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comments */}
                            {request.comments.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-orange-600" />
                                            Comments & Notes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {request.comments.map((comment, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">{comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Beneficiary Tab */}
                        <TabsContent value="beneficiary" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-green-600" />
                                        Beneficiary Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                                                <p className="text-gray-900 font-medium">{request.beneficiaryName}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                                                <p className="text-gray-900 font-medium">{request.beneficiaryBank}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Account Number</Label>
                                                <p className="text-gray-900 font-medium font-mono">{request.beneficiaryAccount}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <p className="text-gray-900 font-medium">{request.beneficiaryPhone}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <p className="text-gray-900 font-medium">{request.beneficiaryEmail}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Payment Amount</Label>
                                                <p className="text-2xl font-bold text-green-600">{formatCurrency(request.amount)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Workflow Tab */}
                        <TabsContent value="workflow" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Workflow Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {request.workflowSteps.map((step, index) => (
                                            <div key={step.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                                    getWorkflowStepColor(step.status)
                                                }`}>
                                                    {React.createElement(getWorkflowStepIcon(step.status), { className: "w-4 h-4" })}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-gray-900">{step.stepName}</h4>
                                                        <Badge variant={getWorkflowStepColor(step.status) === 'bg-blue-600' ? 'default' : 'secondary'}>
                                                            {step.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Assigned to: {step.assignedToName}
                                                    </p>
                                                    {step.completedAt && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Completed: {formatDateTime(step.completedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Attachments Tab */}
                        <TabsContent value="attachments" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-purple-600" />
                                        Documents & Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {request.attachments && request.attachments.length > 0 ? (
                                        <div className="space-y-3">
                                            {request.attachments.map((attachment, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-5 w-5 text-gray-500" />
                                                        <span className="text-gray-900">{attachment}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                                            <Eye className="h-4 w-4 text-blue-600" />
                                                        </button>
                                                        <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                                                            <Download className="h-4 w-4 text-green-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                            <p>No attachments found</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Export Details
                    </button>
                </div>
            </div>
        </div>
    );
}
