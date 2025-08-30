/**
 * AINAV.ART 高级分析和性能监控系统
 * 深度用户行为分析、性能监控、SEO跟踪
 */

class AdvancedAnalytics {
    constructor() {
        this.config = {
            trackingId: 'AINAV_ANALYTICS_V2',
            apiEndpoint: '/api/analytics',
            batchSize: 10,
            flushInterval: 30000, // 30秒
            enableHeatmap: true,
            enableScrollTracking: true,
            enableClickTracking: true,
            enablePerformanceMonitoring: true,
            enableSEOTracking: true,
            enableUserJourney: true
        };
        
        this.eventQueue = [];
        this.userSession = this.initializeSession();
        this.performanceMetrics = {};
        this.seoMetrics = {};
        this.userBehavior = {
            scrollDepth: 0,
            timeOnPage: 0,
            clicks: [],
            hovers: [],
            formInteractions: []
        };
        
        this.init();
    }

    // 初始化分析系统
    init() {
        this.setupPerformanceMonitoring();
        this.setupUserBehaviorTracking();
        this.setupSEOTracking();
        this.setupHeatmapTracking();
        this.setupErrorTracking();
        this.setupConversionTracking();
        this.startBatchProcessor();
        
        console.log('🚀 Advanced Analytics System Initialized');
    }

    // 初始化用户会话
    initializeSession() {
        const sessionId = this.generateSessionId();
        const session = {
            id: sessionId,
            startTime: Date.now(),
            userId: this.getUserId(),
            deviceInfo: this.getDeviceInfo(),
            browserInfo: this.getBrowserInfo(),
            referrer: document.referrer,
            landingPage: window.location.href,
            utmParams: this.getUTMParams(),
            pageViews: [],
            events: []
        };
        
        // 存储到localStorage
        localStorage.setItem('ainav_session', JSON.stringify(session));
        return session;
    }

