import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";

import client from "@/lib/apollo-server-client";
import { DELETE_ARTICLE } from "@/graphql/mutations";
import { GET_ARTICLES } from "@/graphql/queries";
import { Article } from "@sports-app/shared";

interface HomeProps {
  articles: Article[];
}

export default function Home({ articles: initialArticles }: HomeProps) {
  const [deleteArticle, { loading: isDeleting }] = useMutation(DELETE_ARTICLE);

  const { data } = useQuery(GET_ARTICLES);

  const currentArticles = data?.articles ?? initialArticles;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await deleteArticle({
        variables: { id },
        update(cache, { data: mutationData }) {
          if (mutationData?.deleteArticle) {
            cache.modify({
              fields: {
                articles(existingArticleRefs = [], { readField }) {
                  return existingArticleRefs.filter(
                    (ref: any) => readField("id", ref) !== id,
                  );
                },
              },
            });
          }
        },
      });
    } catch {
      window.alert("🚨 Error deleting article.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-6xl py-8 px-4 sm:px-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Sports Articles
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Latest sports news from around the world
            </p>
          </div>

          <Link
            href="/article/create"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all active:scale-95"
          >
            <span className="text-xl mr-2">+</span> Create Article
          </Link>
        </div>
        <div className="relative">
          {isDeleting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-black/50 transition-opacity">
              <div className="flex flex-col items-center">
                {/* SVG Spinner */}
                <svg
                  className="h-12 w-12 animate-spin text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="mt-4 font-bold text-zinc-900 dark:text-white">
                  Deleting Article...
                </p>
              </div>
            </div>
          )}

          {currentArticles.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentArticles.map((article: Article) => (
                <div
                  key={article.id}
                  className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-shadow flex flex-col"
                >
                  {article.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <h2 className="text-xl font-bold mb-2 line-clamp-1 dark:text-zinc-50">
                    {article.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 line-clamp-3">
                    {article.content}
                  </p>

                  <div className="mt-auto flex items-center gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <Link
                      href={`/article/edit/${article.id}`}
                      className="text-blue-600 text-sm font-bold hover:text-blue-800"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={isDeleting}
                      onClick={() => handleDelete(article.id)}
                      className={
                        "opacity-100 text-red-500 text-sm font-bold hover:text-red-700"
                      }
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <Link
                      href={`/article/${article.id}`}
                      className="ml-auto text-zinc-400 text-sm font-medium hover:text-zinc-600"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center">
              No articles available
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: GET_ARTICLES,
    fetchPolicy: "no-cache",
  });

  return {
    props: {
      articles: data?.articles?.slice(0, 100) || [],
    },
    revalidate: 60,
  };
}
