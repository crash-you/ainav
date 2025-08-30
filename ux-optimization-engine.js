/**
 * AINAV.ART 用户体验优化引擎
 * 智能UI优化、个性化推荐、A/B测试、用户行为分析
 */

class UXOptimizationEngine {
    constructor() {
        this.config = {
            enablePersonalization: true,
            enableABTesting: true,
            enableSmartRecommendations: true,
            enableAdaptiveUI: true,
            enablePerformanceOptimization: true,
            enableAccessibility: true,
            abTestSampleRate: 0.5, // 50%的用户参与A/B测试
            recommendationRefreshInterval: 300000, // 5分钟
            uiAdaptationThreshold: 3 // 3次交互后开始适应
        };

        this.userProfile = this.initializeUserProfile();
        this.abTests = new Map();
        this.uiAdaptations = new Map();
        this.performanceMetrics = new Map();
        this.accessibilityFeatures = new Set();
        
        this.init();
    }

    // 初始化优化引擎
    init() {
        this.setupUserProfiling();
        this.setupABTesting();
        this.setupSmartRecommendations();
        this.setupAdaptiveUI();
        this.setupPerformanceOptimization();
        this.setupAccessibilityFeatures();
        this.setupPersonalization();
        
        console.log('🎯 UX Optimization Engine Initialized');
        this.logUserProfile();
    }

