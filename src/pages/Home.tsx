import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Plus, FileText, ChevronRight, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

function useOnClickOutside(ref: React.RefObject<any>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function Home() {
  const navigate = useNavigate();
  const { threads } = useAppStore();

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(filterRef, () => setIsFilterOpen(false));
  useOnClickOutside(sortRef, () => setIsSortOpen(false));

  const uniqueTypes = useMemo(() => Array.from(new Set(threads.map(t => t.typeId))), [threads]);

  const filteredAndSortedThreads = useMemo(() => {
    let result = [...threads];
    if (filterType !== 'all') {
      result = result.filter(t => t.typeId === filterType);
    }
    
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.updatedAt - a.updatedAt;
      if (sortBy === 'oldest') return a.updatedAt - b.updatedAt;
      if (sortBy === 'a-z') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });
    
    return result;
  }, [threads, filterType, sortBy]);

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
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-semibold font-['Poppins'] text-[var(--color-ink)] mb-2">My Reports</h1>
          <p className="text-[var(--color-ink-muted)]">Access your intelligence reports or start a new request.</p>
        </div>
        <button
          onClick={() => navigate('/new')}
          className="bg-[#36c0c9] text-white hover:bg-[#2ea3aa] transition-colors duration-200 rounded-lg px-5 py-2.5 font-medium flex items-center justify-center gap-2 shadow-sm self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
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
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${filterType === 'all' ? 'bg-[#36c0c9] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All Reports
              </button>
              {uniqueTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${filterType === type ? 'bg-[#36c0c9] text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  {type === 'techLandscape' ? 'Tech Landscape' : type}
                </button>
              ))}
            </div>

            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                Sort by: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'A-Z'}
              </button>
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                  <button 
                    onClick={() => { setSortBy('newest'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm ${sortBy === 'newest' ? 'bg-gray-50 text-[#0D212C] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Newest First
                  </button>
                  <button 
                    onClick={() => { setSortBy('oldest'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm ${sortBy === 'oldest' ? 'bg-gray-50 text-[#0D212C] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Oldest First
                  </button>
                  <button 
                    onClick={() => { setSortBy('a-z'); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm ${sortBy === 'a-z' ? 'bg-gray-50 text-[#0D212C] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Alphabetical (A-Z)
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredAndSortedThreads.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No reports match the selected filters.
            </div>
          ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedThreads.map((thread) => (
            <motion.div 
              key={thread.id} 
              variants={item}
              onClick={() => navigate(`/report/${thread.id}`)}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] transition-all cursor-pointer group flex flex-col h-full hover:-translate-y-1 duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full capitalize tracking-wide">
                  {thread.typeId === 'techLandscape' ? 'Tech Landscape' : thread.typeId}
                </div>
                <div className="text-xs font-medium text-gray-400 font-mono">
                  v{thread.versions?.length || 1}
                </div>
              </div>
              
              <h3 className="font-medium text-[16px] text-[#0D212C] mb-3 font-['Poppins'] line-clamp-2 leading-tight">
                {thread.title || "Untitled Intelligence Report"}
              </h3>
              
              <p className="text-[13px] text-gray-500 line-clamp-2 mb-6">
                Strategic analysis covering geographical domains, technology trends, and market depth configurations.
              </p>
              
              <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(thread.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1 text-[#36c0c9] font-medium opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  Open <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
        </>
      )}
    </div>
  );
}