    // 性能监控设置
    setupPerformanceMonitoring() {
        if (!this.config.enablePerformanceMonitoring) return;

        // 页面加载性能
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectPerformanceMetrics();
            }, 1000);
        });

        // Core Web Vitals监控
        this.observeWebVitals();
        
        // 资源加载监控
        this.monitorResourceLoading();
        
        // 内存使用监控
        this.monitorMemoryUsage();
    }

    // 收集性能指标
    collectPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        this.performanceMetrics = {
            // 页面加载时间
            pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstByte: navigation.responseStart - navigation.fetchStart,
            
            // 渲染时间
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            
            // 网络性能
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcpConnect: navigation.connectEnd - navigation.connectStart,
            sslHandshake: navigation.connectEnd - navigation.secureConnectionStart,
            
            // 资源统计
            resourceCount: performance.getEntriesByType('resource').length,
            
            // 页面大小
            transferSize: navigation.transferSize || 0,
            encodedBodySize: navigation.encodedBodySize || 0,
            decodedBodySize: navigation.decodedBodySize || 0
        };

        this.trackEvent('performance_metrics', this.performanceMetrics);
    }

    // Core Web Vitals监控
    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.trackEvent('core_web_vital', {
                metric: 'LCP',
                value: lastEntry.startTime,
                rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor'
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.trackEvent('core_web_vital', {
                    metric: 'FID',
                    value: entry.processingStart - entry.startTime,
                    rating: entry.processingStart - entry.startTime < 100 ? 'good' : 
                           entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor'
                });
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            this.trackEvent('core_web_vital', {
                metric: 'CLS',
                value: clsValue,
                rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    // 用户行为跟踪设置
    setupUserBehaviorTracking() {
        // 滚动深度跟踪
        if (this.config.enableScrollTracking) {
            this.setupScrollTracking();
        }

        // 点击跟踪
        if (this.config.enableClickTracking) {
            this.setupClickTracking();
        }

        // 页面停留时间
        this.setupTimeTracking();
        
        // 表单交互跟踪
        this.setupFormTracking();
        
        // 搜索行为跟踪
        this.setupSearchTracking();
    }

    // 滚动跟踪
    setupScrollTracking() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const triggered = new Set();

        const trackScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            maxScroll = Math.max(maxScroll, scrollPercent);
            this.userBehavior.scrollDepth = maxScroll;

            // 触发里程碑事件
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !triggered.has(milestone)) {
                    triggered.add(milestone);
                    this.trackEvent('scroll_milestone', {
                        milestone: milestone,
                        timeToReach: Date.now() - this.userSession.startTime
                    });
                }
            });
        };

        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(trackScroll, 100);
        });
    }

    // 点击跟踪
    setupClickTracking() {
        document.addEventListener('click', (event) => {
            const element = event.target;
            const clickData = {
                timestamp: Date.now(),
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                text: element.textContent?.substring(0, 100),
                href: element.href || null,
                coordinates: {
                    x: event.clientX,
                    y: event.clientY
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };

            this.userBehavior.clicks.push(clickData);
            
            // 特殊元素跟踪
            if (element.matches('a[href*="detail"]')) {
                this.trackEvent('tool_detail_click', {
                    toolName: this.extractToolName(element),
                    position: this.getElementPosition(element)
                });
            }
            
            if (element.matches('.category-btn, .nav-item')) {
                this.trackEvent('category_navigation', {
                    category: element.textContent?.trim(),
                    source: 'navigation'
                });
            }
        });
    }

    // SEO跟踪设置
    setupSEOTracking() {
        if (!this.config.enableSEOTracking) return;

        // 页面SEO指标收集
        this.collectSEOMetrics();
        
        // 搜索引擎来源跟踪
        this.trackSearchEngineReferrer();
        
        // 关键词排名跟踪（模拟）
        this.simulateKeywordTracking();
    }

    // 收集SEO指标
    collectSEOMetrics() {
        const title = document.querySelector('title')?.textContent || '';
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
        const h1s = document.querySelectorAll('h1');
        const images = document.querySelectorAll('img');
        const links = document.querySelectorAll('a');
        
        this.seoMetrics = {
            title: {
                text: title,
                length: title.length,
                hasKeyword: title.toLowerCase().includes('ai'),
                score: this.calculateTitleScore(title)
            },
            description: {
                text: description,
                length: description.length,
                score: this.calculateDescriptionScore(description)
            },
            keywords: {
                count: keywords.split(',').length,
                text: keywords
            },
            headings: {
                h1Count: h1s.length,
                h1Text: Array.from(h1s).map(h => h.textContent)
            },
            images: {
                total: images.length,
                withAlt: Array.from(images).filter(img => img.alt).length,
                altOptimizationRate: Array.from(images).filter(img => img.alt).length / images.length
            },
            links: {
                total: links.length,
                internal: Array.from(links).filter(link => this.isInternalLink(link.href)).length,
                external: Array.from(links).filter(link => !this.isInternalLink(link.href) && link.href).length
            },
            structuredData: this.detectStructuredData(),
            pageScore: 0
        };

        // 计算页面SEO总分
        this.seoMetrics.pageScore = this.calculatePageSEOScore();
        
        this.trackEvent('seo_metrics', this.seoMetrics);
    }

    // 热力图跟踪
    setupHeatmapTracking() {
        if (!this.config.enableHeatmap) return;

        const heatmapData = [];
        
        // 鼠标移动跟踪
        let mouseMoveTimer;
        document.addEventListener('mousemove', (event) => {
            clearTimeout(mouseMoveTimer);
            mouseMoveTimer = setTimeout(() => {
                heatmapData.push({
                    x: event.clientX,
                    y: event.clientY,
                    timestamp: Date.now(),
                    type: 'move'
                });
            }, 100);
        });

        // 鼠标悬停跟踪
        document.addEventListener('mouseenter', (event) => {
            if (event.target.matches('a, button, .clickable')) {
                this.userBehavior.hovers.push({
                    element: event.target.tagName,
                    className: event.target.className,
                    timestamp: Date.now()
                });
            }
        }, true);

        // 定期发送热力图数据
        setInterval(() => {
            if (heatmapData.length > 0) {
                this.trackEvent('heatmap_data', {
                    points: heatmapData.splice(0, 50), // 发送前50个点
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                });
            }
        }, 10000);
    }

    // 错误跟踪
    setupErrorTracking() {
        // JavaScript错误跟踪
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });

        // Promise错误跟踪
        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('promise_rejection', {
                reason: event.reason?.toString(),
                stack: event.reason?.stack,
                url: window.location.href
            });
        });

        // 资源加载错误跟踪
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.trackEvent('resource_error', {
                    type: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: 'Failed to load resource'
                });
            }
        }, true);
    }

    // 转化跟踪
    setupConversionTracking() {
        // 工具详情页访问转化
        if (window.location.pathname.includes('/detail/')) {
            this.trackEvent('tool_detail_view', {
                toolName: this.extractToolNameFromURL(),
                referrer: document.referrer,
                source: this.getTrafficSource()
            });
        }

        // 外部链接点击转化
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link && this.isExternalLink(link.href)) {
                this.trackEvent('external_link_click', {
                    url: link.href,
                    text: link.textContent?.trim(),
                    toolName: this.extractToolName(link),
                    position: this.getElementPosition(link)
                });
            }
        });
    }

    // 批处理器
    startBatchProcessor() {
        setInterval(() => {
            this.flushEventQueue();
        }, this.config.flushInterval);

        // 页面卸载时发送剩余数据
        window.addEventListener('beforeunload', () => {
            this.flushEventQueue(true);
        });
    }

    // 事件跟踪
    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: Date.now(),
            sessionId: this.userSession.id,
            userId: this.userSession.userId,
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        this.eventQueue.push(event);
        this.userSession.events.push(event);

        // 更新localStorage
        localStorage.setItem('ainav_session', JSON.stringify(this.userSession));

        // 如果队列满了，立即发送
        if (this.eventQueue.length >= this.config.batchSize) {
            this.flushEventQueue();
        }
    }

    // 发送事件队列
    flushEventQueue(immediate = false) {
        if (this.eventQueue.length === 0) return;

        const events = [...this.eventQueue];
        this.eventQueue = [];

        const payload = {
            events: events,
            session: this.userSession,
            performance: this.performanceMetrics,
            seo: this.seoMetrics,
            behavior: this.userBehavior
        };

        if (immediate && navigator.sendBeacon) {
            // 使用sendBeacon确保数据发送
            navigator.sendBeacon(this.config.apiEndpoint, JSON.stringify(payload));
        } else {
            // 模拟发送到服务器
            this.sendToServer(payload);
        }
    }

    // 发送到服务器（模拟）
    async sendToServer(payload) {
        try {
            // 这里应该是实际的API调用
            console.log('📊 Analytics Data Sent:', payload);
            
            // 模拟API调用
            // const response = await fetch(this.config.apiEndpoint, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(payload)
            // });
            
            // 存储到localStorage作为备份
            const stored = JSON.parse(localStorage.getItem('ainav_analytics_backup') || '[]');
            stored.push({
                timestamp: Date.now(),
                payload: payload
            });
            
            // 只保留最近100条记录
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('ainav_analytics_backup', JSON.stringify(stored));
            
        } catch (error) {
            console.error('Analytics send failed:', error);
            // 重新加入队列稍后重试
            this.eventQueue.unshift(...payload.events);
        }
    }

    // 辅助方法
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('ainav_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('ainav_user_id', userId);
        }
        return userId;
    }

    getDeviceInfo() {
        return {
            type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            }
        };
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        return {
            userAgent: ua,
            vendor: navigator.vendor,
            language: navigator.language,
            languages: navigator.languages,
            doNotTrack: navigator.doNotTrack,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            source: params.get('utm_source'),
            medium: params.get('utm_medium'),
            campaign: params.get('utm_campaign'),
            term: params.get('utm_term'),
            content: params.get('utm_content')
        };
    }

    calculateTitleScore(title) {
        let score = 0;
        if (title.length >= 30 && title.length <= 60) score += 30;
        if (title.toLowerCase().includes('ai')) score += 20;
        if (title.includes('AINAV.ART')) score += 10;
        return score;
    }

    calculateDescriptionScore(description) {
        let score = 0;
        if (description.length >= 120 && description.length <= 160) score += 30;
        if (description.toLowerCase().includes('ai')) score += 20;
        return score;
    }

    calculatePageSEOScore() {
        let score = 0;
        score += this.seoMetrics.title.score;
        score += this.seoMetrics.description.score;
        score += this.seoMetrics.images.altOptimizationRate * 20;
        score += this.seoMetrics.headings.h1Count === 1 ? 10 : 0;
        return Math.min(score, 100);
    }

    detectStructuredData() {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        return {
            count: scripts.length,
            types: Array.from(scripts).map(script => {
                try {
                    const data = JSON.parse(script.textContent);
                    return data['@type'] || 'Unknown';
                } catch {
                    return 'Invalid';
                }
            })
        };
    }

    isInternalLink(href) {
        if (!href) return false;
        return href.startsWith('/') || href.includes('ainav.art');
    }

    isExternalLink(href) {
        if (!href) return false;
        return href.startsWith('http') && !href.includes('ainav.art');
    }

    extractToolName(element) {
        // 从元素中提取工具名称的逻辑
        return element.textContent?.trim() || element.alt || 'Unknown';
    }

    extractToolNameFromURL() {
        const path = window.location.pathname;
        const match = path.match(/\/detail\/([^\/]+)\.html/);
        return match ? match[1] : 'Unknown';
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

    getTrafficSource() {
        const referrer = document.referrer;
        if (!referrer) return 'direct';
        if (referrer.includes('google')) return 'google';
        if (referrer.includes('baidu')) return 'baidu';
        if (referrer.includes('bing')) return 'bing';
        return 'referral';
    }

    // 公共API方法
    getAnalyticsData() {
        return {
            session: this.userSession,
            performance: this.performanceMetrics,
            seo: this.seoMetrics,
            behavior: this.userBehavior,
            eventQueue: this.eventQueue
        };
    }

    exportData() {
        const data = this.getAnalyticsData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ainav-analytics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.AdvancedAnalytics = AdvancedAnalytics;
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.aiNavAnalytics = new AdvancedAnalytics();
        });
    } else {
        window.aiNavAnalytics = new AdvancedAnalytics();
    }
    
    // 添加全局方法
    window.trackAINavEvent = (eventName, eventData) => {
        if (window.aiNavAnalytics) {
            window.aiNavAnalytics.trackEvent(eventName, eventData);
        }
    };
    
    console.log('🚀 AINAV.ART Advanced Analytics System Loaded');
}

// 导出（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnalytics;
}
