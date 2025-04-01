import { 
  users, connections, menuLinks,
  type User, type InsertUser, 
  type Connection, type InsertConnection, 
  type MenuLink, type InsertMenuLink
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
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private menuLinks: Map<number, MenuLink>;
  private userCurrentId: number;
  private connectionCurrentId: number;
  private menuLinkCurrentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.menuLinks = new Map();
    this.userCurrentId = 1;
    this.connectionCurrentId = 1;
    this.menuLinkCurrentId = 1;
    
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
    // Create a hashed password (format: hash.salt)
    // This matches the format created by hashPassword() in auth.ts
    const hashedPassword = "c4ea21bb365bbeeaf5f2c654883e56d11e43c44a4f0c7347f0c8641821862c1bb38c799a313567a8df2f42a5d490787b2b34a6d407d8e7427b6d61f88465bde0.f1a9cce152c65bbdb1fee56e97de578a";
    
    const user: User = {
      id,
      username: "owner",
      password: hashedPassword,
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
        pageContent: null,
        hasPage: false,
        order: 1,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "birthdaybook.pro",
        url: "https://birthdaybook.pro",
        pageContent: null,
        hasPage: false,
        order: 2,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "entangledwiththeword.cloud",
        url: "https://entangledwiththeword.cloud",
        pageContent: null,
        hasPage: false,
        order: 3,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "propertystar",
        url: "#",
        pageContent: "# PropertyStar\n\nComing soon - an innovative property management solution.",
        hasPage: true,
        order: 4,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "acalltoaction",
        url: "#",
        pageContent: "# A Call To Action\n\nThis page is under development. Stay tuned for updates!",
        hasPage: true,
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
    // Set default role to "admin" 
    const role = insertUser.role || "admin";
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
    const hasPage = insertMenuLink.hasPage ?? false; // Default to false if not provided
    const pageContent = hasPage ? (insertMenuLink.pageContent || "") : null; // Default to empty string for pages, null otherwise
    
    const menuLink: MenuLink = {
      ...insertMenuLink,
      id,
      order,
      active,
      hasPage,
      pageContent,
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
    
    // Process hasPage and pageContent separately to handle the relationship between them
    const hasPage = menuLinkUpdate.hasPage !== undefined ? menuLinkUpdate.hasPage : existingMenuLink.hasPage;
    let pageContent = menuLinkUpdate.pageContent !== undefined ? menuLinkUpdate.pageContent : existingMenuLink.pageContent;
    
    // If switching to hasPage=true and pageContent is null, set default empty content
    if (hasPage && pageContent === null) {
      pageContent = "";
    }
    
    // If switching to hasPage=false, set pageContent to null
    if (!hasPage) {
      pageContent = null;
    }
    
    // Create updated menu link with processed values
    const updatedMenuLink: MenuLink = {
      ...existingMenuLink,
      ...menuLinkUpdate,
      hasPage,
      pageContent
    };
    
    this.menuLinks.set(id, updatedMenuLink);
    return updatedMenuLink;
  }
  
  async deleteMenuLink(id: number): Promise<void> {
    this.menuLinks.delete(id);
  }
}

export const storage = new MemStorage();
