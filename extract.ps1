$pdf = 'C:\Users\LUKMAN HAKIM\.gemini\antigravity\brain\45e0e41e-d7ed-45de-9078-f91ae237af9e\.user_uploaded\media_1786007886478.pdf'
$out = 'C:\Users\LUKMAN HAKIM\.gemini\antigravity\scratch\lukmanhakim-jasaweb\portofolio\images\fredy-team'

if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out -Force }

$b = [System.IO.File]::ReadAllBytes($pdf)
$len = $b.Length
$count = 0

for ($i = 0; $i -lt ($len - 10); $i++) {
    if ($b[$i] -eq 255 -and $b[$i+1] -eq 216 -and $b[$i+2] -eq 255) {
        for ($j = $i + 2; $j -lt ($len - 1); $j++) {
            if ($b[$j] -eq 255 -and $b[$j+1] -eq 217) {
                $imgLen = $j - $i + 2
                if ($imgLen -gt 15000) {
                    $count++
                    $imgBytes = New-Object byte[] $imgLen
                    [Array]::Copy($b, $i, $imgBytes, 0, $imgLen)
                    $targetPath = Join-Path $out ("team_" + $count + ".jpg")
                    [System.IO.File]::WriteAllBytes($targetPath, $imgBytes)
                    Write-Host ("Extracted image " + $count + " : " + $imgLen + " bytes")
                }
                break
            }
        }
    }
}
Write-Host ("Done. Extracted " + $count + " team photos.")
