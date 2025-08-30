/**
 * AINAV.ART 代码质量和性能监控系统
 * 实时代码分析、性能监控、错误追踪、质量评估
 */

class CodeQualityMonitor {
    constructor() {
        this.config = {
            enableRealTimeMonitoring: true,
            enablePerformanceTracking: true,
            enableErrorTracking: true,
            enableCodeAnalysis: true,
            enableSecurityMonitoring: true,
            enableAccessibilityAudit: true,
            monitoringInterval: 5000, // 5秒
            performanceThresholds: {
                pageLoadTime: 3000,
                firstContentfulPaint: 1500,
                largestContentfulPaint: 2500,
                cumulativeLayoutShift: 0.1,
                firstInputDelay: 100
            },
            errorThresholds: {
                maxErrorsPerMinute: 5,
                maxConsoleWarnings: 10
            }
        };

        this.metrics = {
            performance: new Map(),
            errors: [],
            warnings: [],
            codeQuality: new Map(),
            security: new Map(),
            accessibility: new Map()
        };

        this.observers = new Map();
        this.startTime = Date.now();
        this.isMonitoring = false;
        
        this.init();
    }

    // 初始化监控系统
    init() {
        this.setupPerformanceMonitoring();
        this.setupErrorTracking();
        this.setupCodeQualityAnalysis();
        this.setupSecurityMonitoring();
        this.setupAccessibilityAudit();
        this.setupRealTimeMonitoring();
        
        console.log('🔍 Code Quality Monitor Initialized');
        this.startMonitoring();
    }

    // 启动监控
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('📊 Starting real-time monitoring...');
        
        // 立即执行一次完整检查
        this.performFullAudit();
        
