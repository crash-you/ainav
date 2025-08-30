// 批量优化图片alt标签的脚本
// 这个脚本可以帮助批量添加SEO友好的alt标签

const imageAltMap = {
  // AI工具Logo的alt标签映射
  'chatgpt.png': 'ChatGPT - OpenAI开发的AI对话助手',
  'claude.png': 'Claude - Anthropic开发的长文理解AI助手',
  'midjourney.png': 'Midjourney - 高质量AI绘画工具',
  'dall-e.png': 'DALL-E - OpenAI的AI图像生成工具',
  'stable-diffusion.png': 'Stable Diffusion - 开源AI图像生成模型',
  'gemini.png': 'Google Gemini - 谷歌多模态AI助手',
  'suno.png': 'Suno - AI音乐生成工具',
  'sora.png': 'OpenAI Sora - 革命性AI视频生成模型',
  'runway.png': 'Runway - AI创意工具套件与视频生成',
  'leonardo.png': 'Leonardo - 概念设计AI绘画平台',
  'copilot.png': 'Microsoft Copilot - 微软企业级AI助手',
  'perplexity.png': 'Perplexity - 带引用的AI搜索问答工具',
  'ideogram.png': 'Ideogram - 文字标识AI生成工具',
  'adobe-firefly.png': 'Adobe Firefly - Adobe的AI创意工具',
  'playground.png': 'Playground - 多模型AI图像生成平台',
  'flux-1.png': 'Flux.1 - 高保真AI图像生成模型',
  'krea.png': 'Krea - 实时AI图像生成工具',
  'notion-ai.png': 'Notion AI - 智能文档写作助手',
  'pika.png': 'Pika - AI视频生成工具',
  'luma-dream-machine.png': 'Luma Dream Machine - 高保真AI视频生成',
  'heygen.png': 'HeyGen - 数字人视频生成工具',
  'capcut.png': 'CapCut - 集成AI功能的视频剪辑工具',
  'udio.png': 'Udio - AI音乐生成与编辑工具',
  'elevenlabs.png': 'ElevenLabs - 高拟真AI语音合成工具',
  'stable-audio.png': 'Stable Audio - 扩散模型音频生成工具',
  
  // 资讯网站Logo
  'AI NEWS.jpg': 'AI News - AI行业最新动态资讯',
  'MITiechnologyReview.jpg': 'MIT Technology Review - MIT权威科技评论',
  'TowardsDataScience.png': 'Towards Data Science - 数据科学技术文章平台',
  'Synced.jpg': 'Synced - 全球AI研究产业动态',
  'WIRED.jpg': 'WIRED AI - 科技杂志AI专栏',
  'Forbes.jpg': 'Forbes AI - 福布斯AI商业分析',
  'Algorithm.jpg': 'The Algorithm - AI领域专业时事通讯',
  'AIDaily.jpg': 'AI Daily - 每日AI新闻更新',
  'openai.png': 'OpenAI Blog - OpenAI官方研究博客',
  'deepmind.png': 'DeepMind Blog - Google DeepMind研究博客',
  'anthropic.png': 'Anthropic Blog - Claude模型更新与AI安全研究',
  'meta-ai.png': 'Meta AI Blog - Llama生态研究动态',
  'nvidia-ai.png': 'NVIDIA AI - AI计算与推理部署',
  'huggingface.png': 'Hugging Face Blog - 开源模型生态新闻',
  'paperswithcode.png': 'Papers with Code - 论文代码趋势榜单',
  'arxiv.png': 'arXiv cs.AI - AI领域预印本论文',
  'the-decoder.png': 'The Decoder - 英文AI快讯',
  'theverge.png': 'The Verge AI - 面向大众的AI新闻',
  'jiqizhixin.png': '机器之心 - 中文AI产业研究报道',
  'thepaper.png': '澎湃未来智讯 - 中文AI科普专题',
  
  // 其他工具
  'grammarly.jpg': 'Grammarly - AI写作语法检查工具',
  'CopyAI.png': 'Copy.ai - AI营销文案生成工具',
  'Writesonic.jpg': 'Writesonic - AI内容创作工具',
  'Jasper.png': 'Jasper - AI写作助手',
  'Quillbot.jpg': 'QuillBot - AI改写总结工具',
  'Sudowrite.jpg': 'Sudowrite - 作家AI创作工具',
  'INKEditor.png': 'INK Editor - SEO优化AI写作工具',
  'AIDungeon.png': 'AI Dungeon - 互动式AI故事创作',
  
  // 音频工具
  'AIVA.jpg': 'AIVA - AI音乐创作工具',
  'Descript.jpg': 'Descript - AI音频视频编辑工具',
  'Amper.png': 'Amper Music - AI音乐生成平台',
  'Soundraw.png': 'Soundraw - 可定制AI音乐生成',
  'Boomy.png': 'Boomy - 快速AI音乐生成发布',
  'LALAL.AI.png': 'LALAL.AI - AI音频分离提取工具',
  'Voicemod.jpg': 'Voicemod - 实时AI语音转换工具',
  'ResembleAI.png': 'Resemble AI - AI语音克隆生成',
  
  // 视频工具
  'Synthesia.png': 'Synthesia - AI视频内容生成',
  'Lumen5.png': 'Lumen5 - 博客转视频AI工具',
  'Pictory.png': 'Pictory - 长视频AI剪辑工具',
  'Animoto.jpg': 'Animoto - AI视频制作编辑',
  'Magisto.png': 'Magisto - AI驱动视频制作平台',
  'InVideo.jpg': 'InVideo - 在线AI视频编辑工具',
  'Veed.io.jpg': 'Veed.io - AI视频编辑字幕生成',
  'RunwayML.png': 'RunwayML - AI创意项目工具套件',
  
  // 绘画工具
  'deepart.jpg': 'DeepArt - 神经网络艺术风格转换',
  'artbreeder.jpg': 'Artbreeder - 图像混合艺术创作',
  'PaintsChainer.jpg': 'PaintsChainer - AI线稿自动上色',
  'DeepDream.png': 'DeepDream - AI梦幻风格图像生成',
  'Prisma.jpg': 'Prisma - 照片艺术风格转换',
  'StyleGAN.jpg': 'StyleGAN - 高质量合成图像生成',
  
  // 网站相关
  'AInavLogo.png': 'AINAV.ART - 全球最全AI工具导航网站Logo',
  'flag-cn.png': '中文版 - 中国国旗图标',
  'flag-us.png': 'English Version - 美国国旗图标'
};

// 使用说明
console.log('图片alt标签优化映射表已创建');
console.log('包含', Object.keys(imageAltMap).length, '个图片的SEO优化alt标签');

// 导出映射表供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = imageAltMap;
}
