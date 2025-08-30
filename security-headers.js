/**
 * AINAV.ART 安全头部和CSP策略配置
 * 增强网站安全性，符合谷歌Ads安全要求
 */

class SecurityHeadersManager {
    constructor() {
        this.config = {
            enableCSP: true,
            enableHSTS: true,
            enableXFrameOptions: true,
            enableXContentTypeOptions: true,
            enableReferrerPolicy: true,
            enablePermissionsPolicy: true,
            enableSecurityHeaders: true
        };
        
        this.cspDirectives = {
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                "'unsafe-inline'", // 需要内联脚本
                "'unsafe-eval'", // 某些库需要
                "https://www.googletagmanager.com",
                "https://www.google-analytics.com",
                "https://pagead2.googlesyndication.com",
                "https://hm.baidu.com",
                "https://fonts.googleapis.com"
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'", // 需要内联样式
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com"
            ],
            'img-src': [
                "'self'",
                "data:",
                "https:",
                "http:", // 兼容性考虑
                "blob:"
            ],
            'font-src': [
                "'self'",
                "https://fonts.gstatic.com",
                "data:"
            ],
            'connect-src': [
                "'self'",
                "https://www.google-analytics.com",
                "https://hm.baidu.com",
                "https://pagead2.googlesyndication.com"
            ],
            'frame-src': [
                "'self'",
                "https://www.google.com",
                "https://pagead2.googlesyndication.com"
            ],
            'object-src': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
            'frame-ancestors': ["'none'"],
            'upgrade-insecure-requests': []
        };
        
        this.securityHeaders = {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Permissions-Policy': this.generatePermissionsPolicy()
        };
        
