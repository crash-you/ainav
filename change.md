设计师网址导航网站改造为AI导航网站策略
一、基本修改思路
修改网站基本信息
网站标题和描述
关键词标签
SEO相关元数据
更新域名为ainav.art
修改导航菜单分类
将设计相关分类替换为AI相关分类
调整菜单图标
更新网站卡片内容
替换所有设计相关网站为AI相关网站
更新网站描述
准备新的网站logo图片
更换网站视觉元素
网站主logo
favicon图标
banner图片

二、具体修改步骤
1. 修改网站基本信息
修改文件：
index.html
cn/index.html
en/index.html
CNAME文件

修改内容：
将CNAME文件内容从"webstack.cc"更改为"ainav.art"
将标题从"WebStack.cc - 设计师网址导航"改为"AINAV.ART - AI网址导航"
更新所有meta标签中的关键词和描述
更新所有URL中的域名

<title>AINAV.ART - AI网址导航</title>
<meta name="keywords" content="AI,人工智能,AI工具,AI导航,网址导航,AI资源,ChatGPT,AI绘画,AIGC,AI写作,大语言模型,LLM,AI应用,AI开发,AI学习,www.ainav.art">
<meta name="description" content="AINAV.ART - 收集国内外优秀AI网站、人工智能工具、AI模型和资源网站，定时更新分享优质AI应用和工具。www.ainav.art">

修改社交媒体标签：
<meta property="og:url" content="http://www.ainav.art/">
<meta property="og:title" content="AINAV.ART - 收集国内外优秀AI网站、人工智能工具、AI模型和资源网站，定时更新分享优质AI应用和工具。www.ainav.art">
<meta property="og:description" content="AI,人工智能,AI工具,AI导航,网址导航,AI资源,ChatGPT,AI绘画,AIGC,AI写作,大语言模型,LLM,AI应用,AI开发,AI学习,www.ainav.art">
<meta property="og:image" content="http://www.ainav.art/assets/images/ainav_banner.png">
<meta property="og:site_name" content="AINAV.ART - 收集国内外优秀AI网站、人工智能工具、AI模型和资源网站，定时更新分享优质AI应用和工具。www.ainav.art">

修改多语言链接：
<link rel="alternate" hreflang="zh" href="https://www.ainav.art/cn/index.html" />
<link rel="alternate" hreflang="en" href="https://www.ainav.art/en/index.html" />
<link rel="alternate" hreflang="x-default" href="https://www.ainav.art/" />

2. 修改导航菜单分类
修改文件：
cn/index.html
en/index.html
修改内容：
替换以下部分的菜单项和分类：
Apply to change.md
<ul id="main-menu" class="main-menu">
    <li>
        <a href="#常用AI工具" class="smooth">
            <i class="linecons-star"></i>
            <span class="title">常用AI工具</span>
        </a>
    </li>
    <li>
        <a href="#AI社区资讯" class="smooth">
            <i class="linecons-doc"></i>
            <span class="title">AI全球资讯</span>
        </a>
    </li>
    <li>
        <a>
            <i class="linecons-lightbulb"></i>
            <span class="title">AI创作工具</span>
        </a>
        <ul>
            <li>
                <a href="#AI绘画" class="smooth">
                    <span class="title">AI绘画</span>
                </a>
            </li>
            <li>
                <a href="#AI写作" class="smooth">
                    <span class="title">AI写作</span>
                </a>
            </li>
            <li>
                <a href="#AI音频" class="smooth">
                    <span class="title">AI音频</span>
                    <span class="label label-pink pull-right hidden-collapsed">Hot</span>
                </a>
            </li>
            <li>
                <a href="#AI视频" class="smooth">
                    <span class="title">AI视频</span>
                </a>
            </li>
        </ul>
    </li>
    <!-- <li>
        <a>
            <i class="linecons-thumbs-up"></i>
            <span class="title">AI模型与框架</span>
        </a>
        <ul>
            <li>
                <a href="#大语言模型" class="smooth">
                    <span class="title">大语言模型</span>
                </a>
            </li>
            <li>
                <a href="#开源AI模型" class="smooth">
                    <span class="title">开源AI模型</span>
                </a>
            </li>
            <li>
                <a href="#AI开发框架" class="smooth">
                    <span class="title">AI开发框架</span>
                </a>
            </li>
        </ul>
    </li> -->
    <!-- <li>
        <a>
            <i class="linecons-diamond"></i>
            <span class="title">AI开发资源</span>
        </a>
        <ul>
            <li>
                <a href="#AI数据集" class="smooth">
                    <span class="title">AI数据集</span>
                </a>
            </li>
            <li>
                <a href="#AI云服务" class="smooth">
                    <span class="title">AI云服务</span>
                </a>
            </li>
            <li>
                <a href="#API服务" class="smooth">
                    <span class="title">API服务</span>
                </a>
            </li>
        </ul>
    </li> -->
    <li>
        <a>
            <i class="linecons-pencil"></i>
            <span class="title">AI学习资源</span>
        </a>
        <ul>
            <li>
                <a href="#AI教程" class="smooth">
                    <span class="title">AI教程</span>
                </a>
            </li>
            <li>
                <a href="#AI课程" class="smooth">
                    <span class="title">AI课程</span>
                </a>
            </li>
            <li>
                <a href="#AI研究" class="smooth">
                    <span class="title">我的AI研究</span>
                </a>
            </li>
        </ul>
    </li>
    <li>
        <a href="about.html">
            <i class="linecons-heart"></i>
            <span class="tooltip-blue">关于本站</span>
            <span class="label label-Primary pull-right hidden-collapsed">♥︎</span>
        </a>
    </li>
