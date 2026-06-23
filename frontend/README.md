# Office Supplies Management System - Frontend

**Gestion des Fournitures Bureautiques** - Production-Ready React Frontend

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Components](#components)
- [State Management](#state-management)
- [Services & API](#services--api)
- [Environment Variables](#environment-variables)
- [Build & Deployment](#build--deployment)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## Overview

A professional, production-ready frontend for managing office supplies in an enterprise environment. Built with modern technologies including React 18, TypeScript, Tailwind CSS, and Vite.

### Key Features

- **Authentication & Authorization** - Secure login/register with role-based access control
- **Dashboard** - Real-time statistics, charts, and overview
- **Supplies Catalog** - Complete article, category, and supplier management
- **Stock Management** - Real-time stock tracking with alerts and movements
- **Request Management** - Internal requests with workflow validation
- **Purchase Orders** - Supplier order creation, tracking, and management
- **Reports & Analytics** - Comprehensive reporting and data visualization
- **Admin Panel** - User management and system settings
- **Responsive Design** - Mobile, tablet, and desktop support
- **Dark Mode** - Theme switching support
- **Notifications** - Real-time toast notifications

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | React | 18.2.0 |
| **Language** | TypeScript | 5.0+ |
| **Build Tool** | Vite | 4.3.0+ |
| **CSS Framework** | Tailwind CSS | 3.3+ |
| **State Management** | Zustand | 4.3+ |
| **Routing** | React Router | 6.8+ |
| **HTTP Client** | Axios | 1.4+ |
| **Icons** | Lucide React | 0.263+ |
| **Code Quality** | ESLint + Prettier | Latest |

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Git (for version control)

### Steps

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd Gestion_des_fournitures_bureautiques/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=Office Supplies Management
   VITE_DEBUG=false
   ```

## Running the Application

### Development Mode

Start the development server with hot module reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:

```bash
npm run build
```

Output files will be in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

The application will be available at `http://localhost:4173`

### Code Quality

Run linting:
```bash
npm run lint
```

Fix linting errors automatically:
```bash
npm run lint:fix
```

Format code with Prettier:
```bash
npm run format
```

Check formatting without making changes:
```bash
npm run format:check
```

## Project Structure

```
frontend/
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── Alert.tsx             # Alert component
│   │   ├── Badge.tsx             # Badge component
│   │   ├── Breadcrumb.tsx        # Breadcrumb navigation
│   │   ├── Button.tsx            # Button component
│   │   ├── Card.tsx              # Card container
│   │   ├── DataTable.tsx         # Data table with pagination
│   │   ├── Dropdown.tsx          # Dropdown menu
│   │   ├── FormInputs.tsx        # Input, Textarea, Select
│   │   ├── Header.tsx            # Application header
│   │   ├── Loader.tsx            # Loading spinner
│   │   ├── Modal.tsx             # Modal dialog
│   │   ├── SearchInput.tsx       # Search input field
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── StatCard.tsx          # Statistics card
│   │   ├── Tabs.tsx              # Tab navigation
│   │   ├── Toast.tsx             # Toast notifications
│   │   └── index.ts              # Component exports
│   │
│   ├── pages/                     # Page components for routing
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── catalog/              # Catalog management pages
│   │   │   ├── ArticlesPage.tsx
│   │   │   ├── CategoriesPage.tsx
│   │   │   └── SuppliersPage.tsx
│   │   ├── stock/                # Stock management pages
│   │   │   ├── StockLevelsPage.tsx
│   │   │   └── MovementsPage.tsx
│   │   ├── requests/             # Request management pages
│   │   │   └── RequestsPage.tsx
│   │   ├── orders/               # Order management pages
│   │   │   └── OrdersPage.tsx
│   │   ├── reports/              # Reports and analytics pages
│   │   │   └── ReportsPage.tsx
│   │   ├── admin/                # Admin panel pages
│   │   │   ├── UsersPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── DashboardPage.tsx     # Main dashboard
│   │   └── NotFoundPage.tsx      # 404 page
│   │
│   ├── stores/                    # Zustand state management stores
│   │   ├── authStore.ts          # Authentication state
│   │   ├── catalogStore.ts       # Catalog data state
│   │   ├── stockStore.ts         # Stock data state
│   │   ├── requestsOrdersStore.ts# Requests and orders state
│   │   └── uiStore.ts            # UI state (notifications, etc.)
│   │
│   ├── services/                  # API service layer
│   │   ├── apiClient.ts          # Axios instance configuration
│   │   ├── authService.ts        # Auth API calls
│   │   ├── catalogService.ts     # Catalog API calls
│   │   ├── stockService.ts       # Stock API calls
│   │   ├── requestsService.ts    # Requests API calls
│   │   ├── ordersService.ts      # Orders API calls
│   │   ├── reportsService.ts     # Reports API calls
│   │   └── adminService.ts       # Admin API calls
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useNotification.ts    # Notification hook
│   │   ├── useDataTable.ts       # Data table operations
│   │   ├── useFetch.ts           # Data fetching
│   │   └── useMutation.ts        # Data mutations
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── auth.ts               # Auth types
│   │   ├── catalog.ts            # Catalog types
│   │   ├── stock.ts              # Stock types
│   │   ├── requests.ts           # Requests types
│   │   ├── orders.ts             # Orders types
│   │   ├── reports.ts            # Reports types
│   │   ├── common.ts             # Common types (includes AlertType)
│   │   └── index.ts              # Type exports
│   │
│   ├── utils/                     # Utility functions
│   │   ├── format.ts             # Formatting utilities
│   │   ├── validation.ts         # Form validation
│   │   ├── errorHandler.ts       # Error handling
│   │   ├── constants.ts          # App constants
│   │   ├── mockData.ts           # Mock data for development
│   │   ├── storage.ts            # Local storage utilities
│   │   ├── classNames.ts         # Class name utility
│   │   └── dateUtils.ts          # Date utilities
│   │
│   ├── styles/                    # Global styles
│   │   ├── globals.css           # Global CSS with Tailwind imports
│   │   └── index.css             # Additional styles
│   │
│   ├── App.tsx                    # Main app component with routes
│   ├── main.tsx                   # React entry point
│   ├── vite-env.d.ts             # Vite environment types
│   └── index.css                  # Global styles
│
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Project dependencies
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # TypeScript config for node
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── dist/                         # Production build output (generated)
└── README.md                     # This file
```

## Features

### 1. Authentication Module
- User login with email/password
- User registration with validation
- JWT token management
- Secure token storage
- Role-based access control
- Protected routes
- Auto-logout on token expiration

### 2. Dashboard
- Overview statistics (total items, low stock, pending requests)
- Interactive charts and graphs
- Recent activity feed
- Quick action buttons
- Real-time notifications
- Performance metrics

### 3. Catalog Management
- **Articles**: Complete list management with search, add, edit, delete
- **Categories**: Organize articles by category
- **Suppliers**: Manage supplier information and contacts
- Bulk operations support
- Import/export functionality
- Category and supplier associations

### 4. Stock Management
- Real-time stock level tracking
- Stock movement history with timestamps
- Automatic low-stock alerts
- Reorder suggestions based on consumption patterns
- Stock audits and reconciliation
- Stock alerts and notifications

### 5. Request Management
- Create internal supply requests
- Request workflow with approval hierarchy
- Request status tracking (pending, approved, rejected)
- Request history and comments
- Email notifications for approvals
- Request filtering and search

### 6. Purchase Orders
- Create purchase orders from requests
- Multiple supplier support
- Order tracking with status updates
- Receipt management and confirmation
- Document generation (PDF)
- Order history and analytics

### 7. Reports & Analytics
- Sales and consumption reports
- Inventory reports with stock analysis
- Expense reports and budgets
- Custom report builder
- Export to Excel/PDF formats
- Date range filtering
- Graphical data visualization

### 8. Admin Panel
- User management and permissions
- Role and permission management
- System settings and configuration
- Audit logs for tracking changes
- Backup and restore functionality
- System health monitoring

## Components

### Common Components

All components are built with Tailwind CSS and fully typed with TypeScript.

#### Button
```tsx
<Button 
  variant="primary" 
  onClick={handleClick}
  loading={isLoading}
>
  Save Changes
</Button>
```

#### Input
```tsx
<Input 
  type="email" 
  placeholder="Email" 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

#### Card
```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

#### Modal
```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>Modal Title</Modal.Header>
  <Modal.Body>Modal content</Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

#### DataTable
```tsx
<DataTable 
  columns={columns}
  data={data}
  pagination
  sorting
  filtering
/>
```

#### Alert
```tsx
<Alert 
  type="danger"
  title="Error"
  message="Something went wrong"
/>
```

#### Toast/Notification
```tsx
import { useUIStore } from '@stores/uiStore';

const { showNotification } = useUIStore();
showNotification('success', 'Operation completed successfully');
showNotification('danger', 'An error occurred');
```

See component files in `src/components/` for complete documentation.

## State Management

### Zustand Stores

The application uses Zustand for state management, which provides a lightweight and flexible solution for managing application state.

#### authStore
Manages authentication state, user information, roles, and permissions.

```tsx
import { useAuthStore } from '@stores/authStore';

const { user, isAuthenticated, login, logout, hasPermission } = useAuthStore();
```

**Available methods:**
- `login(email, password)` - Authenticate user
- `logout()` - Clear authentication state
- `setUser(user)` - Update user info
- `hasPermission(permission)` - Check user permissions

#### catalogStore
Manages catalog data including articles, categories, and suppliers.

```tsx
import { useCatalogStore } from '@stores/catalogStore';

const { articles, categories, suppliers, addArticle, updateArticle, deleteArticle } = useCatalogStore();
```

#### stockStore
Manages stock data, movements, and inventory operations.

```tsx
import { useStockStore } from '@stores/stockStore';

const { stockLevels, movements, alerts, updateStock } = useStockStore();
```

#### requestsOrdersStore
Manages requests and purchase orders data.

```tsx
import { useRequestsOrdersStore } from '@stores/requestsOrdersStore';

const { requests, orders, createRequest, approveRequest } = useRequestsOrdersStore();
```

#### uiStore
Manages UI state including notifications, modals, and loading states.

```tsx
import { useUIStore } from '@stores/uiStore';

const { notifications, showNotification, removeNotification } = useUIStore();
```

## Services & API

### API Client Configuration

The API client is configured in `src/services/apiClient.ts` with:
- Axios instance with base URL from environment variable
- Request interceptors for adding authorization tokens
- Response interceptors for error handling
- Token refresh logic
- Automatic redirect to login on 401 errors

```tsx
import apiClient from '@services/apiClient';

// Uses configuration from import.meta.env.VITE_API_URL
```

### Available Services

Each module has a dedicated service for API communication:

- **authService**: Login, register, token refresh, logout, user profile
- **catalogService**: Article, category, supplier CRUD operations
- **stockService**: Stock levels, movements, alerts, audits
- **requestsService**: Request creation, approval, tracking, comments
- **ordersService**: Order creation, tracking, receipt, cancellation
- **reportsService**: Report generation and exports
- **adminService**: User management, roles, permissions, settings

Example usage:
```tsx
import * as catalogService from '@services/catalogService';

try {
  const articles = await catalogService.getArticles();
  const newArticle = await catalogService.addArticle(data);
} catch (error) {
  handleError(error);
}
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration (Required)
VITE_API_URL=http://localhost:3000/api

# Application (Optional)
VITE_APP_NAME=Office Supplies Management System
VITE_DEBUG=false

# Optional: Third-party services
# VITE_ANALYTICS_KEY=...
# VITE_SENTRY_DSN=...
```

### Available Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | http://localhost:3000/api | Backend API URL |
| `VITE_APP_NAME` | No | App | Application name displayed in UI |
| `VITE_DEBUG` | No | false | Enable debug mode for verbose logging |

**Note:** All environment variables must start with `VITE_` to be exposed to the client.

## Build & Deployment

### Development Build

```bash
npm run dev
```

Starts the Vite development server with hot module reloading on port 5173.

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory with:
- TypeScript type checking
- JavaScript and CSS minification
- Tree-shaking of unused code
- Asset optimization
- Source maps for debugging

### Deployment

#### Static Hosting (Vercel, Netlify, GitHub Pages, etc.)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service

#### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t gestion-fournitures-frontend .
docker run -p 3000:3000 gestion-fournitures-frontend
```

#### Environment Configuration in Production

Set environment variables before deploying:

```bash
# For static hosting, create .env.production.local
VITE_API_URL=https://api.example.com/api
VITE_DEBUG=false
```

### Performance Optimization

- Code splitting with React Router for lazy-loaded pages
- Component lazy loading with React.lazy()
- Image optimization and responsive images
- CSS minification and purging with Tailwind
- JavaScript minification and bundling
- Tree-shaking of unused code
- Gzip compression support
- Cache busting with asset hashing

## Development Guidelines

### Adding a New Page

1. Create a new component in `src/pages/module/PageName.tsx`
2. Implement as a React component with TypeScript types
3. Add route in `src/App.tsx`
4. Add navigation link in `src/components/Sidebar.tsx`
5. Import required stores and services
6. Add page to breadcrumb if needed

Example:
```tsx
import { useEffect } from 'react';
import { useCatalogStore } from '@stores/catalogStore';
import { Card, Button } from '@components/index';

export const NewPage = () => {
  const { items, fetchItems } = useCatalogStore();

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>{/* Content */}</Card.Body>
      </Card>
    </div>
  );
};
```

### Adding a New Component

1. Create file in `src/components/ComponentName.tsx`
2. Export component with proper TypeScript types
3. Add documentation comment above component
4. Style with Tailwind CSS classes
5. Ensure strict TypeScript compliance
6. Add component to `src/components/index.ts` exports

Example:
```tsx
import React from 'react';

interface CustomComponentProps {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const CustomComponent: React.FC<CustomComponentProps> = ({ 
  title, 
  children, 
  onClick 
}) => {
  return (
    <div className="p-4 border rounded-lg" onClick={onClick}>
      <h2 className="font-semibold text-lg">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
};
```

### Using State Management

```tsx
import { useCatalogStore } from '@stores/catalogStore';

export const MyComponent = () => {
  const { articles, loading, error, fetchArticles } = useCatalogStore();

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
```

### Making API Calls

```tsx
import * as catalogService from '@services/catalogService';
import { useUIStore } from '@stores/uiStore';

export const MyComponent = () => {
  const { showNotification } = useUIStore();
  const [loading, setLoading] = React.useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const data = await catalogService.getArticles();
      showNotification('success', 'Data loaded successfully');
      // Handle data
    } catch (error) {
      showNotification('danger', 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  return <Button onClick={handleFetch} loading={loading}>Load Data</Button>;
};
```

### Code Quality Standards

- **TypeScript**: Use strict mode, avoid `any` type
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Use path aliases (@components, @stores, etc.)
- **Styling**: Tailwind CSS utility classes
- **Comments**: Only for complex logic, avoid obvious comments
- **Testing**: Write tests for critical paths

### Before Committing

1. Run linter and fix issues:
   ```bash
   npm run lint:fix
   ```

2. Format code:
   ```bash
   npm run format
   ```

3. Build to check for errors:
   ```bash
   npm run build
   ```

4. Test changes locally:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Build Errors

**TypeScript Compilation Errors**
```bash
npm run build
# Check the error messages and type definitions
```

**ESLint/Prettier Issues**
```bash
npm run lint:fix
npm run format
```

### Runtime Errors

**Check browser console for detailed error messages:**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for API call failures

### API Connection Issues

1. Verify `VITE_API_URL` is correct
2. Ensure backend API is running
3. Check CORS configuration on backend
4. Verify network connectivity
5. Check browser console for CORS errors

### Performance Issues

1. Check DevTools Performance tab
2. Enable debug mode: `VITE_DEBUG=true`
3. Review component re-renders with React DevTools
4. Check bundle size with build output
5. Profile with Chrome DevTools

### Module Resolution Errors

If path aliases don't work:
- Verify path mappings in `tsconfig.json`
- Clear `node_modules` and rebuild: `npm install && npm run build`
- Check file extensions in imports

### Styling Issues

**Tailwind classes not applying:**
- Verify `tailwind.config.js` includes correct content paths
- Check that CSS is imported in `src/main.tsx`
- Clear build cache: `rm -rf dist && npm run build`

**Dark mode not working:**
- Verify dark mode configuration in `tailwind.config.js`
- Check theme toggle implementation
- Verify localStorage persistence

## Contributing

1. Create a feature branch from `main`
2. Make your changes and test thoroughly
3. Run linting and formatting:
   ```bash
   npm run lint:fix && npm run format
   ```
4. Build and verify:
   ```bash
   npm run build
   ```
5. Commit with descriptive messages
6. Push and create a pull request

## License

[Your License Here]

## Support

For issues, questions, or suggestions:
- GitHub Issues: [Create an issue]
- Email: support@company.com
- Documentation: [Link to docs]

---

**Last Updated:** June 10, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

---

## Quick Reference

### Common Commands
```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Fix linting errors
npm run format       # Format code
```

### Useful Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
