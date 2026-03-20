import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: { label: string; values: string[]; bold?: boolean; highlight?: boolean }[];
  title?: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers, rows, title }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 py-3" style={{ backgroundColor: '#1A2040' }}>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid #EAEBED' }}>
              <th className="text-left px-4 py-2.5 font-semibold" style={{ color: '#1A2040' }}>
                {headers[0]}
              </th>
              {headers.slice(1).map((h, i) => (
                <th
                  key={i}
                  className="text-right px-4 py-2.5 font-semibold"
                  style={{ color: '#1A2040' }}
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
                className={row.highlight ? 'font-bold' : ''}
                style={{
                  backgroundColor: row.highlight
                    ? 'rgba(94, 0, 255, 0.06)'
                    : idx % 2 === 1
                    ? '#F5F5F7'
                    : 'white',
                  borderBottom: '1px solid #EAEBED',
                }}
              >
                <td
                  className={`px-4 py-2 ${row.bold ? 'font-semibold' : ''}`}
                  style={{ color: row.highlight ? '#5E00FF' : '#1A2040' }}
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
                          ? '#3A3B4D'
                          : '#1A2040',
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
