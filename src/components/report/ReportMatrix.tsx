import React from 'react';
import { ShieldCheck, ShieldAlert, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportMatrixProps {
  data: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export const ReportMatrix: React.FC<ReportMatrixProps> = ({ data }) => {
  return (
    <div className="my-10">
      <h3 className="text-xl font-bold text-[#0D212C] mb-6 text-center">SWOT Analysis Matrix</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-green-50 rounded-2xl p-6 border border-green-100"
        >
          <div className="flex items-center gap-2 mb-4 text-green-700">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="font-bold text-lg">Strengths</h4>
          </div>
          <ul className="space-y-3">
            {data.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-green-900">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-orange-50 rounded-2xl p-6 border border-orange-100"
        >
          <div className="flex items-center gap-2 mb-4 text-orange-700">
            <ShieldAlert className="w-5 h-5" />
            <h4 className="font-bold text-lg">Weaknesses</h4>
          </div>
          <ul className="space-y-3">
            {data.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-orange-900">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Opportunities */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-blue-50 rounded-2xl p-6 border border-blue-100"
        >
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <TrendingUp className="w-5 h-5" />
            <h4 className="font-bold text-lg">Opportunities</h4>
          </div>
          <ul className="space-y-3">
            {data.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-blue-900">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Threats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-red-50 rounded-2xl p-6 border border-red-100"
        >
          <div className="flex items-center gap-2 mb-4 text-red-700">
            <Zap className="w-5 h-5" />
            <h4 className="font-bold text-lg">Threats</h4>
          </div>
          <ul className="space-y-3">
            {data.threats.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-red-900">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
