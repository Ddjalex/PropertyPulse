# Overview

GIFI Real Estate is a comprehensive real estate management platform built with React, Express, and PostgreSQL. The application serves as both a public-facing property showcase and an internal management system for real estate operations in Ethiopia. It features property listings with advanced filtering, team member profiles, construction project tracking, blog content management, and lead generation capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with React 18 using TypeScript and follows a modern component-based architecture:

- **UI Framework**: Uses shadcn/ui components with Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation schemas
- **Build Tool**: Vite for fast development and optimized production builds

The application is structured with public pages (Landing, Properties, Projects, Team, Contact) and protected admin pages (Dashboard, Property Management, Lead Management) with role-based access control.

## Backend Architecture

The server follows a REST API architecture using Express.js with TypeScript:

- **Framework**: Express.js with middleware for JSON parsing, CORS, and request logging
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Authentication**: Replit OpenID Connect integration with session-based authentication
- **API Structure**: RESTful endpoints organized by resource type (properties, leads, team members, etc.)
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

The backend implements a repository pattern through the storage interface, abstracting database operations and providing clean separation of concerns.

## Database Design

Uses PostgreSQL with Drizzle ORM for schema management:

- **Core Entities**: Users, Properties, Projects, Construction Updates, Blog Posts, Team Members, Leads, Settings
- **Property Management**: Comprehensive property schema with types (apartment, villa, office, commercial, land), listing types (sale/rent), status tracking, and rich metadata
- **Session Storage**: PostgreSQL-backed session storage for authentication persistence
- **Enum Types**: Database-level enums for property types, statuses, and listing types ensuring data consistency
- **Relationships**: Proper foreign key relationships between projects and construction updates

## Authentication and Authorization

Implements Replit's OpenID Connect authentication:

- **Session Management**: Server-side sessions with PostgreSQL storage using connect-pg-simple
- **User Roles**: Role-based access control (user, admin, editor, agent)
- **Protected Routes**: Frontend route protection with authentication state management
- **API Security**: Authentication middleware for sensitive endpoints

## External Dependencies

- **Database**: Neon PostgreSQL serverless database with connection pooling
- **Authentication Provider**: Replit OpenID Connect for user authentication
- **UI Components**: Radix UI primitives for accessible component foundation
- **Development Tools**: Replit-specific plugins for development environment integration
- **Session Storage**: PostgreSQL-backed sessions with automatic cleanup
- **Email/Communication**: Placeholder implementations for phone and WhatsApp integrations

The architecture supports both development and production environments with proper environment variable configuration and database connection management.