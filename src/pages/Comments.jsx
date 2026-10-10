
import { useEffect, useState } from "react";
import {
  addComment,
  deleteComment,
  getComments,
} from "../api.js";

export default function Comments({ postId, token, user }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadComments() {
    setLoading(true);

    try {
      // Pass the token when loading comments
      const data = await getComments(postId, token);

      setComments(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load comments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [postId, token]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      await addComment(token, {
        postId,
        content: content.trim(),
        author: user?.name || user?.email || "User",
        authorEmail: user?.email || "",
      });

      setContent("");
      await loadComments();
    } catch (err) {
      setError(err.message || "Could not add comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this comment?")) return;

    setError("");

    try {
      await deleteComment(token, id);
      await loadComments();
    } catch (err) {
      setError(err.message || "Could not delete comment.");
    }
  }

  return (
    <section className="comments-section">
      <h3>Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a comment..."
          rows={3}
          required
        />

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Comment"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {loading && <p>Loading comments...</p>}

      {!loading && comments.length === 0 && !error && (
        <p className="muted-text">
          No comments yet. Start the conversation.
        </p>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <article className="comment-card" key={comment.id}>
            <div className="comment-heading">
              <strong>
                {comment.author || comment.authorEmail || "User"}
              </strong>

              {comment.authorEmail === user?.email && (
                <button
                  type="button"
                  className="text-button danger-text"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>

            <p>{comment.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
