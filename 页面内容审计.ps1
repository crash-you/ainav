# ========================================
# AINAV.ART - 页面内容质量审计工具
# ========================================
# 功能: 统计所有详情页的字数，识别需要扩充的页面
# 作者: AI助手
# 日期: 2025-10-02
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AINAV.ART 页面内容质量审计工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 统计变量
$highQuality = @()      # 高质量 (>=2000字)
$mediumQuality = @()    # 中等质量 (1000-1999字)
$lowQuality = @()       # 低质量 (<1000字)
$totalWords = 0

Write-Host "🔍 开始分析中文详情页..." -ForegroundColor Yellow
Write-Host ""

# 分析 cn/detail/ 目录下的所有 HTML 文件
Get-ChildItem -Path "cn\detail" -Filter "*.html" | ForEach-Object {
    $filePath = $_.FullName
    $fileName = $_.Name
    
    # 读取文件内容
    $content = Get-Content $filePath -Raw -Encoding UTF8
    
    # 移除HTML标签和脚本
    $textContent = $content -replace '<script[^>]*>.*?</script>', '' -replace '<style[^>]*>.*?</style>', '' -replace '<[^>]+>', ' ' -replace '\s+', ' '
    
    # 计算字数（中文字符 + 英文单词）
    $chineseChars = ([regex]::Matches($textContent, '[\u4e00-\u9fa5]')).Count
    $englishWords = ([regex]::Matches($textContent, '\b[a-zA-Z]+\b')).Count
    $wordCount = $chineseChars + [Math]::Floor($englishWords / 5)  # 英文单词约等于1/5中文字符
    
    $totalWords += $wordCount
    
    # 分类
    $pageInfo = @{
        Name = $fileName
        Words = $wordCount
        Path = $filePath
    }
    
    if ($wordCount -ge 2000) {
        $highQuality += $pageInfo
    } elseif ($wordCount -ge 1000) {
        $mediumQuality += $pageInfo
    } else {
        $lowQuality += $pageInfo
    }
}

# 显示统计结果
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📊 统计结果" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "总页面数量: $($highQuality.Count + $mediumQuality.Count + $lowQuality.Count)" -ForegroundColor White
Write-Host "总字数: $totalWords" -ForegroundColor White
Write-Host "平均字数: $([Math]::Floor($totalWords / ($highQuality.Count + $mediumQuality.Count + $lowQuality.Count)))" -ForegroundColor White
Write-Host ""

Write-Host "✅ 高质量页面 (≥2000字): $($highQuality.Count) 个" -ForegroundColor Green
Write-Host "⚠️  中等质量页面 (1000-1999字): $($mediumQuality.Count) 个" -ForegroundColor Yellow
Write-Host "❌ 低质量页面 (<1000字): $($lowQuality.Count) 个" -ForegroundColor Red
Write-Host ""

# 显示高质量页面（参考示例）
if ($highQuality.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ 高质量页面 (可作为参考)" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $highQuality | Sort-Object -Property Words -Descending | ForEach-Object {
        Write-Host "  $($_.Name.PadRight(40)) $($_.Words) 字" -ForegroundColor Green
    }
    Write-Host ""
}

# 显示中等质量页面
if ($mediumQuality.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  ⚠️  中等质量页面 (建议扩充到2000字)" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    $mediumQuality | Sort-Object -Property Words -Descending | ForEach-Object {
        Write-Host "  $($_.Name.PadRight(40)) $($_.Words) 字" -ForegroundColor Yellow
    }
    Write-Host ""
}

# 显示低质量页面（优先处理）
if ($lowQuality.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ 低质量页面 (必须优先扩充)" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    
    $lowQuality | Sort-Object -Property Words | ForEach-Object {
        Write-Host "  $($_.Name.PadRight(40)) $($_.Words) 字" -ForegroundColor Red
    }
    Write-Host ""
}

# 生成建议
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  💡 改进建议" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$needWork = $mediumQuality.Count + $lowQuality.Count
$completionRate = [Math]::Round(($highQuality.Count / ($highQuality.Count + $mediumQuality.Count + $lowQuality.Count)) * 100, 1)

Write-Host "当前完成度: $completionRate%" -ForegroundColor White
Write-Host "需要扩充的页面: $needWork 个" -ForegroundColor Yellow
Write-Host ""

if ($lowQuality.Count -gt 0) {
    Write-Host "🔴 第一优先级: 扩充 $($lowQuality.Count) 个低质量页面" -ForegroundColor Red
    Write-Host "   目标: 每页至少1800-2000字" -ForegroundColor White
    Write-Host "   预计时间: $([Math]::Ceiling($lowQuality.Count * 3)) 小时 (每页3小时)" -ForegroundColor White
    Write-Host ""
}

