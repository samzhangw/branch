import { EventType, ScheduleEvent } from './types';

// Helper to create dates easily for 2026 (Year 115)
const createDate = (month: number, day: number, hour: number = 0, minute: number = 0): Date => {
  return new Date(2026, month - 1, day, hour, minute);
};

export const SCHEDULE_DATA: ScheduleEvent[] = [
  {
    id: '1',
    title: '考試報名',
    description: '115學年度分科測驗報名期間',
    startDate: createDate(6, 3, 9, 0),
    endDate: createDate(6, 16, 17, 0),
    type: EventType.REGISTRATION,
  },
  {
    id: '2',
    title: '應考資訊查詢',
    description: '查詢應考資訊 (無明確截止，通常考前查詢)',
    startDate: createDate(7, 7, 9, 0),
    type: EventType.QUERY,
  },
  {
    id: '3',
    title: '考場查詢',
    description: '查詢詳細考場位置 (無明確截止，通常考前查詢)',
    startDate: createDate(7, 7, 9, 0),
    type: EventType.QUERY,
  },
  {
    id: '4',
    title: '分科測驗 (Day 1)',
    description: '115學年度分科測驗第一天',
    startDate: createDate(7, 11, 8, 0), // Assuming 8 AM start
    endDate: createDate(7, 11, 17, 30), // Updated to 17:30 based on schedule
    type: EventType.EXAM,
    isMainExam: true,
  },
  {
    id: '5',
    title: '分科測驗 (Day 2)',
    description: '115學年度分科測驗第二天',
    startDate: createDate(7, 12, 8, 0),
    endDate: createDate(7, 12, 17, 30), // Updated to 17:30 based on schedule
    type: EventType.EXAM,
  },
  {
    id: '6',
    title: '放榜日期',
    description: '公布成績',
    startDate: createDate(7, 29, 9, 0),
    type: EventType.RESULTS,
  },
  {
    id: '7',
    title: '成績複查申請',
    description: '申請成績複查期間',
    startDate: createDate(7, 29, 9, 0),
    endDate: createDate(8, 3, 17, 0),
    type: EventType.REVIEW,
  },
  {
    id: '8',
    title: '登記註冊繳費',
    description: '繳交登記費',
    startDate: createDate(7, 29, 9, 0),
    endDate: createDate(8, 4, 12, 0),
    type: EventType.SELECTION,
  },
  {
    id: '9',
    title: '登記選填志願',
    description: '線上登記分發志願',
    startDate: createDate(8, 1, 9, 0),
    endDate: createDate(8, 4, 16, 30),
    type: EventType.SELECTION,
  },
  {
    id: '10',
    title: '錄取公告',
    description: '大學分發入學錄取公告',
    startDate: createDate(8, 13, 9, 0), // Assuming start date is announcement
    endDate: createDate(8, 15, 17, 0), // Example duration context if needed
    type: EventType.ADMISSION,
  },
];