        this.init();
    }

    init() {
        console.log('🔒 Initializing Security Headers...');
        this.addMetaSecurityHeaders();
        this.generateCSPMeta();
        this.addSecurityEventListeners();
        this.implementSecurityMeasures();
        this.monitorSecurityViolations();
        console.log('✅ Security Headers Initialized');
    }

    // 添加Meta安全头部
    addMetaSecurityHeaders() {
        const securityMetas = [
            {
                'http-equiv': 'X-Frame-Options',
                content: 'DENY'
            },
            {
                'http-equiv': 'X-Content-Type-Options',
                content: 'nosniff'
            },
            {
                'http-equiv': 'X-XSS-Protection',
                content: '1; mode=block'
            },
            {
                'http-equiv': 'Referrer-Policy',
                content: 'strict-origin-when-cross-origin'
            },
            {
                'http-equiv': 'Permissions-Policy',
                content: this.generatePermissionsPolicy()
            }
        ];
        
        securityMetas.forEach(meta => {
            if (!document.querySelector(`meta[http-equiv="${meta['http-equiv']}"]`)) {
                const metaElement = document.createElement('meta');
                metaElement.setAttribute('http-equiv', meta['http-equiv']);
                metaElement.content = meta.content;
                document.head.appendChild(metaElement);
            }
        });
    }

    // 生成CSP Meta标签
    generateCSPMeta() {
        const cspString = Object.entries(this.cspDirectives)
            .map(([directive, sources]) => {
                if (sources.length === 0) {
                    return directive;
                }
                return `${directive} ${sources.join(' ')}`;
            })
            .join('; ');
        
        // 检查是否已存在CSP meta标签
        const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!existingCSP) {
            const cspMeta = document.createElement('meta');
            cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
            cspMeta.content = cspString;
            document.head.appendChild(cspMeta);
            
            console.log('🔒 CSP Policy Applied:', cspString);
        }
    }

    // 生成权限策略
    generatePermissionsPolicy() {
        const permissions = [
            'geolocation=()',
            'microphone=()',
            'camera=()',
            'payment=()',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()',
            'ambient-light-sensor=()',
            'autoplay=(self)',
            'encrypted-media=(self)',
            'fullscreen=(self)',
            'picture-in-picture=(self)'
        ];
        
        return permissions.join(', ');
    }

    // 添加安全事件监听器
    addSecurityEventListeners() {
        // 监听CSP违规
        document.addEventListener('securitypolicyviolation', (e) => {
            console.warn('🚨 CSP Violation:', {
                blockedURI: e.blockedURI,
                violatedDirective: e.violatedDirective,
                originalPolicy: e.originalPolicy,
                sourceFile: e.sourceFile,
                lineNumber: e.lineNumber
            });
            
            this.reportSecurityViolation('csp', e);
        });
        
        // 监听混合内容警告
        if ('SecurityPolicyViolationEvent' in window) {
            window.addEventListener('securitypolicyviolation', (e) => {
                if (e.violatedDirective === 'upgrade-insecure-requests') {
                    console.warn('🚨 Mixed Content Detected:', e.blockedURI);
                    this.reportSecurityViolation('mixed-content', e);
                }
            });
        }
    }

    // 实施安全措施
    implementSecurityMeasures() {
        // 防止点击劫持
        this.preventClickjacking();
        
        // 防止XSS攻击
        this.preventXSS();
        
        // 安全的外部链接
        this.secureExternalLinks();
        
        // 防止CSRF攻击
        this.preventCSRF();
        
        // 安全的表单处理
        this.secureFormHandling();
        
        // 防止信息泄露
        this.preventInformationLeakage();
    }

    preventClickjacking() {
        // 检查是否在iframe中
        if (window.top !== window.self) {
            console.warn('🚨 Potential Clickjacking Detected');
            
            // 可选：阻止在iframe中显示
            if (this.config.enableXFrameOptions) {
                document.body.style.display = 'none';
                alert('此页面不能在框架中显示，为了您的安全，页面已被阻止。');
            }
        }
    }

    preventXSS() {
        // 转义用户输入
        const userInputs = document.querySelectorAll('input, textarea');
        userInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                const sanitized = this.sanitizeInput(value);
                if (value !== sanitized) {
                    e.target.value = sanitized;
                    console.warn('🚨 Potentially malicious input sanitized');
                }
            });
        });
        
        // 防止innerHTML注入
        this.protectInnerHTML();
    }

    sanitizeInput(input) {
        // 基础XSS防护
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    protectInnerHTML() {
        // 重写innerHTML以添加安全检查
        const originalInnerHTML = Element.prototype.innerHTML;
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            get: function() {
                return originalInnerHTML.call(this);
            },
            set: function(value) {
                const sanitized = this.sanitizeHTML ? this.sanitizeHTML(value) : value;
                return originalInnerHTML.call(this, sanitized);
            }
        });
    }

    secureExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        
        externalLinks.forEach(link => {
            const hostname = new URL(link.href).hostname;
            
            // 如果是外部链接
            if (hostname !== window.location.hostname) {
                // 添加安全属性
                if (!link.hasAttribute('rel')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                } else {
                    const rel = link.getAttribute('rel');
                    if (!rel.includes('noopener')) {
                        link.setAttribute('rel', rel + ' noopener');
                    }
                    if (!rel.includes('noreferrer')) {
                        link.setAttribute('rel', link.getAttribute('rel') + ' noreferrer');
                    }
                }
                
                // 添加target="_blank"
                if (!link.hasAttribute('target')) {
                    link.setAttribute('target', '_blank');
                }
                
                // 添加安全警告（可选）
                link.addEventListener('click', (e) => {
                    if (!this.isTrustedDomain(hostname)) {
                        const confirmed = confirm(`您即将访问外部网站: ${hostname}\n请确认这是您想要访问的网站。`);
                        if (!confirmed) {
                            e.preventDefault();
                        }
                    }
                });
            }
        });
    }

    isTrustedDomain(hostname) {
        const trustedDomains = [
            'github.com',
            'google.com',
            'googleapis.com',
            'gstatic.com',
            'googlesyndication.com',
            'googletagmanager.com',
            'google-analytics.com',
            'baidu.com',
            'openai.com',
            'anthropic.com',
            'midjourney.com'
        ];
        
        return trustedDomains.some(domain => 
            hostname === domain || hostname.endsWith('.' + domain)
        );
    }

    preventCSRF() {
        // 为表单添加CSRF令牌
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            if (form.method && form.method.toLowerCase() === 'post') {
                // 生成CSRF令牌
                const csrfToken = this.generateCSRFToken();
                
                // 添加隐藏字段
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
                
                // 存储令牌用于验证
                sessionStorage.setItem('csrf_token', csrfToken);
            }
        });
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    secureFormHandling() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                // 验证CSRF令牌
                if (form.method && form.method.toLowerCase() === 'post') {
                    const formToken = form.querySelector('input[name="csrf_token"]')?.value;
                    const sessionToken = sessionStorage.getItem('csrf_token');
                    
                    if (!formToken || formToken !== sessionToken) {
                        e.preventDefault();
                        console.error('🚨 CSRF Token Validation Failed');
                        alert('安全验证失败，请刷新页面后重试。');
                        return;
                    }
                }
                
                // 验证表单数据
                const formData = new FormData(form);
                for (let [key, value] of formData.entries()) {
                    if (typeof value === 'string' && this.containsMaliciousContent(value)) {
                        e.preventDefault();
                        console.error('🚨 Malicious Content Detected in Form');
                        alert('检测到恶意内容，表单提交已被阻止。');
                        return;
                    }
                }
            });
        });
    }

    containsMaliciousContent(content) {
        const maliciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /eval\s*\(/i,
            /expression\s*\(/i
        ];
        
        return maliciousPatterns.some(pattern => pattern.test(content));
    }

    preventInformationLeakage() {
        // 禁用右键菜单（可选）
        if (this.config.disableRightClick) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        }
        
        // 禁用开发者工具快捷键（可选）
        if (this.config.disableDevTools) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    console.warn('🚨 Developer tools access attempt blocked');
                }
            });
        }
        
        // 防止控制台信息泄露
        this.protectConsole();
    }

    protectConsole() {
        // 重写console方法以过滤敏感信息
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            const filteredArgs = args.map(arg => this.filterSensitiveInfo(arg));
            originalLog.apply(console, filteredArgs);
        };
        
        console.error = (...args) => {
            const filteredArgs = args.map(arg => this.filterSensitiveInfo(arg));
            originalError.apply(console, filteredArgs);
        };
        
        console.warn = (...args) => {
            const filteredArgs = args.map(arg => this.filterSensitiveInfo(arg));
            originalWarn.apply(console, filteredArgs);
        };
    }

    filterSensitiveInfo(data) {
        if (typeof data === 'string') {
            // 过滤敏感信息
            return data
                .replace(/password[=:]\s*[^\s,}]*/gi, 'password=***')
                .replace(/token[=:]\s*[^\s,}]*/gi, 'token=***')
                .replace(/key[=:]\s*[^\s,}]*/gi, 'key=***')
                .replace(/secret[=:]\s*[^\s,}]*/gi, 'secret=***');
        }
        
        if (typeof data === 'object' && data !== null) {
            const filtered = { ...data };
            Object.keys(filtered).forEach(key => {
                if (/password|token|key|secret/i.test(key)) {
                    filtered[key] = '***';
                }
            });
            return filtered;
        }
        
        return data;
    }

    // 监控安全违规
    monitorSecurityViolations() {
        // 创建安全事件收集器
        this.securityEvents = [];
        
        // 监控异常的网络请求
        this.monitorNetworkRequests();
        
        // 监控DOM变化
        this.monitorDOMChanges();
        
        // 定期报告安全状态
        setInterval(() => {
            this.reportSecurityStatus();
        }, 300000); // 5分钟
    }

    monitorNetworkRequests() {
        // 重写fetch以监控请求
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const [url, options] = args;
            
            // 检查请求URL
            if (typeof url === 'string' && !this.isAllowedURL(url)) {
                console.warn('🚨 Blocked suspicious network request:', url);
                throw new Error('Request blocked by security policy');
            }
            
            try {
                const response = await originalFetch.apply(window, args);
                
                // 记录成功的请求
                this.logSecurityEvent('network_request', {
                    url: typeof url === 'string' ? url : url.url,
                    method: options?.method || 'GET',
                    status: response.status
                });
                
                return response;
            } catch (error) {
                // 记录失败的请求
                this.logSecurityEvent('network_error', {
                    url: typeof url === 'string' ? url : url.url,
                    error: error.message
                });
                throw error;
            }
        };
    }

    isAllowedURL(url) {
        try {
            const urlObj = new URL(url, window.location.origin);
            const hostname = urlObj.hostname;
            
            // 允许同源请求
            if (hostname === window.location.hostname) {
                return true;
            }
            
            // 检查是否在白名单中
            return this.isTrustedDomain(hostname);
        } catch (error) {
            return false;
        }
    }

    monitorDOMChanges() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.checkAddedElement(node);
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    checkAddedElement(element) {
        // 检查是否添加了可疑元素
        const suspiciousElements = ['script', 'iframe', 'object', 'embed'];
        
        if (suspiciousElements.includes(element.tagName.toLowerCase())) {
            console.warn('🚨 Suspicious element added to DOM:', element);
            
            this.logSecurityEvent('dom_manipulation', {
                tagName: element.tagName,
                src: element.src,
                innerHTML: element.innerHTML.substring(0, 100)
            });
            
            // 可选：移除可疑元素
            if (this.config.removeSupiciousElements) {
                element.remove();
            }
        }
    }

    logSecurityEvent(type, data) {
        const event = {
            type: type,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            data: data
        };
        
        this.securityEvents.push(event);
        
        // 限制事件数量
        if (this.securityEvents.length > 100) {
            this.securityEvents = this.securityEvents.slice(-50);
        }
    }

    reportSecurityViolation(type, event) {
        // 报告安全违规到服务器（如果配置了）
        if (this.config.reportEndpoint) {
            fetch(this.config.reportEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type,
                    event: {
                        blockedURI: event.blockedURI,
                        violatedDirective: event.violatedDirective,
                        sourceFile: event.sourceFile,
                        lineNumber: event.lineNumber
                    },
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                })
            }).catch(error => {
                console.error('Failed to report security violation:', error);
            });
        }
    }

    reportSecurityStatus() {
        const status = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            eventsCount: this.securityEvents.length,
            recentEvents: this.securityEvents.slice(-10),
            securityFeatures: {
                csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
                xFrameOptions: !!document.querySelector('meta[http-equiv="X-Frame-Options"]'),
                xssProtection: !!document.querySelector('meta[http-equiv="X-XSS-Protection"]'),
                httpsOnly: window.location.protocol === 'https:'
            }
        };
        
        console.log('🔒 Security Status Report:', status);
        return status;
    }

    // 公共方法
    getSecurityStatus() {
        return this.reportSecurityStatus();
    }

    getSecurityEvents() {
        return this.securityEvents;
    }

    updateCSP(newDirectives) {
        this.cspDirectives = { ...this.cspDirectives, ...newDirectives };
        this.generateCSPMeta();
    }
}

// 初始化安全头部管理器
document.addEventListener('DOMContentLoaded', () => {
    window.securityHeadersManager = new SecurityHeadersManager();
});

// 导出给其他脚本使用
window.SecurityHeadersManager = SecurityHeadersManager;
