"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    X,
    ArrowLeft,
    ArrowRight,
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    DollarSign,
    User,
    Building,
    Calendar,
    Clock,
    Save,
    Send,
    Edit
} from 'lucide-react';

interface EditPaymentRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    paymentRequest: any;
}

interface FormData {
    // Basic Information
    requestType: string;
    projectTitle: string;
    description: string;
    justification: string;
    amount: string;
    priority: string;
    requestDate: string;
    expectedDate: string;
    
    // Beneficiary Information
    beneficiaryName: string;
    beneficiaryBank: string;
    beneficiaryAccount: string;
    beneficiaryPhone: string;
    beneficiaryEmail: string;
    
    // Budget & Accounting
    department: string;
    budgetLine: string;
    accountCode: string;
    
    // Additional Details
    isEmergency: boolean;
    isBudgeted: boolean;
    attachments: File[];
    comments: string;
}

const REQUEST_TYPES = [
    { value: 'budgeted', label: 'Budgeted Payment Requests', category: 'Capital' },
    { value: 'recurrent', label: 'Recurrent Payment Requests', category: 'Recurrent' },
    { value: 'unbudgeted', label: 'Un-Budgeted Payment Requests', category: 'Un-Budgeted' },
    { value: 'emergency', label: 'Emergency Payment Requests', category: 'Emergency' }
];

const PRIORITIES = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-600 text-white' }
];

const DEPARTMENTS = [
    { value: 'Ministry of Health', label: 'Ministry of Health' },
    { value: 'Ministry of Education', label: 'Ministry of Education' },
    { value: 'Ministry of Finance', label: 'Ministry of Finance' },
    { value: 'Ministry of Works', label: 'Ministry of Works' },
    { value: 'Ministry of Agriculture', label: 'Ministry of Agriculture' },
    { value: 'Ministry of Transportation', label: 'Ministry of Transportation' },
    { value: 'Ministry of Justice', label: 'Ministry of Justice' },
    { value: 'Ministry of Environment', label: 'Ministry of Environment' }
];

const BUDGET_LINES = [
    { value: 'personnel', label: 'Personnel Costs' },
    { value: 'overhead', label: 'Overhead Costs' },
    { value: 'capital', label: 'Capital Expenditure' },
    { value: 'recurrent', label: 'Recurrent Expenditure' },
    { value: 'development', label: 'Development Projects' }
];

const ACCOUNT_CODES = [
    { value: '2101', label: '2101 - Basic Salary' },
    { value: '2102', label: '2102 - Allowances' },
    { value: '2201', label: '2201 - Office Supplies' },
    { value: '2202', label: '2202 - Equipment' },
    { value: '2301', label: '2301 - Travel Expenses' },
    { value: '2401', label: '2401 - Professional Services' }
];

