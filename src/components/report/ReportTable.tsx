import React from 'react';

interface ReportTableProps {
  data: {
    title: string;
    columns: Array<{ key: string; label: string }>;
    rows: Array<any>;
  };
}

export const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
  return (
    <div className="my-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-bold text-[#0D212C]">{data.title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {data.columns.map((col, idx) => (
                <th key={col.key} className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${idx === 0 ? 'rounded-tl-none' : ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50/50 transition-colors">
                {data.columns.map((col, colIdx) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {col.key === 'risk' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.badgeColor === 'red' ? 'bg-red-100 text-red-800' :
                        row.badgeColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        row.badgeColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {row[col.key]}
                      </span>
                    ) : colIdx === 0 ? (
                      <span className="font-medium text-[#0D212C]">{row[col.key]}</span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
