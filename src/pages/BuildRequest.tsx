import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { v4 as uuidv4 } from 'uuid';
import { ChevronLeft, Check, Upload, Clock, ChevronDown, Search, X, FileText, LayoutList, Paperclip, ShieldCheck, Globe, Tag, Layers, FileSearch, Target, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook for clicking outside dropdowns
function useOnClickOutside(ref: React.RefObject<any>, handler: (event: MouseEvent | TouchEvent) => void) {
  React.useEffect(() => {
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

export default function BuildRequest() {
  const navigate = useNavigate();
  const { addThread } = useAppStore();
  
  const [inputs, setInputs] = useState({
    reportType: 'Tech Landscape',
    geography: '',
    domains: [] as string[],
    depth: 'Standard Analysis',
    focusLens: [] as string[],
    additionalInstructions: '',
    files: [] as File[]
  });

  const [openDropdown, setOpenDropdown] = useState<'reportType' | 'geography' | 'domain' | 'focus' | null>(null);
  const [domainSearch, setDomainSearch] = useState('');
  const [customFocus, setCustomFocus] = useState('');
  
  // Right Pane state
  const [isReviewPaneOpen, setIsReviewPaneOpen] = useState(true);

  const reportTypeOptions = [
    { id: 'Tech Landscape', disabled: false },
    { id: 'Healthcare Country', disabled: true },
    { id: 'Personality', disabled: true }
  ];

  const geoOptions = [
    'UAE', 'KSA', 'India', 'USA'
  ];

  const getFlag = (country: string) => {
    switch(country) {
      case 'UAE': return '🇦🇪';
      case 'KSA': return '🇸🇦';
      case 'India': return '🇮🇳';
      case 'USA': return '🇺🇸';
      default: return '🌎';
    }
  };

  const allDomainOptions = [
    'Artificial Intelligence', 'Generative AI', 'Machine Learning', 'Cloud Computing', 
    'Cybersecurity', 'Data Analytics', 'Digital Banking', 'FinTech', 'HealthTech', 
    'Blockchain', 'IoT', 'Robotics', 'Semiconductors', 'Telecommunications', 'Smart Cities', 'Others'
  ];

  const focusOptions = [
    'Market Overview', 'Competitive Landscape', 'Key Players', 'Funding & Investments', 
    'Government Initiatives', 'Technology Trends', 'Regulations', 'Innovation', 
    'Partnerships', 'Opportunities', 'Risks', 'Startups'
  ];

  const filteredDomainOptions = allDomainOptions.filter(d => d.toLowerCase().includes(domainSearch.toLowerCase()));

  const handleDomainToggle = (domain: string) => {
    setInputs(prev => {
      if (prev.domains.includes(domain)) {
        return { ...prev, domains: prev.domains.filter(d => d !== domain) };
      }
      return { ...prev, domains: [...prev.domains, domain] };
    });
  };

  const handleFocusToggle = (focus: string) => {
    setInputs(prev => {
      if (prev.focusLens.includes(focus)) {
        return { ...prev, focusLens: prev.focusLens.filter(f => f !== focus) };
      }
      return { ...prev, focusLens: [...prev.focusLens, focus] };
    });
  };

  const handleCustomFocusAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customFocus.trim() !== '') {
      e.preventDefault();
      const val = customFocus.trim();
      if (!inputs.focusLens.includes(val)) {
        setInputs(prev => ({ ...prev, focusLens: [...prev.focusLens, val] }));
      }
      setCustomFocus('');
    }
  };

  const handleCustomDomainAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && domainSearch.trim() !== '') {
      e.preventDefault();
      const val = domainSearch.trim();
      if (!inputs.domains.includes(val)) {
        setInputs(prev => ({ ...prev, domains: [...prev.domains, val] }));
      }
      setDomainSearch('');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setOpenDropdown(null));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setInputs(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles].slice(0, 5) // max 5 files
      }));
    }
  };

  const removeFile = (index: number) => {
    setInputs(prev => {
      const newFiles = [...prev.files];
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  // Derived state
  const isFormValid = inputs.geography.trim().length > 0 && inputs.domains.length > 0 && inputs.depth.trim().length > 0;
  
  // Show empty state if nothing primary is filled out yet
  const showEmptyState = !inputs.geography && inputs.domains.length === 0;

  const getRuntime = () => {
    if (inputs.depth === 'Executive Summary') return '10 – 15 minutes';
    if (inputs.depth === 'Standard Analysis') return '20 – 30 minutes';
    if (inputs.depth === 'Deep Dive') return '30 – 45 minutes';
    return '20 – 30 minutes'; // default fallback
  };

  const getPages = () => {
    if (inputs.depth === 'Executive Summary') return '~20 pages';
    if (inputs.depth === 'Standard Analysis') return '~40 pages';
    if (inputs.depth === 'Deep Dive') return '~60 pages';
    return '~40 pages'; // default fallback
  };

  const handleBack = () => {
    const hasChanges = inputs.geography || inputs.domains.length > 0 || inputs.depth !== 'Standard Analysis' || inputs.focusLens.length > 0 || inputs.additionalInstructions || inputs.files.length > 0;
    if (hasChanges) {
      if (window.confirm("Leave this page? Your configuration has not been saved.")) {
        navigate('/new');
      }
    } else {
      navigate('/new');
    }
  };

  const handleConfirmAndGenerate = async () => {
    if (!isFormValid) return;

    // Create the thread and save it
    const threadId = uuidv4();
    await addThread({
      id: threadId,
      title: `${inputs.depth} ${inputs.reportType}: ${inputs.geography} - ${inputs.domains.join(', ')}`,
      typeId: 'techLandscape',
      inputs: {
        country: inputs.geography,
        techDomain: inputs.domains.join(', '),
        depth: inputs.depth,
        focusLens: inputs.focusLens.join(', '),
        prompt: inputs.additionalInstructions
      },
      versions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'generating'
    });
    
    navigate(`/report/${threadId}/generating`);
  };

  // Format the domain string for the summary card
  const formatDomainsForSummary = () => {
    if (inputs.domains.length === 0) return <span className="font-semibold text-[#0D212C]">select domains</span>;
    
    return inputs.domains.map((d, index) => {
      const isLast = index === inputs.domains.length - 1;
      const isSecondToLast = index === inputs.domains.length - 2;
      return (
        <React.Fragment key={d}>
          <span className="font-semibold text-[#0D212C]">{d}</span>
          {!isLast && isSecondToLast ? ' and ' : !isLast ? ', ' : ''}
        </React.Fragment>
      );
    });
  };

  const formatFocusForSummary = () => {
    if (inputs.focusLens.length === 0) return null;
    
    return inputs.focusLens.map((f, index) => {
      const isLast = index === inputs.focusLens.length - 1;
      const isSecondToLast = index === inputs.focusLens.length - 2;
      return (
        <React.Fragment key={f}>
          <span className="font-semibold text-[#0D212C]">{f}</span>
          {!isLast && isSecondToLast ? ' and ' : !isLast ? ', ' : ''}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`h-full flex flex-col bg-transparent font-sans relative transition-all duration-300 ${isReviewPaneOpen ? 'pr-[420px]' : ''}`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin-block: 16px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E2E8F0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #CBD5E1;
        }
      `}</style>

      {/* Expand Pane Button (visible when pane is closed) */}
      {!isReviewPaneOpen && (
        <button 
          onClick={() => setIsReviewPaneOpen(true)} 
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 border-r-0 rounded-l-xl p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] z-50 text-gray-500 hover:text-[#0D212C] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Main Form Left Pane */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="w-full px-6 lg:px-10 py-8">
          
          {/* Back Link */}
          <button 
            onClick={handleBack}
            className="flex items-center gap-1.5 text-[#36c0c9] font-medium text-[13px] mb-8 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Back to New Report
          </button>

          {/* Flat Form Sections */}
          <div className="space-y-10 max-w-4xl">
            
            {/* Report Type */}
            <div className="relative" ref={openDropdown === 'reportType' ? dropdownRef : null}>
              <label className="block text-[14px] font-semibold text-[#0D212C] mb-1">
                Technology <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Select the category of the report you want to generate.</p>
              <div 
                className={`w-full bg-white border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${openDropdown === 'reportType' ? 'border-gray-300 ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setOpenDropdown(openDropdown === 'reportType' ? null : 'reportType')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[14px] text-[#0D212C]">{inputs.reportType}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              
              {openDropdown === 'reportType' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden py-1">
                  {reportTypeOptions.map(option => (
                    <div 
                      key={option.id}
                      className={`px-4 py-2.5 text-[13.5px] flex items-center justify-between ${
                        option.disabled 
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50/50' 
                          : 'text-[#0D212C] hover:bg-gray-50 cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!option.disabled) {
                          setInputs({...inputs, reportType: option.id});
                          setOpenDropdown(null);
                        }
                      }}
                    >
                      <span>{option.id} {option.disabled && <span className="text-[11px] ml-2 text-gray-400">(Coming Soon)</span>}</span>
                      {inputs.reportType === option.id && <Check className="w-4 h-4 text-gray-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Geography */}
            <div className="relative" ref={openDropdown === 'geography' ? dropdownRef : null}>
              <label className="block text-[14px] font-semibold text-[#0D212C] mb-1">
                Geography <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Select the country or region you want to analyze.</p>
              <div 
                className={`w-full bg-white border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${openDropdown === 'geography' ? 'border-gray-300 ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setOpenDropdown(openDropdown === 'geography' ? null : 'geography')}
              >
                <div className="flex items-center gap-3">
                  {inputs.geography ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[16px]">{getFlag(inputs.geography)}</span>
                      <span className="text-[14px] text-[#0D212C]">{inputs.geography}</span>
                    </div>
                  ) : (
                    <span className="text-[14px] text-gray-400">Select a country</span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              
              {openDropdown === 'geography' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto py-1 custom-scrollbar">
                  {geoOptions.map(option => (
                    <div 
                      key={option}
                      className="px-4 py-2 text-[13.5px] text-[#0D212C] hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => {
                        setInputs({...inputs, geography: option});
                        setOpenDropdown(null);
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[16px]">{getFlag(option)}</span>
                        {option}
                      </div>
                      {inputs.geography === option && <Check className="w-4 h-4 text-gray-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Technology Domain */}
            <div className="relative" ref={openDropdown === 'domain' ? dropdownRef : null}>
              <label className="block text-[14px] font-semibold text-[#0D212C] mb-1">
                Technology Domain <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Select one or more technology domains relevant to your report.</p>
              <div 
                className={`w-full bg-white border rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors min-h-[46px] ${openDropdown === 'domain' ? 'border-gray-300 ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setOpenDropdown(openDropdown === 'domain' ? null : 'domain')}
              >
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {inputs.domains.length === 0 && (
                    <span className="text-[14px] text-gray-400 pl-1">Search technology domains</span>
                  )}
                  {inputs.domains.map(domain => (
                    <div key={domain} className="bg-gray-100 text-gray-700 text-[13px] px-2.5 py-1 rounded flex items-center gap-1.5">
                      {domain}
                      <button onClick={(e) => {e.stopPropagation(); handleDomainToggle(domain);}} className="text-gray-400 hover:text-gray-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
              </div>

              {openDropdown === 'domain' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-gray-100 relative">
                    <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search or type custom domain and press Enter..."
                      value={domainSearch}
                      onChange={(e) => setDomainSearch(e.target.value)}
                      onKeyDown={handleCustomDomainAdd}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full pl-9 pr-4 py-1.5 text-[13px] bg-white border border-gray-200 rounded focus:outline-none focus:border-gray-300"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1 custom-scrollbar">
                    {filteredDomainOptions.length > 0 ? filteredDomainOptions.map(option => {
                      const isSelected = inputs.domains.includes(option);
                      return (
                        <div 
                          key={option}
                          className="px-4 py-2 text-[13.5px] text-[#0D212C] hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                          onClick={() => handleDomainToggle(option)}
                        >
                          <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-gray-600 bg-gray-600' : 'border-gray-300'}`}>
                             {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                          {option}
                        </div>
                      );
                    }) : (
                      <div className="px-4 py-3 text-[13px] text-gray-500 text-center">Press Enter to add "{domainSearch}"</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Report Depth */}
            <div>
              <label className="block text-[14px] font-semibold text-[#0D212C] mb-1">
                Report Depth <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Choose the depth of analysis and expected report size.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Executive Summary', time: '10 – 15 mins', pages: '~20 pages' },
                  { title: 'Standard Analysis', time: '20 – 30 mins', pages: '~40 pages' },
                  { title: 'Deep Dive', time: '30 – 45 mins', pages: '~60 pages' }
                ].map(option => (
                  <div 
                    key={option.title}
                    onClick={() => setInputs({...inputs, depth: option.title})}
                    className={`border rounded-xl p-5 cursor-pointer transition-all ${inputs.depth === option.title ? 'border-[#36c0c9]/30 bg-[#f0f9fa] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${inputs.depth === option.title ? 'border-[#36c0c9]' : 'border-gray-300'}`}>
                        {inputs.depth === option.title && <div className="w-2.5 h-2.5 rounded-full bg-[#36c0c9]"></div>}
                      </div>
                      <span className="font-semibold text-[#0D212C] text-[15px]">{option.title}</span>
                    </div>
                    <div className="text-[13px] text-gray-500 pl-8 flex items-center gap-2">
                      {option.time} <span className="text-gray-300">|</span> {option.pages}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Lens */}
            <div className="relative" ref={openDropdown === 'focus' ? dropdownRef : null}>
              <label className="block text-[14px] font-semibold text-[#0D212C] mb-1">
                Focus Lens
              </label>
              <p className="text-xs text-gray-500 mb-3">Select the key areas you want the report to focus on.</p>
              <div 
                className={`w-full bg-white border rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors min-h-[46px] ${openDropdown === 'focus' ? 'border-gray-300 ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setOpenDropdown(openDropdown === 'focus' ? null : 'focus')}
              >
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {inputs.focusLens.length === 0 && (
                    <span className="text-[14px] text-gray-400 pl-1">Select focus areas</span>
                  )}
                  {inputs.focusLens.map(focus => (
                    <div key={focus} className="bg-gray-100 text-gray-700 text-[13px] px-2.5 py-1 rounded flex items-center gap-1.5">
                      {focus}
                      <button onClick={(e) => {e.stopPropagation(); handleFocusToggle(focus);}} className="text-gray-400 hover:text-gray-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
              </div>

              {openDropdown === 'focus' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
                    <input 
                      type="text" 
                      placeholder="Type custom focus and press Enter..."
                      value={customFocus}
                      onChange={(e) => setCustomFocus(e.target.value)}
                      onKeyDown={handleCustomFocusAdd}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-1.5 text-[13px] border border-gray-200 rounded focus:outline-none focus:border-gray-300 bg-white"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1 custom-scrollbar">
                    {focusOptions.map(option => {
                      const isSelected = inputs.focusLens.includes(option);
                      return (
                        <div 
                          key={option}
                          className="px-4 py-2 text-[13.5px] text-[#0D212C] hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                          onClick={() => handleFocusToggle(option)}
                        >
                          <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-gray-600 bg-gray-600' : 'border-gray-300'}`}>
                             {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Supporting Documents */}
            <div>
              <label className="block text-[14px] font-semibold text-[#0D212C] mb-1">
                Supporting Documents
              </label>
              <p className="text-xs text-gray-500 mb-3">Upload any documents that can help us tailor the report to your needs.</p>

              <div 
                className="border border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center py-8 hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                />
                <Upload className="w-6 h-6 text-gray-600 mb-3" strokeWidth={1.5} />
                <div className="text-[14px] text-[#0D212C] mb-1">
                  Drag and drop files here or <span className="font-semibold hover:underline">browse</span>
                </div>
                <div className="text-[12px] text-gray-500">
                  PDF, DOCX, PPT, XLSX &nbsp;•&nbsp; Max file size: 10 MB &nbsp;•&nbsp; Max 5 files
                </div>
              </div>
              
              {/* Display uploaded files */}
              {inputs.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {inputs.files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#36c0c9]" />
                        <span className="text-[13px] text-[#0D212C] font-medium">{file.name}</span>
                        <span className="text-[12px] text-gray-400">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Instructions */}
            <div>
              <label className="block text-[14px] font-semibold text-[#0D212C] mb-1">
                Additional Instructions
              </label>
              <p className="text-xs text-gray-500 mb-3">Add any specific instructions or preferences for your report.</p>
              
              <div className="relative">
                <textarea
                  value={inputs.additionalInstructions}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setInputs({...inputs, additionalInstructions: e.target.value});
                    }
                  }}
                  placeholder="Example: Prioritize government publications and Gartner reports. Focus on recent developments from the last 12 months."
                  className="w-full bg-white border border-gray-200 rounded-lg p-4 h-32 resize-none focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 text-[14px] placeholder-gray-400 custom-scrollbar"
                ></textarea>
                <div className="absolute bottom-3 right-4 text-xs text-gray-400">
                  {inputs.additionalInstructions.length}/500
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Action Bar (Only spans left pane) */}
      <div className="shrink-0 bg-white border-t border-gray-200 p-4 px-6 lg:px-10 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3 bg-[#f0f9fa] px-4 py-2.5 rounded-lg border border-[#36c0c9]/30">
          <Clock className="w-5 h-5 text-[#36c0c9]" />
          <div>
            <div className="text-[12px] font-semibold text-[#0D212C]">Estimated Runtime</div>
            <div className="text-[13px] text-[#36c0c9] font-medium">{getRuntime()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-[#0D212C] font-medium text-[14px] hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmAndGenerate}
            disabled={!isFormValid}
            className={`px-6 py-2.5 rounded-lg font-medium text-[14px] transition-colors flex items-center justify-center shadow-sm ${
              isFormValid 
                ? 'bg-[#06212E] text-white hover:bg-[#0a3549]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Right Persistent Review Pane - Spans Full Screen Height */}
      <div 
        className={`fixed top-0 right-0 h-screen border-l border-gray-200 bg-white transition-all duration-300 flex flex-col z-[60] shadow-sm ${
          isReviewPaneOpen ? 'w-[420px]' : 'w-0 border-l-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="w-[420px] h-full flex flex-col">
          {/* Header */}
          <div className="h-20 px-6 flex flex-col justify-center shrink-0">
            <h2 className="text-[20px] font-semibold font-['Poppins'] text-[#0D212C] mb-0.5">Review Scope</h2>
            <p className="text-[13px] text-gray-500">Review your selections before generating the report.</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col custom-scrollbar">
            
            {showEmptyState ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                  <FileSearch className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0D212C] mb-2">No selections yet</h3>
                <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-[250px]">
                  Fill in the required fields to generate a report summary for review before generating your report.
                </p>
              </div>
            ) : (
              <>
                {/* Dynamic Summary Card */}
                <div className="bg-cyan-50/40 border border-[#36c0c9]/20 rounded-xl p-5 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Your report will include analysis of {formatDomainsForSummary()} in <span className="font-semibold text-[#0D212C]">{inputs.geography || 'select a country'}</span>
                      {inputs.focusLens.length > 0 && (
                        <> with a specific focus on {formatFocusForSummary()}</>
                      )}.
                      <br/><br/>
                      The report will cover market trends, key players, competitor analysis, regulations, investment activity, and emerging opportunities.
                    </div>
                  </div>
                </div>

                {/* List Details */}
                <div className="space-y-0">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-500">
                      <LayoutList className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-[14px] text-gray-500">Tech Landscape</span>
                    </div>
                    <span className="font-medium text-[#0D212C] text-[14px]">{inputs.reportType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-[14px] text-gray-500">Geography</span>
                    </div>
                    <span className="font-medium text-[#0D212C] text-[14px] flex items-center gap-2">
                      {inputs.geography || '-'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-[14px] text-gray-500">Technology Domain</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 w-full">
                      {inputs.domains.length > 0 ? inputs.domains.map(d => (
                        <span key={d} className="px-2.5 py-1 bg-cyan-50/40 border border-[#36c0c9]/30 text-[#0E7C86] rounded-full text-[12px] font-medium leading-none">{d}</span>
                      )) : '-'}
                    </div>
                  </div>

                  {inputs.focusLens.length > 0 && (
                    <div className="flex flex-col gap-3 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-[14px] text-gray-500">Focus Lens</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 w-full">
                        {inputs.focusLens.map(f => (
                          <span key={f} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-[12px] font-medium leading-none">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Footer Info */}
          <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex gap-3 text-[13px] text-gray-500">
             <ShieldCheck className="w-5 h-5 shrink-0 text-gray-400" />
             <p className="leading-relaxed text-gray-500">You can review and edit the configuration anytime before the report is generated.</p>
          </div>
        </div>
      </div>

    </div>
  );
}