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

src/
├── api/ # Main API source code (versioned)
│ ├── v1/ # API version 1
│ │ ├── constants/ # Constant values used in API
│ │ ├── errors/ # Custom error definitions and handlers
│ │ ├── helpers/ # Reusable helper functions
│ │ ├── init/ # Initialization scripts (e.g., DB connection)
│ │ ├── locales/ # i18n localization files
│ │ ├── middlewares/ # Custom Express middlewares
│ │ ├── modules/ # Feature-based modules
│ │ │ ├── auth/ # Authentication module
│ │ │ │ ├── test/
│ │ │ │ ├── interface/
│ │ │ │ ├── swagger/
│ │ │ │ ├── utils/
│ │ │ │ ├── auth.controller.ts
│ │ │ │ ├── auth.route.ts
│ │ │ │ ├── auth.service.ts
│ │ │ │ ├── auth.swagger.ts
│ │ │ │ └── auth.validator.ts
│ │ │ └── others/ # Other feature modules follow the same pattern
│ │ ├── services/ # Shared services (e.g., DB, Redis, S3)
│ │ │ ├── postgresql/
│ │ │ ├── redis/
│ │ │ ├── s3-service/
│ │ │ ├── send-grid/
│ │ │ └── index.ts
│ │ ├── tasks/ # Background jobs using BullMQ
│ │ │ ├── bullmq/
│ │ │ ├── queue/
│ │ │ └── workers/
│ │ ├── templates/ # EJS/email templates
│ │ │ ├── auth/
│ │ │ └── other/
│ │ ├── utils/ # Common/shared utility functions
│ │ └── routes.ts # Central route registry
├── config/ # App and 3rd-party service configuration
├── migrations/ # DB migration files (e.g., TypeORM)
├── logs/ # Log files (runtime, errors, etc.)
├── app.ts # Express app setup and middleware
├── server.ts # App entry point
└── jest.setup.ts # Jest test setup/config

## 📄 API Documentation

After starting the server, you can access the interactive API documentation powered by Swagger UI at:
http://localhost:<your-port>/api-docs

After starting the server, you can access the interactive API documentation powered by Swagger UI at:
http://localhost:<your-port>/api-docs

## License

This project is licensed under the MIT License.
