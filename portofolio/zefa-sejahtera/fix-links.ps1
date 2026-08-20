$dir = "C:\Users\LUKMAN HAKIM\.gemini\antigravity\scratch\zefa-sejahtera"
$files = Get-ChildItem -Path $dir -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $content = $content -replace "Cek Otentikasi Produk", "Waspada Produk Palsu"
    $content = $content -replace "cek-otentikasi\.html", "waspada-produk-palsu.html"
    $content = $content -replace "fa-qrcode", "fa-exclamation-triangle"
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Updated: $($file.Name)"
}
Write-Host "All done!"
