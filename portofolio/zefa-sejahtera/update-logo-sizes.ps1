$dir = "C:\Users\LUKMAN HAKIM\.gemini\antigravity\scratch\zefa-sejahtera"
$files = Get-ChildItem -Path $dir -Filter "*.html"

$headerOld = 'style="height: 48px; width: auto;"'
$headerNew = 'style="height: 64px; width: auto; transition: transform 0.3s ease;"'

$footerOld = '<div class="footer-logo">
                <span class="logo-title text-gradient-gold">ZEFA</span>
                <span class="logo-sub">MULIA SEJAHTERA</span>
            </div>'

$footerNew = '<div class="footer-logo" style="display: flex; align-items: center; gap: 14px;">
                <img src="images/logo.png" alt="Zefa Logo" style="height: 64px; width: auto; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">
                <div>
                    <span class="logo-title text-gradient-gold" style="font-size: 2.1rem; display: block; line-height: 1;">ZEFA</span>
                    <span class="logo-sub" style="font-size: 0.9rem; font-weight: 700; letter-spacing: 2px;">MULIA SEJAHTERA</span>
                </div>
            </div>'

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Update header logo size
    $content = $content -replace [regex]::Escape($headerOld), $headerNew
    
    # Update footer logo
    $content = $content -replace '(?s)<div class="footer-logo">.*?</div>', $footerNew.Trim()
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Updated logos in: $($file.Name)"
}

Write-Host "All logo sizes updated!"
