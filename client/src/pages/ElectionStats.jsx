import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart3, Users, Activity, Target } from 'lucide-react';
import { API_URL } from '../config';
import PageTransition from '../components/PageTransition';

const ElectionStats = () => {
    const [stats, setStats] = useState({ totalVoters: 0, votedVoters: 0 });
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, candidatesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/analytics/public-stats`),
                    axios.get(`${API_URL}/api/candidates`)
                ]);
                setStats(statsRes.data);
                setCandidates(candidatesRes.data.sort((a, b) => b.votes - a.votes));
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const turnout = stats.totalVoters > 0
        ? Math.round((stats.votedVoters / stats.totalVoters) * 100)
        : 0;

    if (loading) return (
        <PageTransition className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </PageTransition>
    );

    return (
        <PageTransition className="max-w-7xl mx-auto px-4 py-12 space-y-12 pb-32">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-bold"
                >
                    <Activity className="w-4 h-4" />
                    <span>Live Updates</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Election Overview</h1>
                <p className="text-slate-500 max-w-xl mx-auto text-lg">Real-time statistics and voter turnout for the current campus election.</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Registered"
                    value={stats.totalVoters}
                    icon={<Users className="w-8 h-8 text-blue-500" />}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    title="Votes Cast"
                    value={stats.votedVoters}
                    icon={<BarChart3 className="w-8 h-8 text-violet-500" />}
                    color="violet"
                    delay={0.2}
                />
                <StatCard
                    title="Voter Turnout"
                    value={`${turnout}%`}
                    icon={<Target className="w-8 h-8 text-pink-500" />}
                    color="pink"
                    delay={0.3}
                />
            </div>

            {/* Turnout Progress Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl shadow-slate-200/50"
            >
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">Turnout Progress</h3>
                        <p className="text-slate-500 mt-1">Percentage of registered students who have voted</p>
                    </div>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
                        {turnout}%
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${turnout}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 h-full rounded-full relative"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:2rem_2rem] animate-[progress_1s_linear_infinite]" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Candidate Standings (Preview) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl flex flex-col items-center justify-center text-center py-16"
            >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Live Candidate Standings</h3>
                <p className="text-slate-500 max-w-md">Detailed breakdown of candidate rankings will be revealed once the voting period concludes to ensure fair election practices.</p>
            </motion.div>
        </PageTransition>
    );
};

const StatCard = ({ title, value, icon, color, delay }) => {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-100',
        violet: 'bg-violet-50 border-violet-100',
        pink: 'bg-pink-50 border-pink-100'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            className={`rounded-[2rem] p-8 flex flex-col justify-between h-48 border shadow-lg shadow-slate-200/40 relative overflow-hidden group ${colorClasses[color]}`}
        >
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                {React.cloneElement(icon, { className: 'w-32 h-32' })}
            </div>
            <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
            </div>
            <div className="relative z-10 mt-auto">
                <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">{title}</h3>
                <p className="text-4xl font-black text-slate-800">{value}</p>
            </div>
        </motion.div>
    );
};

export default ElectionStats;
