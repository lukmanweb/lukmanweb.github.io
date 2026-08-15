$footerNew = @'
<footer class="footer-wrapper text-white">
    <div class="container footer-container">
        <div class="footer-col footer-info">
            <div class="footer-logo">
                <span class="logo-title text-gradient-gold">ZEFA</span>
                <span class="logo-sub">MULIA SEJAHTERA</span>
            </div>
            <p class="footer-desc-p">Menghadirkan produk premium penunjang gaya hidup sehat, kecantikan terawat, serta pertanian modern organik demi keberlimpahan hidup bersama.</p>
            <div class="footer-socials">
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
                <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
        </div>

        <div class="footer-col">
            <h4>Menu Navigasi</h4>
            <ul class="footer-links">
                <li><a href="index.html">Beranda</a></li>
                <li><a href="tentang-perusahaan.html">Tentang Kami</a></li>
                <li><a href="legalitas.html">Legalitas</a></li>
                <li><a href="kode-etik.html">Kode Etik</a></li>
                <li><a href="katalog-produk.html">Produk Kami</a></li>
                <li><a href="index.html#faq">FAQs</a></li>
            </ul>
        </div>

        <div class="footer-col">
            <h4>Kontak Kami</h4>
            <ul class="footer-contacts">
                <li>
                    <i class="fa fa-phone text-gold"></i>
                    <div>
                        <strong>Admin Kantor:</strong>
                        <span>+62 857-2728-9279</span>
                    </div>
                </li>
                <li>
                    <i class="fa fa-envelope text-gold"></i>
                    <div>
                        <strong>Email Resmi:</strong>
                        <span>zefamuliasejahtera@gmail.com</span>
                    </div>
                </li>
                <li>
                    <i class="fa fa-clock text-gold"></i>
                    <div>
                        <strong>Jam Operasional:</strong>
                        <span>Senin - Jumat 08.30 - 16.30 WIB<br>Sabtu 08.30 - 13.00 WIB</span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="footer-col">
            <h4>Kantor Pusat</h4>
            <ul class="footer-contacts">
                <li>
                    <i class="fa fa-map-location-dot text-gold"></i>
                    <div>
                        <strong>Alamat Perusahaan:</strong>
                        <span>Jl. Salatiga - Solo KM 10, Kec. Tengaran, Kab. Semarang, Jawa Tengah, Indonesia 50775</span>
                    </div>
                </li>
            </ul>
            <div class="footer-map-link">
                <a href="https://maps.google.com" target="_blank" class="btn btn-outline-light btn-sm font-xs mt-2">
                    <i class="fa fa-location-arrow"></i> Petunjuk Arah Google Maps
                </a>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="container footer-bottom-container">
            <p>&copy; 2026 PT Zefa Mulia Sejahtera. All Rights Reserved. <span class="font-xs text-muted">Direct Selling Licensed.</span></p>
            <p class="font-xs"><a href="#">Syarat &amp; Ketentuan</a> | <a href="#">Kebijakan Privasi</a></p>
        </div>
    </div>
</footer>
'@

$subPages = @(
    "tentang-perusahaan.html",
    "visi-misi.html",
    "legalitas.html",
    "kode-etik.html",
    "katalog-produk.html",
    "marketing-plan.html",
    "waspada-produk-palsu.html"
)

$dir = "C:\Users\LUKMAN HAKIM\.gemini\antigravity\scratch\zefa-sejahtera"

foreach ($page in $subPages) {
    $path = Join-Path $dir $page
    $content = Get-Content $path -Raw -Encoding UTF8

    # Remove old footer (from <footer to </footer>)
    $content = $content -replace '(?s)<footer[^>]*>.*?</footer>', $footerNew.Trim()

    Set-Content $path -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Updated footer: $page"
}

Write-Host "`nAll footers updated!"
