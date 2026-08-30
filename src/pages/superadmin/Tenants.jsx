import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Filter,
  Globe,
  LogIn,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function SuperAdminTenants() {
  const navigate = useNavigate();
  const { impersonateUser } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [impersonatingId, setImpersonatingId] = useState(null);

  const [form, setForm] = useState({
    business_name: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
    currency: "USD",
    phone: "",
  });

  const handleLoginAsAdmin = async (b) => {
    try {
      setImpersonatingId(b.id);
      const targetEmail = b.owner?.email || b.email;
      await impersonateUser({
        business_id: b.id,
        email: targetEmail,
      });
      toast.success(`Assumed Admin control of ${b.business_name}`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to login as admin.");
    } finally {
      setImpersonatingId(null);
    }
  };

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/superadmin/tenants/?search=${encodeURIComponent(search)}`);
      if (res.data?.success) {
        setTenants(res.data.data);
      }
    } catch (err) {
      console.warn("Error fetching tenants:", err?.message);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [search]);

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    if (!form.business_name || !form.admin_email) {
      toast.error("Business name and admin email are required.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/superadmin/tenants/", form);
      if (res.data?.success) {
        toast.success(res.data.message || "Business provisioned with Free Trial!");
        setShowAddModal(false);
        setForm({
          business_name: "",
          admin_name: "",
          admin_email: "",
          admin_password: "",
          currency: "USD",
          phone: "",
        });
        fetchTenants();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to provision business.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="text-indigo-600 dark:text-indigo-400" size={24} />
            Ecosystem Tenants & Organizations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage all registered business workspaces, billing profiles, and instance owners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTenants}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500 transition cursor-pointer"
          >
            <Plus size={15} />
            + Add New Business
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search by business name, email, or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-xs"
        />
      </div>

      {/* TENANTS GRID */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tenants.map((b) => (
            <div
              key={b.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs hover:shadow-md hover:border-indigo-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                    {b.business_name.charAt(0)}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active Tenant
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">{b.business_name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{b.legal_name || "Enterprise Workspace"}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{b.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe size={13} className="text-slate-400 shrink-0" />
                    <span>{b.city ? `${b.city}, ${b.country}` : "Global Cloud Node"}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{b.clients_count || 0} Clients • {b.vendors_count || 0} Vendors</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Owner: {b.owner?.name || b.owner?.username || "Admin"}</span>
              </div>

              {/* Login as Admin / Impersonation Button */}
              <button
                type="button"
                onClick={() => handleLoginAsAdmin(b)}
                disabled={impersonatingId === b.id}
                className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 py-2 px-3 text-xs font-bold transition border border-purple-200/70 dark:border-purple-500/20 shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-60"
                title={`Assume Admin control of ${b.business_name}`}
              >
                {impersonatingId === b.id ? (
                  <RefreshCw size={13} className="animate-spin text-purple-600" />
                ) : (
                  <LogIn size={13} className="text-purple-600 dark:text-purple-400" />
                )}
                <span>{impersonatingId === b.id ? "Switching Session..." : "Login as Admin"}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PROVISION NEW BUSINESS MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) {
              setShowAddModal(false);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Provision New Business Tenant</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Creates workspace & admin credentials with 5-project Free Trial.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Admin Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.admin_name}
                  onChange={(e) => setForm({ ...form, admin_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Admin Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@acme.com"
                  value={form.admin_email}
                  onChange={(e) => setForm({ ...form, admin_email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Admin Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank for auto-generated (Admin123!)"
                  value={form.admin_password}
                  onChange={(e) => setForm({ ...form, admin_password: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] text-amber-600 dark:text-amber-400">
                ⚡ <strong>Automatic Free Trial Provisioning:</strong> This business will receive a <strong>FREE_TRIAL (5 Projects Limit)</strong> subscription and credentials will be sent to the admin email.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Provisioning..." : "Provision Business"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
