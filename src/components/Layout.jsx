import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        // Only update if the stored user meaningfuly changes or on mount
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location.pathname]); // Re-check on route change (e.g. login/logout)

    const isAdmin = user?.role === 'admin';

    // Dynamic Backgrounds
    const getBackgroundClass = () => {
        if (isLoginPage) return '';
        if (isAdmin) return 'bg-slate-950 text-slate-100 selection:bg-blue-500/30';
        return 'bg-gray-50 text-gray-900 selection:bg-violet-500/30';
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${getBackgroundClass()}`}>
            {!isLoginPage && <Navbar />}

            <div className={isLoginPage ? '' : 'pt-24 px-4 pb-12'}>
                <div className={isLoginPage ? '' : 'container mx-auto max-w-7xl'}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Layout;
