import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Loader, User, ShieldCheck, CreditCard, Mail } from 'lucide-react';
import { API_URL } from '../config';

const Login = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Toggle for Admin Mode
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                rollNumber,
                password
            });

            const { token, user } = res.data;

            // Check Role Access
            if (isAdmin && user.role !== 'admin') {
                alert('Access Denied: You are not authorized to access the Admin Dashboard.');
                setIsLoading(false);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            alert('Login failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic styles based on mode
    const textGradient = isAdmin
        ? "bg-gradient-to-r from-blue-400 to-emerald-400"
        : "bg-gradient-to-r from-violet-600 to-pink-500";

    const buttonGradient = isAdmin
        ? "bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-600 hover:to-gray-700"
        : "bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400";

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isAdmin ? 'bg-slate-950' : 'bg-gray-50'}`}>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 ${isAdmin ? 'bg-slate-900 text-white' : 'bg-white'}`}
            >
                {/* Image Section */}
                <div className="hidden md:block w-1/2 relative overflow-hidden">
                    <img
                        src="/assets/voting_login_hero.png"
                        alt="Voting Hero"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isAdmin ? 'from-black/90 via-black/50' : 'from-indigo-900/80 via-purple-900/40'} to-transparent flex items-end p-12`}>
                        <div className="relative z-10">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-bold mb-4 text-white"
                            >
                                Secure Democracy
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-200 text-lg leading-relaxed"
                            >
                                Experience the future of voting with our transparent, digital voting platform.
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className={`w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative ${isAdmin ? 'bg-slate-900' : 'bg-white'}`}>
                    {/* Role Toggles */}
                    <div className="absolute top-8 right-8">
                        <div className={`flex p-1.5 rounded-2xl ${isAdmin ? 'bg-slate-800' : 'bg-gray-100'}`}>
                            <button
                                onClick={() => setIsAdmin(false)}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${!isAdmin
                                    ? 'bg-white shadow-md text-violet-600'
                                    : 'text-gray-500 hover:text-gray-400'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                <span className={!isAdmin ? 'font-bold' : ''}>Voter</span>
                            </button>
                            <button
                                onClick={() => setIsAdmin(true)}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isAdmin
                                    ? 'bg-slate-700 shadow-md text-white'
                                    : 'text-gray-500 hover:text-gray-600'
                                    }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                <span className={isAdmin ? 'font-bold' : ''}>Official</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-10 mt-12 md:mt-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={isAdmin ? 'admin-header' : 'user-header'}
                        >
                            <h2 className={`text-4xl font-black mb-3 text-transparent bg-clip-text ${textGradient}`}>
                                {isAdmin ? 'Admin Portal' : 'Welcome Back'}
                            </h2>
                            <p className={`${isAdmin ? 'text-slate-400' : 'text-gray-500'} text-lg`}>
                                {isAdmin ? 'Restricted access for election officials' : 'Enter your credentials to sign in'}
                            </p>
                        </motion.div>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleLogin}
                        className="space-y-6"
                    >
                        <div className="space-y-5">
                            <div className="relative group">
                                <label className={`block text-sm font-medium mb-1 ${isAdmin ? 'text-slate-400' : 'text-gray-700'}`}>
                                    {isAdmin ? 'Email ID' : 'Registration Number'}
                                </label>
                                <div className="relative">
                                    {isAdmin ? (
                                        <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isAdmin ? 'text-slate-500' : 'text-gray-400'} group-focus-within:text-violet-500`} />
                                    ) : (
                                        <CreditCard className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isAdmin ? 'text-slate-500' : 'text-gray-400'} group-focus-within:text-violet-500`} />
                                    )}
                                    <input
                                        type="text"
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                        placeholder={isAdmin ? "Enter Admin Email" : "Enter Registration/Roll No."}
                                        className={`w-full pl-12 pr-4 py-4 border rounded-xl outline-none transition-all ${isAdmin
                                            ? 'bg-slate-800 border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500'
                                            : 'bg-white border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                                            }`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className={`block text-sm font-medium mb-1 ${isAdmin ? 'text-slate-400' : 'text-gray-700'}`}>
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isAdmin ? 'text-slate-500' : 'text-gray-400'} group-focus-within:text-violet-500`} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                        className={`w-full pl-12 pr-4 py-4 border rounded-xl outline-none transition-all ${isAdmin
                                            ? 'bg-slate-800 border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500'
                                            : 'bg-white border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                                            }`}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {!isAdmin && (
                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium hover:underline text-violet-600"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -1 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${buttonGradient} text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <Loader className="animate-spin h-6 w-6" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>

                        {!isAdmin && (
                            <div className="text-center mt-4">
                                <p className="text-gray-500">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-bold hover:underline text-violet-600">
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        )}
                    </motion.form>
                </div>
            </motion.div >
        </div >
    );
};

export default Login;