        // 设置定期监控
        if (this.config.enableRealTimeMonitoring) {
            this.monitoringInterval = setInterval(() => {
                this.performPeriodicCheck();
            }, this.config.monitoringInterval);
        }
    }

    // 停止监控
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        // 断开所有观察者
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        console.log('⏹️ Monitoring stopped');
    }

    // 设置性能监控
    setupPerformanceMonitoring() {
        if (!this.config.enablePerformanceTracking) return;

        // Navigation Timing API
        this.monitorNavigationTiming();
        
        // Resource Timing API
        this.monitorResourceTiming();
        
        // Paint Timing API
        this.monitorPaintTiming();
        
        // Layout Shift API
        this.monitorLayoutShift();
        
        // Long Tasks API
        this.monitorLongTasks();
        
        // Memory Usage
        this.monitorMemoryUsage();
        
        // Frame Rate
        this.monitorFrameRate();
    }

    // 监控导航时间
    monitorNavigationTiming() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    const metrics = {
                        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                        tcpConnect: navigation.connectEnd - navigation.connectStart,
                        sslHandshake: navigation.connectEnd - navigation.secureConnectionStart,
                        ttfb: navigation.responseStart - navigation.requestStart,
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
                        totalTime: navigation.loadEventEnd - navigation.fetchStart
                    };
                    
                    this.metrics.performance.set('navigation', metrics);
                    this.evaluatePerformanceMetrics(metrics);
                }
            }, 1000);
        });
    }

    // 监控资源时间
    monitorResourceTiming() {
        const resourceObserver = new PerformanceObserver((list) => {
            const resources = list.getEntries();
            resources.forEach(resource => {
                const resourceMetrics = {
                    name: resource.name,
                    type: this.getResourceType(resource.name),
                    size: resource.transferSize || 0,
                    duration: resource.duration,
                    startTime: resource.startTime,
                    blocked: resource.domainLookupStart - resource.fetchStart,
                    dns: resource.domainLookupEnd - resource.domainLookupStart,
                    connect: resource.connectEnd - resource.connectStart,
                    send: resource.responseStart - resource.requestStart,
                    wait: resource.responseStart - resource.requestStart,
                    receive: resource.responseEnd - resource.responseStart
                };
                
                this.analyzeResourcePerformance(resourceMetrics);
            });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
    }

    // 监控绘制时间
    monitorPaintTiming() {
        const paintObserver = new PerformanceObserver((list) => {
            const paints = list.getEntries();
            paints.forEach(paint => {
                this.metrics.performance.set(paint.name, paint.startTime);
                
                // 检查是否超过阈值
                if (paint.name === 'first-contentful-paint' && 
                    paint.startTime > this.config.performanceThresholds.firstContentfulPaint) {
                    this.reportPerformanceIssue('FCP too slow', paint.startTime);
                }
            });
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
    }

    // 监控布局偏移
    monitorLayoutShift() {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            const shifts = list.getEntries();
            shifts.forEach(shift => {
                if (!shift.hadRecentInput) {
                    clsValue += shift.value;
                    
                    if (clsValue > this.config.performanceThresholds.cumulativeLayoutShift) {
                        this.reportPerformanceIssue('High CLS detected', clsValue);
                    }
                }
            });
            
            this.metrics.performance.set('cls', clsValue);
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('layout-shift', clsObserver);
    }

    // 监控长任务
    monitorLongTasks() {
        if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                const longTasks = list.getEntries();
                longTasks.forEach(task => {
                    this.reportPerformanceIssue('Long task detected', {
                        duration: task.duration,
                        startTime: task.startTime,
                        attribution: task.attribution
                    });
                });
            });
            
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.set('longtask', longTaskObserver);
        }
    }

    // 监控内存使用
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const checkMemory = () => {
                const memory = performance.memory;
                const memoryMetrics = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
                };
                
                this.metrics.performance.set('memory', memoryMetrics);
                
                // 检查内存泄漏
                if (memoryMetrics.usage > 80) {
                    this.reportPerformanceIssue('High memory usage', memoryMetrics);
                }
            };
            
            setInterval(checkMemory, 10000); // 每10秒检查一次
        }
    }

    // 监控帧率
    monitorFrameRate() {
        let frames = 0;
        let lastTime = performance.now();
        
        const countFrames = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.metrics.performance.set('fps', fps);
                
                if (fps < 30) {
                    this.reportPerformanceIssue('Low frame rate', fps);
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    // 设置错误跟踪
    setupErrorTracking() {
        if (!this.config.enableErrorTracking) return;

        // JavaScript错误
        window.addEventListener('error', (event) => {
            this.recordError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });

        // Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.recordError({
                type: 'promise',
                message: event.reason?.toString(),
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });

        // 资源加载错误
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.recordError({
                    type: 'resource',
                    message: `Failed to load ${event.target.tagName}`,
                    source: event.target.src || event.target.href,
                    timestamp: Date.now()
                });
            }
        }, true);

        // Console错误和警告
        this.interceptConsole();
    }

    // 拦截Console输出
    interceptConsole() {
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.error = (...args) => {
            this.recordError({
                type: 'console_error',
                message: args.join(' '),
                timestamp: Date.now()
            });
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.recordWarning({
                type: 'console_warning',
                message: args.join(' '),
                timestamp: Date.now()
            });
            originalWarn.apply(console, args);
        };
    }

    // 设置代码质量分析
    setupCodeQualityAnalysis() {
        if (!this.config.enableCodeAnalysis) return;

        // 分析HTML质量
        this.analyzeHTMLQuality();
        
        // 分析CSS质量
        this.analyzeCSSQuality();
        
        // 分析JavaScript质量
        this.analyzeJavaScriptQuality();
        
        // 分析SEO质量
        this.analyzeSEOQuality();
    }

    // 分析HTML质量
    analyzeHTMLQuality() {
        const htmlIssues = [];
        
        // 检查DOCTYPE
        if (!document.doctype) {
            htmlIssues.push('Missing DOCTYPE declaration');
        }
        
        // 检查lang属性
        if (!document.documentElement.lang) {
            htmlIssues.push('Missing lang attribute on html element');
        }
        
        // 检查meta标签
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            htmlIssues.push('Missing viewport meta tag');
        }
        
        const charset = document.querySelector('meta[charset]');
        if (!charset) {
            htmlIssues.push('Missing charset meta tag');
        }
        
        // 检查标题结构
        const h1s = document.querySelectorAll('h1');
        if (h1s.length === 0) {
            htmlIssues.push('No H1 heading found');
        } else if (h1s.length > 1) {
            htmlIssues.push('Multiple H1 headings found');
        }
        
        // 检查图片alt属性
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
            htmlIssues.push(`${imagesWithoutAlt.length} images missing alt attributes`);
        }
        
        // 检查链接
        const linksWithoutText = document.querySelectorAll('a:empty');
        if (linksWithoutText.length > 0) {
            htmlIssues.push(`${linksWithoutText.length} empty links found`);
        }
        
        this.metrics.codeQuality.set('html', {
            issues: htmlIssues,
            score: Math.max(0, 100 - (htmlIssues.length * 10))
        });
    }

    // 分析CSS质量
    analyzeCSSQuality() {
        const cssIssues = [];
        
        // 检查CSS文件数量
        const cssFiles = document.querySelectorAll('link[rel="stylesheet"]');
        if (cssFiles.length > 10) {
            cssIssues.push(`Too many CSS files (${cssFiles.length})`);
        }
        
        // 检查内联样式
        const inlineStyles = document.querySelectorAll('[style]');
        if (inlineStyles.length > 20) {
            cssIssues.push(`Excessive inline styles (${inlineStyles.length})`);
        }
        
        // 检查CSS大小
        let totalCSSSize = 0;
        const resources = performance.getEntriesByType('resource');
        resources.forEach(resource => {
            if (resource.name.includes('.css')) {
                totalCSSSize += resource.transferSize || 0;
            }
        });
        
        if (totalCSSSize > 100000) { // 100KB
            cssIssues.push(`Large CSS size (${Math.round(totalCSSSize / 1024)}KB)`);
        }
        
        this.metrics.codeQuality.set('css', {
            issues: cssIssues,
            score: Math.max(0, 100 - (cssIssues.length * 15)),
            totalSize: totalCSSSize
        });
    }

    // 分析JavaScript质量
    analyzeJavaScriptQuality() {
        const jsIssues = [];
        
        // 检查JavaScript文件数量
        const jsFiles = document.querySelectorAll('script[src]');
        if (jsFiles.length > 15) {
            jsIssues.push(`Too many JavaScript files (${jsFiles.length})`);
        }
        
        // 检查内联脚本
        const inlineScripts = document.querySelectorAll('script:not([src])');
        if (inlineScripts.length > 10) {
            jsIssues.push(`Excessive inline scripts (${inlineScripts.length})`);
        }
        
        // 检查全局变量
        const globalVars = Object.keys(window).filter(key => 
            !this.isNativeProperty(key) && typeof window[key] !== 'function'
        );
        if (globalVars.length > 50) {
            jsIssues.push(`Too many global variables (${globalVars.length})`);
        }
        
        // 检查JavaScript大小
        let totalJSSize = 0;
        const resources = performance.getEntriesByType('resource');
        resources.forEach(resource => {
            if (resource.name.includes('.js')) {
                totalJSSize += resource.transferSize || 0;
            }
        });
        
        if (totalJSSize > 500000) { // 500KB
            jsIssues.push(`Large JavaScript size (${Math.round(totalJSSize / 1024)}KB)`);
        }
        
        this.metrics.codeQuality.set('javascript', {
            issues: jsIssues,
            score: Math.max(0, 100 - (jsIssues.length * 12)),
            totalSize: totalJSSize,
            globalVars: globalVars.length
        });
    }

    // 设置安全监控
    setupSecurityMonitoring() {
        if (!this.config.enableSecurityMonitoring) return;

        // 检查HTTPS
        this.checkHTTPS();
        
        // 检查CSP
        this.checkCSP();
        
        // 检查混合内容
        this.checkMixedContent();
        
        // 检查外部链接
        this.checkExternalLinks();
    }

    // 检查HTTPS
    checkHTTPS() {
        const securityIssues = [];
        
        if (location.protocol !== 'https:') {
            securityIssues.push('Site not served over HTTPS');
        }
        
        this.metrics.security.set('https', {
            secure: location.protocol === 'https:',
            issues: securityIssues
        });
    }

    // 检查CSP
    checkCSP() {
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        const hasCsp = !!cspMeta;
        
        this.metrics.security.set('csp', {
            enabled: hasCsp,
            policy: cspMeta?.content || null
        });
    }

    // 设置可访问性审计
    setupAccessibilityAudit() {
        if (!this.config.enableAccessibilityAudit) return;

        // 检查ARIA标签
        this.checkARIA();
        
        // 检查颜色对比度
        this.checkColorContrast();
        
        // 检查键盘导航
        this.checkKeyboardNavigation();
        
        // 检查焦点管理
        this.checkFocusManagement();
    }

    // 检查ARIA标签
    checkARIA() {
        const a11yIssues = [];
        
        // 检查按钮ARIA标签
        const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttonsWithoutLabel.forEach(button => {
            if (!button.textContent.trim()) {
                a11yIssues.push('Button without accessible name');
            }
        });
        
        // 检查图片alt属性
        const decorativeImages = document.querySelectorAll('img[alt=""]');
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        
        if (imagesWithoutAlt.length > 0) {
            a11yIssues.push(`${imagesWithoutAlt.length} images missing alt text`);
        }
        
        this.metrics.accessibility.set('aria', {
            issues: a11yIssues,
            score: Math.max(0, 100 - (a11yIssues.length * 20))
        });
    }

    // 执行完整审计
    performFullAudit() {
        console.log('🔍 Performing full code quality audit...');
        
        const auditStart = performance.now();
        
        // 重新分析所有指标
        this.analyzeHTMLQuality();
        this.analyzeCSSQuality();
        this.analyzeJavaScriptQuality();
        this.checkHTTPS();
        this.checkCSP();
        this.checkARIA();
        
        const auditTime = performance.now() - auditStart;
        
        // 生成综合报告
        const report = this.generateQualityReport();
        
        console.log(`✅ Audit completed in ${auditTime.toFixed(2)}ms`);
        console.log('📊 Quality Report:', report);
        
        return report;
    }

    // 执行定期检查
    performPeriodicCheck() {
        // 检查错误率
        this.checkErrorRate();
        
        // 检查性能指标
        this.checkPerformanceMetrics();
        
        // 检查内存使用
        this.checkMemoryLeaks();
        
        // 更新质量分数
        this.updateQualityScores();
    }

    // 检查错误率
    checkErrorRate() {
        const recentErrors = this.metrics.errors.filter(
            error => Date.now() - error.timestamp < 60000 // 最近1分钟
        );
        
        if (recentErrors.length > this.config.errorThresholds.maxErrorsPerMinute) {
            this.reportQualityIssue('High error rate', {
                count: recentErrors.length,
                threshold: this.config.errorThresholds.maxErrorsPerMinute
            });
        }
    }

    // 生成质量报告
    generateQualityReport() {
        const report = {
            timestamp: Date.now(),
            uptime: Date.now() - this.startTime,
            overall: {
                score: 0,
                grade: 'F',
                issues: 0
            },
            categories: {
                performance: this.calculatePerformanceScore(),
                codeQuality: this.calculateCodeQualityScore(),
                security: this.calculateSecurityScore(),
                accessibility: this.calculateAccessibilityScore(),
                errors: this.calculateErrorScore()
            },
            recommendations: this.generateRecommendations()
        };
        
        // 计算总分
        const scores = Object.values(report.categories);
        report.overall.score = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
        report.overall.grade = this.getGrade(report.overall.score);
        
        // 计算总问题数
        report.overall.issues = this.getTotalIssues();
        
        return report;
    }

    // 计算性能分数
    calculatePerformanceScore() {
        let score = 100;
        const performance = this.metrics.performance;
        
        // FCP检查
        const fcp = performance.get('first-contentful-paint');
        if (fcp > this.config.performanceThresholds.firstContentfulPaint) {
            score -= 20;
        }
        
        // CLS检查
        const cls = performance.get('cls');
        if (cls > this.config.performanceThresholds.cumulativeLayoutShift) {
            score -= 15;
        }
        
        // 内存使用检查
        const memory = performance.get('memory');
        if (memory && memory.usage > 80) {
            score -= 10;
        }
        
        return Math.max(0, score);
    }

    // 计算代码质量分数
    calculateCodeQualityScore() {
        const htmlScore = this.metrics.codeQuality.get('html')?.score || 0;
        const cssScore = this.metrics.codeQuality.get('css')?.score || 0;
        const jsScore = this.metrics.codeQuality.get('javascript')?.score || 0;
        
        return Math.round((htmlScore + cssScore + jsScore) / 3);
    }

    // 记录错误
    recordError(error) {
        this.metrics.errors.push(error);
        
        // 只保留最近1000个错误
        if (this.metrics.errors.length > 1000) {
            this.metrics.errors = this.metrics.errors.slice(-1000);
        }
        
        console.error('🚨 Error recorded:', error);
    }

    // 记录警告
    recordWarning(warning) {
        this.metrics.warnings.push(warning);
        
        // 只保留最近500个警告
        if (this.metrics.warnings.length > 500) {
            this.metrics.warnings = this.metrics.warnings.slice(-500);
        }
    }

    // 报告性能问题
    reportPerformanceIssue(type, data) {
        console.warn(`⚠️ Performance Issue: ${type}`, data);
        
        // 发送到分析系统
        if (window.aiNavAnalytics) {
            window.aiNavAnalytics.trackEvent('performance_issue', { type, data });
        }
    }

    // 报告质量问题
    reportQualityIssue(type, data) {
        console.warn(`⚠️ Quality Issue: ${type}`, data);
        
        // 发送到分析系统
        if (window.aiNavAnalytics) {
            window.aiNavAnalytics.trackEvent('quality_issue', { type, data });
        }
    }

    // 辅助方法
    getResourceType(url) {
        if (url.includes('.css')) return 'css';
        if (url.includes('.js')) return 'javascript';
        if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
        return 'other';
    }

    isNativeProperty(key) {
        const nativeProps = [
            'window', 'document', 'navigator', 'location', 'history',
            'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
            'requestAnimationFrame', 'cancelAnimationFrame', 'performance'
        ];
        return nativeProps.includes(key);
    }

    getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    getTotalIssues() {
        let total = 0;
        this.metrics.codeQuality.forEach(category => {
            total += category.issues?.length || 0;
        });
        return total;
    }

    generateRecommendations() {
        const recommendations = [];
        
        // 基于性能指标生成建议
        const fcp = this.metrics.performance.get('first-contentful-paint');
        if (fcp > 1500) {
            recommendations.push('优化首次内容绘制时间：压缩CSS和JavaScript文件');
        }
        
        // 基于代码质量生成建议
        const htmlIssues = this.metrics.codeQuality.get('html')?.issues || [];
        if (htmlIssues.length > 0) {
            recommendations.push('修复HTML质量问题：' + htmlIssues[0]);
        }
        
        return recommendations;
    }

    // 公共API
    getMetrics() {
        return {
            performance: Object.fromEntries(this.metrics.performance),
            errors: this.metrics.errors,
            warnings: this.metrics.warnings,
            codeQuality: Object.fromEntries(this.metrics.codeQuality),
            security: Object.fromEntries(this.metrics.security),
            accessibility: Object.fromEntries(this.metrics.accessibility)
        };
    }

    generateReport() {
        return this.generateQualityReport();
    }

    exportMetrics() {
        const data = {
            metrics: this.getMetrics(),
            report: this.generateReport(),
            timestamp: Date.now()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ainav-quality-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.CodeQualityMonitor = CodeQualityMonitor;
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.aiNavQualityMonitor = new CodeQualityMonitor();
        });
    } else {
        window.aiNavQualityMonitor = new CodeQualityMonitor();
    }
    
    console.log('🔍 AINAV.ART Code Quality Monitor Loaded');
}

// 导出（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeQualityMonitor;
}
