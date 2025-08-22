'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Receipt,
    X,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    Building2,
    User,
    CreditCard,
    FileText,
    Calendar,
    DollarSign,
    Shield,
    TrendingUp
} from 'lucide-react';

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

interface ViewPaymentConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    confirmation: PaymentConfirmation;
}

const STATUS_CONFIG = {
    pending_confirmation: { label: 'Pending Confirmation', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
    completed: { label: 'Completed', color: 'bg-green-600 text-white', icon: CheckCircle }
};

const PRIORITY_CONFIG = {
    low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
    normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    high: { label: 'High', color: 'bg-yellow-100 text-yellow-800' },
    urgent: { label: 'Urgent', color: 'bg-orange-100 text-orange-800' },
    emergency: { label: 'Emergency', color: 'bg-red-600 text-white' }
};

export const ViewPaymentConfirmationModal: React.FC<ViewPaymentConfirmationModalProps> = ({
    isOpen,
    onClose,
    confirmation
}) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!isOpen || !confirmation) return null;

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

    const getStatusConfig = (status: string) => {
        return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending_confirmation;
    };

    const getPriorityConfig = (priority: string) => {
        return PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.normal;
    };

    const getWorkflowStepIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle;
            case 'in_progress': return Clock;
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
                            <h2 className="text-2xl font-bold text-gray-900">Payment Confirmation Details</h2>
                            <p className="text-gray-600 mt-1">{confirmation.confirmationNumber}</p>
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
                            <TabsTrigger value="workflow">Workflow</TabsTrigger>
                            <TabsTrigger value="beneficiary">Beneficiary</TabsTrigger>
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
                                            <Badge className={getStatusConfig(confirmation.status).color}>
                                                {getStatusConfig(confirmation.status).label}
                                            </Badge>
                                            {confirmation.priority === 'emergency' && (
                                                <Badge className="bg-red-600 text-white">Emergency</Badge>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium">{confirmation.progress}%</span>
                                            </div>
                                            <Progress value={confirmation.progress} className="h-2" />
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Current Stage: </span>
                                            <span className="font-medium">{confirmation.currentStage}</span>
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
                                            {formatCurrency(confirmation.amount)}
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Voucher:</span>
                                                <span className="font-medium">{confirmation.paymentVoucher}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Method:</span>
                                                <span className="font-medium">{confirmation.paymentMethod}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Bank Reference:</span>
                                                <span className="font-medium">{confirmation.bankReference}</span>
                                            </div>
                                            {confirmation.transactionId && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Transaction ID:</span>
                                                    <span className="font-medium">{confirmation.transactionId}</span>
                                                </div>
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
                                                <span className="font-medium">{formatDate(confirmation.createdAt)}</span>
                                            </div>
                                            {confirmation.approvalDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Approved:</span>
                                                    <span className="font-medium">{formatDate(confirmation.approvalDate)}</span>
                                                </div>
                                            )}
                                            {confirmation.paymentDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Payment Date:</span>
                                                    <span className="font-medium">{formatDate(confirmation.paymentDate)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Last Updated:</span>
                                                <span className="font-medium">{formatDate(confirmation.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Project & Department Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            Project Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Project Title:</span>
                                            <span className="font-medium">{confirmation.projectTitle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Request:</span>
                                            <span className="font-medium">{confirmation.paymentRequestNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Department:</span>
                                            <span className="font-medium">{confirmation.departmentName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Initiator:</span>
                                            <span className="font-medium">{confirmation.initiatorName}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-green-600" />
                                            Approval Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Approver:</span>
                                            <span className="font-medium">{confirmation.approverName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Approval Level:</span>
                                            <span className="font-medium">{confirmation.approvalLevel}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Priority:</span>
                                            <Badge className={getPriorityConfig(confirmation.priority).color}>
                                                {getPriorityConfig(confirmation.priority).label}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Notes */}
                            {confirmation.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">{confirmation.notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Rejection Reason */}
                            {confirmation.rejectionReason && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-red-600">Rejection Reason</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-red-700">{confirmation.rejectionReason}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Workflow Tab */}
                        <TabsContent value="workflow" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Workflow Steps</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {confirmation.workflowSteps.map((step, index) => (
                                            <div key={step.id} className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                                    getWorkflowStepColor(step.status)
                                                }`}>
                                                    {React.createElement(getWorkflowStepIcon(step.status), { className: "w-4 h-4" })}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-gray-900">{step.stepName}</h4>
                                                        <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                                                            {step.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Assigned to: {step.assignedToName}
                                                    </p>
                                                    {step.completedByName && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Completed by: {step.completedByName} on {formatDate(step.completedAt)}
                                                        </p>
                                                    )}
                                                    {step.comments && (
                                                        <p className="text-sm text-gray-600 mt-2 italic">
                                                            "{step.comments}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Beneficiary Tab */}
                        <TabsContent value="beneficiary" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                        Beneficiary Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Beneficiary Name
                                            </label>
                                            <p className="text-gray-900 font-medium">{confirmation.beneficiaryName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bank
                                            </label>
                                            <p className="text-gray-900">{confirmation.beneficiaryBank}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Number
                                            </label>
                                            <p className="text-gray-900 font-mono">{confirmation.beneficiaryAccount}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Attachments Tab */}
                        <TabsContent value="attachments" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {confirmation.attachments.length > 0 ? (
                                        <div className="space-y-3">
                                            {confirmation.attachments.map((attachment, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-gray-500" />
                                                        <span className="text-gray-900">{attachment}</span>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No attachments available</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};
