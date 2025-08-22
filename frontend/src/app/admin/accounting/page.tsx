'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    BookOpen, Plus, Search, TrendingUp, TrendingDown, Target, Calculator, Database, FileText,
    Upload, Download, Calendar, Eye, Edit, ChevronRight, ChevronDown, Trash2, Settings,
    RefreshCw, BarChart3, PieChart, LineChart, DollarSign, Shield, Building2, User,
    CreditCard, Receipt, Clock, CheckCircle, XCircle, AlertCircle, MoreHorizontal,
    Filter, SortAsc, SortDesc, Archive, ExternalLink, Zap, Star, StarOff, History
} from 'lucide-react';

// Types
interface ChartOfAccount {
    id: string;
    accountCode: string;
    accountName: string;
    accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    accountSubtype: string;
    parentAccountId?: string;
    isActive: boolean;
    isSystem: boolean;
    openingBalance: number;
    currentBalance: number;
    debitBalance: number;
    creditBalance: number;
    normalBalance: 'debit' | 'credit';
    description?: string;
    tags: string[];
    level: number;
    children: ChartOfAccount[];
    createdAt: string;
    updatedAt: string;
}

interface JournalEntry {
    id: string;
    journalNumber: string;
    entryDate: string;
    description: string;
    referenceType: string;
    referenceId?: string;
    totalDebits: number;
    totalCredits: number;
    status: 'draft' | 'posted' | 'reversed';
    postedBy?: string;
    postedAt?: string;
    reversedBy?: string;
    reversedAt?: string;
    lines: JournalEntryLine[];
    createdAt: string;
    updatedAt: string;
}

interface JournalEntryLine {
    id: string;
    lineNumber: number;
    accountId: string;
    accountCode: string;
    accountName: string;
    description: string;
    debitAmount: number;
    creditAmount: number;
    budgetLineId?: string;
}

interface TrialBalance {
    id: string;
    asOfDate: string;
    totalDebits: number;
    totalCredits: number;
    difference: number;
    isBalanced: boolean;
    accounts: TrialBalanceAccount[];
    generatedAt: string;
    generatedBy: string;
}

interface TrialBalanceAccount {
    accountId: string;
    accountCode: string;
    accountName: string;
    accountType: string;
    openingBalance: number;
    debitTotal: number;
    creditTotal: number;
    currentBalance: number;
    normalBalance: string;
}

interface FinancialReport {
    id: string;
    reportType: 'balance_sheet' | 'income_statement' | 'cash_flow';
    reportDate: string;
    period: string;
    data: any;
    generatedAt: string;
    generatedBy: string;
}

