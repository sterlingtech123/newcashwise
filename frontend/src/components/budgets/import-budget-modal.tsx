'use client';

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Upload, 
    FileText, 
    CheckCircle, 
    AlertCircle, 
    XCircle, 
    Download,
    Eye,
    MapPin,
    Settings,
    RefreshCw,
    Save,
    Trash2,
    Calendar,
    Building2,
    Calculator,
    Target
} from 'lucide-react';

interface ImportBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any) => void;
}

interface FileData {
    name: string;
    size: number;
    type: string;
    content?: any[];
    errors?: string[];
    warnings?: string[];
}

interface ColumnMapping {
    [key: string]: string;
}

interface ImportSettings {
    dataType: 'budget_cycle' | 'economic_head' | 'economic_line_item' | 'budget_allocation';
    budgetCycle?: string;
    mda?: string;
    overwriteExisting: boolean;
    createMissing: boolean;
    validateOnly: boolean;
    updateExisting: boolean;
}

interface ValidationResult {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    errors: Array<{ row: number; column: string; message: string; value?: any }>;
    warnings: Array<{ row: number; column: string; message: string; value?: any }>;
    summary: {
        cyclesCreated: number;
        headsCreated: number;
        lineItemsCreated: number;
        allocationsCreated: number;
        existingUpdated: number;
    };
}

