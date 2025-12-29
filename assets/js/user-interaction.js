/**
 * 用户互动功能模块
 * 增强网站互动性和用户价值
 */

(function() {
    'use strict';

    // 用户评分系统
    const RatingSystem = {
        // 初始化评分系统
        init: function() {
            this.loadRatings();
            this.bindEvents();
            this.displayRatings();
        },

        // 加载已有评分数据
        loadRatings: function() {
            const savedRatings = localStorage.getItem('toolRatings');
            this.ratings = savedRatings ? JSON.parse(savedRatings) : {};
        },

        // 保存评分数据
        saveRatings: function() {
            localStorage.setItem('toolRatings', JSON.stringify(this.ratings));
        },

        // 绑定评分事件
        bindEvents: function() {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('rating-star')) {
                    const toolId = e.target.dataset.tool;
                    const rating = parseInt(e.target.dataset.rating);
                    this.submitRating(toolId, rating);
                }
            });
        },

        // 提交评分
        submitRating: function(toolId, rating) {
            if (!this.ratings[toolId]) {
                this.ratings[toolId] = {
                    total: 0,
                    count: 0,
                    userRated: false
                };
            }

            if (!this.ratings[toolId].userRated) {
                this.ratings[toolId].total += rating;
                this.ratings[toolId].count += 1;
                this.ratings[toolId].userRated = true;
                this.ratings[toolId].userRating = rating;
                this.saveRatings();
                this.updateRatingDisplay(toolId);
                this.showThankYouMessage(toolId);
            } else {
                this.showAlreadyRatedMessage(toolId);
            }
        },

        // 更新评分显示
        updateRatingDisplay: function(toolId) {
            const ratingElement = document.querySelector(`#rating-${toolId}`);
            if (ratingElement && this.ratings[toolId]) {
                const average = (this.ratings[toolId].total / this.ratings[toolId].count).toFixed(1);
                const count = this.ratings[toolId].count;
                ratingElement.innerHTML = `
                    <span class="average-rating">${average}</span>
                    <span class="rating-stars">${this.getStars(average)}</span>
                    <span class="rating-count">(${count} 评分)</span>
                `;
            }
        },

        // 获取星星显示
        getStars: function(rating) {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5 ? 1 : 0;
            const emptyStars = 5 - fullStars - halfStar;
            
            return '★'.repeat(fullStars) + 
                   (halfStar ? '☆' : '') + 
                   '☆'.repeat(emptyStars);
        },

        // 显示感谢消息
        showThankYouMessage: function(toolId) {
            this.showMessage(`感谢您的评分！您的反馈对我们很重要。`, 'success');
        },

        // 显示已评分消息
        showAlreadyRatedMessage: function(toolId) {
            this.showMessage(`您已经为此工具评分了。`, 'info');
        },

        // 显示所有评分
        displayRatings: function() {
            Object.keys(this.ratings).forEach(toolId => {
                this.updateRatingDisplay(toolId);
            });
        },

        // 显示消息
        showMessage: function(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `user-message ${type}`;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                messageDiv.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(messageDiv);
                }, 300);
            }, 3000);
        }
    };

    // 工具收藏系统
    const FavoriteSystem = {
        init: function() {
            this.loadFavorites();
            this.bindEvents();
            this.updateFavoriteButtons();
        },

        loadFavorites: function() {
            const saved = localStorage.getItem('favoriteTools');
            this.favorites = saved ? JSON.parse(saved) : [];
        },

        saveFavorites: function() {
            localStorage.setItem('favoriteTools', JSON.stringify(this.favorites));
        },

        bindEvents: function() {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('favorite-btn')) {
                    const toolId = e.target.dataset.tool;
                    this.toggleFavorite(toolId);
                }
            });
        },

        toggleFavorite: function(toolId) {
            const index = this.favorites.indexOf(toolId);
            if (index > -1) {
                this.favorites.splice(index, 1);
                this.updateFavoriteButton(toolId, false);
                RatingSystem.showMessage('已从收藏中移除', 'info');
            } else {
                this.favorites.push(toolId);
                this.updateFavoriteButton(toolId, true);
                RatingSystem.showMessage('已添加到收藏', 'success');
            }
            this.saveFavorites();
            this.updateFavoriteCount();
        },

        updateFavoriteButton: function(toolId, isFavorite) {
            const btn = document.querySelector(`.favorite-btn[data-tool="${toolId}"]`);
            if (btn) {
                btn.classList.toggle('active', isFavorite);
                btn.innerHTML = isFavorite ? '❤️ 已收藏' : '🤍 收藏';
            }
        },

        updateFavoriteButtons: function() {
            this.favorites.forEach(toolId => {
                this.updateFavoriteButton(toolId, true);
            });
        },

        updateFavoriteCount: function() {
            const countElement = document.querySelector('#favorite-count');
            if (countElement) {
                countElement.textContent = this.favorites.length;
            }
        }
    };

    // 工具比较系统
    const CompareSystem = {
        init: function() {
            this.compareList = [];
            this.maxCompare = 3;
            this.bindEvents();
        },

        bindEvents: function() {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('compare-btn')) {
                    const toolId = e.target.dataset.tool;
                    this.toggleCompare(toolId);
                } else if (e.target.classList.contains('compare-now-btn')) {
                    this.showComparison();
                }
            });
        },

        toggleCompare: function(toolId) {
            const index = this.compareList.indexOf(toolId);
            if (index > -1) {
                this.compareList.splice(index, 1);
                this.updateCompareButton(toolId, false);
            } else if (this.compareList.length < this.maxCompare) {
                this.compareList.push(toolId);
                this.updateCompareButton(toolId, true);
            } else {
                RatingSystem.showMessage(`最多可以比较${this.maxCompare}个工具`, 'warning');
                return;
            }
            this.updateCompareBar();
        },

        updateCompareButton: function(toolId, inCompare) {
            const btn = document.querySelector(`.compare-btn[data-tool="${toolId}"]`);
            if (btn) {
                btn.classList.toggle('active', inCompare);
                btn.textContent = inCompare ? '✓ 已选择' : '+ 对比';
            }
        },

        updateCompareBar: function() {
            let compareBar = document.querySelector('#compare-bar');
            if (!compareBar && this.compareList.length > 0) {
                compareBar = this.createCompareBar();
            }
            
            if (compareBar) {
                if (this.compareList.length === 0) {
                    compareBar.remove();
                } else {
                    const content = compareBar.querySelector('.compare-content');
                    content.innerHTML = `
                        <span>已选择 ${this.compareList.length} 个工具进行对比</span>
                        <button class="compare-now-btn">立即对比</button>
                        <button class="clear-compare-btn" onclick="CompareSystem.clearCompare()">清空</button>
                    `;
                }
            }
        },

        createCompareBar: function() {
            const bar = document.createElement('div');
            bar.id = 'compare-bar';
            bar.className = 'compare-bar';
            bar.innerHTML = '<div class="compare-content"></div>';
            document.body.appendChild(bar);
            return bar;
        },

        clearCompare: function() {
            this.compareList.forEach(toolId => {
                this.updateCompareButton(toolId, false);
            });
            this.compareList = [];
            this.updateCompareBar();
        },

        showComparison: function() {
            if (this.compareList.length < 2) {
                RatingSystem.showMessage('请至少选择2个工具进行对比', 'warning');
                return;
            }
            // 跳转到对比页面
            window.location.href = `/compare.html?tools=${this.compareList.join(',')}`;
        }
    };

    // 搜索建议系统
    const SearchSuggest = {
        init: function() {
            this.searchInput = document.querySelector('#search-input');
            if (!this.searchInput) return;
            
            this.suggestBox = this.createSuggestBox();
            this.bindEvents();
        },

        createSuggestBox: function() {
            const box = document.createElement('div');
            box.className = 'search-suggest-box';
            box.style.display = 'none';
            this.searchInput.parentNode.appendChild(box);
            return box;
        },

        bindEvents: function() {
            this.searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));

            this.searchInput.addEventListener('focus', () => {
                if (this.searchInput.value.length > 0) {
                    this.handleSearch(this.searchInput.value);
                }
            });

            document.addEventListener('click', (e) => {
                if (!this.searchInput.contains(e.target) && !this.suggestBox.contains(e.target)) {
                    this.hideSuggestions();
                }
            });
        },

        handleSearch: function(query) {
            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }

            // 这里应该调用实际的搜索API
            const suggestions = this.getSearchSuggestions(query);
            this.showSuggestions(suggestions);
        },

        getSearchSuggestions: function(query) {
            // 模拟搜索建议（实际应该从服务器获取）
            const allTools = [
                'ChatGPT', 'Claude', 'Midjourney', 'DALL-E', 'Stable Diffusion',
                'Suno', 'Runway', 'Perplexity', 'Gemini', 'Copilot'
            ];
            
            return allTools.filter(tool => 
                tool.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
        },

        showSuggestions: function(suggestions) {
            if (suggestions.length === 0) {
                this.hideSuggestions();
                return;
            }

            this.suggestBox.innerHTML = suggestions.map(s => `
                <div class="suggest-item" data-value="${s}">
                    <i class="fa fa-search"></i> ${s}
                </div>
            `).join('');

            this.suggestBox.style.display = 'block';

            // 绑定点击事件
            this.suggestBox.querySelectorAll('.suggest-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.searchInput.value = item.dataset.value;
                    this.hideSuggestions();
                    // 触发搜索
                    this.searchInput.form.submit();
                });
            });
        },

        hideSuggestions: function() {
            this.suggestBox.style.display = 'none';
        },

        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // 最近浏览记录
    const RecentlyViewed = {
        init: function() {
            this.maxItems = 10;
            this.loadHistory();
            this.trackCurrentPage();
            this.displayRecentlyViewed();
        },

        loadHistory: function() {
            const saved = localStorage.getItem('viewHistory');
            this.history = saved ? JSON.parse(saved) : [];
        },

        saveHistory: function() {
            localStorage.setItem('viewHistory', JSON.stringify(this.history));
        },

        trackCurrentPage: function() {
            const toolId = this.getCurrentToolId();
            if (!toolId) return;

            // 移除重复项
            this.history = this.history.filter(item => item.id !== toolId);
            
            // 添加到开头
            this.history.unshift({
                id: toolId,
                name: document.title.split(' - ')[0],
                url: window.location.href,
                timestamp: Date.now()
            });

            // 限制数量
            if (this.history.length > this.maxItems) {
                this.history = this.history.slice(0, this.maxItems);
            }

            this.saveHistory();
        },

        getCurrentToolId: function() {
            // 从URL或页面元素获取当前工具ID
            const match = window.location.pathname.match(/\/detail\/(.+)\.html/);
            return match ? match[1] : null;
        },

        displayRecentlyViewed: function() {
            const container = document.querySelector('#recently-viewed');
            if (!container || this.history.length === 0) return;

            container.innerHTML = `
                <h3>最近浏览</h3>
                <ul class="recent-list">
                    ${this.history.slice(0, 5).map(item => `
                        <li><a href="${item.url}">${item.name}</a></li>
                    `).join('')}
                </ul>
            `;
        }
    };

    // 添加CSS样式
    const addStyles = function() {
        const style = document.createElement('style');
        style.textContent = `
            /* 用户消息提示 */
            .user-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                background: #333;
                color: white;
                z-index: 10000;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
            }
            .user-message.show {
                opacity: 1;
                transform: translateY(0);
            }
            .user-message.success { background: #28a745; }
            .user-message.info { background: #17a2b8; }
            .user-message.warning { background: #ffc107; color: #333; }
            .user-message.error { background: #dc3545; }

            /* 评分星星 */
            .rating-stars {
                color: #ffd700;
                font-size: 18px;
                cursor: pointer;
            }
            .rating-star:hover {
                transform: scale(1.2);
            }
            .average-rating {
                font-size: 24px;
                font-weight: bold;
                margin-right: 10px;
            }
            .rating-count {
                color: #666;
                font-size: 14px;
                margin-left: 10px;
            }

            /* 收藏按钮 */
            .favorite-btn {
                background: none;
                border: 1px solid #ddd;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s;
            }
            .favorite-btn:hover {
                background: #f8f9fa;
            }
            .favorite-btn.active {
                background: #fff3cd;
                border-color: #ffc107;
            }

            /* 对比栏 */
            .compare-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #343a40;
                color: white;
                padding: 15px;
                z-index: 9999;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
            }
            .compare-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .compare-btn {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.3s;
            }
            .compare-btn:hover {
                background: #e9ecef;
            }
            .compare-btn.active {
                background: #28a745;
                color: white;
                border-color: #28a745;
            }
            .compare-now-btn, .clear-compare-btn {
                padding: 8px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            }
            .compare-now-btn {
                background: #007bff;
                color: white;
                margin: 0 10px;
            }
            .clear-compare-btn {
                background: #6c757d;
                color: white;
            }

            /* 搜索建议 */
            .search-suggest-box {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-top: none;
                border-radius: 0 0 5px 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            .suggest-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .suggest-item:hover {
                background: #f8f9fa;
            }
            .suggest-item i {
                margin-right: 10px;
                color: #6c757d;
            }

            /* 最近浏览 */
            .recent-list {
                list-style: none;
                padding: 0;
            }
            .recent-list li {
                padding: 8px 0;
                border-bottom: 1px dashed #eee;
            }
            .recent-list a {
                color: #333;
                text-decoration: none;
            }
            .recent-list a:hover {
                color: #007bff;
            }
        `;
        document.head.appendChild(style);
    };

    // 初始化所有功能
    document.addEventListener('DOMContentLoaded', function() {
        addStyles();
        RatingSystem.init();
        FavoriteSystem.init();
        CompareSystem.init();
        SearchSuggest.init();
        RecentlyViewed.init();
    });

    // 导出到全局
    window.UserInteraction = {
        RatingSystem,
        FavoriteSystem,
        CompareSystem,
        SearchSuggest,
        RecentlyViewed
    };

})();
