/**
 * types are here!
 * see shared types first before having another one here ;-)
 */

import { Article } from "@sports-app/shared";

/**
 * GraphQL query response types
 */
export interface GetArticlesQuery {
  articles: Article[];
}

export interface GetArticleQuery {
  article: Article;
}

/**
 * Component prop types
 */
export interface ArticlePageParams {
  id: string;
}

export interface ArticlePageProps {
  params: Promise<ArticlePageParams>;
}
