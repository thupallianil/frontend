import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import useSettings from "../../hooks/useSettings";
import { SETTINGS_SECTIONS } from "../../constants/settingsSections";
import SettingsModal from "../settings/SettingsModal";

const ADMIN_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    path: "/admin/clients",
    icon: Users,
  },
  {
    label: "Quotes",
    path: "/admin/quotes",
    icon: FileText,
  },
  {
    label: "Invoices",
    path: "/admin/invoices",
    icon: Receipt,
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: WalletCards,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Support Tickets",
    path: "/admin/tickets",
    icon: LifeBuoy,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    isSettingsFlyout: true,
  },
];

const CLIENT_ITEMS = [
  {
    label: "Dashboard",
    path: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Quotes",
    path: "/client/quotes",
    icon: FileText,
  },
  {
    label: "My Invoices",
    path: "/client/invoices",
    icon: Receipt,
  },
  {
    label: "Payments",
    path: "/client/payments",
    icon: WalletCards,
  },
  {
    label: "Receipts",
    path: "/client/receipts",
    icon: FileText,
  },
  {
    label: "Support Tickets",
    path: "/client/tickets",
    icon: LifeBuoy,
  },
  {
    label: "Profile",
    path: "/client/profile",
    icon: Users,
  },
];

export default function Sidebar({
  role = "ADMIN",
}) {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    setSidebarCollapsed,
  } = useApp();

  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSettingModal, setActiveSettingModal] = useState(null);

  // Listen for global open-settings-modal events
  useEffect(() => {
    const handleOpenModal = (e) => {
      if (e?.detail) {
        setActiveSettingModal(e.detail);
      }
    };
    window.addEventListener("open-settings-modal", handleOpenModal);
    return () => window.removeEventListener("open-settings-modal", handleOpenModal);
  }, []);

  const items = role === "ADMIN" ? ADMIN_ITEMS : CLIENT_ITEMS;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleOpenCategory = (cat) => {
    setActiveSettingModal(cat);
  };

  const sidebar = (
    <aside className={`flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-all duration-300 overflow-x-hidden ${sidebarCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
      {/* BRAND */}
      <div className="flex h-[72px] items-center border-b border-slate-100 px-5 dark:border-slate-800 shrink-0">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>

          {!sidebarCollapsed && (
            <div>
              {settings?.business?.logoUrl ? (
                <img 
                  src={settings.business.logoUrl} 
                  alt={settings.business.businessName || "Business Logo"} 
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <p className="font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                  {settings?.business?.companyName || "UltraKey"}
                </p>
              )}

              <p className="text-[11px] font-medium text-slate-400">
                {role === "ADMIN" ? "Business Workspace" : "Client Portal"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* USER BADGE */}
      <div className={`border-b border-slate-100 p-4 dark:border-slate-800 shrink-0 ${sidebarCollapsed ? 'px-3' : 'px-4'}`}>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-profile-modal"))}
          title="Click to view & edit Profile"
          className={`w-full flex items-center rounded-2xl bg-slate-50 hover:bg-indigo-50/70 text-left transition duration-150 group dark:bg-slate-900/50 dark:hover:bg-slate-800/80 ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-3'}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm font-bold text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-600 dark:group-hover:text-white shadow-xs">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400 transition">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.email || "Click to edit profile"}
              </p>
            </div>
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-4 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
        {!sidebarCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Main menu
          </p>
        )}

        <div className="space-y-1">
          {items.map((item) => {
            if (item.isSettingsFlyout && role === "ADMIN") {
              return (
                <SettingsSideFlyoutItem
                  key={item.path}
                  item={item}
                  sidebarCollapsed={sidebarCollapsed}
                  onOpenCategory={handleOpenCategory}
                />
              );
            }

            return (
              <SidebarLink
                key={item.path}
                item={item}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
              />
            );
          })}
        </div>
      </nav>

      {/* LOGOUT */}
      <div className={`border-t border-slate-100 dark:border-slate-800 shrink-0 ${sidebarCollapsed ? 'p-3' : 'p-3'}`}>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} rounded-xl py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400`}
          title={sidebarCollapsed ? "Sign out" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!sidebarCollapsed && <span className="whitespace-nowrap">Sign out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {sidebar}
      </div>

      {/* MOBILE SIDEBAR */}
      <div className="lg:hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs"
              />

              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-y-0 left-0 z-50"
              >
                <div className="relative h-full">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="absolute -right-12 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow dark:bg-slate-800 dark:text-slate-200"
                  >
                    <X size={18} />
                  </button>

                  {sidebar}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* GLOBAL SETTINGS MODAL POPUP */}
      <SettingsModal
        open={Boolean(activeSettingModal)}
        category={activeSettingModal || "general"}
        onClose={() => setActiveSettingModal(null)}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Standard Sidebar Link                                                     */
/* -------------------------------------------------------------------------- */
function SidebarLink({ item, sidebarCollapsed, setSidebarCollapsed }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={() => {
        if (sidebarCollapsed && setSidebarCollapsed) {
          setSidebarCollapsed(false);
        }
      }}
      className={({ isActive }) => `
        group flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} rounded-xl py-2.5 text-sm font-medium transition
        ${
          isActive
            ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950 font-semibold"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
        }
      `}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`shrink-0 ${
              isActive
                ? "text-white dark:text-slate-950"
                : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
            }`}
          />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap truncate">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

/* -------------------------------------------------------------------------- */
/*  Settings Item with Floating Side Popover of Icons                         */
/* -------------------------------------------------------------------------- */
function SettingsSideFlyoutItem({
  item,
  sidebarCollapsed,
  onOpenCategory,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const btnRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const closeTimerRef = useRef(null);

  const isSettingsActive = location.pathname.includes("/settings");

  const handleMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const popupHeight = 240;
      const topPos = Math.max(16, Math.min(rect.top - 60, window.innerHeight - popupHeight - 20));
      setPos({
        left: rect.right + 10,
        top: topPos,
      });
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleFlyoutMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const handleFlyoutMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClickItem = (category) => {
    setIsOpen(false);
    navigate("/admin/settings");
    onOpenCategory(category);
  };

  const handleMainClick = (e) => {
    e.preventDefault();
    navigate("/admin/settings");
    onOpenCategory("general");
  };

  const floatingFlyout = isOpen && typeof document !== "undefined" && createPortal(
    <div
      onMouseEnter={handleFlyoutMouseEnter}
      onMouseLeave={handleFlyoutMouseLeave}
      style={{
        position: "fixed",
        left: `${pos.left}px`,
        top: `${pos.top}px`,
      }}
      className="z-[99999] w-[270px] rounded-3xl bg-white/95 p-3.5 shadow-2xl border border-slate-200/80 backdrop-blur-xl dark:bg-slate-900/95 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Floating 4-Column Icons Grid */}
      <div className="grid grid-cols-4 gap-2">
        {SETTINGS_SECTIONS.map((sec) => {
          const SecIcon = sec.icon;
          return (
            <button
              key={sec.category}
              type="button"
              onClick={() => handleClickItem(sec.category)}
              title={sec.title}
              className="group/btn relative flex flex-col items-center justify-center p-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 hover:bg-indigo-50/80 dark:bg-slate-800/40 dark:hover:bg-indigo-500/20 transition-all hover:scale-105 hover:shadow-sm"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${sec.color} shadow-xs group-hover/btn:rotate-6 transition`}>
                <SecIcon size={15} />
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center mt-1">
                {sec.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );

  return (
    <div
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <button
        type="button"
        onClick={handleMainClick}
        className={`
          w-full group flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} rounded-xl py-2.5 text-sm font-medium transition
          ${
            isSettingsActive || isOpen
              ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950 font-semibold"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          }
        `}
        title="Settings (Hover to see quick icons)"
      >
        <Settings
          size={18}
          className={`shrink-0 ${
            isSettingsActive || isOpen
              ? "text-white dark:text-slate-950"
              : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
          }`}
        />
        {!sidebarCollapsed && (
          <span className="whitespace-nowrap truncate">Settings</span>
        )}
      </button>

      {floatingFlyout}
    </div>
  );
}