// Data Definition
const createDate = (month, day, hour = 0, minute = 0) => {
    return new Date(2026, month - 1, day, hour, minute);
};

const SCHEDULE_DATA = [
    { id: '1', title: '考試報名', description: '115學年度分科測驗報名期間', startDate: createDate(6, 3, 9, 0), endDate: createDate(6, 16, 17, 0), type: 'REGISTRATION' },
    { id: '2', title: '應考資訊查詢', description: '查詢應考資訊 (無明確截止，通常考前查詢)', startDate: createDate(7, 7, 9, 0), type: 'QUERY' },
    { id: '3', title: '考場查詢', description: '查詢詳細考場位置 (無明確截止，通常考前查詢)', startDate: createDate(7, 7, 9, 0), type: 'QUERY' },
    { id: '4', title: '分科測驗 (Day 1)', description: '115學年度分科測驗第一天', startDate: createDate(7, 11, 8, 0), endDate: createDate(7, 11, 17, 30), type: 'EXAM', isMainExam: true },
    { id: '5', title: '分科測驗 (Day 2)', description: '115學年度分科測驗第二天', startDate: createDate(7, 12, 8, 0), endDate: createDate(7, 12, 17, 30), type: 'EXAM' },
    { id: '6', title: '放榜日期', description: '公布成績', startDate: createDate(7, 29, 9, 0), type: 'RESULTS' },
    { id: '7', title: '成績複查申請', description: '申請成績複查期間', startDate: createDate(7, 29, 9, 0), endDate: createDate(8, 3, 17, 0), type: 'REVIEW' },
    { id: '8', title: '登記註冊繳費', description: '繳交登記費', startDate: createDate(7, 29, 9, 0), endDate: createDate(8, 4, 12, 0), type: 'SELECTION' },
    { id: '9', title: '登記選填志願', description: '線上登記分發志願', startDate: createDate(8, 1, 9, 0), endDate: createDate(8, 4, 16, 30), type: 'SELECTION' },
    { id: '10', title: '錄取公告', description: '大學分發入學錄取公告', startDate: createDate(8, 13, 9, 0), endDate: createDate(8, 15, 17, 0), type: 'ADMISSION' },
];

const QUOTES = [
    "每一份努力都不會被辜負，堅持下去。", "將來的你，一定會感謝現在拼命的自己。", "夢想不會逃跑，會逃跑的永遠是自己。",
    "每天進步1%，一年後你將強大37倍。", "只有比別人更早、更勤奮地努力，才能嚐到成功的滋味。",
    "沒有傘的孩子必須努力奔跑。", "今天的淚水，會成為明天的養分。", "不為失敗找藉口，只為成功找方法。",
    "你的潛力遠超你的想像。", "做題的節奏，就是通往夢想的腳步聲。", "乾坤未定，你我皆是黑馬。",
    "耐得住寂寞，才守得住繁華。", "相信積累的力量。", "未來的路還很長，請保持熱愛。"
];

// App State
const mainExam = SCHEDULE_DATA.find(e => e.isMainExam) || SCHEDULE_DATA[0];
const examEndDate = createDate(7, 12, 17, 30);
let hasCelebrated = false;

// DOM Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownSection = document.getElementById('countdown-section');
const celebrationSection = document.getElementById('celebration-section');
const timelineContainer = document.getElementById('timeline-container');
const quoteText = document.getElementById('quote-text');
const newQuoteBtn = document.getElementById('new-quote-btn');
const todayDateEl = document.getElementById('today-date');
const heroSubtitle = document.getElementById('hero-subtitle');

// Helper Functions
const formatTwoDigits = (num) => num.toString().padStart(2, '0');
const formatDate = (date) => new Intl.DateTimeFormat('zh-TW', { month: '2-digit', day: '2-digit' }).format(date);
const formatTime = (date) => new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);

