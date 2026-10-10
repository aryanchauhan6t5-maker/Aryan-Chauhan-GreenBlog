
export default function Navbar({ user, page, onNavigate, onLogout }) {
  return (
    <header className="site-header">
      <button
        className="brand-button"
        onClick={() => onNavigate("home")}
      >
        🌿 GreenBlog
      </button>

      <nav className="site-nav">
        <button
          className={page === "home" ? "nav-link active" : "nav-link"}
          onClick={() => onNavigate("home")}
        >
          Home
        </button>

        <button
          className={page === "create" ? "nav-link active" : "nav-link"}
          onClick={() => onNavigate("create")}
        >
          + Create Post
        </button>

        <span className="user-label">
          <span className="user-avatar">
            {(user?.name || user?.email || "U")
              .charAt(0)
              .toUpperCase()}
          </span>
          {user?.name || user?.email || "User"}
        </span>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}
