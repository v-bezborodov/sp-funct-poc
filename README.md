# 🛠️ Sports Articles Monorepo

A high-performance monorepo architecture featuring a Next.js frontend, an Apollo Server (Express) backend, and a Prisma ORM data layer. The project uses pnpm workspaces to manage shared logic and types efficiently.

## 🛠️ Architecture Overview
- The project is structured to ensure a "Single Source of Truth" for data models and validation.

- apps/articles-frontend: Next.js application using Apollo Client for data fetching and Tailwind CSS for styling.

- apps/articles-backend: Node.js/TypeScript server running Apollo Server and Prisma.

- packages/shared: A local workspace package containing shared TypeScript interfaces (e.g., Article, ArticleInput) and validation constants used by both apps.


## 🛠️ Key Features
- Shared Types: All API structures are defined in @sports-app/shared to prevent type drift.

- Instant UI Updates: Implements Apollo Cache modification for deletions to ensure zero-latency UI responses.

- CSV Seeding: Backend includes a custom script to populate the database directly from a sports-articles CSV file.

- Validation Layer: Integrated character length constraints that align the UI forms with Database VarChar limits.


## 🛠️ Local Setup Instructions

### 1. Infrastructure & Environment
From the root directory:
```bash
pnpm install
cp articles-backend/.env.example articles-backend/.env
docker-compose up -d
```

### 2. Database Initialization
```bash
cd articles-backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed # Optional: Populates initial sports news
cd ..
```

To reset schema, from your articles-backend folder:
```bash
pnpm exec prisma migrate reset
```

### 3. Run the Application
```bash
pnpm dev
```

### Recommended 

Make sure you have this file in `articles-backend/.env.example` so the reviewer knows exactly what to paste:

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sports_db?schema=public"
PORT=4000
```