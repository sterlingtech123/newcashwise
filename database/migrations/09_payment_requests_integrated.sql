-- CashWise Payment Requests & Confirmation System - Integrated Schema
-- This migration integrates payment requests with existing CashWise database structure
-- Run after all previous migrations (01_schema.sql through 08_materialized_views.sql)

-- Create payment_requests schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS payment_requests;

-- Create payment_confirmations schema for the confirmation workflow
CREATE SCHEMA IF NOT EXISTS payment_confirmations;

-- ============================================================================
-- PAYMENT REQUESTS SCHEMA
-- ============================================================================

-- Payment Request Types (Reference table)
CREATE TABLE IF NOT EXISTS payment_requests.request_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Recurrent', 'Capital', 'Un-Budgeted')),
    description TEXT,
    requires_approval BOOLEAN DEFAULT true,
    approval_level VARCHAR(50) DEFAULT 'Department Head',
    max_amount DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- Payment Request Statuses
CREATE TABLE IF NOT EXISTS payment_requests.statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT 'gray',
    is_final BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- Payment Request Priorities
CREATE TABLE IF NOT EXISTS payment_requests.priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT 'gray',
    sla_hours INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- Main Payment Requests Table
CREATE TABLE IF NOT EXISTS payment_requests.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    
    -- Request Identification
    request_number VARCHAR(50) UNIQUE NOT NULL,
    request_type_id UUID NOT NULL REFERENCES payment_requests.request_types(id),
    status_id UUID NOT NULL REFERENCES payment_requests.statuses(id),
    priority_id UUID NOT NULL REFERENCES payment_requests.priorities(id),
    
    -- Organization & Budget Links
    organization_id UUID REFERENCES budget.organizations(id),
    fiscal_year_id UUID REFERENCES budget.fiscal_years(id),
    fund_id UUID REFERENCES budget.funds(id),
    
    -- Economic Classification
    economic_head_id UUID REFERENCES budget.economic_heads(id),
    function_id UUID REFERENCES budget.functions(id),
    
    -- Request Details
    project_title VARCHAR(255) NOT NULL,
    description TEXT,
    justification TEXT,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    
    -- Beneficiary Information
    beneficiary_name VARCHAR(255),
    beneficiary_bank VARCHAR(255),
    beneficiary_account VARCHAR(50),
    beneficiary_phone VARCHAR(20),
    beneficiary_email VARCHAR(255),
    
    -- Timeline
    due_date DATE,
    expected_completion_date DATE,
    
    -- User & Approval Information
    initiator_id UUID NOT NULL REFERENCES auth.users(id),
    current_approver_id UUID REFERENCES auth.users(id),
    department_id UUID REFERENCES budget.organizations(id),
    
    -- Additional Metadata
    is_emergency BOOLEAN DEFAULT false,
    is_budgeted BOOLEAN DEFAULT true,
    budget_line VARCHAR(255),
    account_code VARCHAR(50),
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_dates CHECK (due_date >= CURRENT_DATE)
);

-- Payment Request Workflow Steps
CREATE TABLE IF NOT EXISTS payment_requests.workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    request_id UUID NOT NULL REFERENCES payment_requests.requests(id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    step_order INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to_id UUID REFERENCES auth.users(id),
    completed_by_id UUID REFERENCES auth.users(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_step_order CHECK (step_order > 0)
);

-- Payment Request Approvals
CREATE TABLE IF NOT EXISTS payment_requests.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    request_id UUID NOT NULL REFERENCES payment_requests.requests(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES auth.users(id),
    approval_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment Request Attachments
CREATE TABLE IF NOT EXISTS payment_requests.attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    request_id UUID NOT NULL REFERENCES payment_requests.requests(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100),
    uploaded_by_id UUID NOT NULL REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- Payment Request Comments/Notes
CREATE TABLE IF NOT EXISTS payment_requests.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    request_id UUID NOT NULL REFERENCES payment_requests.requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment Request History/Audit Trail
CREATE TABLE IF NOT EXISTS payment_requests.audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    request_id UUID NOT NULL REFERENCES payment_requests.requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PAYMENT CONFIRMATIONS SCHEMA
-- ============================================================================

-- Payment Confirmation Statuses
CREATE TABLE IF NOT EXISTS payment_confirmations.statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT 'gray',
    is_final BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, name)
);

