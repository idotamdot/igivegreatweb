import {
  users, sessions, aiOperators, projects, enterprises, invoices, invoiceLineItems, paymentPlans,
  type User, type UpsertUser,
  type AIOperator, type InsertAIOperator,
  type Project, type InsertProject,
  type Enterprise, type InsertEnterprise,
  type Invoice, type InsertInvoice,
  type InvoiceLineItem, type InsertInvoiceLineItem,
  type PaymentPlan, type InsertPaymentPlan
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Workload Identity Federation)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // AI Operator operations
  createAIOperator(operator: InsertAIOperator): Promise<AIOperator>;
  getAllAIOperators(): Promise<AIOperator[]>;
  getAIOperator(id: number): Promise<AIOperator | undefined>;
  updateAIOperatorMetrics(id: number, tasksCompleted: number, efficiency: number): Promise<AIOperator | undefined>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  updateProjectStatus(id: number, status: string): Promise<Project | undefined>;
  
  // Enterprise operations
  createEnterprise(enterprise: InsertEnterprise): Promise<Enterprise>;
  getAllEnterprises(): Promise<Enterprise[]>;
  getEnterprise(id: number): Promise<Enterprise | undefined>;
  
  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getAllInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  updateInvoiceStatus(id: number, status: string): Promise<Invoice | undefined>;
  
  // Invoice Line Item operations
  addInvoiceLineItem(lineItem: InsertInvoiceLineItem): Promise<InvoiceLineItem>;
  getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]>;
  
  // Payment Plan operations
  createPaymentPlan(paymentPlan: InsertPaymentPlan): Promise<PaymentPlan>;
  getAllPaymentPlans(): Promise<PaymentPlan[]>;
  getPaymentPlan(id: number): Promise<PaymentPlan | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Workload Identity Federation)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: userData,
      })
      .returning();
    return user;
  }

  // AI Operator operations
  async createAIOperator(operatorData: InsertAIOperator): Promise<AIOperator> {
    const [operator] = await db
      .insert(aiOperators)
      .values(operatorData)
      .returning();
    return operator;
  }

  async getAllAIOperators(): Promise<AIOperator[]> {
    return await db.select().from(aiOperators);
  }

  async getAIOperator(id: number): Promise<AIOperator | undefined> {
    const [operator] = await db.select().from(aiOperators).where(eq(aiOperators.id, id));
    return operator;
  }

  async updateAIOperatorMetrics(id: number, tasksCompleted: number, efficiency: number): Promise<AIOperator | undefined> {
    const [operator] = await db
      .update(aiOperators)
      .set({ tasksCompleted, efficiency })
      .where(eq(aiOperators.id, id))
      .returning();
    return operator;
  }

  // Project operations
  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async updateProjectStatus(id: number, status: string): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ status })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  // Enterprise operations
  async createEnterprise(enterpriseData: InsertEnterprise): Promise<Enterprise> {
    const [enterprise] = await db
      .insert(enterprises)
      .values(enterpriseData)
      .returning();
    return enterprise;
  }

  async getAllEnterprises(): Promise<Enterprise[]> {
    return await db.select().from(enterprises);
  }

  async getEnterprise(id: number): Promise<Enterprise | undefined> {
    const [enterprise] = await db.select().from(enterprises).where(eq(enterprises.id, id));
    return enterprise;
  }

  // Invoice operations
  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(invoiceData)
      .returning();
    return invoice;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async updateInvoiceStatus(id: number, status: string): Promise<Invoice | undefined> {
    const [invoice] = await db
      .update(invoices)
      .set({ status })
      .where(eq(invoices.id, id))
      .returning();
    return invoice;
  }

  // Invoice Line Item operations
  async addInvoiceLineItem(lineItemData: InsertInvoiceLineItem): Promise<InvoiceLineItem> {
    const [lineItem] = await db
      .insert(invoiceLineItems)
      .values(lineItemData)
      .returning();
    return lineItem;
  }

  async getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]> {
    return await db.select().from(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
  }

  // Payment Plan operations
  async createPaymentPlan(paymentPlanData: InsertPaymentPlan): Promise<PaymentPlan> {
    const [paymentPlan] = await db
      .insert(paymentPlans)
      .values(paymentPlanData)
      .returning();
    return paymentPlan;
  }

  async getAllPaymentPlans(): Promise<PaymentPlan[]> {
    return await db.select().from(paymentPlans);
  }

  async getPaymentPlan(id: number): Promise<PaymentPlan | undefined> {
    const [paymentPlan] = await db.select().from(paymentPlans).where(eq(paymentPlans.id, id));
    return paymentPlan;
  }
}

export const storage = new DatabaseStorage();