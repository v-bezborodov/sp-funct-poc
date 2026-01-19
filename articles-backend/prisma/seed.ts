/* eslint-disable no-console */

import "dotenv/config";
import * as Prisma from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { Article } from "@sports-app/shared";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new (Prisma as any).PrismaClient({ adapter });

async function main() {
  // CSV file is in the prisma directory, relative to the backend root
  const csvFilePath = path.resolve(
    process.cwd(),
    "prisma",
    "sports-articles.csv",
  );

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV file not found at ${csvFilePath}`);
  }

  const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  // Cast the output to ArticleRecord[]
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  }) as Article[];

  console.log(`🌱 Seeding ${records.length} articles from CSV...`);

  for (const record of records) {
    await prisma.sportsArticle.upsert({
      where: { id: record.id.toString() },
      update: {},
      create: {
        id: record.id.toString(),
        title: record.title,
        content: record.content,
        imageUrl: record.imageUrl,
        createdAt: new Date(record.createdAt || Date.now()),
      },
    });
  }

  console.log("✅ Seed successful");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
