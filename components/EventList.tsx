import React from 'react';
import { ScheduleEvent, EventType } from '../types';
import { Calendar, Clock, CheckCircle2, MapPin, FileText, Award, ChevronDown } from 'lucide-react';

interface EventListProps {
  events: ScheduleEvent[];
  currentDate: Date;
}

const getTypeIcon = (type: EventType) => {
  switch (type) {
    case EventType.EXAM: return <Award className="w-5 h-5 text-red-500" />;
    case EventType.REGISTRATION: return <FileText className="w-5 h-5 text-blue-500" />;
    case EventType.QUERY: return <MapPin className="w-5 h-5 text-purple-500" />;
    case EventType.RESULTS: return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    default: return <Calendar className="w-5 h-5 text-slate-500" />;
  }
};

const getTypeColor = (type: EventType) => {
  switch (type) {
    case EventType.EXAM: return "bg-red-100 text-red-700";
    case EventType.REGISTRATION: return "bg-blue-100 text-blue-700";
    case EventType.QUERY: return "bg-purple-100 text-purple-700";
    case EventType.RESULTS: return "bg-green-100 text-green-700";
    case EventType.ADMISSION: return "bg-amber-100 text-amber-700";
    default: return "bg-slate-100 text-slate-700";
  }
};

export const EventList: React.FC<EventListProps> = ({ events, currentDate }) => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
           <Calendar className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">重要日程表</h2>
      </div>

      <div className="relative pl-8 md:pl-0">
        {/* Timeline Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-slate-200 -translate-x-1/2 hidden md:block"></div>
        <div className="absolute left-0 top-4 bottom-4 w-px bg-slate-200 md:hidden"></div>

        <div className="space-y-8">
          {sortedEvents.map((event, index) => {
            const isPast = event.endDate ? event.endDate < currentDate : event.startDate < currentDate;
            const isOngoing = event.endDate && event.startDate <= currentDate && event.endDate >= currentDate;
            const isLeft = index % 2 === 0;

            return (
              <div key={event.id} className={`relative flex flex-col md:flex-row items-center gap-8 ${isPast ? 'opacity-60 grayscale-[0.8]' : ''}`}>
                
                {/* Mobile Date Bubble (Left) */}
                <div className="absolute left-[-32px] md:left-1/2 top-6 md:-translate-x-1/2 z-10">
                   <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${isOngoing ? 'bg-indigo-500 scale-125 ring-4 ring-indigo-100' : isPast ? 'bg-slate-300' : 'bg-white ring-4 ring-indigo-50'}`}></div>
                </div>

                {/* Left Side Content (for Desktop) */}
                <div className={`w-full md:w-1/2 ${isLeft ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12 text-left'}`}>
                  <div className={`
                    relative group bg-white/60 hover:bg-white backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300
                    ${isOngoing ? 'ring-2 ring-indigo-400 bg-white shadow-lg shadow-indigo-200' : ''}
                  `}>
                    
                    <div className="flex items-center gap-3 mb-3 md:justify-start">
                       {/* Mobile Icon Layout Fix */}
                       <div className={`md:hidden ${isLeft ? '' : ''}`}>
                          <span className={`inline-flex items-center justify-center p-2 rounded-lg ${getTypeColor(event.type)}`}>
                             {getTypeIcon(event.type)}
                          </span>
                       </div>
                       
                       {/* Desktop Icon Layout */}
                       <div className={`hidden md:flex w-full ${isLeft ? 'justify-end' : 'justify-start'}`}>
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(event.type)}`}>
                             {getTypeIcon(event.type)}
                             {event.type === EventType.EXAM && "考試"}
                             {event.type === EventType.REGISTRATION && "報名"}
                             {event.type === EventType.QUERY && "查詢"}
                             {event.type === EventType.RESULTS && "放榜"}
                             {event.type === EventType.SELECTION && "志願"}
                             {event.type === EventType.ADMISSION && "錄取"}
                          </span>
                       </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-1">{event.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">{event.description}</p>
                    
                    <div className={`flex flex-wrap items-center gap-4 text-sm font-mono text-slate-600 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                       <div className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>{formatDate(event.startDate)}</span>
                          {event.endDate && <span> - {formatDate(event.endDate)}</span>}
                       </div>
                       <div className="flex items-center gap-1.5 opacity-70">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(event.startDate)}</span>
                       </div>
                    </div>

                    {isOngoing && (
                        <div className="absolute -top-2 -right-2 md:top-auto md:bottom-auto md:right-4 md:translate-y-0">
                           <span className="flex h-4 w-4">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                           </span>
                        </div>
                    )}
                  </div>
                </div>

                {/* Empty Space for alignment on Desktop */}
                <div className={`hidden md:block w-1/2 ${isLeft ? 'md:order-2' : 'md:order-1'}`}></div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};