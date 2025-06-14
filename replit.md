# Neural Web Labs - Replit.md

## Overview

Neural Web Labs is a comprehensive AI-powered autonomous development platform that showcases the future of software engineering. The platform features 6 specialized AI operators (ARIA-7, NEXUS-3, CIPHER-9, ECHO-5, VORTEX-1, PULSE-4) working together to provide quantum-enhanced web development services, autonomous project generation, real-time analytics, and intelligent deployment pipelines. It combines cutting-edge cyberpunk aesthetics with functional AI-driven automation, cryptocurrency payment processing, and immersive user experiences.

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

### Advanced AI Platform Features
1. **Neural Login System** - Cyberpunk-themed authentication with neural network animations and session management
2. **Quantum Workspace** - Real-time AI operations center with quantum task monitoring and environment management
3. **AI Project Generator** - Autonomous project creation system with 6 specialized templates and intelligent code generation
4. **Neural Analytics Dashboard** - Comprehensive real-time performance monitoring with AI operator efficiency tracking
5. **Deployment Pipeline** - Intelligent deployment automation with infrastructure monitoring and rollback capabilities
6. **AI Operators Management** - Advanced tracking of 6 specialized AI operators with real-time performance metrics

### Core Business Logic
1. **Autonomous Project Generation** - Template-based intelligent project creation with real-time progress tracking
2. **Neural Network Monitoring** - Live AI operator performance with efficiency optimization
3. **Quantum Infrastructure** - Multi-environment deployment with auto-scaling capabilities  
4. **Real-time Analytics** - Performance metrics, trend analysis, and predictive insights

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
- June 13, 2025: Fixed non-functional service preview button with comprehensive preview dialog system
- June 13, 2025: Completed quantum service selection workflow with seamless preview-to-payment integration
- June 13, 2025: Implemented immersive onboarding experience with futuristic tutorial walkthrough
- June 13, 2025: Added neural network background animations and interactive step-by-step guidance system
- June 13, 2025: Enhanced tutorial with functional preview button showing live service demonstrations
- June 13, 2025: Added quantum service preview dialog with AI coding features, pricing matrix, and deployment simulation
- June 13, 2025: RESOLVED neural matrix connection error by cleaning database duplicates (348 records removed)
- June 13, 2025: Simplified authentication system and resolved all TypeScript compilation errors
- June 13, 2025: Platform fully operational and deployment-ready with all 6 AI operators active
- June 13, 2025: Built comprehensive Neural Login System with cyberpunk aesthetics and neural network animations
- June 13, 2025: Created Quantum Workspace for real-time AI operations monitoring and quantum task management
- June 13, 2025: Implemented AI Project Generator with 6 specialized templates and autonomous code generation
- June 13, 2025: Added Neural Analytics Dashboard with real-time performance metrics and trend analysis
- June 13, 2025: Developed Deployment Pipeline with infrastructure monitoring and intelligent automation
- June 13, 2025: Enhanced Neural Navigation with comprehensive platform access and quantum network visualization
- June 13, 2025: PRODUCTION READY: Fixed all identified issues - eliminated duplicate AI operators, corrected deployment pipeline status tracking, enhanced session persistence for seamless user experience
- June 13, 2025: Added comprehensive services catalog with 6 AI-powered offerings ($15K-$35K range)
- June 13, 2025: Implemented database integrity constraints and optimized neural analytics for accurate real-time metrics
- June 13, 2025: Updated complete platform documentation with current architecture and deployment specifications
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```