const getTypeConfig = (type) => {
    switch (type) {
        case 'EXAM': return { icon: 'award', color: 'bg-red-100 text-red-700', label: '考試' };
        case 'REGISTRATION': return { icon: 'file-text', color: 'bg-blue-100 text-blue-700', label: '報名' };
        case 'QUERY': return { icon: 'map-pin', color: 'bg-purple-100 text-purple-700', label: '查詢' };
        case 'RESULTS': return { icon: 'check-circle-2', color: 'bg-green-100 text-green-700', label: '放榜' };
        case 'SELECTION': return { icon: 'mouse-pointer', color: 'bg-indigo-100 text-indigo-700', label: '志願' };
        case 'ADMISSION': return { icon: 'graduation-cap', color: 'bg-amber-100 text-amber-700', label: '錄取' };
        default: return { icon: 'calendar', color: 'bg-slate-100 text-slate-700', label: '日程' };
    }
};

// Update Countdown
function updateCountdown() {
    const now = new Date();
    const isFinished = now > examEndDate;

    if (isFinished) {
        countdownSection.classList.add('hidden');
        celebrationSection.classList.remove('hidden');
        heroSubtitle.textContent = "所有的努力都已化為養分，願你前程似錦。";
        if (!hasCelebrated) {
            triggerCelebration();
            hasCelebrated = true;
        }
    } else {
        const target = mainExam.startDate;
        const diff = target - now;
        
        if (diff > 0) {
            daysEl.textContent = formatTwoDigits(Math.floor(diff / (1000 * 60 * 60 * 24)));
            hoursEl.textContent = formatTwoDigits(Math.floor((diff / (1000 * 60 * 60)) % 24));
            minutesEl.textContent = formatTwoDigits(Math.floor((diff / 1000 / 60) % 60));
            secondsEl.textContent = formatTwoDigits(Math.floor((diff / 1000) % 60));
        } else {
            // Exam in progress or just started
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
        }
    }
}

// Render Timeline
function renderTimeline() {
    const now = new Date();
    const sortedEvents = [...SCHEDULE_DATA].sort((a, b) => a.startDate - b.startDate);

    timelineContainer.innerHTML = sortedEvents.map((event, index) => {
        const isPast = event.endDate ? event.endDate < now : event.startDate < now;
        const isOngoing = event.endDate && event.startDate <= now && event.endDate >= now;
        const isLeft = index % 2 === 0;
        const typeConfig = getTypeConfig(event.type);

        const dateStr = formatDate(event.startDate) + (event.endDate ? ` - ${formatDate(event.endDate)}` : '');
        
        // Mobile Layout (Always Stacked) vs Desktop (Alternating) logic handled by CSS classes
        return `
        <div class="relative flex flex-col md:flex-row items-center gap-8 ${isPast ? 'opacity-60 grayscale-[0.8]' : ''}">
            <!-- Bubble -->
            <div class="absolute left-[-32px] md:left-1/2 top-6 md:-translate-x-1/2 z-10">
                <div class="w-4 h-4 rounded-full border-2 border-white shadow-sm ${isOngoing ? 'bg-indigo-500 scale-125 ring-4 ring-indigo-100' : isPast ? 'bg-slate-300' : 'bg-white ring-4 ring-indigo-50'}"></div>
            </div>

            <!-- Content -->
            <div class="w-full md:w-1/2 ${isLeft ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12 text-left'}">
                <div class="relative group bg-white/60 hover:bg-white backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 ${isOngoing ? 'ring-2 ring-indigo-400 bg-white shadow-lg shadow-indigo-200' : ''}">
                    
                    <div class="flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}">
                         <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${typeConfig.color}">
                             <i data-lucide="${typeConfig.icon}" class="w-3 h-3"></i> ${typeConfig.label}
                         </span>
                    </div>

                    <h3 class="text-lg font-bold text-slate-800 mb-1">${event.title}</h3>
                    <p class="text-sm text-slate-500 mb-4 leading-relaxed">${event.description}</p>
                    
                    <div class="flex flex-wrap items-center gap-4 text-sm font-mono text-slate-600 ${isLeft ? 'md:flex-row-reverse' : ''}">
                        <div class="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-lg">
                            <i data-lucide="calendar" class="w-4 h-4 text-indigo-500"></i>
                            <span>${dateStr}</span>
                        </div>
                        <div class="flex items-center gap-1.5 opacity-70">
                             <i data-lucide="clock" class="w-3 h-3"></i>
                             <span>${formatTime(event.startDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Spacer for Desktop -->
            <div class="hidden md:block w-1/2 ${isLeft ? 'md:order-2' : 'md:order-1'}"></div>
        </div>
        `;
    }).join('');
    
    // Re-initialize icons for newly added content
    if(window.lucide) window.lucide.createIcons();
}