</ul>

3. 更新网站卡片内容
修改文件：
cn/index.html
en/index.html
修改内容：
替换现有设计相关网站卡片为AI相关网站卡片。每个卡片格式如下：
<div class="col-sm-3">
    <div class="xe-widget xe-conversations box2 label-info" onclick="window.open('https://chat.openai.com/', '_blank')" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="https://chat.openai.com/">
        <div class="xe-comment-entry">
            <a class="xe-user-img">
                <img data-src="../assets/images/logos/chatgpt.png" class="lozad img-circle" width="40">
            </a>
            <div class="xe-comment">
                <a href="#" class="xe-user-name overflowClip_1">
                    <strong>ChatGPT</strong>
                </a>
                <p class="overflowClip_2">OpenAI开发的强大对话AI助手，可以回答问题、创作内容、辅助工作。</p>
            </div>
        </div>
    </div>
</div>

建议的AI网站分类和示例
常用AI工具
ChatGPT (https://chat.openai.com)
Claude (https://claude.ai)
Bard/Gemini (https://gemini.google.com)
Copilot (https://copilot.microsoft.com)
Perplexity (https://perplexity.ai)
AI绘画
Midjourney (https://midjourney.com)
DALL-E (https://openai.com/dall-e-3)
Stable Diffusion (https://stability.ai)
Leonardo.AI (https://leonardo.ai)
Canva AI (https://www.canva.com/ai-image-generator)
AI写作
Notion AI (https://notion.so)
Jasper (https://jasper.ai)
Copy.ai (https://copy.ai)
Rytr (https://rytr.me)
Writesonic (https://writesonic.com)
AI音频
ElevenLabs (https://elevenlabs.io)
Mubert (https://mubert.com)
Suno (https://suno.ai)
Play.ht (https://play.ht)
Soundraw (https://soundraw.io)
AI视频
Runway (https://runwayml.com)
Synthesia (https://synthesia.io)
D-ID (https://d-id.com)
Fliki (https://fliki.ai)
Lumen5 (https://lumen5.com)

4. 更换网站视觉元素
修改文件：
assets/images/logo@2x.png
assets/images/logo-collapsed@2x.png
assets/images/favicon.png
assets/images/ainav_banner.png (新文件，替换原webstack_banner_cn.png)
修改内容：
创建新的AI相关logo替换现有logo
创建新的favicon替换现有favicon
创建新的banner图片，包含AI相关视觉元素和新域名

新增内容：
在assets/images/logos/目录下添加所有AI网站的logo图片

5. 更新GitHub链接和页脚信息
修改文件：
cn/index.html
en/index.html
cn/about.html
en/about.html
404.html
修改内容：
更新"Fork me on GitHub"链接（如有）
更新页脚版权信息
更新404页面中的返回链接为 "👉 ainav.art"

三、具体实施建议
先备份文件：在修改前备份所有原始文件
分步修改：先修改基本信息和菜单，再替换网站卡片
测试兼容性：修改后在不同设备和浏览器上测试
逐步完善：可以先做基础改造，后续再添加更多AI网站资源
四、特别提示
网站卡片中的logo图片需要提前准备好并放在assets/images/logos/目录下
需要为每个AI网站准备一段简短且准确的描述
英文版(en/index.html)的修改方式与中文版相同，但内容需翻译成英文
标题和分类可以根据实际需求进行调整
在实施完所有更改后，建议全站搜索"webstack.cc"，确保所有旧域名已替换为"ainav.art"
五、参考链接
以下是部分AI网站的官方链接，可作为添加网站卡片的参考：
https://chat.openai.com/
https://claude.ai/
https://gemini.google.com/
https://www.midjourney.com/
https://stability.ai/
https://www.perplexity.ai/
https://huggingface.co

六、更新日志（2025-08-08）
- 内容：
  - 更新 `AICreate`：新增2024-2025热门AI创作工具（Midjourney、Stable Diffusion/SDXL、Ideogram、Adobe Firefly、Leonardo、Playground、Flux.1、Krea、Suno、Udio、ElevenLabs、Stable Audio、Pika、Luma Dream Machine、Sora、HeyGen、CapCut 等）。
  - 更新 `AIGlobal`：补充权威资讯源（OpenAI、DeepMind、Anthropic、Meta AI、NVIDIA、Hugging Face、Papers with Code、arXiv、The Decoder、The Verge、机器之心、澎湃精选）。
  - 更新 `ofenAI`：新增“快速导航”分区，便于高频跳转。
- 说明：
  - 本次为静态内容更新，未改动样式与脚本；后续可考虑升级前端依赖（Bootstrap/jQuery）与资源懒加载库。
  - 英文版页面如需同步，请在 `en/` 对应页面增补等价内容并校对外链。