export default function AccountingSetupPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('chart-of-accounts');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
    const [showEditAccountModal, setShowEditAccountModal] = useState(false);
    const [showViewAccountModal, setShowViewAccountModal] = useState(false);
    const [showCreateJournalModal, setShowCreateJournalModal] = useState(false);
    const [showViewJournalModal, setShowViewJournalModal] = useState(false);
    const [showTrialBalanceModal, setShowTrialBalanceModal] = useState(false);
    const [showFinancialReportModal, setShowFinancialReportModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
    const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
    const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
    const [accountTypeFilter, setAccountTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRangeFilter, setDateRangeFilter] = useState('all');

    // Mock data - replace with API calls
    const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([
        {
            id: '1',
            accountCode: '1000',
            accountName: 'ASSETS',
            accountType: 'asset',
            accountSubtype: 'current_asset',
            isActive: true,
            isSystem: true,
            openingBalance: 2500000000,
            currentBalance: 2500000000,
            debitBalance: 2500000000,
            creditBalance: 0,
            normalBalance: 'debit',
            description: 'Total assets of the organization',
            tags: ['balance-sheet', 'asset'],
            level: 0,
            children: [
                {
                    id: '1.1',
                    accountCode: '1100',
                    accountName: 'Current Assets',
                    accountType: 'asset',
                    accountSubtype: 'current_asset',
                    parentAccountId: '1',
                    isActive: true,
                    isSystem: true,
                    openingBalance: 1500000000,
                    currentBalance: 1500000000,
                    debitBalance: 1500000000,
                    creditBalance: 0,
                    normalBalance: 'debit',
                    description: 'Assets expected to be converted to cash within one year',
                    tags: ['current', 'liquid'],
                    level: 1,
                    children: [
                        {
                            id: '1.1.1',
                            accountCode: '1110',
                            accountName: 'Cash and Cash Equivalents',
                            accountType: 'asset',
                            accountSubtype: 'cash',
                            parentAccountId: '1.1',
                            isActive: true,
                            isSystem: true,
                            openingBalance: 500000000,
                            currentBalance: 500000000,
                            debitBalance: 500000000,
                            creditBalance: 0,
                            normalBalance: 'debit',
                            description: 'Cash on hand and in bank accounts',
                            tags: ['cash', 'bank'],
                            level: 2,
                            children: [],
                            createdAt: '2025-01-01T00:00:00Z',
                            updatedAt: '2025-01-01T00:00:00Z'
                        },
                        {
                            id: '1.1.2',
                            accountCode: '1120',
                            accountName: 'Accounts Receivable',
                            accountType: 'asset',
                            accountSubtype: 'receivable',
                            parentAccountId: '1.1',
                            isActive: true,
                            isSystem: true,
                            openingBalance: 800000000,
                            currentBalance: 800000000,
                            debitBalance: 800000000,
                            creditBalance: 0,
                            normalBalance: 'debit',
                            description: 'Amounts owed by customers and other debtors',
                            tags: ['receivable', 'customer'],
                            level: 2,
                            children: [],
                            createdAt: '2025-01-01T00:00:00Z',
                            updatedAt: '2025-01-01T00:00:00Z'
                        }
                    ],
                    createdAt: '2025-01-01T00:00:00Z',
                    updatedAt: '2025-01-01T00:00:00Z'
                },
                {
                    id: '1.2',
                    accountCode: '1200',
                    accountName: 'Fixed Assets',
                    accountType: 'asset',
                    accountSubtype: 'fixed_asset',
                    parentAccountId: '1',
                    isActive: true,
                    isSystem: true,
                    openingBalance: 1000000000,
                    currentBalance: 1000000000,
                    debitBalance: 1000000000,
                    creditBalance: 0,
                    normalBalance: 'debit',
                    description: 'Long-term tangible assets',
                    tags: ['fixed', 'long-term'],
                    level: 1,
                    children: [],
                    createdAt: '2025-01-01T00:00:00Z',
                    updatedAt: '2025-01-01T00:00:00Z'
                }
            ],
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z'
        },
        {
            id: '2',
            accountCode: '2000',
            accountName: 'LIABILITIES',
            accountType: 'liability',
            accountSubtype: 'current_liability',
            isActive: true,
            isSystem: true,
            openingBalance: 1200000000,
            currentBalance: 1200000000,
            debitBalance: 0,
            creditBalance: 1200000000,
            normalBalance: 'credit',
            description: 'Total liabilities of the organization',
            tags: ['balance-sheet', 'liability'],
            level: 0,
            children: [],
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z'
        },
        {
            id: '3',
            accountCode: '3000',
            accountName: 'EQUITY',
            accountType: 'equity',
            accountSubtype: 'capital',
            isActive: true,
            isSystem: true,
            openingBalance: 1300000000,
            currentBalance: 1300000000,
            debitBalance: 0,
            creditBalance: 1300000000,
            normalBalance: 'credit',
            description: 'Shareholders equity and retained earnings',
            tags: ['balance-sheet', 'equity'],
            level: 0,
            children: [],
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z'
        }
    ]);

    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
        {
            id: '1',
            journalNumber: 'JE-2025-001',
            entryDate: '2025-01-15',
            description: 'Payment for medical equipment procurement',
            referenceType: 'payment',
            referenceId: 'PR-001',
            totalDebits: 25000000,
            totalCredits: 25000000,
            status: 'posted',
            postedBy: 'Finance Director',
            postedAt: '2025-01-15T10:00:00Z',
            lines: [
                {
                    id: '1.1',
                    lineNumber: 1,
                    accountId: '1.1.1',
                    accountCode: '1110',
                    accountName: 'Cash and Cash Equivalents',
                    description: 'Payment for medical equipment',
                    debitAmount: 0,
                    creditAmount: 25000000
                },
                {
                    id: '1.2',
                    lineNumber: 2,
                    accountId: '4.1.1',
                    accountCode: '4100',
                    accountName: 'Medical Equipment Expense',
                    description: 'Purchase of medical equipment',
                    debitAmount: 25000000,
                    creditAmount: 0
                }
            ],
            createdAt: '2025-01-15T09:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z'
        }
    ]);

    const [trialBalance, setTrialBalance] = useState<TrialBalance>({
        id: '1',
        asOfDate: '2025-01-31',
        totalDebits: 2500000000,
        totalCredits: 2500000000,
        difference: 0,
        isBalanced: true,
        accounts: [
            {
                accountId: '1',
                accountCode: '1000',
                accountName: 'ASSETS',
                accountType: 'asset',
                openingBalance: 2500000000,
                debitTotal: 2500000000,
                creditTotal: 0,
                currentBalance: 2500000000,
                normalBalance: 'debit'
            },
            {
                accountId: '2',
                accountCode: '2000',
                accountName: 'LIABILITIES',
                accountType: 'liability',
                openingBalance: 1200000000,
                debitTotal: 0,
                creditTotal: 1200000000,
                currentBalance: 1200000000,
                normalBalance: 'credit'
            },
            {
                accountId: '3',
                accountCode: '3000',
                accountName: 'EQUITY',
                accountType: 'equity',
                openingBalance: 1300000000,
                debitTotal: 0,
                creditTotal: 1300000000,
                currentBalance: 1300000000,
                normalBalance: 'credit'
            }
        ],
        generatedAt: '2025-01-31T23:59:59Z',
        generatedBy: 'System'
    });

    const [financialReports, setFinancialReports] = useState<FinancialReport[]>([
        {
            id: '1',
            reportType: 'balance_sheet',
            reportDate: '2025-01-31',
            period: 'Q1 2025',
            data: { assets: 2500000000, liabilities: 1200000000, equity: 1300000000 },
            generatedAt: '2025-01-31T23:59:59Z',
            generatedBy: 'System'
        }
    ]);

    // Utility functions
    const getAccountTypeColor = (type: string) => {
        const colorMap: { [key: string]: string } = {
            'asset': 'bg-green-100 text-green-800 border-green-200',
            'liability': 'bg-red-100 text-red-800 border-red-200',
            'equity': 'bg-blue-100 text-blue-800 border-blue-200',
            'revenue': 'bg-purple-100 text-purple-800 border-purple-200',
            'expense': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colorMap[type] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusColor = (status: string) => {
        const colorMap: { [key: string]: string } = {
            'draft': 'bg-gray-100 text-gray-800 border-gray-200',
            'posted': 'bg-green-100 text-green-800 border-green-200',
            'reversed': 'bg-red-100 text-red-800 border-red-200'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG');
    };

    const toggleAccountExpansion = (accountId: string) => {
        const newExpanded = new Set(expandedAccounts);
        if (newExpanded.has(accountId)) {
            newExpanded.delete(accountId);
        } else {
            newExpanded.add(accountId);
        }
        setExpandedAccounts(newExpanded);
    };

    const renderChartOfAccounts = (accounts: ChartOfAccount[], level: number = 0) => {
        return accounts.map((account) => (
            <div key={account.id} className="space-y-2">
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${level === 0 ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 flex-1">
                        {account.children && account.children.length > 0 && (
                            <button
                                onClick={() => toggleAccountExpansion(account.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                {expandedAccounts.has(account.id) ?
                                    <ChevronDown className="h-4 w-4" /> :
                                    <ChevronRight className="h-4 w-4" />
                                }
                            </button>
                        )}
                        <span className="font-medium">
                            {account.accountCode} - {account.accountName}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className={getAccountTypeColor(account.accountType)}>
                            {account.accountType}
                        </Badge>
                        <span className="font-mono text-sm">
                            {formatCurrency(account.currentBalance)}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedAccount(account);
                                    setShowViewAccountModal(true);
                                }}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedAccount(account);
                                    setShowEditAccountModal(true);
                                }}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                {account.children && account.children.length > 0 && expandedAccounts.has(account.id) && (
                    <div className="ml-6">
                        {renderChartOfAccounts(account.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    const filteredAccounts = chartOfAccounts.filter(account => {
        const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.accountCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = accountTypeFilter === 'all' || account.accountType === accountTypeFilter;
        return matchesSearch && matchesType;
    });

    const filteredJournals = journalEntries.filter(journal => {
        const matchesSearch = journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            journal.journalNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || journal.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalAccounts: chartOfAccounts.length,
        activeAccounts: chartOfAccounts.filter(a => a.isActive).length,
        totalJournals: journalEntries.length,
        postedJournals: journalEntries.filter(j => j.status === 'posted').length,
        totalAssets: chartOfAccounts.filter(a => a.accountType === 'asset').reduce((sum, a) => sum + a.currentBalance, 0),
        totalLiabilities: chartOfAccounts.filter(a => a.accountType === 'liability').reduce((sum, a) => sum + a.currentBalance, 0),
        totalEquity: chartOfAccounts.filter(a => a.accountType === 'equity').reduce((sum, a) => sum + a.currentBalance, 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Accounting Setup</h1>
                    <p className="text-gray-600">Manage Chart of Accounts, General Ledger, and Financial Records</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAccounts}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeAccounts} active accounts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalJournals}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.postedJournals} posted entries
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalAssets)}</div>
                        <p className="text-xs text-muted-foreground">
                            Current asset value
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalAssets - stats.totalLiabilities)}</div>
                        <p className="text-xs text-muted-foreground">
                            Assets - Liabilities
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <div className="w-full">
                <div className="grid w-full grid-cols-5 gap-1 mb-6">
                    <Button
                        variant={activeTab === 'chart-of-accounts' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('chart-of-accounts')}
                        className="h-10"
                    >
                        Chart of Accounts
                    </Button>
                    <Button
                        variant={activeTab === 'general-ledger' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('general-ledger')}
                        className="h-10"
                    >
                        General Ledger
                    </Button>
                    <Button
                        variant={activeTab === 'journal-entries' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('journal-entries')}
                        className="h-10"
                    >
                        Journal Entries
                    </Button>
                    <Button
                        variant={activeTab === 'trial-balance' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('trial-balance')}
                        className="h-10"
                    >
                        Trial Balance
                    </Button>
                    <Button
                        variant={activeTab === 'reports' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('reports')}
                        className="h-10"
                    >
                        Financial Reports
                    </Button>
                </div>

                {/* Chart of Accounts Tab */}
                {activeTab === 'chart-of-accounts' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Chart of Accounts</CardTitle>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search accounts..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 w-64"
                                            />
                                        </div>
                                        <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Account Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="asset">Assets</SelectItem>
                                                <SelectItem value="liability">Liabilities</SelectItem>
                                                <SelectItem value="equity">Equity</SelectItem>
                                                <SelectItem value="revenue">Revenue</SelectItem>
                                                <SelectItem value="expense">Expenses</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Import
                                        </Button>
                                        <Button onClick={() => setShowCreateAccountModal(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            New Account
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {renderChartOfAccounts(filteredAccounts)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* General Ledger Tab */}
                {activeTab === 'general-ledger' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>General Ledger</CardTitle>
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                        <Button variant="outline">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Refresh
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>General Ledger view will be implemented here</p>
                                    <p className="text-sm">Showing account balances and transaction history</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Journal Entries Tab */}
                {activeTab === 'journal-entries' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Journal Entries</CardTitle>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search entries..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 w-64"
                                            />
                                        </div>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="posted">Posted</SelectItem>
                                                <SelectItem value="reversed">Reversed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={() => setShowCreateJournalModal(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            New Entry
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {filteredJournals.map(journal => (
                                        <div key={journal.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="font-medium">{journal.journalNumber}</p>
                                                    <p className="text-sm text-gray-600">{journal.description}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(journal.entryDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant="secondary" className={getStatusColor(journal.status)}>
                                                    {journal.status}
                                                </Badge>
                                                <span className="font-mono text-sm">
                                                    {formatCurrency(journal.totalDebits)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedJournal(journal);
                                                        setShowViewJournalModal(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Trial Balance Tab */}
                {activeTab === 'trial-balance' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Trial Balance</CardTitle>
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" onClick={() => setShowTrialBalanceModal(true)}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                        <Button variant="outline">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                        <Button>
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Generate New
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Total Debits</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(trialBalance.totalDebits)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Total Credits</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {formatCurrency(trialBalance.totalCredits)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Difference</p>
                                        <p className={`text-2xl font-bold ${trialBalance.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(trialBalance.difference)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <Badge variant={trialBalance.isBalanced ? "default" : "destructive"}>
                                        {trialBalance.isBalanced ? 'Balanced' : 'Not Balanced'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Financial Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Financial Reports</CardTitle>
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export All
                                        </Button>
                                        <Button>
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            Generate Reports
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {financialReports.map(report => (
                                        <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <CardTitle className="text-lg">{report.reportType.replace('_', ' ').toUpperCase()}</CardTitle>
                                                <p className="text-sm text-gray-600">{report.period}</p>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center">
                                                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                                                    <p className="text-sm text-gray-500">Generated: {formatDate(report.generatedAt)}</p>
                                                    <Button
                                                        variant="outline"
                                                        className="mt-4"
                                                        onClick={() => {
                                                            setSelectedReport(report);
                                                            setShowFinancialReportModal(true);
                                                        }}
                                                    >
                                                        View Report
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Modals - Placeholders for now */}
            {showCreateAccountModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
                        <p className="text-gray-600 mb-4">Account creation modal will be implemented here</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreateAccountModal(false)}>
                                Cancel
                            </Button>
                            <Button>Create Account</Button>
                        </div>
                    </div>
                </div>
            )}

            {showViewAccountModal && selectedAccount && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">Account Code: {selectedAccount.accountCode}</p>
                                <p className="font-medium">Account Name: {selectedAccount.accountName}</p>
                                <p className="font-medium">Type: {selectedAccount.accountType}</p>
                                <p className="font-medium">Balance: {formatCurrency(selectedAccount.currentBalance)}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button onClick={() => setShowViewAccountModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {showEditAccountModal && selectedAccount && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Edit Account</h3>
                        <p className="text-gray-600 mb-4">Account editing modal will be implemented here</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowEditAccountModal(false)}>
                                Cancel
                            </Button>
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateJournalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                        <h3 className="text-lg font-semibold mb-4">Create Journal Entry</h3>
                        <p className="text-gray-600 mb-4">Journal entry creation modal will be implemented here</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreateJournalModal(false)}>
                                Cancel
                            </Button>
                            <Button>Create Entry</Button>
                        </div>
                    </div>
                </div>
            )}

            {showViewJournalModal && selectedJournal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                        <h3 className="text-lg font-semibold mb-4">Journal Entry Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">Journal Number: {selectedJournal.journalNumber}</p>
                                <p className="font-medium">Description: {selectedJournal.description}</p>
                                <p className="font-medium">Status: {selectedJournal.status}</p>
                                <p className="font-medium">Total: {formatCurrency(selectedJournal.totalDebits)}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button onClick={() => setShowViewJournalModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {showTrialBalanceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Trial Balance Details</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-6 gap-4 font-medium text-sm border-b pb-2">
                                <div>Account Code</div>
                                <div>Account Name</div>
                                <div>Type</div>
                                <div>Opening Balance</div>
                                <div>Debits</div>
                                <div>Credits</div>
                            </div>
                            {trialBalance.accounts.map(account => (
                                <div key={account.accountId} className="grid grid-cols-6 gap-4 text-sm border-b pb-2">
                                    <div>{account.accountCode}</div>
                                    <div>{account.accountName}</div>
                                    <div>{account.accountType}</div>
                                    <div>{formatCurrency(account.openingBalance)}</div>
                                    <div>{formatCurrency(account.debitTotal)}</div>
                                    <div>{formatCurrency(account.creditTotal)}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button onClick={() => setShowTrialBalanceModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {showFinancialReportModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                        <h3 className="text-lg font-semibold mb-4">Financial Report: {selectedReport.reportType.replace('_', ' ').toUpperCase()}</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">Period: {selectedReport.period}</p>
                                <p className="font-medium">Generated: {formatDate(selectedReport.generatedAt)}</p>
                                <p className="font-medium">Generated By: {selectedReport.generatedBy}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                                <p className="text-sm text-gray-600">Report data visualization will be implemented here</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button onClick={() => setShowFinancialReportModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
