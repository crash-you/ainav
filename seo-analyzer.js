/**
 * AINAV.ART SEO分析工具
 * 用于检测和分析网站SEO状况的JavaScript工具
 */

class SEOAnalyzer {
    constructor() {
        this.results = {
            score: 0,
            issues: [],
            suggestions: [],
            passed: []
        };
        this.weights = {
            title: 15,
            description: 15,
            keywords: 10,
            headings: 15,
            images: 10,
            links: 10,
            structured_data: 15,
            performance: 10
        };
    }

    // 运行完整的SEO分析
    analyze() {
        console.log('🔍 开始SEO分析...');
        
        this.checkTitle();
        this.checkMetaDescription();
        this.checkMetaKeywords();
        this.checkHeadings();
        this.checkImages();
        this.checkLinks();
        this.checkStructuredData();
        this.checkPerformance();
        this.checkOpenGraph();
        this.checkTwitterCards();
        this.checkCanonical();
        this.checkRobots();
        this.checkSitemap();
        this.checkSSL();
        this.checkMobile();
        this.checkPageSpeed();
        
        this.calculateScore();
        this.generateReport();
        
        return this.results;
    }

    // 检查页面标题
    checkTitle() {
        const title = document.querySelector('title');
        if (!title) {
            this.addIssue('缺少页面标题', 'title', this.weights.title);
            return;
        }
        
        const titleText = title.textContent.trim();
        const titleLength = titleText.length;
        
        if (titleLength === 0) {
            this.addIssue('页面标题为空', 'title', this.weights.title);
        } else if (titleLength < 30) {
            this.addSuggestion('页面标题过短，建议30-60字符', 'title');
        } else if (titleLength > 60) {
            this.addSuggestion('页面标题过长，建议30-60字符', 'title');
        } else {
            this.addPassed('页面标题长度合适', 'title', this.weights.title);
        }
        
        // 检查是否包含品牌名
        if (titleText.includes('AINAV.ART')) {
            this.addPassed('标题包含品牌名', 'title', 5);
        } else {
            this.addSuggestion('建议在标题中包含品牌名AINAV.ART', 'title');
        }
    }

    // 检查Meta描述
    checkMetaDescription() {
        const description = document.querySelector('meta[name="description"]');
        if (!description) {
            this.addIssue('缺少Meta描述', 'description', this.weights.description);
            return;
        }
        
        const descText = description.getAttribute('content').trim();
        const descLength = descText.length;
        
        if (descLength === 0) {
            this.addIssue('Meta描述为空', 'description', this.weights.description);
        } else if (descLength < 120) {
            this.addSuggestion('Meta描述过短，建议120-160字符', 'description');
        } else if (descLength > 160) {
            this.addSuggestion('Meta描述过长，建议120-160字符', 'description');
        } else {
            this.addPassed('Meta描述长度合适', 'description', this.weights.description);
        }
    }

    // 检查Meta关键词
    checkMetaKeywords() {
        const keywords = document.querySelector('meta[name="keywords"]');
        if (!keywords) {
            this.addSuggestion('建议添加Meta关键词', 'keywords');
            return;
        }
        
        const keywordsText = keywords.getAttribute('content').trim();
        const keywordCount = keywordsText.split(',').length;
        
        if (keywordCount > 10) {
            this.addSuggestion('关键词过多，建议5-10个', 'keywords');
        } else if (keywordCount >= 5) {
            this.addPassed('关键词数量合适', 'keywords', this.weights.keywords);
        } else {
            this.addSuggestion('关键词过少，建议5-10个', 'keywords');
        }
    }

    // 检查标题结构
    checkHeadings() {
        const h1s = document.querySelectorAll('h1');
        const h2s = document.querySelectorAll('h2');
        const h3s = document.querySelectorAll('h3');
        
        if (h1s.length === 0) {
            this.addIssue('缺少H1标题', 'headings', 10);
        } else if (h1s.length === 1) {
            this.addPassed('H1标题数量正确', 'headings', 5);
        } else {
            this.addSuggestion('H1标题过多，建议只有一个', 'headings');
        }
        
        if (h2s.length > 0) {
            this.addPassed('包含H2标题', 'headings', 5);
        }
        
        if (h3s.length > 0) {
            this.addPassed('包含H3标题', 'headings', 5);
        }
    }