export function ImportBudgetModal({ isOpen, onClose, onImport }: ImportBudgetModalProps) {
    const [activeTab, setActiveTab] = useState('upload');
    const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
    const [validationResults, setValidationResults] = useState<ValidationResult | null>(null);
    const [importSettings, setImportSettings] = useState<ImportSettings>({
        dataType: 'economic_line_item',
        budgetCycle: '2025',
        mda: 'all',
        overwriteExisting: false,
        createMissing: true,
        validateOnly: false,
        updateExisting: true
    });

    // Sample data for dropdowns
    const budgetCycles = ['2024', '2025', '2026'];
    const mdas = [
        'Ministry of Health',
        'Ministry of Education', 
        'Ministry of Works',
        'Ministry of Agriculture',
        'Ministry of Finance',
        'Ministry of Transportation',
        'Ministry of Environment',
        'Ministry of Information'
    ];

    const dataTypes = [
        { value: 'budget_cycle', label: 'Budget Cycles', icon: Calendar, description: 'Import fiscal year cycles and periods' },
        { value: 'economic_head', label: 'Economic Heads', icon: Building2, description: 'Import budget categories and classifications' },
        { value: 'economic_line_item', label: 'Economic Line Items', icon: Calculator, description: 'Import detailed budget line items' },
        { value: 'budget_allocation', label: 'Budget Allocations', icon: Target, description: 'Import budget amounts and allocations' }
    ];

    const getColumnOptions = (dataType: string) => {
        switch (dataType) {
            case 'budget_cycle':
                return [
                    { value: 'cycle_name', label: 'Cycle Name' },
                    { value: 'fiscal_year', label: 'Fiscal Year' },
                    { value: 'start_date', label: 'Start Date' },
                    { value: 'end_date', label: 'End Date' },
                    { value: 'status', label: 'Status' },
                    { value: 'description', label: 'Description' }
                ];
            case 'economic_head':
                return [
                    { value: 'head_name', label: 'Head Name' },
                    { value: 'head_code', label: 'Head Code' },
                    { value: 'mda', label: 'MDA' },
                    { value: 'category', label: 'Category' },
                    { value: 'priority', label: 'Priority' },
                    { value: 'description', label: 'Description' }
                ];
            case 'economic_line_item':
                return [
                    { value: 'line_name', label: 'Line Item Name' },
                    { value: 'line_code', label: 'Line Item Code' },
                    { value: 'economic_head', label: 'Economic Head' },
                    { value: 'mda', label: 'MDA' },
                    { value: 'category', label: 'Category' },
                    { value: 'unit_cost', label: 'Unit Cost' },
                    { value: 'quantity', label: 'Quantity' },
                    { value: 'total_amount', label: 'Total Amount' },
                    { value: 'priority', label: 'Priority' },
                    { value: 'description', label: 'Description' }
                ];
            case 'budget_allocation':
                return [
                    { value: 'line_item', label: 'Line Item' },
                    { value: 'economic_head', label: 'Economic Head' },
                    { value: 'mda', label: 'MDA' },
                    { value: 'budget_cycle', label: 'Budget Cycle' },
                    { value: 'allocated_amount', label: 'Allocated Amount' },
                    { value: 'utilized_amount', label: 'Utilized Amount' },
                    { value: 'remaining_amount', label: 'Remaining Amount' },
                    { value: 'allocation_date', label: 'Allocation Date' }
                ];
            default:
                return [];
        }
    };

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
            alert('Please upload a CSV or Excel file');
            return;
        }

        const fileData: FileData = {
            name: file.name,
            size: file.size,
            type: file.type
        };

        setUploadedFile(fileData);
        setActiveTab('mapping');
        
        // Simulate file processing
        setIsProcessing(true);
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsProcessing(false);
                    
                    // Generate sample data based on selected data type
                    fileData.content = generateSampleData(importSettings.dataType);
                    return 100;
                }
                return prev + 20;
            });
        }, 200);
    }, [importSettings.dataType]);

    const generateSampleData = (dataType: string) => {
        switch (dataType) {
            case 'budget_cycle':
                return [
                    { 'Cycle Name': 'Q1 2025', 'Fiscal Year': '2025', 'Start Date': '2025-01-01', 'End Date': '2025-03-31', 'Status': 'Active', 'Description': 'First Quarter Budget Cycle' },
                    { 'Cycle Name': 'Q2 2025', 'Fiscal Year': '2025', 'Start Date': '2025-04-01', 'End Date': '2025-06-30', 'Status': 'Planning', 'Description': 'Second Quarter Budget Cycle' }
                ];
            case 'economic_head':
                return [
                    { 'Head Name': 'Healthcare Equipment', 'Head Code': 'HE001', 'MDA': 'Ministry of Health', 'Category': 'Medical Supplies', 'Priority': 'High', 'Description': 'Medical equipment and supplies' },
                    { 'Head Name': 'School Infrastructure', 'Head Code': 'SI001', 'MDA': 'Ministry of Education', 'Category': 'Infrastructure', 'Priority': 'Medium', 'Description': 'School building and facilities' }
                ];
            case 'economic_line_item':
                return [
                    { 'Line Item Name': 'Hospital Beds', 'Line Code': 'LI001', 'Economic Head': 'Healthcare Equipment', 'MDA': 'Ministry of Health', 'Category': 'Medical Supplies', 'Unit Cost': '₦500,000', 'Quantity': '50', 'Total Amount': '₦25,000,000', 'Priority': 'High', 'Description': 'Standard hospital beds' },
                    { 'Line Item Name': 'Classroom Chairs', 'Line Code': 'LI002', 'Economic Head': 'School Infrastructure', 'MDA': 'Ministry of Education', 'Category': 'Furniture', 'Unit Cost': '₦15,000', 'Quantity': '200', 'Total Amount': '₦3,000,000', 'Priority': 'Medium', 'Description': 'Student classroom chairs' }
                ];
            case 'budget_allocation':
                return [
                    { 'Line Item': 'Hospital Beds', 'Economic Head': 'Healthcare Equipment', 'MDA': 'Ministry of Health', 'Budget Cycle': 'Q1 2025', 'Allocated Amount': '₦25,000,000', 'Utilized Amount': '₦0', 'Remaining Amount': '₦25,000,000', 'Allocation Date': '2025-01-15' },
                    { 'Line Item': 'Classroom Chairs', 'Economic Head': 'School Infrastructure', 'MDA': 'Ministry of Education', 'Budget Cycle': 'Q1 2025', 'Allocated Amount': '₦3,000,000', 'Utilized Amount': '₦0', 'Remaining Amount': '₦3,000,000', 'Allocation Date': '2025-01-15' }
                ];
            default:
                return [];
        }
    };

    const handleColumnMapping = (fileColumn: string, targetColumn: string) => {
        setColumnMapping(prev => ({
            ...prev,
            [fileColumn]: targetColumn
        }));
    };

    const validateData = (data: any[], dataType: string): ValidationResult => {
        const errors: Array<{ row: number; column: string; message: string; value?: any }> = [];
        const warnings: Array<{ row: number; column: string; message: string; value?: any }> = [];
        let validRows = 0;

        data.forEach((row, index) => {
            let rowValid = true;
            const rowNumber = index + 1;

            // Validate required fields based on data type
            switch (dataType) {
                case 'budget_cycle':
                    if (!row['Cycle Name'] || !row['Fiscal Year']) {
                        errors.push({ row: rowNumber, column: 'Required Fields', message: 'Cycle Name and Fiscal Year are required', value: row });
                        rowValid = false;
                    }
                    if (row['Start Date'] && !isValidDate(row['Start Date'])) {
                        errors.push({ row: rowNumber, column: 'Start Date', message: 'Invalid date format (YYYY-MM-DD)', value: row['Start Date'] });
                        rowValid = false;
                    }
                    break;
                case 'economic_head':
                    if (!row['Head Name'] || !row['MDA']) {
                        errors.push({ row: rowNumber, column: 'Required Fields', message: 'Head Name and MDA are required', value: row });
                        rowValid = false;
                    }
                    if (!mdas.includes(row['MDA'])) {
                        warnings.push({ row: rowNumber, column: 'MDA', message: 'MDA not in standard list', value: row['MDA'] });
                    }
                    break;
                case 'economic_line_item':
                    if (!row['Line Item Name'] || !row['Economic Head'] || !row['MDA']) {
                        errors.push({ row: rowNumber, column: 'Required Fields', message: 'Line Item Name, Economic Head, and MDA are required', value: row });
                        rowValid = false;
                    }
                    if (row['Total Amount'] && !isValidAmount(row['Total Amount'])) {
                        errors.push({ row: rowNumber, column: 'Total Amount', message: 'Invalid amount format', value: row['Total Amount'] });
                        rowValid = false;
                    }
                    break;
                case 'budget_allocation':
                    if (!row['Line Item'] || !row['Budget Cycle'] || !row['Allocated Amount']) {
                        errors.push({ row: rowNumber, column: 'Required Fields', message: 'Line Item, Budget Cycle, and Allocated Amount are required', value: row });
                        rowValid = false;
                    }
                    if (row['Allocated Amount'] && !isValidAmount(row['Allocated Amount'])) {
                        errors.push({ row: rowNumber, column: 'Allocated Amount', message: 'Invalid amount format', value: row['Allocated Amount'] });
                        rowValid = false;
                    }
                    break;
            }

            if (rowValid) validRows++;
        });

        return {
            totalRows: data.length,
            validRows,
            invalidRows: data.length - validRows,
            errors,
            warnings,
            summary: {
                cyclesCreated: dataType === 'budget_cycle' ? validRows : 0,
                headsCreated: dataType === 'economic_head' ? validRows : 0,
                lineItemsCreated: dataType === 'economic_line_item' ? validRows : 0,
                allocationsCreated: dataType === 'budget_allocation' ? validRows : 0,
                existingUpdated: 0
            }
        };
    };

    const isValidDate = (dateString: string): boolean => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    };

    const isValidAmount = (amount: string): boolean => {
        // Check if amount is in Nigerian Naira format (₦X,XXX,XXX.XX)
        const amountRegex = /^₦?[\d,]+(\.\d{2})?$/;
        return amountRegex.test(amount);
    };

    const handleValidation = () => {
        if (!uploadedFile?.content) return;

        setIsProcessing(true);
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(prev);
                    setIsProcessing(false);
                    
                    const results = validateData(uploadedFile.content!, importSettings.dataType);
                    setValidationResults(results);
                    setActiveTab('validation');
                    return 100;
                }
                return prev + 25;
            });
        }, 150);
    };

    const handleImport = () => {
        if (!validationResults) return;

        setIsProcessing(true);
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(prev);
                    setIsProcessing(false);
                    
                    // Simulate import completion
                    setTimeout(() => {
                        onImport({
                            file: uploadedFile,
                            mapping: columnMapping,
                            results: validationResults,
                            settings: importSettings,
                            dataType: importSettings.dataType
                        });
                        onClose();
                    }, 1000);
                    
                    return 100;
                }
                return prev + 20;
            });
        }, 200);
    };

    const resetImport = () => {
        setUploadedFile(null);
        setColumnMapping({});
        setValidationResults(null);
        setProgress(0);
        setActiveTab('upload');
    };

    const downloadTemplate = () => {
        let template = '';
        let filename = '';

        switch (importSettings.dataType) {
            case 'budget_cycle':
                template = `Cycle Name,Fiscal Year,Start Date,End Date,Status,Description
Q1 2025,2025,2025-01-01,2025-03-31,Active,First Quarter Budget Cycle
Q2 2025,2025,2025-04-01,2025-06-30,Planning,Second Quarter Budget Cycle`;
                filename = 'budget_cycle_template.csv';
                break;
            case 'economic_head':
                template = `Head Name,Head Code,MDA,Category,Priority,Description
Healthcare Equipment,HE001,Ministry of Health,Medical Supplies,High,Medical equipment and supplies
School Infrastructure,SI001,Ministry of Education,Infrastructure,Medium,School building and facilities`;
                filename = 'economic_head_template.csv';
                break;
            case 'economic_line_item':
                template = `Line Item Name,Line Code,Economic Head,MDA,Category,Unit Cost,Quantity,Total Amount,Priority,Description
Hospital Beds,LI001,Healthcare Equipment,Ministry of Health,Medical Supplies,₦500,000,50,₦25,000,000,High,Standard hospital beds
Classroom Chairs,LI002,School Infrastructure,Ministry of Education,Furniture,₦15,000,200,₦3,000,000,Medium,Student classroom chairs`;
                filename = 'economic_line_item_template.csv';
                break;
            case 'budget_allocation':
                template = `Line Item,Economic Head,MDA,Budget Cycle,Allocated Amount,Utilized Amount,Remaining Amount,Allocation Date
Hospital Beds,Healthcare Equipment,Ministry of Health,Q1 2025,₦25,000,000,₦0,₦25,000,000,2025-01-15
Classroom Chairs,School Infrastructure,Ministry of Education,Q1 2025,₦3,000,000,₦0,₦3,000,000,2025-01-15`;
                filename = 'budget_allocation_template.csv';
                break;
        }
        
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleDataTypeChange = (dataType: string) => {
        setImportSettings(prev => ({ ...prev, dataType: dataType as any }));
        setColumnMapping({});
        setUploadedFile(null);
        setValidationResults(null);
        setActiveTab('upload');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Import Budget Data
                    </DialogTitle>
                    <DialogDescription>
                        Upload and import different types of budget data including Budget Cycles, Economic Heads, Economic Line Items, and Budget Allocations.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                        <TabsTrigger value="mapping" disabled={!uploadedFile}>Column Mapping</TabsTrigger>
                        <TabsTrigger value="validation" disabled={!uploadedFile}>Validation</TabsTrigger>
                        <TabsTrigger value="import" disabled={!validationResults}>Import</TabsTrigger>
                    </TabsList>

                    {/* Upload Tab */}
                    <TabsContent value="upload" className="space-y-6">
                        {/* Data Type Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Select Data Type to Import
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {dataTypes.map((type) => {
                                        const IconComponent = type.icon;
                                        return (
                                            <div
                                                key={type.value}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    importSettings.dataType === type.value
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handleDataTypeChange(type.value)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <IconComponent className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{type.label}</h4>
                                                        <p className="text-sm text-gray-600">{type.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* File Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    File Upload - {dataTypes.find(t => t.value === importSettings.dataType)?.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <Label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="text-lg font-medium text-gray-900">
                                            Click to upload or drag and drop
                                        </span>
                                        <p className="text-sm text-gray-500 mt-2">
                                            CSV, XLSX, or XLS files up to 10MB
                                        </p>
                                    </Label>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <Button variant="outline" onClick={downloadTemplate}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download {dataTypes.find(t => t.value === importSettings.dataType)?.label} Template
                                    </Button>
                                    <div className="text-sm text-gray-500">
                                        Supported formats: CSV, XLSX, XLS
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Column Mapping Tab */}
                    <TabsContent value="mapping" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Column Mapping - {dataTypes.find(t => t.value === importSettings.dataType)?.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {uploadedFile?.content && (
                                    <div className="space-y-4">
                                        <div className="text-sm text-gray-600">
                                            Map your file columns to the correct budget fields:
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.keys(uploadedFile.content[0]).map((column) => (
                                                <div key={column} className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        File Column: <span className="font-bold">{column}</span>
                                                    </Label>
                                                    <Select
                                                        value={columnMapping[column] || ''}
                                                        onValueChange={(value) => handleColumnMapping(column, value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select target field" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {getColumnOptions(importSettings.dataType).map(option => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                            <SelectItem value="skip">Skip Column</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between pt-4">
                                            <Button variant="outline" onClick={() => setActiveTab('upload')}>
                                                Back
                                            </Button>
                                            <Button onClick={handleValidation}>
                                                Validate Data
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Validation Tab */}
                    <TabsContent value="validation" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Data Validation Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {validationResults && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {validationResults.validRows}
                                                </div>
                                                <div className="text-sm text-green-600">Valid Rows</div>
                                            </div>
                                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {validationResults.invalidRows}
                                                </div>
                                                <div className="text-sm text-red-600">Invalid Rows</div>
                                            </div>
                                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {validationResults.totalRows}
                                                </div>
                                                <div className="text-sm text-blue-600">Total Rows</div>
                                            </div>
                                        </div>

                                        {/* Import Summary */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-700 mb-2">Import Summary:</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                {validationResults.summary.cyclesCreated > 0 && (
                                                    <div>Budget Cycles: <span className="font-semibold">{validationResults.summary.cyclesCreated}</span></div>
                                                )}
                                                {validationResults.summary.headsCreated > 0 && (
                                                    <div>Economic Heads: <span className="font-semibold">{validationResults.summary.headsCreated}</span></div>
                                                )}
                                                {validationResults.summary.lineItemsCreated > 0 && (
                                                    <div>Line Items: <span className="font-semibold">{validationResults.summary.lineItemsCreated}</span></div>
                                                )}
                                                {validationResults.summary.allocationsCreated > 0 && (
                                                    <div>Budget Allocations: <span className="font-semibold">{validationResults.summary.allocationsCreated}</span></div>
                                                )}
                                            </div>
                                        </div>

                                        {validationResults.errors.length > 0 && (
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-red-600">
                                                    Errors Found:
                                                </Label>
                                                {validationResults.errors.map((error, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                        Row {error.row}: {error.column} - {error.message}
                                                        {error.value && <span className="text-gray-500">({error.value})</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {validationResults.warnings.length > 0 && (
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-yellow-600">
                                                    Warnings:
                                                </Label>
                                                {validationResults.warnings.map((warning, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded text-sm">
                                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                        Row {warning.row}: {warning.column} - {warning.message}
                                                        {warning.value && <span className="text-gray-500">({warning.value})</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between pt-4">
                                            <Button variant="outline" onClick={() => setActiveTab('mapping')}>
                                                Back
                                            </Button>
                                            <Button 
                                                onClick={() => setActiveTab('import')}
                                                disabled={validationResults.invalidRows > 0}
                                            >
                                                Continue to Import
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Import Tab */}
                    <TabsContent value="import" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Import Settings - {dataTypes.find(t => t.value === importSettings.dataType)?.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Budget Cycle</Label>
                                        <Select
                                            value={importSettings.budgetCycle}
                                            onValueChange={(value) => setImportSettings(prev => ({ ...prev, budgetCycle: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {budgetCycles.map(cycle => (
                                                    <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>MDA</Label>
                                        <Select
                                            value={importSettings.mda}
                                            onValueChange={(value) => setImportSettings(prev => ({ ...prev, mda: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All MDAs</SelectItem>
                                                {mdas.map(mda => (
                                                    <SelectItem key={mda} value={mda}>{mda}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="overwrite"
                                            checked={importSettings.overwriteExisting}
                                            onChange={(e) => setImportSettings(prev => ({ ...prev, overwriteExisting: e.target.checked }))}
                                        />
                                        <Label htmlFor="overwrite">Overwrite existing records</Label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="createMissing"
                                            checked={importSettings.createMissing}
                                            onChange={(e) => setImportSettings(prev => ({ ...prev, createMissing: e.target.checked }))}
                                        />
                                        <Label htmlFor="createMissing">Create missing MDAs and categories</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="updateExisting"
                                            checked={importSettings.updateExisting}
                                            onChange={(e) => setImportSettings(prev => ({ ...prev, updateExisting: e.target.checked }))}
                                        />
                                        <Label htmlFor="updateExisting">Update existing records</Label>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={() => setActiveTab('validation')}>
                                        Back
                                    </Button>
                                    <Button onClick={handleImport} disabled={isProcessing}>
                                        {isProcessing ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Importing...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Import {dataTypes.find(t => t.value === importSettings.dataType)?.label}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Progress Bar */}
                {isProcessing && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Processing...</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-between pt-4 border-t">
                    <Button variant="outline" onClick={resetImport}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Import
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
