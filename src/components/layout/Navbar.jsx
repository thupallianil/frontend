import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Sun,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
  const [profileDefaultTab, setProfileDefaultTab] = useState("business");

  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const handleOpenProfile = () => {
      setProfileDefaultTab("business");
      setProfileModalOpen(true);
    };
    window.addEventListener("open-profile-modal", handleOpenProfile);
    return () => window.removeEventListener("open-profile-modal", handleOpenProfile);
  }, []);

  // Handle outside click & Escape key to close profile dropdown cleanly
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setProfileOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setProfileOpen(false);
    }, 250);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setProfileOpen((prev) => !prev);
  };

  const location = useLocation();
  
  const getPageTitle = (path) => {
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/clients")) return "Clients";
    if (path.includes("/vendors")) return "Vendors & Suppliers";
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

          {/* INTERACTIVE ACCOUNT PROFILE FLYOUT */}
          <div
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <button
              type="button"
              onClick={handleToggleClick}
              className={`flex items-center gap-2 rounded-2xl p-1.5 transition-all cursor-pointer select-none ${
                profileOpen
                  ? "bg-slate-100 dark:bg-slate-800 ring-2 ring-blue-500/20"
                  : "hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-xs font-bold text-white shadow-sm dark:from-white dark:via-slate-100 dark:to-slate-200 dark:text-slate-950">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "U"}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[130px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user?.name || "User"}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {role}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-slate-400 sm:block transition-transform duration-200 ${
                  profileOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 backdrop-blur-xl"
                >
                  {/* User Profile Header Card */}
                  <div className="rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white shadow-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                          {user?.name || "User Account"}
                        </p>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-slate-200/50 pt-2 dark:border-slate-700/50 text-[10px]">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider">Access Role</span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {role === "ADMIN" ? "Administrator" : "Client Portal"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setProfileDefaultTab("business");
                        setProfileModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      <User size={15} className="text-blue-600 dark:text-blue-400" />
                      <span>Business & Profile Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setProfileDefaultTab("account");
                        setProfileModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      <ShieldCheck size={15} className="text-indigo-600 dark:text-indigo-400" />
                      <span>Security & Password</span>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                        navigate("/login", { replace: true });
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        defaultTab={profileDefaultTab}
      />
    </header>
  );
}