if ($mediumQuality.Count -gt 0) {
    Write-Host "🟡 第二优先级: 优化 $($mediumQuality.Count) 个中等质量页面" -ForegroundColor Yellow
    Write-Host "   目标: 每页达到2000字+" -ForegroundColor White
    Write-Host "   预计时间: $([Math]::Ceiling($mediumQuality.Count * 2)) 小时 (每页2小时)" -ForegroundColor White
    Write-Host ""
}

$totalHours = ($lowQuality.Count * 3) + ($mediumQuality.Count * 2)
$daysNeeded = [Math]::Ceiling($totalHours / 9)  # 每天9小时工作

Write-Host "📅 总预计工作时间: $totalHours 小时 (约 $daysNeeded 个工作日)" -ForegroundColor White
Write-Host ""

# 生成优先处理清单
if ($lowQuality.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  📝 优先处理清单 (TOP 20)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "建议按以下顺序处理（根据工具重要性）：" -ForegroundColor Yellow
    Write-Host ""
    
    # 热门工具列表（优先处理）
    $hotTools = @(
        "chatgpt.html", "claude.html", "gemini.html", "midjourney.html", "dall-e.html",
        "stable-diffusion.html", "suno.html", "runway.html", "pika.html", "perplexity.html",
        "kimi.html", "microsoft-copilot.html", "notion-ai.html", "leonardo.html", 
        "flux-1.html", "elevenlabs.html", "heygen.html", "synthesia.html",
        "luma-dream-machine.html", "udio.html"
    )
    
    $priority = 1
    foreach ($tool in $hotTools) {
        $page = $lowQuality | Where-Object { $_.Name -eq $tool } | Select-Object -First 1
        if ($page) {
            Write-Host "  $priority. $($page.Name.PadRight(40)) 当前: $($page.Words) 字" -ForegroundColor White
            $priority++
        }
    }
    
    Write-Host ""
}

# Google Ads 审核评估
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎯 Google Ads 审核评估" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($completionRate -ge 80) {
    Write-Host "✅ 内容质量: 优秀 ($completionRate%)" -ForegroundColor Green
    Write-Host "   Google Ads 通过概率: 90%+" -ForegroundColor Green
    Write-Host "   建议: 可以准备提交审核" -ForegroundColor Green
} elseif ($completionRate -ge 60) {
    Write-Host "⚠️  内容质量: 良好 ($completionRate%)" -ForegroundColor Yellow
    Write-Host "   Google Ads 通过概率: 60-70%" -ForegroundColor Yellow
    Write-Host "   建议: 再扩充10-15个页面后提交" -ForegroundColor Yellow
} elseif ($completionRate -ge 40) {
    Write-Host "⚠️  内容质量: 一般 ($completionRate%)" -ForegroundColor Yellow
    Write-Host "   Google Ads 通过概率: 30-40%" -ForegroundColor Yellow
    Write-Host "   建议: 至少再扩充20-30个页面" -ForegroundColor Yellow
} else {
    Write-Host "❌ 内容质量: 不足 ($completionRate%)" -ForegroundColor Red
    Write-Host "   Google Ads 通过概率: <20%" -ForegroundColor Red
    Write-Host "   建议: 必须大幅扩充内容，建议2-3周后再提交" -ForegroundColor Red
}

Write-Host ""

# 导出详细报告
Write-Host "是否导出详细报告到CSV文件? (Y/N)" -ForegroundColor Cyan
$export = Read-Host

if ($export -eq 'Y' -or $export -eq 'y') {
    $allPages = @()
    $allPages += $highQuality | ForEach-Object { 
        [PSCustomObject]@{
            页面名称 = $_.Name
            字数 = $_.Words
            质量等级 = "高质量"
            优先级 = "无需处理"
        }
    }
    $allPages += $mediumQuality | ForEach-Object { 
        [PSCustomObject]@{
            页面名称 = $_.Name
            字数 = $_.Words
            质量等级 = "中等"
            优先级 = "第二批处理"
        }
    }
    $allPages += $lowQuality | ForEach-Object { 
        [PSCustomObject]@{
            页面名称 = $_.Name
            字数 = $_.Words
            质量等级 = "低质量"
            优先级 = "优先处理"
        }
    }
    
    $reportPath = "页面内容审计报告_$(Get-Date -Format 'yyyyMMdd_HHmmss').csv"
    $allPages | Sort-Object -Property 字数 | Export-Csv -Path $reportPath -NoTypeInformation -Encoding UTF8
    
    Write-Host ""
    Write-Host "✅ 报告已导出到: $reportPath" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 提示: 参考 '内容扩充模板.md' 进行页面扩充" -ForegroundColor Yellow
Write-Host "💡 提示: 参考 'chatgpt.html' 和 'midjourney.html' 作为示例" -ForegroundColor Yellow
Write-Host ""

# 暂停
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