    // 初始化用户画像
    initializeUserProfile() {
        const stored = localStorage.getItem('ainav_user_profile');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.warn('Failed to parse user profile:', error);
            }
        }

        return {
            id: this.generateUserId(),
            createdAt: Date.now(),
            lastActive: Date.now(),
            
            // 基本信息
            deviceType: this.detectDeviceType(),
            browserType: this.detectBrowserType(),
            screenSize: this.getScreenSize(),
            preferredLanguage: this.detectLanguage(),
            timezone: this.getTimezone(),
            
            // 行为数据
            visitCount: 1,
            totalTimeSpent: 0,
            averageSessionTime: 0,
            bounceRate: 0,
            
            // 偏好数据
            favoriteCategories: [],
            favoriteTools: [],
            searchPatterns: [],
            clickPatterns: [],
            
            // 交互偏好
            preferredViewMode: 'grid', // grid, list, card
            preferredSortOrder: 'popularity',
            preferredTheme: 'auto', // light, dark, auto
            
            // 个性化设置
            showRecommendations: true,
            enableAnimations: true,
            enableNotifications: false,
            
            // A/B测试组
            abTestGroups: {},
            
            // 可访问性需求
            accessibilityNeeds: {
                highContrast: false,
                largeText: false,
                reducedMotion: false,
                screenReader: false
            },
            
            // 性能偏好
            performanceProfile: {
                connectionSpeed: 'unknown',
                devicePerformance: 'unknown',
                preferLowBandwidth: false
            }
        };
    }

    // 设置用户画像
    setupUserProfiling() {
        // 检测连接速度
        this.detectConnectionSpeed();
        
        // 检测设备性能
        this.detectDevicePerformance();
        
        // 检测可访问性需求
        this.detectAccessibilityNeeds();
        
        // 监听用户行为
        this.setupBehaviorTracking();
        
        // 定期更新用户画像
        setInterval(() => {
            this.updateUserProfile();
        }, 60000); // 每分钟更新一次
    }

    // 检测连接速度
    detectConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.userProfile.performanceProfile.connectionSpeed = connection.effectiveType;
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.userProfile.performanceProfile.preferLowBandwidth = true;
                this.enableLowBandwidthMode();
            }
        }

        // 使用图片加载测试连接速度
        const startTime = Date.now();
        const testImage = new Image();
        testImage.onload = () => {
            const loadTime = Date.now() - startTime;
            if (loadTime > 2000) {
                this.userProfile.performanceProfile.preferLowBandwidth = true;
                this.enableLowBandwidthMode();
            }
        };
        testImage.src = './assets/images/speed-test.png?' + Date.now();
    }

    // 检测设备性能
    detectDevicePerformance() {
        // 使用硬件并发数估算性能
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        
        let performanceLevel = 'medium';
        if (cores >= 8 && memory >= 8) {
            performanceLevel = 'high';
        } else if (cores <= 2 || memory <= 2) {
            performanceLevel = 'low';
        }
        
        this.userProfile.performanceProfile.devicePerformance = performanceLevel;
        
        if (performanceLevel === 'low') {
            this.enableLowPerformanceMode();
        }
    }

    // 检测可访问性需求
    detectAccessibilityNeeds() {
        // 检测高对比度偏好
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.userProfile.accessibilityNeeds.highContrast = true;
            this.enableHighContrastMode();
        }

        // 检测减少动画偏好
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.userProfile.accessibilityNeeds.reducedMotion = true;
            this.enableReducedMotionMode();
        }

        // 检测屏幕阅读器
        if (navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS')) {
            this.userProfile.accessibilityNeeds.screenReader = true;
            this.enableScreenReaderMode();
        }
    }

    // 设置行为跟踪
    setupBehaviorTracking() {
        let sessionStartTime = Date.now();
        let interactionCount = 0;

        // 跟踪点击行为
        document.addEventListener('click', (event) => {
            interactionCount++;
            this.trackClickBehavior(event);
            
            // 达到阈值后开始UI适应
            if (interactionCount >= this.config.uiAdaptationThreshold) {
                this.adaptUI();
            }
        });

        // 跟踪滚动行为
        let scrollTimer;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.trackScrollBehavior();
            }, 100);
        });

        // 跟踪页面停留时间
        window.addEventListener('beforeunload', () => {
            const sessionTime = Date.now() - sessionStartTime;
            this.updateSessionTime(sessionTime);
        });

        // 跟踪搜索行为
        this.setupSearchTracking();
    }

    // 跟踪点击行为
    trackClickBehavior(event) {
        const element = event.target;
        const clickData = {
            timestamp: Date.now(),
            elementType: element.tagName,
            className: element.className,
            position: this.getElementPosition(element),
            category: this.categorizeElement(element)
        };

        this.userProfile.clickPatterns.push(clickData);
        
        // 只保留最近100次点击
        if (this.userProfile.clickPatterns.length > 100) {
            this.userProfile.clickPatterns = this.userProfile.clickPatterns.slice(-100);
        }

        // 分析点击偏好
        this.analyzeClickPreferences();
    }

    // 分析点击偏好
    analyzeClickPreferences() {
        const recentClicks = this.userProfile.clickPatterns.slice(-20);
        const categoryCount = {};
        
        recentClicks.forEach(click => {
            categoryCount[click.category] = (categoryCount[click.category] || 0) + 1;
        });

        // 更新偏好分类
        const sortedCategories = Object.entries(categoryCount)
            .sort(([,a], [,b]) => b - a)
            .map(([category]) => category);

        this.userProfile.favoriteCategories = sortedCategories.slice(0, 5);
    }

    // 设置A/B测试
    setupABTesting() {
        if (!this.config.enableABTesting) return;

        // 定义A/B测试
        this.defineABTests();
        
        // 为用户分配测试组
        this.assignUserToTests();
        
        // 应用测试变体
        this.applyTestVariants();
    }

    // 定义A/B测试
    defineABTests() {
        this.abTests.set('homepage_layout', {
            name: '首页布局测试',
            variants: {
                control: { name: '原始布局', weight: 50 },
                variant_a: { name: '卡片布局', weight: 25 },
                variant_b: { name: '列表布局', weight: 25 }
            },
            metrics: ['click_rate', 'time_on_page', 'conversion_rate'],
            startDate: Date.now(),
            endDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30天
        });

        this.abTests.set('search_interface', {
            name: '搜索界面测试',
            variants: {
                control: { name: '标准搜索', weight: 50 },
                variant_a: { name: '智能建议', weight: 50 }
            },
            metrics: ['search_success_rate', 'search_time'],
            startDate: Date.now(),
            endDate: Date.now() + (14 * 24 * 60 * 60 * 1000) // 14天
        });

        this.abTests.set('recommendation_algorithm', {
            name: '推荐算法测试',
            variants: {
                control: { name: '基于流行度', weight: 33 },
                variant_a: { name: '基于相似度', weight: 33 },
                variant_b: { name: '混合算法', weight: 34 }
            },
            metrics: ['recommendation_click_rate', 'user_satisfaction'],
            startDate: Date.now(),
            endDate: Date.now() + (21 * 24 * 60 * 60 * 1000) // 21天
        });
    }

    // 为用户分配测试组
    assignUserToTests() {
        if (Math.random() > this.config.abTestSampleRate) {
            return; // 不参与A/B测试
        }

        this.abTests.forEach((test, testId) => {
            if (!this.userProfile.abTestGroups[testId]) {
                const variant = this.selectVariant(test.variants);
                this.userProfile.abTestGroups[testId] = variant;
                
                // 记录测试分配
                this.trackABTestEvent(testId, 'assigned', { variant });
            }
        });
    }

    // 选择变体
    selectVariant(variants) {
        const random = Math.random() * 100;
        let cumulative = 0;
        
        for (const [variantId, variant] of Object.entries(variants)) {
            cumulative += variant.weight;
            if (random <= cumulative) {
                return variantId;
            }
        }
        
        return 'control';
    }

    // 应用测试变体
    applyTestVariants() {
        Object.entries(this.userProfile.abTestGroups).forEach(([testId, variant]) => {
            this.applyVariant(testId, variant);
        });
    }

    // 应用变体
    applyVariant(testId, variant) {
        switch (testId) {
            case 'homepage_layout':
                this.applyHomepageLayoutVariant(variant);
                break;
            case 'search_interface':
                this.applySearchInterfaceVariant(variant);
                break;
            case 'recommendation_algorithm':
                this.applyRecommendationAlgorithmVariant(variant);
                break;
        }
    }

    // 应用首页布局变体
    applyHomepageLayoutVariant(variant) {
        const container = document.querySelector('.tools-container');
        if (!container) return;

        switch (variant) {
            case 'variant_a':
                container.classList.add('card-layout');
                break;
            case 'variant_b':
                container.classList.add('list-layout');
                break;
        }
    }

    // 设置智能推荐
    setupSmartRecommendations() {
        if (!this.config.enableSmartRecommendations) return;

        // 生成个性化推荐
        this.generatePersonalizedRecommendations();
        
        // 定期更新推荐
        setInterval(() => {
            this.updateRecommendations();
        }, this.config.recommendationRefreshInterval);
    }

    // 生成个性化推荐
    generatePersonalizedRecommendations() {
        const recommendations = [];
        
        // 基于用户偏好分类推荐
        this.userProfile.favoriteCategories.forEach(category => {
            const categoryTools = this.getCategoryTools(category);
            recommendations.push(...categoryTools.slice(0, 2));
        });

        // 基于相似用户推荐
        const similarUsers = this.findSimilarUsers();
        similarUsers.forEach(user => {
            recommendations.push(...user.favoriteTools.slice(0, 1));
        });

        // 基于趋势推荐
        const trendingTools = this.getTrendingTools();
        recommendations.push(...trendingTools.slice(0, 3));

        // 去重并限制数量
        const uniqueRecommendations = [...new Set(recommendations)].slice(0, 6);
        
        this.displayRecommendations(uniqueRecommendations);
    }

    // 设置自适应UI
    setupAdaptiveUI() {
        if (!this.config.enableAdaptiveUI) return;

        // 根据设备类型调整UI
        this.adaptToDeviceType();
        
        // 根据用户行为调整UI
        this.adaptToUserBehavior();
        
        // 根据性能调整UI
        this.adaptToPerformance();
    }

    // 适应设备类型
    adaptToDeviceType() {
        const deviceType = this.userProfile.deviceType;
        
        if (deviceType === 'mobile') {
            document.body.classList.add('mobile-optimized');
            this.enableMobileOptimizations();
        } else if (deviceType === 'tablet') {
            document.body.classList.add('tablet-optimized');
            this.enableTabletOptimizations();
        }
    }

    // 启用移动端优化
    enableMobileOptimizations() {
        // 增大点击目标
        const style = document.createElement('style');
        style.textContent = `
            .mobile-optimized .clickable {
                min-height: 44px;
                min-width: 44px;
            }
            .mobile-optimized .nav-item {
                padding: 15px;
            }
        `;
        document.head.appendChild(style);

        // 启用触摸手势
        this.enableTouchGestures();
    }

    // 启用触摸手势
    enableTouchGestures() {
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // 检测滑动手势
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    // 设置性能优化
    setupPerformanceOptimization() {
        if (!this.config.enablePerformanceOptimization) return;

        // 图片懒加载
        this.setupLazyLoading();
        
        // 预加载关键资源
        this.preloadCriticalResources();
        
        // 优化动画
        this.optimizeAnimations();
        
        // 监控性能
        this.monitorPerformance();
    }

    // 设置懒加载
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // 启用低带宽模式
    enableLowBandwidthMode() {
        document.body.classList.add('low-bandwidth');
        
        // 禁用非关键图片
        document.querySelectorAll('img:not(.critical)').forEach(img => {
            img.style.display = 'none';
        });

        // 简化动画
        document.querySelectorAll('.animated').forEach(el => {
            el.classList.remove('animated');
        });

        console.log('🚀 Low bandwidth mode enabled');
    }

    // 启用低性能模式
    enableLowPerformanceMode() {
        document.body.classList.add('low-performance');
        
        // 禁用复杂动画
        const style = document.createElement('style');
        style.textContent = `
            .low-performance * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);

        console.log('⚡ Low performance mode enabled');
    }

    // 启用高对比度模式
    enableHighContrastMode() {
        document.body.classList.add('high-contrast');
        this.accessibilityFeatures.add('high-contrast');
        console.log('🎨 High contrast mode enabled');
    }

    // 启用减少动画模式
    enableReducedMotionMode() {
        document.body.classList.add('reduced-motion');
        this.accessibilityFeatures.add('reduced-motion');
        console.log('🎭 Reduced motion mode enabled');
    }

    // 启用屏幕阅读器模式
    enableScreenReaderMode() {
        document.body.classList.add('screen-reader');
        this.accessibilityFeatures.add('screen-reader');
        
        // 添加更多ARIA标签
        this.enhanceARIALabels();
        
        console.log('📢 Screen reader mode enabled');
    }

    // 增强ARIA标签
    enhanceARIALabels() {
        // 为所有按钮添加描述性标签
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        });

        // 为链接添加描述
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            const text = link.textContent.trim();
            if (text) {
                link.setAttribute('aria-label', `链接到 ${text}`);
            }
        });
    }

    // 设置个性化
    setupPersonalization() {
        if (!this.config.enablePersonalization) return;

        // 应用用户偏好
        this.applyUserPreferences();
        
        // 个性化内容
        this.personalizeContent();
        
        // 个性化界面
        this.personalizeInterface();
    }

    // 应用用户偏好
    applyUserPreferences() {
        const { preferredTheme, preferredViewMode, enableAnimations } = this.userProfile;
        
        // 应用主题
        if (preferredTheme !== 'auto') {
            document.body.classList.add(`theme-${preferredTheme}`);
        }

        // 应用视图模式
        const container = document.querySelector('.tools-container');
        if (container) {
            container.classList.add(`view-${preferredViewMode}`);
        }

        // 控制动画
        if (!enableAnimations) {
            document.body.classList.add('no-animations');
        }
    }

    // 个性化内容
    personalizeContent() {
        // 根据用户偏好排序工具
        this.sortToolsByPreference();
        
        // 高亮推荐工具
        this.highlightRecommendedTools();
        
        // 隐藏不相关内容
        this.hideIrrelevantContent();
    }

    // 更新用户画像
    updateUserProfile() {
        this.userProfile.lastActive = Date.now();
        this.userProfile.visitCount++;
        
        // 保存到localStorage
        localStorage.setItem('ainav_user_profile', JSON.stringify(this.userProfile));
    }

    // 跟踪A/B测试事件
    trackABTestEvent(testId, eventType, data = {}) {
        const event = {
            testId,
            eventType,
            variant: this.userProfile.abTestGroups[testId],
            timestamp: Date.now(),
            data
        };

        // 发送到分析系统
        if (window.aiNavAnalytics) {
            window.aiNavAnalytics.trackEvent('ab_test_event', event);
        }
    }

    // 辅助方法
    generateUserId() {
        return 'ux_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    detectDeviceType() {
        const userAgent = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
            return 'tablet';
        }
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
            return 'mobile';
        }
        return 'desktop';
    }

    detectBrowserType() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'chrome';
        if (userAgent.includes('Firefox')) return 'firefox';
        if (userAgent.includes('Safari')) return 'safari';
        if (userAgent.includes('Edge')) return 'edge';
        return 'other';
    }

    getScreenSize() {
        return {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight
        };
    }

    detectLanguage() {
        return navigator.language || navigator.userLanguage || 'zh-CN';
    }

    getTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        };
    }

    categorizeElement(element) {
        if (element.matches('.tool-item, .tool-card')) return 'tool';
        if (element.matches('.category-btn, .nav-item')) return 'navigation';
        if (element.matches('a[href*="detail"]')) return 'detail_link';
        if (element.matches('button, .btn')) return 'button';
        return 'other';
    }

    logUserProfile() {
        console.log('👤 User Profile:', {
            id: this.userProfile.id,
            deviceType: this.userProfile.deviceType,
            visitCount: this.userProfile.visitCount,
            favoriteCategories: this.userProfile.favoriteCategories,
            abTestGroups: this.userProfile.abTestGroups,
            accessibilityFeatures: Array.from(this.accessibilityFeatures)
        });
    }

    // 公共API
    getUserProfile() {
        return this.userProfile;
    }

    getABTestVariant(testId) {
        return this.userProfile.abTestGroups[testId] || 'control';
    }

    updatePreference(key, value) {
        this.userProfile[key] = value;
        this.updateUserProfile();
        this.applyUserPreferences();
    }

    exportUserData() {
        const data = {
            profile: this.userProfile,
            abTests: Object.fromEntries(this.abTests),
            accessibilityFeatures: Array.from(this.accessibilityFeatures),
            timestamp: Date.now()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ainav-ux-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.UXOptimizationEngine = UXOptimizationEngine;
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.aiNavUX = new UXOptimizationEngine();
        });
    } else {
        window.aiNavUX = new UXOptimizationEngine();
    }
    
    console.log('🎯 AINAV.ART UX Optimization Engine Loaded');
}

// 导出（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UXOptimizationEngine;
}
