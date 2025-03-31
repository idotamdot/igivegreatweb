import { 
  users, connections, menuLinks, agreements, userAgreements,
  type User, type InsertUser, 
  type Connection, type InsertConnection, 
  type MenuLink, type InsertMenuLink,
  type Agreement, type InsertAgreement,
  type UserAgreement, type InsertUserAgreement 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
  updateOwnerCredentials(username: string, password: string): Promise<User>;
  
  // Connection methods
  createConnection(connection: InsertConnection): Promise<Connection>;
  getAllConnections(): Promise<Connection[]>;
  
  // Menu Links methods
  createMenuLink(menuLink: InsertMenuLink): Promise<MenuLink>;
  getAllMenuLinks(): Promise<MenuLink[]>;
  getMenuLink(id: number): Promise<MenuLink | undefined>;
  updateMenuLink(id: number, menuLink: Partial<InsertMenuLink>): Promise<MenuLink | undefined>;
  deleteMenuLink(id: number): Promise<void>;
  
  // Agreement methods
  createAgreement(agreement: InsertAgreement): Promise<Agreement>;
  getAgreement(id: number): Promise<Agreement | undefined>;
  getAllAgreements(): Promise<Agreement[]>;
  getActiveAgreements(): Promise<Agreement[]>;
  updateAgreement(id: number, agreement: Partial<InsertAgreement>): Promise<Agreement | undefined>;
  deleteAgreement(id: number): Promise<void>;
  
  // User Agreement methods
  createUserAgreement(userAgreement: InsertUserAgreement): Promise<UserAgreement>;
  getUserAgreement(userId: number, agreementId: number): Promise<UserAgreement | undefined>;
  getUserAgreements(userId: number): Promise<UserAgreement[]>;
  getAgreementUsers(agreementId: number): Promise<UserAgreement[]>;
  updateUserAgreement(id: number, signed: boolean, signedAt?: Date): Promise<UserAgreement | undefined>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private menuLinks: Map<number, MenuLink>;
  private agreements: Map<number, Agreement>;
  private userAgreements: Map<number, UserAgreement>;
  private userCurrentId: number;
  private connectionCurrentId: number;
  private menuLinkCurrentId: number;
  private agreementCurrentId: number;
  private userAgreementCurrentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.menuLinks = new Map();
    this.agreements = new Map();
    this.userAgreements = new Map();
    this.userCurrentId = 1;
    this.connectionCurrentId = 1;
    this.menuLinkCurrentId = 1;
    this.agreementCurrentId = 1;
    this.userAgreementCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Setup initial data synchronously, since storage needs to be ready immediately
    this._setupInitialData();
  }
  
  // Setup initial data as a private method
  private _setupInitialData() {
    // Add owner account
    this._addOwnerAccount();
    
    // Add default menu links
    this._addDefaultMenuLinks();
  }
  
  // Add owner account
  private _addOwnerAccount() {
    const id = this.userCurrentId++;
    const user: User = {
      id,
      username: "owner",
      password: "iloveai", // Will be hashed in auth.ts
      role: "owner",
    };
    this.users.set(id, user);
  }
  
  // Add default menu links as a private method
  private _addDefaultMenuLinks() {
    const defaultLinks: MenuLink[] = [
      {
        id: this.menuLinkCurrentId++,
        label: "birthdaybook.life",
        url: "https://birthdaybook.life",
        order: 1,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "birthdaybook.pro",
        url: "https://birthdaybook.pro",
        order: 2,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "entangledwiththeword.cloud",
        url: "https://entangledwiththeword.cloud",
        order: 3,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "propertystar",
        url: "#",
        order: 4,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "acalltoaction",
        url: "#",
        order: 5,
        active: true,
        createdAt: new Date()
      }
    ];
    
    for (const link of defaultLinks) {
      this.menuLinks.set(link.id, link);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    // Set default role to "staff" if not provided
    const role = insertUser.role || "staff";
    const user: User = { ...insertUser, id, role };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }
  
  async updateOwnerCredentials(username: string, password: string): Promise<User> {
    // Find the owner user
    const ownerUser = Array.from(this.users.values()).find(user => user.role === "owner");
    
    if (!ownerUser) {
      throw new Error("Owner user not found");
    }
    
    // Update the owner's credentials
    ownerUser.username = username;
    ownerUser.password = password;
    
    // Save the updated user
    this.users.set(ownerUser.id, ownerUser);
    
    return ownerUser;
  }
  
  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = this.connectionCurrentId++;
    const connection: Connection = { 
      ...insertConnection, 
      id, 
      createdAt: new Date() 
    };
    this.connections.set(id, connection);
    return connection;
  }
  
  async getAllConnections(): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createMenuLink(insertMenuLink: InsertMenuLink): Promise<MenuLink> {
    const id = this.menuLinkCurrentId++;
    // Set default values if not provided
    const order = insertMenuLink.order ?? 0; // Default to 0 if not provided
    const active = insertMenuLink.active ?? true; // Default to true if not provided
    
    const menuLink: MenuLink = {
      ...insertMenuLink,
      id,
      order,
      active,
      createdAt: new Date()
    };
    this.menuLinks.set(id, menuLink);
    return menuLink;
  }
  
  async getAllMenuLinks(): Promise<MenuLink[]> {
    return Array.from(this.menuLinks.values())
      .sort((a, b) => a.order - b.order);
  }
  
  async getMenuLink(id: number): Promise<MenuLink | undefined> {
    return this.menuLinks.get(id);
  }
  
  async updateMenuLink(id: number, menuLinkUpdate: Partial<InsertMenuLink>): Promise<MenuLink | undefined> {
    const existingMenuLink = this.menuLinks.get(id);
    if (!existingMenuLink) {
      return undefined;
    }
    
    const updatedMenuLink: MenuLink = {
      ...existingMenuLink,
      ...menuLinkUpdate
    };
    
    this.menuLinks.set(id, updatedMenuLink);
    return updatedMenuLink;
  }
  
  async deleteMenuLink(id: number): Promise<void> {
    this.menuLinks.delete(id);
  }
  
  // Agreement methods
  async createAgreement(insertAgreement: InsertAgreement): Promise<Agreement> {
    const id = this.agreementCurrentId++;
    const now = new Date();
    
    const agreement: Agreement = {
      ...insertAgreement,
      id,
      active: insertAgreement.active ?? true,
      createdAt: now,
      updatedAt: now
    };
    
    this.agreements.set(id, agreement);
    return agreement;
  }
  
  async getAgreement(id: number): Promise<Agreement | undefined> {
    return this.agreements.get(id);
  }
  
  async getAllAgreements(): Promise<Agreement[]> {
    return Array.from(this.agreements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getActiveAgreements(): Promise<Agreement[]> {
    return Array.from(this.agreements.values())
      .filter(agreement => agreement.active)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updateAgreement(id: number, agreementUpdate: Partial<InsertAgreement>): Promise<Agreement | undefined> {
    const existingAgreement = this.agreements.get(id);
    if (!existingAgreement) {
      return undefined;
    }
    
    const updatedAgreement: Agreement = {
      ...existingAgreement,
      ...agreementUpdate,
      updatedAt: new Date()
    };
    
    this.agreements.set(id, updatedAgreement);
    return updatedAgreement;
  }
  
  async deleteAgreement(id: number): Promise<void> {
    this.agreements.delete(id);
  }
  
  // User Agreement methods
  async createUserAgreement(insertUserAgreement: InsertUserAgreement): Promise<UserAgreement> {
    const id = this.userAgreementCurrentId++;
    const now = new Date();
    
    const userAgreement: UserAgreement = {
      ...insertUserAgreement,
      id,
      signed: insertUserAgreement.signed ?? false,
      signedAt: insertUserAgreement.signed ? (insertUserAgreement.signedAt || now) : null,
      createdAt: now
    };
    
    this.userAgreements.set(id, userAgreement);
    return userAgreement;
  }
  
  async getUserAgreement(userId: number, agreementId: number): Promise<UserAgreement | undefined> {
    return Array.from(this.userAgreements.values()).find(
      ua => ua.userId === userId && ua.agreementId === agreementId
    );
  }
  
  async getUserAgreements(userId: number): Promise<UserAgreement[]> {
    return Array.from(this.userAgreements.values())
      .filter(ua => ua.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getAgreementUsers(agreementId: number): Promise<UserAgreement[]> {
    return Array.from(this.userAgreements.values())
      .filter(ua => ua.agreementId === agreementId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updateUserAgreement(id: number, signed: boolean, signedAt?: Date): Promise<UserAgreement | undefined> {
    const existingUserAgreement = this.userAgreements.get(id);
    if (!existingUserAgreement) {
      return undefined;
    }
    
    const updatedUserAgreement: UserAgreement = {
      ...existingUserAgreement,
      signed,
      signedAt: signed ? (signedAt || new Date()) : null
    };
    
    this.userAgreements.set(id, updatedUserAgreement);
    return updatedUserAgreement;
  }
}

export const storage = new MemStorage();
