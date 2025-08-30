/**
 * AINAV.ART AI工具数据库管理系统
 * 高级数据管理、搜索、过滤、推荐算法
 */

class AIToolsDatabase {
    constructor() {
        this.tools = new Map();
        this.categories = new Map();
        this.tags = new Set();
        this.searchIndex = new Map();
        this.userPreferences = this.loadUserPreferences();
        this.analytics = {
            views: new Map(),
            clicks: new Map(),
            ratings: new Map(),
            searches: []
        };
        
        this.config = {
            enableFuzzySearch: true,
            enableRecommendations: true,
            enableAnalytics: true,
            cacheTimeout: 3600000, // 1小时
            maxSearchResults: 50,
            recommendationCount: 6
        };
        
        this.init();
    }

    // 初始化数据库
    async init() {
        await this.loadToolsData();
        this.buildSearchIndex();
        this.setupEventListeners();
        console.log('🗄️ AI Tools Database Initialized');
        console.log(`📊 Loaded ${this.tools.size} tools in ${this.categories.size} categories`);
    }

    // 加载工具数据
    async loadToolsData() {
        try {
            // 尝试从缓存加载
            const cached = this.loadFromCache();
            if (cached && this.isCacheValid(cached.timestamp)) {
                this.tools = new Map(cached.tools);
                this.categories = new Map(cached.categories);
                console.log('📦 Loaded tools from cache');
                return;
            }

            // 从JSON文件加载
            const response = await fetch('./tools_data.json');
            if (response.ok) {
                const data = await response.json();
                this.processToolsData(data);
                this.saveToCache();
            } else {
                // 如果JSON文件不存在，使用内置数据
                this.loadBuiltinData();
            }
        } catch (error) {
            console.warn('Failed to load tools data:', error);
            this.loadBuiltinData();
        }
    }

    // 处理工具数据
    processToolsData(data) {
        // 处理工具数据
        if (data.tools) {
            data.tools.forEach(tool => {
                this.addTool(tool);
            });
        }

        // 处理分类数据
        if (data.categories) {
            data.categories.forEach(category => {
                this.categories.set(category.id, {
                    ...category,
                    tools: new Set(category.tools || [])
                });
            });
        }
    }

    // 加载内置数据
    loadBuiltinData() {
        const builtinTools = [
            {
                id: 'chatgpt',
                name: 'ChatGPT',
                description: 'OpenAI开发的AI对话助手，支持自然语言对话、代码编写、文章创作等多种任务',
                category: 'ai-chat',
                tags: ['对话', '写作', '编程', '翻译', 'OpenAI'],
                url: 'https://chat.openai.com',
                logo: './assets/images/logos/chatgpt.png',
                pricing: {
                    free: true,
                    paid: { price: 20, currency: 'USD', period: 'month' }
                },
                features: ['自然语言对话', '代码生成', '文章写作', '语言翻译', '数据分析'],
                rating: 4.8,
                popularity: 95,
                lastUpdated: '2025-01-27',
                status: 'active',
                metadata: {
                    founded: '2022-11-30',
                    company: 'OpenAI',
                    users: '100M+',
                    languages: ['中文', '英文', '多语言']
                }
            },
            {
                id: 'midjourney',
                name: 'Midjourney',
                description: '全球最受欢迎的AI绘画工具，通过Discord使用，能够生成高质量的艺术图像',
                category: 'ai-art',
                tags: ['绘画', '艺术', '创意', 'Discord', '图像生成'],
                url: 'https://www.midjourney.com',
                logo: './assets/images/logos/midjourney.png',
                pricing: {
                    free: false,
                    paid: { price: 10, currency: 'USD', period: 'month' }
                },
                features: ['高质量图像生成', '艺术风格多样', 'Discord集成', '提示词优化'],
                rating: 4.7,
                popularity: 88,
                lastUpdated: '2025-01-26',
                status: 'active',
                metadata: {
                    founded: '2022-07-12',
                    company: 'Midjourney Inc.',
                    users: '15M+',
                    languages: ['英文']
                }
            },
            {
                id: 'claude',
                name: 'Claude',
                description: 'Anthropic开发的AI助手，在长文理解和安全性方面表现突出',
                category: 'ai-chat',
                tags: ['对话', '长文理解', '安全', 'Anthropic'],
                url: 'https://claude.ai',
                logo: './assets/images/logos/claude.png',
                pricing: {
                    free: true,
                    paid: { price: 20, currency: 'USD', period: 'month' }
                },
                features: ['长文档处理', '安全对话', '代码分析', '文档总结'],
                rating: 4.6,
                popularity: 75,
                lastUpdated: '2025-01-25',
                status: 'active',
                metadata: {
                    founded: '2023-03-14',
                    company: 'Anthropic',
                    users: '10M+',
                    languages: ['中文', '英文']
                }
            }
        ];

        const builtinCategories = [
            {
                id: 'ai-chat',
                name: 'AI对话工具',
                description: '智能对话助手和聊天机器人',
                icon: '🤖',
                color: '#667eea',
                tools: ['chatgpt', 'claude']
            },
            {
                id: 'ai-art',
                name: 'AI绘画工具',
                description: 'AI图像生成和艺术创作工具',
                icon: '🎨',
                color: '#ff6b6b',
                tools: ['midjourney']
            }
        ];

        builtinTools.forEach(tool => this.addTool(tool));
        builtinCategories.forEach(category => {
            this.categories.set(category.id, {
                ...category,
                tools: new Set(category.tools)
            });
        });
    }

