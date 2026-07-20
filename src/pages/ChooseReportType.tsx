import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REPORT_TYPES } from '../config/reportTypes';
import { Lock, Paperclip, Send, BarChart3, HeartPulse, User, CheckCircle2, Sparkles, Mic, ArrowRight } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 h-[calc(100vh-80px)] flex flex-col">
      
      <div className="mb-10">
        <h1 className="text-[32px] font-semibold font-['Poppins'] text-[#0D212C] mb-1 tracking-tight">Create a new intelligence report</h1>
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
          className={`relative p-6 rounded-[20px] border transition-all flex flex-col cursor-pointer bg-white border-[#36c0c9] shadow-sm hover:shadow-md hover:border-[#36c0c9] min-h-[260px]`}
        >
          <div className="absolute top-4 right-4 text-[#36c0c9]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#e0f5f6] text-[#36c0c9]">
              <BarChart3 className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="bg-emerald-50 text-emerald-600 text-[11px] font-medium px-2.5 py-1 rounded-full capitalize tracking-wide">
              Available
            </div>
          </div>
          
          <h2 className="text-[18px] font-semibold font-['Poppins'] text-[#0D212C] mb-2">
            Tech Landscape
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            Market & technology landscape for a country + domain — players, funding, gaps and the "why".
          </p>

          <div className="flex items-center gap-2 text-[#36c0c9] font-semibold text-sm mt-auto">
            Start Report <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Healthcare Country */}
        <motion.div
          variants={item}
          className="relative p-6 rounded-[20px] border border-gray-100 transition-all flex flex-col bg-white shadow-sm opacity-90 cursor-not-allowed hover:border-[#36c0c9] hover:shadow-md min-h-[260px]"
        >
          <div className="absolute top-4 right-4 text-gray-400">
            <Lock className="w-4 h-4" strokeWidth={2} />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-500">
              <HeartPulse className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full capitalize tracking-wide">
              Coming Soon
            </div>
          </div>
          
          <h2 className="text-[18px] font-semibold font-['Poppins'] text-[#0D212C] mb-2">
            Healthcare Country
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            Healthcare landscape for a country — system, key players, policies, and investment outlook.
          </p>

          <div className="flex items-center gap-2 text-gray-400 font-semibold text-sm mt-auto">
            <Lock className="w-3.5 h-3.5" /> Not available yet
          </div>
        </motion.div>

        {/* Personality */}
        <motion.div
          variants={item}
          className="relative p-6 rounded-[20px] border border-gray-100 transition-all flex flex-col bg-white shadow-sm opacity-90 cursor-not-allowed hover:border-[#36c0c9] hover:shadow-md min-h-[260px]"
        >
          <div className="absolute top-4 right-4 text-gray-400">
            <Lock className="w-4 h-4" strokeWidth={2} />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-500">
              <User className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full capitalize tracking-wide">
              Coming Soon
            </div>
          </div>
          
          <h2 className="text-[18px] font-semibold font-['Poppins'] text-[#0D212C] mb-2">
            Personality
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            Meeting-prep profile of a named person — background, influence, and recent developments.
          </p>

          <div className="flex items-center gap-2 text-gray-400 font-semibold text-sm mt-auto">
            <Lock className="w-3.5 h-3.5" /> Not available yet
          </div>
        </motion.div>
      </motion.div>

      {/* Spacer to push prompts to bottom */}
      <div className="flex-1"></div>

      {/* Suggested Prompts & Box at the bottom */}
      <div className="mt-auto w-full pb-5">
        {/* Suggested Prompts */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((promptText, idx) => (
              <button 
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-[#36c0c9] hover:bg-[#f0f9fa] transition-colors text-sm text-gray-700 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-gray-500" />
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Box */}
        <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm focus-within:border-[#36c0c9] focus-within:shadow-md transition-all flex flex-col p-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the market, technology, country, industry or business challenge you want to research."
            className="w-full bg-transparent px-4 pt-4 min-h-[90px] resize-none outline-none text-gray-800 placeholder-gray-400 text-[15px]"
          />
          <div className="flex items-center justify-between p-2 mt-1">
            <button className="p-2 text-gray-500 hover:text-[#36c0c9] hover:bg-gray-50 rounded-xl flex items-center justify-center transition-colors" title="Attach file">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Use Microphone">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                disabled={!prompt.trim()}
                className="w-10 h-10 bg-[#0D212C] text-white rounded-full flex items-center justify-center transition-colors shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#153443] disabled:hover:bg-[#0D212C]" 
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}