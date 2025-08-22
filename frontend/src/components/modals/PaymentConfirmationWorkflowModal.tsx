'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Shield,
    X,
    CheckCircle,
    Clock,
    XCircle,
    User,
    MessageSquare,
    TrendingUp,
    AlertCircle,
    Play,
    SkipForward,
    RotateCcw
} from 'lucide-react';

interface PaymentConfirmation {
    id: string;
    confirmationNumber: string;
    projectTitle: string;
    amount: number;
    status: 'pending_confirmation' | 'confirmed' | 'rejected' | 'processing' | 'completed';
    progress: number;
    currentStage: string;
    workflowSteps: ConfirmationWorkflowStep[];
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

interface PaymentConfirmationWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    confirmation: PaymentConfirmation;
}

const WORKFLOW_ACTIONS = [
    { id: 'start', label: 'Start Step', description: 'Begin processing this step' },
    { id: 'complete', label: 'Complete Step', description: 'Mark step as completed' },
    { id: 'skip', label: 'Skip Step', description: 'Skip this step if not applicable' },
    { id: 'reassign', label: 'Reassign', description: 'Assign to different user' },
    { id: 'hold', label: 'Put on Hold', description: 'Temporarily pause this step' }
];

const USERS = [
    { id: '1', name: 'Finance Director', role: 'Finance Director' },
    { id: '2', name: 'Payment Officer', role: 'Payment Officer' },
    { id: '3', name: 'Department Head', role: 'Department Head' },
    { id: '4', name: 'Project Manager', role: 'Project Manager' },
    { id: '5', name: 'Audit Officer', role: 'Audit Officer' }
];

export const PaymentConfirmationWorkflowModal: React.FC<PaymentConfirmationWorkflowModalProps> = ({
    isOpen,
    onClose,
    confirmation
}) => {
    const [selectedStep, setSelectedStep] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [actionComments, setActionComments] = useState('');
    const [assignedUser, setAssignedUser] = useState<string>('');

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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStepBadgeColor = (status: string) => {
        switch (status) {
            case 'completed': return 'default';
            case 'in_progress': return 'secondary';
            case 'skipped': return 'destructive';
            default: return 'outline';
        }
    };

    const getStepColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-600';
            case 'in_progress': return 'bg-blue-600';
            case 'skipped': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStepIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle;
            case 'in_progress': return Clock;
            case 'skipped': return XCircle;
            default: return Clock;
        }
    };

    const calculateProgress = () => {
        const completedSteps = confirmation.workflowSteps.filter(step => step.status === 'completed').length;
        return Math.round((completedSteps / confirmation.workflowSteps.length) * 100);
    };

    const handleStepClick = (stepId: string) => {
        setSelectedStep(stepId);
        setSelectedAction('');
        setActionComments('');
        setAssignedUser('');
    };

    const handleActionChange = (action: string) => {
        setSelectedAction(action);
    };

    const handleStepAction = () => {
        if (!selectedStep || !selectedAction) return;

        // Here you would typically make an API call to update the workflow step
        console.log('Updating workflow step:', {
            stepId: selectedStep,
            action: selectedAction,
            comments: actionComments,
            assignedUser: assignedUser
        });

        // Reset form
        setSelectedAction('');
        setActionComments('');
        setAssignedUser('');
        setSelectedStep(null);
    };

    const canPerformAction = (step: ConfirmationWorkflowStep) => {
        if (step.status === 'completed') return false;
        if (step.status === 'skipped') return false;
        return true;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Workflow Management</h2>
                            <p className="text-gray-600 mt-1">{confirmation.confirmationNumber} - {confirmation.projectTitle}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Workflow Steps */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Progress Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        Workflow Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                                        <span className="text-lg font-bold text-blue-600">{calculateProgress()}%</span>
                                    </div>
                                    <Progress value={calculateProgress()} className="h-3" />
                                    <div className="text-sm text-gray-600">
                                        {confirmation.workflowSteps.filter(s => s.status === 'completed').length} of {confirmation.workflowSteps.length} steps completed
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Workflow Steps */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Workflow Steps</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {confirmation.workflowSteps.map((step, index) => (
                                            <div
                                                key={step.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    selectedStep === step.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handleStepClick(step.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                                        getStepColor(step.status)
                                                    }`}>
                                                        {React.createElement(getStepIcon(step.status), { className: "w-5 h-5" })}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900">{step.stepName}</h4>
                                                            <Badge variant={getStepBadgeColor(step.status)}>
                                                                {step.status.replace('_', ' ')}
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            <p>Assigned to: {step.assignedToName}</p>
                                                            {step.completedByName && (
                                                                <p>Completed by: {step.completedByName}</p>
                                                            )}
                                                            {step.completedAt && (
                                                                <p>Completed: {formatDate(step.completedAt)}</p>
                                                            )}
                                                            {step.comments && (
                                                                <p className="italic">"{step.comments}"</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Action Panel */}
                        <div className="space-y-6">
                            {/* Action Panel */}
                            {selectedStep && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-orange-600" />
                                            Action Panel
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Selected Step
                                            </label>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {confirmation.workflowSteps.find(s => s.id === selectedStep)?.stepName}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Action
                                            </label>
                                            <Select value={selectedAction} onValueChange={handleActionChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an action" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {WORKFLOW_ACTIONS.map(action => (
                                                        <SelectItem key={action.id} value={action.id}>
                                                            {action.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {selectedAction === 'reassign' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Assign to User
                                                </label>
                                                <Select value={assignedUser} onValueChange={setAssignedUser}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select user" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {USERS.map(user => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.name} - {user.role}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Comments
                                            </label>
                                            <Textarea
                                                placeholder="Enter action comments..."
                                                value={actionComments}
                                                onChange={(e) => setActionComments(e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        <Button
                                            onClick={handleStepAction}
                                            disabled={!selectedAction || !actionComments.trim()}
                                            className="w-full"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Execute Action
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset Workflow
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <SkipForward className="w-4 h-4 mr-2" />
                                        Skip All Pending
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Send Notifications
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Workflow Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Workflow Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Confirmation Number:</span>
                                        <span className="font-medium">{confirmation.confirmationNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium">{formatCurrency(confirmation.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current Stage:</span>
                                        <span className="font-medium">{confirmation.currentStage}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <Badge variant="secondary">{confirmation.status.replace('_', ' ')}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
