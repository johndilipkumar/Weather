import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

export default function ErrorState({ message, onRetry }) {
  // Resolve error SVGs from Vite assets
  const errorIconUrl = new URL('../assets/images/icon-error.svg', import.meta.url).href;

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full rounded-3xl p-8 text-center border border-white/10 flex flex-col items-center shadow-2xl relative overflow-hidden"
      >
        {/* Glow highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Error Illustration */}
        <div className="w-24 h-24 mb-6 bg-red-500/10 rounded-full flex items-center justify-center p-5 border border-red-500/20">
          {errorIconUrl ? (
            <img
              src={errorIconUrl}
              alt="Error alert representation"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(239,68,68,0.2)]"
            />
          ) : (
            <FiAlertCircle className="w-12 h-12 text-red-400" />
          )}
        </div>

        <h2 className="text-2xl font-bold font-display text-white tracking-tight mb-3">
          Something Went Wrong
        </h2>
        
        <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          {message || "We couldn't load the weather details. Please check your internet connection and try again."}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-300 group"
          >
            <FiRefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
        )}
      </motion.div>
    </div>
  );
}