    // 检查图片优化
    checkImages() {
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        let imagesWithoutAlt = 0;
        
        images.forEach(img => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim() === '') {
                imagesWithoutAlt++;
            } else {
                imagesWithAlt++;
            }
        });
        
        if (images.length === 0) {
            this.addSuggestion('页面没有图片', 'images');
        } else {
            const altRatio = imagesWithAlt / images.length;
            if (altRatio === 1) {
                this.addPassed('所有图片都有Alt标签', 'images', this.weights.images);
            } else if (altRatio >= 0.8) {
                this.addSuggestion(`${imagesWithoutAlt}张图片缺少Alt标签`, 'images');
            } else {
                this.addIssue(`${imagesWithoutAlt}张图片缺少Alt标签`, 'images', 5);
            }
        }
    }

    // 检查链接
    checkLinks() {
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="ainav.art"])');
        
        if (internalLinks.length > 0) {
            this.addPassed(`包含${internalLinks.length}个内部链接`, 'links', 5);
        }
        
        // 检查外部链接的nofollow
        let externalWithoutNofollow = 0;
        externalLinks.forEach(link => {
            const rel = link.getAttribute('rel');
            if (!rel || !rel.includes('nofollow')) {
                externalWithoutNofollow++;
            }
        });
        
        if (externalWithoutNofollow > 0) {
            this.addSuggestion(`${externalWithoutNofollow}个外部链接建议添加nofollow`, 'links');
        }
    }

    // 检查结构化数据
    checkStructuredData() {
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        
        if (jsonLdScripts.length === 0) {
            this.addIssue('缺少结构化数据', 'structured_data', this.weights.structured_data);
        } else {
            this.addPassed(`包含${jsonLdScripts.length}个结构化数据`, 'structured_data', this.weights.structured_data);
            
            // 检查结构化数据类型
            jsonLdScripts.forEach(script => {
                try {
                    const data = JSON.parse(script.textContent);
                    if (data['@type']) {
                        this.addPassed(`包含${data['@type']}结构化数据`, 'structured_data', 2);
                    }
                } catch (e) {
                    this.addIssue('结构化数据格式错误', 'structured_data', 5);
                }
            });
        }
    }

    // 检查Open Graph
    checkOpenGraph() {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        
        let ogScore = 0;
        if (ogTitle) ogScore += 2;
        if (ogDescription) ogScore += 2;
        if (ogImage) ogScore += 3;
        if (ogUrl) ogScore += 3;
        
        if (ogScore >= 8) {
            this.addPassed('Open Graph标签完整', 'social', 10);
        } else if (ogScore >= 5) {
            this.addSuggestion('Open Graph标签不完整', 'social');
        } else {
            this.addIssue('缺少Open Graph标签', 'social', 5);
        }
    }

    // 检查Twitter Cards
    checkTwitterCards() {
        const twitterCard = document.querySelector('meta[name="twitter:card"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        
        if (twitterCard && twitterTitle && twitterDescription) {
            this.addPassed('Twitter Cards配置完整', 'social', 5);
        } else {
            this.addSuggestion('Twitter Cards配置不完整', 'social');
        }
    }

    // 检查Canonical链接
    checkCanonical() {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            this.addPassed('包含Canonical链接', 'technical', 5);
        } else {
            this.addSuggestion('建议添加Canonical链接', 'technical');
        }
    }

    // 检查Robots meta
    checkRobots() {
        const robots = document.querySelector('meta[name="robots"]');
        if (robots) {
            const content = robots.getAttribute('content');
            if (content.includes('noindex')) {
                this.addIssue('页面设置为noindex', 'technical', 10);
            } else {
                this.addPassed('Robots设置正常', 'technical', 3);
            }
        }
    }

    // 检查Sitemap
    checkSitemap() {
        // 这个需要通过网络请求检查，这里只是示例
        this.addSuggestion('请确保sitemap.xml存在且可访问', 'technical');
    }

    // 检查HTTPS
    checkSSL() {
        if (location.protocol === 'https:') {
            this.addPassed('使用HTTPS协议', 'security', 10);
        } else {
            this.addIssue('未使用HTTPS协议', 'security', 15);
        }
    }

    // 检查移动端适配
    checkMobile() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            this.addPassed('包含viewport meta标签', 'mobile', 5);
        } else {
            this.addIssue('缺少viewport meta标签', 'mobile', 10);
        }
    }

    // 检查页面性能
    checkPerformance() {
        // 检查是否有性能优化标签
        const preconnect = document.querySelectorAll('link[rel="preconnect"]');
        const preload = document.querySelectorAll('link[rel="preload"]');
        
        if (preconnect.length > 0) {
            this.addPassed('使用preconnect优化', 'performance', 3);
        }
        
        if (preload.length > 0) {
            this.addPassed('使用preload优化', 'performance', 3);
        }
        
        // 检查压缩
        if (document.documentElement.innerHTML.length < 50000) {
            this.addPassed('页面大小合理', 'performance', 4);
        } else {
            this.addSuggestion('页面较大，建议优化', 'performance');
        }
    }

    // 检查页面速度
    checkPageSpeed() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            if (loadTime < 3000) {
                this.addPassed('页面加载速度良好', 'performance', 5);
            } else if (loadTime < 5000) {
                this.addSuggestion('页面加载速度一般', 'performance');
            } else {
                this.addIssue('页面加载速度较慢', 'performance', 5);
            }
        }
    }

    // 添加问题
    addIssue(message, category, impact = 5) {
        this.results.issues.push({
            message,
            category,
            impact,
            type: 'error'
        });
    }

    // 添加建议
    addSuggestion(message, category) {
        this.results.suggestions.push({
            message,
            category,
            type: 'warning'
        });
    }

    // 添加通过项
    addPassed(message, category, score = 0) {
        this.results.passed.push({
            message,
            category,
            score
        });
        this.results.score += score;
    }

    // 计算总分
    calculateScore() {
        const totalImpact = this.results.issues.reduce((sum, issue) => sum + issue.impact, 0);
        this.results.score = Math.max(0, this.results.score - totalImpact);
        this.results.maxScore = Object.values(this.weights).reduce((sum, weight) => sum + weight, 0) + 50; // 额外分数
        this.results.percentage = Math.round((this.results.score / this.results.maxScore) * 100);
    }

    // 生成报告
    generateReport() {
        console.log('📊 SEO分析报告');
        console.log('='.repeat(50));
        console.log(`总分: ${this.results.score}/${this.results.maxScore} (${this.results.percentage}%)`);
        console.log('');
        
        if (this.results.issues.length > 0) {
            console.log('❌ 需要修复的问题:');
            this.results.issues.forEach(issue => {
                console.log(`  • ${issue.message} (影响: ${issue.impact}分)`);
            });
            console.log('');
        }
        
        if (this.results.suggestions.length > 0) {
            console.log('⚠️ 优化建议:');
            this.results.suggestions.forEach(suggestion => {
                console.log(`  • ${suggestion.message}`);
            });
            console.log('');
        }
        
        if (this.results.passed.length > 0) {
            console.log('✅ 通过的检查:');
            this.results.passed.forEach(passed => {
                console.log(`  • ${passed.message} (+${passed.score}分)`);
            });
        }
        
        console.log('='.repeat(50));
        this.generateRecommendations();
    }

    // 生成优化建议
    generateRecommendations() {
        console.log('🎯 优化建议:');
        
        if (this.results.percentage >= 90) {
            console.log('  🎉 SEO优化非常好！继续保持。');
        } else if (this.results.percentage >= 80) {
            console.log('  👍 SEO优化良好，还有提升空间。');
        } else if (this.results.percentage >= 70) {
            console.log('  📈 SEO需要改进，重点关注高影响问题。');
        } else {
            console.log('  🚨 SEO需要大幅优化，建议优先修复所有问题。');
        }
        
        // 分类建议
        const categories = {};
        this.results.issues.forEach(issue => {
            if (!categories[issue.category]) {
                categories[issue.category] = [];
            }
            categories[issue.category].push(issue);
        });
        
        Object.keys(categories).forEach(category => {
            const issues = categories[category];
            const totalImpact = issues.reduce((sum, issue) => sum + issue.impact, 0);
            if (totalImpact > 10) {
                console.log(`  📌 优先优化 ${category} 相关问题 (总影响: ${totalImpact}分)`);
            }
        });
    }

    // 导出报告为JSON
    exportReport() {
        return JSON.stringify(this.results, null, 2);
    }

    // 在页面上显示报告
    displayReport() {
        const reportDiv = document.createElement('div');
        reportDiv.id = 'seo-report';
        reportDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 2px solid #667eea;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        
        reportDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #667eea;">SEO分析报告</h3>
                <button onclick="document.getElementById('seo-report').remove()" style="background: #ff4757; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">×</button>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 24px; font-weight: bold; color: ${this.results.percentage >= 80 ? '#2ed573' : this.results.percentage >= 60 ? '#ffa502' : '#ff4757'};">
                    ${this.results.percentage}%
                </div>
                <div style="color: #666;">
                    ${this.results.score}/${this.results.maxScore} 分
                </div>
            </div>
            ${this.results.issues.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #ff4757; margin: 0 0 10px 0;">❌ 问题 (${this.results.issues.length})</h4>
                    ${this.results.issues.map(issue => `
                        <div style="background: #fff5f5; border-left: 3px solid #ff4757; padding: 8px; margin: 5px 0; font-size: 12px;">
                            ${issue.message}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${this.results.suggestions.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #ffa502; margin: 0 0 10px 0;">⚠️ 建议 (${this.results.suggestions.length})</h4>
                    ${this.results.suggestions.map(suggestion => `
                        <div style="background: #fffbf0; border-left: 3px solid #ffa502; padding: 8px; margin: 5px 0; font-size: 12px;">
                            ${suggestion.message}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div>
                <h4 style="color: #2ed573; margin: 0 0 10px 0;">✅ 通过 (${this.results.passed.length})</h4>
                <div style="max-height: 150px; overflow-y: auto;">
                    ${this.results.passed.map(passed => `
                        <div style="background: #f0fff4; border-left: 3px solid #2ed573; padding: 6px; margin: 3px 0; font-size: 11px;">
                            ${passed.message} (+${passed.score})
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(reportDiv);
    }
}

// 使用方法
function runSEOAnalysis() {
    const analyzer = new SEOAnalyzer();
    const results = analyzer.analyze();
    analyzer.displayReport();
    return results;
}

// 自动运行（如果在浏览器环境中）
if (typeof window !== 'undefined') {
    // 页面加载完成后自动运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                console.log('🚀 运行 runSEOAnalysis() 来分析当前页面的SEO状况');
            }, 1000);
        });
    } else {
        console.log('🚀 运行 runSEOAnalysis() 来分析当前页面的SEO状况');
    }
}

// 导出（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOAnalyzer;
}