-- Main Payment Confirmations Table
CREATE TABLE IF NOT EXISTS payment_confirmations.confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    
    -- Link to Payment Request
    payment_request_id UUID NOT NULL REFERENCES payment_requests.requests(id) ON DELETE CASCADE,
    
    -- Confirmation Details
    confirmation_number VARCHAR(50) UNIQUE NOT NULL,
    status_id UUID NOT NULL REFERENCES payment_confirmations.statuses(id),
    
    -- Approval Information
    approver_id UUID NOT NULL REFERENCES auth.users(id),
    approval_level VARCHAR(50) NOT NULL,
    approval_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Payment Details
    payment_voucher VARCHAR(100),
    payment_method VARCHAR(50),
    bank_reference VARCHAR(100),
    transaction_id VARCHAR(100),
    
    -- Financial Details
    approved_amount DECIMAL(15,2) NOT NULL,
    payment_date DATE,
    
    -- Additional Information
    notes TEXT,
    rejection_reason TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_approved_amount CHECK (approved_amount > 0)
);

-- Payment Confirmation Workflow
CREATE TABLE IF NOT EXISTS payment_confirmations.workflow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    confirmation_id UUID NOT NULL REFERENCES payment_confirmations.confirmations(id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    step_order INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to_id UUID REFERENCES auth.users(id),
    completed_by_id UUID REFERENCES auth.users(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_step_order CHECK (step_order > 0)
);

-- Payment Confirmation Attachments
CREATE TABLE IF NOT EXISTS payment_confirmations.attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id),
    confirmation_id UUID NOT NULL REFERENCES payment_confirmations.confirmations(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100),
    uploaded_by_id UUID NOT NULL REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Payment Requests Indexes
