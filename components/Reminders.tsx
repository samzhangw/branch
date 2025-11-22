import React from 'react';
import { IdCard, PenTool, Watch, Smartphone, TriangleAlert } from 'lucide-react';

export const Reminders: React.FC = () => {
  const tips = [
    {
      icon: <IdCard className="w-6 h-6 text-indigo-600" />,
      title: "必帶證件",
      desc: "身分證、健保卡、駕照等「正本」。(學生證無效)",
      color: "bg-indigo-50"
    },
    {
      icon: <PenTool className="w-6 h-6 text-pink-600" />,
      title: "文具準備",
      desc: "黑色原子筆、2B鉛筆、橡皮擦、修正帶、圓規、直尺。",
      color: "bg-pink-50"
    },
    {
      icon: <Watch className="w-6 h-6 text-amber-600" />,
      title: "手錶規定",
      desc: "僅限指針式手錶，嚴禁電子錶、智慧手錶，不得發出聲響。",
      color: "bg-amber-50"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-rose-500" />,
      title: "電子產品",
      desc: "手機務必「完全關機」(含鬧鐘)，放置於臨時置物區。",
      color: "bg-rose-50"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-1">
      <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
        <div className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white">
          <TriangleAlert className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">
          應考貼心提醒
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-14 h-14 rounded-2xl ${tip.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {tip.icon}
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">{tip.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium opacity-90">{tip.desc}</p>
            
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/0 to-white/40 rounded-tr-3xl rounded-bl-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </div>
  );
};