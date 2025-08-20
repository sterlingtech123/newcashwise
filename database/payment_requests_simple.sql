-- Simplified Payment Requests Schema
-- This creates the main tables without complex foreign key dependencies

-- Create main Payment Requests Table
CREATE TABLE IF NOT EXISTS payment_requests.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    request_type_id UUID NOT NULL,
    status_id UUID NOT NULL,
    priority_id UUID NOT NULL,
    
    -- General Information
    mda_name VARCHAR(255) NOT NULL,
    mda_code VARCHAR(20) NOT NULL,
    economic_head_name VARCHAR(255),
    economic_head_code VARCHAR(20),
    budget_cycle_name VARCHAR(255),
    budget_cycle_year VARCHAR(4),
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    project_title VARCHAR(255),
    description TEXT,
    justification TEXT,
    
    -- Beneficiary Information
    beneficiary_name VARCHAR(255),
    beneficiary_bank VARCHAR(255),
    beneficiary_account VARCHAR(50),
    due_date DATE,
    
    -- Economic Classification
    economic_code VARCHAR(20),
    function_code VARCHAR(20),
    fund_code VARCHAR(20),
    category VARCHAR(100) DEFAULT 'Other',
    organization_code VARCHAR(50),
    economic_line_item_description TEXT,
    
    -- Metadata
    initiator_name VARCHAR(255) NOT NULL,
    initiator_email VARCHAR(255),
    current_approver_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Additional Fields
    is_emergency BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]',
    notes TEXT,
    
    -- Audit Fields
    created_by_name VARCHAR(255) NOT NULL,
    updated_by_name VARCHAR(255)
);

-- Create Payment Request Workflow Steps
CREATE TABLE IF NOT EXISTS payment_requests.workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_order INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to_name VARCHAR(255),
    completed_by_name VARCHAR(255),
    completed_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Payment Request Approvals
CREATE TABLE IF NOT EXISTS payment_requests.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL,
    approver_name VARCHAR(255) NOT NULL,
    approval_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Payment Request Attachments
CREATE TABLE IF NOT EXISTS payment_requests.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100),
    uploaded_by_name VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Payment Request Comments/Notes
CREATE TABLE IF NOT EXISTS payment_requests.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Payment Request History/Audit Trail
CREATE TABLE IF NOT EXISTS payment_requests.audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_requests_mda ON payment_requests.requests(mda_code);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests.requests(status_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_type ON payment_requests.requests(request_type_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_created_at ON payment_requests.requests(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_requests_request_number ON payment_requests.requests(request_number);

-- Create indexes for workflow and approvals
CREATE INDEX IF NOT EXISTS idx_workflow_steps_request ON payment_requests.workflow_steps(request_id);
CREATE INDEX IF NOT EXISTS idx_approvals_request ON payment_requests.approvals(request_id);
CREATE INDEX IF NOT EXISTS idx_attachments_request ON payment_requests.attachments(request_id);
CREATE INDEX IF NOT EXISTS idx_comments_request ON payment_requests.comments(request_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_request ON payment_requests.audit_trail(request_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION payment_requests.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_payment_requests_updated_at
    BEFORE UPDATE ON payment_requests.requests
    FOR EACH ROW
    EXECUTE FUNCTION payment_requests.update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA payment_requests TO cashwise;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA payment_requests TO cashwise;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA payment_requests TO cashwise;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA payment_requests TO cashwise;

-- Insert sample data for testing
INSERT INTO payment_requests.requests (
    request_number,
    request_type_id,
    status_id,
    priority_id,
    mda_name,
    mda_code,
    economic_head_name,
    economic_head_code,
    budget_cycle_name,
    budget_cycle_year,
    amount,
    project_title,
    description,
    justification,
    beneficiary_name,
    beneficiary_bank,
    beneficiary_account,
    due_date,
    economic_code,
    function_code,
    fund_code,
    category,
    organization_code,
    economic_line_item_description,
    initiator_name,
    initiator_email,
    created_by_name
) VALUES (
    'MOE-2025-0001',
    (SELECT id FROM payment_requests.request_types WHERE name = 'Budgeted Payment Requests' LIMIT 1),
    (SELECT id FROM payment_requests.statuses WHERE name = 'Draft' LIMIT 1),
    (SELECT id FROM payment_requests.priorities WHERE name = 'Normal' LIMIT 1),
    'Ministry of Education',
    'MOE',
    'Software Licensing and Laptops',
    '2101',
    '2025 Budget Cycle',
    '2025',
    1750000.00,
    'Purchase of Budget Software',
    'For efficient budgeting and financial management',
    'Essential for improving budget planning and monitoring',
    'Tech Solutions Ltd',
    'GT Bank',
    '0123456789',
    '2025-12-31',
    '2101',
    '01',
    '01',
    'Other',
    'MOE001',
    'Budget management software licenses and hardware',
    'Super Admin',
    'admin@cashwise.com',
    'Super Admin'
) ON CONFLICT (request_number) DO NOTHING;

COMMENT ON SCHEMA payment_requests IS 'Payment request management system for CashWise';
COMMENT ON TABLE payment_requests.requests IS 'Main payment requests table';
COMMENT ON TABLE payment_requests.request_types IS 'Types of payment requests';
COMMENT ON TABLE payment_requests.statuses IS 'Payment request statuses';
COMMENT ON TABLE payment_requests.priorities IS 'Payment request priorities';
COMMENT ON TABLE payment_requests.workflow_steps IS 'Workflow steps for payment requests';
COMMENT ON TABLE payment_requests.approvals IS 'Payment request approvals';
COMMENT ON TABLE payment_requests.attachments IS 'Files attached to payment requests';
COMMENT ON TABLE payment_requests.comments IS 'Comments on payment requests';
COMMENT ON TABLE payment_requests.audit_trail IS 'Audit trail for payment requests';
