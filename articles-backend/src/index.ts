import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as Prisma from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new (Prisma as any).PrismaClient({ adapter });

const typeDefs = `#graphql
  type SportsArticle {
    id: ID!
    title: String!
    content: String!
    imageUrl: String
    createdAt: String
  }

  input ArticleInput {
    title: String!
    content: String!
    imageUrl: String
  }

  type Query {
    articles: [SportsArticle!]!
    article(id: ID!): SportsArticle
  }

  type Mutation {
    createArticle(input: ArticleInput!): SportsArticle!
    updateArticle(id: ID!, input: ArticleInput!): SportsArticle!
    deleteArticle(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    articles: () =>
      prisma.sportsArticle.findMany({ where: { deletedAt: null } }),
    article: (_: any, { id }: { id: string }) =>
      prisma.sportsArticle.findUnique({ where: { id } }),
  },
  Mutation: {
    createArticle: (_: any, { input }: any) => {
      const { title, content } = input;

      if (title.length < 5 || title.length > 255) {
        throw new Error("Title must be between 5 and 255 characters.");
      }
      if (content.length < 20 || content.length > 5000) {
        throw new Error("Content must be between 20 and 5000 characters.");
      }

      return prisma.sportsArticle.create({ data: input });
    },
    updateArticle: async (_: any, { id, input }: any) => {
      return await prisma.sportsArticle.update({
        where: { id: String(id) },
        data: input,
      });
    },
    deleteArticle: async (_: any, { id }: any) => {
      try {
        await prisma.sportsArticle.delete({
          where: { id: String(id) },
        });
        return true;
      } catch {
        return false;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const port = Number(process.env["APOLO_PORT"] ?? 4000);

startStandaloneServer(server, {
  listen: { port },
}).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at ${url}`);
});
