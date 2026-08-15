import {
  Navigate,
  Outlet,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

export default function ClientRoute() {
  const {
    loading,
    authenticated,
    isClient,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isClient) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}