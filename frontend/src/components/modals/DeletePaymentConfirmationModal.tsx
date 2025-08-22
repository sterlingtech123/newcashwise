'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Trash2,
    X,
    AlertTriangle,
    Shield,
    FileText,
    DollarSign,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    Clock
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

interface DeletePaymentConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    confirmation: PaymentConfirmation;
    onDelete: (confirmationId: string, reason: string, comments: string) => void;
}

const DELETE_REASONS = [
    { id: 'duplicate', label: 'Duplicate Entry', description: 'This is a duplicate of another confirmation' },
    { id: 'error', label: 'Data Entry Error', description: 'Incorrect information was entered' },
    { id: 'cancelled', label: 'Request Cancelled', description: 'The original request was cancelled' },
    { id: 'superseded', label: 'Superseded', description: 'Replaced by a newer confirmation' },
    { id: 'fraud', label: 'Suspected Fraud', description: 'Suspicious or fraudulent activity detected' },
    { id: 'other', label: 'Other', description: 'Other reason not listed above' }
];

const STATUS_WARNINGS = {
    pending_confirmation: { level: 'warning', message: 'This confirmation is pending and can be safely deleted' },
    confirmed: { level: 'danger', message: 'This confirmation has been confirmed and deletion may affect payment processing' },
    rejected: { level: 'info', message: 'This confirmation was rejected and can be deleted' },
    processing: { level: 'danger', message: 'This confirmation is being processed and deletion may cause issues' },
    completed: { level: 'danger', message: 'This confirmation is completed and deletion may affect financial records' }
} as const;

export const DeletePaymentConfirmationModal: React.FC<DeletePaymentConfirmationModalProps> = ({
    isOpen,
    onClose,
    confirmation,
    onDelete
}) => {
    const [deleteReason, setDeleteReason] = useState<string>('');
    const [comments, setComments] = useState('');
    const [confirmDeletion, setConfirmDeletion] = useState(false);
    const [deleteAttachments, setDeleteAttachments] = useState(false);
    const [notifyStakeholders, setNotifyStakeholders] = useState(true);

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
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusWarning = (status: string) => {
        return STATUS_WARNINGS[status as keyof typeof STATUS_WARNINGS] || STATUS_WARNINGS.pending_confirmation;
    };

    const getWarningIcon = (level: string) => {
        switch (level) {
            case 'danger': return AlertTriangle;
            case 'warning': return AlertTriangle;
            case 'info': return Shield;
            default: return AlertTriangle;
        }
    };

    const getWarningColor = (level: string) => {
        switch (level) {
            case 'danger': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            case 'info': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    const handleDelete = () => {
        if (deleteReason && comments.trim() && confirmDeletion) {
            onDelete(confirmation.id, deleteReason, comments);
            // Reset form
            setDeleteReason('');
            setComments('');
            setConfirmDeletion(false);
            setDeleteAttachments(false);
            setNotifyStakeholders(true);
        }
    };

    const canDelete = () => {
        return deleteReason && comments.trim() && confirmDeletion;
    };

    const statusWarning = getStatusWarning(confirmation.status);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Delete Payment Confirmation</h2>
                            <p className="text-gray-600 mt-1">This action cannot be undone</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Confirmation Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Confirmation Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-600">Confirmation Number:</span>
                                    <p className="font-medium">{confirmation.confirmationNumber}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Project Title:</span>
                                    <p className="font-medium">{confirmation.projectTitle}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Amount:</span>
                                    <p className="font-medium text-green-600">{formatCurrency(confirmation.amount)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Status:</span>
                                    <Badge variant="secondary">{confirmation.status.replace('_', ' ')}</Badge>
                                </div>
                                <div>
                                    <span className="text-gray-600">Department:</span>
                                    <p className="font-medium">{confirmation.departmentName}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Created:</span>
                                    <p className="font-medium">{formatDate(confirmation.createdAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Warning */}
                    <Card className={`border-l-4 border-l-${statusWarning.level === 'danger' ? 'red' : statusWarning.level === 'warning' ? 'yellow' : 'blue'}-500`}>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                {React.createElement(getWarningIcon(statusWarning.level), { 
                                    className: `h-5 w-5 ${getWarningColor(statusWarning.level)} mt-0.5` 
                                })}
                                <div>
                                    <h4 className={`font-medium ${getWarningColor(statusWarning.level)}`}>
                                        {statusWarning.level === 'danger' ? 'High Risk' : statusWarning.level === 'warning' ? 'Warning' : 'Information'}
                                    </h4>
                                    <p className="text-gray-700 mt-1">{statusWarning.message}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Deletion Reason */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Reason for Deletion <span className="text-red-500">*</span>
                        </label>
                        <Select value={deleteReason} onValueChange={setDeleteReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason for deletion" />
                            </SelectTrigger>
                            <SelectContent>
                                {DELETE_REASONS.map(reason => (
                                    <SelectItem key={reason.id} value={reason.id}>
                                        <div>
                                            <div className="font-medium">{reason.label}</div>
                                            <div className="text-sm text-gray-500">{reason.description}</div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Additional Comments <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            placeholder="Please provide detailed explanation for the deletion..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Advanced Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Advanced Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="deleteAttachments"
                                    checked={deleteAttachments}
                                    onCheckedChange={(checked) => setDeleteAttachments(checked as boolean)}
                                />
                                <Label htmlFor="deleteAttachments">
                                    Delete associated attachments and documents
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="notifyStakeholders"
                                    checked={notifyStakeholders}
                                    onCheckedChange={(checked) => setNotifyStakeholders(checked as boolean)}
                                />
                                <Label htmlFor="notifyStakeholders">
                                    Notify relevant stakeholders about this deletion
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confirmation */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="confirmDeletion"
                            checked={confirmDeletion}
                            onCheckedChange={(checked) => setConfirmDeletion(checked as boolean)}
                        />
                        <Label htmlFor="confirmDeletion" className="text-sm">
                            I understand that this action cannot be undone and will permanently delete this payment confirmation
                        </Label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={!canDelete()}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Confirmation
                    </Button>
                </div>
            </div>
        </div>
    );
};
