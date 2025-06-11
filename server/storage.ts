import { 
  users, connections, menuLinks, artworks, printSizes, artworkPrintSizes, printOrders, contentBlocks, dashboardWidgets, dashboardLayouts,
  psiCategories, psiValues, psiProducts, psiProductValues, psiReviews, psiSearches,
  type User, type InsertUser, 
  type Connection, type InsertConnection, 
  type MenuLink, type InsertMenuLink,
  type Artwork, type InsertArtwork,
  type PrintSize, type InsertPrintSize,
  type ArtworkPrintSize, type InsertArtworkPrintSize,
  type PrintOrder, type InsertPrintOrder,
  type ContentBlock, type InsertContentBlock,
  type DashboardWidget, type InsertDashboardWidget,
  type DashboardLayout, type InsertDashboardLayout,
  type PsiCategory, type InsertPsiCategory,
  type PsiValue, type InsertPsiValue,
  type PsiProduct, type InsertPsiProduct,
  type PsiProductValue,
  type PsiReview, type InsertPsiReview,
  type PsiSearch, type InsertPsiSearch
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
  getUserMenuLinks(userId: number): Promise<MenuLink[]>;
  getApprovedMenuLinks(): Promise<MenuLink[]>;
  updateMenuLinkApproval(id: number, approved: boolean): Promise<MenuLink | undefined>;
  getSharedMenuLinks(userId: number): Promise<MenuLink[]>;
  
  // Artwork methods
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;
  getAllArtworks(): Promise<Artwork[]>;
  getArtwork(id: number): Promise<Artwork | undefined>;
  updateArtwork(id: number, artwork: Partial<InsertArtwork>): Promise<Artwork | undefined>;
  deleteArtwork(id: number): Promise<void>;
  getFeaturedArtworks(): Promise<Artwork[]>;
  
  // Print Size methods
  createPrintSize(printSize: InsertPrintSize): Promise<PrintSize>;
  getAllPrintSizes(): Promise<PrintSize[]>;
  getPrintSize(id: number): Promise<PrintSize | undefined>;
  updatePrintSize(id: number, printSize: Partial<InsertPrintSize>): Promise<PrintSize | undefined>;
  deletePrintSize(id: number): Promise<void>;
  
  // Artwork Print Size methods
  createArtworkPrintSize(artworkPrintSize: InsertArtworkPrintSize): Promise<ArtworkPrintSize>;
  getArtworkPrintSizes(artworkId: number): Promise<ArtworkPrintSize[]>;
  getArtworkPrintSizesWithDetails(artworkId: number): Promise<(ArtworkPrintSize & PrintSize)[]>;
  updateArtworkPrintSize(id: number, artworkPrintSize: Partial<InsertArtworkPrintSize>): Promise<ArtworkPrintSize | undefined>;
  deleteArtworkPrintSize(id: number): Promise<void>;
  
  // Print Order methods
  createPrintOrder(order: InsertPrintOrder): Promise<PrintOrder>;
  getPrintOrder(id: number): Promise<PrintOrder | undefined>;
  getUserPrintOrders(userId: number): Promise<PrintOrder[]>;
  getAllPrintOrders(): Promise<PrintOrder[]>;
  updatePrintOrderStatus(id: number, status: string, trackingNumber?: string): Promise<PrintOrder | undefined>;
  updatePrintOrderPaymentInfo(id: number, stripePaymentId: string): Promise<PrintOrder | undefined>;
  updatePrintOrderPrintingInfo(id: number, printingServiceOrderId: string): Promise<PrintOrder | undefined>;
  
  // Content management methods
  createContentBlock(contentBlock: InsertContentBlock): Promise<ContentBlock>;
  getAllContentBlocks(): Promise<ContentBlock[]>;
  getContentBlock(id: number): Promise<ContentBlock | undefined>;
  getContentBlockByKey(key: string): Promise<ContentBlock | undefined>;
  getActiveContentBlocksByPlacement(placement: string): Promise<ContentBlock[]>;
  updateContentBlock(id: number, contentBlock: Partial<InsertContentBlock>): Promise<ContentBlock | undefined>;
  deleteContentBlock(id: number): Promise<void>;
  
  // Dashboard Widget methods
  createDashboardWidget(widget: InsertDashboardWidget): Promise<DashboardWidget>;
  getAllDashboardWidgets(): Promise<DashboardWidget[]>;
  getDashboardWidget(id: number): Promise<DashboardWidget | undefined>;
  getDashboardWidgetsByRole(role: string): Promise<DashboardWidget[]>;
  getDashboardWidgetsByUser(userId: number): Promise<DashboardWidget[]>;
  getDashboardWidgetsByUserAndRole(userId: number, role: string): Promise<DashboardWidget[]>;
  updateDashboardWidget(id: number, widget: Partial<InsertDashboardWidget>): Promise<DashboardWidget | undefined>;
  deleteDashboardWidget(id: number): Promise<void>;
  
  // Dashboard Layout methods
  createDashboardLayout(layout: InsertDashboardLayout): Promise<DashboardLayout>;
  getDashboardLayout(userId: number, role: string): Promise<DashboardLayout | undefined>;
  updateDashboardLayout(id: number, layout: Partial<InsertDashboardLayout>): Promise<DashboardLayout | undefined>;
  deleteDashboardLayout(id: number): Promise<void>;
  
  // PSI Category methods
  createPsiCategory(category: InsertPsiCategory): Promise<PsiCategory>;
  getAllPsiCategories(): Promise<PsiCategory[]>;
  getPsiCategory(id: number): Promise<PsiCategory | undefined>;
  updatePsiCategory(id: number, category: Partial<InsertPsiCategory>): Promise<PsiCategory | undefined>;
  deletePsiCategory(id: number): Promise<void>;
  getActivePsiCategories(): Promise<PsiCategory[]>;
  
  // PSI Value methods
  createPsiValue(value: InsertPsiValue): Promise<PsiValue>;
  getAllPsiValues(): Promise<PsiValue[]>;
  getPsiValue(id: number): Promise<PsiValue | undefined>;
  updatePsiValue(id: number, value: Partial<InsertPsiValue>): Promise<PsiValue | undefined>;
  deletePsiValue(id: number): Promise<void>;
  getActivePsiValues(): Promise<PsiValue[]>;
  
  // PSI Product methods
  createPsiProduct(product: InsertPsiProduct): Promise<PsiProduct>;
  getAllPsiProducts(includeInactive?: boolean): Promise<PsiProduct[]>;
  getPsiProduct(id: number): Promise<PsiProduct | undefined>;
  updatePsiProduct(id: number, product: Partial<InsertPsiProduct>): Promise<PsiProduct | undefined>;
  deletePsiProduct(id: number): Promise<void>;
  getFeaturedPsiProducts(): Promise<PsiProduct[]>;
  getApprovedPsiProducts(): Promise<PsiProduct[]>;
  getUserPsiProducts(userId: number): Promise<PsiProduct[]>;
  searchPsiProducts(query: string, filters?: any): Promise<PsiProduct[]>;
  getPsiProductsByCategory(categoryId: number): Promise<PsiProduct[]>;
  
  // PSI Review methods
  createPsiReview(review: InsertPsiReview): Promise<PsiReview>;
  getPsiProductReviews(productId: number): Promise<PsiReview[]>;
  getUserPsiReviews(userId: number): Promise<PsiReview[]>;
  updatePsiReview(id: number, review: Partial<InsertPsiReview>): Promise<PsiReview | undefined>;
  deletePsiReview(id: number): Promise<void>;
  getApprovedPsiReviews(productId: number): Promise<PsiReview[]>;
  
  // PSI Search methods
  createPsiSearch(search: InsertPsiSearch): Promise<PsiSearch>;
  getUserPsiSearches(userId: number): Promise<PsiSearch[]>;
  getPopularPsiSearches(limit?: number): Promise<PsiSearch[]>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connections: Map<number, Connection>;
  private menuLinks: Map<number, MenuLink>;
  private artworks: Map<number, Artwork>;
  private printSizes: Map<number, PrintSize>;
  private artworkPrintSizes: Map<number, ArtworkPrintSize>;
  private printOrders: Map<number, PrintOrder>;
  private contentBlocks: Map<number, ContentBlock>;
  private dashboardWidgets: Map<number, DashboardWidget>;
  private dashboardLayouts: Map<number, DashboardLayout>;
  
  private userCurrentId: number;
  private connectionCurrentId: number;
  private menuLinkCurrentId: number;
  private artworkCurrentId: number;
  private printSizeCurrentId: number;
  private artworkPrintSizeCurrentId: number;
  private printOrderCurrentId: number;
  private contentBlockCurrentId: number;
  private dashboardWidgetCurrentId: number;
  private dashboardLayoutCurrentId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.connections = new Map();
    this.menuLinks = new Map();
    this.artworks = new Map();
    this.printSizes = new Map();
    this.artworkPrintSizes = new Map();
    this.printOrders = new Map();
    this.contentBlocks = new Map();
    this.dashboardWidgets = new Map();
    this.dashboardLayouts = new Map();
    
    this.userCurrentId = 1;
    this.connectionCurrentId = 1;
    this.menuLinkCurrentId = 1;
    this.artworkCurrentId = 1;
    this.printSizeCurrentId = 1;
    this.artworkPrintSizeCurrentId = 1;
    this.printOrderCurrentId = 1;
    this.contentBlockCurrentId = 1;
    this.dashboardWidgetCurrentId = 1;
    this.dashboardLayoutCurrentId = 1;
    
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
    
    // Add initial print sizes
    this._addInitialPrintSizes();
    
    // Add sample artworks
    this._addSampleArtworks();
    
    // Add initial content blocks
    this._addInitialContentBlocks();
    
    // Add default dashboard widgets
    this._addDefaultDashboardWidgets();
  }
  
  // Add default dashboard widgets
  private _addDefaultDashboardWidgets() {
    const defaultWidgets = [
      {
        name: "Recent Connections",
        type: "recent-connections",
        config: JSON.stringify({
          limit: 5,
          showDate: true,
          showEmail: true
        }),
        position: 0,
        width: "half",
        roles: ["admin", "owner"],
        active: true
      },
      {
        name: "Recent Orders",
        type: "recent-orders",
        config: JSON.stringify({
          limit: 5,
          showStatus: true,
          showAmount: true
        }),
        position: 1,
        width: "half",
        roles: ["admin", "owner"],
        active: true
      },
      {
        name: "Gallery Stats",
        type: "gallery-stats",
        config: JSON.stringify({
          showTotalArtworks: true,
          showTotalSales: true,
          showTopCategories: true
        }),
        position: 2,
        width: "third",
        roles: ["admin", "owner"],
        active: true
      },
      {
        name: "Menu Links",
        type: "menu-links-overview",
        config: JSON.stringify({
          showPending: true,
          showActive: true,
          showCount: true
        }),
        position: 3,
        width: "third",
        roles: ["admin", "owner", "staff"],
        active: true
      },
      {
        name: "Activity Log",
        type: "activity-log",
        config: JSON.stringify({
          limit: 10,
          showTime: true,
          showUser: true
        }),
        position: 4,
        width: "third",
        roles: ["admin", "owner", "staff"],
        active: true
      },
      {
        name: "Your Projects",
        type: "client-projects",
        config: JSON.stringify({
          limit: 5,
          showStatus: true,
          showDeadline: true
        }),
        position: 0,
        width: "full",
        roles: ["client"],
        active: true
      },
      {
        name: "Messages",
        type: "client-messages",
        config: JSON.stringify({
          limit: 5,
          showDate: true,
          showPreview: true
        }),
        position: 1,
        width: "half",
        roles: ["client"],
        active: true
      },
      {
        name: "Recent Files",
        type: "client-files",
        config: JSON.stringify({
          limit: 5,
          showSize: true,
          showType: true
        }),
        position: 2,
        width: "half",
        roles: ["client"],
        active: true
      }
    ];
    
    defaultWidgets.forEach(widget => {
      const dashboardWidget: DashboardWidget = {
        id: this.dashboardWidgetCurrentId++,
        name: widget.name,
        type: widget.type,
        config: widget.config,
        position: widget.position,
        width: widget.width,
        height: "auto",
        roles: widget.roles,
        active: widget.active,
        createdAt: new Date(),
        userId: null
      };
      
      this.dashboardWidgets.set(dashboardWidget.id, dashboardWidget);
    });
  }
  
  // Add initial content blocks as a private method
  private _addInitialContentBlocks() {
    const defaultContent = [
      {
        key: "home-hero",
        title: "Welcome to igivegreatweb.com",
        content: "Creating meaningful digital experiences with stunning design and powerful functionality.",
        placement: "home",
        active: true,
        metaData: JSON.stringify({ 
          animation: "glow",
          showCta: true,
          ctaLabel: "let's connect",
          ctaAction: "dialog"
        })
      },
      {
        key: "about-intro",
        title: "About igivegreatweb",
        content: "We build beautiful, responsive websites that work flawlessly across all devices while maintaining a focus on accessibility and performance.",
        placement: "about",
        active: true,
        metaData: JSON.stringify({ 
          animation: "fade",
          bgColor: "dark"
        })
      },
      {
        key: "services-intro",
        title: "Our Services",
        content: "From web development to design systems, we provide a comprehensive suite of digital solutions.",
        placement: "services",
        active: true,
        metaData: JSON.stringify({ 
          animation: "slide",
          showDivider: true
        })
      },
      {
        key: "gallery-intro",
        title: "Art Gallery",
        content: "Explore our curated collection of original artwork and high-quality prints.",
        placement: "gallery",
        active: true,
        metaData: JSON.stringify({ 
          animation: "typing",
          typingSpeed: "medium"
        })
      }
    ];
    
    defaultContent.forEach(item => {
      const contentBlock: ContentBlock = {
        id: this.contentBlockCurrentId++,
        key: item.key,
        title: item.title,
        content: item.content,
        placement: item.placement,
        active: item.active,
        metaData: item.metaData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.contentBlocks.set(contentBlock.id, contentBlock);
    });
  }
  
  // Add initial print sizes
  private _addInitialPrintSizes() {
    const sizes = [
      { name: "Small (8x10)", width: "8", height: "10", priceFactor: "1.0", active: true },
      { name: "Medium (11x14)", width: "11", height: "14", priceFactor: "1.5", active: true },
      { name: "Large (16x20)", width: "16", height: "20", priceFactor: "2.0", active: true },
      { name: "Extra Large (24x36)", width: "24", height: "36", priceFactor: "3.0", active: true }
    ];
    
    sizes.forEach(size => {
      const printSize: PrintSize = {
        id: this.printSizeCurrentId++,
        name: size.name,
        width: size.width,
        height: size.height,
        priceFactor: size.priceFactor,
        active: size.active
      };
      this.printSizes.set(printSize.id, printSize);
    });
  }
  
  // Add sample artworks
  private _addSampleArtworks() {
    const artworks = [
      {
        title: "Urban Glow",
        description: "A vibrant cityscape with neon lights reflecting off wet streets, capturing the energy of urban nightlife.",
        artistName: "Alex Rivera",
        imageUrl: "https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        originalAvailable: true,
        originalPrice: "2400",
        category: "Cityscape",
        dimensions: "36x48 inches",
        medium: "Acrylic on Canvas",
        featured: true
      },
      {
        title: "Serenity Shore",
        description: "A peaceful beach scene at sunset with gentle waves and soft, golden light illuminating the coastline.",
        artistName: "Maria Johnson",
        imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        originalAvailable: false,
        originalPrice: "1800",
        category: "Landscape",
        dimensions: "24x36 inches",
        medium: "Oil on Canvas",
        featured: true
      },
      {
        title: "Abstract Fusion",
        description: "Bold, geometric forms in contrasting colors create a dynamic composition suggesting movement and tension.",
        artistName: "Jamal Williams",
        imageUrl: "https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        originalAvailable: true,
        originalPrice: "3200",
        category: "Abstract",
        dimensions: "40x40 inches",
        medium: "Mixed Media",
        featured: false
      },
      {
        title: "Forest Whispers",
        description: "A misty forest scene with sunlight filtering through ancient trees, creating a magical atmosphere.",
        artistName: "Emma Chen",
        imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
        originalAvailable: true,
        originalPrice: "2800",
        category: "Landscape",
        dimensions: "30x40 inches",
        medium: "Watercolor",
        featured: true
      }
    ];
    
    artworks.forEach(artData => {
      const artwork: Artwork = {
        id: this.artworkCurrentId++,
        title: artData.title,
        description: artData.description,
        artistName: artData.artistName,
        imageUrl: artData.imageUrl,
        originalAvailable: artData.originalAvailable,
        originalPrice: artData.originalPrice,
        category: artData.category,
        dimensions: artData.dimensions,
        medium: artData.medium,
        featured: artData.featured,
        visible: true,
        createdAt: new Date()
      };
      this.artworks.set(artwork.id, artwork);
      
      // Add print sizes for each artwork
      const printSizeIds = Array.from(this.printSizes.keys());
      printSizeIds.forEach(printSizeId => {
        const printSize = this.printSizes.get(printSizeId)!;
        
        // Base price varies by artwork
        let basePrice = 0;
        switch(artwork.category) {
          case "Abstract":
            basePrice = 120;
            break;
          case "Landscape":
            basePrice = 150;
            break;
          case "Cityscape":
            basePrice = 180;
            break;
          default:
            basePrice = 100;
        }
        
        // Calculate price based on print size factor
        const price = Math.round(basePrice * parseFloat(printSize.priceFactor));
        
        const artworkPrintSize: ArtworkPrintSize = {
          id: this.artworkPrintSizeCurrentId++,
          artworkId: artwork.id,
          printSizeId: printSize.id,
          price: price.toString(),
          inStock: true
        };
        
        this.artworkPrintSizes.set(artworkPrintSize.id, artworkPrintSize);
      });
    });
  }
  
  // Add owner account
  private _addOwnerAccount() {
    const id = this.userCurrentId++;
    // Create a hashed password for "admin" (format: hash.salt)
    // This matches the format created by hashPassword() in auth.ts
    const hashedPassword = "ef64b808bb8479c7f808de576c9ed13022dada0b73578b15af38f801b14133968d007e9e102a96e5a16a5a9467ec72a54322ae5397708e6f86a2f736ede02e22.f36954f3ad71a25e7aa4844843eae71b";
    
    const user: User = {
      id,
      username: "admin",
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
        images: [],
        showImageGallery: false,
        createdBy: 1, // Owner user ID
        approved: true,
        sharedWith: [],
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
        images: [],
        showImageGallery: false,
        createdBy: 1, // Owner user ID
        approved: true,
        sharedWith: [],
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
        images: [],
        showImageGallery: false,
        createdBy: 1, // Owner user ID
        approved: true,
        sharedWith: [],
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "gallery",
        url: "/gallery",
        pageContent: null,
        hasPage: false,
        order: 4,
        active: true,
        images: [],
        showImageGallery: false,
        createdBy: 1, // Owner user ID
        approved: true,
        sharedWith: [],
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "propertystar",
        url: "#",
        pageContent: "# PropertyStar\n\nComing soon - an innovative property management solution.",
        hasPage: true,
        order: 5,
        active: true,
        images: [],
        showImageGallery: false,
        createdBy: 1, // Owner user ID
        approved: true,
        sharedWith: [],
        createdAt: new Date()
      },
      {
        id: this.menuLinkCurrentId++,
        label: "acalltoaction",
        url: "#",
        pageContent: "# A Call To Action\n\nThis page is under development. Stay tuned for updates!",
        hasPage: true,
        order: 6,
        active: true,
        images: [],
        showImageGallery: false,
        createdBy: 1, // Owner user ID
        approved: true,
        sharedWith: [],
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
    const images = insertMenuLink.images ?? []; // Default to empty array if not provided
    const showImageGallery = insertMenuLink.showImageGallery ?? false; // Default to false if not provided
    const createdBy = insertMenuLink.createdBy ?? null; // Default to null if not provided
    const approved = insertMenuLink.approved ?? false; // Default to false if not provided
    const sharedWith = insertMenuLink.sharedWith ?? []; // Default to empty array if not provided
    
    const menuLink: MenuLink = {
      ...insertMenuLink,
      id,
      order,
      active,
      hasPage,
      pageContent,
      images,
      showImageGallery,
      createdBy,
      approved,
      sharedWith,
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
    const menuLink = this.menuLinks.get(id);
    if (!menuLink) {
      return undefined;
    }
    
    // Special handling for hasPage to ensure pageContent is correct
    let pageContent = menuLink.pageContent;
    if (menuLinkUpdate.hasPage !== undefined) {
      if (menuLinkUpdate.hasPage) {
        pageContent = menuLinkUpdate.pageContent || menuLink.pageContent || "";
      } else {
        pageContent = null;
      }
    } else if (menuLink.hasPage) {
      pageContent = menuLinkUpdate.pageContent || menuLink.pageContent;
    }
    
    const updatedMenuLink: MenuLink = {
      ...menuLink,
      ...menuLinkUpdate,
      pageContent,
    };
    
    this.menuLinks.set(id, updatedMenuLink);
    return updatedMenuLink;
  }
  
  async deleteMenuLink(id: number): Promise<void> {
    this.menuLinks.delete(id);
  }
  
  async getUserMenuLinks(userId: number): Promise<MenuLink[]> {
    return Array.from(this.menuLinks.values())
      .filter(link => link.createdBy === userId)
      .sort((a, b) => a.order - b.order);
  }
  
  async getApprovedMenuLinks(): Promise<MenuLink[]> {
    return Array.from(this.menuLinks.values())
      .filter(link => link.approved)
      .sort((a, b) => a.order - b.order);
  }
  
  async updateMenuLinkApproval(id: number, approved: boolean): Promise<MenuLink | undefined> {
    const menuLink = this.menuLinks.get(id);
    if (!menuLink) {
      return undefined;
    }
    
    const updatedMenuLink: MenuLink = {
      ...menuLink,
      approved
    };
    
    this.menuLinks.set(id, updatedMenuLink);
    return updatedMenuLink;
  }
  
  async getSharedMenuLinks(userId: number): Promise<MenuLink[]> {
    return Array.from(this.menuLinks.values())
      .filter(link => {
        // Include links explicitly shared with this user
        if (link.sharedWith && link.sharedWith.includes(userId.toString())) {
          return true;
        }
        // Include approved links created by this user
        if (link.createdBy === userId && link.approved) {
          return true;
        }
        return false;
      })
      .sort((a, b) => a.order - b.order);
  }
  
  async createArtwork(insertArtwork: InsertArtwork): Promise<Artwork> {
    const id = this.artworkCurrentId++;
    const artwork: Artwork = {
      id,
      title: insertArtwork.title,
      description: insertArtwork.description,
      artistName: insertArtwork.artistName,
      imageUrl: insertArtwork.imageUrl,
      originalPrice: insertArtwork.originalPrice,
      category: insertArtwork.category,
      createdAt: new Date(),
      originalAvailable: insertArtwork.originalAvailable ?? null,
      dimensions: insertArtwork.dimensions ?? null,
      medium: insertArtwork.medium ?? null,
      featured: insertArtwork.featured ?? null,
      visible: insertArtwork.visible ?? true
    };
    this.artworks.set(id, artwork);
    return artwork;
  }
  
  async getAllArtworks(includeHidden: boolean = false): Promise<Artwork[]> {
    let artworks = Array.from(this.artworks.values());
    
    if (!includeHidden) {
      artworks = artworks.filter(artwork => artwork.visible);
    }
    
    return artworks.sort((a, b) => {
      // Sort by featured status (featured first)
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      
      // Then sort by creation date (newest first)
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }
  
  async getArtwork(id: number): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }
  
  async updateArtwork(id: number, artworkUpdate: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const artwork = this.artworks.get(id);
    if (!artwork) {
      return undefined;
    }
    
    const updatedArtwork: Artwork = {
      ...artwork,
      ...artworkUpdate
    };
    
    this.artworks.set(id, updatedArtwork);
    return updatedArtwork;
  }
  
  async deleteArtwork(id: number): Promise<void> {
    this.artworks.delete(id);
  }
  
  async getFeaturedArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values())
      .filter(artwork => artwork.featured && artwork.visible)
      .sort((a, b) => {
        // Handle potential null values for createdAt
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }
  
  async createPrintSize(insertPrintSize: InsertPrintSize): Promise<PrintSize> {
    const id = this.printSizeCurrentId++;
    const printSize: PrintSize = {
      id,
      name: insertPrintSize.name,
      width: insertPrintSize.width,
      height: insertPrintSize.height,
      priceFactor: insertPrintSize.priceFactor,
      active: insertPrintSize.active ?? true
    };
    this.printSizes.set(id, printSize);
    return printSize;
  }
  
  async getAllPrintSizes(): Promise<PrintSize[]> {
    return Array.from(this.printSizes.values())
      .filter(size => size.active)
      .sort((a, b) => parseFloat(a.priceFactor) - parseFloat(b.priceFactor));
  }
  
  async getPrintSize(id: number): Promise<PrintSize | undefined> {
    return this.printSizes.get(id);
  }
  
  async updatePrintSize(id: number, printSizeUpdate: Partial<InsertPrintSize>): Promise<PrintSize | undefined> {
    const printSize = this.printSizes.get(id);
    if (!printSize) {
      return undefined;
    }
    
    const updatedPrintSize: PrintSize = {
      ...printSize,
      ...printSizeUpdate
    };
    
    this.printSizes.set(id, updatedPrintSize);
    return updatedPrintSize;
  }
  
  async deletePrintSize(id: number): Promise<void> {
    this.printSizes.delete(id);
  }
  
  async createArtworkPrintSize(insertArtworkPrintSize: InsertArtworkPrintSize): Promise<ArtworkPrintSize> {
    const id = this.artworkPrintSizeCurrentId++;
    const artworkPrintSize: ArtworkPrintSize = {
      id,
      artworkId: insertArtworkPrintSize.artworkId,
      printSizeId: insertArtworkPrintSize.printSizeId,
      price: insertArtworkPrintSize.price,
      inStock: insertArtworkPrintSize.inStock ?? true
    };
    this.artworkPrintSizes.set(id, artworkPrintSize);
    return artworkPrintSize;
  }
  
  async getArtworkPrintSizes(artworkId: number): Promise<ArtworkPrintSize[]> {
    return Array.from(this.artworkPrintSizes.values())
      .filter(aps => aps.artworkId === artworkId);
  }
  
  async getArtworkPrintSizesWithDetails(artworkId: number): Promise<(ArtworkPrintSize & PrintSize)[]> {
    const artworkPrintSizes = await this.getArtworkPrintSizes(artworkId);
    
    return artworkPrintSizes.map(aps => {
      const printSize = this.printSizes.get(aps.printSizeId);
      if (!printSize) {
        throw new Error(`Print size with ID ${aps.printSizeId} not found`);
      }
      
      return {
        ...aps,
        ...printSize
      };
    }).sort((a, b) => parseFloat(a.priceFactor) - parseFloat(b.priceFactor));
  }
  
  async updateArtworkPrintSize(id: number, artworkPrintSizeUpdate: Partial<InsertArtworkPrintSize>): Promise<ArtworkPrintSize | undefined> {
    const artworkPrintSize = this.artworkPrintSizes.get(id);
    if (!artworkPrintSize) {
      return undefined;
    }
    
    const updatedArtworkPrintSize: ArtworkPrintSize = {
      ...artworkPrintSize,
      ...artworkPrintSizeUpdate
    };
    
    this.artworkPrintSizes.set(id, updatedArtworkPrintSize);
    return updatedArtworkPrintSize;
  }
  
  async deleteArtworkPrintSize(id: number): Promise<void> {
    this.artworkPrintSizes.delete(id);
  }
  
  async createPrintOrder(insertPrintOrder: InsertPrintOrder): Promise<PrintOrder> {
    const id = this.printOrderCurrentId++;
    const printOrder: PrintOrder = {
      id,
      userId: insertPrintOrder.userId,
      artworkId: insertPrintOrder.artworkId,
      printSizeId: insertPrintOrder.printSizeId,
      quantity: insertPrintOrder.quantity || 1,
      price: insertPrintOrder.price,
      isOriginal: insertPrintOrder.isOriginal || false,
      shippingAddress: insertPrintOrder.shippingAddress,
      orderDate: new Date(),
      status: insertPrintOrder.status || "pending",
      trackingNumber: null,
      stripePaymentId: null,
      printingServiceOrderId: null
    };
    this.printOrders.set(id, printOrder);
    return printOrder;
  }
  
  async getPrintOrder(id: number): Promise<PrintOrder | undefined> {
    return this.printOrders.get(id);
  }
  
  async getUserPrintOrders(userId: number): Promise<PrintOrder[]> {
    return Array.from(this.printOrders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => {
        // Handle potential null values for orderDate
        if (!a.orderDate || !b.orderDate) return 0;
        return b.orderDate.getTime() - a.orderDate.getTime();
      });
  }
  
  async getAllPrintOrders(): Promise<PrintOrder[]> {
    return Array.from(this.printOrders.values())
      .sort((a, b) => {
        // Handle potential null values for orderDate
        if (!a.orderDate || !b.orderDate) return 0;
        return b.orderDate.getTime() - a.orderDate.getTime();
      });
  }
  
  async updatePrintOrderStatus(id: number, status: string, trackingNumber?: string): Promise<PrintOrder | undefined> {
    const existingOrder = this.printOrders.get(id);
    if (!existingOrder) {
      return undefined;
    }
    
    const updatedOrder: PrintOrder = {
      ...existingOrder,
      status,
      trackingNumber: trackingNumber || null
    };
    
    this.printOrders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  async updatePrintOrderPaymentInfo(id: number, stripePaymentId: string): Promise<PrintOrder | undefined> {
    const existingOrder = this.printOrders.get(id);
    if (!existingOrder) {
      return undefined;
    }
    
    const updatedOrder: PrintOrder = {
      ...existingOrder,
      stripePaymentId
    };
    
    this.printOrders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  async updatePrintOrderPrintingInfo(id: number, printingServiceOrderId: string): Promise<PrintOrder | undefined> {
    const existingOrder = this.printOrders.get(id);
    if (!existingOrder) {
      return undefined;
    }
    
    const updatedOrder: PrintOrder = {
      ...existingOrder,
      printingServiceOrderId
    };
    
    this.printOrders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Content management methods
  async createContentBlock(insertContentBlock: InsertContentBlock): Promise<ContentBlock> {
    const id = this.contentBlockCurrentId++;
    const contentBlock: ContentBlock = {
      id,
      key: insertContentBlock.key,
      title: insertContentBlock.title,
      content: insertContentBlock.content,
      placement: insertContentBlock.placement,
      active: insertContentBlock.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metaData: insertContentBlock.metaData ?? null
    };
    this.contentBlocks.set(id, contentBlock);
    return contentBlock;
  }

  async getAllContentBlocks(): Promise<ContentBlock[]> {
    return Array.from(this.contentBlocks.values())
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  async getContentBlock(id: number): Promise<ContentBlock | undefined> {
    return this.contentBlocks.get(id);
  }

  async getContentBlockByKey(key: string): Promise<ContentBlock | undefined> {
    return Array.from(this.contentBlocks.values()).find(
      (block) => block.key === key
    );
  }

  async getActiveContentBlocksByPlacement(placement: string): Promise<ContentBlock[]> {
    return Array.from(this.contentBlocks.values())
      .filter(block => block.active && block.placement === placement)
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  async updateContentBlock(id: number, contentBlockUpdate: Partial<InsertContentBlock>): Promise<ContentBlock | undefined> {
    const contentBlock = this.contentBlocks.get(id);
    if (!contentBlock) {
      return undefined;
    }

    const updatedContentBlock: ContentBlock = {
      ...contentBlock,
      ...contentBlockUpdate,
      updatedAt: new Date()
    };
    
    this.contentBlocks.set(id, updatedContentBlock);
    return updatedContentBlock;
  }

  async deleteContentBlock(id: number): Promise<void> {
    this.contentBlocks.delete(id);
  }
  
  // Dashboard Widget methods
  async createDashboardWidget(insertWidget: InsertDashboardWidget): Promise<DashboardWidget> {
    const id = this.dashboardWidgetCurrentId++;
    
    const widget: DashboardWidget = {
      ...insertWidget,
      id,
      config: insertWidget.config || null,
      position: insertWidget.position || 0,
      width: insertWidget.width || "full",
      height: insertWidget.height || "auto",
      active: insertWidget.active !== undefined ? insertWidget.active : true,
      userId: insertWidget.userId || null,
      createdAt: new Date()
    };
    
    this.dashboardWidgets.set(id, widget);
    return widget;
  }
  
  async getAllDashboardWidgets(): Promise<DashboardWidget[]> {
    return Array.from(this.dashboardWidgets.values());
  }
  
  async getDashboardWidget(id: number): Promise<DashboardWidget | undefined> {
    return this.dashboardWidgets.get(id);
  }
  
  async getDashboardWidgetsByRole(role: string): Promise<DashboardWidget[]> {
    return Array.from(this.dashboardWidgets.values())
      .filter(widget => widget.roles.includes(role) && widget.active)
      .sort((a, b) => a.position - b.position);
  }
  
  async getDashboardWidgetsByUser(userId: number): Promise<DashboardWidget[]> {
    return Array.from(this.dashboardWidgets.values())
      .filter(widget => widget.userId === userId && widget.active)
      .sort((a, b) => a.position - b.position);
  }
  
  async getDashboardWidgetsByUserAndRole(userId: number, role: string): Promise<DashboardWidget[]> {
    // Get default role-based widgets
    const defaultWidgets = Array.from(this.dashboardWidgets.values())
      .filter(widget => widget.roles.includes(role) && widget.userId === null && widget.active);
    
    // Get user-customized widgets
    const userWidgets = Array.from(this.dashboardWidgets.values())
      .filter(widget => widget.userId === userId && widget.roles.includes(role) && widget.active);
    
    // Combine and sort by position
    return [...defaultWidgets, ...userWidgets].sort((a, b) => a.position - b.position);
  }
  
  async updateDashboardWidget(id: number, widgetUpdate: Partial<InsertDashboardWidget>): Promise<DashboardWidget | undefined> {
    const widget = this.dashboardWidgets.get(id);
    
    if (!widget) {
      return undefined;
    }
    
    const updatedWidget: DashboardWidget = {
      ...widget,
      ...widgetUpdate
    };
    
    this.dashboardWidgets.set(id, updatedWidget);
    return updatedWidget;
  }
  
  async deleteDashboardWidget(id: number): Promise<void> {
    this.dashboardWidgets.delete(id);
  }
  
  // Dashboard Layout methods
  async createDashboardLayout(insertLayout: InsertDashboardLayout): Promise<DashboardLayout> {
    const id = this.dashboardLayoutCurrentId++;
    
    const layout: DashboardLayout = {
      ...insertLayout,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.dashboardLayouts.set(id, layout);
    return layout;
  }
  
  async getDashboardLayout(userId: number, role: string): Promise<DashboardLayout | undefined> {
    return Array.from(this.dashboardLayouts.values())
      .find(layout => layout.userId === userId && layout.role === role);
  }
  
  async updateDashboardLayout(id: number, layoutUpdate: Partial<InsertDashboardLayout>): Promise<DashboardLayout | undefined> {
    const layout = this.dashboardLayouts.get(id);
    
    if (!layout) {
      return undefined;
    }
    
    const updatedLayout: DashboardLayout = {
      ...layout,
      ...layoutUpdate,
      updatedAt: new Date()
    };
    
    this.dashboardLayouts.set(id, updatedLayout);
    return updatedLayout;
  }
  
  async deleteDashboardLayout(id: number): Promise<void> {
    this.dashboardLayouts.delete(id);
  }
}

export const storage = new MemStorage();