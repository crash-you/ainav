/**
 * AINAV.ART 谷歌Ads合规性检查器
 * 自动检查网站是否符合Google Ads审核要求
 */

class GoogleAdsComplianceChecker {
    constructor() {
        this.checks = {
            // 基础要求
            httpsEnabled: false,
            hasPrivacyPolicy: false,
            hasTermsOfService: false,
            hasContactInfo: false,
            hasAboutPage: false,
            
            // 内容质量
            hasOriginalContent: false,
            hasValueToUsers: false,
            contentIsComplete: false,
            noMisleadingContent: false,
            
            // 技术要求
            pageLoadSpeed: false,
            mobileResponsive: false,
            noTechnicalErrors: false,
            validHTML: false,
            
            // 用户体验
            easyNavigation: false,
            clearPurpose: false,
            functionalFeatures: false,
            
            // 广告政策
            adPlacementCompliant: false,
            noProhibitedContent: false,
            cookieConsentImplemented: false,
            
            // SEO和可发现性
            hasMetaTags: false,
            hasSitemap: false,
            hasRobotsTxt: false,
            hasStructuredData: false
        };
        
        this.score = 0;
        this.maxScore = Object.keys(this.checks).length;
        this.recommendations = [];
        
        this.init();
    }

    init() {
        console.log('🔍 Starting Google Ads compliance check...');
        this.runAllChecks();
    }

    runAllChecks() {
        // 基础要求检查
        this.checkHTTPS();
        this.checkPrivacyPolicy();
        this.checkTermsOfService();
        this.checkContactInfo();
        this.checkAboutPage();
        
        // 内容质量检查
        this.checkOriginalContent();
        this.checkValueToUsers();
        this.checkContentCompleteness();
        this.checkMisleadingContent();
        
        // 技术要求检查
        this.checkPageLoadSpeed();
        this.checkMobileResponsive();
        this.checkTechnicalErrors();
        this.checkValidHTML();
        
        // 用户体验检查
        this.checkNavigation();
        this.checkClearPurpose();
        this.checkFunctionalFeatures();
        
        // 广告政策检查
        this.checkAdPlacement();
        this.checkProhibitedContent();
        this.checkCookieConsent();
        
        // SEO检查
        this.checkMetaTags();
        this.checkSitemap();
        this.checkRobotsTxt();
        this.checkStructuredData();
        
        // 计算分数并生成报告
        this.calculateScore();
        this.generateReport();
    }

    // 基础要求检查
    checkHTTPS() {
        this.checks.httpsEnabled = location.protocol === 'https:';
        if (!this.checks.httpsEnabled) {
            this.recommendations.push({
                category: '安全性',
                issue: 'HTTPS未启用',
                solution: '启用SSL证书，确保网站使用HTTPS协议',
                priority: 'high'
            });
        }
    }

    checkPrivacyPolicy() {
        // 检查隐私政策页面是否存在
        const privacyLinks = document.querySelectorAll('a[href*="privacy"]');
        this.checks.hasPrivacyPolicy = privacyLinks.length > 0;
        
        if (!this.checks.hasPrivacyPolicy) {
            this.recommendations.push({
                category: '法律合规',
                issue: '缺少隐私政策',
                solution: '创建详细的隐私政策页面，说明数据收集和使用方式',
                priority: 'high'
            });
        }
    }

    checkTermsOfService() {
        const termsLinks = document.querySelectorAll('a[href*="terms"]');
        this.checks.hasTermsOfService = termsLinks.length > 0;
        
        if (!this.checks.hasTermsOfService) {
            this.recommendations.push({
                category: '法律合规',
                issue: '缺少服务条款',
                solution: '创建服务条款页面，明确网站使用规则',
                priority: 'high'
            });
        }
    }

    checkContactInfo() {
        const contactLinks = document.querySelectorAll('a[href*="contact"], a[href*="mailto:"]');
        const hasContactPage = document.querySelector('a[href*="contact"]');
        const hasEmail = document.querySelector('a[href^="mailto:"]');
        
        this.checks.hasContactInfo = contactLinks.length > 0 || hasContactPage || hasEmail;
        
        if (!this.checks.hasContactInfo) {
            this.recommendations.push({
                category: '联系信息',
                issue: '缺少联系方式',
                solution: '添加联系页面或邮箱地址，确保用户可以联系到您',
                priority: 'high'
            });
        }
    }

