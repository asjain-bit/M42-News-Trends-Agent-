import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportKPIsProps {
  data: {
    kpis: Array<{
      label: string;
      value: string;
      trend?: 'up' | 'down';
      change?: string;
    }>;
  };
}

export const ReportKPIs: React.FC<ReportKPIsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      {data.kpis.map((kpi, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 line-clamp-2">
            {kpi.label}
          </div>
          <div className="flex items-end justify-between mt-4">
            <div className="text-3xl font-bold text-[#0D212C]">
              {kpi.value}
            </div>
            {kpi.trend && (
              <div className={`flex items-center text-sm font-medium \${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {kpi.change}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
