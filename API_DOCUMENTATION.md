# Neural Web Labs API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-domain.replit.app
```

## Authentication

All API requests require session-based authentication using secure cookies.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "neural-engineer",
  "password": "quantum123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "demo-user-1749859173",
    "username": "neural-engineer",
    "role": "user",
    "neural_access": true
  },
  "message": "Neural matrix connection established"
}
```

### Check Authentication Status
```http
GET /api/auth/user
```

**Response (Authenticated):**
```json
{
  "id": "demo-user-1749859173",
  "username": "neural-engineer",
  "role": "user",
  "neural_access": true
}
```

**Response (Not Authenticated):**
```json
{
  "message": "No active neural connection"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "neural-operator",
  "email": "operator@neuralweblabs.com",
  "password": "quantum456"
}
```

### Logout
```http
POST /api/auth/logout
```

## AI Operators

### Get All AI Operators
```http
GET /api/ai-operators
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "ARIA-7",
    "role": "Lead Development AI",
    "efficiency": 98,
    "tasksCompleted": 2847,
    "currentTask": "Processing ARIA operations",
    "neuralLoad": 85.49
  },
  {
    "id": 2,
    "name": "NEXUS-3",
    "role": "Security & Defense AI",
    "efficiency": 96,
    "tasksCompleted": 1923,
    "currentTask": "Processing NEXUS operations",
    "neuralLoad": 70.37
  }
]
```

### Create AI Operator
```http
POST /api/ai-operators
Content-Type: application/json

{
  "name": "QUANTUM-8",
  "role": "Quantum Computing AI",
  "efficiency": 99,
  "tasksCompleted": 0
}
```

## Projects

### Get All Projects
```http
GET /api/projects
```

**Response:**
```json
[
  {
    "id": 1,
    "clientName": "TechCorp Solutions",
    "projectName": "E-commerce Platform Redesign",
    "description": "Complete overhaul of legacy e-commerce system",
    "status": "active",
    "priority": "high",
    "value": 45000,
    "assignedOperator": "ARIA-7",
    "progress": 78,
    "createdAt": "2025-06-13T00:00:00.000Z"
  }
]
```

### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "clientName": "Startup Innovation",
  "projectName": "AI Chat Platform",
  "description": "Real-time AI-powered chat application",
  "priority": "medium",
  "value": 28000,
  "assignedOperator": "ECHO-5"
}
```

## Analytics

### Neural Analytics
```http
GET /api/analytics/neural
```

**Response:**
```json
{
  "performance": {
    "totalProjects": 5,
    "completedProjects": 1,
    "activeProjects": 4,
    "averageCompletionTime": "3.2 hours",
    "successRate": "20.0",
    "neuralEfficiency": 94.7
  },
  "realTime": {
    "currentOperations": 18,
    "quantumProcessing": 94.50,
    "networkLatency": 10,
    "powerConsumption": 811,
    "dataProcessed": "2.4 TB",
    "requestsPerSecond": 1286
  },
  "operators": [
    {
      "id": 1,
      "name": "ARIA-7",
      "role": "Lead Development AI",
      "efficiency": 98,
      "tasksCompleted": 2847,
      "currentTask": "Processing ARIA operations",
      "neuralLoad": 85.49
    }
  ]
}
```

### System Health
```http
GET /api/system/health
```

**Response:**
```json
{
  "status": "operational",
  "uptime": "99.97%",
  "lastUpdate": "2025-06-13T23:45:30.000Z",
  "services": {
    "database": "healthy",
    "neural_network": "optimal",
    "quantum_processing": "active",
    "security_systems": "enhanced"
  },
  "metrics": {
    "totalOperators": 6,
    "activeProjects": 4,
    "systemLoad": 67.8,
    "responseTime": "23ms"
  }
}
```

## Services

### Get Service Catalog
```http
GET /api/services
```

**Response:**
```json
[
  {
    "id": "neural-web-development",
    "name": "Neural Web Development",
    "description": "AI-powered web application development with quantum optimization",
    "price": 15000,
    "features": [
      "Autonomous code generation",
      "Real-time performance optimization",
      "Neural security protocols",
      "Quantum database integration",
      "AI-driven testing automation"
    ]
  },
  {
    "id": "blockchain-defi-platform",
    "name": "Blockchain DeFi Platform",
    "description": "Decentralized finance platform with smart contracts",
    "price": 25000,
    "features": [
      "Smart contract development",
      "Automated trading algorithms",
      "Multi-chain compatibility",
      "Security audit integration",
      "Yield optimization protocols"
    ]
  }
]
```

## Deployments

### Get Deployment Pipeline
```http
GET /api/deployments
```

**Response:**
```json
[
  {
    "id": "deploy-1",
    "projectName": "E-commerce Platform Redesign",
    "version": "v1.1.0",
    "environment": "production",
    "status": "deployed",
    "progress": 100,
    "repository": "neural-web-labs/e-commerce-platform-redesign",
    "deployedUrl": "https://e-commerce-platform-redesign.neural-labs.app",
    "stages": [
      {
        "id": "build",
        "name": "Build & Test",
        "status": "completed",
        "duration": 180,
        "aiOperator": "ARIA-7",
        "logs": [
          "✓ Dependencies installed",
          "✓ Tests passed (98% coverage)",
          "✓ Build optimized"
        ]
      }
    ],
    "metrics": {
      "buildTime": "3m 15s",
      "deployTime": "8m 45s",
      "testCoverage": 95,
      "performanceScore": 94
    }
  }
]
```

### Trigger Deployment
```http
POST /api/deployments/trigger
Content-Type: application/json

{
  "type": "production",
  "projectId": "proj-12345"
}
```

## Infrastructure

### Get Infrastructure Nodes
```http
GET /api/infrastructure/nodes
```

**Response:**
```json
[
  {
    "id": "node-001",
    "name": "Production Web Server",
    "type": "compute",
    "status": "healthy",
    "cpu": 65.3,
    "memory": 78.2,
    "network": 45.7,
    "location": "US-East-1",
    "uptime": "99.97%"
  }
]
```

## AI Project Generation

### Generate AI Project
```http
POST /api/projects/generate
Content-Type: application/json

{
  "template": "web-app",
  "name": "Neural Commerce Hub",
  "description": "AI-powered e-commerce platform",
  "requirements": [
    "React frontend",
    "Node.js backend",
    "AI recommendations"
  ],
  "operators": ["ARIA-7", "CIPHER-9"]
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "proj-1749859173",
    "name": "Neural Commerce Hub",
    "template": "web-app",
    "estimatedCompletion": "2-4 hours",
    "repository": "https://github.com/neural-web-labs/neural-commerce-hub",
    "codeStructure": [
      {
        "path": "/src",
        "type": "directory",
        "files": ["index.js", "App.js", "components/"]
      }
    ]
  }
}
```

## Error Responses

### Authentication Error
```json
{
  "message": "No active neural connection"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Neural credentials required"
}
```

### Server Error
```json
{
  "message": "Neural matrix connection failed"
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Analytics endpoints**: 60 requests per minute
- **General API**: 100 requests per minute

## Headers

All requests should include:
```
Content-Type: application/json
Cookie: session=<session-id> (for authenticated requests)
```

## WebSocket Connections

Real-time updates available via WebSocket:
```
ws://localhost:5000/neural-stream
```

Events:
- `operator-update`: AI operator status changes
- `project-progress`: Project completion updates
- `deployment-status`: Deployment pipeline changes
- `system-alert`: Critical system notifications

## Neural Web Labs API v1.0
Last updated: June 13, 2025