import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Award, Quote } from 'lucide-react';
import { API_URL } from '../config';

const Manifesto = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/api/candidates`)
            .then(res => setCandidates(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-20 text-gray-400">Loading Manifestos...</div>;

    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-4">Candidate Manifestos</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Read the visions and promises of your future leaders. An informed vote is a powerful vote.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {candidates.map((candidate, idx) => (
                    <motion.div
                        key={candidate._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl transition-all"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{candidate.name}</h3>
                                <p className="text-violet-600 font-bold">{candidate.position}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-xl">
                                {candidate.name.charAt(0)}
                            </div>
                        </div>

                        <div className="mb-6 relative">
                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-100 -z-10" />
                            <p className="text-gray-600 italic leading-relaxed">
                                "{candidate.manifesto || "No manifesto provided yet."}"
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                <Award className="w-4 h-4" />
                                <span>Key Promises</span>
                            </div>
                            <ul className="space-y-3">
                                {(candidate.promises || ['No specific promises listed.']).slice(0, 3).map((promise, i) => (
                                    <li key={i} className="flex items-start space-x-3 text-sm text-gray-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                                        <span>{promise}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-500 rounded-full uppercase tracking-wider">
                                {candidate.party || 'Independent'}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {candidates.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400">No candidates have registered yet.</p>
                </div>
            )}
        </div>
    );
};

export default Manifesto;
