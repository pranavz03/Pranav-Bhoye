
import React from 'react';
import { PredictionData } from '../types';

interface HistoryTableProps {
  history: PredictionData[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  const getColorDot = (color: PredictionData['color']) => {
    switch (color) {
      case 'Green': return 'bg-green-500';
      case 'Red': return 'bg-red-500';
      case 'Violet': return 'bg-purple-500';
      case 'Red+Violet': return 'bg-gradient-to-r from-red-500 to-purple-500';
      case 'Green+Violet': return 'bg-gradient-to-r from-green-500 to-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNumberColor = (color: PredictionData['color']) => {
     if (color.includes('Green')) return 'text-green-500';
     if (color.includes('Red')) return 'text-red-500';
     return 'text-white';
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-[#333]">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2 flex justify-between items-center">
        <span className="font-bold text-sm tracking-widest uppercase">Hack Winning Log</span>
        <div className="flex gap-2 text-[10px] font-bold">
           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> GREEN</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> RED</span>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase text-gray-500 border-b border-[#333]">
              <th className="px-4 py-3 font-semibold">Period ID</th>
              <th className="px-4 py-3 font-semibold">Number</th>
              <th className="px-4 py-3 font-semibold">Size</th>
              <th className="px-4 py-3 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {history.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#252525] transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-400">{row.period}</td>
                <td className={`px-4 py-3 text-lg font-black ${getNumberColor(row.color)}`}>{row.number}</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-200">{row.size}</td>
                <td className="px-4 py-3">
                  <div className={`w-3 h-3 rounded-full ${getColorDot(row.color)} shadow-lg shadow-black/50`}></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
