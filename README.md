# Portfolio REST API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Portfolio is a TypeScript-based Node.js backend application built for modern web systems. It features PostgreSQL integration with TypeORM, Redis-powered queues using BullMQ, Swagger API documentation, AWS S3 file uploads, SendGrid for email communication, and GitHub Actions-based CI/CD deployment to AWS EC2.

---

## 📚 Table of Contents

- [Features](#-features)
- [Getting Started](#️-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [License](#license)

---

## 🚀 Features

- 🌐 REST API with Express.js and TypeScript
- 📦 PostgreSQL database with TypeORM
- 🔐 JWT authentication
- 📨 Email support via SendGrid
- ☁️ AWS S3 file uploads
- 📂 File uploads with Multer
- 🧵 Job queues with Bull and BullMQ using Redis
- 🛡️ Secure HTTP headers via Helmet
- 📘 Auto-generated API docs with Swagger
- 📝 Email templating with EJS
- 📊 Logging with Winston
- 🌍 Internationalization (i18n)
- 🔁 CI/CD with GitHub Actions & AWS EC2 (OIDC)

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone git@github.com:jahidhiron/portfolio-node-api.git
cd portfolio-node-api
npm install
npm run migrate-up:dev
npm run dev
```

## 📁 Project Structure

```

src/
├── api/                                # Main API source code (versioned)
│   └── v1/                             # Version 1 of the API
│       ├── constants/                  # Global constants (enums, static values, etc.)
│       ├── errors/                     # Custom error classes and centralized error handling
│       ├── helpers/                    # Utility functions to assist with API logic
│       ├── init/                       # Initialization scripts (e.g., DB connections, services)
│       ├── locales/                    # Localization (i18n) resources and translation files
│       ├── middlewares/                # Express middleware (e.g., auth, logging, validation)
│       ├── modules/                    # Feature-specific modules (organized by domain)
│       │   ├── auth/                   # Authentication module
│       │   │   ├── test/               # Unit and integration tests for the auth module
│       │   │   ├── interface/          # Interfaces and TypeScript types
│       │   │   ├── swagger/            # Swagger API documentation for auth
│       │   │   ├── utils/              # Auth-specific utility functions
│       │   │   ├── auth.controller.ts  # Auth route handlers
│       │   │   ├── auth.route.ts       # Auth route definitions
│       │   │   ├── auth.service.ts     # Auth business logic and service layer
│       │   │   ├── auth.swagger.ts     # Swagger definitions for auth endpoints
│       │   │   ├── auth.validator.ts   # Request validation for auth endpoints
│       │   └── others/                 # Other feature modules following same structure as auth
│       ├── services/                   # Shared service integrations (DB, Redis, S3, etc.)
│       │   ├── postgresql/             # PostgreSQL service and connection logic
│       │   ├── redis/                  # Redis configuration and utilities
│       │   ├── s3-service/             # AWS S3 storage service
│       │   ├── send-grid/              # SendGrid email service integration
│       │   └── index.ts                # Central exporter for services
│       ├── tasks/                      # Background jobs and queue management (BullMQ)
│       │   ├── bullmq/                 # BullMQ setup and configuration
│       │   ├── queue/                  # Queue definitions and producers
│       │   ├── workers/                # Job processors/consumers (workers)
│       ├── templates/                  # EJS templates for emails and other content
│       │   ├── auth/                   # Auth-related email templates
│       │   └── other/                  # Other module templates
│       ├── utils/                      # General-purpose utilities used across the API
│       └── routes.ts                   # Registers all API routes for v1
├── config/                             # Application-wide and third-party configurations
├── migrations/                         # Database migration files (e.g., TypeORM)
├── logs/                               # Log output folder
├── app.ts                              # Application bootstrap and middleware setup
├── server.ts                           # Starts the HTTP server
└── jest.setup.ts                       # Jest configuration and test setup script


```

## 📄 API Documentation

After starting the server, you can access the interactive API documentation powered by Swagger UI at:
http://localhost:<your-port>/api-docs

After starting the server, you can access the interactive API documentation powered by Swagger UI at:
http://localhost:<your-port>/api-docs

## License

This project is licensed under the MIT License.
