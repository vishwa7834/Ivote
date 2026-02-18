import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vote, FileText, CheckCircle2, Clock, ChevronRight, Star, ExternalLink } from 'lucide-react';
import studentHero from '../assets/modern_voting_hero_v2.png';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Your Dashboard...</div>;

    const hasVoted = user.hasVoted;

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-blue-500/10" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-12">
                    <div className="flex-1 space-y-8 text-center md:text-left max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-violet-200 text-sm font-medium mb-6 backdrop-blur-sm">
                                Campus Election 2026
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">{user.name.split(' ')[0]}</span>.
                            </h1>
                            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-xl font-light">
                                Welcome to the future of campus democracy. Securely cast your vote, review manifestos, and make your voice heard in the student council elections.
                            </p>
                        </motion.div>

                        {!hasVoted && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link
                                    to="/vote"
                                    className="inline-flex items-center space-x-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-violet-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] group"
                                >
                                    <span>Vote Now</span>
                                    <Vote className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", duration: 1.5 }}
                        className="w-full max-w-sm md:max-w-lg relative"
                    >
                        <div className="absolute inset-0 bg-violet-500/30 blur-[100px] rounded-full" />
                        <img
                            src={studentHero}
                            alt="Voting 3D Illustration"
                            className="relative z-10 w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700 ease-in-out"
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="col-span-1 lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-violet-100 transition-all"
                >
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${hasVoted ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {hasVoted ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Election Status</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            {hasVoted ? "Vote Confirmed" : "Polls are Active"}
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            {hasVoted
                                ? "Thank you for participating! Your encrypted ballot has been securely received. Stay tuned for the results."
                                : "The voting lines are currently open. Ensure you have reviewed all candidates before casting your final decision."}
                        </p>
                    </div>
                </motion.div>

                {/* Manifesto / Resources Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer"
                >
                    <Link to="/manifesto" className="block h-full flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">View Manifestos</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Read detailed plans and promises from all candidates.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center text-slate-900 font-bold group-hover:translate-x-2 transition-transform">
                            <span>Read Documents</span>
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
