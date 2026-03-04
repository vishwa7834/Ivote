import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileText, Vote as VoteIcon, AlertCircle } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    if (!user) return null;

    const isAdmin = user.role === 'admin';

    const navLinks = [
        { path: isAdmin ? '/admin/dashboard' : '/dashboard', label: 'Home', icon: LayoutDashboard },
        !isAdmin && { path: '/manifesto', label: 'Manifestos', icon: FileText },
        !isAdmin && { path: '/vote', label: 'Vote', icon: VoteIcon },
        { path: '/grievance', label: 'Grievance', icon: AlertCircle },
    ].filter(Boolean);

    const triggerHaptic = async () => {
        try {
            await Haptics.impact({ style: ImpactStyle.Light });
        } catch (e) {
            // Ignore error gracefully if non-native platform (web)
            console.log('Haptics not available');
        }
    };

    return (
        <div className="md:hidden fixed bottom-5 left-4 right-4 z-50">
            {/* Background container with glassmorphism */}
            <div className={`absolute inset-0 rounded-[2rem] backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border ${isAdmin ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-white/50'}`}></div>

            <nav className="relative flex justify-around items-center h-20 px-2 rounded-[2rem]">
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={triggerHaptic}
                            className="relative flex flex-col items-center justify-center w-full h-full"
                        >
                            <div className={`relative flex items-center justify-center w-12 h-12 transition-all duration-300 ${isActive ? 'translate-y-[-12px]' : ''}`}>
                                {/* Active background circle float */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomNavFloat"
                                            className={`absolute inset-0 rounded-full shadow-lg ${isAdmin ? 'bg-blue-600' : 'bg-violet-600'}`}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                        />
                                    )}
                                </AnimatePresence>

                                <Icon className={`w-6 h-6 relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : isAdmin ? 'text-slate-400' : 'text-slate-500'}`} />
                            </div>

                            {/* Active Label */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={`absolute bottom-2 text-[10px] font-bold ${isAdmin ? 'text-blue-400' : 'text-violet-600'}`}
                                    >
                                        {link.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNav;
