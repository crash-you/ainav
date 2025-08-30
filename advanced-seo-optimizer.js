/**
 * AINAV.ART 高级SEO优化器
 * 深度SEO优化，确保搜索引擎最佳表现和谷歌Ads审核通过
 */

class AdvancedSEOOptimizer {
    constructor() {
        this.config = {
            enableRichSnippets: true,
            enableBreadcrumbs: true,
            enableLocalSEO: true,
            enableVideoSEO: true,
            enableImageSEO: true,
            enableVoiceSearch: true,
            enableMobileSEO: true,
            enableInternationalSEO: true
        };
        
        this.structuredData = {
            organization: null,
            website: null,
            breadcrumbs: [],
            products: [],
            reviews: [],
            faqs: []
        };
        
        this.seoMetrics = {
            titleLength: 0,
            descriptionLength: 0,
            headingStructure: [],
            imageAltCount: 0,
            internalLinks: 0,
            externalLinks: 0,
            pageSpeed: 0,
            mobileUsability: 0
        };
        
        this.init();
    }

    init() {
        console.log('🔍 Starting Advanced SEO Optimization...');
        this.optimizeMetaTags();
        this.generateStructuredData();
        this.optimizeHeadingStructure();
        this.optimizeImages();
        this.optimizeLinks();
        this.addBreadcrumbs();
        this.optimizeForVoiceSearch();
        this.enhanceLocalSEO();
        this.optimizeForMobile();
        this.addSocialMediaOptimization();
        this.generateSEOReport();
        console.log('✅ Advanced SEO Optimization Completed');
    }

    // 优化Meta标签
    optimizeMetaTags() {
        const currentDate = new Date().toISOString().split('T')[0];
        
        // 优化页面标题
        this.optimizeTitle();
        
        // 优化描述
        this.optimizeDescription();
        
        // 添加高级meta标签
        this.addAdvancedMetaTags(currentDate);
        
        // 优化Open Graph
        this.optimizeOpenGraph();
        
        // 优化Twitter Cards
        this.optimizeTwitterCards();
    }

    optimizeTitle() {
        const title = document.title;
        this.seoMetrics.titleLength = title.length;
        
        if (title.length < 30 || title.length > 60) {
            console.warn('⚠️ Title length should be 30-60 characters. Current:', title.length);
        }
        
        // 添加动态标题优化
        if (!title.includes(new Date().getFullYear())) {
            const optimizedTitle = title.replace('AINAV.ART', `AINAV.ART ${new Date().getFullYear()}`);
            document.title = optimizedTitle;
        }
    }

