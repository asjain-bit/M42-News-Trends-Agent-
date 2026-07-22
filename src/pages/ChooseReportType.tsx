import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REPORT_TYPES } from '../config/reportTypes';
import { Lock, Paperclip, Send, BarChart3, Activity, User, Sparkles, Mic, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChooseReportType() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const handleSelect = (id: string, status: string) => {
    if (status === 'active') {
      navigate(`/new/tech`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  const suggestedPrompts = [
    "AI Landscape in UAE",
    "Banking Technology in Saudi Arabia",
    "Healthcare AI Trends",
    "FinTech Investment Landscape",
    "Semiconductor Market Analysis"
  ];

  return (
    <div className="w-full mx-auto px-6 lg:px-10 py-10 h-[calc(100vh-80px)] flex flex-col">
      
      <div className="mb-10">
        <h1 className="text-[24px] font-semibold font-['Poppins'] text-[#0D212C] mb-1 tracking-tight">Create a new intelligence report</h1>
        <p className="text-gray-500 text-[15px]">Choose a report type and describe what you want to research.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
      >
        {/* Tech Landscape */}
        <motion.div
          variants={item}
          onClick={() => handleSelect(REPORT_TYPES.techLandscape.id, REPORT_TYPES.techLandscape.status)}
          className={`relative p-6 rounded-[20px] border transition-all flex flex-col cursor-pointer bg-white border-[#36c0c9]/30 shadow-sm hover:shadow-md hover:bg-cyan-50/40 hover:border-[#36c0c9]/60 min-h-[260px]`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-[#0D212C]">
                <BarChart3 className="w-6 h-6" strokeWidth={2} />
              </div>
              <h2 className="text-[18px] font-semibold font-['Poppins'] text-[#0D212C]">
                Tech Landscape
              </h2>
            </div>
            <div className="bg-emerald-50 text-emerald-600 text-[11px] font-medium px-2.5 py-1 rounded-full border border-emerald-200/50 capitalize tracking-wide mt-2 whitespace-nowrap">
              Available
            </div>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            Technology market analysis for a selected country, covering trends, competitors, investments, and regulations.
          </p>

          <div className="flex items-center gap-2 text-[#36c0c9] font-semibold text-sm mt-auto">
            Start Report <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Healthcare Country */}
        <motion.div
          variants={item}
          className="relative p-6 rounded-[20px] border border-gray-200 flex flex-col bg-gray-50 shadow-sm opacity-90 cursor-not-allowed min-h-[260px]"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-gray-400">
                <Activity className="w-6 h-6" strokeWidth={2} />
              </div>
              <h2 className="text-[18px] font-semibold font-['Poppins'] text-gray-400">
                Healthcare Country
              </h2>
            </div>
            <div className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200/60 capitalize tracking-wide mt-2 whitespace-nowrap">
              Coming Soon
            </div>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            Healthcare ecosystem analysis covering providers, policies, investments, and market trends.
          </p>

          <div className="flex items-center gap-2 text-gray-400 font-medium text-sm mt-auto">
            <Lock className="w-3.5 h-3.5" /> Coming soon
          </div>
        </motion.div>

        {/* Personality */}
        <motion.div
          variants={item}
          className="relative p-6 rounded-[20px] border border-gray-200 flex flex-col bg-gray-50 shadow-sm opacity-90 cursor-not-allowed min-h-[260px]"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-gray-400">
                <User className="w-6 h-6" strokeWidth={2} />
              </div>
              <h2 className="text-[18px] font-semibold font-['Poppins'] text-gray-400">
                Personality
              </h2>
            </div>
            <div className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200/60 capitalize tracking-wide mt-2 whitespace-nowrap">
              Coming Soon
            </div>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            AI-generated profile of a person with background, influence, and recent developments.
          </p>

          <div className="flex items-center gap-2 text-gray-400 font-medium text-sm mt-auto">
            <Lock className="w-3.5 h-3.5" /> Coming soon
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}