    // 添加工具
    addTool(toolData) {
        const tool = {
            ...toolData,
            id: toolData.id || this.generateId(toolData.name),
            addedAt: Date.now(),
            views: 0,
            clicks: 0,
            searchScore: 0
        };

        this.tools.set(tool.id, tool);
        
        // 添加标签到全局标签集合
        if (tool.tags) {
            tool.tags.forEach(tag => this.tags.add(tag));
        }

        // 更新搜索索引
        this.updateSearchIndex(tool);
        
        return tool.id;
    }

    // 构建搜索索引
    buildSearchIndex() {
        this.searchIndex.clear();
        
        this.tools.forEach(tool => {
            this.updateSearchIndex(tool);
        });
        
        console.log(`🔍 Search index built with ${this.searchIndex.size} entries`);
    }

    // 更新搜索索引
    updateSearchIndex(tool) {
        const searchableText = [
            tool.name,
            tool.description,
            ...(tool.tags || []),
            ...(tool.features || []),
            tool.metadata?.company || ''
        ].join(' ').toLowerCase();

        // 分词并建立索引
        const words = searchableText.split(/\s+/).filter(word => word.length > 1);
        
        words.forEach(word => {
            if (!this.searchIndex.has(word)) {
                this.searchIndex.set(word, new Set());
            }
            this.searchIndex.get(word).add(tool.id);
        });

        // 添加拼音索引（简化版）
        this.addPinyinIndex(tool);
    }

    // 添加拼音索引（简化版）
    addPinyinIndex(tool) {
        const pinyinMap = {
            '聊天': 'liaotian',
            '绘画': 'huihua',
            '写作': 'xiezuo',
            '翻译': 'fanyi',
            '编程': 'biancheng',
            '音乐': 'yinyue',
            '视频': 'shipin'
        };

        const text = tool.name + ' ' + tool.description + ' ' + (tool.tags || []).join(' ');
        
        Object.entries(pinyinMap).forEach(([chinese, pinyin]) => {
            if (text.includes(chinese)) {
                if (!this.searchIndex.has(pinyin)) {
                    this.searchIndex.set(pinyin, new Set());
                }
                this.searchIndex.get(pinyin).add(tool.id);
            }
        });
    }

