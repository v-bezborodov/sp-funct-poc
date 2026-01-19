export const typeDefs = `#graphql
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
