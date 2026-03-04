import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Edit2, CheckCircle2, AlertCircle, X, ShieldAlert, CreditCard } from 'lucide-react';
import { API_URL } from '../config';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
            setPendingRequest(res.data.pendingRequest);
            setFormData({
                name: res.data.profile.name || '',
                phone: res.data.profile.phone || '',
                email: res.data.profile.email || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic check to see if anything actually changed
        if (
            formData.name === profile.name &&
            formData.phone === profile.phone &&
            formData.email === profile.email
        ) {
            alert("No changes made.");
            setIsEditing(false);
            return;
        }

        try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch (err) { }
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/profile/request-update`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Re-fetch to show pending state
            await fetchProfileData();
            setIsEditing(false);
        } catch (error) {
            console.error('Update request error:', error);
            alert(error.response?.data?.message || 'Failed to submit update request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-32">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center space-x-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-bold mb-2">
                    <User className="w-4 h-4" />
                    <span>My Account</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                    Profile Dashboard
                </h1>
            </motion.div>

            {pendingRequest && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 md:p-8 flex items-start space-x-4 shadow-lg shadow-amber-100/50"
                >
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-amber-900 mb-2">Update Request Pending</h3>
                        <p className="text-amber-700 leading-relaxed mb-4">
                            You have submitted a request to change your profile information. An election administrator must review and approve these changes to ensure election integrity.
                        </p>
                        <div className="bg-white/60 rounded-xl p-4 border border-amber-100">
                            <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-2">Requested Changes</h4>
                            <ul className="space-y-1 text-sm text-amber-800">
                                {pendingRequest.requestedChanges.name !== profile.name && (
                                    <li><strong>Name:</strong> {profile.name} <span className="text-amber-400 mx-2">→</span> {pendingRequest.requestedChanges.name}</li>
                                )}
                                {pendingRequest.requestedChanges.phone !== profile.phone && (
                                    <li><strong>Phone:</strong> {profile.phone} <span className="text-amber-400 mx-2">→</span> {pendingRequest.requestedChanges.phone}</li>
                                )}
                                {pendingRequest.requestedChanges.email !== profile.email && (
                                    <li><strong>Email:</strong> {profile.email} <span className="text-amber-400 mx-2">→</span> {pendingRequest.requestedChanges.email}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-violet-100/50 border border-slate-100 relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                <div className="flex justify-between items-end mb-8 relative z-10">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-violet-500/30">
                            {profile.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">{profile.name}</h2>
                            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    {!pendingRequest && !isEditing && (
                        <button
                            onClick={() => {
                                try { Haptics.impact({ style: ImpactStyle.Light }); } catch (err) { }
                                setIsEditing(true);
                            }}
                            className="p-3 bg-violet-50 text-violet-600 hover:bg-violet-100 rounded-xl transition-colors hidden md:flex"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all bg-white"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 border border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Roll Number is intentionally locked */}
                            <div className="relative group opacity-60">
                                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                                    <span>Registration/Roll Number</span>
                                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">Locked</span>
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={profile.rollNumber}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Request Update</span>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Mail className="w-5 h-5 text-violet-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                                    <p className="text-slate-800 font-medium">{profile.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Phone className="w-5 h-5 text-violet-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                    <p className="text-slate-800 font-medium">{profile.phone}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <CreditCard className="w-5 h-5 text-violet-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Roll / Registration No.</p>
                                    <p className="text-slate-800 font-medium">{profile.rollNumber}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center space-x-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <ShieldAlert className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Identity Verification</p>
                                    <p className="text-emerald-700 font-medium">Face Biometrics Active</p>
                                </div>
                            </div>
                        </div>

                        {!pendingRequest && (
                            <button
                                onClick={() => {
                                    try { Haptics.impact({ style: ImpactStyle.Light }); } catch (err) { }
                                    setIsEditing(true);
                                }}
                                className="w-full md:hidden mt-4 p-4 bg-violet-50 text-violet-700 rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                <Edit2 className="w-5 h-5" />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Profile;
