import React from 'react';
import { ReportBlock } from './types';
import { Target } from 'lucide-react';
import { ReportChart } from './ReportChart';
import { ReportKPIs } from './ReportKPIs';
import { ReportCallout } from './ReportCallout';
import { ReportMatrix } from './ReportMatrix';
import { ReportTable } from './ReportTable';

interface ReportRendererProps {
  blocks: ReportBlock[];
  isWordDocument?: boolean;
}

export const ReportRenderer: React.FC<ReportRendererProps> = ({ blocks, isWordDocument }) => {
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
                return <ReportKPIs data={block.data} isWordDocument={isWordDocument} />;
              case 'chart':
                if (isWordDocument) {
                  const chartConfig = {
                    type: 'bar',
                    data: {
                      labels: block.data.data.map((d: any) => d.name),
                      datasets: [{
                        label: 'Value',
                        data: block.data.data.map((d: any) => d.value),
                        backgroundColor: '#36c0c9',
                        borderRadius: 4
                      }]
                    },
                    options: {
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { display: false } },
                        y: { grid: { borderDash: [2, 2], color: '#f0f0f0' } }
                      }
                    }
                  };
                  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=800&h=400&bkg=white`;
                  return (
                    <div className="my-8">
                      <h3 className="text-xl font-bold text-[#0D212C] mb-2">{block.data.title}</h3>
                      <p className="text-gray-500 mb-6">{block.data.description}</p>
                      <div className="w-full flex justify-center">
                        <img src={chartUrl} alt="Chart" className="max-w-full h-auto" />
                      </div>
                    </div>
                  );
                }
                return <ReportChart data={block.data} />;
              case 'callout':
                return <ReportCallout data={block.data} isWordDocument={isWordDocument} />;
              case 'swot':
                return <ReportMatrix data={block.data} isWordDocument={isWordDocument} />;
              case 'table':
                return <ReportTable data={block.data} isWordDocument={isWordDocument} />;
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
                const sources = block.data.sources || (block.data.icons || []).map((icon: string) => {
                  try {
                    const url = new URL(icon);
                    const domain = url.searchParams.get('domain') || 'Source';
                    return { name: domain.replace('.com', ''), icon, url: `https://${domain}` };
                  } catch {
                    return { name: 'Source', icon, url: '#' };
                  }
                });
                
                if (isWordDocument) {
                  return (
                    <div className="flex flex-col gap-2 mt-8 pt-5 border-t border-gray-100">
                      <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Sources</span>
                      <ul className="list-disc pl-5">
                        {sources.map((source: any, i: number) => (
                          <li key={i} className="text-[14px] text-gray-600 mb-1">
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#36c0c9] hover:underline break-all">{source.url}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-3 my-6 pt-6 border-t border-gray-100">
                    <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      Sources
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {sources.map((source: any, i: number) => (
                          <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                             <img src={source.icon} alt={source.name} className="w-4 h-4 object-contain" />
                             <span className="text-sm font-medium text-gray-700">{source.name}</span>
                          </a>
                        ))}
                    </div>
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
              case 'key-takeaways':
                if (isWordDocument) {
                  return (
                    <div className="my-8 border border-gray-300 p-6">
                      <h3 className="text-xl font-bold mb-6 text-black">Key Takeaways</h3>
                      <ul className="space-y-4">
                        {block.data.items.map((item: string, idx: number) => (
                          <li key={idx} className="flex gap-4">
                            <span className="font-bold mt-0.5">•</span>
                            <span className="text-gray-800 leading-relaxed text-[15px]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return (
                  <div className="my-8 bg-[#0D212C] text-white rounded-2xl p-8 shadow-md">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#36c0c9]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Key Takeaways
                    </h3>
                    <ul className="space-y-4">
                      {block.data.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-4">
                          <span className="text-[#36c0c9] font-bold mt-0.5">•</span>
                          <span className="text-gray-100 leading-relaxed text-[15px]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              case 'recommendation':
                if (isWordDocument) {
                  return (
                    <div className="my-8 border border-gray-300 p-6">
                      <div className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Priority: {block.data.priority} | Timeline: {block.data.timeline}</div>
                      <h3 className="text-xl font-bold text-[#0D212C] mb-3">{block.data.title}</h3>
                      <p className="text-gray-600 mb-6">{block.data.description}</p>
                      <div className="border border-gray-200 p-4 mt-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Expected Business Impact</span>
                        <p className="text-[#0D212C] font-medium">{block.data.impact}</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="my-8 border-2 border-[#36c0c9] rounded-2xl p-8 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#36c0c9]/10 rounded-bl-full pointer-events-none" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-[#36c0c9] p-2 rounded-lg text-white">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="px-3 py-1 bg-[#36c0c9]/10 text-[#36c0c9] text-xs font-bold uppercase tracking-wider rounded-full">{block.data.priority} Priority</span>
                        <span className="text-sm text-gray-500 font-medium ml-3">{block.data.timeline}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#0D212C] mb-3">{block.data.title}</h3>
                    <p className="text-gray-600 mb-6">{block.data.description}</p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Expected Business Impact</span>
                      <p className="text-[#0D212C] font-medium">{block.data.impact}</p>
                    </div>
                  </div>
                );
              case 'highlight-box':
                if (isWordDocument) {
                  return (
                    <div className="my-8 border border-gray-300 p-6">
                      <span className="text-gray-700 text-sm font-bold uppercase tracking-wider mb-2 block">{block.data.label}</span>
                      <h4 className="text-lg font-bold text-[#0D212C] mb-2">{block.data.title}</h4>
                      <p className="text-gray-700 leading-relaxed">{block.data.content}</p>
                    </div>
                  );
                }
                return (
                  <div className="my-8 bg-gradient-to-br from-[#f8fbfa] to-white border border-[#e2ecea] rounded-2xl p-8 shadow-sm">
                    <span className="text-[#36c0c9] text-xs font-bold uppercase tracking-wider mb-2 block">{block.data.label}</span>
                    <h4 className="text-lg font-bold text-[#0D212C] mb-2">{block.data.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{block.data.content}</p>
                  </div>
                );
              case 'timeline':
                if (isWordDocument) {
                  return (
                    <div className="my-8 space-y-6">
                      {block.data.events.map((event: any, idx: number) => (
                        <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                          <span className="text-sm font-bold text-gray-700 mb-1 block">Date: {event.date}</span>
                          <h4 className="text-lg font-bold text-[#0D212C] mb-2">{event.title}</h4>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <div className="my-8 relative pl-8 border-l-2 border-gray-100 space-y-8">
                    {block.data.events.map((event: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-white border-4 border-[#36c0c9]" />
                        <span className="text-sm font-bold text-[#36c0c9] mb-1 block">{event.date}</span>
                        <h4 className="text-lg font-bold text-[#0D212C] mb-2">{event.title}</h4>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    ))}
                  </div>
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
