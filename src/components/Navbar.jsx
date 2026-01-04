import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../services/authService";

function safeGetRoles() {
  try {
    return JSON.parse(localStorage.getItem("roles") || "[]");
  } catch {
    return [];
  }
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [roles, setRoles] = useState(safeGetRoles());

  // Re-check auth state when route changes
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setUsername(localStorage.getItem("username"));
    setRoles(safeGetRoles());
  }, [location.pathname]);

  // Re-check auth state if changed in another tab
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("accessToken"));
      setUsername(localStorage.getItem("username"));
      setRoles(safeGetRoles());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isAdmin = roles.includes("ROLE_ADMIN");

  const handleLogout = () => {
    logout();
    setToken(null);
    setUsername(null);
    setRoles([]);
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `navbar-link ${isActive ? "navbar-link-active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            CheckGo
          </Link>

          {token && (
            <>
              <NavLink to="/tasks" className={navClass}>
                Tasks
              </NavLink>

              <NavLink to="/me" className={navClass}>
                My Profile
              </NavLink>

              {isAdmin && (
                <NavLink to="/admin/users" className={navClass}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="navbar-right">
          {!token ? (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="navbar-user">
                Signed in as <strong>{username}</strong>
              </span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
