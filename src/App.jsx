
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import "./index.css";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser")) || null;
  } catch {
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(readUser);
  const [page, setPage] = useState("home");
  const [refreshKey, setRefreshKey] = useState(0);

  function handleLogin(data) {
    localStorage.setItem("token", data.token);
    const currentUser = {
      id: data.id,
      name: data.name,
      email: data.email,
    };
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
    setUser(currentUser);
    setToken(data.token);
    setPage("home");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setToken(null);
    setUser(null);
    setPage("home");
  }

  async function handlePostCreated() {
    setRefreshKey((key) => key + 1);
    setPage("home");
  }

  if (!token) {
    if (page === "register") {
      return (
        <Register
          onRegistered={() => setPage("login")}
          onLogin={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setPage("register")}
      />
    );
  }

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        page={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />

      <main className="app-main">
        {page === "create" ? (
          <CreatePost
            token={token}
            onPostCreated={handlePostCreated}
            onCancel={() => setPage("home")}
          />
        ) : (
          <Home
            token={token}
            user={user}
            refreshKey={refreshKey}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>🌱 GreenBlog — Share ideas. Grow together.</p>
      </footer>
    </div>
  );
}
