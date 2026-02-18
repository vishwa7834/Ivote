import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Vote as VoteIcon,
    AlertCircle,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    User
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    const isAdmin = user.role === 'admin';

    // Theme Config
    const theme = isAdmin ? {
        navBg: "bg-slate-900/80",
        borderColor: "border-slate-700",
        textColor: "text-slate-100",
        activeBg: "bg-slate-800",
        activeText: "text-blue-400",
        hoverText: "hover:text-blue-300",
        logoColor: "text-blue-500",
        buttonBg: "bg-red-600 hover:bg-red-700"
    } : {
        navBg: "bg-white/70",
        borderColor: "border-white/20",
        textColor: "text-gray-800",
        activeBg: "bg-violet-100",
        activeText: "text-violet-600",
        hoverText: "hover:text-violet-600",
        logoColor: "text-violet-600",
        buttonBg: "bg-gradient-to-r from-violet-600 to-pink-600 hover:shadow-lg"
    };

    const navLinks = [
        { path: isAdmin ? '/admin/dashboard' : '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        !isAdmin && { path: '/manifesto', label: 'Manifestos', icon: FileText },
        !isAdmin && { path: '/vote', label: 'Vote', icon: VoteIcon },
        { path: '/grievance', label: 'Grievances', icon: AlertCircle },
    ].filter(Boolean);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${theme.navBg} ${theme.borderColor} transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center space-x-3 group">
                        <div className={`p-2 rounded-xl transition-colors ${isAdmin ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-violet-50 group-hover:bg-violet-100'}`}>
                            {isAdmin ? <ShieldCheck className={`w-8 h-8 ${theme.logoColor}`} /> : <VoteIcon className={`w-8 h-8 ${theme.logoColor}`} />}
                        </div>
                        <span className={`text-2xl font-black tracking-tight ${isAdmin ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600'}`}>
                            iVote<span className={`text-sm font-medium ml-2 px-2 py-0.5 rounded-full ${isAdmin ? 'bg-blue-900/50 text-blue-200' : 'bg-gray-100 text-gray-500'}`}>{isAdmin ? 'ADMIN' : 'STUDENT'}</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2.5 rounded-xl flex items-center space-x-2 font-medium transition-all duration-200 ${isActive
                                            ? `${theme.activeBg} ${theme.activeText}`
                                            : `${theme.textColor} hover:bg-gray-500/5 ${theme.hoverText}`
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                                    <span>{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 rounded-xl ${isAdmin ? 'bg-blue-500/10' : 'bg-violet-500/10'}`}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        <div className={`h-8 w-[1px] mx-4 ${isAdmin ? 'bg-slate-700' : 'bg-gray-200'}`} />

                        <div className="flex items-center space-x-4 pl-2">
                            <div className="text-right hidden lg:block">
                                <p className={`text-sm font-bold ${isAdmin ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                <p className={`text-xs ${isAdmin ? 'text-slate-400' : 'text-gray-500'}`}>{user.rollNumber || 'Administrator'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`p-2.5 rounded-xl transition-all duration-200 group ${isAdmin
                                        ? 'hover:bg-red-900/30 text-slate-400 hover:text-red-400'
                                        : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                                    }`}
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg ${isAdmin ? 'text-slate-300' : 'text-gray-600'}`}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`md:hidden border-t ${theme.borderColor} ${theme.navBg} backdrop-blur-xl overflow-hidden`}
                    >
                        <div className="px-4 py-6 space-y-4">
                            <div className="flex items-center space-x-3 px-4 pb-4 border-b border-gray-200/10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-blue-900 text-blue-200' : 'bg-violet-100 text-violet-600'}`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`font-bold ${isAdmin ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                                    <p className={`text-xs ${isAdmin ? 'text-slate-400' : 'text-gray-500'}`}>{user.role}</p>
                                </div>
                            </div>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${location.pathname === link.path
                                            ? `${theme.activeBg} ${theme.activeText}`
                                            : `${theme.textColor}`
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span>{link.label}</span>
                                </Link>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
