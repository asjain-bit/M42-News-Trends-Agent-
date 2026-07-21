import React from 'react';
import { AlertCircle, Lightbulb, Target, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportCalloutProps {
  data: {
    calloutType: string; // 'Key Finding', 'Strategic Recommendation', 'Business Impact', 'Watch Out', 'Market Opportunity'
    title: string;
    content: string;
  };
}

export const ReportCallout: React.FC<ReportCalloutProps> = ({ data }) => {
  if (data.calloutType === 'Sources') {
    return (
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
         <span className="text-[13px] font-medium text-gray-500">Sources:</span>
         <div className="flex -space-x-2">
           {['https://www.google.com/s2/favicons?domain=ft.com&sz=128', 'https://www.google.com/s2/favicons?domain=gartner.com&sz=128', 'https://www.google.com/s2/favicons?domain=bloomberg.com&sz=128'].map((icon: string, i: number) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden">
                 <img src={icon} alt="source" className="w-4 h-4 object-contain" />
              </div>
           ))}
         </div>
         <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px] font-medium">+3 more</span>
      </div>
    );
  }

  const getStyle = () => {
    switch (data.calloutType) {
      case 'Key Finding':
      case 'Business Impact':
        return {
          wrapper: 'bg-blue-50 border-blue-200',
          iconContainer: 'bg-blue-100 text-blue-600',
          title: 'text-blue-900',
          icon: <Lightbulb className="w-5 h-5" />
        };
      case 'Strategic Recommendation':
      case 'Market Opportunity':
        return {
          wrapper: 'bg-[#F2FBFC] border-[#bcecf0]',
          iconContainer: 'bg-[#36c0c9]/20 text-[#36c0c9]',
          title: 'text-[#0D212C]',
          icon: <Target className="w-5 h-5" />
        };
      case 'Watch Out':
      case 'Risk':
        return {
          wrapper: 'bg-orange-50 border-orange-200',
          iconContainer: 'bg-orange-100 text-orange-600',
          title: 'text-orange-900',
          icon: <AlertTriangle className="w-5 h-5" />
        };
      default:
        return {
          wrapper: 'bg-gray-50 border-gray-200',
          iconContainer: 'bg-gray-200 text-gray-600',
          title: 'text-gray-900',
          icon: <Info className="w-5 h-5" />
        };
    }
  };

  const style = getStyle();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`my-8 p-6 rounded-2xl border ${style.wrapper} flex flex-col sm:flex-row gap-5 items-start shadow-sm`}
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${style.iconContainer}`}>
        {style.icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
          {data.calloutType}
        </div>
        <h4 className={`text-lg font-bold mb-2 ${style.title}`}>
          {data.title}
        </h4>
        <p className="text-gray-700 leading-relaxed text-[15px]">
          {data.content}
        </p>
      </div>
    </motion.div>
  );
};
