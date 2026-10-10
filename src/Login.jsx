import { useState } from "react";
import { login } from "./api.js";

export default function Login({ onLoginSuccess }) {
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
      if (!data.token) throw new Error("Login response did not contain a token.");
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message || "Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: "400px", margin: "70px auto", padding: "25px", fontFamily: "Arial", border: "1px solid #ddd", borderRadius: "12px" }}>
      <h1>My Blogging Platform</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px", boxSizing: "border-box" }} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px", boxSizing: "border-box" }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
    </main>
  );
}
