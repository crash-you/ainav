/**
 * AINAV.ART 无障碍访问优化器
 * 确保网站符合WCAG 2.1 AA标准，提升用户体验和谷歌审核通过率
 */

class AccessibilityOptimizer {
    constructor() {
        this.config = {
            enableKeyboardNavigation: true,
            enableScreenReaderSupport: true,
            enableHighContrast: true,
            enableFocusManagement: true,
            enableAriaLabels: true,
            enableColorBlindSupport: true,
            enableMotionReduction: true,
            enableTextScaling: true
        };
        
        this.accessibilityFeatures = {
            keyboardNavigation: false,
            screenReaderSupport: false,
            highContrast: false,
            focusManagement: false,
            ariaLabels: false,
            colorContrast: false,
            textAlternatives: false,
            semanticHTML: false
        };
        
        this.violations = [];
        this.improvements = [];
        
        this.init();
    }

    init() {
        console.log('♿ Starting Accessibility Optimization...');
        this.optimizeKeyboardNavigation();
        this.enhanceScreenReaderSupport();
        this.improveColorContrast();
        this.addFocusManagement();
        this.enhanceAriaLabels();
        this.optimizeSemanticHTML();
        this.addTextAlternatives();
        this.enableMotionPreferences();
        this.addAccessibilityControls();
        this.runAccessibilityAudit();
        console.log('✅ Accessibility Optimization Completed');
    }

    // 优化键盘导航
    optimizeKeyboardNavigation() {
        // 确保所有交互元素可通过键盘访问
        const interactiveElements = document.querySelectorAll(
            'button, a, input, select, textarea, [tabindex], [role="button"], [role="link"]'
        );
        
        interactiveElements.forEach((element, index) => {
            // 确保有tabindex
            if (!element.hasAttribute('tabindex') && !this.isNaturallyFocusable(element)) {
                element.setAttribute('tabindex', '0');
            }
            
            // 添加键盘事件监听
            this.addKeyboardEventListeners(element);
            
            // 确保焦点可见
            this.ensureFocusVisible(element);
        });
        
        // 添加跳过链接
        this.addSkipLinks();
        
        // 管理焦点顺序
        this.manageFocusOrder();
        
        this.accessibilityFeatures.keyboardNavigation = true;
    }

    isNaturallyFocusable(element) {
        const naturallyFocusable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
        return naturallyFocusable.includes(element.tagName) && !element.disabled;
    }

    addKeyboardEventListeners(element) {
        element.addEventListener('keydown', (e) => {
            // Enter键激活
            if (e.key === 'Enter' && element.getAttribute('role') === 'button') {
                element.click();
            }
            
            // 空格键激活按钮
            if (e.key === ' ' && element.getAttribute('role') === 'button') {
                e.preventDefault();
                element.click();
            }
            
            // Escape键关闭模态框
            if (e.key === 'Escape') {
                this.handleEscapeKey(element);
            }
        });
    }

    ensureFocusVisible(element) {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #667eea';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = '跳转到主要内容';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.2s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // 确保主要内容有ID
        let mainContent = document.querySelector('#main-content');
        if (!mainContent) {
            mainContent = document.querySelector('main, .main-content, .content');
            if (mainContent) {
                mainContent.id = 'main-content';
            }
        }
    }

    manageFocusOrder() {
        // 确保逻辑焦点顺序
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach((element, index) => {
            if (!element.hasAttribute('tabindex') || element.getAttribute('tabindex') === '0') {
                // 保持自然的焦点顺序
            }
        });
    }

    handleEscapeKey(element) {
        // 处理Escape键逻辑
        const modal = element.closest('.modal, .dialog, .popup');
        if (modal) {
            this.closeModal(modal);
        }
    }

    closeModal(modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        
        // 恢复焦点到触发元素
        const trigger = document.querySelector('[data-modal-trigger]');
        if (trigger) {
            trigger.focus();
        }
    }

