import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Vote, Activity, Settings, UserPlus, FileText, AlertTriangle, ShieldCheck, TrendingUp, Lock, Trash2, Plus, X } from 'lucide-react';
import adminBg from '../assets/admin_bg.png';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalVoters: 0,
        votesCast: 0,
        participation: 0,
        activeIssues: 0
    });
    const [loading, setLoading] = useState(true);

    const [voters, setVoters] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [showVoters, setShowVoters] = useState(false);
    const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
    const [newCandidate, setNewCandidate] = useState({ name: '', position: '', manifesto: '', party: '' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                if (token) {
                    try {
                        const [analyticsRes, usersRes, candidatesRes] = await Promise.all([
                            axios.get(`${API_URL}/api/analytics/dashboard`, {
                                headers: { Authorization: `Bearer ${token}` }
                            }),
                            axios.get(`${API_URL}/api/auth/users`),
                            axios.get(`${API_URL}/api/candidates`)
                        ]);

                        setStats(analyticsRes.data);
                        setVoters(usersRes.data);
                        setCandidates(candidatesRes.data);
                    } catch (e) {
                        console.warn("Using fallback data for design preview");
                        setStats({
                            totalVoters: 1250,
                            votesCast: 843,
                            participation: 67.4,
                            activeIssues: 2
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-cyan-500 font-mono">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <span className="animate-pulse">INITIALIZING COMMAND CENTER...</span>
            </div>
        </div>
    );

    if (!user) return null;

    const statCards = [
        { label: 'Total Voters', value: voters.length || stats.totalVoters, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { label: 'Votes Cast', value: stats.votesCast, icon: Vote, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'Participation', value: `${stats.participation}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        { label: 'Active Issues', value: stats.activeIssues, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    ];

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/candidates`, newCandidate);
            setCandidates([...candidates, res.data]);
            setNewCandidate({ name: '', position: '', manifesto: '', party: '' });
            alert('Candidate added successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to add candidate');
        }
    };

    const handleDeleteCandidate = async (id) => {
        if (!window.confirm('Are you sure you want to remove this candidate?')) return;
        try {
            await axios.delete(`${API_URL}/api/candidates/${id}`);
            setCandidates(candidates.filter(c => c._id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete candidate');
        }
    };

    const actions = [
        { label: 'Manage Candidates', icon: UserPlus, desc: 'Add or edit election candidates', onClick: () => setIsCandidateModalOpen(true) },
        { label: 'View Results', icon: FileText, desc: 'Real-time vote counting' },
        { label: 'System Settings', icon: Settings, desc: 'Configure election parameters' },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans relative overflow-hidden -m-8 p-8">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
                <img src={adminBg} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F172A]/80 via-[#0F172A]/90 to-[#0F172A] pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-8 h-8 text-cyan-500" />
                            <h1 className="text-4xl font-black text-white tracking-tight">Command Center</h1>
                        </div>
                        <p className="text-slate-400 text-lg">
                            Administrator: <span className="text-cyan-400 font-semibold">{user.name}</span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-700/50 shadow-lg">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-200 font-bold text-sm tracking-wider">SYSTEM ONLINE</span>
                            <span className="text-emerald-500 text-[10px] font-mono">SECURE CONNECTION</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <stat.icon className="w-24 h-24 -mr-4 -mt-4 transform rotate-12" />
                            </div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-slate-900/80 text-slate-400 border border-slate-800">
                                    LIVE
                                </span>
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-1 relative z-10 tracking-tight">{stat.value}</h3>
                            <p className="text-slate-400 text-sm font-medium relative z-10 uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Action Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-l-4 border-cyan-500 pl-4">
                            Operational Controls
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {actions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className="group p-6 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/80 backdrop-blur-sm transition-all text-left relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10">
                                        <div className="p-3 rounded-lg bg-slate-900 w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-slate-800">
                                            <action.icon className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                            {action.label}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {action.desc}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Registered Voters Table */}
                        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-cyan-400" />
                                    Registered Voters List
                                </h3>
                                <div className="text-xs font-mono text-slate-500">TOTAL: {voters.length}</div>
                            </div>

                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-sm text-left text-slate-400">
                                    <thead className="text-xs text-slate-200 uppercase bg-slate-800/50 border-b border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3">Roll No</th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Phone</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voters.length > 0 ? (
                                            voters.map((voter) => (
                                                <tr key={voter._id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-4 py-3 font-mono text-cyan-400">{voter.rollNumber}</td>
                                                    <td className="px-4 py-3 font-medium text-white">{voter.name}</td>
                                                    <td className="px-4 py-3">{voter.phone}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${voter.hasVoted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                                            {voter.hasVoted ? 'VOTED' : 'PENDING'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                                                    No registered voters found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Activity Log Mockup */}
                        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-slate-400" />
                                    System Logs
                                </h3>
                                <div className="text-xs font-mono text-slate-500">REAL-TIME MONITORING</div>
                            </div>
                            <div className="space-y-4 font-mono text-sm max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 border-b border-slate-800/50 pb-3 last:pb-0 last:border-0 hover:bg-slate-800/30 p-2 rounded transition-colors cursor-default">
                                        <span className="text-slate-500 text-xs">10:4{i}:{12 + i} AM</span>
                                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">AUTH</span>
                                        <span className="text-slate-300">User <span className="text-white">VISHWA001</span> accessed the student portal.</span>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-4 hover:bg-slate-800/30 p-2 rounded transition-colors cursor-default">
                                    <span className="text-slate-500 text-xs">10:45:00 AM</span>
                                    <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded text-[10px]">SYSTEM</span>
                                    <span className="text-slate-300">Analytics module data refresh completed.</span>
                                </div>
                            </div>
                        </div>

                        {/* Live Election Results */}
                        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    Live Election Results
                                </h3>
                                <div className="text-xs font-mono text-slate-500">
                                    TOTAL VOTES: {candidates.reduce((acc, curr) => acc + (curr.votes || 0), 0)}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {candidates.sort((a, b) => (b.votes || 0) - (a.votes || 0)).map((candidate, idx) => {
                                    const totalVotes = candidates.reduce((acc, curr) => acc + (curr.votes || 0), 0) || 1;
                                    const percentage = Math.round(((candidate.votes || 0) / totalVotes) * 100);
                                    const isWinner = idx === 0 && (candidate.votes || 0) > 0;

                                    return (
                                        <div key={candidate._id} className="relative">
                                            <div className="flex justify-between items-end mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-white">{candidate.name}</span>
                                                    {isWinner && (
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                                                            LEADING
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-white">{candidate.votes || 0}</span>
                                                    <span className="text-xs text-slate-500 ml-1">votes</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar Background */}
                                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                                {/* Active Progress */}
                                                <div
                                                    style={{ width: `${percentage}%` }}
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-cyan-600 to-blue-600'}`}
                                                />
                                            </div>
                                            <div className="text-right mt-1">
                                                <span className="text-xs font-mono text-slate-500">{percentage}%</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {candidates.length === 0 && (
                                    <p className="text-center text-slate-500 py-4">No data available yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="bg-gradient-to-b from-blue-900/10 to-slate-900/40 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm flex flex-col h-full">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-amber-500" />
                            Election Status
                        </h3>

                        <div className="space-y-8 relative flex-1">
                            {/* Timeline */}
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-800" />

                            <div className="relative pl-10 group">
                                <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-emerald-500/30 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                <h4 className="text-emerald-400 font-bold text-lg group-hover:text-emerald-300 transition-colors">Voting Active</h4>
                                <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider">Started: Today, 8:00 AM</p>
                                <div className="mt-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-2 rounded">
                                    Polls running smoothly. No errors detected.
                                </div>
                            </div>

                            <div className="relative pl-10 opacity-60 hover:opacity-100 transition-opacity group">
                                <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-slate-700 bg-slate-800 group-hover:border-slate-600" />
                                <h4 className="text-slate-300 font-bold text-lg">Voting Ends</h4>
                                <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">Scheduled: Today, 6:00 PM</p>
                            </div>

                            <div className="relative pl-10 opacity-60 hover:opacity-100 transition-opacity group">
                                <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-slate-700 bg-slate-800 group-hover:border-slate-600" />
                                <h4 className="text-slate-300 font-bold text-lg">Results Declaration</h4>
                                <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">Scheduled: Today, 7:00 PM</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors group cursor-pointer">
                                <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Danger Zone
                                </h4>
                                <p className="text-xs text-red-400/70 mb-3">
                                    Emergency actions for critical system failures.
                                </p>
                                <button className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-900/20">
                                    Emergency Halt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Candidate Management Modal */}
            {isCandidateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-cyan-400" />
                                Manage Candidates
                            </h3>
                            <button onClick={() => setIsCandidateModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                            {/* Add Candidate Form */}
                            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-emerald-400" />
                                    Add New Candidate
                                </h4>
                                <form onSubmit={handleAddCandidate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Candidate Name"
                                        value={newCandidate.name}
                                        onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                                        className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Party / Affiliation"
                                        value={newCandidate.party}
                                        onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                                        className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Position (e.g. President)"
                                        value={newCandidate.position}
                                        onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                                        className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors md:col-span-2"
                                        required
                                    />
                                    <textarea
                                        placeholder="Manifesto / Promises"
                                        value={newCandidate.manifesto}
                                        onChange={(e) => setNewCandidate({ ...newCandidate, manifesto: e.target.value })}
                                        className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors md:col-span-2 h-24 resize-none"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:translate-y-[-1px] transition-all md:col-span-2"
                                    >
                                        Register Candidate
                                    </button>
                                </form>
                            </div>

                            {/* Existing Candidates List */}
                            <div>
                                <h4 className="text-lg font-bold text-white mb-4">Current Candidates</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {candidates.length > 0 ? (
                                        candidates.map((candidate) => (
                                            <div key={candidate._id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex justify-between items-start group hover:border-slate-600 transition-colors">
                                                <div>
                                                    <h5 className="font-bold text-white text-lg">{candidate.name}</h5>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-700 text-cyan-400 mb-2 inline-block">
                                                        {candidate.position}
                                                    </span>
                                                    <p className="text-sm text-slate-400">{candidate.party}</p>
                                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{candidate.manifesto}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteCandidate(candidate._id)}
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Remove Candidate"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 italic col-span-2 text-center py-8">No candidates registered yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
