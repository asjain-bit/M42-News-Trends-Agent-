import React from 'react';
import { ReportBlock } from './types';
import { ReportChart } from './ReportChart';
import { ReportKPIs } from './ReportKPIs';
import { ReportCallout } from './ReportCallout';
import { ReportMatrix } from './ReportMatrix';
import { ReportTable } from './ReportTable';

interface ReportRendererProps {
  blocks: ReportBlock[];
}

export const ReportRenderer: React.FC<ReportRendererProps> = ({ blocks }) => {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <div key={block.id} className="commentable-block" data-block-id={block.id}>
          {(() => {
            switch (block.type) {
              case 'text':
                return (
                  <div className="space-y-4 text-gray-700 leading-relaxed text-[15px] md:text-base">
                    {block.data.paragraphs.map((p: string, idx: number) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                );
              case 'kpi-grid':
                return <ReportKPIs data={block.data} />;
              case 'chart':
                return <ReportChart data={block.data} />;
              case 'callout':
                return <ReportCallout data={block.data} />;
              case 'swot':
                return <ReportMatrix data={block.data} />;
              case 'table':
                return <ReportTable data={block.data} />;
              case 'image':
                return (
                  <div className="my-8">
                    <img 
                      src={block.data.src} 
                      alt={block.data.alt} 
                      className="w-full rounded-2xl shadow-sm object-cover max-h-[500px]"
                    />
                    {block.data.caption && (
                      <p className="text-sm text-gray-500 mt-3 text-center italic">{block.data.caption}</p>
                    )}
                  </div>
                );
              case 'sources-list':
                return (
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                     <span className="text-[13px] font-medium text-gray-500">Sources:</span>
                     <div className="flex -space-x-2">
                       {block.data.icons.map((icon: string, i: number) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden">
                             <img src={icon} alt="source" className="w-4 h-4 object-contain" />
                          </div>
                       ))}
                     </div>
                     <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px] font-medium">+{block.data.moreCount} more</span>
                  </div>
                );
              case 'quote':
                return (
                  <blockquote className="my-10 border-l-4 border-[#36c0c9] pl-6 py-2">
                    <p className="text-xl md:text-2xl font-light text-gray-900 leading-snug italic">"{block.data.quote}"</p>
                    <footer className="mt-4">
                      <strong className="text-[#0D212C] font-semibold">{block.data.author}</strong>
                      <span className="text-gray-500 text-sm ml-2">— {block.data.role}</span>
                    </footer>
                  </blockquote>
                );
              default:
                console.warn(`Unsupported block type: ${block.type}`);
                return null;
            }
          })()}
        </div>
      ))}
    </div>
  );
};
