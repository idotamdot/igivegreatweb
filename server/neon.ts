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

export { sql };