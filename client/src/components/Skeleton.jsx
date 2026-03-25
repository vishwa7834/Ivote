import React from 'react';
import { motion } from 'framer-motion';

export const Skeleton = ({ className, style }) => {
    return (
        <motion.div
            className={`bg-slate-200/50 rounded-2xl backdrop-blur-sm ${className}`}
            style={style}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
    );
};

export const CandidateSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-xl flex flex-col items-center">
        <Skeleton className="w-32 h-32 rounded-3xl mb-6 shadow-md" />
        <Skeleton className="w-3/4 h-8 mb-2" />
        <Skeleton className="w-1/2 h-4 mb-6" />
        <div className="w-full space-y-3 border-t border-slate-100/50 pt-6">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-5/6 h-3" />
            <Skeleton className="w-4/6 h-3" />
        </div>
    </div>
);
