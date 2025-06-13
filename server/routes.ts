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
}