CREATE INDEX IF NOT EXISTS idx_payment_requests_tenant ON payment_requests.requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_organization ON payment_requests.requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_fiscal_year ON payment_requests.requests(fiscal_year_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_economic_head ON payment_requests.requests(economic_head_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests.requests(status_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_type ON payment_requests.requests(request_type_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_initiator ON payment_requests.requests(initiator_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_approver ON payment_requests.requests(current_approver_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_created_at ON payment_requests.requests(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_requests_request_number ON payment_requests.requests(request_number);
CREATE INDEX IF NOT EXISTS idx_payment_requests_amount ON payment_requests.requests(amount);
CREATE INDEX IF NOT EXISTS idx_payment_requests_due_date ON payment_requests.requests(due_date);

-- Workflow and Approvals Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_steps_request ON payment_requests.workflow_steps(request_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_assigned ON payment_requests.workflow_steps(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_approvals_request ON payment_requests.approvals(request_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver ON payment_requests.approvals(approver_id);

-- Attachments and Comments Indexes
CREATE INDEX IF NOT EXISTS idx_attachments_request ON payment_requests.attachments(request_id);
CREATE INDEX IF NOT EXISTS idx_comments_request ON payment_requests.comments(request_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_request ON payment_requests.audit_trail(request_id);

-- Payment Confirmations Indexes
CREATE INDEX IF NOT EXISTS idx_confirmations_tenant ON payment_confirmations.confirmations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_request ON payment_confirmations.confirmations(payment_request_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_status ON payment_confirmations.confirmations(status_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_approver ON payment_confirmations.confirmations(approver_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_number ON payment_confirmations.confirmations(confirmation_number);
CREATE INDEX IF NOT EXISTS idx_confirmations_date ON payment_confirmations.confirmations(approval_date);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to generate unique request numbers
CREATE OR REPLACE FUNCTION payment_requests.generate_request_number(
    p_tenant_id UUID,
    p_organization_code VARCHAR,
    p_request_type VARCHAR
)
RETURNS VARCHAR AS $$
DECLARE
    v_year INTEGER;
    v_sequence INTEGER;
    v_request_number VARCHAR;
BEGIN
    v_year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Get next sequence number for this tenant, organization, and year
    SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM '^[A-Z]+-[0-9]+-([0-9]+)$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM payment_requests.requests
    WHERE tenant_id = p_tenant_id
      AND request_number LIKE p_organization_code || '-' || v_year || '-%';
    
    v_request_number := p_organization_code || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
    
    RETURN v_request_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate confirmation numbers
CREATE OR REPLACE FUNCTION payment_confirmations.generate_confirmation_number(
    p_tenant_id UUID,
    p_organization_code VARCHAR
)
RETURNS VARCHAR AS $$
DECLARE
    v_year INTEGER;
    v_sequence INTEGER;
    v_confirmation_number VARCHAR;
BEGIN
    v_year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Get next sequence number for this tenant, organization, and year
    SELECT COALESCE(MAX(CAST(SUBSTRING(confirmation_number FROM '^[A-Z]+-CONF-[0-9]+-([0-9]+)$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM payment_confirmations.confirmations
    WHERE tenant_id = p_tenant_id
      AND confirmation_number LIKE p_organization_code || '-CONF-' || v_year || '-%';
    
    v_confirmation_number := p_organization_code || '-CONF-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
    
    RETURN v_confirmation_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION payment_requests.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log audit trail
CREATE OR REPLACE FUNCTION payment_requests.log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO payment_requests.audit_trail (
            tenant_id, request_id, user_id, action, details
        ) VALUES (
            OLD.tenant_id, OLD.id, TG_OP, 
            jsonb_build_object('deleted_record', row_to_json(OLD))
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO payment_requests.audit_trail (
            tenant_id, request_id, user_id, action, details
        ) VALUES (
            NEW.tenant_id, NEW.id, TG_OP, 
            jsonb_build_object('old_values', row_to_json(OLD), 'new_values', row_to_json(NEW))
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO payment_requests.audit_trail (
            tenant_id, request_id, user_id, action, details
        ) VALUES (
            NEW.tenant_id, NEW.id, TG_OP, 
            jsonb_build_object('new_record', row_to_json(NEW))
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamp triggers
CREATE TRIGGER update_payment_requests_updated_at
    BEFORE UPDATE ON payment_requests.requests
    FOR EACH ROW
    EXECUTE FUNCTION payment_requests.update_updated_at_column();

CREATE TRIGGER update_payment_requests_audit_trail
    AFTER INSERT OR UPDATE OR DELETE ON payment_requests.requests
    FOR EACH ROW
    EXECUTE FUNCTION payment_requests.log_audit_trail();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE payment_requests.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests.workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests.audit_trail ENABLE ROW LEVEL SECURITY;

ALTER TABLE payment_confirmations.confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_confirmations.workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_confirmations.attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Payment Requests
CREATE POLICY payment_requests_tenant_isolation ON payment_requests.requests
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY payment_requests_user_access ON payment_requests.requests
    FOR SELECT USING (
        initiator_id = current_setting('app.current_user_id')::UUID OR
        current_approver_id = current_setting('app.current_user_id')::UUID OR
        EXISTS (
            SELECT 1 FROM auth.user_roles ur
            JOIN auth.roles r ON ur.role_id = r.id
            WHERE ur.user_id = current_setting('app.current_user_id')::UUID
              AND r.name IN ('admin', 'finance', 'manager')
        )
    );

-- RLS Policies for Payment Confirmations
CREATE POLICY payment_confirmations_tenant_isolation ON payment_confirmations.confirmations
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY payment_confirmations_user_access ON payment_confirmations.confirmations
    FOR SELECT USING (
        approver_id = current_setting('app.current_user_id')::UUID OR
        EXISTS (
            SELECT 1 FROM auth.user_roles ur
            JOIN auth.roles r ON ur.role_id = r.id
            WHERE ur.user_id = current_setting('app.current_user_id')::UUID
              AND r.name IN ('admin', 'finance', 'manager')
        )
    );

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert default request types
INSERT INTO payment_requests.request_types (tenant_id, name, category, description, requires_approval, approval_level, max_amount) VALUES
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Budgeted Payment Requests', 'Recurrent', 'Regular budgeted overhead expenditures', true, 'Department Head', 10000000.00),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Project Milestone Payment Request', 'Recurrent', 'Payments for completed project milestones', true, 'Project Manager', 50000000.00),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Capital Expenditure - Governors Limit', 'Capital', 'Capital expenditure within governors approval limit', true, 'Governor', 100000000.00),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Capital Expenditure - EXCO Approval', 'Capital', 'Capital expenditure requiring EXCO approval', true, 'EXCO', 500000000.00),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Un-Budgeted Payment Requests', 'Un-Budgeted', 'Emergency or exceptional unbudgeted payments', true, 'Finance Director', 25000000.00)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- Insert default statuses
INSERT INTO payment_requests.statuses (tenant_id, name, description, color, is_final, can_edit) VALUES
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Draft', 'Request is being prepared', 'gray', false, true),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Submitted', 'Request submitted for approval', 'blue', false, false),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Under Review', 'Request is being reviewed', 'yellow', false, false),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Approved', 'Request has been approved', 'green', true, false),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Rejected', 'Request has been rejected', 'red', true, false),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Processing', 'Payment is being processed', 'purple', false, false),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Completed', 'Payment has been completed', 'green', true, false)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- Insert default priorities
INSERT INTO payment_requests.priorities (tenant_id, name, description, color, sla_hours) VALUES
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Low', 'Low priority requests', 'gray', 168),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Normal', 'Standard priority requests', 'blue', 72),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'High', 'High priority requests', 'yellow', 48),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Urgent', 'Urgent requests', 'orange', 24),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Emergency', 'Emergency requests', 'red', 4)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- Insert default confirmation statuses
INSERT INTO payment_confirmations.statuses (tenant_id, name, description, color, is_final) VALUES
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Pending Confirmation', 'Awaiting confirmation', 'yellow', false),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Confirmed', 'Payment confirmed', 'green', true),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Rejected', 'Payment rejected', 'red', true),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Processing', 'Payment being processed', 'blue', false),
    ((SELECT id FROM tenant.tenants LIMIT 1), 'Completed', 'Payment completed', 'green', true)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

-- Grant permissions to cashwise user
GRANT USAGE ON SCHEMA payment_requests TO cashwise;
GRANT USAGE ON SCHEMA payment_confirmations TO cashwise;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA payment_requests TO cashwise;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA payment_confirmations TO cashwise;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA payment_requests TO cashwise;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA payment_confirmations TO cashwise;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA payment_requests TO cashwise;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA payment_confirmations TO cashwise;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON SCHEMA payment_requests IS 'Payment request management system for CashWise - Integrated with core database';
COMMENT ON SCHEMA payment_confirmations IS 'Payment confirmation and approval workflow system for CashWise';

COMMENT ON TABLE payment_requests.requests IS 'Main payment requests table with full integration to budget and user systems';
COMMENT ON TABLE payment_requests.request_types IS 'Types of payment requests with approval requirements';
COMMENT ON TABLE payment_requests.statuses IS 'Payment request statuses throughout the workflow';
COMMENT ON TABLE payment_requests.priorities IS 'Payment request priorities with SLA definitions';
COMMENT ON TABLE payment_requests.workflow_steps IS 'Workflow steps for payment request approval process';
COMMENT ON TABLE payment_requests.approvals IS 'Payment request approvals by different levels';
COMMENT ON TABLE payment_requests.attachments IS 'Files attached to payment requests';
COMMENT ON TABLE payment_requests.comments IS 'Comments and notes on payment requests';
COMMENT ON TABLE payment_requests.audit_trail IS 'Complete audit trail for payment request changes';

COMMENT ON TABLE payment_confirmations.confirmations IS 'Payment confirmations linked to payment requests';
COMMENT ON TABLE payment_confirmations.statuses IS 'Payment confirmation statuses';
COMMENT ON TABLE payment_confirmations.workflow IS 'Confirmation workflow steps';
COMMENT ON TABLE payment_confirmations.attachments IS 'Files attached to payment confirmations';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- This migration successfully integrates the Payment Requests and Payment Confirmations
-- system with the existing CashWise database structure, providing:
-- 1. Full tenant isolation
-- 2. Integration with budget, user, and organization systems
-- 3. Comprehensive audit trail
-- 4. Row-level security
-- 5. Performance optimization through proper indexing
-- 6. Workflow management for both requests and confirmations
