"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    X,
    Trash2,
    AlertTriangle,
    Info,
    AlertCircle,
    FileText,
    Shield,
    Archive
} from 'lucide-react';

interface PaymentRequest {
    id: string;
    requestNumber: string;
    projectTitle: string;
    status: string;
    amount: number;
    initiatorName: string;
    departmentName: string;
    createdAt: string;
    currentStage: string;
}

interface DeletePaymentRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: PaymentRequest | null;
    onDelete: (requestId: string, reason: string, comments: string) => void;
}

const DELETE_REASONS = [
    { value: 'duplicate', label: 'Duplicate Request', description: 'Request was created multiple times' },
    { value: 'cancelled', label: 'Request Cancelled', description: 'Request was cancelled by initiator' },
    { value: 'budget_constraint', label: 'Budget Constraint', description: 'No budget available for this request' },
    { value: 'policy_violation', label: 'Policy Violation', description: 'Request violates organizational policies' },
    { value: 'vendor_issue', label: 'Vendor Issue', description: 'Vendor is no longer available or suitable' },
    { value: 'scope_change', label: 'Scope Change', description: 'Project scope has changed significantly' },
    { value: 'other', label: 'Other Reason', description: 'Other reason not listed above' }
];

const STATUS_WARNINGS = {
    draft: { level: 'info', message: 'This request is still in draft status and can be safely deleted.', title: 'Draft Status', borderColor: 'border-blue-500', variant: 'secondary' as const },
    submitted: { level: 'warning', message: 'This request has been submitted and may have started the approval process.', title: 'Submitted for Approval', borderColor: 'border-yellow-500', variant: 'secondary' as const },
    under_review: { level: 'warning', message: 'This request is currently under review. Deletion may affect workflow.', title: 'Under Review', borderColor: 'border-yellow-500', variant: 'secondary' as const },
    approved: { level: 'error', message: 'This request has been approved. Deletion requires special authorization.', title: 'Approved', borderColor: 'border-red-500', variant: 'destructive' as const },
    processing: { level: 'error', message: 'This request is being processed. Deletion may cause payment issues.', title: 'Processing', borderColor: 'border-red-500', variant: 'destructive' as const },
    completed: { level: 'error', message: 'This request has been completed. Deletion is not recommended.', title: 'Completed', borderColor: 'border-red-500', variant: 'destructive' as const }
};

export const DeletePaymentRequestModal: React.FC<DeletePaymentRequestModalProps> = ({
    isOpen,
    onClose,
    request,
    onDelete
}) => {
    const [deleteReason, setDeleteReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);

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
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusWarning = (status: string) => {
        return STATUS_WARNINGS[status as keyof typeof STATUS_WARNINGS] || STATUS_WARNINGS.draft;
    };

    const getWarningIcon = (level: string) => {
        switch (level) {
            case 'info': return Info;
            case 'warning': return AlertTriangle;
            case 'error': return AlertCircle;
            default: return Info;
        }
    };

    const handleDelete = async () => {
        if (!deleteReason || !confirmDelete) return;

        setIsDeleting(true);
        try {
            const finalReason = deleteReason === 'custom' ? customReason : deleteReason;
            await onDelete(request.id, finalReason, comments);
            
            // Reset form
            setDeleteReason('');
            setCustomReason('');
            setComments('');
            setConfirmDelete(false);
            setShowAdvancedOptions(false);
        } catch (error) {
            console.error('Failed to delete payment request:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const resetForm = () => {
        setDeleteReason('');
        setCustomReason('');
        setComments('');
        setConfirmDelete(false);
        setShowAdvancedOptions(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const canDelete = () => {
        if (!deleteReason) return false;
        if (deleteReason === 'custom' && !customReason.trim()) return false;
        if (!confirmDelete) return false;
        return true;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Delete Payment Request</h2>
                            <p className="text-gray-600 mt-1">Request #{request.requestNumber}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="space-y-6">
                        {/* Request Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Request Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Project Title</Label>
                                        <p className="mt-1 text-gray-900">{request.projectTitle}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Amount</Label>
                                        <p className="mt-1 text-gray-900 font-medium">{formatCurrency(request.amount)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Status</Label>
                                        <Badge variant={getStatusWarning(request.status).variant} className="mt-1">
                                            {request.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Created</Label>
                                        <p className="mt-1 text-gray-900">{formatDate(request.createdAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Warning */}
                        <Card className={`border-l-4 ${getStatusWarning(request.status).borderColor}`}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    {React.createElement(getWarningIcon(getStatusWarning(request.status).level), { className: "h-5 w-5 text-gray-500" })}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            {getStatusWarning(request.status).title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {getStatusWarning(request.status).message}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deletion Reason */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Reason for Deletion</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Select Reason</Label>
                                    <Select value={deleteReason} onValueChange={setDeleteReason}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Choose a deletion reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DELETE_REASONS.map((reason) => (
                                                <SelectItem key={reason.value} value={reason.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div>
                                                            <div className="font-medium">{reason.label}</div>
                                                            <div className="text-sm text-gray-500">{reason.description}</div>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {deleteReason === 'custom' && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Custom Reason</Label>
                                        <Textarea
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            placeholder="Please provide a detailed reason for deletion..."
                                            className="mt-1"
                                            rows={3}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Comments */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Additional Comments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add any additional comments or notes..."
                                    rows={3}
                                />
                            </CardContent>
                        </Card>

                        {/* Advanced Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Advanced Options</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium">Notify Stakeholders</span>
                                        </div>
                                        <Checkbox
                                            checked={showAdvancedOptions}
                                            onCheckedChange={(checked) => setShowAdvancedOptions(checked as boolean)}
                                        />
                                    </div>
                                    
                                    {showAdvancedOptions && (
                                        <div className="pl-7 space-y-3 text-sm text-gray-600">
                                            <p>• Department heads will be notified</p>
                                            <p>• Finance team will receive deletion report</p>
                                            <p>• Audit trail will be maintained</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Final Confirmation */}
                        <Card className="border-l-4 border-red-500 bg-red-50">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={confirmDelete}
                                                onCheckedChange={(checked) => setConfirmDelete(checked as boolean)}
                                            />
                                            <Label className="text-sm font-medium text-red-700">
                                                I understand that this action cannot be undone
                                            </Label>
                                        </div>
                                        <p className="text-sm text-red-600">
                                            This will permanently delete the payment request and all associated data. 
                                            This action cannot be reversed.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleDelete}
                        disabled={!canDelete() || isDeleting}
                        variant="destructive"
                        className="flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Request
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
