import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllUsers } from "../services/adminService";

const roleLabel = (role) => {
  if (role === "ROLE_ADMIN") return "Admin";
  if (role === "ROLE_USER") return "User";
  return role;
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [query, setQuery] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) {
        setErrorMsg("You do not have access to this page.");
      } else {
        setErrorMsg("Unable to load users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const rolesText = Array.isArray(u.roles)
        ? u.roles.join(" ").toLowerCase()
        : "";

      return (
        String(u.id).includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        rolesText.includes(q)
      );
    });
  }, [users, query]);

  return (
    <main className="page admin-page">
      <div className="container">
        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <section className="admin-grid">
          {/* LEFT */}
          <div className="card admin-form-card">
            <div className="panel-header">
              <p className="panel-title">Directory</p>
              <p className="panel-subtitle">Search and review accounts.</p>
            </div>

            <div className="tasks-form">
              <label className="form-field">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Username, email, role..."
                />
              </label>

              <button
                className="btn btn-primary admin-refresh-btn"
                onClick={loadUsers}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Search"}
              </button>

              <div className="admin-stats">
                <span className="badge">Total: {users.length}</span>
                <span className="badge">Showing: {filteredUsers.length}</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card admin-list-card">
            {loading ? (
              <div className="empty-state">
                <p className="empty-title">Loading users…</p>
                <p className="empty-subtitle">Fetching data from the server.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">No users found</p>
                <p className="empty-subtitle">Try a different search.</p>
              </div>
            ) : (
              <div className="admin-users-list">
                {filteredUsers.map((u) => {
                  const roles = Array.isArray(u.roles) ? u.roles : [];

                  return (
                    <article key={u.id} className="task-card admin-user-item">
                      <div className="task-card-header">
                        <div>
                          <h3 className="task-title">
                            {u.username} <span className="admin-id">#{u.id}</span>
                          </h3>
                          <p className="task-meta">{u.email}</p>
                        </div>
                      </div>

                      <div className="task-footer">
                        <span className="task-meta">
                          Roles:{" "}
                          {roles.length ? roles.map(roleLabel).join(", ") : "—"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}