    checkAboutPage() {
        const aboutLinks = document.querySelectorAll('a[href*="about"]');
        this.checks.hasAboutPage = aboutLinks.length > 0;
        
        if (!this.checks.hasAboutPage) {
            this.recommendations.push({
                category: '内容完整性',
                issue: '缺少关于我们页面',
                solution: '创建关于页面，介绍网站目的和团队信息',
                priority: 'medium'
            });
        }
    }

    // 内容质量检查
    checkOriginalContent() {
        const textContent = document.body.textContent || '';
        const wordCount = textContent.split(/\s+/).length;
        const hasUniqueContent = wordCount > 500; // 基本的内容长度检查
        
        this.checks.hasOriginalContent = hasUniqueContent;
        
        if (!this.checks.hasOriginalContent) {
            this.recommendations.push({
                category: '内容质量',
                issue: '内容过少或缺乏原创性',
                solution: '增加更多原创、有价值的内容，确保内容丰富且独特',
                priority: 'high'
            });
        }
    }

    checkValueToUsers() {
        // 检查是否有实用功能和价值
        const hasSearch = document.querySelector('input[type="search"], .search');
        const hasCategories = document.querySelectorAll('.category, [class*="category"]').length > 0;
        const hasTools = document.querySelectorAll('.tool, [class*="tool"]').length > 0;
        
        this.checks.hasValueToUsers = hasSearch || hasCategories || hasTools;
        
        if (!this.checks.hasValueToUsers) {
            this.recommendations.push({
                category: '用户价值',
                issue: '网站缺乏实用功能',
                solution: '添加搜索功能、分类导航等实用功能，提升用户体验',
                priority: 'medium'
            });
        }
    }

    checkContentCompleteness() {
        // 检查页面是否完整
        const hasHeader = document.querySelector('header, .header');
        const hasMain = document.querySelector('main, .main-content');
        const hasFooter = document.querySelector('footer, .footer');
        
        this.checks.contentIsComplete = hasHeader && hasMain && hasFooter;
        
        if (!this.checks.contentIsComplete) {
            this.recommendations.push({
                category: '页面结构',
                issue: '页面结构不完整',
                solution: '确保页面有完整的头部、主体和底部结构',
                priority: 'medium'
            });
        }
    }

    checkMisleadingContent() {
        // 检查是否有误导性内容（基础检查）
        const suspiciousWords = ['免费赚钱', '快速致富', '保证收益', '100%成功'];
        const pageText = document.body.textContent.toLowerCase();
        const hasSuspiciousContent = suspiciousWords.some(word => 
            pageText.includes(word.toLowerCase())
        );
        
        this.checks.noMisleadingContent = !hasSuspiciousContent;
        
        if (hasSuspiciousContent) {
            this.recommendations.push({
                category: '内容合规',
                issue: '可能包含误导性内容',
                solution: '检查并移除任何可能误导用户的内容',
                priority: 'high'
            });
        }
    }

    // 技术要求检查
    checkPageLoadSpeed() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            // Google建议页面加载时间小于3秒
            this.checks.pageLoadSpeed = loadTime < 3000;
            
