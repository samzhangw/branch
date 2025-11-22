import React from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';

interface ExamScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamScheduleModal: React.FC<ExamScheduleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-custom-fade" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-custom-zoom">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">115學年度分科測驗日程表</h3>
            <p className="text-sm text-slate-500 mt-1">考試日期：115年7月11日(五) ~ 7月12日(六)</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-0">
          {/* Horizontal scroll wrapper for small screens */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-50/50 text-indigo-900 border-b border-indigo-100">
                    <th className="py-4 px-6 font-bold w-40 text-center border-r border-indigo-100">時間</th>
                    <th className="py-4 px-6 font-bold text-center border-r border-indigo-100 w-48">
                      7月11日 <br/>
                      <span className="text-xs font-normal opacity-80">(星期六)</span>
                    </th>
                    <th className="py-4 px-6 font-bold text-center border-r border-indigo-100 w-48">
                      7月12日 <br/>
                      <span className="text-xs font-normal opacity-80">(星期日)</span>
                    </th>
                    <th className="py-4 px-6 font-bold text-center w-48">備註</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-sm">
                  {/* Morning Session 1 */}
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <td className="py-2 px-6 text-center font-mono text-slate-500 border-r border-slate-200">08:35</td>
                    <td colSpan={3} className="py-2 px-6 text-slate-500 text-center italic">
                      預備鈴響（持應試有效證件正本入場）
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-center font-bold border-r border-slate-200">
                      08:40 <br/> ~ <br/> 10:00
                    </td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">物理</td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">歷史</td>
                    <td className="py-4 px-6 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 09:00 截止入場</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 09:40 始可離場</div>
                    </td>
                  </tr>

                  {/* Morning Session 2 */}
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <td className="py-2 px-6 text-center font-mono text-slate-500 border-r border-slate-200">10:45</td>
                    <td colSpan={3} className="py-2 px-6 text-slate-500 text-center italic">
                      預備鈴響（持應試有效證件正本入場）
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-center font-bold border-r border-slate-200">
                      10:50 <br/> ~ <br/> 12:10
                    </td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">化學</td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">地理</td>
                    <td className="py-4 px-6 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 11:10 截止入場</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 11:50 始可離場</div>
                    </td>
                  </tr>

                  {/* Afternoon Session 1 */}
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <td className="py-2 px-6 text-center font-mono text-slate-500 border-r border-slate-200">13:55</td>
                    <td colSpan={3} className="py-2 px-6 text-slate-500 text-center italic">
                      預備鈴響（持應試有效證件正本入場）
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-center font-bold border-r border-slate-200">
                      14:00 <br/> ~ <br/> 15:20
                    </td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">數學甲</td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">數學乙</td>
                    <td className="py-4 px-6 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 14:20 截止入場</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 15:00 始可離場</div>
                    </td>
                  </tr>

                  {/* Afternoon Session 2 */}
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <td className="py-2 px-6 text-center font-mono text-slate-500 border-r border-slate-200">16:05</td>
                    <td colSpan={3} className="py-2 px-6 text-slate-500 text-center italic">
                      預備鈴響（持應試有效證件正本入場）
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-center font-bold border-r border-slate-200">
                      16:10 <br/> ~ <br/> 17:30
                    </td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">生物</td>
                    <td className="py-4 px-6 text-center text-lg font-bold text-indigo-600 border-r border-slate-200">公民與社會</td>
                    <td className="py-4 px-6 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 16:30 截止入場</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> 17:10 始可離場</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-start gap-3">
           <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
           <div className="text-xs text-slate-600 space-y-1">
              <p>1. 考試時間為80分鐘。</p>
              <p>2. 考試開始20分鐘後不得入場。</p>
              <p>3. 考試開始60分鐘內不得離場。</p>
              <p className="text-slate-400">資料來源：參考歷年簡章時程，請以115學年度正式簡章為準。</p>
           </div>
        </div>
      </div>
    </div>
  );
};