/**
 * 语言切换下拉菜单交互修复脚本
 * 确保点击和悬停交互正常工作
 */

$(document).ready(function() {
    // 语言切换下拉菜单功能
    function initLanguageSwitcher() {
        var $languageSwitcher = $('.language-switcher');
        var $dropdownMenu = $languageSwitcher.find('.dropdown-menu.languages');
        
        // 点击切换显示/隐藏
        $languageSwitcher.find('.dropdown-toggle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 切换当前下拉菜单
            $languageSwitcher.toggleClass('open');
            
            // 关闭其他可能打开的下拉菜单
            $('.language-switcher').not($languageSwitcher).removeClass('open');
        });
        
        // 悬停效果（可选）
        $languageSwitcher.on('mouseenter', function() {
            $(this).addClass('hover');
        }).on('mouseleave', function() {
            $(this).removeClass('hover');
        });
        
        // 点击菜单项时关闭下拉菜单
        $dropdownMenu.find('a').on('click', function() {
            $languageSwitcher.removeClass('open');
        });
        
        // 点击页面其他地方时关闭下拉菜单
        $(document).on('click', function(e) {
            if (!$languageSwitcher.is(e.target) && $languageSwitcher.has(e.target).length === 0) {
                $languageSwitcher.removeClass('open');
            }
        });
        
        // ESC键关闭下拉菜单
        $(document).on('keydown', function(e) {
            if (e.keyCode === 27) { // ESC key
                $languageSwitcher.removeClass('open');
            }
        });
        
        // 修复移动端触摸事件
        if ('ontouchstart' in window) {
            $languageSwitcher.on('touchstart', function(e) {
                e.stopPropagation();
            });
            
            $languageSwitcher.find('.dropdown-toggle').on('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $languageSwitcher.toggleClass('open');
            });
        }
    }
    
    // 修复可能的Bootstrap冲突
    function fixBootstrapConflicts() {
        // 禁用Bootstrap默认的dropdown行为，使用自定义的
        $('.language-switcher .dropdown-toggle').off('click.bs.dropdown');
        $('.language-switcher').off('click.bs.dropdown.data-api');
    }
    
    // 添加键盘导航支持
    function addKeyboardNavigation() {
        var $languageSwitcher = $('.language-switcher');
        var $dropdownToggle = $languageSwitcher.find('.dropdown-toggle');
        var $menuItems = $languageSwitcher.find('.dropdown-menu a');
        
        $dropdownToggle.on('keydown', function(e) {
            if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                e.preventDefault();
                $languageSwitcher.toggleClass('open');
                if ($languageSwitcher.hasClass('open')) {
                    $menuItems.first().focus();
                }
            } else if (e.keyCode === 40) { // Down arrow
                e.preventDefault();
                $languageSwitcher.addClass('open');
                $menuItems.first().focus();
            }
        });
        
        $menuItems.on('keydown', function(e) {
            var $current = $(this);
            var currentIndex = $menuItems.index($current);
            
            if (e.keyCode === 40) { // Down arrow
                e.preventDefault();
                var nextIndex = (currentIndex + 1) % $menuItems.length;
                $menuItems.eq(nextIndex).focus();
            } else if (e.keyCode === 38) { // Up arrow
                e.preventDefault();
                var prevIndex = currentIndex === 0 ? $menuItems.length - 1 : currentIndex - 1;
                $menuItems.eq(prevIndex).focus();
            } else if (e.keyCode === 27) { // ESC
                e.preventDefault();
                $languageSwitcher.removeClass('open');
                $dropdownToggle.focus();
            } else if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                e.preventDefault();
                $current[0].click();
            }
        });
    }
    
    // 修复可能的定位问题
    function fixPositioning() {
        var $languageSwitcher = $('.language-switcher');
        var $dropdownMenu = $languageSwitcher.find('.dropdown-menu.languages');
        
        // 检查下拉菜单是否会超出视窗
        $languageSwitcher.on('click', '.dropdown-toggle', function() {
            setTimeout(function() {
                if ($languageSwitcher.hasClass('open')) {
                    var menuRect = $dropdownMenu[0].getBoundingClientRect();
                    var windowWidth = window.innerWidth;
                    
                    // 如果菜单超出右边界，调整位置
                    if (menuRect.right > windowWidth) {
                        $dropdownMenu.css({
                            'left': 'auto',
                            'right': '0'
                        });
                    } else {
                        $dropdownMenu.css({
                            'left': '0',
                            'right': 'auto'
                        });
                    }
                }
            }, 10);
        });
    }
    
    // 添加ARIA属性以提高可访问性
    function addAriaAttributes() {
        var $languageSwitcher = $('.language-switcher');
        var $dropdownToggle = $languageSwitcher.find('.dropdown-toggle');
        var $dropdownMenu = $languageSwitcher.find('.dropdown-menu.languages');
        
        // 添加ARIA属性
        $dropdownToggle.attr({
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-label': '选择语言'
        });
        
        $dropdownMenu.attr({
            'role': 'menu',
            'aria-labelledby': $dropdownToggle.attr('id') || 'language-toggle'
        });
        
        $dropdownMenu.find('a').attr('role', 'menuitem');
        
        // 更新aria-expanded状态
        $languageSwitcher.on('click', '.dropdown-toggle', function() {
            setTimeout(function() {
                var isOpen = $languageSwitcher.hasClass('open');
                $dropdownToggle.attr('aria-expanded', isOpen.toString());
            }, 10);
        });
    }
    
    // 初始化所有功能
    fixBootstrapConflicts();
    initLanguageSwitcher();
    addKeyboardNavigation();
    fixPositioning();
    addAriaAttributes();
    
    // 窗口大小改变时重新检查定位
    $(window).on('resize', function() {
        $('.language-switcher').removeClass('open');
    });
    
    // 调试信息（开发环境可以启用）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Language switcher fix loaded successfully');
    }
});
