import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { notificationService } from '../services/notificationService';
import { Download, RefreshCw, ThumbsUp, ThumbsDown, ShieldAlert, Flag, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { threads, updateThread } = useAppStore();
  
  const [rating, setRating] = useState<number | null>(null);
  
  const thread = threads.find(t => t.id === id);

  if (!thread) {
    return (
      <div className="flex justify-center py-20 text-[var(--color-ink-muted)]">
        Report not found.
      </div>
    );
  }

  // Get latest version
  const latestVersion = thread.versions[thread.versions.length - 1];
  
  if (!latestVersion) {
     return (
       <div className="flex justify-center py-20 text-[var(--color-ink-muted)]">
         No versions available for this report.
       </div>
     );
  }

  const { content } = latestVersion;

  const handleDownload = () => {
    notificationService.notify("Downloading sample_report.docx", "success");
    // In a real app, this would trigger a Blob download
  };

  const handleRate = async (score: number) => {
    setRating(score);
    const updatedVersion = { ...latestVersion, rating: score };
    const updatedVersions = [...thread.versions];
    updatedVersions[updatedVersions.length - 1] = updatedVersion;
    
    await updateThread({ ...thread, versions: updatedVersions });
    notificationService.notify(`Thank you for your feedback!`, "success");
  };

  const handleFlag = async () => {
    const updatedVersion = { ...latestVersion, flagged: true };
    const updatedVersions = [...thread.versions];
    updatedVersions[updatedVersions.length - 1] = updatedVersion;
    
    await updateThread({ ...thread, versions: updatedVersions });
    notificationService.notify("Source flagged for review.", "info");
  };

  const handleRegenerate = () => {
    // Re-route to BuildRequest to allow modifying inputs
    navigate('/new/tech', { state: { inputs: thread.inputs } });
  };

  const getConfidenceBadge = (confidence: string, count?: number) => {
    const isHigh = confidence === "High";
    const isMed = confidence === "Medium";
    
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
        isHigh ? 'bg-[#d6f1e3] text-[#0a8754] border border-[#bcebd3]' :
        isMed ? 'bg-[#FBF3E4] text-[#B47216] border border-[#f5e0bd]' :
        'bg-[#fde3e1] text-[#d92d20] border border-[#fac2bf]'
      }`}>
        {isHigh ? <CheckCircle className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
        {confidence} Confidence
        {count !== undefined && count > 0 && <span className="ml-1 opacity-80 border-l border-current pl-1.5">{count} Low</span>}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs font-semibold px-2.5 py-1 rounded-md">
              {thread.typeId === 'techLandscape' ? 'Tech Landscape' : thread.typeId}
            </span>
            <span className="text-xs text-[var(--color-ink-muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" /> v{latestVersion.versionNumber} • {new Date(latestVersion.createdAt).toLocaleString()}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Poppins'] text-[var(--color-ink)] mb-3">
            {thread.title}
          </h1>
          <div className="flex items-center gap-2">
             {getConfidenceBadge(content.confidence, content.lowConfidenceCount)}
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleRegenerate}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition-colors duration-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-[var(--color-ink-muted)]" />
            Adjust & Regenerate
          </button>
          <button 
            onClick={handleDownload}
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] transition-colors duration-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download .docx
          </button>
        </div>
      </div>

      {/* Report Summary Content */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden mb-8"
      >
        <div className="bg-[var(--color-primary)] p-8 text-white">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-soft)] mb-3">Headline Findings</h2>
          <p className="text-xl font-['Poppins'] font-medium leading-relaxed">
            "{content.headline}"
          </p>
        </div>

        <div className="p-8 space-y-10">
          {content.sections.map((section: any, idx: number) => (
             <div key={idx} className="pb-8 border-b border-[var(--color-border)] last:border-0 last:pb-0">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold font-['Poppins'] text-[var(--color-ink)]">{section.title}</h3>
                 {getConfidenceBadge(section.confidence)}
               </div>
               <p className="text-[var(--color-ink-muted)] leading-relaxed">
                 {section.body}
               </p>
               {section.confidence === "Medium" && (
                  <div className="mt-4 bg-[#FBF3E4] border border-[#f5e0bd] rounded-lg p-3 text-xs text-[#B47216] flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>This section relies on sparse data points or unverified secondary sources. Proceed with caution.</p>
                  </div>
               )}
             </div>
          ))}
        </div>
      </motion.div>

      {/* Feedback & Governance */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl p-6">
        <div>
           <h4 className="text-sm font-semibold text-[var(--color-ink)] mb-1">Was this report helpful?</h4>
           <p className="text-xs text-[var(--color-ink-muted)]">Your feedback improves future generation quality.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <button 
               onClick={() => handleRate(1)}
               className={`p-2 rounded-md transition-colors ${rating === 1 ? 'bg-[#d6f1e3] text-[#0a8754]' : 'bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[#e2e8f0]'}`}
             >
               <ThumbsUp className="w-4 h-4" />
             </button>
             <button 
               onClick={() => handleRate(0)}
               className={`p-2 rounded-md transition-colors ${rating === 0 ? 'bg-[#fde3e1] text-[#d92d20]' : 'bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[#e2e8f0]'}`}
             >
               <ThumbsDown className="w-4 h-4" />
             </button>
           </div>
           
           <div className="w-px h-8 bg-[var(--color-border)]"></div>
           
           <button 
             onClick={handleFlag}
             disabled={latestVersion.flagged}
             className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md transition-colors ${
               latestVersion.flagged ? 'bg-[#FBF3E4] text-[#B47216]' : 'bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[#e2e8f0]'
             }`}
           >
             <Flag className="w-3.5 h-3.5" /> 
             {latestVersion.flagged ? 'Source Flagged' : 'Flag Source'}
           </button>
        </div>
      </div>
      
    </div>
  );
}