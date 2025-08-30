/**
 * AINAV.ART 网站性能优化器
 * 专为谷歌Ads审核优化 - 确保页面加载速度和用户体验
 */

class PerformanceOptimizer {
    constructor() {
        this.config = {
            lazyLoadThreshold: 200, // 懒加载阈值
            imageQuality: 0.8, // 图片质量
            cacheTimeout: 86400000, // 缓存时间 24小时
            minifyHTML: true,
            compressImages: true,
            enableServiceWorker: true
        };
        
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0
        };
        
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.optimize());
        } else {
            this.optimize();
        }
        
        // 监听页面加载完成
        window.addEventListener('load', () => this.measurePerformance());
    }

    optimize() {
        console.log('🚀 Starting performance optimization...');
        
        // 核心优化功能
        this.optimizeImages();
        this.enableLazyLoading();
        this.optimizeCSS();
        this.optimizeJavaScript();
        this.enableCaching();
        this.optimizeWebFonts();
        this.preloadCriticalResources();
        this.optimizeThirdPartyScripts();
        
        console.log('✅ Performance optimization completed');
    }

    // 图片优化
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // 添加懒加载
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // 添加图片尺寸属性以防止布局偏移
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                img.addEventListener('load', function() {
                    if (!this.hasAttribute('width')) {
                        this.setAttribute('width', this.naturalWidth);
                    }
                    if (!this.hasAttribute('height')) {
                        this.setAttribute('height', this.naturalHeight);
                    }
                });
            }
            
            // 添加错误处理
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('Failed to load image:', this.src);
            });
            
            // 优化图片格式
            this.optimizeImageFormat(img);
        });
    }

    optimizeImageFormat(img) {
        // 检查浏览器支持的现代图片格式
        const supportsWebP = this.supportsWebP();
        const supportsAVIF = this.supportsAVIF();
        
        if (img.src && !img.src.includes('data:')) {
            const originalSrc = img.src;
            
            // 如果支持AVIF，优先使用
            if (supportsAVIF && !originalSrc.includes('.avif')) {
                const avifSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
                this.tryImageFormat(img, avifSrc, originalSrc);
            }
            // 否则尝试WebP
            else if (supportsWebP && !originalSrc.includes('.webp')) {
                const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                this.tryImageFormat(img, webpSrc, originalSrc);
            }
        }
    }

    tryImageFormat(img, newSrc, fallbackSrc) {
        const testImg = new Image();
        testImg.onload = () => {
            img.src = newSrc;
        };
        testImg.onerror = () => {
            img.src = fallbackSrc;
        };
        testImg.src = newSrc;
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    supportsAVIF() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        try {
            return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        } catch (e) {
            return false;
        }
    }

    // 启用懒加载
    enableLazyLoading() {
        // 使用Intersection Observer API实现高性能懒加载
        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('[data-lazy]');
            
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        
                        if (element.dataset.lazy) {
                            if (element.tagName === 'IMG') {
                                element.src = element.dataset.lazy;
                            } else {
                                element.style.backgroundImage = `url(${element.dataset.lazy})`;
                            }
                            element.removeAttribute('data-lazy');
                            lazyObserver.unobserve(element);
                        }
                    }
                });
            }, {
                rootMargin: `${this.config.lazyLoadThreshold}px`
            });
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    }

    // CSS优化
    optimizeCSS() {
        // 移除未使用的CSS（简化版）
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        
        stylesheets.forEach(link => {
            // 添加媒体查询优化
            if (!link.hasAttribute('media')) {
                link.setAttribute('media', 'all');
            }
            
            // 预加载关键CSS
            if (link.href.includes('bootstrap') || link.href.includes('xenon-core')) {
                link.setAttribute('rel', 'preload');
                link.setAttribute('as', 'style');
                link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
            }
        });
        
        // 内联关键CSS
        this.inlineCriticalCSS();
    }

    inlineCriticalCSS() {
        // 添加关键CSS内联样式
        const criticalCSS = `
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .main-content { min-height: 100vh; }
            .loading { opacity: 0.5; transition: opacity 0.3s; }
            .loaded { opacity: 1; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // JavaScript优化
    optimizeJavaScript() {
        // 延迟加载非关键JavaScript
        const scripts = document.querySelectorAll('script[src]');
        
        scripts.forEach(script => {
            if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
                // 非关键脚本添加defer属性
                if (!script.src.includes('jquery') && !script.src.includes('cookie-consent')) {
                    script.setAttribute('defer', '');
                }
            }
        });
        
        // 代码分割和动态导入
        this.enableCodeSplitting();
    }

    enableCodeSplitting() {
        // 动态加载非关键功能
        const loadNonCriticalFeatures = () => {
            // 延迟加载分析脚本
            if (window.cookieConsent && window.cookieConsent.hasConsent('analytics')) {
                this.loadAnalyticsScripts();
            }
            
            // 延迟加载其他增强功能
            this.loadEnhancementFeatures();
        };
        
        // 在页面加载完成后延迟执行
        setTimeout(loadNonCriticalFeatures, 1000);
    }

    loadAnalyticsScripts() {
        // 这里由Cookie同意系统处理
        console.log('Analytics scripts loaded by cookie consent system');
    }

    loadEnhancementFeatures() {
        // 加载UX优化引擎
        if (typeof UXOptimizationEngine === 'undefined') {
            const script = document.createElement('script');
            script.src = './ux-optimization-engine.js';
            script.defer = true;
            document.head.appendChild(script);
        }
        
        // 加载AI工具数据库
        if (typeof AIToolsDatabase === 'undefined') {
            const script = document.createElement('script');
            script.src = './ai-tools-database.js';
            script.defer = true;
            document.head.appendChild(script);
        }
    }

    // 启用缓存
    enableCaching() {
        // 设置缓存策略
        if ('serviceWorker' in navigator && this.config.enableServiceWorker) {
            this.registerServiceWorker();
        }
        
        // 本地存储缓存
        this.enableLocalStorageCache();
    }

    registerServiceWorker() {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    enableLocalStorageCache() {
        // 缓存静态资源信息
        const cacheKey = 'ainav_resource_cache';
        const cacheData = {
            timestamp: Date.now(),
            version: '1.0.0',
            resources: []
        };
        
        try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (e) {
            console.warn('LocalStorage not available:', e);
        }
    }

    // Web字体优化
    optimizeWebFonts() {
        // 预加载关键字体
        const fontPreloads = [
            'https://fonts.googleapis.com/css?family=Arimo:400,700,400italic'
        ];
        
        fontPreloads.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
        
        // 字体显示优化
        this.optimizeFontDisplay();
    }

    optimizeFontDisplay() {
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Arimo';
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    // 预加载关键资源
    preloadCriticalResources() {
        const criticalResources = [
            { href: './assets/css/bootstrap.css', as: 'style' },
            { href: './assets/js/jquery-1.11.1.min.js', as: 'script' },
            { href: './assets/images/AInavLogo.png', as: 'image' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // 优化第三方脚本
    optimizeThirdPartyScripts() {
        // 延迟加载第三方脚本
        const thirdPartyScripts = document.querySelectorAll('script[src*="google"], script[src*="baidu"]');
        
        thirdPartyScripts.forEach(script => {
            if (!script.hasAttribute('async')) {
                script.setAttribute('async', '');
            }
        });
    }

    // 性能监控
    measurePerformance() {
        // 使用Performance API测量关键指标
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
            
            // 测量Core Web Vitals
            this.measureCoreWebVitals();
            
            // 发送性能数据
            this.reportPerformanceMetrics();
        }
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID) - 通过First Contentful Paint近似
            const fcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const firstEntry = entries[0];
                this.metrics.firstContentfulPaint = firstEntry.startTime;
            });
            fcpObserver.observe({ entryTypes: ['paint'] });
            
            // Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.cumulativeLayoutShift = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    reportPerformanceMetrics() {
        // 延迟报告以确保所有指标都被收集
        setTimeout(() => {
            console.log('📊 Performance Metrics:', this.metrics);
            
            // 检查是否符合Google的性能标准
            this.checkPerformanceStandards();
            
            // 可选：发送到分析服务
            this.sendMetricsToAnalytics();
        }, 3000);
    }

    checkPerformanceStandards() {
        const standards = {
            lcp: 2500, // LCP应小于2.5秒
            fcp: 1800, // FCP应小于1.8秒
            cls: 0.1   // CLS应小于0.1
        };
        
        const results = {
            lcp: this.metrics.largestContentfulPaint < standards.lcp,
            fcp: this.metrics.firstContentfulPaint < standards.fcp,
            cls: this.metrics.cumulativeLayoutShift < standards.cls
        };
        
        console.log('✅ Performance Standards Check:', results);
        
        // 如果性能不达标，提供优化建议
        if (!results.lcp || !results.fcp || !results.cls) {
            this.provideOptimizationSuggestions(results);
        }
    }

    provideOptimizationSuggestions(results) {
        const suggestions = [];
        
        if (!results.lcp) {
            suggestions.push('优化最大内容绘制：压缩图片、使用CDN、优化服务器响应时间');
        }
        
        if (!results.fcp) {
            suggestions.push('优化首次内容绘制：内联关键CSS、减少渲染阻塞资源');
        }
        
        if (!results.cls) {
            suggestions.push('减少累积布局偏移：为图片和广告设置尺寸属性');
        }
        
        console.warn('🔧 Performance Optimization Suggestions:', suggestions);
    }

    sendMetricsToAnalytics() {
        // 如果用户同意分析Cookie，发送性能数据
        if (window.cookieConsent && window.cookieConsent.hasConsent('analytics')) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'performance_metrics', {
                    custom_map: {
                        'metric1': 'load_time',
                        'metric2': 'lcp',
                        'metric3': 'fcp'
                    },
                    'load_time': this.metrics.loadTime,
                    'lcp': this.metrics.largestContentfulPaint,
                    'fcp': this.metrics.firstContentfulPaint
                });
            }
        }
    }

    // 公共方法：获取性能指标
    getMetrics() {
        return this.metrics;
    }

    // 公共方法：手动触发优化
    runOptimization() {
        this.optimize();
    }
}

// 初始化性能优化器
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// 导出给其他脚本使用
window.PerformanceOptimizer = PerformanceOptimizer;
