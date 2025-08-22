'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Copy,
    FileText,
    Trash2,
    ChevronDown,
    ChevronRight,
    Building2,
    Calculator,
    TrendingUp,
    Calendar,
    DollarSign
} from 'lucide-react';

// Import modal components
import { CreateEconomicCycleModal } from '@/components/budgets/create-economic-cycle-modal';
import { CreateEconomicHeadModal } from '@/components/budgets/create-economic-head-modal';
import { CreateEconomicLineItemModal } from '@/components/budgets/create-economic-line-item-modal';
import {
    ViewDetailsModal,
    EditModal,
    AdjustBudgetModal,
    DuplicateModal,
    GenerateReportModal
} from '@/components/budgets/economic-head-action-modals';

interface EconomicCycle {
    id: string;
    name: string;
    fiscalYear: string;
    status: 'active' | 'draft' | 'closed';
    totalAllocated: number;
    totalUtilized: number;
    totalAvailable: number;
    utilizationRate: number;
    startDate: string;
    endDate: string;
}

interface EconomicHead {
    id: string;
    cycleId: string;
    mda: string;
    mdaCode: string;
    category: string;
    budgetCycle: string;
    allocatedAmount: number;
    utilizedAmount: number;
    availableAmount: number;
    utilization: number;
    economicHead: string;
    economicCode: string;
    functionCode: string;
    fundCode: string;
    description: string;
    status: 'active' | 'suspended' | 'closed';
    createdAt: string;
}

interface EconomicLineItem {
    id: string;
    economicHeadId: string;
    budgetCycle: string;
    mda: string;
    organizationCode: string;
    economicHead: string;
    economicLineItem: string;
    category: string;
    allocationAmount: number;
    description: string;
    economicCode: string;
    functionCode: string;
    fundCode: string;
    status: 'active' | 'draft' | 'suspended';
    createdAt: string;
}

