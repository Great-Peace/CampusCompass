# CampusCompass Backend

Backend API for CampusCompass platform built with NestJS.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Update the environment variables with your configuration

## Database Setup

```bash
# Create database
createdb campuscompass

# Run migrations (if you create any)
npm run migration:run
```

## Running the Application

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, visit:
- http://localhost:3000/api/v1/docs

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── common/           # Shared utilities, decorators, guards
├── config/           # Configuration files
├── database/         # Entities and repositories
│   ├── entities/     # TypeORM entities
│   └── repositories/ # Repository pattern implementations
├── modules/          # Feature modules
│   ├── auth/         # Authentication & authorization
│   ├── locations/    # Location management
│   ├── occupancy/    # Occupancy tracking
│   ├── spots/        # Campus spots & recommendations
│   ├── buddy/        # Trip & buddy system
│   ├── notifications/# Push notifications
│   └── admin/        # Admin dashboard
├── app.module.ts     # Root module
└── main.ts          # Application entry point
```

## Key Features

- JWT Authentication with Google OAuth
- Role-based access control (Admin, Student, Visitor, Guest)
- Real-time occupancy updates via WebSocket
- RESTful API with Swagger documentation
- Repository pattern for database operations
- Comprehensive error handling

## API Endpoints

### Authentication
- POST /api/v1/auth/register - Register new user
- POST /api/v1/auth/login - Login with credentials
- GET /api/v1/auth/google - Google OAuth
- GET /api/v1/auth/guest-token - Get guest access

### Locations
- GET /api/v1/locations - Get all locations
- GET /api/v1/locations/search - Search locations
- GET /api/v1/locations/nearby - Find nearby locations
- POST /api/v1/locations/route - Calculate route

### Occupancy
- GET /api/v1/occupancy/location/:id - Get current occupancy
- POST /api/v1/occupancy/update - Update occupancy status
- GET /api/v1/occupancy/history/:id - Get historical data

### Spots
- GET /api/v1/spots - Get all spots
- POST /api/v1/spots - Create new spot
- POST /api/v1/spots/:id/react - Like/unlike spot
- POST /api/v1/spots/:id/comments - Add comment

### Buddy/Trips
- GET /api/v1/trips - Get open trips
- POST /api/v1/trips - Create new trip
- POST /api/v1/trips/:id/join - Request to join trip
- GET /api/v1/trips/my-trips - Get user trips

### Notifications
- GET /api/v1/notifications - Get user notifications
- PUT /api/v1/notifications/:id/read - Mark as read

### Admin (Admin only)
- GET /api/v1/admin/users - Manage users
- GET /api/v1/admin/reports - Content moderation
- GET /api/v1/admin/analytics - Platform analytics
- POST /api/v1/admin/notifications/broadcast - Send announcements
```