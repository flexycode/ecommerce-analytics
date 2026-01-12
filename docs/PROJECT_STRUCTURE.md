# E-commerce Analytics Dashboard - Project Structure Documentation

## Overview

This document provides a detailed breakdown of the project structure for the Full Stack E-commerce Analytics Dashboard.

---

## Complete Directory Structure

```
ecommerce-analytics/
│
├── 📁 src/                                 # Next.js Frontend
│   ├── 📁 app/
│   │   ├── globals.css                     # Global styles with design system
│   │   ├── layout.tsx                      # Root layout with fonts & metadata
│   │   ├── page.tsx                        # Landing page with hero section
│   │   └── 📁 dashboard/
│   │       ├── layout.tsx                  # Dashboard layout with sidebar/header
│   │       └── page.tsx                    # Main dashboard with metrics & charts
│   │
│   └── 📁 components/
│       └── 📁 dashboard/
│           ├── Header.tsx                  # Top navigation bar
│           ├── Sidebar.tsx                 # Collapsible side navigation
│           ├── MetricCard.tsx              # KPI metric cards
│           └── SalesChart.tsx              # Sales visualization chart
│
├── 📁 backend/                             # NestJS Backend API
│   ├── nest-cli.json                       # NestJS CLI configuration
│   ├── package.json                        # Backend dependencies
│   ├── tsconfig.json                       # TypeScript configuration
│   ├── env.example                         # Environment template
│   ├── Dockerfile                          # Backend container
│   │
│   └── 📁 src/
│       ├── main.ts                         # Application bootstrap
│       ├── app.module.ts                   # Root module
│       │
│       ├── 📁 common/
│       │   ├── 📁 guards/
│       │   │   └── jwt-auth.guard.ts       # JWT authentication guard
│       │   └── 📁 decorators/
│       │       └── public.decorator.ts     # Public route decorator
│       │
│       └── 📁 modules/
│           ├── 📁 analytics/
│           │   ├── analytics.module.ts
│           │   ├── analytics.controller.ts
│           │   ├── analytics.service.ts
│           │   └── analytics.gateway.ts    # WebSocket gateway
│           │
│           ├── 📁 auth/
│           │   ├── auth.module.ts
│           │   ├── auth.controller.ts
│           │   ├── auth.service.ts
│           │   ├── 📁 entities/
│           │   │   └── user.entity.ts      # User with GDPR fields
│           │   ├── 📁 dto/
│           │   │   ├── login.dto.ts
│           │   │   └── register.dto.ts
│           │   └── 📁 strategies/
│           │       └── jwt.strategy.ts     # Passport JWT strategy
│           │
│           ├── 📁 cache/
│           │   ├── cache.module.ts         # Global Redis module
│           │   └── cache.service.ts        # Redis operations
│           │
│           ├── 📁 inventory/
│           │   ├── inventory.module.ts
│           │   ├── inventory.controller.ts
│           │   ├── inventory.service.ts
│           │   ├── 📁 entities/
│           │   │   ├── product.entity.ts
│           │   │   └── inventory.entity.ts
│           │   └── 📁 dto/
│           │       ├── create-product.dto.ts
│           │       └── update-inventory.dto.ts
│           │
│           ├── 📁 predictions/
│           │   ├── predictions.module.ts
│           │   ├── predictions.controller.ts
│           │   ├── predictions.service.ts
│           │   └── 📁 entities/
│           │       └── prediction.entity.ts
│           │
│           ├── 📁 privacy/
│           │   ├── privacy.module.ts
│           │   ├── privacy.controller.ts
│           │   └── privacy.service.ts      # GDPR/CCPA compliance
│           │
│           └── 📁 sales/
│               ├── sales.module.ts
│               ├── sales.controller.ts
│               ├── sales.service.ts
│               ├── 📁 entities/
│               │   └── sale.entity.ts
│               └── 📁 dto/
│                   └── create-sale.dto.ts
│
├── 📁 ml-service/                          # Python ML Service
│   ├── app.py                              # Flask API with ML models
│   ├── requirements.txt                    # Python dependencies
│   └── Dockerfile                          # ML container
│
├── 📁 k8s/                                 # Kubernetes Manifests
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── configmap.yaml                      # Environment configuration
│   └── hpa.yaml                            # Horizontal Pod Autoscaler
│
├── 📁 docs/                                # Documentation
│
├── Dockerfile                              # Frontend container
├── docker-compose.yml                      # Local development stack
├── package.json                            # Frontend dependencies
├── README.md                               # Project documentation
├── LICENSE                                 # MIT License
└── tsconfig.json                           # Frontend TypeScript config
```

---

## Module Summary

| Module | Purpose | Key Features |
|--------|---------|--------------|
| **Analytics** | Dashboard metrics | Real-time WebSocket, aggregated data |
| **Auth** | User authentication | JWT, roles, GDPR consent fields |
| **Cache** | Redis integration | Pub/sub, caching, real-time events |
| **Inventory** | Stock management | Low stock alerts, reorder tracking |
| **Predictions** | AI forecasting | Sales predictions, confidence scores |
| **Privacy** | GDPR/CCPA | Data export, deletion, consent |
| **Sales** | Transaction data | Metrics, daily summaries, trends |

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/funnel` - Conversion funnel
- `GET /api/analytics/revenue-by-channel` - Revenue breakdown

### Sales
- `POST /api/sales` - Create sale
- `GET /api/sales` - List sales (paginated)
- `GET /api/sales/metrics` - Sales metrics
- `GET /api/sales/daily` - Daily sales summary

### Inventory
- `POST /api/inventory/products` - Create product
- `GET /api/inventory/products` - List products
- `GET /api/inventory/:productId` - Get inventory
- `PUT /api/inventory/:productId` - Update inventory
- `POST /api/inventory/:productId/restock` - Restock product
- `GET /api/inventory/alerts/low-stock` - Low stock items
- `GET /api/inventory/summary/overview` - Inventory summary

### Predictions
- `POST /api/predictions/generate/:productId` - Generate predictions
- `GET /api/predictions` - Get stored predictions
- `GET /api/predictions/forecast` - Aggregated forecast
- `GET /api/predictions/inventory-recommendations` - AI recommendations

### Privacy (GDPR/CCPA)
- `GET /api/privacy/export` - Export user data
- `DELETE /api/privacy/delete` - Delete user data
- `GET /api/privacy/consent` - Get consent status
- `POST /api/privacy/consent` - Update consent
- `GET /api/privacy/policy` - Privacy policy summary

---

## Running the Application

### Development (Local)
```bash
# Start all services via Docker Compose
docker-compose up -d

# Or run individually:
npm run dev           # Frontend (port 3000)
cd backend && npm run start:dev  # Backend (port 4000)
cd ml-service && python app.py   # ML Service (port 5000)
```

### Production (Kubernetes)
```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get services
```

---

## Technology Rationale

| Choice | Reason |
|--------|--------|
| **Next.js 14+** | Server components, app router, optimized builds |
| **NestJS** | Enterprise-grade modularity, TypeScript, DI |
| **PostgreSQL** | ACID compliance, complex queries, JSON support |
| **Redis** | Sub-millisecond caching, pub/sub for real-time |
| **Kubernetes** | Horizontal scaling, self-healing, declarative config |
| **TailwindCSS** | Rapid UI development, consistent design system |
