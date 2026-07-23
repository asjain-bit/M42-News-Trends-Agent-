import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { ReportInputs } from '../services/storageService';
import { FileSearch, Clock, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

export default function ReviewRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addThread } = useAppStore();
  
  const inputs = location.state?.inputs as ReportInputs;
  
  if (!inputs) {
    navigate('/new/tech');
    return null;
  }

  const handleGenerate = async () => {
    // Create the thread and save it
    const threadId = uuidv4();
    await addThread({
      id: threadId,
      title: `${inputs.depth} Tech Landscape: ${inputs.country} - ${inputs.techDomain}`,
      typeId: 'techLandscape',
      inputs,
      versions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'generating'
    });
    
    navigate(`/report/${threadId}/generating`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to inputs
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-['Poppins'] text-[var(--color-ink)] mb-2">Review & Confirm</h1>
        <p className="text-[var(--color-ink-muted)]">Please review the scope before we begin generating your report.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--color-border)]">
            <div className="w-12 h-12 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-xl flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold font-['Poppins'] text-[var(--color-ink)]">Tech Landscape</h2>
              <p className="text-[var(--color-ink-muted)] text-sm">Tech Landscape analysis</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
             <div>
                <span className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">Scope</span>
                <p className="text-lg text-[var(--color-ink)] font-medium">
                  {inputs.country} <span className="text-[var(--color-border)] mx-2">•</span> {inputs.techDomain}
                  <span className="text-[var(--color-border)] mx-2">•</span> Focus: {inputs.focusLens || 'None'}
                </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">Depth</span>
                  <p className="text-[var(--color-ink)]">{inputs.depth}</p>
               </div>
               <div>
                  <span className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">Estimated Time</span>
                  <p className="text-[var(--color-ink)] flex items-center gap-1.5"><Clock className="w-4 h-4 text-[var(--color-accent)]" /> ~2 min</p>
               </div>
             </div>

             <div>
                <span className="block text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">Prompt Details (Optional)</span>
                {inputs.prompt ? (
                  <p className="text-[var(--color-ink)] italic bg-[var(--color-canvas)] p-3 rounded-lg text-sm border border-[var(--color-border)]">
                    "{inputs.prompt}"
                  </p>
                ) : (
                  <p className="text-[var(--color-ink-muted)] italic text-sm">
                    No additional prompt provided.
                  </p>
                )}
             </div>
          </div>
        </div>

        <div className="bg-[var(--color-canvas)] p-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
            <Zap className="w-4 h-4 text-amber-500" />
            Uses 1 intelligence credit
          </div>
          <button
            onClick={handleGenerate}
            className="w-full sm:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] transition-colors duration-200 rounded-lg px-8 py-3 font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            Confirm & generate <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}