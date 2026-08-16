import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LifeBuoy,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles,
  Inbox,
  User,
  Building2,
  Trash2,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";
import ticketService from "../../../services/ticketService";

const STATUS_OPTIONS = [
  { id: "open", label: "Open", color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800" },
  { id: "waiting_client", label: "Waiting for Client", color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800" },
  { id: "resolved", label: "Resolved", color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
  { id: "closed", label: "Closed", color: "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800" },
];

const PRIORITY_BADGES = {
  low: { label: "Low", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  medium: { label: "Medium", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
  high: { label: "High", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700 font-bold dark:bg-red-950/40 dark:text-red-400 border border-red-300 dark:border-red-800" },
};

export default function AdminTicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    loadTickets();
  }, [statusFilter, priorityFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      const data = await ticketService.getAll(params);
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load tickets error:", err);
      toast.error("Unable to load support tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e, ticketId, newStatus) => {
    e.stopPropagation();
    try {
      await ticketService.update(ticketId, { status: newStatus });
      toast.success("Ticket status updated");
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (e, ticketId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await ticketService.delete(ticketId);
      toast.success("Ticket deleted.");
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete ticket.");
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return tickets;
    const q = search.toLowerCase();
    return tickets.filter(
      (t) =>
        t.ticket_number?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.client_name?.toLowerCase().includes(q) ||
        t.client_email?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }, [tickets, search]);

  const metrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress" || t.status === "waiting_client").length;
    const urgent = tickets.filter((t) => t.priority === "urgent" && t.status !== "resolved" && t.status !== "closed").length;
    const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
    return { total, open, inProgress, urgent, resolved };
  }, [tickets]);

  return (
    <div className="min-h-full bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner Header */}
      <div className="flex items-center justify-end gap-4">

        <button
          type="button"
          onClick={loadTickets}
          disabled={loading}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 transition"
          title="Refresh tickets"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">All Tickets</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{metrics.total}</p>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900/40">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Open Tickets</p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{metrics.open}</p>
        </div>
        <div className="p-4 rounded-2xl border border-blue-200/80 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900/40">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">In Progress</p>
          <p className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">{metrics.inProgress}</p>
        </div>
        <div className="p-4 rounded-2xl border border-red-200/80 bg-red-50/40 dark:bg-red-950/20 dark:border-red-900/40">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Urgent Attention</p>
            <Flame size={14} className="text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">{metrics.urgent}</p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolved</p>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">{metrics.resolved}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket #, client, subject or inquiry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="flex items-center gap-1">
            {[
              { id: "all", label: "All" },
              { id: "open", label: "Open" },
              { id: "in_progress", label: "In Progress" },
              { id: "resolved", label: "Resolved" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket List Table */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800">
          <div className="text-center">
            <Loader2 size={28} className="mx-auto animate-spin text-indigo-600" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading tickets...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:bg-slate-900 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Inbox size={26} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
            No support tickets match your criteria
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            {search ? `No tickets found matching "${search}".` : "No support tickets have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="py-3.5 pl-6 pr-3">Ticket</th>
                  <th className="px-3 py-3.5">Client</th>
                  <th className="px-3 py-3.5">Subject & Category</th>
                  <th className="px-3 py-3.5">Priority</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Last Activity</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                {filtered.map((ticket) => {
                  const priorityBadge = PRIORITY_BADGES[ticket.priority] || PRIORITY_BADGES.medium;
                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      {/* Ticket # */}
                      <td className="py-4 pl-6 pr-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {ticket.ticket_number}
                      </td>

                      {/* Client */}
                      <td className="px-3 py-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{ticket.client_name}</p>
                        <p className="text-[11px] text-slate-400">{ticket.client_email}</p>
                      </td>

                      {/* Subject & Category */}
                      <td className="px-3 py-4 max-w-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{ticket.subject}</p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-slate-400 uppercase">
                          {ticket.category?.replace("_", " ")}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${priorityBadge.color}`}>
                          {priorityBadge.label}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(e, ticket.id, e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-indigo-500"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="waiting_client">Waiting for Client</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Last Activity */}
                      <td className="px-3 py-4 text-slate-400">
                        <div className="flex items-center gap-1">
                          <MessageSquare size={12} className="text-slate-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.messages_count || 0}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(ticket.last_reply_at || ticket.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                            className="rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:hover:bg-indigo-900 dark:text-indigo-300 px-2.5 py-1 text-xs font-bold transition"
                          >
                            Open Thread
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, ticket.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md transition"
                            title="Delete ticket"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
