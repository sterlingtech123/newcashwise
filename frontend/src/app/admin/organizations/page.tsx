'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Users,
    MapPin,
    Phone,
    Mail,
    Globe,
    Settings,
    Download,
    Upload,
    Eye,
    UserPlus,
    FolderOpen,
    Network,
} from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    type: 'Ministry' | 'Department' | 'Agency' | 'Commission' | 'Board';
    code: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    status: 'active' | 'inactive' | 'pending';
    headOfDepartment: string;
    totalStaff: number;
    budgetAllocation: number;
    createdAt: string;
    parentOrganization?: string;
    subOrganizations: string[];
}

export default function OrganizationManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock data
    const [organizations, setOrganizations] = useState<Organization[]>([
        {
            id: 'ORG-001',
            name: 'Ministry of Finance',
            type: 'Ministry',
            code: 'MOF001',
            address: 'Government House, Umuahia, Abia State',
            phone: '+234 801 234 5678',
            email: 'info@mof.abia.gov.ng',
            website: 'www.mof.abia.gov.ng',
            status: 'active',
            headOfDepartment: 'Dr. John Doe',
            totalStaff: 150,
            budgetAllocation: 5000000000,
            createdAt: '2020-01-15T09:00:00Z',
            subOrganizations: ['Department of Budget', 'Department of Treasury', 'Department of Planning']
        },
        {
            id: 'ORG-002',
            name: 'Ministry of Health',
            type: 'Ministry',
            code: 'MOH001',
            address: 'Health Complex, Umuahia, Abia State',
            phone: '+234 802 345 6789',
            email: 'info@moh.abia.gov.ng',
            website: 'www.moh.abia.gov.ng',
            status: 'active',
            headOfDepartment: 'Dr. Sarah Johnson',
            totalStaff: 200,
            budgetAllocation: 3500000000,
            createdAt: '2020-02-10T11:30:00Z',
            subOrganizations: ['Department of Public Health', 'Department of Medical Services', 'Department of Pharmacy']
        },
        {
            id: 'ORG-003',
            name: 'Department of Education',
            type: 'Department',
            code: 'DOE001',
            address: 'Education Secretariat, Umuahia, Abia State',
            phone: '+234 803 456 7890',
            email: 'info@doe.abia.gov.ng',
            website: 'www.doe.abia.gov.ng',
            status: 'active',
            headOfDepartment: 'Prof. Michael Chen',
            totalStaff: 120,
            budgetAllocation: 2800000000,
            createdAt: '2020-03-05T13:15:00Z',
            parentOrganization: 'Ministry of Education',
            subOrganizations: ['Primary Education Unit', 'Secondary Education Unit', 'Tertiary Education Unit']
        },
        {
            id: 'ORG-004',
            name: 'Abia State Internal Revenue Service',
            type: 'Agency',
            code: 'ASIRS001',
            address: 'Revenue House, Umuahia, Abia State',
            phone: '+234 804 567 8901',
            email: 'info@asirs.abia.gov.ng',
            website: 'www.asirs.abia.gov.ng',
            status: 'active',
            headOfDepartment: 'Mr. David Wilson',
            totalStaff: 80,
            budgetAllocation: 1200000000,
            createdAt: '2020-04-20T10:45:00Z',
            parentOrganization: 'Ministry of Finance',
            subOrganizations: ['Tax Collection Unit', 'Tax Assessment Unit', 'Tax Enforcement Unit']
        }
    ]);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Ministry': return 'bg-purple-100 text-purple-800';
            case 'Department': return 'bg-blue-100 text-blue-800';
            case 'Agency': return 'bg-green-100 text-green-800';
            case 'Commission': return 'bg-orange-100 text-orange-800';
            case 'Board': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
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
            day: 'numeric'
        });
    };

    const filteredOrganizations = organizations.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || org.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || org.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const stats = {
        total: organizations.length,
        ministries: organizations.filter(o => o.type === 'Ministry').length,
        departments: organizations.filter(o => o.type === 'Department').length,
        agencies: organizations.filter(o => o.type === 'Agency').length,
        active: organizations.filter(o => o.status === 'active').length,
        inactive: organizations.filter(o => o.status === 'inactive').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
                    <p className="text-gray-600 mt-2">Manage government departments, ministries, and agencies</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Organization
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-blue-600" />
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
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FolderOpen className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ministries</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.ministries}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Network className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Departments</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Agencies</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.agencies}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Users className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Inactive</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
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
                                    placeholder="Search organizations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Ministry">Ministry</SelectItem>
                                <SelectItem value="Department">Department</SelectItem>
                                <SelectItem value="Agency">Agency</SelectItem>
                                <SelectItem value="Commission">Commission</SelectItem>
                                <SelectItem value="Board">Board</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            More Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Organizations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredOrganizations.map((org) => (
                            <div key={org.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                                                <Badge className={getTypeColor(org.type)}>
                                                    {org.type}
                                                </Badge>
                                                <Badge className={getStatusColor(org.status)}>
                                                    {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {org.code}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {org.headOfDepartment}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {org.address}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-4 w-4" />
                                                    {org.phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-4 w-4" />
                                                    {org.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">Total Staff</div>
                                            <div className="text-lg font-semibold text-gray-900">{org.totalStaff}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">Budget Allocation</div>
                                            <div className="text-lg font-semibold text-gray-900">{formatCurrency(org.budgetAllocation)}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">Created</div>
                                            <div className="text-sm font-medium text-gray-900">{formatDate(org.createdAt)}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">Sub-Organizations</div>
                                            <div className="text-lg font-semibold text-gray-900">{org.subOrganizations.length}</div>
                                        </div>
                                    </div>

                                    {org.parentOrganization && (
                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm text-blue-800">
                                                <Network className="h-4 w-4" />
                                                <span className="font-medium">Parent Organization:</span>
                                                <span>{org.parentOrganization}</span>
                                            </div>
                                        </div>
                                    )}

                                    {org.subOrganizations.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Sub-Organizations:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {org.subOrganizations.map((subOrg, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {subOrg}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {org.website && (
                                        <div className="flex items-center gap-2 text-sm text-blue-600">
                                            <Globe className="h-4 w-4" />
                                            <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {org.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>

                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>

                                    <Button variant="outline" size="sm">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Add Staff
                                    </Button>

                                    <Button variant="outline" size="sm">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </Button>

                                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredOrganizations.length === 0 && (
                        <div className="text-center py-12">
                            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No organizations found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'No organizations have been created yet'
                                }
                            </p>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Organization
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