    // 增强屏幕阅读器支持
    enhanceScreenReaderSupport() {
        // 添加地标角色
        this.addLandmarkRoles();
        
        // 优化标题结构
        this.optimizeHeadingStructure();
        
        // 添加屏幕阅读器专用内容
        this.addScreenReaderContent();
        
        // 优化表单标签
        this.optimizeFormLabels();
        
        // 添加状态通知
        this.addLiveRegions();
        
        this.accessibilityFeatures.screenReaderSupport = true;
    }

    addLandmarkRoles() {
        // 添加主要地标
        const landmarks = [
            { selector: 'header, .header', role: 'banner' },
            { selector: 'nav, .nav, .navigation', role: 'navigation' },
            { selector: 'main, .main-content', role: 'main' },
            { selector: 'aside, .sidebar', role: 'complementary' },
            { selector: 'footer, .footer', role: 'contentinfo' },
            { selector: '.search, .search-form', role: 'search' }
        ];
        
        landmarks.forEach(landmark => {
            const elements = document.querySelectorAll(landmark.selector);
            elements.forEach(element => {
                if (!element.hasAttribute('role')) {
                    element.setAttribute('role', landmark.role);
                }
            });
        });
    }

    optimizeHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        // 确保有且仅有一个h1
        const h1Elements = document.querySelectorAll('h1');
        if (h1Elements.length === 0) {
            console.warn('⚠️ Page should have exactly one H1 element');
            this.violations.push('缺少H1标题');
        } else if (h1Elements.length > 1) {
            console.warn('⚠️ Page should have only one H1 element');
            this.violations.push('存在多个H1标题');
        }
        