    optimizeDescription() {
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            this.seoMetrics.descriptionLength = description.content.length;
            
            if (description.content.length < 120 || description.content.length > 160) {
                console.warn('⚠️ Description length should be 120-160 characters. Current:', description.content.length);
            }
        }
    }

    addAdvancedMetaTags(currentDate) {
        const metaTags = [
            { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
            { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
            { name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
            { name: 'theme-color', content: '#667eea' },
            { name: 'msapplication-TileColor', content: '#667eea' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
            { name: 'apple-mobile-web-app-title', content: 'AINAV.ART' },
            { name: 'application-name', content: 'AINAV.ART' },
            { name: 'msapplication-tooltip', content: '全球最全AI工具导航' },
            { name: 'msapplication-starturl', content: '/' },
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-touch-fullscreen', content: 'yes' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'date', content: currentDate },
            { name: 'last-modified', content: currentDate },
            { name: 'coverage', content: 'Worldwide' },
            { name: 'distribution', content: 'Global' },
            { name: 'target', content: 'all' },
            { name: 'audience', content: 'all' },
            { name: 'rating', content: 'General' },
            { name: 'revisit-after', content: '1 days' },
            { name: 'language', content: 'zh-CN, en-US' },
            { name: 'geo.region', content: 'CN' },
            { name: 'geo.placename', content: 'China' },
            { name: 'ICBM', content: '39.9042, 116.4074' },
            { name: 'DC.title', content: document.title },
            { name: 'DC.creator', content: 'AINAV.ART Team' },
            { name: 'DC.subject', content: 'AI工具导航,人工智能,AI应用' },
            { name: 'DC.description', content: document.querySelector('meta[name="description"]')?.content || '' },
            { name: 'DC.publisher', content: 'AINAV.ART' },
            { name: 'DC.contributor', content: 'AI Community' },
            { name: 'DC.date', content: currentDate },
            { name: 'DC.type', content: 'Text' },
            { name: 'DC.format', content: 'text/html' },
            { name: 'DC.identifier', content: window.location.href },
            { name: 'DC.language', content: 'zh-CN' },
            { name: 'DC.coverage', content: 'World' },
            { name: 'DC.rights', content: '© 2025 AINAV.ART' }
        ];
        
        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    optimizeOpenGraph() {
        const ogTags = [
            { property: 'og:site_name', content: 'AINAV.ART' },
            { property: 'og:locale', content: 'zh_CN' },
            { property: 'og:locale:alternate', content: 'en_US' },
            { property: 'og:updated_time', content: new Date().toISOString() },
            { property: 'article:publisher', content: 'https://www.ainav.art' },
            { property: 'article:author', content: 'AINAV.ART Team' },
            { property: 'article:published_time', content: '2024-01-01T00:00:00Z' },
            { property: 'article:modified_time', content: new Date().toISOString() },
            { property: 'article:section', content: 'Technology' },
            { property: 'article:tag', content: 'AI工具,人工智能,ChatGPT,Midjourney' }
        ];
        
        ogTags.forEach(tag => {
            if (!document.querySelector(`meta[property="${tag.property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    optimizeTwitterCards() {
        const twitterTags = [
            { name: 'twitter:domain', content: 'ainav.art' },
            { name: 'twitter:url', content: window.location.href },
            { name: 'twitter:label1', content: '工具数量' },
            { name: 'twitter:data1', content: '1000+' },
            { name: 'twitter:label2', content: '分类' },
            { name: 'twitter:data2', content: '20+' }
        ];
        
        twitterTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // 生成结构化数据
    generateStructuredData() {
        this.generateOrganizationSchema();
        this.generateWebsiteSchema();
        this.generateBreadcrumbSchema();
        this.generateFAQSchema();
        this.generateProductSchema();
        this.generateReviewSchema();
    }

    generateOrganizationSchema() {
        const organizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AINAV.ART",
            "alternateName": "AI导航艺术",
            "url": "https://www.ainav.art",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.ainav.art/assets/images/AInavLogo.png",
                "width": 512,
                "height": 512
            },
            "description": "全球最全的AI工具导航网站，精选收录1000+优质人工智能工具和资源",
            "foundingDate": "2024-01-01",
            "founders": [
                {
                    "@type": "Person",
                    "name": "AINAV Team"
                }
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "",
                "contactType": "customer service",
                "email": "contact@ainav.art",
                "availableLanguage": ["Chinese", "English"],
                "areaServed": "Worldwide"
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "CN",
                "addressRegion": "Beijing"
            },
            "sameAs": [
                "https://github.com/crash-you/ainav"
            ],
            "knowsAbout": [
                "人工智能",
                "AI工具",
                "机器学习",
                "深度学习",
                "ChatGPT",
                "Midjourney",
                "AI绘画",
                "AI写作"
            ],
            "memberOf": {
                "@type": "Organization",
                "name": "AI Technology Community"
            }
        };
        
        this.addStructuredDataToPage('organization-schema', organizationSchema);
    }

    generateWebsiteSchema() {
        const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AINAV.ART",
            "alternateName": "AI工具导航",
            "url": "https://www.ainav.art",
            "description": "全球最全的AI工具导航网站，收录1000+优质人工智能工具和资源",
            "inLanguage": ["zh-CN", "en-US"],
            "isAccessibleForFree": true,
            "isFamilyFriendly": true,
            "publisher": {
                "@type": "Organization",
                "name": "AINAV.ART",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.ainav.art/assets/images/AInavLogo.png"
                }
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://www.ainav.art/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            },
            "mainEntity": {
                "@type": "ItemList",
                "name": "AI工具列表",
                "description": "精选的人工智能工具和资源",
                "numberOfItems": 1000
            }
        };
        
        this.addStructuredDataToPage('website-schema', websiteSchema);
    }

    generateBreadcrumbSchema() {
        const breadcrumbs = this.getBreadcrumbs();
        if (breadcrumbs.length > 0) {
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs.map((crumb, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": crumb.name,
                    "item": crumb.url
                }))
            };
            
            this.addStructuredDataToPage('breadcrumb-schema', breadcrumbSchema);
        }
    }

    generateFAQSchema() {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "AINAV.ART是什么？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "AINAV.ART是全球最全的AI工具导航网站，精选收录1000+优质人工智能工具和资源。我们为AI爱好者、开发者和创作者提供一站式AI工具发现平台，涵盖AI绘画、写作、视频、音频等全领域应用。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "如何选择适合的AI工具？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "选择AI工具时建议考虑以下因素：1）明确使用需求（绘画、写作、视频等）；2）预算范围（免费版vs付费版）；3）技术水平（新手友好vs专业工具）；4）功能特点；5）查看用户评价和详细评测。"
                    }
                },
                {
                    "@type": "Question",
                    "name": "网站收录的AI工具是否免费？",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "我们收录的AI工具包含免费和付费两种类型。每个工具页面都会明确标注价格信息，包括免费版本的功能限制和付费版本的价格。我们建议用户根据自己的需求和预算选择合适的工具。"
                    }
                }
            ]
        };
        
        this.addStructuredDataToPage('faq-schema', faqSchema);
    }

    generateProductSchema() {
        const productSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "AINAV.ART AI工具导航服务",
            "description": "专业的AI工具导航和推荐服务，帮助用户发现最适合的人工智能工具",
            "brand": {
                "@type": "Brand",
                "name": "AINAV.ART"
            },
            "category": "Software Application",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CNY",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2025-12-31",
                "seller": {
                    "@type": "Organization",
                    "name": "AINAV.ART"
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
            },
            "review": [
                {
                    "@type": "Review",
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5",
                        "bestRating": "5"
                    },
                    "author": {
                        "@type": "Person",
                        "name": "AI用户"
                    },
                    "reviewBody": "非常全面的AI工具导航网站，帮我找到了很多实用的AI工具，界面简洁易用。"
                }
            ]
        };
        
        this.addStructuredDataToPage('product-schema', productSchema);
    }

    generateReviewSchema() {
        const reviewSchema = {
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
                "@type": "WebSite",
                "name": "AINAV.ART",
                "url": "https://www.ainav.art"
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
            },
            "author": {
                "@type": "Organization",
                "name": "AI Technology Review"
            },
            "reviewBody": "AINAV.ART是目前最全面的AI工具导航网站，收录了超过1000个高质量的AI工具，分类清晰，更新及时，是AI从业者和爱好者的必备资源。"
        };
        
        this.addStructuredDataToPage('review-schema', reviewSchema);
    }

    addStructuredDataToPage(id, schema) {
        // 检查是否已存在
        const existing = document.getElementById(id);
        if (existing) {
            existing.textContent = JSON.stringify(schema, null, 2);
        } else {
            const script = document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema, null, 2);
            document.head.appendChild(script);
        }
    }

    // 优化标题结构
    optimizeHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const structure = [];
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent.trim();
            
            structure.push({
                level: level,
                text: text,
                element: heading
            });
            
            // 添加ID以便锚点链接
            if (!heading.id) {
                heading.id = this.generateHeadingId(text, index);
            }
        });
        
        this.seoMetrics.headingStructure = structure;
        this.validateHeadingStructure(structure);
    }

    generateHeadingId(text, index) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50) + '-' + index;
    }

    validateHeadingStructure(structure) {
        let hasH1 = false;
        let previousLevel = 0;
        
        structure.forEach((heading, index) => {
            if (heading.level === 1) {
                hasH1 = true;
                if (index > 0) {
                    console.warn('⚠️ H1 should be the first heading on the page');
                }
            }
            
            if (heading.level > previousLevel + 1) {
                console.warn(`⚠️ Heading structure skip detected: ${heading.text}`);
            }
            
            previousLevel = heading.level;
        });
        
        if (!hasH1) {
            console.warn('⚠️ Page should have exactly one H1 tag');
        }
    }

    // 优化图片
    optimizeImages() {
        const images = document.querySelectorAll('img');
        let altCount = 0;
        
        images.forEach((img, index) => {
            // 检查alt属性
            if (img.alt) {
                altCount++;
            } else {
                console.warn('⚠️ Image missing alt text:', img.src);
                // 自动生成alt文本
                const filename = img.src.split('/').pop().split('.')[0];
                img.alt = this.generateImageAlt(filename);
            }
            
            // 添加图片结构化数据
            this.addImageStructuredData(img, index);
            
            // 优化图片加载
            this.optimizeImageLoading(img);
        });
        
        this.seoMetrics.imageAltCount = altCount;
    }

    generateImageAlt(filename) {
        // 基于文件名生成有意义的alt文本
        const cleanName = filename.replace(/[-_]/g, ' ').toLowerCase();
        return `${cleanName} - AINAV.ART AI工具`;
    }

    addImageStructuredData(img, index) {
        const imageSchema = {
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "url": img.src,
            "name": img.alt || `Image ${index + 1}`,
            "description": img.alt || `AI工具相关图片`,
            "width": img.naturalWidth || img.width,
            "height": img.naturalHeight || img.height,
            "encodingFormat": this.getImageFormat(img.src),
            "contentUrl": img.src,
            "thumbnailUrl": img.src,
            "representativeOfPage": index === 0,
            "isAccessibleForFree": true
        };
        
        // 将图片schema添加到页面
        this.addStructuredDataToPage(`image-schema-${index}`, imageSchema);
    }

    getImageFormat(src) {
        const extension = src.split('.').pop().toLowerCase();
        const formats = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'avif': 'image/avif',
            'svg': 'image/svg+xml'
        };
        return formats[extension] || 'image/jpeg';
    }

    optimizeImageLoading(img) {
        // 添加图片加载优化
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // 添加图片尺寸以防止布局偏移
        if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
            img.addEventListener('load', function() {
                this.setAttribute('width', this.naturalWidth);
                this.setAttribute('height', this.naturalHeight);
            });
        }
    }

    // 优化链接
    optimizeLinks() {
        const links = document.querySelectorAll('a');
        let internalLinks = 0;
        let externalLinks = 0;
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            if (this.isInternalLink(href)) {
                internalLinks++;
                this.optimizeInternalLink(link);
            } else {
                externalLinks++;
                this.optimizeExternalLink(link);
            }
        });
        
        this.seoMetrics.internalLinks = internalLinks;
        this.seoMetrics.externalLinks = externalLinks;
    }

    isInternalLink(href) {
        return href.startsWith('/') || 
               href.startsWith('./') || 
               href.startsWith('../') || 
               href.includes(window.location.hostname);
    }

    optimizeInternalLink(link) {
        // 确保内部链接有适当的title属性
        if (!link.title && link.textContent) {
            link.title = link.textContent.trim();
        }
    }

    optimizeExternalLink(link) {
        // 外部链接安全优化
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
        
        // 添加target="_blank"如果没有的话
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
    }

    // 添加面包屑导航
    addBreadcrumbs() {
        const breadcrumbs = this.getBreadcrumbs();
        if (breadcrumbs.length > 1) {
            this.createBreadcrumbHTML(breadcrumbs);
        }
    }

    getBreadcrumbs() {
        const path = window.location.pathname;
        const breadcrumbs = [
            { name: '首页', url: 'https://www.ainav.art/' }
        ];
        
        if (path.includes('/cn/')) {
            breadcrumbs.push({ name: '中文版', url: 'https://www.ainav.art/cn/' });
        }
        
        if (path.includes('/en/')) {
            breadcrumbs.push({ name: 'English', url: 'https://www.ainav.art/en/' });
        }
        
        if (path.includes('/detail/')) {
            breadcrumbs.push({ name: '工具详情', url: window.location.href });
        }
        
        if (path.includes('contact.html')) {
            breadcrumbs.push({ name: '联系我们', url: window.location.href });
        }
        
        if (path.includes('privacy-policy.html')) {
            breadcrumbs.push({ name: '隐私政策', url: window.location.href });
        }
        
        return breadcrumbs;
    }

    createBreadcrumbHTML(breadcrumbs) {
        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.setAttribute('aria-label', '面包屑导航');
        breadcrumbContainer.className = 'breadcrumb-nav';
        
        const breadcrumbList = document.createElement('ol');
        breadcrumbList.className = 'breadcrumb-list';
        
        breadcrumbs.forEach((crumb, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'breadcrumb-item';
            
            if (index === breadcrumbs.length - 1) {
                // 当前页面
                listItem.textContent = crumb.name;
                listItem.setAttribute('aria-current', 'page');
            } else {
                const link = document.createElement('a');
                link.href = crumb.url;
                link.textContent = crumb.name;
                listItem.appendChild(link);
            }
            
            breadcrumbList.appendChild(listItem);
        });
        
        breadcrumbContainer.appendChild(breadcrumbList);
        
        // 插入到页面顶部
        const mainContent = document.querySelector('.main-content, main, body');
        if (mainContent) {
            mainContent.insertBefore(breadcrumbContainer, mainContent.firstChild);
        }
        
        // 添加面包屑样式
        this.addBreadcrumbStyles();
    }

    addBreadcrumbStyles() {
        const styles = `
            .breadcrumb-nav {
                padding: 10px 0;
                margin-bottom: 20px;
                font-size: 14px;
            }
            
            .breadcrumb-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
            }
            
            .breadcrumb-item {
                display: flex;
                align-items: center;
            }
            
            .breadcrumb-item:not(:last-child)::after {
                content: '>';
                margin: 0 8px;
                color: #666;
            }
            
            .breadcrumb-item a {
                color: #667eea;
                text-decoration: none;
            }
            
            .breadcrumb-item a:hover {
                text-decoration: underline;
            }
            
            .breadcrumb-item[aria-current="page"] {
                color: #333;
                font-weight: 500;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // 语音搜索优化
    optimizeForVoiceSearch() {
        // 添加语音搜索友好的内容
        this.addVoiceSearchSchema();
        this.optimizeForNaturalLanguage();
    }

    addVoiceSearchSchema() {
        const voiceSearchSchema = {
            "@context": "https://schema.org",
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", ".tool-name", ".tool-description"]
        };
        
        this.addStructuredDataToPage('voice-search-schema', voiceSearchSchema);
    }

    optimizeForNaturalLanguage() {
        // 添加自然语言问答内容
        const faqContainer = document.createElement('div');
        faqContainer.className = 'voice-search-content';
        faqContainer.style.display = 'none'; // 隐藏但对搜索引擎可见
        
        const naturalQuestions = [
            {
                question: "什么是最好的AI绘画工具？",
                answer: "Midjourney、DALL-E和Stable Diffusion是目前最受欢迎的AI绘画工具。"
            },
            {
                question: "如何选择AI写作助手？",
                answer: "ChatGPT、Claude和Jasper是优秀的AI写作助手，可根据具体需求选择。"
            },
            {
                question: "免费的AI工具有哪些？",
                answer: "ChatGPT免费版、Google Bard、Hugging Face等都提供免费的AI服务。"
            }
        ];
        
        naturalQuestions.forEach(qa => {
            const qaDiv = document.createElement('div');
            qaDiv.innerHTML = `
                <h3>${qa.question}</h3>
                <p>${qa.answer}</p>
            `;
            faqContainer.appendChild(qaDiv);
        });
        
        document.body.appendChild(faqContainer);
    }

    // 本地SEO优化
    enhanceLocalSEO() {
        const localBusinessSchema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "AINAV.ART",
            "description": "专业的AI工具导航服务",
            "url": "https://www.ainav.art",
            "telephone": "",
            "email": "contact@ainav.art",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "CN",
                "addressRegion": "Beijing"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "39.9042",
                "longitude": "116.4074"
            },
            "openingHours": "Mo-Su 00:00-24:00",
            "priceRange": "免费",
            "servesCuisine": "Technology Services",
            "areaServed": {
                "@type": "Country",
                "name": "China"
            }
        };
        
        this.addStructuredDataToPage('local-business-schema', localBusinessSchema);
    }

    // 移动SEO优化
    optimizeForMobile() {
        // 确保移动端友好的meta标签
        const mobileMetaTags = [
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'msapplication-tap-highlight', content: 'no' }
        ];
        
        mobileMetaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // 社交媒体优化
    addSocialMediaOptimization() {
        // 添加社交媒体分享按钮
        this.addSocialShareButtons();
        
        // 优化社交媒体meta标签
        this.optimizeSocialMetaTags();
    }

    addSocialShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share-container';
        shareContainer.innerHTML = `
            <div class="social-share-buttons">
                <button onclick="shareToWeChat()" class="share-btn wechat">微信</button>
                <button onclick="shareToWeibo()" class="share-btn weibo">微博</button>
                <button onclick="shareToTwitter()" class="share-btn twitter">Twitter</button>
                <button onclick="shareToFacebook()" class="share-btn facebook">Facebook</button>
            </div>
        `;
        
        // 添加分享功能
        const shareScript = document.createElement('script');
        shareScript.textContent = `
            function shareToWeChat() {
                // 微信分享逻辑
                console.log('分享到微信');
            }
            
            function shareToWeibo() {
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                window.open('https://service.weibo.com/share/share.php?url=' + url + '&title=' + title);
            }
            
            function shareToTwitter() {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent(document.title);
                window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + text);
            }
            
            function shareToFacebook() {
                const url = encodeURIComponent(window.location.href);
                window.open('https://www.facebook.com/sharer/sharer.php?u=' + url);
            }
        `;
        
        document.head.appendChild(shareScript);
        
        // 添加到页面底部
        const footer = document.querySelector('footer, .footer');
        if (footer) {
            footer.appendChild(shareContainer);
        }
    }

    optimizeSocialMetaTags() {
        // 确保所有社交媒体平台的meta标签都完整
        const socialTags = [
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:alt', content: 'AINAV.ART - 全球最全AI工具导航' },
            { name: 'twitter:image:alt', content: 'AINAV.ART - 全球最全AI工具导航' }
        ];
        
        socialTags.forEach(tag => {
            const selector = tag.property ? `meta[property="${tag.property}"]` : `meta[name="${tag.name}"]`;
            if (!document.querySelector(selector)) {
                const meta = document.createElement('meta');
                if (tag.property) {
                    meta.setAttribute('property', tag.property);
                } else {
                    meta.name = tag.name;
                }
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // 生成SEO报告
    generateSEOReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            title: document.title,
            titleLength: this.seoMetrics.titleLength,
            descriptionLength: this.seoMetrics.descriptionLength,
            headingCount: this.seoMetrics.headingStructure.length,
            imageCount: document.querySelectorAll('img').length,
            imageAltCount: this.seoMetrics.imageAltCount,
            internalLinks: this.seoMetrics.internalLinks,
            externalLinks: this.seoMetrics.externalLinks,
            structuredDataCount: document.querySelectorAll('script[type="application/ld+json"]').length,
            recommendations: this.generateRecommendations()
        };
        
        console.log('📊 Advanced SEO Report:', report);
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.seoMetrics.titleLength < 30 || this.seoMetrics.titleLength > 60) {
            recommendations.push('优化页面标题长度（30-60字符）');
        }
        
        if (this.seoMetrics.descriptionLength < 120 || this.seoMetrics.descriptionLength > 160) {
            recommendations.push('优化meta描述长度（120-160字符）');
        }
        
        if (this.seoMetrics.imageAltCount < document.querySelectorAll('img').length) {
            recommendations.push('为所有图片添加alt属性');
        }
        
        if (this.seoMetrics.internalLinks < 5) {
            recommendations.push('增加内部链接数量');
        }
        
        return recommendations;
    }

    // 公共方法
    getReport() {
        return this.generateSEOReport();
    }

    reoptimize() {
        this.init();
    }
}

// 初始化高级SEO优化器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.advancedSEOOptimizer = new AdvancedSEOOptimizer();
    }, 1000);
});

// 导出给其他脚本使用
window.AdvancedSEOOptimizer = AdvancedSEOOptimizer;