// Update Quote
function updateQuote() {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    quoteText.textContent = quote;
    todayDateEl.textContent = new Date().toLocaleDateString('zh-TW');
}

// Next Event Logic
function updateNextEvent() {
    const now = new Date();
    const upcoming = SCHEDULE_DATA
        .filter(e => (e.endDate || e.startDate) > now)
        .sort((a, b) => a.startDate - b.startDate);
        
    const card = document.getElementById('next-event-card');
    
    if (upcoming.length > 0) {
        const next = upcoming[0];
        const diff = next.startDate - now;
        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        document.getElementById('next-event-title').textContent = next.title;
        document.getElementById('next-event-desc').textContent = next.description;
        document.getElementById('next-event-days').textContent = Math.max(0, daysLeft);
        card.classList.remove('hidden');
        card.classList.add('flex');
    } else {
        card.classList.add('hidden');
    }
}

// Modals & Menu Logic
function setupInteractions() {
    // Schedule Modal
    const modal = document.getElementById('schedule-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    const openBtns = [document.getElementById('open-schedule-btn'), document.getElementById('drawer-schedule-btn'), document.getElementById('hero-schedule-btn')];
    const closeBtn = document.getElementById('close-modal-btn');

    function openModal() {
        modal.classList.remove('hidden');
        // Small timeout to allow transition to work
        setTimeout(() => {
            modalBackdrop.classList.remove('opacity-0');
            modalContent.classList.remove('opacity-0', 'scale-95');
        }, 10);
    }

    function closeModal() {
        modalBackdrop.classList.add('opacity-0');
        modalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    openBtns.forEach(btn => {
        if(btn) btn.addEventListener('click', openModal);
    });
    
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Mobile Drawer
    const drawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerPanel = document.getElementById('drawer-panel');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');

    function openDrawer() {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            drawerBackdrop.classList.remove('opacity-0');
            drawerPanel.classList.remove('translate-x-full');
        }, 10);
    }

    function closeDrawer() {
        drawerBackdrop.classList.add('opacity-0');
        drawerPanel.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden');
        }, 300);
    }

    if(menuBtn) menuBtn.addEventListener('click', openDrawer);
    if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if(drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    // Celebration
    const celebrateBtn = document.getElementById('celebrate-btn');
    if(celebrateBtn) celebrateBtn.addEventListener('click', triggerCelebration);

    // Quote
    if(newQuoteBtn) newQuoteBtn.addEventListener('click', updateQuote);
    
    // Navbar Scroll
    window.addEventListener('scroll', () => {
        const navContainer = document.getElementById('navbar-container');
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 20) {
            navContainer.classList.remove('pt-6');
            navContainer.classList.add('pt-4');
            nav.classList.add('bg-white/80', 'shadow-lg');
            nav.classList.remove('bg-white/40');
        } else {
            navContainer.classList.add('pt-6');
            navContainer.classList.remove('pt-4');
            nav.classList.remove('bg-white/80', 'shadow-lg');
            nav.classList.add('bg-white/40');
        }
    });
}

function triggerCelebration() {
    if (typeof confetti === 'function') {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    if(window.lucide) window.lucide.createIcons();
    
    updateCountdown();
    renderTimeline();
    updateQuote();
    updateNextEvent();
    setupInteractions();
    
    // Loop
    setInterval(updateCountdown, 1000);
});