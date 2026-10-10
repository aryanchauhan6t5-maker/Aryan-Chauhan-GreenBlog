
import { useState } from "react";
import { createPost } from "../api.js";

export default function CreatePost({ token, onPostCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createPost(token, title.trim(), content.trim());
      setTitle("");
      setContent("");
      await onPostCreated();
    } catch (err) {
      setError(err.message || "Could not publish your post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-container">
      <h1>Create a new story</h1>
      <p>Share your ideas with the GreenBlog community.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="post-title">Post title</label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your story a title"
          maxLength={200}
          required
        />

        <label htmlFor="post-content">Your story</label>
        <textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          rows={10}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button className="primary-button" disabled={loading}>
            {loading ? "Publishing..." : "Publish Post"}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
