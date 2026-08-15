import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getCurrentUser, logout as apiLogout } from "../api/auth.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user") || localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // =====================================================
  // INITIALIZE / RESTORE AUTHENTICATION VIA /api/auth/me/
  // =====================================================

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    if (!token && !refresh) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn("Auth verification failed:", err?.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // =====================================================
  // LISTEN FOR LOGIN / LOGOUT EVENTS
  // =====================================================

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("access_token");
      const stored = localStorage.getItem("user") || localStorage.getItem("auth_user");

      if (token && stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  // =====================================================
  // LOGIN HELPER
  // =====================================================

  const login = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("auth_user", JSON.stringify(userData));
      setUser(userData);
    }
    window.dispatchEvent(new Event("auth-changed"));
  };

  // =====================================================
  // LOGOUT HELPER
  // =====================================================

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      window.dispatchEvent(new Event("auth-changed"));
    }
  };

  // =====================================================
  // DERIVED AUTH STATE
  // =====================================================

  const authenticated = Boolean(localStorage.getItem("access_token") && user);

  const isAdmin =
    user?.is_staff === true ||
    user?.is_superuser === true ||
    user?.role === "admin";

  const isClient = authenticated && !isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        authLoading: loading,
        authenticated,
        isAuthenticated: authenticated,
        isAdmin,
        isClient,
        login,
        logout,
        reload: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;