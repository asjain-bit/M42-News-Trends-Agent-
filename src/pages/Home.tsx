import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { PlusCircle, FileText, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const { threads } = useAppStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-[var(--color-ink)] mb-2">My Reports</h1>
          <p className="text-[var(--color-ink-muted)]">Access your intelligence reports or start a new request.</p>
        </div>
        <button
          onClick={() => navigate('/new')}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] transition-colors duration-200 rounded-lg px-5 py-2.5 font-medium flex items-center justify-center gap-2 shadow-sm self-start md:self-auto"
        >
          <PlusCircle className="w-5 h-5" />
          New Report
        </button>
      </div>

      {threads.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm"
        >
          <div className="w-16 h-16 bg-[var(--color-canvas)] rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-[var(--color-ink-muted)] opacity-50" />
          </div>
          <h2 className="text-xl font-semibold font-['Poppins'] text-[var(--color-ink)] mb-2">No reports yet</h2>
          <p className="text-[var(--color-ink-muted)] mb-6 max-w-md">
            You haven't generated any intelligence reports yet. Click the button below to start your first request.
          </p>
          <button
            onClick={() => navigate('/new')}
            className="bg-[var(--color-surface-muted)] text-[var(--color-ink)] hover:bg-[#e2e8f0] transition-colors duration-200 rounded-lg px-6 py-2.5 font-medium"
          >
            Get Started
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {threads.map((thread) => (
            <motion.div 
              key={thread.id} 
              variants={item}
              onClick={() => navigate(`/report/${thread.id}`)}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-semibold px-2.5 py-1 rounded-md">
                  {thread.typeId === 'techLandscape' ? 'Tech Landscape' : thread.typeId}
                </div>
                {thread.status === 'partial' && (
                   <div className="flex items-center text-xs font-medium text-[var(--color-warning)] gap-1">
                     <ShieldAlert className="w-3 h-3" /> Needs Review
                   </div>
                )}
              </div>
              
              <h3 className="font-semibold text-[var(--color-ink)] mb-2 font-['Poppins'] line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
                {thread.title || "Untitled Report"}
              </h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between text-xs text-[var(--color-ink-muted)] border-t border-[var(--color-border)]/50">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(thread.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-[var(--color-accent)] font-medium">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}