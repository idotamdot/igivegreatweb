import { users, connections, type User, type InsertUser, type Connection, type InsertConnection } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with CRUD methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
  
  createConnection(connection: InsertConnection): Promise<Connection>;
  getAllConnections(): Promise<Connection[]>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private userCurrentId: number;
  private connectionCurrentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.userCurrentId = 1;
    this.connectionCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Add the default owner account
    this.createUser({
      username: "owner",
      password: "iloveai", // Will be hashed in auth.ts
      role: "owner",
    });
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
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
}

export const storage = new MemStorage();
