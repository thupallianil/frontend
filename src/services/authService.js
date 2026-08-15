import authApi, {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser as apiGetCurrentUser,
  refreshToken as apiRefreshToken,
  logout as apiLogout,
  changePassword as apiChangePassword,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
} from "../api/auth.js";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user") || localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("access_token") && getStoredUser());
};

const getRole = () => {
  const user = getStoredUser();
  if (user?.is_staff || user?.is_superuser || user?.role === "admin") {
    return "admin";
  }
  return "client";
};

export const authService = {
  login: apiLogin,
  register: apiRegister,
  getCurrentUser: apiGetCurrentUser,
  refreshToken: apiRefreshToken,
  logout: apiLogout,
  changePassword: apiChangePassword,
  forgotPassword: apiForgotPassword,
  resetPassword: apiResetPassword,
  getStoredUser,
  isAuthenticated,
  getRole,
};

export default authService;