'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Edit,
  Send,
  Filter,
  Search,
  Calendar,
  Building2,
  User,
  Check,
  X,
  Shield,
  Calculator,
  FileCheck,
  TrendingUp,
  BarChart3,
  Receipt,
  CreditCard,
} from 'lucide-react';

interface FinanceConfirmation {
  id: string;
  title: string;
  department: string;
  submittedBy: string;
  submittedAt: string;
  verifiedBy: string;
  verifiedAt: string;
  governorApprovedBy: string;
  governorApprovedAt: string;
  amount: number;
  status: 'pending_confirmation' | 'confirmed' | 'rejected' | 'under_review' | 'requires_changes';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  description: string;
  attachments: string[];
  verificationNotes: string[];
  governorNotes: string[];
  currentStage: string;
  progress: number;
  fiscalYear: string;
  budgetType: string;
  fundingSource: string;
  disbursementSchedule: string;
}

export default function FinanceConfirmationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedConfirmation, setSelectedConfirmation] = useState<FinanceConfirmation | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data
  const [financeConfirmations, setFinanceConfirmations] = useState<FinanceConfirmation[]>([
    {
      id: 'FC-001',
      title: 'Healthcare Infrastructure Development',
      department: 'Ministry of Health',
      submittedBy: 'Dr. Sarah Johnson',
      submittedAt: '2025-01-17T10:30:00Z',
      verifiedBy: 'Finance Director',
      verifiedAt: '2025-01-18T14:20:00Z',
      governorApprovedBy: 'Governor',
      governorApprovedAt: '2025-01-19T09:15:00Z',
      amount: 2500000000,
      status: 'pending_confirmation',
      priority: 'high',
      category: 'Infrastructure',
      description: 'Development of healthcare facilities and medical equipment procurement',
      attachments: ['budget_proposal.pdf', 'technical_specs.pdf', 'cost_breakdown.xlsx', 'verification_report.pdf', 'governor_approval.pdf'],
      verificationNotes: [
        'Budget verification completed - all requirements met',
        'Cost estimates validated by engineering team',
        'Environmental impact assessment satisfactory'
      ],
      governorNotes: [
        'Approved for execution - priority healthcare project',
        'Ensure proper monitoring and accountability'
      ],
      currentStage: 'Finance Confirmation',
      progress: 90,
      fiscalYear: '2025',
      budgetType: 'Capital',
      fundingSource: 'State Budget Allocation',
      disbursementSchedule: 'Quarterly disbursements'
    },
    {
      id: 'FC-002',
      title: 'Education Technology Enhancement',
      department: 'Ministry of Education',
      submittedBy: 'Prof. Michael Chen',
      submittedAt: '2025-01-16T14:20:00Z',
      verifiedBy: 'Finance Director',
      verifiedAt: '2025-01-17T11:15:00Z',
      governorApprovedBy: 'Governor',
      governorApprovedAt: '2025-01-18T16:30:00Z',
      amount: 800000000,
      status: 'confirmed',
      priority: 'medium',
      category: 'Technology',
      description: 'Digital learning platforms and computer lab upgrades',
      attachments: ['edtech_proposal.pdf', 'vendor_quotes.pdf', 'verification_report.pdf', 'governor_approval.pdf'],
      verificationNotes: [
        'Initial verification completed',
        'Additional vendor documentation required'
      ],
      governorNotes: [
        'Approved - important for digital transformation',
        'Monitor implementation progress'
      ],
      currentStage: 'Execution Phase',
      progress: 100,
      fiscalYear: '2025',
      budgetType: 'Recurrent',
      fundingSource: 'Education Fund',
      disbursementSchedule: 'Monthly disbursements'
    },
    {
      id: 'FC-003',
      title: 'Road Network Expansion',
      department: 'Ministry of Transportation',
      submittedBy: 'Eng. David Wilson',
      submittedAt: '2025-01-15T09:15:00Z',
      verifiedBy: 'Finance Director',
      verifiedAt: '2025-01-16T16:30:00Z',
      governorApprovedBy: 'Governor',
      governorApprovedAt: '2025-01-17T14:45:00Z',
      amount: 3500000000,
      status: 'confirmed',
      priority: 'high',
      category: 'Infrastructure',
      description: 'Construction of new highways and road maintenance',
      attachments: ['road_plan.pdf', 'environmental_assessment.pdf', 'contractor_bids.pdf', 'verification_report.pdf', 'governor_approval.pdf'],
      verificationNotes: [
        'All requirements met - approved for execution',
        'Environmental impact assessment satisfactory',
        'Contractor selection process validated'
      ],
      governorNotes: [
        'Critical infrastructure project approved',
        'Ensure timely completion and quality standards'
      ],
      currentStage: 'Execution Phase',
      progress: 100,
      fiscalYear: '2025',
      budgetType: 'Capital',
      fundingSource: 'Infrastructure Development Fund',
      disbursementSchedule: 'Milestone-based disbursements'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_confirmation': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requires_changes': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_confirmation': return DollarSign;
      case 'under_review': return AlertCircle;
      case 'confirmed': return CheckCircle;
      case 'rejected': return XCircle;
      case 'requires_changes': return Edit;
      default: return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredConfirmations = financeConfirmations.filter(confirmation => {
    const matchesSearch = confirmation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         confirmation.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         confirmation.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || confirmation.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || confirmation.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'all' || confirmation.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  const handleReview = (confirmation: FinanceConfirmation) => {
    setSelectedConfirmation(confirmation);
    setShowReviewModal(true);
  };

  const handleViewDetails = (confirmation: FinanceConfirmation) => {
    setSelectedConfirmation(confirmation);
    setShowDetailsModal(true);
  };

  const handleConfirm = (confirmationId: string) => {
    setFinanceConfirmations(prev => prev.map(confirmation => 
      confirmation.id === confirmationId 
        ? { ...confirmation, status: 'confirmed', progress: 100, currentStage: 'Execution Phase' }
        : confirmation
    ));
  };

  const handleReject = (confirmationId: string) => {
    setFinanceConfirmations(prev => prev.map(confirmation => 
      confirmation.id === confirmationId 
        ? { ...confirmation, status: 'rejected', progress: 100, currentStage: 'Rejected' }
        : confirmation
    ));
  };

  const handleRequestChanges = (confirmationId: string) => {
    setFinanceConfirmations(prev => prev.map(confirmation => 
      confirmation.id === confirmationId 
        ? { ...confirmation, status: 'requires_changes', progress: 75, currentStage: 'Changes Requested' }
        : confirmation
    ));
  };

  const stats = {
    total: financeConfirmations.length,
    pendingConfirmation: financeConfirmations.filter(c => c.status === 'pending_confirmation').length,
    underReview: financeConfirmations.filter(c => c.status === 'under_review').length,
    confirmed: financeConfirmations.filter(c => c.status === 'confirmed').length,
    rejected: financeConfirmations.filter(c => c.status === 'rejected').length,
    requiresChanges: financeConfirmations.filter(c => c.status === 'requires_changes').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Confirmation</h1>
          <p className="text-gray-600 mt-2">Final financial review and confirmation of approved budgets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            New Confirmation
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Confirmation</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingConfirmation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Edit className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Changes Required</p>
                <p className="text-2xl font-bold text-gray-900">{stats.requiresChanges}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search confirmations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_confirmation">Pending Confirmation</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="requires_changes">Changes Required</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Ministry of Health">Ministry of Health</SelectItem>
                <SelectItem value="Ministry of Education">Ministry of Education</SelectItem>
                <SelectItem value="Ministry of Transportation">Ministry of Transportation</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Finance Confirmations */}
      <div className="space-y-4">
        {filteredConfirmations.map((confirmation) => {
          const StatusIcon = getStatusIcon(confirmation.status);
          
          return (
            <Card key={confirmation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{confirmation.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {confirmation.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {confirmation.submittedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(confirmation.submittedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{confirmation.description}</p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">{formatCurrency(confirmation.amount)}</span>
                      </div>
                      <Badge className={getPriorityColor(confirmation.priority)}>
                        {confirmation.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(confirmation.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {confirmation.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {confirmation.budgetType}
                      </Badge>
                      <Badge variant="outline">
                        FY {confirmation.fiscalYear}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress: {confirmation.currentStage}</span>
                        <span>{confirmation.progress}%</span>
                      </div>
                      <Progress value={confirmation.progress} className="h-2" />
                    </div>

                    {/* Financial Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-800 mb-1">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">Funding Source</span>
                        </div>
                        <div className="text-sm text-blue-700">
                          {confirmation.fundingSource}
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-purple-800 mb-1">
                          <Receipt className="h-4 w-4" />
                          <span className="font-medium">Disbursement Schedule</span>
                        </div>
                        <div className="text-sm text-purple-700">
                          {confirmation.disbursementSchedule}
                        </div>
                      </div>
                    </div>

                    {/* Verification Info */}
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-green-800 mb-2">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Verified by {confirmation.verifiedBy}</span>
                        <span>•</span>
                        <span>{formatDate(confirmation.verifiedAt)}</span>
                      </div>
                      <div className="text-sm text-green-700">
                        Budget verification completed and approved for governor review
                      </div>
                    </div>

                    {/* Governor Approval Info */}
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-purple-800 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Approved by {confirmation.governorApprovedBy}</span>
                        <span>•</span>
                        <span>{formatDate(confirmation.governorApprovedAt)}</span>
                      </div>
                      <div className="text-sm text-purple-700">
                        Governor approval granted - pending finance confirmation
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-600">Attachments:</span>
                      {confirmation.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {attachment}
                        </Badge>
                      ))}
                    </div>

                    {/* Governor Notes */}
                    {confirmation.governorNotes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Governor Notes:</h4>
                        <div className="space-y-2">
                          {confirmation.governorNotes.map((note, index) => (
                            <div key={index} className="text-sm text-gray-600 bg-purple-50 p-2 rounded border border-purple-200">
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verification Notes */}
                    {confirmation.verificationNotes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Notes:</h4>
                        <div className="space-y-2">
                          {confirmation.verificationNotes.map((note, index) => (
                            <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(confirmation)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {confirmation.status === 'pending_confirmation' && (
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirm(confirmation.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestChanges(confirmation.id)}
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Request Changes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(confirmation.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {confirmation.status === 'under_review' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(confirmation)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    )}

                    {confirmation.status === 'requires_changes' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(confirmation)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Review Changes
                      </Button>
                    )}

                    {confirmation.status === 'confirmed' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredConfirmations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No finance confirmations found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || departmentFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No finance confirmations are currently pending review'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
