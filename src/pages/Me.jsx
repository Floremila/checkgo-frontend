import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";

function Me() {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load user information.");
      }
    }
    fetchUser();
  }, []);

  if (errorMsg) return <p className="container error-text">{errorMsg}</p>;
  if (!user) return <p className="container">Loading user data…</p>;

  return (
    <main className="page profile-page">
      <div className="container">
        <section className="card profile-card">
          <div className="profile-header">
            <div>
              <h1 className="profile-title">My Profile</h1>
            </div>

            <div className="profile-avatar" aria-hidden="true">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <div className="profile-label">User ID</div>
              <div className="profile-value">{user.id}</div>
            </div>

            <div className="profile-field">
              <div className="profile-label">Username</div>
              <div className="profile-value">{user.username}</div>
            </div>

            <div className="profile-field profile-field-full">
              <div className="profile-label">Email</div>
              <div className="profile-value">{user.email}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Me;

