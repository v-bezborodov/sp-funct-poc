import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { VALIDATION_LIMITS } from "@sports-app/shared/validation";
import { Article, ArticleInput } from "@sports-app/shared/types";
import { GraphQLError } from "graphql";
import { typeDefs } from "./schema";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const resolvers = {
  Query: {
    articles: async (): Promise<Article[]> => {
      return prisma.sportsArticle.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      }) as unknown as Article[];
    },
    article: async (_: unknown, { id }: { id: string }): Promise<Article | null> => {
      return prisma.sportsArticle.findUnique({ 
        where: { id } 
      }) as unknown as Article | null;
    },
  },
  Mutation: {
    createArticle: async (_: unknown, { input }: { input: ArticleInput }) => {
      const { title, content } = input;

      if (title.length < VALIDATION_LIMITS.TITLE.MIN || title.length > VALIDATION_LIMITS.TITLE.MAX) {
        throw new GraphQLError("Title must be between 5 and 255 characters.", {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      if (content.length < VALIDATION_LIMITS.CONTENT.MIN || content.length > VALIDATION_LIMITS.CONTENT.MAX) {
        throw new GraphQLError("Content must be at least 20 characters.", {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      return prisma.sportsArticle.create({ data: input });
    },
    updateArticle: async (_: unknown, { id, input }: { id: string; input: ArticleInput }) => {
      return prisma.sportsArticle.update({
        where: { id },
        data: input,
      });
    },
    deleteArticle: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      try {
        await prisma.sportsArticle.update({
          where: { id },
          data: { deletedAt: new Date() }
        });
        return true;
      } catch (error) {
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
