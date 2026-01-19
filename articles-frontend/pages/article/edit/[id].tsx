import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import client from "@/lib/apollo-server-client";
import { GET_ARTICLE_BY_ID, GET_ARTICLES } from "@/graphql/queries";
import { UPDATE_ARTICLE } from "@/graphql/mutations";
import { Article } from "@sports-app/shared";
import { GetServerSideProps } from "next/dist/types";

export default function EditArticle({ article }: { article: Article }) {
  const router = useRouter();
  const { title = "", content = "" } = article || {};
  const [form, setForm] = useState({ title: title, content: content });

  useEffect(() => {
    if (article) {
      setForm({ title: title, content: content });
    }
  }, [article]);

  const [updateArticle, { loading: isUpdating, error: serverError }] =
    useMutation(UPDATE_ARTICLE, {
      refetchQueries: [{ query: GET_ARTICLES }],
      onCompleted: () => router.push("/"),
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateArticle({
        variables: {
          id: article.id,
          input: { title: form.title, content: form.content },
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Mutation error:", err);
    }
  };

  if (!article)
    return <div className="p-10 text-center">Article not found.</div>;

  return (
    <div className="min-h-screen py-12 bg-zinc-50 dark:bg-black">
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl relative overflow-hidden">
        {isUpdating && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] dark:bg-black/70 transition-all">
            <svg
              className="h-12 w-12 animate-spin text-green-600"
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
            <p className="mt-4 font-bold text-zinc-800 dark:text-zinc-200">
              Updating Article...
            </p>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">
          Edit Article
        </h1>

        {serverError && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border-l-4 border-red-500">
            {serverError.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`${isUpdating ? "opacity-30" : "opacity-100"} transition-opacity`}
          >
            <label className="block text-sm font-semibold mb-2 dark:text-zinc-300">
              Title
            </label>
            <input
              value={form.title}
              disabled={isUpdating}
              className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div
            className={`${isUpdating ? "opacity-30" : "opacity-100"} transition-opacity`}
          >
            <label className="block text-sm font-semibold mb-2 dark:text-zinc-300">
              Content
            </label>
            <textarea
              value={form.content}
              disabled={isUpdating}
              className="w-full p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl h-48 bg-transparent outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-green-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? "Processing..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { id } = context.params;

  try {
    const { data } = await client.query({
      query: GET_ARTICLE_BY_ID,
      variables: { id },
      fetchPolicy: "no-cache",
    });

    // go 404 page
    if (!data?.article) {
      return { notFound: true };
    }

    return {
      props: {
        article: data.article,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return { notFound: true };
  }
}
