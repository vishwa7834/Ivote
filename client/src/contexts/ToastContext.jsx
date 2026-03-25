import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-20 sm:top-5 right-0 left-0 sm:left-auto sm:right-5 z-[9999] flex flex-col items-center sm:items-end gap-3 pointer-events-none px-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} toast={toast} onClose={() => setToasts(t => t.filter(x => x.id !== toast.id))} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-emerald-50/90 border-emerald-100',
        error: 'bg-red-50/90 border-red-100',
        info: 'bg-blue-50/90 border-blue-100'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border ${bgColors[toast.type]} max-w-sm w-full sm:w-auto`}
        >
            <div className="shrink-0 bg-white rounded-full p-1 shadow-sm">
                {icons[toast.type]}
            </div>
            <p className="text-slate-700 text-sm font-semibold flex-1">{toast.message}</p>
            <button
                onClick={onClose}
                className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-white/50"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};