        // 检查标题层级
        let previousLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > previousLevel + 1) {
                console.warn('⚠️ Heading level skip detected:', heading.textContent);
                this.violations.push(`标题层级跳跃: ${heading.textContent}`);
            }
            previousLevel = level;
        });
    }

    addScreenReaderContent() {
        // 添加屏幕阅读器专用说明
        const srOnlyStyle = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = srOnlyStyle;
        document.head.appendChild(styleSheet);
        
        // 为重要元素添加屏幕阅读器说明
        const importantElements = document.querySelectorAll('.tool-card, .category-item');
        importantElements.forEach((element, index) => {
            const srText = document.createElement('span');
            srText.className = 'sr-only';
            srText.textContent = `第${index + 1}个项目`;
            element.appendChild(srText);
        });
    }

    optimizeFormLabels() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // 确保每个表单元素都有标签
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                console.warn('⚠️ Form element missing label:', input);
                this.violations.push(`表单元素缺少标签: ${input.type || input.tagName}`);
                
                // 自动添加aria-label
                const placeholder = input.getAttribute('placeholder');
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                }
            }
            
            // 添加必填字段标识
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
                
                // 添加视觉标识
                const requiredIndicator = document.createElement('span');
                requiredIndicator.textContent = ' *';
                requiredIndicator.setAttribute('aria-label', '必填字段');
                requiredIndicator.style.color = '#d32f2f';
                
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    label.appendChild(requiredIndicator);
                }
            }
        });
    }

    addLiveRegions() {
        // 添加状态通知区域
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        // 添加错误通知区域
        const errorRegion = document.createElement('div');
        errorRegion.id = 'error-region';
        errorRegion.setAttribute('aria-live', 'assertive');
        errorRegion.setAttribute('aria-atomic', 'true');
        errorRegion.className = 'sr-only';
        document.body.appendChild(errorRegion);
        
        // 提供通知方法
        window.announceToScreenReader = (message, isError = false) => {
            const region = isError ? errorRegion : liveRegion;
            region.textContent = message;
            
            // 清除消息
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        };
    }

    // 改善颜色对比度
    improveColorContrast() {
        // 检查颜色对比度
        this.checkColorContrast();
        
        // 添加高对比度模式
        this.addHighContrastMode();
        
        // 优化链接可见性
        this.optimizeLinkVisibility();
        
        this.accessibilityFeatures.colorContrast = true;
    }

    checkColorContrast() {
        // 基础颜色对比度检查
        const textElements = document.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6');
        
        textElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // 简化的对比度检查
            if (this.isLowContrast(color, backgroundColor)) {
                console.warn('⚠️ Low color contrast detected:', element);
                this.violations.push(`颜色对比度不足: ${element.textContent?.substring(0, 50)}...`);
            }
        });
    }

    isLowContrast(color, backgroundColor) {
        // 简化的对比度检查逻辑
        // 实际应用中应使用更精确的WCAG对比度计算
        if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
            return true;
        }
        if (color === 'rgb(0, 0, 0)' && backgroundColor === 'rgb(0, 0, 0)') {
            return true;
        }
        return false;
    }

    addHighContrastMode() {
        // 添加高对比度切换按钮
        const contrastToggle = document.createElement('button');
        contrastToggle.textContent = '高对比度';
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.setAttribute('aria-label', '切换高对比度模式');
        contrastToggle.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 8px 12px;
            background: #000;
            color: #fff;
            border: 2px solid #fff;
            border-radius: 4px;
            cursor: pointer;
        `;
        
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            contrastToggle.setAttribute('aria-pressed', isHighContrast.toString());
            
            window.announceToScreenReader(
                isHighContrast ? '已启用高对比度模式' : '已关闭高对比度模式'
            );
        });
        
        document.body.appendChild(contrastToggle);
        
        // 添加高对比度样式
        this.addHighContrastStyles();
    }

    addHighContrastStyles() {
        const highContrastStyles = `
            .high-contrast {
                filter: contrast(150%) brightness(150%);
            }
            
            .high-contrast * {
                background-color: #000 !important;
                color: #fff !important;
                border-color: #fff !important;
            }
            
            .high-contrast a {
                color: #ffff00 !important;
                text-decoration: underline !important;
            }
            
            .high-contrast button {
                background-color: #fff !important;
                color: #000 !important;
                border: 2px solid #fff !important;
            }
            
            .high-contrast img {
                filter: contrast(150%) brightness(150%);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = highContrastStyles;
        document.head.appendChild(styleSheet);
    }

    optimizeLinkVisibility() {
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            // 确保链接有下划线或其他视觉区分
            const styles = window.getComputedStyle(link);
            if (styles.textDecoration === 'none') {
                link.style.borderBottom = '1px solid currentColor';
            }
            
            // 添加焦点样式
            link.addEventListener('focus', () => {
                link.style.outline = '2px solid #667eea';
                link.style.outlineOffset = '2px';
            });
        });
    }

    // 添加焦点管理
    addFocusManagement() {
        // 管理模态框焦点
        this.manageFocusInModals();
        
        // 管理下拉菜单焦点
        this.manageFocusInDropdowns();
        
        // 添加焦点陷阱
        this.addFocusTraps();
        
        this.accessibilityFeatures.focusManagement = true;
    }

    manageFocusInModals() {
        const modals = document.querySelectorAll('.modal, .dialog, .popup');
        
        modals.forEach(modal => {
            modal.addEventListener('show', () => {
                // 保存当前焦点
                modal.dataset.previousFocus = document.activeElement;
                
                // 设置焦点到模态框
                const firstFocusable = modal.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (firstFocusable) {
                    firstFocusable.focus();
                }
                
                // 设置aria属性
                modal.setAttribute('aria-modal', 'true');
                modal.setAttribute('role', 'dialog');
            });
            
            modal.addEventListener('hide', () => {
                // 恢复焦点
                const previousFocus = document.querySelector(modal.dataset.previousFocus);
                if (previousFocus) {
                    previousFocus.focus();
                }
                
                modal.removeAttribute('aria-modal');
            });
        });
    }

    manageFocusInDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown, .menu');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger, .menu-trigger');
            const menu = dropdown.querySelector('.dropdown-menu, .menu-items');
            
            if (trigger && menu) {
                trigger.addEventListener('click', () => {
                    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                    trigger.setAttribute('aria-expanded', (!isExpanded).toString());
                    
                    if (!isExpanded) {
                        const firstItem = menu.querySelector('a, button');
                        if (firstItem) {
                            firstItem.focus();
                        }
                    }
                });
                
                // 键盘导航
                menu.addEventListener('keydown', (e) => {
                    const items = menu.querySelectorAll('a, button');
                    const currentIndex = Array.from(items).indexOf(document.activeElement);
                    
                    switch (e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            const nextIndex = (currentIndex + 1) % items.length;
                            items[nextIndex].focus();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            const prevIndex = (currentIndex - 1 + items.length) % items.length;
                            items[prevIndex].focus();
                            break;
                        case 'Escape':
                            trigger.focus();
                            trigger.setAttribute('aria-expanded', 'false');
                            break;
                    }
                });
            }
        });
    }

    addFocusTraps() {
        // 为模态框添加焦点陷阱
        const modals = document.querySelectorAll('.modal, .dialog');
        
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            // Shift + Tab
                            if (document.activeElement === firstElement) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        } else {
                            // Tab
                            if (document.activeElement === lastElement) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                });
            }
        });
    }

    // 增强ARIA标签
    enhanceAriaLabels() {
        // 为交互元素添加ARIA标签
        this.addAriaLabelsToInteractiveElements();
        
        // 优化表单ARIA属性
        this.enhanceFormAria();
        
        // 添加状态和属性
        this.addAriaStatesAndProperties();
        
        this.accessibilityFeatures.ariaLabels = true;
    }

    addAriaLabelsToInteractiveElements() {
        const elements = document.querySelectorAll('button, a, input, select, textarea');
        
        elements.forEach(element => {
            // 如果没有可访问的名称，添加aria-label
            if (!this.hasAccessibleName(element)) {
                const ariaLabel = this.generateAriaLabel(element);
                if (ariaLabel) {
                    element.setAttribute('aria-label', ariaLabel);
                }
            }
            
            // 为按钮添加描述
            if (element.tagName === 'BUTTON' && !element.getAttribute('aria-describedby')) {
                const description = this.generateButtonDescription(element);
                if (description) {
                    const descId = 'desc-' + Math.random().toString(36).substr(2, 9);
                    const descElement = document.createElement('span');
                    descElement.id = descId;
                    descElement.className = 'sr-only';
                    descElement.textContent = description;
                    element.parentNode.appendChild(descElement);
                    element.setAttribute('aria-describedby', descId);
                }
            }
        });
    }

    hasAccessibleName(element) {
        return element.getAttribute('aria-label') ||
               element.getAttribute('aria-labelledby') ||
               element.textContent.trim() ||
               element.getAttribute('title') ||
               element.getAttribute('alt');
    }

    generateAriaLabel(element) {
        // 基于元素类型和上下文生成ARIA标签
        const tagName = element.tagName.toLowerCase();
        const className = element.className;
        const type = element.type;
        
        if (tagName === 'button') {
            if (className.includes('close')) return '关闭';
            if (className.includes('menu')) return '菜单';
            if (className.includes('search')) return '搜索';
            if (type === 'submit') return '提交';
        }
        
        if (tagName === 'a') {
            const href = element.getAttribute('href');
            if (href && href.startsWith('mailto:')) return '发送邮件';
            if (href && href.startsWith('tel:')) return '拨打电话';
            if (element.target === '_blank') return '在新窗口打开链接';
        }
        
        if (tagName === 'input') {
            const placeholder = element.getAttribute('placeholder');
            if (placeholder) return placeholder;
            if (type === 'search') return '搜索输入框';
            if (type === 'email') return '邮箱输入框';
            if (type === 'password') return '密码输入框';
        }
        
        return null;
    }

    generateButtonDescription(button) {
        const className = button.className;
        const parentContext = button.closest('.tool-card, .category-item');
        
        if (parentContext) {
            const title = parentContext.querySelector('h1, h2, h3, h4, h5, h6, .title, .name');
            if (title) {
                return `操作按钮，用于${title.textContent.trim()}`;
            }
        }
        
        if (className.includes('share')) return '分享此内容到社交媒体';
        if (className.includes('favorite')) return '添加到收藏夹';
        if (className.includes('download')) return '下载相关文件';
        
        return null;
    }

    enhanceFormAria() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // 为表单添加标题
            if (!form.getAttribute('aria-labelledby') && !form.getAttribute('aria-label')) {
                const heading = form.querySelector('h1, h2, h3, h4, h5, h6');
                if (heading) {
                    const headingId = heading.id || 'form-heading-' + Math.random().toString(36).substr(2, 9);
                    heading.id = headingId;
                    form.setAttribute('aria-labelledby', headingId);
                }
            }
            
            // 为字段组添加fieldset和legend
            const fieldGroups = form.querySelectorAll('.form-group, .field-group');
            fieldGroups.forEach(group => {
                if (group.children.length > 1 && !group.querySelector('fieldset')) {
                    const fieldset = document.createElement('fieldset');
                    const legend = document.createElement('legend');
                    
                    const groupTitle = group.querySelector('.group-title, .field-title');
                    if (groupTitle) {
                        legend.textContent = groupTitle.textContent;
                        groupTitle.remove();
                    } else {
                        legend.textContent = '表单字段组';
                        legend.className = 'sr-only';
                    }
                    
                    fieldset.appendChild(legend);
                    while (group.firstChild) {
                        fieldset.appendChild(group.firstChild);
                    }
                    group.appendChild(fieldset);
                }
            });
        });
    }

    addAriaStatesAndProperties() {
        // 为可展开元素添加aria-expanded
        const expandableElements = document.querySelectorAll('.expandable, .collapsible, .accordion-header');
        expandableElements.forEach(element => {
            if (!element.hasAttribute('aria-expanded')) {
                element.setAttribute('aria-expanded', 'false');
            }
        });
        
        // 为当前页面链接添加aria-current
        const currentPageLinks = document.querySelectorAll('a[href]');
        currentPageLinks.forEach(link => {
            if (link.href === window.location.href) {
                link.setAttribute('aria-current', 'page');
            }
        });
        
        // 为加载状态添加aria-busy
        const loadingElements = document.querySelectorAll('.loading, .spinner');
        loadingElements.forEach(element => {
            element.setAttribute('aria-busy', 'true');
            element.setAttribute('aria-label', '正在加载');
        });
    }

    // 优化语义化HTML
    optimizeSemanticHTML() {
        // 检查语义化标签使用
        this.checkSemanticTags();
        
        // 优化列表结构
        this.optimizeListStructure();
        
        // 添加语义化角色
        this.addSemanticRoles();
        
        this.accessibilityFeatures.semanticHTML = true;
    }

    checkSemanticTags() {
        const semanticTags = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
        const foundTags = [];
        
        semanticTags.forEach(tag => {
            const elements = document.querySelectorAll(tag);
            if (elements.length > 0) {
                foundTags.push(tag);
            }
        });
        
        const missingTags = semanticTags.filter(tag => !foundTags.includes(tag));
        if (missingTags.length > 0) {
            console.warn('⚠️ Missing semantic tags:', missingTags);
            this.violations.push(`缺少语义化标签: ${missingTags.join(', ')}`);
        }
    }

    optimizeListStructure() {
        // 检查是否有应该使用列表的内容
        const potentialLists = document.querySelectorAll('.tools-grid, .categories, .menu-items');
        
        potentialLists.forEach(container => {
            const items = container.children;
            if (items.length > 2 && !container.matches('ul, ol')) {
                console.warn('⚠️ Content should use list structure:', container);
                this.improvements.push('建议使用列表结构组织内容');
            }
        });
    }

    addSemanticRoles() {
        // 为非语义化元素添加适当的角色
        const roleMap = [
            { selector: '.banner', role: 'banner' },
            { selector: '.navigation', role: 'navigation' },
            { selector: '.main-content', role: 'main' },
            { selector: '.sidebar', role: 'complementary' },
            { selector: '.footer', role: 'contentinfo' },
            { selector: '.search', role: 'search' },
            { selector: '.breadcrumb', role: 'navigation' },
            { selector: '.pagination', role: 'navigation' }
        ];
        
        roleMap.forEach(mapping => {
            const elements = document.querySelectorAll(mapping.selector);
            elements.forEach(element => {
                if (!element.hasAttribute('role')) {
                    element.setAttribute('role', mapping.role);
                }
            });
        });
    }

    // 添加文本替代方案
    addTextAlternatives() {
        // 优化图片alt文本
        this.optimizeImageAltText();
        
        // 为图标添加文本说明
        this.addIconTextAlternatives();
        
        // 为多媒体内容添加替代方案
        this.addMediaAlternatives();
        
        this.accessibilityFeatures.textAlternatives = true;
    }

    optimizeImageAltText() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.alt) {
                // 基于图片信息生成alt文本
                const altText = this.generateImageAltText(img);
                img.alt = altText;
            } else if (img.alt.length < 5) {
                // 改善过短的alt文本
                const improvedAlt = this.improveImageAltText(img, img.alt);
                img.alt = improvedAlt;
            }
            
            // 装饰性图片
            if (this.isDecorativeImage(img)) {
                img.alt = '';
                img.setAttribute('role', 'presentation');
            }
        });
    }

    generateImageAltText(img) {
        const src = img.src;
        const filename = src.split('/').pop().split('.')[0];
        const context = img.closest('.tool-card, .category-item');
        
        if (context) {
            const title = context.querySelector('h1, h2, h3, h4, h5, h6, .title, .name');
            if (title) {
                return `${title.textContent.trim()}的图标`;
            }
        }
        
        // 基于文件名生成
        const cleanName = filename.replace(/[-_]/g, ' ').toLowerCase();
        return `${cleanName}相关图片`;
    }

    improveImageAltText(img, currentAlt) {
        const context = img.closest('.tool-card, .category-item');
        
        if (context && currentAlt.length < 10) {
            const title = context.querySelector('h1, h2, h3, h4, h5, h6, .title, .name');
            if (title) {
                return `${title.textContent.trim()} - ${currentAlt}`;
            }
        }
        
        return currentAlt;
    }

    isDecorativeImage(img) {
        // 判断是否为装饰性图片
        const decorativeClasses = ['decoration', 'ornament', 'divider', 'spacer'];
        return decorativeClasses.some(cls => img.className.includes(cls));
    }

    addIconTextAlternatives() {
        const icons = document.querySelectorAll('.icon, [class*="icon-"], .fa, [class*="fa-"]');
        
        icons.forEach(icon => {
            if (!icon.getAttribute('aria-label') && !icon.getAttribute('aria-hidden')) {
                const iconText = this.generateIconText(icon);
                if (iconText) {
                    icon.setAttribute('aria-label', iconText);
                } else {
                    icon.setAttribute('aria-hidden', 'true');
                }
            }
        });
    }

    generateIconText(icon) {
        const className = icon.className;
        
        // 常见图标映射
        const iconMap = {
            'search': '搜索',
            'menu': '菜单',
            'close': '关闭',
            'home': '首页',
            'user': '用户',
            'settings': '设置',
            'help': '帮助',
            'info': '信息',
            'warning': '警告',
            'error': '错误',
            'success': '成功',
            'star': '星标',
            'heart': '收藏',
            'share': '分享',
            'download': '下载',
            'upload': '上传',
            'edit': '编辑',
            'delete': '删除',
            'add': '添加',
            'remove': '移除'
        };
        
        for (const [key, value] of Object.entries(iconMap)) {
            if (className.includes(key)) {
                return value;
            }
        }
        
        return null;
    }

    addMediaAlternatives() {
        // 为视频添加字幕轨道
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.querySelector('track[kind="captions"]')) {
                console.warn('⚠️ Video missing captions:', video.src);
                this.violations.push('视频缺少字幕');
            }
        });
        
        // 为音频添加文本描述
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            if (!audio.getAttribute('aria-describedby')) {
                console.warn('⚠️ Audio missing description:', audio.src);
                this.violations.push('音频缺少文本描述');
            }
        });
    }

    // 启用动作偏好设置
    enableMotionPreferences() {
        // 检查用户的动作偏好
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduce-motion');
            this.addReducedMotionStyles();
        }
        
        // 监听偏好变化
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        });
    }

    addReducedMotionStyles() {
        const reducedMotionStyles = `
            .reduce-motion *,
            .reduce-motion *::before,
            .reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = reducedMotionStyles;
        document.head.appendChild(styleSheet);
    }

    // 添加无障碍控制面板
    addAccessibilityControls() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'accessibility-controls';
        controlPanel.setAttribute('role', 'region');
        controlPanel.setAttribute('aria-label', '无障碍访问控制');
        
        controlPanel.innerHTML = `
            <button class="a11y-toggle" aria-label="打开无障碍控制面板">♿</button>
            <div class="a11y-panel" aria-hidden="true">
                <h3>无障碍访问设置</h3>
                <div class="a11y-controls">
                    <button id="font-size-increase" aria-label="增大字体">A+</button>
                    <button id="font-size-decrease" aria-label="减小字体">A-</button>
                    <button id="high-contrast-toggle" aria-label="切换高对比度">对比度</button>
                    <button id="focus-outline-toggle" aria-label="切换焦点轮廓">焦点</button>
                    <button id="link-underline-toggle" aria-label="切换链接下划线">下划线</button>
                </div>
            </div>
        `;
        
        // 添加样式
        this.addAccessibilityControlStyles();
        
        // 绑定事件
        this.bindAccessibilityControlEvents(controlPanel);
        
        document.body.appendChild(controlPanel);
    }

    addAccessibilityControlStyles() {
        const styles = `
            .accessibility-controls {
                position: fixed;
                top: 50px;
                right: 10px;
                z-index: 10000;
            }
            
            .a11y-toggle {
                background: #667eea;
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            
            .a11y-panel {
                position: absolute;
                top: 60px;
                right: 0;
                background: white;
                border: 2px solid #667eea;
                border-radius: 8px;
                padding: 20px;
                min-width: 200px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                display: none;
            }
            
            .a11y-panel[aria-hidden="false"] {
                display: block;
            }
            
            .a11y-controls {
                display: grid;
                gap: 10px;
                margin-top: 15px;
            }
            
            .a11y-controls button {
                padding: 10px;
                border: 1px solid #ddd;
                background: white;
                cursor: pointer;
                border-radius: 4px;
            }
            
            .a11y-controls button:hover {
                background: #f0f0f0;
            }
            
            .font-size-large {
                font-size: 120% !important;
            }
            
            .font-size-larger {
                font-size: 140% !important;
            }
            
            .focus-visible * {
                outline: 3px solid #667eea !important;
                outline-offset: 2px !important;
            }
            
            .links-underlined a {
                text-decoration: underline !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    bindAccessibilityControlEvents(controlPanel) {
        const toggle = controlPanel.querySelector('.a11y-toggle');
        const panel = controlPanel.querySelector('.a11y-panel');
        
        toggle.addEventListener('click', () => {
            const isHidden = panel.getAttribute('aria-hidden') === 'true';
            panel.setAttribute('aria-hidden', (!isHidden).toString());
            toggle.setAttribute('aria-expanded', isHidden.toString());
        });
        
        // 字体大小控制
        let fontSize = 100;
        const fontIncreaseBtn = controlPanel.querySelector('#font-size-increase');
        const fontDecreaseBtn = controlPanel.querySelector('#font-size-decrease');
        
        fontIncreaseBtn.addEventListener('click', () => {
            fontSize = Math.min(fontSize + 20, 160);
            document.body.style.fontSize = fontSize + '%';
            window.announceToScreenReader(`字体大小已调整为${fontSize}%`);
        });
        
        fontDecreaseBtn.addEventListener('click', () => {
            fontSize = Math.max(fontSize - 20, 80);
            document.body.style.fontSize = fontSize + '%';
            window.announceToScreenReader(`字体大小已调整为${fontSize}%`);
        });
        
        // 其他控制
        const contrastBtn = controlPanel.querySelector('#high-contrast-toggle');
        contrastBtn.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isActive = document.body.classList.contains('high-contrast');
            window.announceToScreenReader(isActive ? '已启用高对比度' : '已关闭高对比度');
        });
        
        const focusBtn = controlPanel.querySelector('#focus-outline-toggle');
        focusBtn.addEventListener('click', () => {
            document.body.classList.toggle('focus-visible');
            const isActive = document.body.classList.contains('focus-visible');
            window.announceToScreenReader(isActive ? '已启用焦点轮廓' : '已关闭焦点轮廓');
        });
        
        const linkBtn = controlPanel.querySelector('#link-underline-toggle');
        linkBtn.addEventListener('click', () => {
            document.body.classList.toggle('links-underlined');
            const isActive = document.body.classList.contains('links-underlined');
            window.announceToScreenReader(isActive ? '已启用链接下划线' : '已关闭链接下划线');
        });
    }

    // 运行无障碍审核
    runAccessibilityAudit() {
        console.log('🔍 Running Accessibility Audit...');
        
        const auditResults = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            features: this.accessibilityFeatures,
            violations: this.violations,
            improvements: this.improvements,
            score: this.calculateAccessibilityScore(),
            recommendations: this.generateRecommendations()
        };
        
        console.log('📊 Accessibility Audit Results:', auditResults);
        return auditResults;
    }

    calculateAccessibilityScore() {
        const totalFeatures = Object.keys(this.accessibilityFeatures).length;
        const enabledFeatures = Object.values(this.accessibilityFeatures).filter(Boolean).length;
        const baseScore = (enabledFeatures / totalFeatures) * 100;
        
        // 根据违规数量扣分
        const violationPenalty = Math.min(this.violations.length * 5, 30);
        
        return Math.max(baseScore - violationPenalty, 0);
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.violations.length > 0) {
            recommendations.push('修复所有无障碍访问违规问题');
        }
        
        if (!this.accessibilityFeatures.keyboardNavigation) {
            recommendations.push('完善键盘导航支持');
        }
        
        if (!this.accessibilityFeatures.screenReaderSupport) {
            recommendations.push('增强屏幕阅读器支持');
        }
        
        if (!this.accessibilityFeatures.colorContrast) {
            recommendations.push('改善颜色对比度');
        }
        
        return recommendations;
    }

    // 公共方法
    getAuditResults() {
        return this.runAccessibilityAudit();
    }

    reaudit() {
        this.violations = [];
        this.improvements = [];
        this.accessibilityFeatures = Object.fromEntries(
            Object.keys(this.accessibilityFeatures).map(key => [key, false])
        );
        this.init();
    }
}

// 初始化无障碍优化器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.accessibilityOptimizer = new AccessibilityOptimizer();
    }, 1500);
});

// 导出给其他脚本使用
window.AccessibilityOptimizer = AccessibilityOptimizer;
