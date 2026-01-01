import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setLoading(true);
      const data = await login(username, password);
      console.log("Login OK:", data);

      setSuccessMsg("Login successful ✨");

      setTimeout(() => {
        navigate("/tasks"); 
      }, 500);
    } catch (error) {
      console.error(error);
      setErrorMsg("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="container auth-container">
        <section className="card auth-card">

          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to continue in CheckGo.</p>
          </div>

          {errorMsg && <p className="error-text">{errorMsg}</p>}
          {successMsg && <p className="success-text">{successMsg}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="form-field">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </label>

            <label className="form-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </p>
            <p>
              <Link to="/">Back to home</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

