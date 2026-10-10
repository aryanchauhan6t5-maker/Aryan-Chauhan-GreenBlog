
import { useEffect, useState } from "react";
import { deletePost, getPosts, updatePost } from "../api.js";
import Comments from "./Comments.jsx";

export default function Home({ token, user, refreshKey }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await getPosts(token);
      setPosts(Array.isArray(data) ? data : data?.posts || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  loadPosts();
}, [refreshKey, token]);


  function startEditing(post) {
    setEditingId(post.id);
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
  }

  async function saveEdit(id) {
    try {
      await updatePost(token, id, editTitle.trim(), editContent.trim());
      setEditingId(null);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Could not update post.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost(token, id);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Could not delete post.");
    }
  }

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">🌿 A community of storytellers</span>
          <h1>Ideas that inspire. Stories that connect.</h1>
          <p>
            Discover fresh perspectives, share your experiences, and grow
            together—one story at a time.
          </p>
        </div>
      </section>

      <section className="blog-section">
        <div className="section-heading">
          <div>
            <span className="section-label">THE COMMUNITY</span>
            <h2>Latest Stories</h2>
          </div>
          <span className="post-count">{posts.length} posts</span>
        </div>

        {loading && <p>Loading posts...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <div className="no-posts-box">
            <div className="empty-icon">🌱</div>
            <h3>No stories yet</h3>
            <p>Be the first to share something with the community.</p>
          </div>
        )}

        <div className="posts-grid">
          {posts.map((post, index) => {
            const isOwner =
              user?.email &&
              (post.authorEmail === user.email ||
                post.email === user.email);

            return (
              <article className="premium-blog-card" key={post.id}>
                {editingId === post.id ? (
                  <div className="edit-container">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      aria-label="Edit post title"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={6}
                      aria-label="Edit post content"
                    />
                    <div className="post-buttons">
                      <button
                        className="primary-button"
                        onClick={() => saveEdit(post.id)}
                      >
                        Save
                      </button>
                      <button
                        className="secondary-button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="blog-top">
                      <span className="category-badge">Community Story</span>
                      <span className="post-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="premium-blog-title">{post.title}</h3>
                    <p className="premium-blog-content">{post.content}</p>

                    <div className="author-section">
                      <div className="author-avatar">
                        {(post.author || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="author-name">
                          {post.author || "GreenBlog Member"}
                        </div>
                        <div className="author-label">Contributor</div>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="post-actions">
                        <button
                          className="secondary-button"
                          onClick={() => startEditing(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}

                <Comments postId={post.id} token={token} user={user} />
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
