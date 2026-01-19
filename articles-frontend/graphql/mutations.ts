import { gql } from "@apollo/client";

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: ID!, $input: ArticleInput!) {
    updateArticle(id: $id, input: $input) {
      id
      title
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($input: ArticleInput!) {
    createArticle(input: $input) {
      id
    }
  }
`;
