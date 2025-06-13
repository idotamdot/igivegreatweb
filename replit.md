# Neural Web Labs - Replit.md

## Overview

Neural Web Labs is a full-stack web application that serves as a platform for AI-enhanced web development services. The application combines quantum computing concepts, AI-powered coding assistance, and cryptocurrency payment processing to create a futuristic web development platform. It features a cyberpunk-themed interface with neural network visualizations and holographic design elements.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk/neural themes
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI with shadcn/ui design system
- **Animations**: Framer Motion for complex animations and effects

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the application
- **Build System**: Vite for frontend bundling, esbuild for server compilation
- **Session Management**: Express sessions with custom session store

### Database Layer
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Core Business Logic
1. **AI Operators Management** - Tracks 6 AI operators (ARIA-7, NEXUS-3, CIPHER-9, ECHO-5, VORTEX-1, PULSE-4) with performance metrics
2. **Project Management** - Client project tracking and autonomous project orchestration
3. **Business Metrics** - Revenue tracking, client satisfaction, and performance analytics
4. **Enterprise Services** - B2B client management with invoicing system

### Payment Processing
1. **Stripe Integration** - Traditional payment processing for services
2. **Cryptocurrency Payments** - Multi-currency crypto payment support (BTC, ETH, USDC, USDT)
3. **Coinbase SDK Integration** - Professional crypto payment handling

### Authentication & Security
- **Workload Identity Federation** - Google Cloud authentication without service account keys
- **Session-based Authentication** - Secure session management with role-based access
- **Multi-role Support** - Admin, client, and staff access levels

### AI & Cloud Integration
- **Google Cloud AI Platform** - Custom model deployment and neural predictions
- **Google Cloud Storage** - File storage and training data management
- **Google Cloud Monitoring** - Performance tracking and logging

## Data Flow

### Request Processing
1. Client requests hit Express server at port 5000
2. API routes handle business logic before Vite middleware
3. Database operations use Drizzle ORM with connection pooling
4. Response data flows through TanStack Query for client state management

### Authentication Flow
1. Google Workload Identity Federation validates requests
2. Session data stored in PostgreSQL sessions table
3. Role-based authorization controls access to features
4. Logout invalidates sessions and redirects appropriately

### Payment Processing Flow
1. Service selection triggers payment intent creation
2. Stripe or crypto payment processors handle transactions
3. Payment confirmation updates project and billing records
4. Success/failure states update UI and notify users

## External Dependencies

### Cloud Services
- **Google Cloud Platform** - AI/ML services, storage, monitoring
- **Neon Database** - Serverless PostgreSQL hosting
- **Stripe** - Payment processing infrastructure
- **Coinbase** - Cryptocurrency payment processing

### Development Services
- **Replit** - Development environment and deployment platform
- **Workload Identity Federation** - Secure cloud authentication

### Key Libraries
- **React Ecosystem** - React 18, React Query, React Hook Form
- **UI Framework** - Radix UI primitives with shadcn/ui components
- **Database** - Drizzle ORM, Neon serverless driver
- **Payments** - Stripe SDK, Coinbase SDK
- **Cloud Integration** - Google Cloud client libraries

## Deployment Strategy

### Development Environment
- **Local Development** - Vite dev server with HMR on port 3000
- **API Server** - Express server on port 5000
- **Database** - Neon PostgreSQL with connection pooling

### Production Deployment
- **Build Process** - Vite builds frontend to `dist/public`, esbuild compiles server
- **Static Serving** - Express serves built frontend assets
- **Autoscale Deployment** - Replit autoscale deployment target
- **Environment Variables** - Secure credential management via Replit Secrets

### Database Management
- **Schema Migrations** - Drizzle Kit handles schema changes
- **Connection Pooling** - Neon serverless with WebSocket connections
- **Data Seeding** - Automated seeding of AI operators and business metrics

## Changelog

```
Changelog:
- June 13, 2025: Initial Neural Web Labs platform setup
- June 13, 2025: Fixed critical API routing issue by implementing dedicated API server on port 3001
- June 13, 2025: Connected frontend to real PostgreSQL database with 6 AI operators
- June 13, 2025: Enabled real-time crypto payment processing with multi-currency support
- June 13, 2025: Activated neural network performance metrics with live efficiency tracking
- June 13, 2025: Fixed "service not found" error by implementing crypto payment route aliases
- June 13, 2025: Enhanced service selection flow with dynamic service mapping and error handling
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```