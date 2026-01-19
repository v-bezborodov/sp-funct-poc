# ⚙️ Articles Backend

Node.js GraphQL server providing the API for the Sports Articles app.

## 🛠 Tech Stack
- **Server**: Apollo Server + Express
- **ORM**: Prisma
- **Database**: PostgreSQL

## 📂 Data Seeding
This backend includes a CSV parser that seeds the database from:
`prisma/sports-articles.csv`

## 🏃 Local Commands
- `pnpm dev`: Start the server with `ts-node-dev`.
- `npx prisma generate`: Update the Prisma Client types.
- `npx prisma migrate dev`: Create and apply database migrations.