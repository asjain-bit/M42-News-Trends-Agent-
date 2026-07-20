import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REPORT_TYPES } from '../config/reportTypes';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReportInputs } from '../services/storageService';

export default function BuildRequest() {
  const navigate = useNavigate();
  const config = REPORT_TYPES['techLandscape'];
  
  const [inputs, setInputs] = useState<ReportInputs>({
    prompt: '',
    country: '',
    techDomain: '',
    depth: '',
    focusLens: ''
  });

  const isFilled = (field: keyof ReportInputs) => (inputs[field] || '').trim().length > 0;
  
  const missingRequired = config.required.filter(
    (field) => !isFilled(field as keyof ReportInputs)
  );
  
  const canSubmit = missingRequired.length === 0;

  const handleContinue = () => {
    if (canSubmit) {
      // Pass inputs to the review screen via state
      navigate('/new/tech/review', { state: { inputs } });
    }
  };

  const getLabel = (field: string) => {
    const labels: Record<string, string> = {
      country: 'Country',
      techDomain: 'Technology Domain',
      depth: 'Depth',
      focusLens: 'Focus Lens (Optional)'
    };
    return labels[field] || field;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[var(--color-primary-soft)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Tech Landscape
        </div>
        <h1 className="text-3xl font-bold font-['Poppins'] text-[var(--color-ink)] mb-2">Build your request</h1>
        <p className="text-[var(--color-ink-muted)]">Describe what you need, and provide the required parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Natural Language Prompt */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
            <label className="block font-semibold text-[var(--color-ink)] font-['Poppins'] mb-2">
              Natural Language Prompt
            </label>
            <p className="text-sm text-[var(--color-ink-muted)] mb-4">
              Describe your objective in plain English. Example: "HealthTech landscape for UAE, focus regulatory + investment."
            </p>
              <textarea 
                value={inputs.prompt}
                onChange={(e) => setInputs({ ...inputs, prompt: e.target.value })}
                placeholder="Start typing..."
                className="w-full bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink-muted)] focus:border-transparent resize-none transition-all"
              />
            </div>
  
            {/* Structured Inputs */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-[var(--color-ink)] font-['Poppins'] mb-6">Required Parameters</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">
                    Country <span className="text-[var(--color-ink-muted)]">*</span>
                  </label>
                  <input 
                    type="text"
                    value={inputs.country}
                    onChange={(e) => setInputs({ ...inputs, country: e.target.value })}
                    placeholder="e.g. UAE, Saudi Arabia, UK"
                    className="w-full bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink-muted)] transition-all"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">
                    Technology Domain <span className="text-[var(--color-ink-muted)]">*</span>
                  </label>
                  <input 
                    type="text"
                    value={inputs.techDomain}
                    onChange={(e) => setInputs({ ...inputs, techDomain: e.target.value })}
                    placeholder="e.g. HealthTech, AI, Cyber Security"
                    className="w-full bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink-muted)] transition-all"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">
                    Depth <span className="text-[var(--color-ink-muted)]">*</span>
                  </label>
                  <select 
                    value={inputs.depth}
                    onChange={(e) => setInputs({ ...inputs, depth: e.target.value })}
                    className="w-full bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink-muted)] transition-all appearance-none"
                  >
                    <option value="" disabled>Select depth...</option>
                    {config.depths?.map(depth => (
                      <option key={depth} value={depth}>{depth}</option>
                    ))}
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">
                    Focus Lens (Optional)
                  </label>
                  <input 
                    type="text"
                    value={inputs.focusLens}
                    onChange={(e) => setInputs({ ...inputs, focusLens: e.target.value })}
                    placeholder="e.g. Regulatory, Investment"
                    className="w-full bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-ink-muted)] transition-all"
                  />
                </div>
              </div>
          </div>
        </div>

        {/* Live Checklist */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[var(--color-ink)] font-['Poppins'] mb-4">Requirements</h3>
            
            <ul className="space-y-3 mb-6">
              {config.required.map(field => {
                const filled = isFilled(field as keyof ReportInputs);
                return (
                  <motion.li 
                    key={field} 
                    className="flex items-center gap-3 text-sm"
                    animate={{ color: filled ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}
                  >
                    {filled ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
                      </motion.div>
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--color-border)]" />
                    )}
                    <span className={filled ? 'font-medium' : ''}>{getLabel(field)}</span>
                  </motion.li>
                );
              })}
            </ul>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <button
                onClick={handleContinue}
                disabled={!canSubmit}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  canSubmit 
                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] shadow-md hover:shadow-lg' 
                    : 'bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] opacity-70 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
              
              {!canSubmit && (
                <p className="text-xs text-[var(--color-accent)] mt-3 text-center">
                  Fill all required fields to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}