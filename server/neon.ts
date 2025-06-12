import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);

export async function createTables() {
  // Create users table for authentication
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create AI operators table
  await sql`
    CREATE TABLE IF NOT EXISTS ai_operators (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      efficiency_rating DECIMAL(3,2) DEFAULT 0.95,
      tasks_completed INTEGER DEFAULT 0,
      neural_network_type VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create business metrics table
  await sql`
    CREATE TABLE IF NOT EXISTS business_metrics (
      id SERIAL PRIMARY KEY,
      metric_name VARCHAR(255) NOT NULL,
      metric_value DECIMAL(15,2),
      metric_type VARCHAR(100),
      date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create services table
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2),
      category VARCHAR(100),
      neural_complexity VARCHAR(50),
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create client projects table
  await sql`
    CREATE TABLE IF NOT EXISTS client_projects (
      id SERIAL PRIMARY KEY,
      project_name VARCHAR(255) NOT NULL,
      client_name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'active',
      ai_operator_id INTEGER REFERENCES ai_operators(id),
      complexity_level VARCHAR(50),
      completion_percentage INTEGER DEFAULT 0,
      revenue DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create enterprise clients table
  await sql`
    CREATE TABLE IF NOT EXISTS enterprises (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      contact_person VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT NOT NULL,
      tax_id VARCHAR(100),
      industry VARCHAR(100),
      company_size VARCHAR(50),
      billing_cycle VARCHAR(20) DEFAULT 'monthly',
      payment_terms INTEGER DEFAULT 30,
      discount_rate DECIMAL(5,2) DEFAULT 0,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create invoices table
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(50) UNIQUE NOT NULL,
      enterprise_id INTEGER REFERENCES enterprises(id) NOT NULL,
      issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      due_date TIMESTAMP NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      tax_amount DECIMAL(12,2) DEFAULT 0,
      discount_amount DECIMAL(12,2) DEFAULT 0,
      total_amount DECIMAL(12,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD',
      status VARCHAR(20) DEFAULT 'draft',
      payment_method VARCHAR(50),
      payment_date TIMESTAMP,
      payment_reference VARCHAR(255),
      description TEXT NOT NULL,
      notes TEXT,
      terms TEXT,
      sent_at TIMESTAMP,
      viewed_at TIMESTAMP,
      reminders_sent INTEGER DEFAULT 0,
      last_reminder_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create invoice line items table
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_line_items (
      id SERIAL PRIMARY KEY,
      invoice_id INTEGER REFERENCES invoices(id) NOT NULL,
      description TEXT NOT NULL,
      service_type VARCHAR(100) NOT NULL,
      quantity DECIMAL(10,2) DEFAULT 1,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      project_id INTEGER,
      billing_period_start TIMESTAMP,
      billing_period_end TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create payment plans table
  await sql`
    CREATE TABLE IF NOT EXISTS payment_plans (
      id SERIAL PRIMARY KEY,
      enterprise_id INTEGER REFERENCES enterprises(id) NOT NULL,
      name VARCHAR(255) NOT NULL,
      total_amount DECIMAL(12,2) NOT NULL,
      installments INTEGER NOT NULL,
      installment_amount DECIMAL(12,2) NOT NULL,
      frequency VARCHAR(20) NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      current_installment INTEGER DEFAULT 1,
      next_payment_date TIMESTAMP NOT NULL,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      auto_charge BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log("Database tables created successfully");
}

export async function seedData() {
  // Seed AI operators
  await sql`
    INSERT INTO ai_operators (name, role, neural_network_type, efficiency_rating, tasks_completed) 
    VALUES 
      ('ARIA-7', 'Lead Development AI', 'Quantum Neural Matrix', 0.98, 2847),
      ('NEXUS-3', 'Security & Defense AI', 'Cybersecurity Neural Grid', 0.96, 1923),
      ('CIPHER-9', 'Business Operations AI', 'Strategic Analytics Network', 0.97, 3156),
      ('ECHO-5', 'Client Relations AI', 'Empathic Communication Matrix', 0.94, 1654),
      ('VORTEX-1', 'Infrastructure AI', 'Quantum Hosting Framework', 0.99, 4281),
      ('PULSE-4', 'Market Analysis AI', 'Predictive Intelligence Core', 0.95, 2039)
    ON CONFLICT DO NOTHING;
  `;

  // Seed business metrics
  await sql`
    INSERT INTO business_metrics (metric_name, metric_value, metric_type) 
    VALUES 
      ('Monthly Revenue', 125000.00, 'financial'),
      ('Profit Margin', 78.3, 'percentage'),
      ('Company Valuation', 2850000.00, 'financial'),
      ('Active Clients', 47, 'count'),
      ('Project Completion Rate', 96.7, 'percentage'),
      ('Neural Network Uptime', 99.8, 'percentage')
    ON CONFLICT DO NOTHING;
  `;

  // Seed services
  await sql`
    INSERT INTO services (name, description, price, category, neural_complexity) 
    VALUES 
      ('Autonomous AI Development', 'Complete AI-powered web application development', 15000.00, 'development', 'quantum'),
      ('Neural Cybersecurity Suite', 'Advanced AI-driven security monitoring and threat prevention', 8500.00, 'security', 'high'),
      ('Quantum Cloud Hosting', 'Next-generation hosting with neural load balancing', 2500.00, 'infrastructure', 'medium'),
      ('AI Business Intelligence', 'Predictive analytics and automated business insights', 12000.00, 'analytics', 'high'),
      ('Neural Network Consulting', 'Strategic AI implementation consulting', 5000.00, 'consulting', 'medium'),
      ('Cyberpunk UI/UX Design', 'Futuristic interface design with neural aesthetics', 7500.00, 'design', 'medium')
    ON CONFLICT DO NOTHING;
  `;

  // Seed client projects
  await sql`
    INSERT INTO client_projects (project_name, client_name, status, ai_operator_id, complexity_level, completion_percentage, revenue) 
    VALUES 
      ('Neural Banking Platform', 'CyberFinance Corp', 'active', 1, 'quantum', 78, 45000.00),
      ('AI Security Framework', 'TechSecure Industries', 'completed', 2, 'high', 100, 25000.00),
      ('Quantum E-commerce Hub', 'NeoCommerce Ltd', 'active', 3, 'high', 65, 35000.00),
      ('Neural Analytics Dashboard', 'DataCorp Enterprises', 'active', 6, 'medium', 42, 18000.00)
    ON CONFLICT DO NOTHING;
  `;

  // Seed enterprise clients
  await sql`
    INSERT INTO enterprises (name, email, contact_person, phone, address, tax_id, industry, company_size, billing_cycle, payment_terms, discount_rate) 
    VALUES 
      ('TechCorp Global', 'billing@techcorp.com', 'Sarah Chen', '+1-555-0123', '123 Innovation Drive, San Francisco, CA 94105', 'TC-2024-001', 'Technology', 'enterprise', 'quarterly', 45, 15.00),
      ('QuantumVentures LLC', 'finance@quantumventures.com', 'Marcus Rodriguez', '+1-555-0456', '789 Quantum Plaza, Austin, TX 78701', 'QV-2024-002', 'Venture Capital', 'large', 'monthly', 30, 10.00),
      ('CyberSecure Industries', 'accounts@cybersecure.com', 'Dr. Elena Volkov', '+1-555-0789', '456 Security Blvd, Seattle, WA 98101', 'CS-2024-003', 'Cybersecurity', 'large', 'annual', 60, 20.00),
      ('NeoCommerce Ltd', 'billing@neocommerce.co.uk', 'James Wellington', '+44-20-7946-0958', '42 Digital Street, London EC2A 3QR, UK', 'NC-UK-2024', 'E-commerce', 'medium', 'monthly', 30, 5.00)
    ON CONFLICT DO NOTHING;
  `;

  // Seed sample invoices
  await sql`
    INSERT INTO invoices (invoice_number, enterprise_id, due_date, amount, tax_amount, total_amount, description, status, terms) 
    VALUES 
      ('INV-2024-0001', 1, '2024-07-15 00:00:00', 125000.00, 12500.00, 137500.00, 'Q2 2024 - AI Development Platform & Quantum Hosting Services', 'sent', 'Payment due within 45 days. Late fees apply after due date.'),
      ('INV-2024-0002', 2, '2024-06-30 00:00:00', 85000.00, 8500.00, 93500.00, 'June 2024 - Neural Cybersecurity Suite Implementation', 'paid', 'Monthly recurring service. Auto-renewal applies.'),
      ('INV-2024-0003', 3, '2024-12-31 00:00:00', 250000.00, 25000.00, 275000.00, 'Annual Enterprise Security Contract - 2024', 'draft', 'Annual payment with 20% enterprise discount applied.'),
      ('INV-2024-0004', 4, '2024-06-25 00:00:00', 45000.00, 4500.00, 49500.00, 'May 2024 - E-commerce AI Integration Services', 'overdue', 'Payment overdue. Please remit immediately.')
    ON CONFLICT DO NOTHING;
  `;

  // Seed invoice line items
  await sql`
    INSERT INTO invoice_line_items (invoice_id, description, service_type, quantity, unit_price, total_price, billing_period_start, billing_period_end) 
    VALUES 
      (1, 'AI Autonomous Web Development - Enterprise License', 'ai-development', 1, 75000.00, 75000.00, '2024-04-01 00:00:00', '2024-06-30 00:00:00'),
      (1, 'Quantum Cloud Hosting - Premium Tier', 'quantum-hosting', 1, 25000.00, 25000.00, '2024-04-01 00:00:00', '2024-06-30 00:00:00'),
      (1, 'Neural Network Consulting - 100 Hours', 'consulting', 100, 250.00, 25000.00, '2024-04-01 00:00:00', '2024-06-30 00:00:00'),
      (2, 'Neural Cybersecurity Suite - Full Implementation', 'cybersecurity', 1, 85000.00, 85000.00, '2024-06-01 00:00:00', '2024-06-30 00:00:00'),
      (3, 'Enterprise Security Framework - Annual License', 'cybersecurity', 1, 200000.00, 200000.00, '2024-01-01 00:00:00', '2024-12-31 00:00:00'),
      (3, 'AI Business Intelligence - Annual Subscription', 'analytics', 1, 50000.00, 50000.00, '2024-01-01 00:00:00', '2024-12-31 00:00:00'),
      (4, 'AI E-commerce Platform Integration', 'ai-development', 1, 45000.00, 45000.00, '2024-05-01 00:00:00', '2024-05-31 00:00:00')
    ON CONFLICT DO NOTHING;
  `;

  // Seed payment plans
  await sql`
    INSERT INTO payment_plans (enterprise_id, name, total_amount, installments, installment_amount, frequency, next_payment_date, start_date, end_date) 
    VALUES 
      (1, 'TechCorp Quarterly Payment Plan', 275000.00, 4, 68750.00, 'quarterly', '2024-07-01 00:00:00', '2024-01-01 00:00:00', '2024-12-31 00:00:00'),
      (3, 'CyberSecure Annual Enterprise Plan', 550000.00, 2, 275000.00, 'quarterly', '2024-07-01 00:00:00', '2024-01-01 00:00:00', '2024-12-31 00:00:00')
    ON CONFLICT DO NOTHING;
  `;

  console.log("Database seeded with initial data");
}

export async function getAIOperators() {
  const data = await sql`SELECT * FROM ai_operators ORDER BY efficiency_rating DESC;`;
  return data;
}

export async function getBusinessMetrics() {
  const data = await sql`SELECT * FROM business_metrics ORDER BY date_recorded DESC;`;
  return data;
}

export async function getServices() {
  const data = await sql`SELECT * FROM services WHERE active = true ORDER BY price DESC;`;
  return data;
}

export async function getClientProjects() {
  const data = await sql`
    SELECT cp.*, ao.name as ai_operator_name 
    FROM client_projects cp 
    LEFT JOIN ai_operators ao ON cp.ai_operator_id = ao.id 
    ORDER BY cp.created_at DESC;
  `;
  return data;
}

export async function updateOperatorMetrics(operatorId: number, tasksCompleted: number, efficiency: number) {
  await sql`
    UPDATE ai_operators 
    SET tasks_completed = ${tasksCompleted}, efficiency_rating = ${efficiency}
    WHERE id = ${operatorId};
  `;
}

export async function createProject(projectData: {
  project_name: string;
  client_name: string;
  ai_operator_id: number;
  complexity_level: string;
  revenue: number;
}) {
  const result = await sql`
    INSERT INTO client_projects (project_name, client_name, ai_operator_id, complexity_level, revenue)
    VALUES (${projectData.project_name}, ${projectData.client_name}, ${projectData.ai_operator_id}, ${projectData.complexity_level}, ${projectData.revenue})
    RETURNING *;
  `;
  return result[0];
}

// Enterprise and Invoice Management Functions
export async function getEnterprises() {
  const data = await sql`
    SELECT e.*, 
           COUNT(i.id) as total_invoices,
           SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as total_paid,
           SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END) as total_overdue
    FROM enterprises e
    LEFT JOIN invoices i ON e.id = i.enterprise_id
    GROUP BY e.id
    ORDER BY e.created_at DESC;
  `;
  return data;
}

export async function getInvoices() {
  const data = await sql`
    SELECT i.*, e.name as enterprise_name, e.contact_person
    FROM invoices i
    JOIN enterprises e ON i.enterprise_id = e.id
    ORDER BY i.created_at DESC;
  `;
  return data;
}

export async function getInvoiceById(invoiceId: number) {
  const invoice = await sql`
    SELECT i.*, e.name as enterprise_name, e.contact_person, e.address, e.email, e.phone
    FROM invoices i
    JOIN enterprises e ON i.enterprise_id = e.id
    WHERE i.id = ${invoiceId};
  `;
  
  const lineItems = await sql`
    SELECT * FROM invoice_line_items 
    WHERE invoice_id = ${invoiceId}
    ORDER BY created_at;
  `;
  
  return {
    invoice: invoice[0],
    lineItems: lineItems
  };
}

export async function createEnterprise(enterpriseData: {
  name: string;
  email: string;
  contact_person: string;
  phone?: string;
  address: string;
  tax_id?: string;
  industry?: string;
  company_size?: string;
  billing_cycle?: string;
  payment_terms?: number;
  discount_rate?: number;
}) {
  const result = await sql`
    INSERT INTO enterprises (name, email, contact_person, phone, address, tax_id, industry, company_size, billing_cycle, payment_terms, discount_rate)
    VALUES (${enterpriseData.name}, ${enterpriseData.email}, ${enterpriseData.contact_person}, ${enterpriseData.phone || null}, ${enterpriseData.address}, ${enterpriseData.tax_id || null}, ${enterpriseData.industry || null}, ${enterpriseData.company_size || 'medium'}, ${enterpriseData.billing_cycle || 'monthly'}, ${enterpriseData.payment_terms || 30}, ${enterpriseData.discount_rate || 0})
    RETURNING *;
  `;
  return result[0];
}

export async function createInvoice(invoiceData: {
  enterprise_id: number;
  amount: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  description: string;
  due_date: string;
  terms?: string;
  notes?: string;
}) {
  // Generate invoice number
  const invoiceCount = await sql`SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE 'INV-2024-%';`;
  const nextNumber = String(parseInt(invoiceCount[0].count) + 1).padStart(4, '0');
  const invoiceNumber = `INV-2024-${nextNumber}`;
  
  const result = await sql`
    INSERT INTO invoices (invoice_number, enterprise_id, amount, tax_amount, discount_amount, total_amount, description, due_date, terms, notes)
    VALUES (${invoiceNumber}, ${invoiceData.enterprise_id}, ${invoiceData.amount}, ${invoiceData.tax_amount || 0}, ${invoiceData.discount_amount || 0}, ${invoiceData.total_amount}, ${invoiceData.description}, ${invoiceData.due_date}, ${invoiceData.terms || null}, ${invoiceData.notes || null})
    RETURNING *;
  `;
  return result[0];
}

export async function addInvoiceLineItem(lineItemData: {
  invoice_id: number;
  description: string;
  service_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  project_id?: number;
  billing_period_start?: string;
  billing_period_end?: string;
}) {
  const result = await sql`
    INSERT INTO invoice_line_items (invoice_id, description, service_type, quantity, unit_price, total_price, project_id, billing_period_start, billing_period_end)
    VALUES (${lineItemData.invoice_id}, ${lineItemData.description}, ${lineItemData.service_type}, ${lineItemData.quantity}, ${lineItemData.unit_price}, ${lineItemData.total_price}, ${lineItemData.project_id || null}, ${lineItemData.billing_period_start || null}, ${lineItemData.billing_period_end || null})
    RETURNING *;
  `;
  return result[0];
}

export async function updateInvoiceStatus(invoiceId: number, status: string, paymentData?: {
  payment_method?: string;
  payment_reference?: string;
  payment_date?: string;
}) {
  if (paymentData && status === 'paid') {
    const result = await sql`
      UPDATE invoices 
      SET status = ${status}, 
          payment_method = ${paymentData.payment_method || null},
          payment_reference = ${paymentData.payment_reference || null},
          payment_date = ${paymentData.payment_date || new Date().toISOString()},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${invoiceId}
      RETURNING *;
    `;
    return result[0];
  } else {
    const result = await sql`
      UPDATE invoices 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${invoiceId}
      RETURNING *;
    `;
    return result[0];
  }
}

export async function getPaymentPlans() {
  const data = await sql`
    SELECT pp.*, e.name as enterprise_name
    FROM payment_plans pp
    JOIN enterprises e ON pp.enterprise_id = e.id
    ORDER BY pp.next_payment_date ASC;
  `;
  return data;
}

export async function getInvoiceStats() {
  const stats = await sql`
    SELECT 
      COUNT(*) as total_invoices,
      SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as total_paid,
      SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) as total_overdue,
      SUM(CASE WHEN status = 'sent' THEN total_amount ELSE 0 END) as total_pending,
      SUM(CASE WHEN status = 'draft' THEN total_amount ELSE 0 END) as total_draft,
      AVG(total_amount) as average_invoice_amount
    FROM invoices;
  `;
  return stats[0];
}

export { sql };