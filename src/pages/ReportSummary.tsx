import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { notificationService } from '../services/notificationService';
import { MessageSquare, Sparkles, AlertCircle, ChevronDown, Download, Check, ThumbsUp, ThumbsDown, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ReportRenderer } from '../components/report/ReportRenderer';

export default function ReportSummary() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { threads, updateThread } = useAppStore();
  
  const thread = threads.find(t => t.id === id);
  const [activeSection, setActiveSection] = useState<string>('');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  
  // Comment UI State
  const [hoveredBlock, setHoveredBlock] = useState<{ id: string, top: number, height: number } | null>(null);
  const [activeCommentBlock, setActiveCommentBlock] = useState<{ id: string, top: number, height: number } | null>(null);
  const [persistentIcons, setPersistentIcons] = useState<{ id: string, top: number, height: number, comments: string[] }[]>([]);
  const [commentText, setCommentText] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  
  const versionDropdownRef = useRef<HTMLDivElement>(null);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'up' | 'down' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [hasGivenFeedback, setHasGivenFeedback] = useState(false);
  
  // Idle Timer logic
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cancelTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (hasGivenFeedback) return;
    
    // Auto-show modal after 45 seconds
    timerRef.current = setTimeout(() => {
      setShowFeedbackModal(true);
    }, 45000);

    return () => cancelTimer();
  }, [hasGivenFeedback]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(event.target as Node)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Re-calculate persistent icon positions when comments change
  useEffect(() => {
    if (!thread || !contentRef.current) return;
    
    // Determine the version to show
    const currentVersion = selectedVersionId 
      ? thread.versions.find(v => v.id === selectedVersionId) || thread.versions[thread.versions.length - 1]
      : thread.versions[thread.versions.length - 1];
      
    if (!currentVersion.comments) {
      setPersistentIcons([]);
      return;
    }
    
    // Delay slightly to ensure DOM is fully rendered
    setTimeout(() => {
      if (!contentRef.current) return;
      
      const icons: any[] = [];
      const comments = currentVersion.comments || {};
      
      // 1. Support legacy comments based on exact text encoding
      const oldElements = Array.from(contentRef.current.querySelectorAll('p, li, h2, h3, .highlight-box, .alert-box')) as HTMLElement[];
      for (let i = 0; i < oldElements.length; i++) {
        const el = oldElements[i];
        const textToEncode = el.innerText.slice(0, 20) + el.tagName + i;
        const id = btoa(encodeURIComponent(textToEncode)).replace(/=/g, '');
        if (comments[id] && comments[id].length > 0) {
          icons.push({
            id,
            top: el.offsetTop,
            height: el.offsetHeight,
            comments: comments[id]
          });
        }
      }
      
      // 2. Support new structured block ID comments
      const newElements = Array.from(contentRef.current.querySelectorAll('.commentable-block')) as HTMLElement[];
      for (let i = 0; i < newElements.length; i++) {
        const el = newElements[i];
        const id = el.getAttribute('data-block-id');
        if (id && comments[id] && comments[id].length > 0) {
          icons.push({
            id,
            top: el.offsetTop,
            height: el.offsetHeight,
            comments: comments[id]
          });
        }
      }
      
      setPersistentIcons(icons);
    }, 100);
  }, [thread, selectedVersionId]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeCommentBlock) return;
    const target = e.target as HTMLElement;
    if (target.closest('.comment-icon-btn')) return;

    const block = target.closest('.commentable-block') as HTMLElement;
    if (block && contentRef.current?.contains(block)) {
       const id = block.getAttribute('data-block-id') || 'unknown';
       
       // Don't show hover icon if there's already a persistent comment there (user can click the persistent icon instead)
       if ((thread?.versions[thread.versions.length - 1].comments?.[id]?.length ?? 0) > 0) {
         setHoveredBlock(null);
         return;
       }
       
       setHoveredBlock({
         id,
         top: block.offsetTop,
         height: block.offsetHeight
       });
    }
  };

  const handleMouseLeave = () => {
    if (!activeCommentBlock) setHoveredBlock(null);
  };
  
  // Ref for observing sections
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [thread]);

  if (!thread) {
    return (
      <div className="flex justify-center py-20 text-[var(--color-ink-muted)]">
        Report not found.
      </div>
    );
  }

  const latestVersion = selectedVersionId 
    ? thread.versions.find(v => v.id === selectedVersionId) || thread.versions[thread.versions.length - 1]
    : thread.versions[thread.versions.length - 1];
  
  if (!latestVersion || !latestVersion.content.sections) {
     return (
       <div className="flex justify-center py-20 text-[var(--color-ink-muted)]">
         No versions available for this report.
       </div>
     );
  }

  const { sections } = latestVersion.content;

  const handleRegenerate = async () => {
    cancelTimer();
    await updateThread({
      ...thread,
      status: 'generating',
      updatedAt: Date.now()
    });
    navigate(`/report/${id}/generating`);
  };

  const handleExportWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Report</title></head>
      <body>
        ${latestVersion.content.sections.map((s: any) => `<h2>${s.title}</h2>${s.content}`).join('')}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${thread.title || 'Report'}_v${latestVersion.versionNumber}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const container = document.getElementById('report-scroll-container');
    if (element && container) {
      const topPos = element.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 40;
      container.scrollTo({ top: topPos, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const hasComments = latestVersion.comments && Object.keys(latestVersion.comments).length > 0;

  return (
    <>
      <style>{`
        .report-content {
          font-family: 'Inter', sans-serif;
          color: #374151;
        }
        .report-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          font-size: 15px;
          color: #4B5563;
        }
        .report-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0D212C;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-family: 'Poppins', sans-serif;
        }
        .report-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
          color: #4B5563;
          line-height: 1.7;
        }
        .report-content li {
          margin-bottom: 0.5rem;
        }
        .report-content blockquote {
          border-left: 4px solid #36c0c9;
          padding: 1rem 1.5rem;
          font-style: italic;
          color: #6B7280;
          background-color: #F8FAFC;
          border-radius: 0 8px 8px 0;
          margin: 2rem 0;
          font-size: 15px;
        }
        .report-content .highlight-box {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1.25rem;
          margin: 1.5rem 0;
          font-size: 14.5px;
        }
        .report-content .alert-box {
          background-color: #FFFBEB;
          border: 1px solid #FEF3C7;
          border-radius: 8px;
          padding: 1.25rem;
          margin: 1.5rem 0;
        }
        .report-content .alert-box h4 {
          color: #B45309;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-family: 'Poppins', sans-serif;
        }
        .report-content strong {
          color: #111827;
          font-weight: 600;
        }
      `}</style>
      
      <div className="w-full h-[calc(100vh-80px)] bg-[#F6F7FB] p-6 flex items-center justify-center">
        
        <div className="w-full h-full max-w-[1400px] bg-white rounded-2xl shadow-sm border border-gray-200 flex overflow-hidden">
          
          <div className="w-[300px] shrink-0 h-full bg-[#f8f9fc] border-r border-gray-200 flex flex-col">
            <div className="p-6 pb-4">
              <h3 className="font-semibold text-[15px] font-['Poppins'] text-[#0D212C]">Table of Contents</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-1.5">
              {sections.map((section: any) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center justify-between w-full p-2.5 rounded-lg text-left transition-all border ${
                      isActive 
                        ? 'bg-[#36c0c9]/10 border-[#36c0c9]/20 shadow-sm' 
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#36c0c9]' : 'bg-gray-400'}`} />
                      <span className={`text-[13px] leading-tight ${isActive ? 'text-[#0D212C]' : 'text-gray-600'}`}>
                        {section.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full bg-[#f8f9fc] relative">
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#36c0c9] z-[100] origin-left"
        style={{ scaleX }}
      />
      
      {/* Header */}    
            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
               <div className="flex items-center gap-3">
                 <div className="relative" ref={versionDropdownRef}>
                    <div 
                      onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                      className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <span className="text-[13px] font-medium text-gray-600">Tech Landscape</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[13px] font-medium text-gray-600">v{latestVersion.versionNumber}</span>
                      <svg className={`w-3.5 h-3.5 text-gray-400 ml-1 transition-transform ${isVersionDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {thread.versions.length > 1 && isVersionDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg transition-all z-50">
                        {thread.versions.map((v) => (
                          <div 
                            key={v.id} 
                            onClick={() => { setSelectedVersionId(v.id); setIsVersionDropdownOpen(false); }}
                            className="px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          >
                            <span>v{v.versionNumber}</span>
                            {v.id === latestVersion.id && <Check className="w-3.5 h-3.5 text-[#36c0c9]" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportWord}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#36c0c9] border border-[#36c0c9] rounded-md text-[13px] font-medium text-white hover:bg-[#2ea3aa] transition-colors shadow-sm"
                  >
                    Export as Word
                  </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 flex" id="report-scroll-container">
              <div className="flex-1 min-h-full py-12 px-6 lg:px-16 flex justify-center items-start">
                <div className="w-full report-content flex flex-col gap-12 max-w-[1200px]">
                  
                <div 
                  className="flex flex-col gap-12 relative w-full"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  ref={contentRef}
                >
                  {sections.map((section: any, idx: number) => (
                    <div key={section.id} className="bg-white shadow-sm border border-gray-200 rounded-2xl p-10 lg:p-16 w-full">
                      {idx === 0 && (
                        <div className="border-b border-gray-100 pb-10 mb-10">
                          <h1 className="text-3xl lg:text-4xl font-bold font-['Poppins'] text-[#0D212C] leading-tight mb-4 tracking-tight">
                            {thread.title}
                          </h1>
                          <p className="text-gray-500 text-[15px] flex items-center gap-2">
                            Generated Intelligence Report
                          </p>
                        </div>
                      )}
                      <section 
                        id={section.id}
                        ref={el => { sectionRefs.current[idx] = el; }}
                        className="scroll-mt-16 h-full"
                      >
                        <h2 className="text-2xl lg:text-3xl font-semibold font-['Poppins'] text-[#0D212C] mb-8 pb-4 border-b border-gray-100">
                          {section.title}
                        </h2>
                        {section.blocks ? (
                          <ReportRenderer blocks={section.blocks} />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: section.content }} />
                        )}
                      </section>
                    </div>
                  ))}

                  {persistentIcons.map((icon) => (
                    <div 
                      key={icon.id}
                      className="absolute right-6 z-10 group cursor-pointer"
                      style={{ top: icon.top + (icon.height / 2) - 16 }}
                      onClick={() => setActiveCommentBlock({ id: icon.id, top: icon.top, height: icon.height })}
                    >
                      <div className="w-8 h-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md flex items-center justify-center shadow-sm">
                         <MessageSquare className="w-5 h-5 text-[#36c0c9]" />
                      </div>
                      
                      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-[250px] bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        {icon.comments.map((c, i) => (
                           <div key={i} className="text-[13px] text-gray-700 leading-relaxed font-sans mb-2 last:mb-0 pb-2 border-b last:border-b-0 border-gray-100">{c}</div>
                        ))}
                        <div className="text-[11px] text-[#36c0c9] font-medium mt-2 pt-2 border-t border-gray-100">Click icon to add another comment</div>
                        <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-r border-t border-gray-200 rotate-45"></div>
                      </div>
                    </div>
                  ))}

                  {hoveredBlock && !activeCommentBlock && (
                     <div 
                       className="comment-icon-btn absolute right-6 cursor-pointer z-10 transition-transform hover:scale-110"
                       style={{ top: hoveredBlock.top + (hoveredBlock.height / 2) - 16 }}
                       onClick={() => setActiveCommentBlock(hoveredBlock)}
                     >
                        <div className="w-8 h-8 bg-[#36c0c9] rounded-md flex items-center justify-center shadow-md">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                             <line x1="9" y1="10" x2="15" y2="10"></line>
                             <line x1="12" y1="7" x2="12" y2="13"></line>
                           </svg>
                        </div>
                     </div>
                  )}

                  {activeCommentBlock && (
                     <div 
                       className="absolute w-[300px] bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50"
                       style={{ 
                         top: activeCommentBlock.top,
                         right: '20px'
                       }}
                     >
                        <div className="relative">
                          <input 
                            autoFocus
                            type="text" 
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Leave a comment"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0D212C] focus:ring-1 focus:ring-[#0D212C] mb-3"
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setActiveCommentBlock(null); setCommentText(""); setHoveredBlock(null); }}
                              className="px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => { 
                                const newComments = { ...(latestVersion.comments || {}) };
                                if (!newComments[activeCommentBlock.id]) {
                                  newComments[activeCommentBlock.id] = [];
                                }
                                newComments[activeCommentBlock.id].push(commentText);
                                
                                const updatedVersions = [...thread.versions];
                                const versionIndex = updatedVersions.findIndex(v => v.id === latestVersion.id);
                                if (versionIndex !== -1) {
                                  updatedVersions[versionIndex] = {
                                    ...latestVersion,
                                    comments: newComments
                                  };
                                }
                                
                                updateThread({
                                  ...thread,
                                  versions: updatedVersions,
                                  updatedAt: Date.now()
                                });

                                cancelTimer(); // Cancel modal trigger
                                setActiveCommentBlock(null); 
                                setCommentText(""); 
                                setHoveredBlock(null);
                              }}
                              disabled={!commentText.trim()}
                              className="px-3 py-1.5 text-[13px] bg-[#0D212C] text-white rounded-md hover:bg-[#153443] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add Comment
                            </button>
                          </div>
                        </div>
                     </div>
                  )}
                </div>

              </div>
            </div>
            
            {(!selectedVersionId || selectedVersionId === thread.versions[thread.versions.length - 1].id) && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
                <button 
                  onClick={handleRegenerate}
                  className="px-6 py-2.5 bg-[#0D212C] text-white rounded-full text-[14px] font-medium shadow-xl hover:bg-[#153443] transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Regenerate Report
                </button>
                
                <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2">
                  <span className="text-[12px] font-medium text-gray-500 mr-2">Was this report helpful?</span>
                  <button 
                    onClick={() => { setFeedbackType('up'); setShowFeedbackModal(true); cancelTimer(); }}
                    className={`p-1.5 rounded-full transition-colors hover:bg-green-50 text-gray-400 hover:text-green-600 ${feedbackType === 'up' ? 'bg-green-50 text-green-600' : ''}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setFeedbackType('down'); setShowFeedbackModal(true); cancelTimer(); }}
                    className={`p-1.5 rounded-full transition-colors hover:bg-red-50 text-gray-400 hover:text-red-600 ${feedbackType === 'down' ? 'bg-red-50 text-red-600' : ''}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col items-center border border-gray-100 p-8 relative"
          >
            <h3 className="text-xl font-semibold text-[#0D212C] mb-2 font-['Poppins'] text-center">Report Feedback</h3>
            <p className="text-[14px] text-gray-500 mb-6 text-center">Help us improve by sharing your thoughts on this generated intelligence report.</p>
            
            <div className="flex items-center gap-6 mb-6">
              <button 
                onClick={() => setFeedbackType('up')}
                className={`p-4 transition-all ${feedbackType === 'up' ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-green-500'}`}
              >
                <ThumbsUp className="w-8 h-8" />
              </button>
              <button 
                onClick={() => setFeedbackType('down')}
                className={`p-4 transition-all ${feedbackType === 'down' ? 'text-red-600 scale-110' : 'text-gray-400 hover:text-red-500'}`}
              >
                <ThumbsDown className="w-8 h-8" />
              </button>
            </div>
            
            <div className="w-full mb-8">
              <label className="block text-[13px] font-medium text-[#0D212C] mb-2 font-['Poppins']">Additional comments (optional)</label>
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={feedbackType === 'up' ? "What did you like?" : feedbackType === 'down' ? "What didn't you like?" : "What did you like or dislike?"}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-[14px] min-h-[100px] focus:outline-none focus:border-[#36c0c9] focus:ring-1 focus:ring-[#36c0c9] resize-none"
              />
            </div>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => { setShowFeedbackModal(false); cancelTimer(); }}
                className="flex-1 px-4 py-2.5 text-[14px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setHasGivenFeedback(true);
                  setShowFeedbackModal(false);
                  cancelTimer();
                  // Simulate submission
                }}
                disabled={!feedbackType && !feedbackText.trim()}
                className="flex-1 px-4 py-2.5 text-[14px] font-medium text-white bg-[#0D212C] hover:bg-[#153443] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </>
  );
}