/**
 * AINAV.ART Cookie 同意管理系统
 * 符合GDPR和谷歌Ads要求的Cookie同意横幅
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'ainav_cookie_consent';
        this.consentData = this.getConsentData();
        this.init();
    }

    init() {
        // 如果用户还没有做出选择，显示Cookie横幅
        if (!this.consentData.hasConsented) {
            this.showConsentBanner();
        } else {
            // 根据用户选择加载相应的服务
            this.loadConsentedServices();
        }
    }

    showConsentBanner() {
        const banner = this.createConsentBanner();
        document.body.appendChild(banner);
        
        // 添加动画效果
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    createConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h4>🍪 Cookie 使用说明</h4>
                    <p>我们使用Cookie来改善您的浏览体验、提供个性化内容和分析网站流量。通过点击"接受全部"，您同意我们使用所有Cookie。您也可以管理您的偏好设置。</p>
                    <div class="cookie-types">
                        <div class="cookie-type">
                            <label>
                                <input type="checkbox" id="necessary-cookies" checked disabled>
                                <strong>必要Cookie</strong> - 网站正常运行所必需
                            </label>
                        </div>
                        <div class="cookie-type">
                            <label>
                                <input type="checkbox" id="analytics-cookies" checked>
                                <strong>分析Cookie</strong> - 帮助我们了解网站使用情况 (Google Analytics)
                            </label>
                        </div>
                        <div class="cookie-type">
                            <label>
                                <input type="checkbox" id="advertising-cookies" checked>
                                <strong>广告Cookie</strong> - 用于显示相关广告 (Google AdSense)
                            </label>
                        </div>
                        <div class="cookie-type">
                            <label>
                                <input type="checkbox" id="functional-cookies" checked>
                                <strong>功能Cookie</strong> - 记住您的偏好设置
                            </label>
                        </div>
                    </div>
                </div>
                <div class="cookie-consent-actions">
                    <button id="accept-all-cookies" class="btn btn-primary">接受全部</button>
                    <button id="accept-selected-cookies" class="btn btn-secondary">保存选择</button>
                    <button id="reject-all-cookies" class="btn btn-outline">仅必要Cookie</button>
                    <a href="/privacy-policy.html" target="_blank" class="privacy-link">查看隐私政策</a>
                </div>
            </div>
        `;

        // 添加样式
        this.addConsentStyles();
        
        // 绑定事件
        this.bindConsentEvents(banner);
        
        return banner;
    }

    addConsentStyles() {
        if (document.getElementById('cookie-consent-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'cookie-consent-styles';
        styles.textContent = `
            .cookie-consent-banner {
                position: fixed;
                bottom: -100%;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                border-top: 1px solid #e0e0e0;
                box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                transition: bottom 0.3s ease-in-out;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .cookie-consent-banner.show {
                bottom: 0;
            }
            
            .cookie-consent-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                display: flex;
                gap: 30px;
                align-items: flex-start;
            }
            
            .cookie-consent-text {
                flex: 1;
            }
            
            .cookie-consent-text h4 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 18px;
            }
            
            .cookie-consent-text p {
                margin: 0 0 15px 0;
                color: #666;
                line-height: 1.5;
                font-size: 14px;
            }
            
            .cookie-types {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .cookie-type label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: #555;
                cursor: pointer;
            }
            
            .cookie-type input[type="checkbox"] {
                margin: 0;
            }
            
            .cookie-consent-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-width: 200px;
            }
            
            .cookie-consent-actions .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                text-decoration: none;
            }
            
            .btn-primary {
                background: #667eea;
                color: white;
            }
            
            .btn-primary:hover {
                background: #5a6fd8;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #5a6268;
            }
            
            .btn-outline {
                background: transparent;
                color: #667eea;
                border: 1px solid #667eea;
            }
            
            .btn-outline:hover {
                background: #667eea;
                color: white;
            }
            
            .privacy-link {
                color: #667eea;
                text-decoration: none;
                font-size: 12px;
                text-align: center;
                padding: 5px;
            }
            
            .privacy-link:hover {
                text-decoration: underline;
            }
            
            @media (max-width: 768px) {
                .cookie-consent-content {
                    flex-direction: column;
                    gap: 20px;
                }
                
                .cookie-types {
                    grid-template-columns: 1fr;
                }
                
                .cookie-consent-actions {
                    min-width: auto;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    bindConsentEvents(banner) {
        const acceptAllBtn = banner.querySelector('#accept-all-cookies');
        const acceptSelectedBtn = banner.querySelector('#accept-selected-cookies');
        const rejectAllBtn = banner.querySelector('#reject-all-cookies');

        acceptAllBtn.addEventListener('click', () => {
            this.saveConsent({
                necessary: true,
                analytics: true,
                advertising: true,
                functional: true
            });
            this.hideConsentBanner(banner);
        });

        acceptSelectedBtn.addEventListener('click', () => {
            const consent = {
                necessary: true, // 始终为true
                analytics: banner.querySelector('#analytics-cookies').checked,
                advertising: banner.querySelector('#advertising-cookies').checked,
                functional: banner.querySelector('#functional-cookies').checked
            };
            this.saveConsent(consent);
            this.hideConsentBanner(banner);
        });

        rejectAllBtn.addEventListener('click', () => {
            this.saveConsent({
                necessary: true,
                analytics: false,
                advertising: false,
                functional: false
            });
            this.hideConsentBanner(banner);
        });
    }

    saveConsent(consent) {
        const consentData = {
            hasConsented: true,
            timestamp: new Date().toISOString(),
            consent: consent
        };
        
        localStorage.setItem(this.cookieName, JSON.stringify(consentData));
        this.consentData = consentData;
        
        // 根据用户选择加载服务
        this.loadConsentedServices();
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: consentData
        }));
    }

    getConsentData() {
        try {
            const stored = localStorage.getItem(this.cookieName);
            if (stored) {
                const data = JSON.parse(stored);
                // 检查是否过期（30天）
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                
                if (new Date(data.timestamp) > thirtyDaysAgo) {
                    return data;
                }
            }
        } catch (error) {
            console.warn('Failed to parse cookie consent data:', error);
        }
        
        return { hasConsented: false };
    }

    loadConsentedServices() {
        if (!this.consentData.hasConsented) return;
        
        const consent = this.consentData.consent;
        
        // 加载Google Analytics
        if (consent.analytics) {
            this.loadGoogleAnalytics();
        }
        
        // 加载Google AdSense
        if (consent.advertising) {
            this.loadGoogleAdSense();
        }
        
        // 加载百度统计
        if (consent.analytics) {
            this.loadBaiduAnalytics();
        }
        
        // 加载功能性Cookie
        if (consent.functional) {
            this.loadFunctionalCookies();
        }
    }

    loadGoogleAnalytics() {
        if (window.gtag) return; // 已加载
        
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-GBG1P2RHMC';
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GBG1P2RHMC', {
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
            });
        `;
        document.head.appendChild(script2);
    }

    loadGoogleAdSense() {
        if (document.querySelector('script[src*="adsbygoogle"]')) return; // 已加载
        
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4770465793767896';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    }

    loadBaiduAnalytics() {
        if (window._hmt) return; // 已加载
        
        window._hmt = window._hmt || [];
        const script = document.createElement('script');
        script.src = 'https://hm.baidu.com/hm.js?c05bb16ea908292af9f6c513087a1cc3';
        document.head.appendChild(script);
    }

    loadFunctionalCookies() {
        // 加载用户偏好设置等功能性Cookie
        console.log('Functional cookies enabled');
    }

    hideConsentBanner(banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 300);
    }

    // 公共方法：检查特定类型的Cookie是否被允许
    hasConsent(type) {
        if (!this.consentData.hasConsented) return false;
        return this.consentData.consent[type] || false;
    }

    // 公共方法：重新显示Cookie设置
    showSettings() {
        this.showConsentBanner();
    }
}

// 初始化Cookie同意管理
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsent();
});

// 导出给其他脚本使用
window.CookieConsent = CookieConsent;