export default function EconomicHeadsPage() {
    const [cycles, setCycles] = useState<EconomicCycle[]>([]);
    const [economicHeads, setEconomicHeads] = useState<EconomicHead[]>([]);
    const [lineItems, setLineItems] = useState<EconomicLineItem[]>([]);
    const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set());
    const [expandedHeads, setExpandedHeads] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterMDA, setFilterMDA] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Modal states
    const [showCreateCycleModal, setShowCreateCycleModal] = useState(false);
    const [showCreateHeadModal, setShowCreateHeadModal] = useState(false);
    const [showCreateLineItemModal, setShowCreateLineItemModal] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<EconomicCycle | null>(null);
    const [selectedHead, setSelectedHead] = useState<EconomicHead | null>(null);
    const [selectedLineItem, setSelectedLineItem] = useState<EconomicLineItem | null>(null);

    // Action modal states
    const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAdjustBudgetModal, setShowAdjustBudgetModal] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);

    // Mock data - replace with API calls
    useEffect(() => {
        // Mock Economic Cycles
        const mockCycles: EconomicCycle[] = [
            {
                id: '1',
                name: '2024 Recurrent Budget Cycle',
                fiscalYear: '2024',
                status: 'active',
                totalAllocated: 250000000000,
                totalUtilized: 187500000000,
                totalAvailable: 62500000000,
                utilizationRate: 75,
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            }
        ];

        // Mock Economic Heads
        const mockHeads: EconomicHead[] = [
            {
                id: '1',
                cycleId: '1',
                mda: 'Ministry of Health',
                mdaCode: 'MOH001',
                category: 'Recurrent',
                budgetCycle: '2024 Recurrent Budget Cycle',
                allocatedAmount: 50000000000,
                utilizedAmount: 37500000000,
                availableAmount: 12500000000,
                utilization: 75,
                economicHead: 'Personnel Emoluments',
                economicCode: 'EC001',
                functionCode: 'FC001',
                fundCode: 'FC001',
                description: 'Salaries and wages for ministry staff',
                status: 'active',
                createdAt: '2024-01-01'
            }
        ];

        // Mock Line Items
        const mockLineItems: EconomicLineItem[] = [
            {
                id: '1',
                economicHeadId: '1',
                budgetCycle: '2024 Recurrent Budget Cycle',
                mda: 'Ministry of Health',
                organizationCode: 'ORG001',
                economicHead: 'Personnel Emoluments',
                economicLineItem: 'Basic Salary',
                category: 'Recurrent',
                allocationAmount: 30000000000,
                description: 'Basic salary for ministry staff',
                economicCode: 'EC001',
                functionCode: 'FC001',
                fundCode: 'FC001',
                status: 'active',
                createdAt: '2024-01-01'
            }
        ];

        setCycles(mockCycles);
        setEconomicHeads(mockHeads);
        setLineItems(mockLineItems);
    }, []);

    // Mock data for dropdowns
    const mdas = ['Ministry of Health', 'Ministry of Works', 'Ministry of Finance'];
    const organizationCodes = ['ORG001', 'ORG002', 'ORG003'];
    const categories = ['Recurrent', 'Capital', 'Development'];
    const economicCodes = ['EC001', 'EC002', 'EC003'];
    const functionCodes = ['FC001', 'FC002', 'FC003'];
    const fundCodes = ['FC001', 'FC002', 'FC003'];

    const toggleCycleExpansion = (cycleId: string) => {
        const newExpanded = new Set(expandedCycles);
        if (newExpanded.has(cycleId)) {
            newExpanded.delete(cycleId);
        } else {
            newExpanded.add(cycleId);
        }
        setExpandedCycles(newExpanded);
    };

    const toggleHeadExpansion = (headId: string) => {
        const newExpanded = new Set(expandedHeads);
        if (newExpanded.has(headId)) {
            newExpanded.delete(headId);
        } else {
            newExpanded.add(headId);
        }
        setExpandedHeads(newExpanded);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-blue-100 text-blue-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            case 'suspended': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Modal handlers
    const handleCreateCycle = (data: any) => {
        const newCycle: EconomicCycle = {
            id: Date.now().toString(),
            name: data.name,
            fiscalYear: data.fiscalYear,
            status: 'draft',
            totalAllocated: data.totalBudget,
            totalUtilized: 0,
            totalAvailable: data.totalBudget,
            utilizationRate: 0,
            startDate: data.startDate,
            endDate: data.endDate
        };
        setCycles(prev => [...prev, newCycle]);
    };

    const handleCreateHead = (data: any) => {
        const newHead: EconomicHead = {
            id: Date.now().toString(),
            cycleId: data.cycleId,
            mda: data.mda,
            mdaCode: data.mdaCode,
            category: data.category,
            budgetCycle: data.budgetCycle,
            allocatedAmount: data.allocatedAmount,
            utilizedAmount: 0,
            availableAmount: data.allocatedAmount,
            utilization: 0,
            economicHead: data.economicHead,
            economicCode: data.economicCode,
            functionCode: data.functionCode,
            fundCode: data.fundCode,
            description: data.description,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
        };
        setEconomicHeads(prev => [...prev, newHead]);
    };

    const handleCreateLineItem = (data: any) => {
        const newLineItem: EconomicLineItem = {
            id: Date.now().toString(),
            economicHeadId: data.economicHeadId,
            budgetCycle: data.budgetCycle,
            mda: data.mda,
            organizationCode: data.organizationCode,
            economicHead: data.economicHead,
            economicLineItem: data.economicLineItem,
            category: data.category,
            allocationAmount: data.allocationAmount,
            description: data.description,
            economicCode: data.economicCode,
            functionCode: data.functionCode,
            fundCode: data.fundCode,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
        };
        setLineItems(prev => [...prev, newLineItem]);
    };

    // Action handlers
    const handleViewDetails = (head: EconomicHead) => {
        setSelectedHead(head);
        setShowViewDetailsModal(true);
    };

    const handleEdit = (head: EconomicHead) => {
        setSelectedHead(head);
        setShowEditModal(true);
    };

    const handleAdjustBudget = (head: EconomicHead) => {
        setSelectedHead(head);
        setShowAdjustBudgetModal(true);
    };

    const handleDuplicate = (head: EconomicHead) => {
        setSelectedHead(head);
        setShowDuplicateModal(true);
    };

    const handleGenerateReport = (head: EconomicHead) => {
        setSelectedHead(head);
        setShowGenerateReportModal(true);
    };

    const handleUpdateHead = (updatedHead: any) => {
        setEconomicHeads(prev => prev.map(h => h.id === updatedHead.id ? updatedHead : h));
        setShowEditModal(false);
        setSelectedHead(null);
    };

    const handleBudgetAdjustment = (adjustedHead: any) => {
        setEconomicHeads(prev => prev.map(h => h.id === adjustedHead.id ? adjustedHead : h));
        setShowAdjustBudgetModal(false);
        setSelectedHead(null);
    };

    const handleDuplicateHead = (duplicatedHead: any) => {
        const newHead: EconomicHead = {
            ...duplicatedHead,
            id: Date.now().toString(),
            economicHead: duplicatedHead.name,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setEconomicHeads(prev => [...prev, newHead]);
        setShowDuplicateModal(false);
        setSelectedHead(null);
    };

    const handleGenerateReportAction = (reportData: any) => {
        console.log('Generating report:', reportData);
        // Implement report generation logic
        setShowGenerateReportModal(false);
        setSelectedHead(null);
    };

    const filteredCycles = cycles.filter(cycle => {
        const matchesSearch = cycle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cycle.fiscalYear.includes(searchQuery);
        const matchesCategory = filterCategory === 'all' || cycle.status === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Economic Heads Management</h1>
                    <p className="text-gray-600 mt-2">Manage recurrent budget economic heads and line items</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button onClick={() => setShowCreateCycleModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Economic Cycle
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <div className="relative mt-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Search cycles, heads, or items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="mda">MDA</Label>
                            <Select value={filterMDA} onValueChange={setFilterMDA}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="All MDAs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All MDAs</SelectItem>
                                    <SelectItem value="EDU">Ministry of Education</SelectItem>
                                    <SelectItem value="HLT">Ministry of Health</SelectItem>
                                    <SelectItem value="INF">Ministry of Infrastructure</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Economic Cycles List */}
            <div className="space-y-4">
                {filteredCycles.map((cycle) => (
                    <Card key={cycle.id} className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleCycleExpansion(cycle.id)}
                                        className="p-1"
                                    >
                                        {expandedCycles.has(cycle.id) ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-purple-600" />
                                            {cycle.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <span>Fiscal Year: {cycle.fiscalYear}</span>
                                            <span>•</span>
                                            <span>{cycle.startDate} - {cycle.endDate}</span>
                                            <span>•</span>
                                            <Badge className={getStatusColor(cycle.status)}>
                                                {cycle.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Total Allocated</div>
                                        <div className="text-lg font-semibold text-green-600">
                                            {formatCurrency(cycle.totalAllocated)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Utilization</div>
                                        <div className="text-lg font-semibold text-blue-600">
                                            {cycle.utilizationRate}%
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Available</div>
                                        <div className="text-lg font-semibold text-orange-600">
                                            {formatCurrency(cycle.totalAvailable)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Economic Heads under this cycle */}
                        {expandedCycles.has(cycle.id) && (
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Economic Heads
                                        </h4>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedCycle(cycle);
                                                setShowCreateHeadModal(true);
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Economic Head
                                        </Button>
                                    </div>

                                    {economicHeads
                                        .filter(head => head.cycleId === cycle.id)
                                        .map((head) => (
                                            <Card key={head.id} className="border-l-4 border-l-blue-500 ml-6">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleHeadExpansion(head.id)}
                                                                className="p-1"
                                                            >
                                                                {expandedHeads.has(head.id) ? (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronRight className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <div>
                                                                <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                                    <Calculator className="h-4 w-4 text-blue-600" />
                                                                    {head.economicHead} ({head.economicCode})
                                                                </div>
                                                                <div className="text-sm text-gray-600 mt-1">
                                                                    {head.mda} • {head.category} • {head.budgetCycle}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-600">Allocated</div>
                                                                <div className="font-semibold text-green-600">
                                                                    {formatCurrency(head.allocatedAmount)}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-600">Utilized</div>
                                                                <div className="font-semibold text-blue-600">
                                                                    {formatCurrency(head.utilizedAmount)}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-600">Available</div>
                                                                <div className="font-semibold text-orange-600">
                                                                    {formatCurrency(head.availableAmount)}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-gray-600">Utilization</div>
                                                                <div className="font-semibold text-purple-600">
                                                                    {head.utilization}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                {/* Economic Line Items under this head */}
                                                {expandedHeads.has(head.id) && (
                                                    <CardContent className="pt-0">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="font-medium text-gray-700 flex items-center gap-2">
                                                                    <TrendingUp className="h-4 w-4" />
                                                                    Economic Line Items
                                                                </h5>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSelectedHead(head);
                                                                        setShowCreateLineItemModal(true);
                                                                    }}
                                                                >
                                                                    <Plus className="h-4 w-4 mr-2" />
                                                                    Add Line Item
                                                                </Button>
                                                            </div>

                                                            {lineItems
                                                                .filter(item => item.economicHeadId === head.id)
                                                                .map((lineItem) => (
                                                                    <Card key={lineItem.id} className="border border-gray-200 ml-6">
                                                                        <CardContent className="py-3">
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <div className="font-medium text-gray-900">
                                                                                        {lineItem.economicLineItem}
                                                                                    </div>
                                                                                    <div className="text-sm text-gray-600 mt-1">
                                                                                        {lineItem.description}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                                        {lineItem.organizationCode} • {lineItem.functionCode} • {lineItem.fundCode}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                    <div className="text-right">
                                                                                        <div className="text-sm text-gray-600">Allocation</div>
                                                                                        <div className="font-semibold text-green-600">
                                                                                            {formatCurrency(lineItem.allocationAmount)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Button size="sm" variant="ghost">
                                                                                            <Eye className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button size="sm" variant="ghost">
                                                                                            <Edit className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button size="sm" variant="ghost">
                                                                                            <Copy className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button size="sm" variant="ghost">
                                                                                            <FileText className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button size="sm" variant="ghost" className="text-red-600">
                                                                                            <Trash2 className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                        </div>
                                                    </CardContent>
                                                )}

                                                {/* Action buttons for Economic Head */}
                                                <CardContent className="pt-0">
                                                    <div className="flex items-center gap-2 ml-6">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleViewDetails(head)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(head)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleAdjustBudget(head)}
                                                        >
                                                            <Calculator className="h-4 w-4 mr-2" />
                                                            Adjust Budget
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDuplicate(head)}
                                                        >
                                                            <Copy className="h-4 w-4 mr-2" />
                                                            Duplicate
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleGenerateReport(head)}
                                                        >
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            Generate Report
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>

            {/* Modals */}
            <CreateEconomicCycleModal
                isOpen={showCreateCycleModal}
                onClose={() => setShowCreateCycleModal(false)}
                onSubmit={handleCreateCycle}
            />

            <CreateEconomicHeadModal
                isOpen={showCreateHeadModal}
                onClose={() => setShowCreateHeadModal(false)}
                onSubmit={handleCreateHead}
                cycleId={selectedCycle?.id || ''}
                cycleName={selectedCycle?.name || ''}
            />

            <CreateEconomicLineItemModal
                isOpen={showCreateLineItemModal}
                onClose={() => setShowCreateLineItemModal(false)}
                onSave={handleCreateLineItem}
                budgetCycles={cycles.map(c => c.name)}
                mdas={mdas}
                organizationCodes={organizationCodes}
                economicHeads={economicHeads.map(h => h.economicHead)}
                economicLineItems={lineItems.map(l => l.economicLineItem)}
                categories={categories}
                economicCodes={economicCodes}
                functionCodes={functionCodes}
                fundCodes={fundCodes}
            />

            {/* Action Modals */}
            {selectedHead && (
                <>
                    <ViewDetailsModal
                        isOpen={showViewDetailsModal}
                        onClose={() => {
                            setShowViewDetailsModal(false);
                            setSelectedHead(null);
                        }}
                        economicHead={selectedHead}
                    />

                    <EditModal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedHead(null);
                        }}
                        economicHead={selectedHead}
                        onSubmit={handleUpdateHead}
                    />

                    <AdjustBudgetModal
                        isOpen={showAdjustBudgetModal}
                        onClose={() => {
                            setShowAdjustBudgetModal(false);
                            setSelectedHead(null);
                        }}
                        economicHead={selectedHead}
                        onSubmit={handleBudgetAdjustment}
                    />

                    <DuplicateModal
                        isOpen={showDuplicateModal}
                        onClose={() => {
                            setShowDuplicateModal(false);
                            setSelectedHead(null);
                        }}
                        economicHead={selectedHead}
                        onSubmit={handleDuplicateHead}
                    />

                    <GenerateReportModal
                        isOpen={showGenerateReportModal}
                        onClose={() => {
                            setShowGenerateReportModal(false);
                            setSelectedHead(null);
                        }}
                        economicHead={selectedHead}
                    />
                </>
            )}
        </div>
    );
}
