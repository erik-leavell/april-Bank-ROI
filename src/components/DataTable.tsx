import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: { label: string; values: string[]; bold?: boolean; highlight?: boolean }[];
  title?: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers, rows, title }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-gray-100" style={{ backgroundColor: '#475464' }}>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-2.5 font-semibold" style={{ color: '#475464' }}>
                {headers[0]}
              </th>
              {headers.slice(1).map((h, i) => (
                <th
                  key={i}
                  className="text-right px-4 py-2.5 font-semibold"
                  style={{ color: '#475464' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-50 ${row.highlight ? 'font-bold' : ''}`}
                style={{
                  backgroundColor: row.highlight
                    ? '#F7F5FB'
                    : idx % 2 === 1
                    ? '#FAFAFE'
                    : 'white',
                }}
              >
                <td
                  className={`px-4 py-2 ${row.bold ? 'font-semibold' : ''}`}
                  style={{ color: row.highlight ? '#5E00FF' : '#475464' }}
                >
                  {row.label}
                </td>
                {row.values.map((v, i) => {
                  const isNeg = v.startsWith('-');
                  return (
                    <td
                      key={i}
                      className={`text-right px-4 py-2 ${row.bold ? 'font-semibold' : ''}`}
                      style={{
                        color: row.highlight
                          ? '#5E00FF'
                          : isNeg
                          ? '#893326'
                          : '#1a1a2e',
                      }}
                    >
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
