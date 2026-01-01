import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // Re-check auth state when route changes
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
    setUsername(localStorage.getItem("username"));
  }, [location.pathname]);

  // Re-check auth state if changed in another tab
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("accessToken"));
      setUsername(localStorage.getItem("username"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    logout();
    setToken(null);
    setUsername(null);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            CheckGo
          </Link>

          {token && (
            <>
              <Link to="/tasks" className="navbar-link">
                Tasks
              </Link>
              <Link to="/me" className="navbar-link">
                My Profile
              </Link>
            </>
          )}
        </div>

        <div className="navbar-right">
          {!token ? (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
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
