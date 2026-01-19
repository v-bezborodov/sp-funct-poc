import Link from "next/link";
import client from "@/lib/apollo-server-client";
import { GetServerSideProps } from "next";
import { GET_ARTICLE_BY_ID } from "@/graphql/queries";
import { Article } from "@sports-app/shared";
import { GetArticleQuery } from "@/types";

export default function ArticlePage({ article }: { article: Article }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col py-16 px-8 bg-white dark:bg-black">
        <Link href="/" className="mb-6 text-blue-600 hover:underline">
          ← Back to Articles
        </Link>
        <article>
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="mb-8 w-full rounded-lg"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <p className="text-lg text-zinc-700 whitespace-pre-wrap">
            {article.content}
          </p>
        </article>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const { data } = await client.query<GetArticleQuery>({
      query: GET_ARTICLE_BY_ID,
      variables: { id },
    });

    if (!data?.article) {
      return { notFound: true };
    }

    return {
      props: { article: data.article },
    };
  } catch {
    return { notFound: true };
  }
};
