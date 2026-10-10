
import { useState } from "react";
import { login } from "../api.js";

export default function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      if (!data?.token) {
        throw new Error("The server did not return a login token.");
      }

      onLogin(data);
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">🌿</div>
        <h1>Welcome to GreenBlog</h1>
        <p>Log in to share your stories.</p>

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New here?{" "}
          <button type="button" className="text-button" onClick={onRegister}>
            Create an account
          </button>
        </p>
      </form>
    </main>
  );
}