    // 搜索工具
    search(query, options = {}) {
        const {
            category = null,
            tags = [],
            pricing = null, // 'free', 'paid', 'all'
            sortBy = 'relevance', // 'relevance', 'popularity', 'rating', 'updated'
            limit = this.config.maxSearchResults
        } = options;

        if (!query || query.trim().length === 0) {
            return this.getAllTools(options);
        }

        const startTime = performance.now();
        const normalizedQuery = query.toLowerCase().trim();
        
        // 记录搜索
        this.recordSearch(query, options);

        // 获取匹配的工具ID
        const matchedIds = this.findMatchingTools(normalizedQuery);
        
        // 获取工具对象并计算相关性分数
        let results = Array.from(matchedIds)
            .map(id => this.tools.get(id))
            .filter(tool => tool && this.matchesFilters(tool, { category, tags, pricing }))
            .map(tool => ({
                ...tool,
                relevanceScore: this.calculateRelevanceScore(tool, normalizedQuery)
            }));

        // 排序
        results = this.sortResults(results, sortBy);

        // 限制结果数量
        results = results.slice(0, limit);

        const searchTime = performance.now() - startTime;
        
        console.log(`🔍 Search "${query}" found ${results.length} results in ${searchTime.toFixed(2)}ms`);
        
        return {
            query,
            results,
            total: results.length,
            searchTime,
            suggestions: this.generateSearchSuggestions(query, results)
        };
    }

    // 查找匹配的工具
    findMatchingTools(query) {
        const matchedIds = new Set();
        const queryWords = query.split(/\s+/).filter(word => word.length > 1);

        // 精确匹配
        queryWords.forEach(word => {
            if (this.searchIndex.has(word)) {
                this.searchIndex.get(word).forEach(id => matchedIds.add(id));
            }
        });

        // 模糊匹配
        if (this.config.enableFuzzySearch && matchedIds.size < 10) {
            this.searchIndex.forEach((toolIds, indexWord) => {
                queryWords.forEach(queryWord => {
                    if (this.calculateLevenshteinDistance(queryWord, indexWord) <= 2) {
                        toolIds.forEach(id => matchedIds.add(id));
                    }
                });
            });
        }

        // 部分匹配
        if (matchedIds.size < 5) {
            this.searchIndex.forEach((toolIds, indexWord) => {
                queryWords.forEach(queryWord => {
                    if (indexWord.includes(queryWord) || queryWord.includes(indexWord)) {
                        toolIds.forEach(id => matchedIds.add(id));
                    }
                });
            });
        }

        return matchedIds;
    }