            if (!this.checks.pageLoadSpeed) {
                this.recommendations.push({
                    category: '性能优化',
                    issue: `页面加载时间过长 (${Math.round(loadTime)}ms)`,
                    solution: '优化图片、压缩文件、使用CDN等方式提升加载速度',
                    priority: 'high'
                });
            }
        } else {
            this.checks.pageLoadSpeed = true; // 无法检测时默认通过
        }
    }

    checkMobileResponsive() {
        const viewport = document.querySelector('meta[name="viewport"]');
        const hasResponsiveDesign = viewport && viewport.content.includes('width=device-width');
        
        this.checks.mobileResponsive = hasResponsiveDesign;
        
        if (!this.checks.mobileResponsive) {
            this.recommendations.push({
                category: '移动适配',
                issue: '缺少移动端适配',
                solution: '添加viewport meta标签，确保网站在移动设备上正常显示',
                priority: 'high'
            });
        }
    }

    checkTechnicalErrors() {
        // 检查常见的技术错误
        const brokenImages = document.querySelectorAll('img[src=""], img:not([src])');
        const brokenLinks = document.querySelectorAll('a[href=""], a:not([href])');
        
        this.checks.noTechnicalErrors = brokenImages.length === 0 && brokenLinks.length === 0;
        
        if (!this.checks.noTechnicalErrors) {
            this.recommendations.push({
                category: '技术问题',
                issue: '存在损坏的图片或链接',
                solution: '修复所有损坏的图片和链接',
                priority: 'medium'
            });
        }
    }

    checkValidHTML() {
        // 基础HTML验证
        const hasDoctype = document.doctype !== null;
        const hasLang = document.documentElement.hasAttribute('lang');
        const hasCharset = document.querySelector('meta[charset]');
        
        this.checks.validHTML = hasDoctype && hasLang && hasCharset;
        
        if (!this.checks.validHTML) {
            this.recommendations.push({
                category: 'HTML规范',
                issue: 'HTML结构不规范',
                solution: '确保页面有DOCTYPE声明、lang属性和charset设置',
                priority: 'low'
            });
        }
    }

    // 用户体验检查
    checkNavigation() {
        const hasNav = document.querySelector('nav, .nav, .navigation');
        const hasMenu = document.querySelector('.menu, [role="menu"]');
        
        this.checks.easyNavigation = hasNav || hasMenu;
        
        if (!this.checks.easyNavigation) {
            this.recommendations.push({
                category: '用户体验',
                issue: '缺少清晰的导航',
                solution: '添加导航菜单，帮助用户轻松浏览网站',
                priority: 'medium'
            });
        }
    }

    checkClearPurpose() {
        const title = document.title;
        const description = document.querySelector('meta[name="description"]');
        const hasH1 = document.querySelector('h1');
        
        this.checks.clearPurpose = title && description && hasH1;
        
        if (!this.checks.clearPurpose) {
            this.recommendations.push({
                category: '内容清晰度',
                issue: '网站目的不够明确',
                solution: '确保页面标题、描述和主标题清楚说明网站用途',
                priority: 'medium'
            });
        }
    }

    checkFunctionalFeatures() {
        // 检查网站是否有实际功能
        const hasInteractiveElements = document.querySelectorAll('button, input, select, textarea').length > 0;
        const hasJavaScript = document.querySelectorAll('script').length > 0;
        
        this.checks.functionalFeatures = hasInteractiveElements || hasJavaScript;
        
        if (!this.checks.functionalFeatures) {
            this.recommendations.push({
                category: '功能性',
                issue: '网站缺乏交互功能',
                solution: '添加搜索、筛选等交互功能，提升用户体验',
                priority: 'low'
            });
        }
    }

    // 广告政策检查
    checkAdPlacement() {
        // 检查广告位置是否合规
        const adsenseElements = document.querySelectorAll('[data-ad-client], .adsbygoogle');
        const hasProperAdPlacement = adsenseElements.length === 0 || adsenseElements.length <= 3; // 限制广告数量
        
        this.checks.adPlacementCompliant = hasProperAdPlacement;
        
        if (!this.checks.adPlacementCompliant) {
            this.recommendations.push({
                category: '广告合规',
                issue: '广告位置或数量可能不合规',
                solution: '确保广告位置合理，不影响用户体验',
                priority: 'medium'
            });
        }
    }

    checkProhibitedContent() {
        // 检查是否包含禁止的内容
        const prohibitedKeywords = ['赌博', '色情', '暴力', '仇恨', '毒品'];
        const pageText = document.body.textContent.toLowerCase();
        const hasProhibitedContent = prohibitedKeywords.some(keyword => 
            pageText.includes(keyword)
        );
        
        this.checks.noProhibitedContent = !hasProhibitedContent;
        
        if (hasProhibitedContent) {
            this.recommendations.push({
                category: '内容合规',
                issue: '可能包含禁止的内容',
                solution: '检查并移除任何违反Google政策的内容',
                priority: 'high'
            });
        }
    }

    checkCookieConsent() {
        const hasCookieConsent = document.querySelector('#cookie-consent-banner') || 
                                window.cookieConsent || 
                                document.querySelector('[class*="cookie"]');
        
        this.checks.cookieConsentImplemented = hasCookieConsent !== null;
        
        if (!this.checks.cookieConsentImplemented) {
            this.recommendations.push({
                category: '隐私合规',
                issue: '缺少Cookie同意机制',
                solution: '实施Cookie同意横幅，符合GDPR和隐私法规要求',
                priority: 'high'
            });
        }
    }

    // SEO检查
    checkMetaTags() {
        const hasTitle = document.title && document.title.length > 0;
        const hasDescription = document.querySelector('meta[name="description"]');
        const hasKeywords = document.querySelector('meta[name="keywords"]');
        
        this.checks.hasMetaTags = hasTitle && hasDescription;
        
        if (!this.checks.hasMetaTags) {
            this.recommendations.push({
                category: 'SEO优化',
                issue: '缺少重要的meta标签',
                solution: '添加页面标题和描述meta标签',
                priority: 'medium'
            });
        }
    }

    checkSitemap() {
        // 检查sitemap.xml是否存在
        fetch('/sitemap.xml')
            .then(response => {
                this.checks.hasSitemap = response.ok;
                if (!this.checks.hasSitemap) {
                    this.recommendations.push({
                        category: 'SEO优化',
                        issue: '缺少网站地图',
                        solution: '创建sitemap.xml文件，帮助搜索引擎索引网站',
                        priority: 'low'
                    });
                }
            })
            .catch(() => {
                this.checks.hasSitemap = false;
            });
    }

    checkRobotsTxt() {
        // 检查robots.txt是否存在
        fetch('/robots.txt')
            .then(response => {
                this.checks.hasRobotsTxt = response.ok;
                if (!this.checks.hasRobotsTxt) {
                    this.recommendations.push({
                        category: 'SEO优化',
                        issue: '缺少robots.txt文件',
                        solution: '创建robots.txt文件，指导搜索引擎爬虫',
                        priority: 'low'
                    });
                }
            })
            .catch(() => {
                this.checks.hasRobotsTxt = false;
            });
    }

    checkStructuredData() {
        const hasJsonLd = document.querySelector('script[type="application/ld+json"]');
        const hasOpenGraph = document.querySelector('meta[property^="og:"]');
        
        this.checks.hasStructuredData = hasJsonLd || hasOpenGraph;
        
        if (!this.checks.hasStructuredData) {
            this.recommendations.push({
                category: 'SEO优化',
                issue: '缺少结构化数据',
                solution: '添加JSON-LD或Open Graph标签，提升搜索结果展示',
                priority: 'low'
            });
        }
    }

    calculateScore() {
        this.score = Object.values(this.checks).filter(check => check === true).length;
    }

    generateReport() {
        const percentage = Math.round((this.score / this.maxScore) * 100);
        
        console.log('📊 Google Ads Compliance Report');
        console.log('================================');
        console.log(`Overall Score: ${this.score}/${this.maxScore} (${percentage}%)`);
        console.log('');
        
        // 按优先级分组显示建议
        const highPriority = this.recommendations.filter(r => r.priority === 'high');
        const mediumPriority = this.recommendations.filter(r => r.priority === 'medium');
        const lowPriority = this.recommendations.filter(r => r.priority === 'low');
        
        if (highPriority.length > 0) {
            console.log('🚨 High Priority Issues:');
            highPriority.forEach((rec, index) => {
                console.log(`${index + 1}. [${rec.category}] ${rec.issue}`);
                console.log(`   Solution: ${rec.solution}`);
                console.log('');
            });
        }
        
        if (mediumPriority.length > 0) {
            console.log('⚠️ Medium Priority Issues:');
            mediumPriority.forEach((rec, index) => {
                console.log(`${index + 1}. [${rec.category}] ${rec.issue}`);
                console.log(`   Solution: ${rec.solution}`);
                console.log('');
            });
        }
        
        if (lowPriority.length > 0) {
            console.log('💡 Low Priority Improvements:');
            lowPriority.forEach((rec, index) => {
                console.log(`${index + 1}. [${rec.category}] ${rec.issue}`);
                console.log(`   Solution: ${rec.solution}`);
                console.log('');
            });
        }
        
        // 给出总体评估
        if (percentage >= 90) {
            console.log('✅ Excellent! Your website is highly likely to pass Google Ads review.');
        } else if (percentage >= 80) {
            console.log('👍 Good! Address the high priority issues to improve approval chances.');
        } else if (percentage >= 70) {
            console.log('⚠️ Fair. Several improvements needed before applying for Google Ads.');
        } else {
            console.log('❌ Poor. Significant improvements required before Google Ads application.');
        }
        
        return {
            score: this.score,
            maxScore: this.maxScore,
            percentage: percentage,
            checks: this.checks,
            recommendations: this.recommendations
        };
    }

    // 公共方法：获取检查结果
    getResults() {
        return {
            score: this.score,
            maxScore: this.maxScore,
            percentage: Math.round((this.score / this.maxScore) * 100),
            checks: this.checks,
            recommendations: this.recommendations
        };
    }

    // 公共方法：重新运行检查
    recheck() {
        this.checks = Object.fromEntries(Object.keys(this.checks).map(key => [key, false]));
        this.recommendations = [];
        this.score = 0;
        this.runAllChecks();
    }
}

// 页面加载完成后自动运行检查
document.addEventListener('DOMContentLoaded', () => {
    // 延迟执行，确保所有资源加载完成
    setTimeout(() => {
        window.googleAdsChecker = new GoogleAdsComplianceChecker();
    }, 2000);
});

// 导出给其他脚本使用
window.GoogleAdsComplianceChecker = GoogleAdsComplianceChecker;
