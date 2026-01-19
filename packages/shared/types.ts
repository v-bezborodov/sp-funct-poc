export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt?: string | null;
}

export interface ArticleInput {
  title: string;
  content: string;
  imageUrl: string;
}
