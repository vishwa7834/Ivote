import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { API_URL } from '../config';

const Grievance = () => {
    const [grievances, setGrievances] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchGrievances = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/grievances`);
            setGrievances(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_URL}/api/grievances`, { title, description, category }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTitle('');
            setDescription('');
            fetchGrievances();
        } catch (err) {
            alert('Failed to submit: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[calc(100vh-8rem)]">
            {/* Submission Side */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Speak Up</h2>
                    <p className="text-gray-500">
                        Submit your grievances anonymously or publicly. Your feedback helps improve our campus.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                        <input
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-medium"
                            placeholder="Briefly summarize the issue"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                        <select
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-medium appearance-none"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option>General</option>
                            <option>Academic</option>
                            <option>Facilities</option>
                            <option>Harassment</option>
                        </select>
                    </div>

                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                        <textarea
                            className="w-full h-full min-h-[150px] px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-violet-500 outline-none transition-all font-medium resize-none"
                            placeholder="Provide full details..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Grievance'}</span>
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </motion.div>

            {/* List Side */}
            <div className="flex flex-col h-full space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Search className="w-6 h-6 text-gray-400" />
                        Public Feed
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {grievances.map((g, idx) => (
                        <motion.div
                            key={g._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${g.category === 'Academic' ? 'bg-blue-50 text-blue-600' :
                                    g.category === 'Facilities' ? 'bg-orange-50 text-orange-600' :
                                        g.category === 'Harassment' ? 'bg-red-50 text-red-600' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {g.category}
                                </span>
                                <div className={`flex items-center space-x-1 text-xs font-bold ${g.status === 'Resolved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {g.status === 'Resolved' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    <span>{g.status || 'Pending'}</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-2">{g.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{g.description}</p>

                            <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-4">
                                <span className="font-medium">#{g._id.slice(-6).toUpperCase()}</span>
                                <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}

                    {grievances.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>No grievances reported yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Grievance;
