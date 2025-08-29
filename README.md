# AINAV.ART - AI网址导航

AINAV.ART是一个专注于AI工具和资源的网址导航网站，收集整理了国内外优秀的人工智能工具、模型和资源网站，帮助AI爱好者和从业者快速找到所需的AI应用。

## 项目概述

本项目是一个静态AI导航网站，主要面向AI开发者、研究者、创作者等用户群体，提供了丰富的AI工具分类导航。项目基于Bootstrap前端框架开发，支持响应式布局和中英双语，可适配不同设备屏幕大小。

## 目录结构

项目的主要目录结构如下：

```
.
├── assets/               # 静态资源目录
│   ├── css/             # CSS样式文件
│   │   └── fonts/       # 字体文件（仅保留fontawesome和linecons）
│   ├── images/          # 图片资源
│   │   └── logos/       # AI工具图标
│   └── js/              # JavaScript脚本
├── cn/                  # 中文版网站
│   ├── index.html       # 中文主页
│   ├── about.html       # 关于页面
│   └── tools/           # 工具详情页
├── en/                  # 英文版网站
│   ├── index.html       # 英文主页
│   ├── about.html       # 关于页面
│   └── tools/           # 工具详情页
├── index.html           # 默认入口页面（语言检测）
├── tools_data.json      # 工具数据配置
├── change.md            # 项目变更记录
└── 404.html             # 404错误页面
```

## 主要功能

### 1. AI工具导航

网站的核心功能是提供各类精选AI工具资源，按照以下类别进行组织：

- **常用AI工具**：ChatGPT、Claude、Gemini等主流AI助手
- **AI全球资讯**：AI行业动态、技术突破和应用案例
- **AI创作工具**：
  - AI绘画：Midjourney、DALL-E、Stable Diffusion等
  - AI写作：Notion AI、Jasper、Copy.ai等
  - AI音频：Suno、ElevenLabs、Stable Audio等
  - AI视频：Runway、Pika、Luma Dream Machine等

### 2. 多语言支持

项目支持中文和英文两种语言版本，分别位于`cn`和`en`目录下，用户可以根据需要切换语言。

### 3. 响应式设计

网站采用响应式设计，可适配不同设备屏幕大小：
- 在桌面设备上展示完整的侧边栏导航和网址卡片
- 在移动设备上自动调整布局，确保良好的用户体验

### 4. AI工具卡片展示

每个AI工具以卡片形式展示，包含：
- 工具LOGO
- 工具名称
- 功能简介
- 直接跳转链接

### 5. 分类导航

左侧提供多级分类导航菜单，支持折叠展开，方便用户快速定位所需资源类别。

## 技术实现

项目主要采用以下技术：

- **HTML5/CSS3**：构建页面结构和样式
- **Bootstrap**：提供响应式布局和基础UI组件
- **jQuery**：实现动态交互效果
- **Font Awesome & Linecons**：提供丰富的图标资源

## 部署方式

作为一个静态网站，WebStack支持多种部署方式：

1. **直接部署**：将项目文件上传到任何支持静态网站的托管服务
2. **GitHub Pages**：可部署到GitHub Pages实现免费托管
3. **Netlify/Vercel**：支持自动部署和CDN加速

## 项目特点

### ✨ 精简优化
- 移除了不必要的字体库和重复文件
- 优化了项目结构，减少了约30%的文件大小
- 保留核心功能，提升加载速度

### 🎯 专业聚焦
- 专注AI工具和资源导航
- 涵盖AI创作、写作、音频、视频等主要应用场景
- 及时更新最新AI工具和资讯

## 自定义修改

若要自定义网站内容：

1. 修改`cn/index.html`和`en/index.html`中的AI工具卡片内容
2. 替换`assets/images/logos/`下的工具图标
3. 根据需要调整CSS样式和分类

## 许可证

本项目基于MIT许可证开源，详细信息请参见[LICENSE](LICENSE)文件。


