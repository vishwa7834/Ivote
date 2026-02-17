import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote as VoteIcon, User, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const Vote = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.hasVoted) {
                    setHasVoted(true);
                }
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/candidates`);
                setCandidates(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, []);

    const handleVote = async () => {
        if (!selectedCandidate) return;

        const confirmVote = window.confirm(`Confirm your vote for ${selectedCandidate.name}?`);
        if (!confirmVote) return;

        setVoting(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/vote`, { candidateId: selectedCandidate._id }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update user state locally
            const user = JSON.parse(localStorage.getItem('user'));
            user.hasVoted = true;
            localStorage.setItem('user', JSON.stringify(user));

            // Success Animation
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            alert('Voting failed: ' + (err.response?.data?.message || err.message));
            setVoting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
    );

    if (hasVoted) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
            >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-black text-slate-800">You have already voted!</h2>
            <p className="text-slate-500 max-w-md">Thank you for participating in the election. Your vote has been securely recorded.</p>
            <button onClick={() => navigate('/dashboard')} className="text-violet-600 font-bold hover:underline">
                Return to Dashboard
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
            <div className="text-center space-y-4 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
                >
                    <Award className="w-4 h-4" />
                    <span>Official Ballot Phase</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight"
                >
                    Cast Your Vote
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed"
                >
                    Select a candidate below to view their details. Once you are sure, confirm your choice to cast your secure digital ballot.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                {candidates.map((candidate, idx) => (
                    <motion.div
                        key={candidate._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedCandidate(candidate)}
                        className={`cursor-pointer group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 ${selectedCandidate?._id === candidate._id
                            ? 'ring-4 ring-violet-500 shadow-2xl scale-[1.02] z-10'
                            : 'hover:shadow-xl hover:-translate-y-2 border border-slate-100'
                            }`}
                    >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-br ${selectedCandidate?._id === candidate._id
                                ? 'from-violet-600 to-purple-600'
                                : 'from-slate-100 to-slate-200'
                            }`} />

                        {/* Selected Indicator */}
                        <div className="absolute top-4 right-4 z-20">
                            <motion.div
                                initial={false}
                                animate={{ scale: selectedCandidate?._id === candidate._id ? 1 : 0 }}
                                className="bg-white rounded-full p-2 shadow-lg"
                            >
                                <CheckCircle2 className="w-6 h-6 text-violet-600" />
                            </motion.div>
                        </div>

                        <div className="relative pt-12 px-8 pb-8 flex flex-col items-center text-center h-full">
                            {/* Avatar */}
                            <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-bold mb-6 shadow-xl transform group-hover:scale-110 transition-transform duration-500 ${selectedCandidate?._id === candidate._id
                                    ? 'bg-white text-violet-600'
                                    : 'bg-white text-slate-400'
                                }`}>
                                {candidate.name.charAt(0)}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-1">{candidate.name}</h3>
                                    <p className="text-violet-600 font-bold uppercase tracking-wider text-sm">{candidate.position}</p>
                                </div>

                                <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold uppercase tracking-wide">
                                    {candidate.party || 'Independent'}
                                </div>

                                <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                    "{candidate.manifesto}"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Sticky Vote Bar */}
            <AnimatePresence>
                {selectedCandidate && (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none"
                    >
                        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_0_50px_rgba(0,0,0,0.2)] rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 font-bold text-xl">
                                    {selectedCandidate.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Selected Candidate</p>
                                    <p className="text-xl font-bold text-slate-900">{selectedCandidate.name}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleVote}
                                disabled={voting}
                                className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {voting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Vote</span>
                                        <VoteIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Vote;
