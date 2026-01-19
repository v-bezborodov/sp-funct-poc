import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { CREATE_ARTICLE } from "@/graphql/mutations";
import { GET_ARTICLES } from "@/graphql/queries";

export default function CreateArticle() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [clientError, setClientError] = useState("");

  const [createArticle, { loading, error: serverError }] = useMutation(
    CREATE_ARTICLE,
    {
      refetchQueries: [{ query: GET_ARTICLES }],
      onCompleted: () => {
        router.push("/");
      },
    },
  );

  const validate = () => {
    if (form.title.length < 5) return "Title is too short (min 5 chars).";
    if (form.title.length > 255) return "Title is too long (max 255 chars).";
    if (form.content.length < 20)
      return "Content must be at least 20 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();

    if (validationError) {
      setClientError(validationError);
      return;
    }

    try {
      setClientError("");
      await createArticle({ variables: { input: form } });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <div>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
        {(clientError || serverError) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            {clientError || serverError?.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border rounded"
            placeholder="Article Title"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full p-3 border rounded h-40"
            placeholder="Article Content"
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold"
          >
            {loading ? "Saving..." : "Create Article"}
          </button>
        </form>
      </div>
    </div>
  );
}
