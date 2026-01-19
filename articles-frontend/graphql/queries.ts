import { gql } from "@apollo/client";

export const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      content
      imageUrl
      createdAt
    }
  }
`;

export const GET_ARTICLE_BY_ID = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      content
      imageUrl
    }
  }
`;