    // 计算相关性分数
    calculateRelevanceScore(tool, query) {
        let score = 0;
        const queryWords = query.split(/\s+/).filter(word => word.length > 1);
        
        // 名称匹配权重最高
        const nameMatch = tool.name.toLowerCase();
        queryWords.forEach(word => {
            if (nameMatch === word) score += 100;
            else if (nameMatch.includes(word)) score += 50;
        });

        // 描述匹配
        const descMatch = tool.description.toLowerCase();
        queryWords.forEach(word => {
            if (descMatch.includes(word)) score += 20;
        });

        // 标签匹配
        if (tool.tags) {
            tool.tags.forEach(tag => {
                queryWords.forEach(word => {
                    if (tag.toLowerCase().includes(word)) score += 30;
                });
            });
        }

        // 流行度加成
        score += (tool.popularity || 0) * 0.5;
        
        // 评分加成
        score += (tool.rating || 0) * 10;

        // 最近更新加成
        const daysSinceUpdate = (Date.now() - new Date(tool.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 30) score += 10;

        return score;
    }

    // 过滤器匹配
    matchesFilters(tool, filters) {
        const { category, tags, pricing } = filters;

        // 分类过滤
        if (category && tool.category !== category) {
            return false;
        }

        // 标签过滤
        if (tags && tags.length > 0) {
            const toolTags = tool.tags || [];
            if (!tags.some(tag => toolTags.includes(tag))) {
                return false;
            }
        }

        // 价格过滤
        if (pricing) {
            if (pricing === 'free' && !tool.pricing?.free) {
                return false;
            }
            if (pricing === 'paid' && !tool.pricing?.paid) {
                return false;
            }
        }

        return true;
    }

    // 排序结果
    sortResults(results, sortBy) {
        switch (sortBy) {
            case 'popularity':
                return results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            case 'rating':
                return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'updated':
                return results.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            case 'name':
                return results.sort((a, b) => a.name.localeCompare(b.name));
            case 'relevance':
            default:
                return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        }
    }

    // 获取所有工具
    getAllTools(options = {}) {
        const { category, tags, pricing, sortBy = 'popularity', limit = 100 } = options;
        
        let results = Array.from(this.tools.values())
            .filter(tool => this.matchesFilters(tool, { category, tags, pricing }));

        results = this.sortResults(results, sortBy);
        results = results.slice(0, limit);

        return {
            query: '',
            results,
            total: results.length,
            searchTime: 0
        };
    }

    // 获取推荐工具
    getRecommendations(toolId, count = this.config.recommendationCount) {
        if (!this.config.enableRecommendations) {
            return [];
        }

        const baseTool = this.tools.get(toolId);
        if (!baseTool) return [];

        const recommendations = Array.from(this.tools.values())
            .filter(tool => tool.id !== toolId)
            .map(tool => ({
                ...tool,
                similarity: this.calculateSimilarity(baseTool, tool)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, count);

        return recommendations;
    }

    // 计算工具相似度
    calculateSimilarity(tool1, tool2) {
        let similarity = 0;

        // 分类相似度
        if (tool1.category === tool2.category) {
            similarity += 40;
        }

        // 标签相似度
        if (tool1.tags && tool2.tags) {
            const commonTags = tool1.tags.filter(tag => tool2.tags.includes(tag));
            similarity += commonTags.length * 10;
        }

        // 价格模式相似度
        if (tool1.pricing?.free === tool2.pricing?.free) {
            similarity += 10;
        }

        // 评分相似度
        const ratingDiff = Math.abs((tool1.rating || 0) - (tool2.rating || 0));
        similarity += Math.max(0, 10 - ratingDiff * 2);

        return similarity;
    }

    // 生成搜索建议
    generateSearchSuggestions(query, results) {
        const suggestions = [];
        
        // 基于结果生成建议
        if (results.length > 0) {
            const categories = [...new Set(results.map(r => r.category))];
            const tags = [...new Set(results.flatMap(r => r.tags || []))];
            
            suggestions.push(...categories.slice(0, 3));
            suggestions.push(...tags.slice(0, 5));
        }

        // 基于热门搜索生成建议
        const popularSearches = this.getPopularSearches();
        suggestions.push(...popularSearches.slice(0, 3));

        return [...new Set(suggestions)].slice(0, 8);
    }

    // 获取热门搜索
    getPopularSearches() {
        const searchCounts = {};
        this.analytics.searches.forEach(search => {
            searchCounts[search.query] = (searchCounts[search.query] || 0) + 1;
        });

        return Object.entries(searchCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([query]) => query);
    }

    // 记录搜索
    recordSearch(query, options) {
        if (!this.config.enableAnalytics) return;

        this.analytics.searches.push({
            query,
            options,
            timestamp: Date.now(),
            userId: this.getCurrentUserId()
        });

        // 只保留最近1000次搜索
        if (this.analytics.searches.length > 1000) {
            this.analytics.searches = this.analytics.searches.slice(-1000);
        }
    }

    // 记录工具查看
    recordView(toolId) {
        if (!this.config.enableAnalytics) return;

        const current = this.analytics.views.get(toolId) || 0;
        this.analytics.views.set(toolId, current + 1);

        // 更新工具的查看次数
        const tool = this.tools.get(toolId);
        if (tool) {
            tool.views = (tool.views || 0) + 1;
        }
    }

    // 记录工具点击
    recordClick(toolId) {
        if (!this.config.enableAnalytics) return;

        const current = this.analytics.clicks.get(toolId) || 0;
        this.analytics.clicks.set(toolId, current + 1);

        // 更新工具的点击次数
        const tool = this.tools.get(toolId);
        if (tool) {
            tool.clicks = (tool.clicks || 0) + 1;
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听工具详情页访问
        if (window.location.pathname.includes('/detail/')) {
            const toolId = this.extractToolIdFromURL();
            if (toolId) {
                this.recordView(toolId);
            }
        }

        // 监听外部链接点击
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link && this.isExternalToolLink(link.href)) {
                const toolId = this.extractToolIdFromLink(link);
                if (toolId) {
                    this.recordClick(toolId);
                }
            }
        });
    }

    // 辅助方法
    generateId(name) {
        return name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    calculateLevenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
        
        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + cost
                );
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    getCurrentUserId() {
        return localStorage.getItem('ainav_user_id') || 'anonymous';
    }

    extractToolIdFromURL() {
        const path = window.location.pathname;
        const match = path.match(/\/detail\/([^\/]+)\.html/);
        return match ? match[1] : null;
    }

    extractToolIdFromLink(href) {
        // 从链接中提取工具ID的逻辑
        if (href.includes('/detail/')) {
            const match = href.match(/\/detail\/([^\/]+)\.html/);
            return match ? match[1] : null;
        }
        return null;
    }

    isExternalToolLink(href) {
        return href && href.startsWith('http') && !href.includes('ainav.art');
    }

    // 缓存管理
    saveToCache() {
        const cacheData = {
            tools: Array.from(this.tools.entries()),
            categories: Array.from(this.categories.entries()),
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('ainav_tools_cache', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to save to cache:', error);
        }
    }

    loadFromCache() {
        try {
            const cached = localStorage.getItem('ainav_tools_cache');
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.warn('Failed to load from cache:', error);
            return null;
        }
    }

    isCacheValid(timestamp) {
        return Date.now() - timestamp < this.config.cacheTimeout;
    }

    loadUserPreferences() {
        try {
            const prefs = localStorage.getItem('ainav_user_preferences');
            return prefs ? JSON.parse(prefs) : {
                favoriteCategories: [],
                favoriteTools: [],
                searchHistory: [],
                preferredLanguage: 'zh'
            };
        } catch (error) {
            return {
                favoriteCategories: [],
                favoriteTools: [],
                searchHistory: [],
                preferredLanguage: 'zh'
            };
        }
    }

    // 公共API
    getToolById(id) {
        return this.tools.get(id);
    }

    getToolsByCategory(categoryId) {
        return Array.from(this.tools.values()).filter(tool => tool.category === categoryId);
    }

    getCategories() {
        return Array.from(this.categories.values());
    }

    getTags() {
        return Array.from(this.tags);
    }

    getAnalytics() {
        return {
            totalTools: this.tools.size,
            totalCategories: this.categories.size,
            totalTags: this.tags.size,
            totalSearches: this.analytics.searches.length,
            topViewed: this.getTopTools('views'),
            topClicked: this.getTopTools('clicks'),
            popularSearches: this.getPopularSearches()
        };
    }

    getTopTools(metric, limit = 10) {
        return Array.from(this.tools.values())
            .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
            .slice(0, limit);
    }

    exportData() {
        const data = {
            tools: Array.from(this.tools.entries()),
            categories: Array.from(this.categories.entries()),
            analytics: this.analytics,
            timestamp: Date.now()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ainav-tools-database-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    window.AIToolsDatabase = AIToolsDatabase;
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            window.aiToolsDB = new AIToolsDatabase();
        });
    } else {
        window.aiToolsDB = new AIToolsDatabase();
    }
    
    console.log('🗄️ AINAV.ART AI Tools Database System Loaded');
}

// 导出（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIToolsDatabase;
}
