/**
 * AINAV.ART 用户参与度优化器
 * 提升用户留存率、参与度和转化率，优化谷歌Ads表现
 */

class UserEngagementOptimizer {
    constructor() {
        this.config = {
            enablePersonalization: true,
            enableRecommendations: true,
            enableNotifications: true,
            enableGamification: true,
            enableSocialFeatures: true,
            enableRetentionStrategies: true,
            enableAnalytics: true,
            sessionTimeout: 1800000, // 30分钟
            engagementThreshold: 60000 // 1分钟
        };
        
        this.userSession = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0,
            timeSpent: 0,
            scrollDepth: 0,
            clicksCount: 0,
            searchQueries: [],
            viewedTools: [],
            preferences: {},
            engagementScore: 0
        };
        
        this.engagementMetrics = {
            bounceRate: 0,
            averageSessionDuration: 0,
            pagesPerSession: 0,
            conversionRate: 0,
            returnVisitorRate: 0
        };
        
        this.recommendations = [];
        this.notifications = [];
        
        this.init();
    }

    init() {
        console.log('🎯 Starting User Engagement Optimization...');
        this.initializeUserSession();
        this.setupEngagementTracking();
        this.implementPersonalization();
        this.addRecommendationEngine();
        this.setupNotificationSystem();
        this.addGamificationElements();
        this.implementRetentionStrategies();
        this.setupAnalytics();
        this.startEngagementMonitoring();
        console.log('✅ User Engagement Optimization Completed');
    }

    // 初始化用户会话
    initializeUserSession() {
        // 加载历史会话数据
        const storedSession = localStorage.getItem('ainav_user_session');
        if (storedSession) {
            try {
                const sessionData = JSON.parse(storedSession);
                this.userSession = { ...this.userSession, ...sessionData };
            } catch (error) {
                console.warn('Failed to load user session:', error);
            }
        }
        
        // 设置用户ID
        if (!this.userSession.userId) {
            this.userSession.userId = this.generateUserId();
        }
        
        // 更新会话开始时间
        this.userSession.startTime = Date.now();
        this.userSession.pageViews++;
        
        // 检测返回用户
        this.detectReturningUser();
        
        // 保存会话数据
        this.saveUserSession();
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    detectReturningUser() {
        const lastVisit = localStorage.getItem('ainav_last_visit');
        const now = Date.now();
        
        if (lastVisit) {
            const daysSinceLastVisit = (now - parseInt(lastVisit)) / (1000 * 60 * 60 * 24);
            this.userSession.isReturningUser = true;
            this.userSession.daysSinceLastVisit = Math.floor(daysSinceLastVisit);
            
            // 欢迎回来消息
            if (daysSinceLastVisit > 7) {
                this.showWelcomeBackMessage();
            }
        } else {
            this.userSession.isReturningUser = false;
            this.showFirstTimeUserGuide();
        }
        
        localStorage.setItem('ainav_last_visit', now.toString());
    }

    showWelcomeBackMessage() {
        const message = `欢迎回来！距离您上次访问已经过去了${this.userSession.daysSinceLastVisit}天，我们为您准备了一些新的AI工具推荐。`;
        this.showNotification(message, 'welcome', 5000);
    }

    showFirstTimeUserGuide() {
        setTimeout(() => {
            this.showOnboardingTour();
        }, 2000);
    }

    saveUserSession() {
        try {
            localStorage.setItem('ainav_user_session', JSON.stringify(this.userSession));
        } catch (error) {
            console.warn('Failed to save user session:', error);
        }
    }

    // 设置参与度追踪
    setupEngagementTracking() {
        // 页面可见性追踪
        this.trackPageVisibility();
        
        // 滚动深度追踪
        this.trackScrollDepth();
        
        // 点击事件追踪
        this.trackClicks();
        
        // 搜索行为追踪
        this.trackSearchBehavior();
        
        // 工具查看追踪
        this.trackToolViews();
        
        // 时间花费追踪
        this.trackTimeSpent();
        
        // 退出意图检测
        this.detectExitIntent();
    }

    trackPageVisibility() {
        let visibilityStartTime = Date.now();
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面隐藏
                const visibleTime = Date.now() - visibilityStartTime;
                this.userSession.timeSpent += visibleTime;
                this.saveUserSession();
            } else {
                // 页面可见
                visibilityStartTime = Date.now();
            }
        });
        
        // 页面卸载时保存数据
        window.addEventListener('beforeunload', () => {
            const visibleTime = Date.now() - visibilityStartTime;
            this.userSession.timeSpent += visibleTime;
            this.saveUserSession();
        });
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                this.userSession.scrollDepth = Math.round(scrollPercent);
                
                // 滚动里程碑
                if (scrollPercent > 25 && !this.userSession.milestones?.scroll25) {
                    this.recordMilestone('scroll25', '页面滚动25%');
                }
                if (scrollPercent > 50 && !this.userSession.milestones?.scroll50) {
                    this.recordMilestone('scroll50', '页面滚动50%');
                }
                if (scrollPercent > 75 && !this.userSession.milestones?.scroll75) {
                    this.recordMilestone('scroll75', '页面滚动75%');
                }
                if (scrollPercent > 90 && !this.userSession.milestones?.scroll90) {
                    this.recordMilestone('scroll90', '页面滚动90%');
                }
            }
        });
    }

    trackClicks() {
        document.addEventListener('click', (e) => {
            this.userSession.clicksCount++;
            this.userSession.interactions++;
            
            // 记录点击的元素类型
            const elementType = e.target.tagName.toLowerCase();
            const elementClass = e.target.className;
            const elementId = e.target.id;
            
            this.recordInteraction('click', {
                element: elementType,
                class: elementClass,
                id: elementId,
                text: e.target.textContent?.substring(0, 50)
            });
            
            // 特殊元素点击追踪
            if (e.target.closest('.tool-card')) {
                this.trackToolCardClick(e.target.closest('.tool-card'));
            }
            
            if (e.target.closest('.category-item')) {
                this.trackCategoryClick(e.target.closest('.category-item'));
            }
        });
    }

    trackSearchBehavior() {
        const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.trim();
                    if (query.length > 2) {
                        this.recordSearchQuery(query);
                    }
                }, 500);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.recordSearchQuery(query);
                        this.userSession.interactions++;
                    }
                }
            });
        });
    }

    recordSearchQuery(query) {
        this.userSession.searchQueries.push({
            query: query,
            timestamp: Date.now()
        });
        
        // 限制搜索历史数量
        if (this.userSession.searchQueries.length > 50) {
            this.userSession.searchQueries = this.userSession.searchQueries.slice(-25);
        }
        
        this.saveUserSession();
        this.updateRecommendations();
    }

    trackToolViews() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const toolCard = entry.target;
                        const toolName = this.extractToolName(toolCard);
                        
                        if (toolName && !this.userSession.viewedTools.includes(toolName)) {
                            this.userSession.viewedTools.push(toolName);
                            this.recordInteraction('tool_view', { toolName });
                            
                            // 限制查看历史数量
                            if (this.userSession.viewedTools.length > 100) {
                                this.userSession.viewedTools = this.userSession.viewedTools.slice(-50);
                            }
                            
                            this.saveUserSession();
                            this.updateRecommendations();
                        }
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            });
            
            toolCards.forEach(card => observer.observe(card));
        }
    }

    extractToolName(toolCard) {
        const nameElement = toolCard.querySelector('.tool-name, h3, h4, .title');
        return nameElement ? nameElement.textContent.trim() : null;
    }

    trackTimeSpent() {
        setInterval(() => {
            if (!document.hidden) {
                this.userSession.timeSpent += 1000; // 1秒
                this.calculateEngagementScore();
                
                // 时间里程碑
                const minutes = Math.floor(this.userSession.timeSpent / 60000);
                if (minutes >= 1 && !this.userSession.milestones?.time1min) {
                    this.recordMilestone('time1min', '浏览时间达到1分钟');
                }
                if (minutes >= 5 && !this.userSession.milestones?.time5min) {
                    this.recordMilestone('time5min', '浏览时间达到5分钟');
                }
                if (minutes >= 10 && !this.userSession.milestones?.time10min) {
                    this.recordMilestone('time10min', '浏览时间达到10分钟');
                }
            }
        }, 1000);
    }

    detectExitIntent() {
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseY = e.clientY;
        });
        
        document.addEventListener('mouseleave', (e) => {
            if (mouseY < 100 && !this.userSession.exitIntentShown) {
                this.showExitIntentPopup();
                this.userSession.exitIntentShown = true;
            }
        });
    }

    showExitIntentPopup() {
        const popup = document.createElement('div');
        popup.className = 'exit-intent-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h3>等等，别走！</h3>
                <p>发现了${this.userSession.viewedTools.length}个AI工具，要不要收藏一下？</p>
                <div class="popup-actions">
                    <button class="btn-primary" onclick="this.closest('.exit-intent-popup').style.display='none'">继续浏览</button>
                    <button class="btn-secondary" onclick="this.showBookmarkGuide()">收藏网站</button>
                </div>
            </div>
        `;
        
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 10000);
    }

    recordMilestone(type, description) {
        if (!this.userSession.milestones) {
            this.userSession.milestones = {};
        }
        
        this.userSession.milestones[type] = {
            achieved: true,
            timestamp: Date.now(),
            description: description
        };
        
        this.showMilestoneNotification(description);
        this.saveUserSession();
    }

    showMilestoneNotification(description) {
        this.showNotification(`🎉 成就解锁：${description}`, 'milestone', 3000);
    }

    recordInteraction(type, data) {
        if (!this.userSession.interactions_log) {
            this.userSession.interactions_log = [];
        }
        
        this.userSession.interactions_log.push({
            type: type,
            data: data,
            timestamp: Date.now()
        });
        
        // 限制交互日志数量
        if (this.userSession.interactions_log.length > 200) {
            this.userSession.interactions_log = this.userSession.interactions_log.slice(-100);
        }
    }

    calculateEngagementScore() {
        const timeScore = Math.min(this.userSession.timeSpent / 300000, 1) * 30; // 最多30分
        const interactionScore = Math.min(this.userSession.interactions / 20, 1) * 25; // 最多25分
        const scrollScore = (this.userSession.scrollDepth / 100) * 20; // 最多20分
        const viewScore = Math.min(this.userSession.viewedTools.length / 10, 1) * 15; // 最多15分
        const returnScore = this.userSession.isReturningUser ? 10 : 0; // 最多10分
        
        this.userSession.engagementScore = Math.round(timeScore + interactionScore + scrollScore + viewScore + returnScore);
    }

    // 实施个性化
    implementPersonalization() {
        // 基于用户行为个性化内容
        this.personalizeContent();
        
        // 个性化推荐
        this.personalizeRecommendations();
        
        // 个性化界面
        this.personalizeInterface();
    }

    personalizeContent() {
        // 基于查看历史调整内容顺序
        if (this.userSession.viewedTools.length > 0) {
            this.reorderContentByPreference();
        }
        
        // 基于搜索历史高亮相关内容
        if (this.userSession.searchQueries.length > 0) {
            this.highlightRelevantContent();
        }
    }

    reorderContentByPreference() {
        const toolCards = document.querySelectorAll('.tool-card');
        const categories = this.extractUserPreferredCategories();
        
        // 重新排序工具卡片
        toolCards.forEach(card => {
            const toolCategory = this.extractToolCategory(card);
            if (categories.includes(toolCategory)) {
                card.style.order = '-1'; // 优先显示
                card.classList.add('recommended-for-you');
            }
        });
    }

    extractUserPreferredCategories() {
        const categoryCount = {};
        
        this.userSession.viewedTools.forEach(tool => {
            const category = this.getToolCategory(tool);
            if (category) {
                categoryCount[category] = (categoryCount[category] || 0) + 1;
            }
        });
        
        return Object.entries(categoryCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([category]) => category);
    }

    getToolCategory(toolName) {
        // 简化的分类逻辑
        const categories = {
            'AI绘画': ['midjourney', 'dall-e', 'stable diffusion', 'leonardo'],
            'AI写作': ['chatgpt', 'claude', 'jasper', 'copyai'],
            'AI视频': ['runway', 'pika', 'luma'],
            'AI音频': ['elevenlabs', 'suno', 'udio']
        };
        
        for (const [category, tools] of Object.entries(categories)) {
            if (tools.some(tool => toolName.toLowerCase().includes(tool))) {
                return category;
            }
        }
        
        return 'AI工具';
    }

    highlightRelevantContent() {
        const recentQueries = this.userSession.searchQueries.slice(-5);
        const keywords = recentQueries.map(q => q.query.toLowerCase());
        
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const isRelevant = keywords.some(keyword => cardText.includes(keyword));
            
            if (isRelevant) {
                card.classList.add('search-relevant');
                card.style.border = '2px solid #667eea';
            }
        });
    }

    personalizeInterface() {
        // 基于用户偏好调整界面
        if (this.userSession.preferredTheme) {
            document.body.classList.add(this.userSession.preferredTheme);
        }
        
        // 基于设备类型优化
        if (this.isMobileDevice()) {
            document.body.classList.add('mobile-optimized');
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 添加推荐引擎
    addRecommendationEngine() {
        this.generateRecommendations();
        this.displayRecommendations();
        
        // 定期更新推荐
        setInterval(() => {
            this.updateRecommendations();
        }, 300000); // 5分钟
    }

    generateRecommendations() {
        this.recommendations = [];
        
        // 基于查看历史的推荐
        this.addViewHistoryRecommendations();
        
        // 基于搜索历史的推荐
        this.addSearchHistoryRecommendations();
        
        // 基于用户类型的推荐
        this.addUserTypeRecommendations();
        
        // 热门推荐
        this.addTrendingRecommendations();
    }

    addViewHistoryRecommendations() {
        const preferredCategories = this.extractUserPreferredCategories();
        
        preferredCategories.forEach(category => {
            this.recommendations.push({
                type: 'category',
                category: category,
                reason: `基于您对${category}的兴趣`,
                priority: 'high'
            });
        });
    }

    addSearchHistoryRecommendations() {
        const recentQueries = this.userSession.searchQueries.slice(-3);
        
        recentQueries.forEach(queryObj => {
            this.recommendations.push({
                type: 'search',
                query: queryObj.query,
                reason: `基于您搜索"${queryObj.query}"`,
                priority: 'medium'
            });
        });
    }

    addUserTypeRecommendations() {
        if (this.userSession.isReturningUser) {
            this.recommendations.push({
                type: 'returning_user',
                reason: '为老用户推荐的新工具',
                priority: 'medium'
            });
        } else {
            this.recommendations.push({
                type: 'new_user',
                reason: '新手推荐工具',
                priority: 'high'
            });
        }
    }

    addTrendingRecommendations() {
        this.recommendations.push({
            type: 'trending',
            reason: '当前热门AI工具',
            priority: 'low'
        });
    }

    displayRecommendations() {
        const recommendationContainer = document.createElement('div');
        recommendationContainer.className = 'recommendation-container';
        recommendationContainer.innerHTML = `
            <h3>🎯 为您推荐</h3>
            <div class="recommendation-list"></div>
        `;
        
        // 添加样式
        this.addRecommendationStyles();
        
        // 插入到合适位置
        const mainContent = document.querySelector('.main-content, main');
        if (mainContent) {
            mainContent.insertBefore(recommendationContainer, mainContent.firstChild);
        }
        
        this.updateRecommendationDisplay();
    }

    updateRecommendations() {
        this.generateRecommendations();
        this.updateRecommendationDisplay();
    }

    updateRecommendationDisplay() {
        const recommendationList = document.querySelector('.recommendation-list');
        if (!recommendationList) return;
        
        const topRecommendations = this.recommendations
            .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .slice(0, 3);
        
        recommendationList.innerHTML = topRecommendations.map(rec => `
            <div class="recommendation-item" data-type="${rec.type}">
                <span class="recommendation-reason">${rec.reason}</span>
                <button class="recommendation-action" onclick="window.userEngagementOptimizer.handleRecommendationClick('${rec.type}')">
                    查看推荐
                </button>
            </div>
        `).join('');
    }

    handleRecommendationClick(type) {
        this.recordInteraction('recommendation_click', { type });
        
        // 根据推荐类型执行相应操作
        switch (type) {
            case 'category':
                this.showCategoryRecommendations();
                break;
            case 'search':
                this.showSearchRecommendations();
                break;
            case 'trending':
                this.showTrendingTools();
                break;
            default:
                this.showGeneralRecommendations();
        }
    }

    addRecommendationStyles() {
        const styles = `
            .recommendation-container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            
            .recommendation-container h3 {
                margin: 0 0 15px 0;
                font-size: 18px;
            }
            
            .recommendation-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .recommendation-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.1);
                padding: 10px 15px;
                border-radius: 5px;
            }
            
            .recommendation-reason {
                font-size: 14px;
            }
            
            .recommendation-action {
                background: white;
                color: #667eea;
                border: none;
                padding: 5px 15px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
            }
            
            .recommendation-action:hover {
                background: #f0f0f0;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // 设置通知系统
    setupNotificationSystem() {
        this.createNotificationContainer();
        
        // 定期检查是否需要发送通知
        setInterval(() => {
            this.checkForNotifications();
        }, 60000); // 1分钟
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 300px;
        `;
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;
        
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        
        // 自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
        
        // 添加动画样式
        this.addNotificationStyles();
    }

    getNotificationColor(type) {
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336',
            milestone: '#9C27B0',
            welcome: '#667eea'
        };
        return colors[type] || colors.info;
    }

    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const styles = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                margin-left: 10px;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    checkForNotifications() {
        const now = Date.now();
        const sessionDuration = now - this.userSession.startTime;
        
        // 长时间浏览提醒
        if (sessionDuration > 1800000 && !this.userSession.longSessionNotified) { // 30分钟
            this.showNotification('您已经浏览了30分钟，要不要休息一下？', 'info', 8000);
            this.userSession.longSessionNotified = true;
        }
        
        // 推荐新工具
        if (this.userSession.viewedTools.length > 5 && !this.userSession.recommendationNotified) {
            this.showNotification('基于您的浏览历史，我们为您推荐了一些新工具！', 'success', 6000);
            this.userSession.recommendationNotified = true;
        }
    }

    // 添加游戏化元素
    addGamificationElements() {
        this.createProgressBar();
        this.addAchievementSystem();
        this.addPointsSystem();
        this.createLeaderboard();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'exploration-progress';
        progressBar.innerHTML = `
            <div class="progress-label">探索进度</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">已发现 0 个AI工具</div>
        `;
        
        progressBar.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            min-width: 200px;
            z-index: 1000;
        `;
        
        document.body.appendChild(progressBar);
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const totalTools = document.querySelectorAll('.tool-card').length;
            const viewedCount = this.userSession.viewedTools.length;
            const percentage = totalTools > 0 ? (viewedCount / totalTools) * 100 : 0;
            
            progressFill.style.width = percentage + '%';
            progressText.textContent = `已发现 ${viewedCount} 个AI工具`;
            
            // 添加进度条样式
            this.addProgressBarStyles();
        }
    }

    addProgressBarStyles() {
        if (document.getElementById('progress-bar-styles')) return;
        
        const styles = `
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin: 8px 0;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.3s ease;
            }
            
            .progress-label {
                font-size: 12px;
                font-weight: 500;
                color: #666;
            }
            
            .progress-text {
                font-size: 12px;
                color: #333;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'progress-bar-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addAchievementSystem() {
        // 定义成就
        this.achievements = [
            { id: 'first_visit', name: '初来乍到', description: '首次访问网站', points: 10 },
            { id: 'explorer', name: '探索者', description: '查看10个AI工具', points: 50 },
            { id: 'enthusiast', name: '爱好者', description: '查看50个AI工具', points: 200 },
            { id: 'expert', name: '专家', description: '查看100个AI工具', points: 500 },
            { id: 'searcher', name: '搜索达人', description: '进行10次搜索', points: 30 },
            { id: 'loyal_user', name: '忠实用户', description: '连续7天访问', points: 100 }
        ];
        
        this.checkAchievements();
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.userSession.achievements?.includes(achievement.id)) {
                if (this.isAchievementUnlocked(achievement)) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    isAchievementUnlocked(achievement) {
        switch (achievement.id) {
            case 'first_visit':
                return true;
            case 'explorer':
                return this.userSession.viewedTools.length >= 10;
            case 'enthusiast':
                return this.userSession.viewedTools.length >= 50;
            case 'expert':
                return this.userSession.viewedTools.length >= 100;
            case 'searcher':
                return this.userSession.searchQueries.length >= 10;
            case 'loyal_user':
                return this.userSession.isReturningUser && this.userSession.daysSinceLastVisit <= 1;
            default:
                return false;
        }
    }

    unlockAchievement(achievement) {
        if (!this.userSession.achievements) {
            this.userSession.achievements = [];
        }
        
        this.userSession.achievements.push(achievement.id);
        this.userSession.points = (this.userSession.points || 0) + achievement.points;
        
        this.showNotification(
            `🏆 成就解锁：${achievement.name} (+${achievement.points}分)`,
            'milestone',
            5000
        );
        
        this.saveUserSession();
    }

    addPointsSystem() {
        // 创建积分显示
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'points-display';
        pointsDisplay.innerHTML = `
            <div class="points-icon">⭐</div>
            <div class="points-value">${this.userSession.points || 0}</div>
        `;
        
        pointsDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #667eea;
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
            font-weight: 500;
            z-index: 1000;
        `;
        
        document.body.appendChild(pointsDisplay);
    }

    // 实施留存策略
    implementRetentionStrategies() {
        // 收藏提醒
        this.addBookmarkReminder();
        
        // 定期内容更新通知
        this.scheduleContentUpdates();
        
        // 个性化邮件订阅（如果支持）
        this.addEmailSubscription();
        
        // 社交分享激励
        this.addSocialSharingIncentives();
    }

    addBookmarkReminder() {
        if (!this.userSession.bookmarkReminderShown && this.userSession.viewedTools.length >= 5) {
            setTimeout(() => {
                this.showNotification(
                    '发现了这么多有用的AI工具，要不要收藏一下网站？ <button onclick="window.userEngagementOptimizer.showBookmarkGuide()" style="background:none;border:none;color:yellow;text-decoration:underline;cursor:pointer;">点击收藏</button>',
                    'info',
                    10000
                );
                this.userSession.bookmarkReminderShown = true;
                this.saveUserSession();
            }, 300000); // 5分钟后
        }
    }

    showBookmarkGuide() {
        const guide = document.createElement('div');
        guide.className = 'bookmark-guide';
        guide.innerHTML = `
            <div class="guide-content">
                <h3>收藏网站到书签</h3>
                <div class="guide-steps">
                    <div class="step">
                        <strong>Chrome/Edge:</strong> 按 Ctrl+D (Windows) 或 Cmd+D (Mac)
                    </div>
                    <div class="step">
                        <strong>Firefox:</strong> 按 Ctrl+D (Windows) 或 Cmd+D (Mac)
                    </div>
                    <div class="step">
                        <strong>Safari:</strong> 按 Cmd+D
                    </div>
                </div>
                <button onclick="this.closest('.bookmark-guide').remove()">知道了</button>
            </div>
        `;
        
        guide.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 400px;
        `;
        
        document.body.appendChild(guide);
    }

    // 设置分析
    setupAnalytics() {
        // 定期发送分析数据
        setInterval(() => {
            this.sendAnalytics();
        }, 300000); // 5分钟
        
        // 页面卸载时发送最终数据
        window.addEventListener('beforeunload', () => {
            this.sendAnalytics(true);
        });
    }

    sendAnalytics(isFinal = false) {
        const analyticsData = {
            userId: this.userSession.userId,
            sessionId: this.userSession.startTime,
            timestamp: Date.now(),
            timeSpent: this.userSession.timeSpent,
            pageViews: this.userSession.pageViews,
            interactions: this.userSession.interactions,
            scrollDepth: this.userSession.scrollDepth,
            viewedTools: this.userSession.viewedTools.length,
            searchQueries: this.userSession.searchQueries.length,
            engagementScore: this.userSession.engagementScore,
            isReturningUser: this.userSession.isReturningUser,
            achievements: this.userSession.achievements?.length || 0,
            points: this.userSession.points || 0,
            isFinal: isFinal
        };
        
        // 发送到分析服务（如果配置了）
        if (window.gtag && window.cookieConsent?.hasConsent('analytics')) {
            gtag('event', 'user_engagement', analyticsData);
        }
        
        console.log('📊 Analytics Data:', analyticsData);
    }

    // 开始参与度监控
    startEngagementMonitoring() {
        setInterval(() => {
            this.calculateEngagementScore();
            this.updateProgressBar();
            this.checkAchievements();
            this.saveUserSession();
        }, 30000); // 30秒
    }

    showOnboardingTour() {
        const tour = document.createElement('div');
        tour.className = 'onboarding-tour';
        tour.innerHTML = `
            <div class="tour-content">
                <h2>欢迎来到 AINAV.ART！</h2>
                <p>这里是全球最全的AI工具导航网站，让我们来快速了解一下：</p>
                <div class="tour-features">
                    <div class="feature">🔍 搜索功能：快速找到您需要的AI工具</div>
                    <div class="feature">📂 分类浏览：按类别探索不同的AI应用</div>
                    <div class="feature">⭐ 收藏功能：保存您喜欢的工具</div>
                    <div class="feature">🎯 个性化推荐：基于您的兴趣推荐工具</div>
                </div>
                <div class="tour-actions">
                    <button onclick="this.closest('.onboarding-tour').remove()">开始探索</button>
                </div>
            </div>
        `;
        
        tour.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        `;
        
        document.body.appendChild(tour);
    }

    // 公共方法
    getUserSession() {
        return this.userSession;
    }

    getEngagementMetrics() {
        return {
            ...this.engagementMetrics,
            currentEngagementScore: this.userSession.engagementScore,
            sessionDuration: Date.now() - this.userSession.startTime,
            toolsViewed: this.userSession.viewedTools.length,
            searchesPerformed: this.userSession.searchQueries.length
        };
    }

    resetUserSession() {
        localStorage.removeItem('ainav_user_session');
        this.userSession = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0,
            timeSpent: 0,
            scrollDepth: 0,
            clicksCount: 0,
            searchQueries: [],
            viewedTools: [],
            preferences: {},
            engagementScore: 0
        };
    }
}

// 初始化用户参与度优化器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.userEngagementOptimizer = new UserEngagementOptimizer();
    }, 2000);
});

// 导出给其他脚本使用
window.UserEngagementOptimizer = UserEngagementOptimizer;
