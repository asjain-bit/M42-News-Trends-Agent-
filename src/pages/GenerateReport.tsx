import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { reportService } from '../services/reportService';
import { notificationService } from '../services/notificationService';
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = ['Researching', 'Analysing', 'Scoring'];

export default function GenerateReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { threads, updateThread } = useAppStore();
  const [currentStage, setCurrentStage] = useState<string>('Researching');
  const generationStarted = useRef(false);

  const thread = threads.find(t => t.id === id);

  useEffect(() => {
    if (!thread) {
      // If thread not found (maybe page refresh before loaded), wait a moment or redirect
      const timeout = setTimeout(() => {
        if (!threads.find(t => t.id === id)) {
          navigate('/');
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }

    if (thread.status !== 'generating') {
      navigate(`/report/${id}`);
      return;
    }

    const generate = async () => {
      if (generationStarted.current) return;
      generationStarted.current = true;
      
      try {
        const newVersion = await reportService.generate(thread.inputs, (stage) => {
          setCurrentStage(stage);
        });
        
        // Finalize
        newVersion.versionNumber = thread.versions.length + 1;
        
        await updateThread({
          ...thread,
          status: 'completed',
          versions: [...thread.versions, newVersion],
          updatedAt: Date.now()
        });
        
        notificationService.notify("Your report is ready!", "success");
        navigate(`/report/${id}`);
      } catch (error) {
        console.error("Generation failed", error);
        await updateThread({ ...thread, status: 'failed' });
      }
    };

    generate();
  }, [id, thread, threads, navigate, updateThread]);

  if (!thread) return null;

  const stageIndex = STAGES.indexOf(currentStage);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">
      
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold font-['Poppins'] text-[var(--color-ink)] mb-2">Generating Intelligence</h1>
        <p className="text-[var(--color-ink-muted)]">Please wait while the agent builds your report.</p>
        <p className="text-xs text-[var(--color-ink-muted)] mt-2 italic bg-[var(--color-surface-muted)] inline-block px-3 py-1 rounded-md">
          You can navigate away; progress will be saved.
        </p>
      </div>

      <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-8 md:p-12 mb-8 flex flex-col items-center">
         
         {/* Live Progress Stage */}
         <AnimatePresence mode="wait">
            <motion.div 
              key={currentStage}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center mb-12"
            >
              <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                   className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[var(--color-accent)] border-r-[var(--color-accent)] opacity-80"
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                   className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-[var(--color-primary)] border-l-[var(--color-primary)] opacity-40"
                 />
                 <div className="bg-[var(--color-canvas)] rounded-full w-16 h-16 flex items-center justify-center shadow-inner">
                    <Loader2 className="w-6 h-6 text-[var(--color-ink)] animate-pulse" />
                 </div>
              </div>
              <h2 className="text-xl font-semibold font-['Poppins'] text-[var(--color-ink)]">{currentStage}...</h2>
            </motion.div>
         </AnimatePresence>

         {/* Steps timeline */}
         <div className="flex items-center justify-center w-full max-w-md gap-4">
            {STAGES.map((stage, idx) => {
               const isCompleted = idx < stageIndex;
               const isActive = idx === stageIndex;
               const isPending = idx > stageIndex;
               
               return (
                 <div key={stage} className="flex flex-col items-center flex-1">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                     isCompleted ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' :
                     isActive ? 'bg-[var(--color-primary)] text-white shadow-md' :
                     'bg-[var(--color-canvas)] text-[var(--color-border)]'
                   }`}>
                     {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-semibold">{idx + 1}</span>}
                   </div>
                   <span className={`text-xs font-medium transition-colors ${
                     isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'
                   }`}>{stage}</span>
                 </div>
               )
            })}
         </div>
      </div>

      {/* Governance Band */}
      <div className="w-full bg-[#E4F2F2] border border-[#C7E3E3] rounded-xl p-5 relative overflow-hidden">
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#0E7C86] rounded-r-md"></div>
        <div className="pl-4">
          <div className="text-[10px] font-semibold text-[#0E7C86] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Governance · Running Continuously
          </div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">Quality & Governance Layer</h3>
          
          <div className="flex flex-wrap gap-2">
            {['Cite every claim (source + date)', 'Confidence scoring (High/Med/Low)', 'Guardrails & sensitivity check', 'Run audit log', 'Graceful failure handling'].map(item => (
              <span key={item} className="text-xs font-medium text-[#0E7C86] bg-white border border-[#C7E3E3] rounded-md px-2.5 py-1 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}