export const EditPaymentRequestModal: React.FC<EditPaymentRequestModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    paymentRequest
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        requestType: '',
        projectTitle: '',
        description: '',
        justification: '',
        amount: '',
        priority: 'normal',
        requestDate: new Date().toISOString().split('T')[0],
        expectedDate: '',
        beneficiaryName: '',
        beneficiaryBank: '',
        beneficiaryAccount: '',
        beneficiaryPhone: '',
        beneficiaryEmail: '',
        department: '',
        budgetLine: '',
        accountCode: '',
        isEmergency: false,
        isBudgeted: false,
        attachments: [],
        comments: ''
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    const totalSteps = 4;

    // Initialize form data when payment request changes
    useEffect(() => {
        if (paymentRequest) {
            setFormData({
                requestType: paymentRequest.requestType || '',
                projectTitle: paymentRequest.projectTitle || '',
                description: paymentRequest.description || '',
                justification: paymentRequest.justification || '',
                amount: paymentRequest.amount?.toString() || '',
                priority: paymentRequest.priority || 'normal',
                requestDate: paymentRequest.requestDate || new Date().toISOString().split('T')[0],
                expectedDate: paymentRequest.expectedDate || '',
                beneficiaryName: paymentRequest.beneficiaryName || '',
                beneficiaryBank: paymentRequest.beneficiaryBank || '',
                beneficiaryAccount: paymentRequest.beneficiaryAccount || '',
                beneficiaryPhone: paymentRequest.beneficiaryPhone || '',
                beneficiaryEmail: paymentRequest.beneficiaryEmail || '',
                department: paymentRequest.departmentName || '',
                budgetLine: paymentRequest.budgetLine || '',
                accountCode: paymentRequest.accountCode || '',
                isEmergency: paymentRequest.isEmergency || false,
                isBudgeted: paymentRequest.isBudgeted || false,
                attachments: [],
                comments: paymentRequest.comments?.[0] || ''
            });
        }
    }, [paymentRequest]);

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<FormData> = {};

        switch (step) {
            case 1:
                if (!formData.requestType) newErrors.requestType = 'Request type is required';
                if (!formData.projectTitle) newErrors.projectTitle = 'Project title is required';
                if (!formData.description) newErrors.description = 'Description is required';
                if (!formData.justification) newErrors.justification = 'Justification is required';
                if (!formData.amount) newErrors.amount = 'Amount is required';
                if (!formData.expectedDate) newErrors.expectedDate = 'Expected date is required';
                break;
            case 2:
                if (!formData.beneficiaryName) newErrors.beneficiaryName = 'Beneficiary name is required';
                if (!formData.beneficiaryBank) newErrors.beneficiaryBank = 'Beneficiary bank is required';
                if (!formData.beneficiaryAccount) newErrors.beneficiaryAccount = 'Beneficiary account is required';
                if (!formData.beneficiaryPhone) newErrors.beneficiaryPhone = 'Beneficiary phone is required';
                if (!formData.beneficiaryEmail) newErrors.beneficiaryEmail = 'Beneficiary email is required';
                break;
            case 3:
                if (!formData.department) newErrors.department = 'Department is required';
                if (!formData.budgetLine) newErrors.budgetLine = 'Budget line is required';
                if (!formData.accountCode) newErrors.accountCode = 'Account code is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleInputChange = (field: keyof FormData, value: string | boolean | File[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        if (validateStep(currentStep)) {
            const submitData = {
                ...formData,
                id: paymentRequest.id,
                requestNumber: paymentRequest.requestNumber,
                status: paymentRequest.status,
                createdAt: paymentRequest.createdAt,
                progress: paymentRequest.progress,
                currentStage: paymentRequest.currentStage,
                workflowSteps: paymentRequest.workflowSteps || []
            };
            onSubmit(submitData);
            onClose();
        }
    };

    const getStepStatus = (step: number) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        return 'upcoming';
    };

    const getStepIcon = (step: number) => {
        const status = getStepStatus(step);
        if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-600" />;
        if (status === 'current') return <div className="h-5 w-5 rounded-full bg-blue-600" />;
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    };

    if (!isOpen || !paymentRequest) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Edit className="h-6 w-6 text-blue-600" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Edit Payment Request</h2>
                            <p className="text-gray-600">Update details for: {paymentRequest.projectTitle}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        {Array.from({ length: totalSteps }, (_, i) => (
                            <div key={i + 1} className="flex items-center gap-2">
                                {getStepIcon(i + 1)}
                                <span className={`text-sm font-medium ${
                                    getStepStatus(i + 1) === 'completed' ? 'text-green-600' :
                                    getStepStatus(i + 1) === 'current' ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                    {i === 0 && 'Basic Info'}
                                    {i === 1 && 'Beneficiary'}
                                    {i === 2 && 'Budget'}
                                    {i === 3 && 'Review'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                </div>

                {/* Step Content */}
                <div className="p-6">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="requestType">Request Type *</Label>
                                    <Select value={formData.requestType} onValueChange={(value) => handleInputChange('requestType', value)}>
                                        <SelectTrigger className={errors.requestType ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select request type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {REQUEST_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{type.label}</span>
                                                        <Badge variant="outline" className="text-xs">{type.category}</Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.requestType && <p className="text-sm text-red-500">{errors.requestType}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority *</Label>
                                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRIORITIES.map((priority) => (
                                                <SelectItem key={priority.value} value={priority.value}>
                                                    <Badge className={priority.color}>{priority.label}</Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectTitle">Project Title *</Label>
                                <Input
                                    id="projectTitle"
                                    value={formData.projectTitle}
                                    onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                                    placeholder="Enter project title"
                                    className={errors.projectTitle ? 'border-red-500' : ''}
                                />
                                {errors.projectTitle && <p className="text-sm text-red-500">{errors.projectTitle}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Provide a detailed description of the payment request"
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="justification">Justification *</Label>
                                <Textarea
                                    id="justification"
                                    value={formData.justification}
                                    onChange={(e) => handleInputChange('justification', e.target.value)}
                                    placeholder="Explain why this payment is necessary"
                                    rows={3}
                                    className={errors.justification ? 'border-red-500' : ''}
                                />
                                {errors.justification && <p className="text-sm text-red-500">{errors.justification}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (₦) *</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => handleInputChange('amount', e.target.value)}
                                            placeholder="0.00"
                                            className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expectedDate">Expected Date *</Label>
                                    <Input
                                        id="expectedDate"
                                        type="date"
                                        value={formData.expectedDate}
                                        onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                                        className={errors.expectedDate ? 'border-red-500' : ''}
                                    />
                                    {errors.expectedDate && <p className="text-sm text-red-500">{errors.expectedDate}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isEmergency"
                                    checked={formData.isEmergency}
                                    onCheckedChange={(checked) => handleInputChange('isEmergency', checked as boolean)}
                                />
                                <Label htmlFor="isEmergency">This is an emergency request</Label>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Beneficiary Information</h3>
                            
                            <div className="space-y-2">
                                <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
                                <Input
                                    id="beneficiaryName"
                                    value={formData.beneficiaryName}
                                    onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                                    placeholder="Enter beneficiary full name"
                                    className={errors.beneficiaryName ? 'border-red-500' : ''}
                                />
                                {errors.beneficiaryName && <p className="text-sm text-red-500">{errors.beneficiaryName}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryBank">Bank Name *</Label>
                                    <Input
                                        id="beneficiaryBank"
                                        value={formData.beneficiaryBank}
                                        onChange={(e) => handleInputChange('beneficiaryBank', e.target.value)}
                                        placeholder="Enter bank name"
                                        className={errors.beneficiaryBank ? 'border-red-500' : ''}
                                    />
                                    {errors.beneficiaryBank && <p className="text-sm text-red-500">{errors.beneficiaryBank}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryAccount">Account Number *</Label>
                                    <Input
                                        id="beneficiaryAccount"
                                        value={formData.beneficiaryAccount}
                                        onChange={(e) => handleInputChange('beneficiaryAccount', e.target.value)}
                                        placeholder="Enter account number"
                                        className={errors.beneficiaryAccount ? 'border-red-500' : ''}
                                    />
                                    {errors.beneficiaryAccount && <p className="text-sm text-red-500">{errors.beneficiaryAccount}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryPhone">Phone Number *</Label>
                                    <Input
                                        id="beneficiaryPhone"
                                        value={formData.beneficiaryPhone}
                                        onChange={(e) => handleInputChange('beneficiaryPhone', e.target.value)}
                                        placeholder="Enter phone number"
                                        className={errors.beneficiaryPhone ? 'border-red-500' : ''}
                                    />
                                    {errors.beneficiaryPhone && <p className="text-sm text-red-500">{errors.beneficiaryPhone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="beneficiaryEmail">Email Address *</Label>
                                    <Input
                                        id="beneficiaryEmail"
                                        type="email"
                                        value={formData.beneficiaryEmail}
                                        onChange={(e) => handleInputChange('beneficiaryEmail', e.target.value)}
                                        placeholder="Enter email address"
                                        className={errors.beneficiaryEmail ? 'border-red-500' : ''}
                                    />
                                    {errors.beneficiaryEmail && <p className="text-sm text-red-500">{errors.beneficiaryEmail}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Budget & Accounting</h3>
                            
                            <div className="space-y-2">
                                <Label htmlFor="department">Department *</Label>
                                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTMENTS.map((dept) => (
                                            <SelectItem key={dept.value} value={dept.value}>
                                                {dept.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="budgetLine">Budget Line *</Label>
                                    <Select value={formData.budgetLine} onValueChange={(value) => handleInputChange('budgetLine', value)}>
                                        <SelectTrigger className={errors.budgetLine ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select budget line" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BUDGET_LINES.map((line) => (
                                                <SelectItem key={line.value} value={line.value}>
                                                    {line.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.budgetLine && <p className="text-sm text-red-500">{errors.budgetLine}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accountCode">Account Code *</Label>
                                    <Select value={formData.accountCode} onValueChange={(value) => handleInputChange('accountCode', value)}>
                                        <SelectTrigger className={errors.accountCode ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select account code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ACCOUNT_CODES.map((code) => (
                                                <SelectItem key={code.value} value={code.value}>
                                                    {code.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.accountCode && <p className="text-sm text-red-500">{errors.accountCode}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isBudgeted"
                                    checked={formData.isBudgeted}
                                    onCheckedChange={(checked) => handleInputChange('isBudgeted', checked as boolean)}
                                />
                                <Label htmlFor="isBudgeted">This request is budgeted</Label>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Review & Update</h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Type:</span> {formData.requestType}</div>
                                        <div><span className="font-medium">Title:</span> {formData.projectTitle}</div>
                                        <div><span className="font-medium">Priority:</span> 
                                            <Badge className={PRIORITIES.find(p => p.value === formData.priority)?.color}>
                                                {formData.priority}
                                            </Badge>
                                        </div>
                                        <div><span className="font-medium">Amount:</span> ₦{formData.amount}</div>
                                        <div><span className="font-medium">Expected Date:</span> {formData.expectedDate}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Beneficiary Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Name:</span> {formData.beneficiaryName}</div>
                                        <div><span className="font-medium">Bank:</span> {formData.beneficiaryBank}</div>
                                        <div><span className="font-medium">Account:</span> {formData.beneficiaryAccount}</div>
                                        <div><span className="font-medium">Phone:</span> {formData.beneficiaryPhone}</div>
                                        <div><span className="font-medium">Email:</span> {formData.beneficiaryEmail}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Additional Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Department:</span> {formData.department}</div>
                                    <div><span className="font-medium">Budget Line:</span> {formData.budgetLine}</div>
                                    <div><span className="font-medium">Account Code:</span> {formData.accountCode}</div>
                                    <div><span className="font-medium">Emergency:</span> {formData.isEmergency ? 'Yes' : 'No'}</div>
                                    <div><span className="font-medium">Budgeted:</span> {formData.isBudgeted ? 'Yes' : 'No'}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comments">Additional Comments</Label>
                                <Textarea
                                    id="comments"
                                    value={formData.comments}
                                    onChange={(e) => handleInputChange('comments', e.target.value)}
                                    placeholder="Add any additional comments or notes"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Attachments</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                                        <span className="text-gray-500"> or drag and drop</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, XLS up to 10MB</p>
                                </div>
                                
                                {formData.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Uploaded Files:</p>
                                        {formData.attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-sm">{file.name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeAttachment(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        {currentStep > 1 && (
                            <Button variant="outline" onClick={handlePrevious}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        
                        {currentStep < totalSteps ? (
                            <Button onClick={handleNext}>
                                Next
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                                <Save className="h-4 w-4 mr-2" />
                                Update Request
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
