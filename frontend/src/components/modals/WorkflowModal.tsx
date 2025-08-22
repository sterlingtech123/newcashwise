"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    X,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    MessageSquare,
    ArrowRight,
    Pause,
    SkipForward,
    RefreshCw,
    XCircle
} from 'lucide-react';

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

interface PaymentRequest {
    id: string;
    requestNumber: string;
    projectTitle: string;
    status: string;
    amount: number;
    currentStage: string;
    workflowSteps: WorkflowStep[];
}

interface WorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: PaymentRequest | null;
}

const WORKFLOW_ACTIONS = [
    { id: 'approve', label: 'Approve', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'reject', label: 'Reject', color: 'bg-red-600 hover:bg-red-700' },
    { id: 'skip', label: 'Skip', color: 'bg-gray-600 hover:bg-gray-700' },
    { id: 'pause', label: 'Pause', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { id: 'reassign', label: 'Reassign', color: 'bg-blue-600 hover:bg-blue-700' }
];

const USERS = [
    { id: 'Finance Director', name: 'Finance Director' },
    { id: 'Department Head', name: 'Department Head' },
    { id: 'Budget Officer', name: 'Budget Officer' },
    { id: 'Accountant', name: 'Accountant' },
    { id: 'Treasury Officer', name: 'Treasury Officer' },
    { id: 'Auditor', name: 'Auditor' },
    { id: 'Governor', name: 'Governor' },
    { id: 'Commissioner', name: 'Commissioner' }
];

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
    isOpen,
    onClose,
    request
}) => {
    const [selectedStep, setSelectedStep] = useState<string | null>(null);
    const [action, setAction] = useState<string>('');
    const [comments, setComments] = useState('');
    const [reassignTo, setReassignTo] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !request) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
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

    const getStepIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle;
            case 'in_progress': return Clock;
            case 'skipped': return XCircle;
            case 'paused': return Pause;
            default: return Clock;
        }
    };

    const getStepColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-600';
            case 'in_progress': return 'bg-blue-600';
            case 'skipped': return 'bg-gray-400';
            case 'paused': return 'bg-yellow-600';
            default: return 'bg-gray-400';
        }
    };

    const getStepBadgeColor = (status: string) => {
        switch (status) {
            case 'completed': return 'default';
            case 'in_progress': return 'default';
            case 'skipped': return 'secondary';
            case 'paused': return 'secondary';
            default: return 'secondary';
        }
    };

    const calculateProgress = (steps: WorkflowStep[]) => {
        const completedSteps = steps.filter(step => step.status === 'completed').length;
        return (completedSteps / steps.length) * 100;
    };

    const handleStepClick = (stepId: string) => {
        setSelectedStep(stepId === selectedStep ? null : stepId);
        setAction('');
        setComments('');
        setReassignTo('');
    };

    const handleActionChange = (value: string) => {
        setAction(value);
        if (value === 'reassign') {
            setReassignTo(USERS[0]?.id || '');
        }
    };

    const handleStepAction = async () => {
        if (!selectedStep || !action) return;

        setIsProcessing(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Workflow action executed:', {
                stepId: selectedStep,
                action,
                comments,
                reassignTo: action === 'reassign' ? reassignTo : undefined
            });

            // Reset form
            setAction('');
            setComments('');
            setReassignTo('');
            setSelectedStep(null);
            
            // Show success message (you can add a toast notification here)
            alert('Workflow action completed successfully!');
        } catch (error) {
            console.error('Failed to execute workflow action:', error);
            alert('Failed to execute workflow action. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const canPerformAction = (step: WorkflowStep) => {
        if (step.status === 'completed') return false;
        if (step.status === 'skipped') return false;
        return true;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Workflow Management</h2>
                        <p className="text-gray-600 mt-1">Request #{request.requestNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex h-[calc(90vh-120px)]">
                    {/* Left Panel - Workflow Steps */}
                    <div className="flex-1 p-6 border-r border-gray-200 overflow-y-auto">
                        <div className="space-y-4">
                            {/* Overall Progress */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Overall Progress</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Completion</span>
                                            <span>{calculateProgress(request.workflowSteps)}%</span>
                                        </div>
                                        <Progress value={calculateProgress(request.workflowSteps)} className="h-2" />
                                        <div className="text-sm text-gray-600">
                                            {request.workflowSteps.filter(s => s.status === 'completed').length} of {request.workflowSteps.length} steps completed
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Workflow Steps */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Workflow Steps</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {request.workflowSteps.map((step, index) => (
                                            <div
                                                key={step.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    selectedStep === step.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                } ${!canPerformAction(step) ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                onClick={() => canPerformAction(step) && handleStepClick(step.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                                        getStepColor(step.status)
                                                    }`}>
                                                        {React.createElement(getStepIcon(step.status), { className: "w-4 h-4" })}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-medium text-gray-900">{step.stepName}</h4>
                                                            <Badge variant={getStepBadgeColor(step.status)}>
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
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Panel - Action Panel */}
                    <div className="w-96 p-6 bg-gray-50 overflow-y-auto">
                        {selectedStep ? (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Action Panel</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Selected Step</Label>
                                            <p className="mt-1 text-gray-900 font-medium">
                                                {request.workflowSteps.find(s => s.id === selectedStep)?.stepName}
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Action</Label>
                                            <Select value={action} onValueChange={handleActionChange}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select an action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {WORKFLOW_ACTIONS.map((actionItem) => (
                                                        <SelectItem key={actionItem.id} value={actionItem.id}>
                                                            <div className="flex items-center gap-2">
                                                                {actionItem.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {action === 'reassign' && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Reassign To</Label>
                                                <Select value={reassignTo} onValueChange={setReassignTo}>
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select user" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {USERS.map((user) => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Comments</Label>
                                            <Textarea
                                                value={comments}
                                                onChange={(e) => setComments(e.target.value)}
                                                placeholder="Add comments about this action..."
                                                className="mt-1"
                                                rows={3}
                                            />
                                        </div>

                                        <Button
                                            onClick={handleStepAction}
                                            disabled={!action || isProcessing}
                                            className="w-full"
                                        >
                                            {isProcessing ? (
                                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <ArrowRight className="h-4 w-4 mr-2" />
                                            )}
                                            Execute Action
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <p>Select a workflow step to perform actions</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
