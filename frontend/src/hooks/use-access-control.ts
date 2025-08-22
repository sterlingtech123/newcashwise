import { useAuthStore } from '@/stores/auth-store';

export interface NavigationItem {
    name: string;
    href?: string;
    icon: string;
    description: string;
    roles: string[];
    subItems?: NavigationItem[];
    isHeader?: boolean;
}

export interface NavigationPage {
    name: string;
    href: string;
    icon: string;
    description: string;
    roles: string[];
}

export const useAccessControl = () => {
    const { user } = useAuthStore();

    const getAccessibleNavigation = (): NavigationItem[] => {
        if (!user) return [];

        const userRoles = user.roles || [];
        const navigation: NavigationItem[] = [];

        // Payment Initiation (Header with sub-menus) - FIRST
        navigation.push({
            name: 'Payment Initiation',
            icon: 'CreditCard',
            description: 'Payment processing and management',
            roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'department_head', 'user'],
            isHeader: true,
            subItems: [
                {
                    name: 'Payment Request',
                    href: '/payment-requests',
                    icon: 'FileText',
                    description: 'Create and manage payment requests',
                    roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'department_head', 'user']
                },
                {
                    name: 'Payment Confirmation',
                    href: '/payment-confirmation',
                    icon: 'CheckCircle',
                    description: 'Review and approve payment requests',
                    roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager']
                }
            ]
        });

        // Payment Approvals (Header with sub-menus) - SECOND
        navigation.push({
            name: 'Payment Approvals',
            icon: 'Shield',
            description: 'Budget approval workflow stages',
            roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'governor'],
            isHeader: true,
            subItems: [
                {
                    name: 'Budget Verification',
                    href: '/budgets/verification',
                    icon: 'Shield',
                    description: 'Review and verify budget submissions',
                    roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager']
                },
                {
                    name: 'Governor\'s Approval',
                    href: '/budgets/governor-approval',
                    icon: 'Crown',
                    description: 'Governor approval workflow',
                    roles: ['admin', 'super_admin', 'governor']
                },
                {
                    name: 'Finance Confirmation',
                    href: '/budgets/finance-confirmation',
                    icon: 'DollarSign',
                    description: 'Financial review and confirmation',
                    roles: ['admin', 'super_admin', 'finance', 'accountant', 'finance_director']
                }
            ]
        });

        // Financial Management (Header with sub-menus) - THIRD
        navigation.push({
            name: 'Financial Management',
            icon: 'Calculator',
            description: 'Budget and accounting management',
            roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'department_head', 'user'],
            isHeader: true,
            subItems: [
                {
                    name: 'Budget Management',
                    href: '/budgets',
                    icon: 'Calculator',
                    description: 'Budget planning and management',
                    roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'department_head', 'user']
                },
                {
                    name: 'Accounting Setup',
                    href: '/admin/accounting',
                    icon: 'Calculator',
                    description: 'Chart of accounts and GL setup',
                    roles: ['admin', 'super_admin', 'finance', 'accountant']
                }
            ]
        });

        // User & Organization Admin (Header with sub-menus) - FOURTH
        navigation.push({
            name: 'User & Organization Admin',
            icon: 'Users',
            description: 'User and organization management',
            roles: ['admin', 'super_admin'],
            isHeader: true,
            subItems: [
                {
                    name: 'User Management',
                    href: '/admin/users',
                    icon: 'Users',
                    description: 'Manage system users and roles',
                    roles: ['admin', 'super_admin']
                },
                {
                    name: 'Organization Management',
                    href: '/admin/organizations',
                    icon: 'Building2',
                    description: 'Manage departments and structure',
                    roles: ['admin', 'super_admin']
                }
            ]
        });

        // System Administration (Header with sub-menus) - FIFTH
        navigation.push({
            name: 'System Administration',
            icon: 'Settings',
            description: 'System configuration and workflow management',
            roles: ['admin', 'super_admin'],
            isHeader: true,
            subItems: [
                {
                    name: 'System Configuration',
                    href: '/admin/system-config',
                    icon: 'Settings',
                    description: 'System settings and preferences',
                    roles: ['admin', 'super_admin']
                },
                {
                    name: 'Workflow Configuration',
                    href: '/admin/workflows',
                    icon: 'Workflow',
                    description: 'Approval workflows and policies',
                    roles: ['admin', 'super_admin']
                }
            ]
        });

        // Finance Tools
        if (userRoles.includes('finance') || userRoles.includes('accountant')) {
            navigation.push({
                name: 'Chart of Accounts',
                href: '/finance/chart-of-accounts',
                icon: 'BookOpen',
                description: 'Manage chart of accounts',
                roles: ['finance', 'accountant']
            });

            navigation.push({
                name: 'Journal Entries',
                href: '/finance/journal-entries',
                icon: 'FileText',
                description: 'Create and manage journal entries',
                roles: ['finance', 'accountant']
            });

            navigation.push({
                name: 'Trial Balance',
                href: '/finance/trial-balance',
                icon: 'BarChart3',
                description: 'View trial balance reports',
                roles: ['finance', 'accountant']
            });
        }

        // Management Tools
        if (userRoles.includes('manager') || userRoles.includes('department_head')) {
            navigation.push({
                name: 'Department Overview',
                href: '/management/department-overview',
                icon: 'Building2',
                description: 'Department budget overview',
                roles: ['manager', 'department_head']
            });

            navigation.push({
                name: 'Team Management',
                href: '/management/team-management',
                icon: 'Users',
                description: 'Manage team members and budgets',
                roles: ['manager', 'department_head']
            });
        }

        return navigation;
    };

    const getAccessiblePages = (): NavigationPage[] => {
        if (!user) return [];

        const userRoles = user.roles || [];
        const pages: NavigationPage[] = [];

        // Always accessible pages
        pages.push({
            name: 'Dashboard',
            href: '/dashboard',
            icon: 'LayoutDashboard',
            description: 'Main dashboard overview',
            roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'department_head', 'user']
        });

        pages.push({
            name: 'Reports & Analytics',
            href: '/reports',
            icon: 'BarChart3',
            description: 'Financial reports and analytics',
            roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'department_head', 'user']
        });

        pages.push({
            name: 'Automation Agents',
            href: '/automation',
            icon: 'Bot',
            description: 'Automated workflows and tasks',
            roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager']
        });

        pages.push({
            name: 'Notifications',
            href: '/notifications',
            icon: 'Bell',
            description: 'System notifications and alerts',
            roles: ['admin', 'super_admin', 'finance', 'accountant', 'manager', 'department_head', 'user']
        });

        return pages;
    };

    return {
        getAccessibleNavigation,
        getAccessiblePages
    };
};
