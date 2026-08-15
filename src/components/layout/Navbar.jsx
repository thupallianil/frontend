import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Sun,
  Search,
  User,
} from "lucide-react";

import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

import GlobalSearch from "./GlobalSearch";
import ProfileModal from "../profile/ProfileModal";
import NotificationDropdown from "../notifications/NotificationDropdown";

export default function Navbar({
  role = "ADMIN",
}) {
  const {
    setSidebarOpen,
    globalSearch,
    setGlobalSearch,
    darkMode,
    toggleDarkMode,
    toggleSidebarCollapsed,
  } = useApp();

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenProfile = () => setProfileModalOpen(true);
    window.addEventListener("open-profile-modal", handleOpenProfile);
    return () => window.removeEventListener("open-profile-modal", handleOpenProfile);
  }, []);

  const location = useLocation();
  
  const getPageTitle = (path) => {
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/clients")) return "Clients";
    if (path.includes("/quotes")) return "Quotes";
    if (path.includes("/invoices")) return "Invoices";
    if (path.includes("/payments")) return "Payments";
    if (path.includes("/reports")) return "Reports";
    if (path.includes("/receipts")) return "Receipts";
    if (path.includes("/profile")) return "Profile";
    if (path.includes("/settings")) return "Settings";
    
    return role === "ADMIN" ? "Manage your business" : "Manage your documents";
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Menu size={18} />
          </button>

          <div className="hidden min-w-0 md:block">
            <p className="text-xs font-medium text-slate-400">
              {role === "ADMIN"
                ? "Admin workspace"
                : "Client portal"}
            </p>

            <h1 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        </div>

        {/* SEARCH */}

        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={globalSearch}
              onChange={(event) =>
                setGlobalSearch(
                  event.target.value
                )
              }
              placeholder="Search invoices, clients, quotes..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-slate-300
                focus:bg-white
                focus:ring-4
                focus:ring-slate-100
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-200
                dark:placeholder:text-slate-500
                dark:focus:border-slate-700
                dark:focus:bg-slate-900
                dark:focus:ring-slate-800/50
              "
            />
            
            <GlobalSearch 
              query={globalSearch} 
              onClose={() => setGlobalSearch("")} 
              onClear={() => setGlobalSearch("")} 
            />
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2">
          {/* DARK MODE TOGGLE */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <NotificationDropdown />

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (value) => !value
                )
              }
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "U"}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[130px] truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user?.name ||
                    "User"}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  {role}
                </p>
              </div>

              <ChevronDown
                size={15}
                className="hidden text-slate-400 sm:block"
              />
            </button>

            {profileOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user?.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 font-medium"
                  >
                    <User size={16} />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();

                      navigate(
                        "/login",
                        {
                          replace: true,
                        }
                      );
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </header>
  );
}