// 在 DOMContentLoaded 事件之前添加 Service Worker 更新處理代碼
// Service Worker 更新處理
if ('serviceWorker' in navigator) {
    let refreshing = false;
    
    // 註冊 Service Worker
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker 註冊成功:', registration.scope);
                
                // 檢查更新
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    // 監聽新 Service Worker 的狀態變化
                    newWorker.addEventListener('statechange', () => {
                        // 當新的 Service Worker 已安裝，但尚未激活（等待刷新頁面）
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('新版本已下載，等待啟用');
                            showUpdateToast();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('ServiceWorker 註冊失敗:', error);
            });
            
        // 監聽控制權變更（當新的 Service Worker 接管頁面）
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                console.log('新的 Service Worker 已接管頁面，正在刷新...');
                window.location.reload();
            }
        });
    });
}

// 顯示更新提示
function showUpdateToast() {
    const updateToast = document.getElementById('updateToast');
    const updateButton = document.getElementById('updateButton');
    const dismissButton = document.getElementById('dismissButton');
    
    if (updateToast) {
        // 顯示提示
        updateToast.style.display = 'block';
        
        // 點擊更新按鈕
        updateButton.addEventListener('click', () => {
            // 強制重新載入頁面，使新的 Service Worker 接管
            window.location.reload();
        });
        
        // 點擊關閉按鈕
        dismissButton.addEventListener('click', () => {
            updateToast.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 設定目標日期: 2025年7月11日 (114年分科測驗第一天)
    const targetDate = new Date('2025-07-11T08:00:00+08:00');
    
    // 設定版權年份自動更新
    const copyrightYearElem = document.getElementById('copyrightYear');
    if (copyrightYearElem) {
        copyrightYearElem.textContent = new Date().getFullYear();
    }
    
    // 通知功能相關變數
    let notificationPermission = Notification.permission;
    let notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {
        oneMonth: false,
        oneWeek: false,
        threeDays: false,
        oneDay: false,
        examDay: false
    };
    let lastNotificationDays = JSON.parse(localStorage.getItem('lastNotificationDays')) || {};
    
    function updateCountdown() {
        const currentDate = new Date();
        const difference = targetDate - currentDate;
        
        // 考試已經開始或結束
        if (difference < 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            document.getElementById('message').textContent = '考試已開始，祝福所有考生順利！';
            return;
        }
        
        // 計算剩餘時間
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // 儲存舊值以檢查是否變化
        const oldDays = document.getElementById('days').textContent;
        const oldHours = document.getElementById('hours').textContent;
        const oldMinutes = document.getElementById('minutes').textContent;
        const oldSeconds = document.getElementById('seconds').textContent;
        
        // 更新 DOM
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
        
        // 添加動畫效果當數值變化時
        if (oldDays !== days.toString()) document.getElementById('days').classList.add('pulse');
        if (oldHours !== hours.toString()) document.getElementById('hours').classList.add('pulse');
        if (oldMinutes !== minutes.toString()) document.getElementById('minutes').classList.add('pulse');
        if (oldSeconds !== seconds.toString()) document.getElementById('seconds').classList.add('pulse');
        
        // 移除動畫類以便再次觸發
        setTimeout(() => {
            document.querySelectorAll('.countdown-value').forEach(el => {
                el.classList.remove('pulse');
            });
        }, 500);
        
        // 根據剩餘天數更新訊息
        if (days > 30) {
            document.getElementById('message').textContent = '距離114年分科測驗還有很長一段時間，穩定學習，按部就班！';
        } else if (days > 7) {
            document.getElementById('message').textContent = '距離114年分科測驗還有不到一個月，調整狀態，保持專注！';
        } else if (days > 1) {
            document.getElementById('message').textContent = '距離114年分科測驗只剩下幾天，做好最後準備，保持冷靜！';
        } else {
            document.getElementById('message').textContent = '明天就是114年分科測驗，放鬆心情，相信自己！';
        }
    }
    
    // 初始更新
    updateCountdown();
    
    // 每秒更新一次
    setInterval(updateCountdown, 1000);
    
    // 添加視覺效果於倒數區塊
    const countdownItems = document.querySelectorAll('.countdown-item');
    countdownItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate__animated', 'animate__fadeInUp');
        }, 300 * index);
    });

    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNavigation = document.getElementById('mainNavigation');

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mainNavigation.classList.toggle('open');
        
        // 當菜單打開時，禁止背景滾動以防止干擾
        if (mainNavigation.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mainNavigation.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && mainNavigation.classList.contains('open')) {
            menuToggle.classList.remove('active');
            mainNavigation.classList.remove('open');
            document.body.style.overflow = ''; // 恢復背景滾動
        }
    });

    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNavigation.classList.remove('open');
            document.body.style.overflow = ''; // 恢復背景滾動
        });
    });
    
    // 處理菜單內的觸摸滑動
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // 優化菜單滑動體驗
    mainNavigation.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    mainNavigation.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });
    
    // 新增向右滑動關閉菜單的功能
    document.addEventListener('touchstart', function(e) {
        if (!mainNavigation.classList.contains('open')) return;
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (!mainNavigation.classList.contains('open')) return;
        touchEndX = e.changedTouches[0].screenX;
        
        // 向右滑動超過50px時關閉菜單
        if (touchEndX - touchStartX > 50) {
            menuToggle.classList.remove('active');
            mainNavigation.classList.remove('open');
            document.body.style.overflow = '';
        }
    }, { passive: true });
    
    function handleSwipeGesture() {
        // 使用變數追蹤滑動距離
        const menu = mainNavigation;
        const isAtBottom = menu.scrollHeight - menu.scrollTop <= menu.clientHeight + 5;
        const isAtTop = menu.scrollTop <= 0;
        
        // 向上滑動且已在底部，或向下滑動且已在頂部時，處理特定邏輯
        if ((isAtBottom && touchEndY < touchStartY) || (isAtTop && touchEndY > touchStartY)) {
            // 提供視覺反饋
            if (isAtTop && touchEndY > touchStartY) {
                // 向下拉動效果 - 顯示視覺指示
                menu.classList.add('pull-down-effect');
                setTimeout(function() {
                    menu.classList.remove('pull-down-effect');
                }, 300);
            }
            
            if (isAtBottom && touchEndY < touchStartY) {
                // 向上拉動效果 - 顯示視覺指示
                menu.classList.add('pull-up-effect');
                setTimeout(function() {
                    menu.classList.remove('pull-up-effect');
                }, 300);
            }
        }
    }

    // 優化倒數計時器在移動設備上的動畫性能
    function updateCountdownMobile() {
        // 檢測設備是否為移動裝置
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 在移動裝置上降低動畫頻率以提高性能
            const countdownItems = document.querySelectorAll('.countdown-item');
            countdownItems.forEach(item => {
                item.style.transition = 'transform 0.3s ease';
            });
        }
    }
    
    // 監聽螢幕大小變化
    window.addEventListener('resize', updateCountdownMobile);
    
    // 初始化檢查
    updateCountdownMobile();
    
    // 初始化和調整菜單高度
    function initMobileMenu() {
        // 檢查菜單高度是否超過視窗
        function checkMenuHeight() {
            const windowHeight = window.innerHeight;
            const menuHeight = mainNavigation.scrollHeight;
            
            if (menuHeight > windowHeight) {
                // 確保菜單最大高度不超過視窗高度
                mainNavigation.style.maxHeight = `${windowHeight}px`;
            }
        }
        
        // 窗口大小改變時重新檢查
        window.addEventListener('resize', checkMenuHeight);
        
        // 初始檢查
        checkMenuHeight();
    }
    
    // 在頁面加載完成後初始化菜單
    initMobileMenu();

    // 主題切換功能
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const body = document.body;

    function updateThemeToggle() {
        if (body.classList.contains('dark-mode')) {
            mobileThemeToggle.innerHTML = '<i class="fas fa-sun"></i> 切換主題';
        } else {
            mobileThemeToggle.innerHTML = '<i class="fas fa-moon"></i> 切換主題';
        }
    }

    // Load previous theme setting
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateThemeToggle();
    }

    // Add event listener to mobile theme toggle
    mobileThemeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Save theme preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }

        // Update toggle icon
        updateThemeToggle();

        // Close mobile menu after toggling theme
        document.getElementById('menuToggle').classList.remove('active');
        document.getElementById('mainNavigation').classList.remove('open');
    });

    // 學習計時器
    const studyTimerDisplay = document.getElementById('studyTimerDisplay');
    const startStudyTimer = document.getElementById('startStudyTimer');
    const pauseStudyTimer = document.getElementById('pauseStudyTimer');
    const resetStudyTimer = document.getElementById('resetStudyTimer');
    const studyLogList = document.getElementById('studyLogList');

    let studyTimer;
    let seconds = 0;
    let isRunning = false;

    function updateStudyTimerDisplay() {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        studyTimerDisplay.textContent = 
            `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    startStudyTimer.addEventListener('click', function() {
        if (!isRunning) {
            isRunning = true;
            studyTimer = setInterval(() => {
                seconds++;
                updateStudyTimerDisplay();
            }, 1000);
        }
    });

    pauseStudyTimer.addEventListener('click', function() {
        clearInterval(studyTimer);
        isRunning = false;
    });

    resetStudyTimer.addEventListener('click', function() {
        clearInterval(studyTimer);
        isRunning = false;
        seconds = 0;
        updateStudyTimerDisplay();
    });

    // Update modal opening to work with new mobile menu buttons
    const mobileStudyTimerBtn = document.getElementById('mobileStudyTimerBtn');
    const mobileExamTipsBtn = document.getElementById('mobileExamTipsBtn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // 為所有關閉按鈕添加事件監聽器
    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // 找到當前按鈕所在的模態框
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // 點擊模態框外部區域時關閉模態框
    window.addEventListener('click', function(event) {
        modals.forEach(function(modal) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // 按下 ESC 鍵關閉彈窗
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(function(modal) {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });

    mobileStudyTimerBtn.addEventListener('click', function() {
        const studyTimerModal = document.getElementById('studyTimerModal');
        studyTimerModal.style.display = 'block';
        
        // Close mobile menu after opening modal
        menuToggle.classList.remove('active');
        mainNavigation.classList.remove('open');
    });

    mobileExamTipsBtn.addEventListener('click', function() {
        const examTipsModal = document.getElementById('examTipsModal');
        examTipsModal.style.display = 'block';
        
        // Close mobile menu after opening modal
        menuToggle.classList.remove('active');
        mainNavigation.classList.remove('open');
    });

    // Keep the existing desktop feature buttons functionality for desktop view
    const openStudyTimerBtn = document.getElementById('openStudyTimerBtn');
    const openExamTipsBtn = document.getElementById('openExamTipsBtn');

    // Check if these buttons exist before adding event listeners
    if (openStudyTimerBtn) {
        openStudyTimerBtn.addEventListener('click', function() {
            const studyTimerModal = document.getElementById('studyTimerModal');
            studyTimerModal.style.display = 'block';
        });
    }

    if (openExamTipsBtn) {
        openExamTipsBtn.addEventListener('click', function() {
            const examTipsModal = document.getElementById('examTipsModal');
            examTipsModal.style.display = 'block';
        });
    }

    // Add event listeners for feature buttons
    const shareLineBtn = document.getElementById('shareLineBtn');
    const shareFacebookBtn = document.getElementById('shareFacebookBtn');

    shareLineBtn.addEventListener('click', function() {
        const shareUrl = encodeURIComponent(window.location.href);
        window.open(`https://social-plugins.line.me/lineit/share?url=${shareUrl}`, '_blank');
    });

    shareFacebookBtn.addEventListener('click', function() {
        const shareUrl = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    });

    // 勵志名言集
    const motivationalQuotes = [
        "成功不是偶然，而是日積月累的堅持與努力。",
        "態度決定高度，堅持鑄就實力。",
        "不經一番寒徹骨，焉得梅花撲鼻香。",
        "千里之行，始於足下；萬卷之功，始於當下。",
        "學習是一場沒有終點的旅程，每一步都會讓你更接近夢想。",
        "今日的汗水，換來明日的榮耀。",
        "莫問收穫，但問耕耘；不計一時，但計日積月累。",
        "每一次認真的復習，都是為未來的成功打下基礎。",
        "別人的忽視，正是你沉澱自己的最好時機。",
        "所謂天才，不過是把別人喝咖啡的功夫，都用在了學習上。",
        "沒有人能替你承受痛苦，也沒有人能替你成就夢想。",
        "與其羨慕別人的成功，不如更加努力讓自己發光。",
        "不要讓今天的懶惰成為明天的負擔。",
        "機會永遠留給有準備的人，而準備的過程往往在別人看不到的地方。",
        "當你覺得堅持不下去的時候，恰恰是你需要堅持的時候。"
    ];
    
    // 初始化勵志名言顯示
    let currentQuoteIndex = 0;
    const quoteText = document.getElementById('quoteText');
    const prevQuoteBtn = document.getElementById('prevQuote');
    const nextQuoteBtn = document.getElementById('nextQuote');
    const quotePagination = document.getElementById('quotePagination');
    
    // 生成分頁指示點
    function generateQuotePagination() {
        quotePagination.innerHTML = '';
        motivationalQuotes.forEach((quote, index) => {
            const dot = document.createElement('span');
            dot.classList.add('pagination-dot');
            if (index === currentQuoteIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                displayQuote(index);
            });
            quotePagination.appendChild(dot);
        });
    }
    
    // 顯示指定索引的名言
    function displayQuote(index) {
        if (index < 0) {
            index = motivationalQuotes.length - 1;
        } else if (index >= motivationalQuotes.length) {
            index = 0;
        }
        
        // 淡出效果
        quoteText.classList.add('fade-out');
        
        setTimeout(() => {
            currentQuoteIndex = index;
            quoteText.textContent = `"${motivationalQuotes[currentQuoteIndex]}"`;
            
            // 更新分頁指示點
            const dots = document.querySelectorAll('.pagination-dot');
            dots.forEach((dot, i) => {
                if (i === currentQuoteIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // 淡入效果
            quoteText.classList.remove('fade-out');
            quoteText.classList.add('fade-in');
            
            setTimeout(() => {
                quoteText.classList.remove('fade-in');
            }, 500);
        }, 300);
    }
    
    // 初始化分頁和按鈕事件
    if (quoteText && prevQuoteBtn && nextQuoteBtn && quotePagination) {
        // 隨機選擇一個開始的名言
        currentQuoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
        quoteText.textContent = `"${motivationalQuotes[currentQuoteIndex]}"`;
        
        generateQuotePagination();
        
        // 按鈕事件監聽
        prevQuoteBtn.addEventListener('click', () => {
            displayQuote(currentQuoteIndex - 1);
        });
        
        nextQuoteBtn.addEventListener('click', () => {
            displayQuote(currentQuoteIndex + 1);
        });
        
        // 自動輪播名言
        const quoteInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                displayQuote(currentQuoteIndex + 1);
            }
        }, 10000); // 每10秒自動切換一次
        
        // 頁面離開時停止計時器
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                clearInterval(quoteInterval);
            }
        });
    }

    // 通知功能
    // 獲取元素
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationModal = document.getElementById('notificationModal');
    const notificationStatus = document.getElementById('notificationStatus');
    const requestPermissionBtn = document.getElementById('requestPermissionBtn');
    const saveNotificationSettings = document.getElementById('saveNotificationSettings');
    const testNotificationBtn = document.getElementById('testNotificationBtn');
    
    // 每日通知相關元素
    const notifyDailyCheckbox = document.getElementById('notifyDaily');
    const dailyNotificationStatus = document.getElementById('dailyNotificationStatus');
    const dailyNotificationStatusText = document.getElementById('dailyNotificationStatusText');
    const testDailyNotificationBtn = document.getElementById('testDailyNotificationBtn');
    
    // 通知選項複選框
    const notifyOneMonthCheckbox = document.getElementById('notifyOneMonth');
    const notifyOneWeekCheckbox = document.getElementById('notifyOneWeek');
    const notifyThreeDaysCheckbox = document.getElementById('notifyThreeDays');
    const notifyOneDayCheckbox = document.getElementById('notifyOneDay');
    const notifyExamDayCheckbox = document.getElementById('notifyExamDay');
    
    // 每日通知設置
    let dailyNotificationEnabled = localStorage.getItem('dailyNotificationEnabled') === 'true';
    
    // 更新每日通知設置
    function updateDailyNotificationStatus() {
        if (notificationPermission === 'granted') {
            dailyNotificationStatus.style.display = 'block';
            
            // 從 Service Worker 獲取當前狀態
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'GET_DAILY_NOTIFICATIONS_STATUS'
                });
            } else {
                dailyNotificationStatusText.textContent = '無法獲取每日通知狀態，請稍後再試';
            }
            
            // 根據本地設置更新複選框狀態
            notifyDailyCheckbox.checked = dailyNotificationEnabled;
        } else {
            dailyNotificationStatus.style.display = 'none';
        }
    }
    
    // 啟用/禁用每日通知
    function toggleDailyNotifications(enabled) {
        if (notificationPermission !== 'granted') return;
        
        // 保存到本地
        dailyNotificationEnabled = enabled;
        localStorage.setItem('dailyNotificationEnabled', enabled);
        
        // 通知 Service Worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'TOGGLE_DAILY_NOTIFICATIONS',
                enabled: enabled
            });
            
            // 更新界面顯示
            notifyDailyCheckbox.checked = enabled;
            
            // 更新狀態訊息
            if (enabled) {
                dailyNotificationStatusText.textContent = '每日通知已啟用，將於每天早上 8:00 發送';
            } else {
                dailyNotificationStatusText.textContent = '每日通知已禁用';
            }
        }
    }
    
    // 發送每日通知測試
    function testDailyNotification() {
        if (notificationPermission !== 'granted') return;
        
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SEND_TEST_DAILY_NOTIFICATION'
            });
        } else {
            alert('Service Worker 尚未準備好，請稍後再試');
        }
    }
    
    // 監聽來自 Service Worker 的訊息
    navigator.serviceWorker.addEventListener('message', function(event) {
        if (event.data) {
            // 處理每日通知狀態更新
            if (event.data.type === 'DAILY_NOTIFICATIONS_STATUS') {
                dailyNotificationStatusText.textContent = event.data.message;
            }
            
            // 處理測試通知結果
            if (event.data.type === 'TEST_NOTIFICATION_SENT' && event.data.success) {
                console.log('測試通知發送成功');
            }
        }
    });
    
    // 開啟通知模態窗口
    notificationBtn.addEventListener('click', function() {
        openNotificationModal();
    });
    
    // 關閉模態窗口功能
    document.querySelectorAll('.close-modal').forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 點擊模態窗口外部關閉
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(function(modal) {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // 請求通知權限
    requestPermissionBtn.addEventListener('click', function() {
        requestNotificationPermission();
    });
    
    // 儲存通知設置
    saveNotificationSettings.addEventListener('click', function() {
        saveSettings();
    });
    
    // 測試通知
    testNotificationBtn.addEventListener('click', function() {
        sendTestNotification();
    });
    
    // 測試每日通知
    if (testDailyNotificationBtn) {
        testDailyNotificationBtn.addEventListener('click', function() {
            testDailyNotification();
        });
    }
    
    // 每日通知複選框更改事件
    if (notifyDailyCheckbox) {
        notifyDailyCheckbox.addEventListener('change', function() {
            toggleDailyNotifications(this.checked);
        });
    }
    
    // 開啟通知模態窗口
    function openNotificationModal() {
        // 更新權限狀態顯示
        updatePermissionStatus();
        
        // 載入保存的設置
        loadSavedSettings();
        
        // 更新每日通知狀態
        updateDailyNotificationStatus();
        
        // 顯示模態窗口
        notificationModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // 關閉任何模態窗口
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // 更新權限狀態顯示
    function updatePermissionStatus() {
        // 檢查當前權限
        notificationPermission = Notification.permission;
        
        let statusText = '';
        let statusClass = '';
        
        switch(notificationPermission) {
            case 'granted':
                statusText = '通知權限: 已允許';
                statusClass = 'status-granted';
                requestPermissionBtn.style.display = 'none';
                saveNotificationSettings.disabled = false;
                testNotificationBtn.disabled = false;
                testDailyNotificationBtn.disabled = false;
                break;
            case 'denied':
                statusText = '通知權限: 已拒絕 (請在瀏覽器設置中啟用)';
                statusClass = 'status-denied';
                requestPermissionBtn.style.display = 'none';
                saveNotificationSettings.disabled = true;
                testNotificationBtn.disabled = true;
                testDailyNotificationBtn.disabled = true;
                break;
            default: // 'default' 或其他
                statusText = '通知權限: 未請求';
                statusClass = 'status-default';
                requestPermissionBtn.style.display = 'block';
                saveNotificationSettings.disabled = true;
                testNotificationBtn.disabled = true;
                testDailyNotificationBtn.disabled = true;
        }
        
        notificationStatus.textContent = statusText;
        
        // 清除先前的類別
        notificationStatus.classList.remove('status-granted', 'status-denied', 'status-default');
        notificationStatus.classList.add(statusClass);
    }
    
    // 請求通知權限
    function requestNotificationPermission() {
        Notification.requestPermission().then(function(permission) {
            notificationPermission = permission;
            updatePermissionStatus();
            
            // 如果權限被授予，更新每日通知狀態
            if (permission === 'granted') {
                updateDailyNotificationStatus();
            }
        });
    }
    
    // 載入保存的設置
    function loadSavedSettings() {
        // 從 localStorage 載入設置
        notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {
            oneMonth: false,
            oneWeek: false,
            threeDays: false,
            oneDay: false,
            examDay: false
        };
        
        // 載入每日通知設置
        dailyNotificationEnabled = localStorage.getItem('dailyNotificationEnabled') === 'true';
        
        // 更新 UI
        notifyOneMonthCheckbox.checked = notificationSettings.oneMonth;
        notifyOneWeekCheckbox.checked = notificationSettings.oneWeek;
        notifyThreeDaysCheckbox.checked = notificationSettings.threeDays;
        notifyOneDayCheckbox.checked = notificationSettings.oneDay;
        notifyExamDayCheckbox.checked = notificationSettings.examDay;
        notifyDailyCheckbox.checked = dailyNotificationEnabled;
        
        // 確保複選框視覺效果與狀態一致
        updateCheckboxVisuals();
    }
    
    // 更新複選框視覺效果
    function updateCheckboxVisuals() {
        const checkboxes = document.querySelectorAll('.checkbox-hidden');
        checkboxes.forEach(checkbox => {
            // 檢查關聯的標籤和自定義複選框
            const customCheckbox = checkbox.nextElementSibling.querySelector('.checkbox-custom');
            if (checkbox.checked) {
                customCheckbox.classList.add('checked');
            } else {
                customCheckbox.classList.remove('checked');
            }
        });
    }
    
    // 儲存設置
    function saveSettings() {
        // 更新設置對象
        notificationSettings = {
            oneMonth: notifyOneMonthCheckbox.checked,
            oneWeek: notifyOneWeekCheckbox.checked,
            threeDays: notifyThreeDaysCheckbox.checked,
            oneDay: notifyOneDayCheckbox.checked,
            examDay: notifyExamDayCheckbox.checked
        };
        
        // 儲存到 localStorage
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
        
        // 儲存每日通知設置
        toggleDailyNotifications(notifyDailyCheckbox.checked);
        
        // 提供用戶反饋
        sendNotification('設置已儲存', '考試提醒已設置成功！');
        
        // 關閉模態窗口
        closeModal(notificationModal);
    }
    
    // 發送測試通知
    function sendTestNotification() {
        sendNotification('測試通知', '這是一則測試通知，確認您的設備可以接收提醒。');
    }
    
    // 發送通知函數
    function sendNotification(title, body) {
        if (notificationPermission === 'granted') {
            const options = {
                body: body,
                icon: '/favicon-32x32.png',
                badge: '/favicon-16x16.png',
                vibrate: [100, 50, 100],
                tag: 'exam-notification'
            };
            
            // 創建通知
            try {
                const notification = new Notification(title, options);
                
                // 點擊通知時處理
                notification.onclick = function() {
                    window.focus();
                    notification.close();
                };
            } catch (error) {
                console.error('無法發送通知:', error);
            }
        }
    }
    
    // 檢查是否應該發送通知
    function checkAndSendNotifications() {
        if (notificationPermission !== 'granted') return;
        
        const currentDate = new Date();
        const difference = targetDate - currentDate;
        
        // 考試已結束
        if (difference < 0) return;
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        
        // 檢查各種通知條件
        checkNotificationCondition(days, 30, 'oneMonth', '距離分科測驗還有一個月！', '是時候加緊複習了，為分科測驗做好最後準備。');
        checkNotificationCondition(days, 7, 'oneWeek', '距離分科測驗還有一週！', '最後衝刺階段開始，調整好作息，保持好狀態！');
        checkNotificationCondition(days, 3, 'threeDays', '距離分科測驗還有三天！', '檢查考試用品，調整心態，放輕鬆！');
        checkNotificationCondition(days, 1, 'oneDay', '明天就是分科測驗！', '最後檢查考試證件、文具，早點休息，保持良好狀態！');
        checkNotificationCondition(days, 0, 'examDay', '今天是分科測驗！', '祝所有考生今天順利，發揮實力，金榜題名！');
    }
    
    // 檢查具體通知條件
    function checkNotificationCondition(currentDays, targetDays, settingKey, title, body) {
        // 檢查這個條件是否啟用和是否已經發送過通知
        if (notificationSettings[settingKey] && currentDays === targetDays) {
            // 檢查今天是否已經發送過這個通知
            const today = new Date().toDateString();
            if (lastNotificationDays[settingKey] !== today) {
                // 發送通知
                sendNotification(title, body);
                
                // 記錄已經發送過通知
                lastNotificationDays[settingKey] = today;
                localStorage.setItem('lastNotificationDays', JSON.stringify(lastNotificationDays));
            }
        }
    }
    
    // 初始化通知功能
    function initNotifications() {
        // 初始化時檢查權限
        notificationPermission = Notification.permission;
        
        // 變更按鈕文字
        if (notificationPermission === 'granted') {
            notificationBtn.innerHTML = '<i class="fas fa-bell"></i> 調整提醒';
        } else {
            notificationBtn.innerHTML = '<i class="fas fa-bell"></i> 開啟提醒';
        }
        
        // 設置複選框事件監聽
        const checkboxes = document.querySelectorAll('.checkbox-hidden');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateCheckboxVisuals();
            });
            
            // 支援標籤點擊
            const label = checkbox.nextElementSibling;
            if (label) {
                label.addEventListener('click', function(e) {
                    // 阻止事件冒泡避免重複觸發
                    e.stopPropagation();
                });
            }
        });
        
        // 獲取已儲存的每日通知設置
        if (notificationPermission === 'granted' && dailyNotificationEnabled) {
            // 初始化每日通知
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'TOGGLE_DAILY_NOTIFICATIONS',
                    enabled: true
                });
            }
        }
        
        // 每天檢查一次是否需要發送通知
        checkAndSendNotifications();
        
        // 設置每天定時檢查通知
        // 設定為每天早上 8 點檢查
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0, 0);
        const timeUntilTomorrow = tomorrow - now;
        
        // 首次啟動後，設置定時器
        setTimeout(() => {
            checkAndSendNotifications();
            // 之後每24小時檢查一次
            setInterval(checkAndSendNotifications, 24 * 60 * 60 * 1000);
        }, timeUntilTomorrow);
    }
    
    // 在頁面加載時初始化通知功能
    initNotifications();
});