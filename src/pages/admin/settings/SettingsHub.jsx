import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SettingsModal from "../../../components/settings/SettingsModal";

export default function SettingsHub({ initialCategory = null, onModalClose }) {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeCategory, setActiveCategory] = useState(
    initialCategory || tabParam || "general"
  );
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    if (initialCategory || tabParam) {
      setActiveCategory(initialCategory || tabParam);
      setModalOpen(true);
    }
  }, [initialCategory, tabParam]);

  const handleClose = () => {
    setModalOpen(false);
    onModalClose?.();
  };

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
      {/* Clean minimal placeholder when modal is closed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex max-w-md flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm mb-4">
          <Settings size={32} />
        </div>

        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          System Settings
        </h1>

        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Configure business rules, taxes, payment gateways, and system preferences in the popup modal.
        </p>

        <button
          type="button"
          onClick={() => {
            setActiveCategory("general");
            setModalOpen(true);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-700"
        >
          <SlidersHorizontal size={15} />
          <span>Open Settings Modal</span>
        </button>
      </motion.div>

      {/* SETTINGS POPUP MODAL */}
      <SettingsModal
        open={modalOpen}
        category={activeCategory || "general"}
        onClose={handleClose}
      />
    </div>
  );
}
