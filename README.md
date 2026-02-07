# @nexus/shared-contracts

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Build](https://img.shields.io/badge/Build-tsup-orange)](https://tsup.egoist.dev/)
[![Tests](https://img.shields.io/badge/Tests-vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

Shared type definitions, Zod validation schemas, utilities, and API client for the **Nexus** microservices platform.

## Overview

This package is the foundation consumed by all Nexus services:

- **Types** — User, Project, Task, Comment, Notification, and common API types
- **Schemas** — Zod validation schemas for all request/response payloads
- **Utilities** — Custom error classes, JWT helpers, EventBus
- **API Client** — Typed HTTP client for inter-service communication

## Installation

```bash
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build with tsup (ESM + DTS) |
| `npm test` | Run tests with vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Type-check with tsc |

## Project Structure

```
src/
├── index.ts              # Barrel export
├── types/
│   ├── user.ts           # User, UserRole, AuthToken, LoginRequest, RegisterRequest
│   ├── project.ts        # Project, Task, Comment, TaskStatus, TaskPriority
│   ├── notification.ts   # Notification, NotificationChannel, NotificationType
│   └── common.ts         # ApiResponse, ApiError, PaginatedResponse, PaginationQuery
├── schemas/
│   ├── user.schemas.ts
│   ├── project.schemas.ts
│   ├── notification.schemas.ts
│   └── common.schemas.ts
├── events/
│   └── events.ts         # ServiceEvent type, EventBus class
├── client/
│   └── api-client.ts     # NexusApiClient for inter-service HTTP calls
└── utils/
    ├── errors.ts         # AppError, NotFoundError, ValidationError, AuthError
    └── jwt.ts            # JWT sign/verify helpers
```

## Usage

```typescript
import {
  User, Task, TaskStatus,
  loginSchema, createTaskSchema,
  AppError, NotFoundError,
  signToken, verifyToken,
  NexusApiClient,
} from '@nexus/shared-contracts';
```

## Part of Nexus Platform

| Service | Port | Repository |
|---------|------|------------|
| **Shared Contracts** | — | [nexus-shared-contracts](https://github.com/nikrich/nexus-shared-contracts) |
| API Gateway | 3000 | [nexus-api-gateway](https://github.com/nikrich/nexus-api-gateway) |
| User Service | 3001 | [nexus-user-service](https://github.com/nikrich/nexus-user-service) |
| Content Service | 3002 | [nexus-content-service](https://github.com/nikrich/nexus-content-service) |
| Notification Service | 3003 | [nexus-notification-service](https://github.com/nikrich/nexus-notification-service) |
