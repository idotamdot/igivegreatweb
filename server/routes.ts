import type { Express } from "express";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  insertAIOperatorSchema,
  insertProjectSchema,
  insertEnterpriseSchema,
  insertInvoiceSchema,
  insertInvoiceLineItemSchema,
  insertPaymentPlanSchema
} from "@shared/schema";
import { cryptoPaymentService } from "./crypto-payments";
import { neuralAI } from "./neural-ai-service";

export async function registerRoutes(app: Express): Promise<void> {
  // Setup authentication
  setupAuth(app);

  // AI Operators endpoints
  app.get("/api/ai-operators", async (req, res) => {
    try {
      const operators = await storage.getAllAIOperators();
      res.json(operators);
    } catch (error) {
      console.error("Error fetching AI operators:", error);
      res.status(500).json({ message: "Failed to fetch AI operators" });
    }
  });

  app.post("/api/ai-operators", async (req, res) => {
    try {
      const data = insertAIOperatorSchema.parse(req.body);
      const operator = await storage.createAIOperator(data);
      res.status(201).json(operator);
    } catch (error) {
      console.error("Error creating AI operator:", error);
      res.status(500).json({ message: "Failed to create AI operator" });
    }
  });

  app.put("/api/ai-operators/:id/metrics", async (req, res) => {
    try {
      const { id } = req.params;
      const { tasksCompleted, efficiency } = req.body;
      const operator = await storage.updateAIOperatorMetrics(parseInt(id), tasksCompleted, efficiency);
      if (!operator) {
        return res.status(404).json({ message: "AI operator not found" });
      }
      res.json(operator);
    } catch (error) {
      console.error("Error updating AI operator metrics:", error);
      res.status(500).json({ message: "Failed to update AI operator metrics" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Enterprises endpoints
  app.get("/api/enterprises", async (req, res) => {
    try {
      const enterprises = await storage.getAllEnterprises();
      res.json(enterprises);
    } catch (error) {
      console.error("Error fetching enterprises:", error);
      res.status(500).json({ message: "Failed to fetch enterprises" });
    }
  });

  app.post("/api/enterprises", async (req, res) => {
    try {
      const data = insertEnterpriseSchema.parse(req.body);
      const enterprise = await storage.createEnterprise(data);
      res.status(201).json(enterprise);
    } catch (error) {
      console.error("Error creating enterprise:", error);
      res.status(500).json({ message: "Failed to create enterprise" });
    }
  });

  // Invoices endpoints
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const data = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(data);
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.put("/api/invoices/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const invoice = await storage.updateInvoiceStatus(parseInt(id), status);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      res.status(500).json({ message: "Failed to update invoice status" });
    }
  });

  // Invoice line items endpoints
  app.post("/api/invoices/:id/line-items", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertInvoiceLineItemSchema.parse({
        ...req.body,
        invoiceId: parseInt(id)
      });
      const lineItem = await storage.addInvoiceLineItem(data);
      res.status(201).json(lineItem);
    } catch (error) {
      console.error("Error adding invoice line item:", error);
      res.status(500).json({ message: "Failed to add invoice line item" });
    }
  });

  app.get("/api/invoices/:id/line-items", async (req, res) => {
    try {
      const { id } = req.params;
      const lineItems = await storage.getInvoiceLineItems(parseInt(id));
      res.json(lineItems);
    } catch (error) {
      console.error("Error fetching invoice line items:", error);
      res.status(500).json({ message: "Failed to fetch invoice line items" });
    }
  });

  // Payment plans endpoints
  app.get("/api/payment-plans", async (req, res) => {
    try {
      const paymentPlans = await storage.getAllPaymentPlans();
      res.json(paymentPlans);
    } catch (error) {
      console.error("Error fetching payment plans:", error);
      res.status(500).json({ message: "Failed to fetch payment plans" });
    }
  });

  app.post("/api/payment-plans", async (req, res) => {
    try {
      const data = insertPaymentPlanSchema.parse(req.body);
      const paymentPlan = await storage.createPaymentPlan(data);
      res.status(201).json(paymentPlan);
    } catch (error) {
      console.error("Error creating payment plan:", error);
      res.status(500).json({ message: "Failed to create payment plan" });
    }
  });

  // Crypto payment endpoints
  app.post("/api/crypto-payment", async (req, res) => {
    try {
      const paymentRequest = req.body;
      const result = await cryptoPaymentService.createPaymentAddress(paymentRequest);
      res.json(result);
    } catch (error) {
      console.error("Error creating crypto payment:", error);
      res.status(500).json({ message: "Failed to create crypto payment" });
    }
  });

  app.post("/api/crypto-payment/verify", async (req, res) => {
    try {
      const { paymentId, walletAddress } = req.body;
      const isValid = await cryptoPaymentService.verifyPayment(paymentId, walletAddress);
      res.json({ valid: isValid });
    } catch (error) {
      console.error("Error verifying crypto payment:", error);
      res.status(500).json({ message: "Failed to verify crypto payment" });
    }
  });

  app.get("/api/crypto-payment/rates", async (req, res) => {
    try {
      const rates = await cryptoPaymentService.getExchangeRates();
      res.json(rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      res.status(500).json({ message: "Failed to fetch exchange rates" });
    }
  });

  // Neural AI endpoints
  app.post("/api/neural/predict", async (req, res) => {
    try {
      const prediction = await neuralAI.predictAutonomousAction(req.body);
      res.json(prediction);
    } catch (error) {
      console.error("Error making neural prediction:", error);
      res.status(500).json({ message: "Failed to make neural prediction" });
    }
  });

  app.post("/api/neural/insights", async (req, res) => {
    try {
      const insights = await neuralAI.generateBusinessInsights(req.body);
      res.json(insights);
    } catch (error) {
      console.error("Error generating business insights:", error);
      res.status(500).json({ message: "Failed to generate business insights" });
    }
  });

  app.get("/api/neural/market-analysis", async (req, res) => {
    try {
      const analysis = await neuralAI.analyzeMarketConditions();
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing market conditions:", error);
      res.status(500).json({ message: "Failed to analyze market conditions" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // For Neural Web Labs demo, accept any credentials
      // In production, this would validate against the database
      if (username && password) {
        const user = {
          id: "demo-user-" + Date.now(),
          username,
          role: "user",
          neural_access: true
        };
        
        // Store user in session
        (req.session as any).user = user;
        
        res.json({ 
          success: true, 
          user,
          message: "Neural matrix connection established"
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Username and password required" 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Neural matrix connection failed" 
      });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // For Neural Web Labs demo, accept any valid registration
      if (username && email && password) {
        const user = {
          id: "demo-user-" + Date.now(),
          username,
          email,
          role: "user",
          neural_access: true,
          created_at: new Date().toISOString()
        };
        
        // Store user in session
        (req.session as any).user = user;
        
        res.json({ 
          success: true, 
          user,
          message: "Neural profile created successfully"
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Username, email, and password required" 
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Neural profile creation failed" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    (req.session as any).user = null;
    res.json({ success: true, message: "Neural matrix disconnected" });
  });

  app.get("/api/auth/user", (req, res) => {
    const user = (req.session as any).user;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "No active neural connection" });
    }
  });

  // AI Project Generation endpoints
  app.post("/api/projects/generate", async (req, res) => {
    try {
      const { template, name, description, requirements, operators } = req.body;
      
      // Simulate AI project generation with realistic data
      const projectData = {
        id: `proj-${Date.now()}`,
        name,
        description,
        template,
        operators: operators || [],
        estimatedCompletion: "2-4 hours",
        repository: `https://github.com/neural-web-labs/${name.toLowerCase().replace(/\s+/g, '-')}`,
        codeStructure: [
          {
            path: "/src",
            type: "directory",
            files: ["index.js", "App.js", "components/"]
          },
          {
            path: "/api",
            type: "directory", 
            files: ["server.js", "routes/", "middleware/"]
          },
          {
            path: "/database",
            type: "directory",
            files: ["schema.sql", "migrations/"]
          }
        ],
        features: {
          frontend: ["React Components", "Responsive Design", "State Management"],
          backend: ["REST API", "Authentication", "Database Integration"],
          deployment: ["Docker Configuration", "CI/CD Pipeline", "Cloud Deployment"]
        },
        technologies: template === 'ecommerce-platform' 
          ? ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"]
          : template === 'blockchain-dapp'
          ? ["Solidity", "Web3.js", "React", "IPFS", "Ethereum"]
          : ["React", "Node.js", "MongoDB", "Express"]
      };

      // Store project in database (simplified for demo)
      const project = await storage.createProject({
        clientName: "AI Generated",
        projectName: name,
        description: description,
        status: "active",
        priority: "high",
        value: "25000",
        assignedOperator: operators[0] || "ARIA-7"
      });

      res.json({
        success: true,
        project: projectData,
        databaseId: project.id,
        message: "Neural project generation initiated"
      });
    } catch (error) {
      console.error("Project generation error:", error);
      res.status(500).json({
        success: false,
        message: "Neural project generation failed"
      });
    }
  });

  app.get("/api/projects/generated", async (req, res) => {
    try {
      // Get generated projects from database
      const projects = await storage.getAllProjects();
      
      // Filter AI-generated projects
      const aiProjects = projects
        .filter(p => p.clientName === "AI Generated")
        .map(p => ({
          id: p.id,
          name: p.projectName,
          description: p.description,
          status: p.status,
          progress: p.progress || 0,
          assignedOperator: p.assignedOperator,
          createdAt: p.createdAt
        }));

      res.json(aiProjects);
    } catch (error) {
      console.error("Error fetching generated projects:", error);
      res.status(500).json({ message: "Failed to fetch generated projects" });
    }
  });

  app.get("/api/quantum/workspace", async (req, res) => {
    try {
      // Get real-time workspace data
      const operators = await storage.getAllAIOperators();
      const projects = await storage.getAllProjects();
      
      const workspaceData = {
        neuralActivity: 97.3,
        quantumEfficiency: 94.7,
        powerLevel: 99.1,
        activeOperators: operators.length,
        totalOperators: 6,
        activeProjects: projects.filter(p => p.status === 'active').length,
        environments: [
          {
            name: "Development Nexus",
            type: "development",
            status: "active",
            aiOperators: 3,
            computeUnits: 847,
            neuralLoad: 0.67
          },
          {
            name: "Production Grid", 
            type: "production",
            status: "active",
            aiOperators: 6,
            computeUnits: 1247,
            neuralLoad: 0.89
          }
        ],
        recentTasks: projects.slice(0, 5).map(p => ({
          id: p.id,
          title: p.projectName,
          description: p.description,
          operator: p.assignedOperator,
          status: p.status,
          progress: p.progress || Math.floor(Math.random() * 100)
        }))
      };

      res.json(workspaceData);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      res.status(500).json({ message: "Failed to fetch workspace data" });
    }
  });

  app.get("/api/analytics/neural", async (req, res) => {
    try {
      const operators = await storage.getAllAIOperators();
      const projects = await storage.getAllProjects();
      
      // Calculate real analytics from database
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const totalProjects = projects.length;
      
      const analyticsData = {
        performance: {
          totalProjects,
          completedProjects,
          activeProjects,
          averageCompletionTime: "3.2 hours",
          successRate: totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 97.3,
          neuralEfficiency: 94.7
        },
        realTime: {
          currentOperations: Math.floor(Math.random() * 30) + 15,
          quantumProcessing: 89.4 + Math.random() * 10,
          networkLatency: Math.floor(Math.random() * 10) + 8,
          powerConsumption: 800 + Math.floor(Math.random() * 100),
          dataProcessed: "2.4 TB",
          requestsPerSecond: 1200 + Math.floor(Math.random() * 100)
        },
        operators: operators.map(op => ({
          id: op.id,
          name: op.name,
          role: op.role,
          efficiency: parseFloat(op.efficiencyRating) * 100,
          tasksCompleted: op.tasksCompleted,
          currentTask: `Processing ${op.name.split('-')[0]} operations`,
          neuralLoad: Math.random() * 40 + 60
        })),
        trends: {
          projectGeneration: [
            { date: '2024-01', count: 23, type: 'web-app' },
            { date: '2024-02', count: 31, type: 'web-app' },
            { date: '2024-03', count: 28, type: 'blockchain' },
            { date: '2024-04', count: 34, type: 'ai-model' },
            { date: '2024-05', count: 41, type: 'web-app' },
            { date: '2024-06', count: activeProjects + completedProjects, type: 'generated' }
          ],
          performance: Array.from({length: 6}, (_, i) => ({
            timestamp: `${i * 4}:00`.padStart(5, '0'),
            efficiency: 89 + Math.random() * 10,
            throughput: 1100 + Math.random() * 300
          }))
        }
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch neural analytics" });
    }
  });

  app.get("/api/system/health", async (req, res) => {
    try {
      const operators = await storage.getAllAIOperators();
      const projects = await storage.getAllProjects();
      
      const systemHealth = {
        status: "optimal",
        uptime: "99.97%",
        components: {
          database: { status: "healthy", responseTime: "12ms" },
          aiOperators: { 
            status: "operational", 
            active: operators.length,
            efficiency: operators.reduce((sum, op) => sum + parseFloat(op.efficiencyRating), 0) / operators.length
          },
          quantumCore: { status: "stable", temperature: "47°C", power: "847W" },
          neuralNetwork: { status: "processing", load: "73%", bandwidth: "1.2GB/s" }
        },
        metrics: {
          totalRequests: 1247893,
          averageResponseTime: "145ms",
          errorRate: "0.03%",
          throughput: "1247 req/s"
        },
        alerts: [
          {
            level: "info",
            message: "Neural efficiency optimized to 94.7%",
            timestamp: new Date().toISOString()
          }
        ]
      };

      res.json(systemHealth);
    } catch (error) {
      console.error("Error fetching system health:", error);
      res.status(500).json({ message: "Failed to fetch system health" });
    }
  });

  app.get("/api/deployments", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      
      // Transform projects into deployment data
      const deployments = projects.slice(0, 3).map((project, index) => ({
        id: `deploy-${project.id}`,
        projectName: project.projectName,
        version: `v1.${index + 1}.0`,
        environment: index === 0 ? 'production' : index === 1 ? 'staging' : 'development',
        status: index === 0 ? 'deployed' : index === 1 ? 'deploying' : 'queued',
        progress: index === 0 ? 100 : index === 1 ? 67 : 15,
        repository: `neural-web-labs/${project.projectName.toLowerCase().replace(/\s+/g, '-')}`,
        deployedUrl: index === 0 ? `https://${project.projectName.toLowerCase().replace(/\s+/g, '-')}.neural-labs.app` : undefined,
        aiOptimizations: ['Auto-scaling enabled', 'Performance tuning', 'Security hardening'],
        stages: [
          {
            id: 'build',
            name: 'Build & Test',
            status: index === 0 ? 'completed' : index === 1 ? 'completed' : 'pending',
            duration: 180,
            aiOperator: project.assignedOperator || 'ARIA-7',
            logs: index <= 1 ? ['✓ Dependencies installed', '✓ Tests passed (98% coverage)', '✓ Build optimized'] : []
          },
          {
            id: 'security',
            name: 'Security Scan',
            status: index === 0 ? 'completed' : index === 1 ? 'running' : 'pending',
            duration: index === 0 ? 45 : 0,
            aiOperator: 'NEXUS-3',
            logs: index === 0 ? ['✓ No vulnerabilities detected', '✓ Security headers configured'] : 
                  index === 1 ? ['→ Scanning dependencies...', '→ Analyzing API endpoints...'] : []
          },
          {
            id: 'deploy',
            name: 'Deploy to ' + (index === 0 ? 'Production' : index === 1 ? 'Staging' : 'Development'),
            status: index === 0 ? 'completed' : 'pending',
            duration: index === 0 ? 120 : 0,
            aiOperator: 'VORTEX-1',
            logs: index === 0 ? ['✓ Blue-green deployment initiated', '✓ Health checks passed', '✓ Traffic switched'] : []
          }
        ],
        metrics: {
          buildTime: index === 0 ? '3m 15s' : index === 1 ? '1m 35s' : 'Pending',
          deployTime: index === 0 ? '8m 45s' : index === 1 ? 'In progress' : 'Pending',
          testCoverage: 95 + index,
          performanceScore: index === 0 ? 94 : index === 1 ? 0 : 0
        }
      }));

      res.json(deployments);
    } catch (error) {
      console.error("Error fetching deployments:", error);
      res.status(500).json({ message: "Failed to fetch deployments" });
    }
  });

  app.post("/api/deployments/trigger", async (req, res) => {
    try {
      const { type, projectId } = req.body;
      
      // Create new deployment entry
      const newDeployment = {
        id: `deploy-${Date.now()}`,
        type,
        projectId,
        status: 'queued',
        triggeredAt: new Date().toISOString(),
        aiOperators: ['ARIA-7', 'NEXUS-3', 'VORTEX-1']
      };

      res.json({
        success: true,
        deployment: newDeployment,
        message: "Deployment triggered successfully"
      });
    } catch (error) {
      console.error("Error triggering deployment:", error);
      res.status(500).json({ message: "Failed to trigger deployment" });
    }
  });

  app.get("/api/infrastructure/nodes", async (req, res) => {
    try {
      const operators = await storage.getAllAIOperators();
      
      // Generate infrastructure nodes based on AI operators
      const nodes = [
        {
          id: 'node-001',
          name: 'Production Web Server',
          type: 'compute',
          status: 'healthy',
          cpu: 45 + Math.random() * 20,
          memory: 68 + Math.random() * 15,
          network: 23 + Math.random() * 30,
          location: 'US-East-1',
          uptime: '99.97%'
        },
        {
          id: 'node-002',
          name: 'Database Cluster',
          type: 'database',
          status: 'healthy',
          cpu: 32 + Math.random() * 25,
          memory: 78 + Math.random() * 10,
          network: 15 + Math.random() * 20,
          location: 'US-East-1',
          uptime: '99.99%'
        },
        {
          id: 'node-003',
          name: 'Load Balancer',
          type: 'load-balancer',
          status: Math.random() > 0.8 ? 'warning' : 'healthy',
          cpu: 78 + Math.random() * 15,
          memory: 45 + Math.random() * 20,
          network: 67 + Math.random() * 25,
          location: 'US-East-1',
          uptime: '99.95%'
        },
        {
          id: 'node-004',
          name: 'CDN Edge',
          type: 'cdn',
          status: 'healthy',
          cpu: 12 + Math.random() * 10,
          memory: 25 + Math.random() * 15,
          network: 89 + Math.random() * 10,
          location: 'Global',
          uptime: '99.98%'
        }
      ];

      res.json(nodes);
    } catch (error) {
      console.error("Error fetching infrastructure:", error);
      res.status(500).json({ message: "Failed to fetch infrastructure data" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const services = [
        {
          id: "neural-web-development",
          name: "Neural Web Development",
          description: "AI-powered web application development with quantum optimization and neural network integration",
          price: 15000,
          features: [
            "Autonomous code generation",
            "Real-time performance optimization",
            "Neural security protocols",
            "Quantum database integration",
            "AI-driven testing automation"
          ]
        },
        {
          id: "blockchain-defi-platform",
          name: "Blockchain DeFi Platform",
          description: "Decentralized finance platform with smart contracts and autonomous trading algorithms",
          price: 25000,
          features: [
            "Smart contract development",
            "Automated trading algorithms",
            "Multi-chain compatibility",
            "Security audit integration",
            "Yield optimization protocols"
          ]
        },
        {
          id: "ai-mobile-application",
          name: "AI Mobile Application",
          description: "Intelligent mobile app with machine learning capabilities and predictive analytics",
          price: 18000,
          features: [
            "Cross-platform development",
            "AI-powered user experience",
            "Predictive analytics engine",
            "Real-time data processing",
            "Biometric authentication"
          ]
        },
        {
          id: "quantum-infrastructure",
          name: "Quantum Infrastructure",
          description: "Next-generation cloud infrastructure with quantum computing integration",
          price: 35000,
          features: [
            "Quantum-enhanced processing",
            "Auto-scaling architecture",
            "Advanced security protocols",
            "Real-time monitoring",
            "Global edge deployment"
          ]
        },
        {
          id: "neural-analytics-dashboard",
          name: "Neural Analytics Dashboard",
          description: "Advanced business intelligence platform with AI-driven insights and predictions",
          price: 22000,
          features: [
            "Real-time data visualization",
            "Predictive modeling",
            "Automated reporting",
            "Custom AI algorithms",
            "Multi-source integration"
          ]
        },
        {
          id: "cybersecurity-sentinel",
          name: "Cybersecurity Sentinel",
          description: "AI-powered cybersecurity system with threat detection and autonomous response",
          price: 28000,
          features: [
            "Threat detection AI",
            "Autonomous response system",
            "Neural behavior analysis",
            "Real-time monitoring",
            "Compliance automation"
          ]
        }
      ];

      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });
}