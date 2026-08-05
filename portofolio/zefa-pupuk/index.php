<?php
require_once __DIR__ . '/config.php';

// ====================================================
// ROUTING: Ambil slug dari URL
// ====================================================
$slug = isset($_GET['slug']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['slug']) : '';

// Jika slug adalah 'admin', redirect ke admin panel
if ($slug === 'admin') {
    redirect(SITE_URL . '/admin/');
}

// Ambil data reseller dari database
$reseller = null;
$waNumber = DEFAULT_WA_NUMBER;
$waMessage = DEFAULT_WA_MESSAGE;
$resellerName = null;
$resellerKota = null;

if ($slug !== '') {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM resellers WHERE slug = ? AND aktif = 1");
    $stmt->execute([$slug]);
    $reseller = $stmt->fetch();

    if (!$reseller) {
        // Slug tidak ditemukan → 404
        http_response_code(404);
        include __DIR__ . '/404.php';
        exit;
    }

    $waNumber = $reseller['wa_number'];
    $waMessage = $reseller['wa_message'] ?: DEFAULT_WA_MESSAGE;
    $resellerName = $reseller['nama'];
    $resellerKota = $reseller['kota'];

    // Track klik (opsional — di sini kita increment setiap page load reseller)
    // Lebih akurat tracking di tombol WA dengan AJAX
}

$waLink = generateWALink($waNumber, $waMessage);

// ====================================================
// PRODUK DATA
// ====================================================
$products = [
    [
        'id' => 'prob10',
        'badge' => 'BEST SELLER',
        'label' => 'Probiotik Ternak',
        'name' => 'PRO-B10',
        'subtitle' => 'Probiotik dengan Herbal',
        'tagline' => 'Probiotik Multifungsi untuk Mendukung Pertumbuhan dan Produktivitas Ternak Secara Optimal.',
        'image' => 'assets/images/prob10.jpg',
        'reg' => 'KEMENTAN RI No. D.2504797 PTS',
        'targets' => ['Ayam', 'Sapi', 'Kambing', 'Ikan'],
        'benefits' => [
            ['icon' => '⚙️', 'text' => '<strong>Mineral</strong> — Membantu sistem metabolisme tubuh ternak'],
            ['icon' => '🛡️', 'text' => '<strong>Vitamin</strong> — Mendukung sistem kekebalan tubuh'],
            ['icon' => '🌱', 'text' => '<strong>Asam Amino</strong> — Membantu pertumbuhan ternak secara maksimal'],
            ['icon' => '🫧', 'text' => '<strong>Pencernaan Lebih Baik</strong> — Membantu penguraian bahan pakan'],
            ['icon' => '📈', 'text' => '<strong>Efisiensi Pakan</strong> — Meningkatkan TDN & menurunkan FCR'],
            ['icon' => '🥚', 'text' => '<strong>Produktivitas Unggul</strong> — Kuning telur lebih orange, cangkang lebih kuat'],
        ],
        'formula' => 'Probiotik + Herbal + Mineral + Vitamin + Asam Amino',
        'berat' => '1 kg / 20 gram',
    ],
    [
        'id' => 'pepetani',
        'badge' => 'TERLARIS',
        'label' => 'Pupuk Tanaman Keras',
        'name' => 'PEPETANI ZEFA',
        'subtitle' => '+SLOW RELEASE',
        'tagline' => 'Pupuk hayati granul berkualitas tinggi dengan teknologi slow release, cocok untuk tanaman keras seperti sawit, karet, kakao, durian, mangga, dan kelapa.',
        'image' => 'assets/images/pepetani.jpg',
        'reg' => 'No. Pendaftaran: 02.03.2025.370',
        'targets' => ['Sawit', 'Karet', 'Kakao', 'Durian', 'Mangga'],
        'benefits' => [
            ['icon' => '🌾', 'text' => '<strong>Meningkatkan hasil panen</strong> secara signifikan'],
            ['icon' => '🌿', 'text' => '<strong>Memacu pertumbuhan tanaman</strong> lebih cepat'],
            ['icon' => '🛡️', 'text' => '<strong>Ketahanan terhadap penyakit</strong> lebih kuat'],
            ['icon' => '🌍', 'text' => '<strong>Memperbaiki kualitas tanah</strong> secara berkelanjutan'],
            ['icon' => '💰', 'text' => '<strong>Mengurangi biaya pupuk kimia</strong> hingga signifikan'],
        ],
        'formula' => '5% Slow Release · 4% Trichor-TM · 4% PGPR · 1% Herbal',
        'dosis' => '100–150 gr per pohon (2–3 cup full)',
        'berat' => '1 kg',
    ],
    [
        'id' => 'prazak',
        'badge' => 'UNGGULAN',
        'label' => 'Pupuk Hayati Cair',
        'name' => 'PRAZAK',
        'subtitle' => '+NUTRISI',
        'tagline' => 'Pupuk hayati lengkap dengan sumber organik dan mineral esensial untuk meningkatkan kesuburan tanaman, hasil panen, dan ketahanan terhadap serangan penyakit.',
        'image' => 'assets/images/prazak.jpg',
        'reg' => 'No. Pendaftaran: 03.02.2022.1020',
        'targets' => ['Padi', 'Cabai', 'Sayuran', 'Buah-buahan', 'Semua Tanaman'],
        'benefits' => [
            ['icon' => '🦠', 'text' => '<strong>Kaya mikroba pengurai</strong> Azotobacter, Azospirillum, Bacillus subtilis'],
            ['icon' => '🌍', 'text' => '<strong>C-organik</strong> — Memperbaiki struktur tanah'],
            ['icon' => '⚗️', 'text' => '<strong>Makro mineral N, P, K, Mg</strong> + mikro Fe, Mn, B, Zn'],
            ['icon' => '💸', 'text' => '<strong>Hemat pupuk kimia</strong> hingga 25–50%'],
            ['icon' => '🌱', 'text' => '<strong>Tanaman lebih segar</strong> dan bebas hama'],
        ],
        'formula' => 'Nutrisi A (C-organik) + Nutrisi B (N+P+K, Mg, Fe, Mn, Cu, B, Mo)',
        'aplikasi' => 'Semprot pagi hari jam 07.00–11.00 saat stomata membuka',
        'berat' => 'Set Nutrisi A + B',
    ],
];

$pageTitle = $reseller ? "Agen {$resellerName} | Zefa Mulia Sejahtera" : "Zefa Mulia Sejahtera | Pupuk & Probiotik Terbaik Indonesia";
$pageDesc = "Solusi pertanian dan peternakan terlengkap. Produk pupuk hayati PRO-B10, PEPETANI ZEFA, dan PRAZAK untuk hasil panen maksimal.";
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= sanitize($pageTitle) ?></title>
    <meta name="description" content="<?= sanitize($pageDesc) ?>">
    <meta name="robots" content="<?= $reseller ? 'noindex' : 'index, follow' ?>">
    <meta property="og:title" content="<?= sanitize($pageTitle) ?>">
    <meta property="og:description" content="<?= sanitize($pageDesc) ?>">
    <meta property="og:type" content="website">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<!-- ====================================================
     NAVBAR
     ==================================================== -->
<nav class="navbar" id="navbar">
    <div class="container">
        <div class="nav-inner">
            <div class="nav-logo">
                <div class="nav-logo-text">
                    <span class="brand">ZEFA MULIA SEJAHTERA</span>
                    <span class="tagline">Solusi Pertanian & Peternakan Terbaik</span>
                </div>
            </div>
            <div class="nav-links">
                <a href="#produk">Produk</a>
                <a href="#keunggulan">Keunggulan</a>
                <a href="#testimoni">Testimoni</a>
                <a href="<?= $waLink ?>" target="_blank" class="nav-wa-btn" id="nav-wa-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Hubungi Kami
                </a>
            </div>
        </div>
    </div>
</nav>

<!-- ====================================================
     RESELLER BANNER (only if reseller page)
     ==================================================== -->
<?php if ($reseller): ?>
<div style="position:fixed;top:73px;left:0;right:0;z-index:999;padding:12px 24px;">
    <div class="container">
        <div class="reseller-info">
            <div class="reseller-avatar"><?= strtoupper(substr($resellerName, 0, 1)) ?></div>
            <div class="reseller-text">
                <div class="title">Agen Resmi Zefa Mulia Sejahtera</div>
                <div class="name">Melayani Anda: <?= sanitize($resellerName) ?></div>
                <?php if ($resellerKota): ?>
                <div class="location">📍 <?= sanitize($resellerKota) ?></div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>

<!-- ====================================================
     HERO SECTION
     ==================================================== -->
<section class="hero" id="hero" style="<?= $reseller ? 'padding-top:200px;' : '' ?>">
    <div class="hero-bg"></div>
    <div class="hero-particles"></div>
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <div class="hero-badge">
                    <span class="dot"></span>
                    Produk Bersertifikat Kementan RI
                </div>
                <h1 class="hero-title">
                    Tingkatkan Hasil Panen &
                    <span class="gradient-text"> Produktivitas Ternak</span>
                    Anda Secara Optimal
                </h1>
                <p class="hero-subtitle">
                    <?php if ($reseller): ?>
                    Dapatkan produk pupuk & probiotik premium Zefa Mulia Sejahtera langsung dari <strong style="color:#4ade80;"><?= sanitize($resellerName) ?></strong> — agen resmi terpercaya<?= $resellerKota ? " di area " . sanitize($resellerKota) : "" ?>.
                    <?php else: ?>
                    Zefa Mulia Sejahtera hadir dengan solusi pertanian dan peternakan terlengkap. Produk hayati bersertifikat Kementan untuk hasil maksimal, bebas kimia berbahaya.
                    <?php endif; ?>
                </p>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <span class="number">3+</span>
                        <span class="label">Produk Unggulan</span>
                    </div>
                    <div class="hero-stat-divider"></div>
                    <div class="hero-stat">
                        <span class="number">500+</span>
                        <span class="label">Petani Puas</span>
                    </div>
                    <div class="hero-stat-divider"></div>
                    <div class="hero-stat">
                        <span class="number">100%</span>
                        <span class="label">Hayati Alami</span>
                    </div>
                </div>
                <div class="hero-cta">
                    <a href="<?= $waLink ?>" target="_blank" class="btn btn-wa pulse-animation" id="hero-wa-btn" onclick="trackClick('hero')">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        <?= $reseller ? 'Order ke ' . sanitize($resellerName) : 'Konsultasi Gratis via WhatsApp' ?>
                    </a>
                    <a href="#produk" class="btn btn-outline">Lihat Produk</a>
                </div>
            </div>
            <div class="hero-image-container">
                <div class="hero-floating-badge">
                    ✓ Bersertifikat<br>Kementan RI
                </div>
                <div class="hero-image-grid">
                    <div class="hero-image-main">
                        <img src="assets/images/pepetani.jpg" alt="PEPETANI ZEFA Pupuk Slow Release" loading="eager">
                    </div>
                    <div class="hero-image-thumb">
                        <img src="assets/images/prob10.jpg" alt="PRO-B10 Probiotik Herbal" loading="lazy">
                    </div>
                    <div class="hero-image-thumb">
                        <img src="assets/images/prazak.jpg" alt="PRAZAK Nutrisi Tanaman" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ====================================================
     PRODUCTS SECTION
     ==================================================== -->
<section class="products" id="produk">
    <div class="container">
        <div class="section-header animate-on-scroll">
            <span class="section-tag">🌿 Produk Unggulan</span>
            <h2 class="section-title">
                3 Solusi Lengkap untuk
                <span class="gradient-text"> Pertanian & Peternakan</span>
            </h2>
            <p class="section-desc">Setiap produk diformulasikan khusus oleh ahli bioteknologi dengan standar Kementan RI untuk hasil yang terukur dan terbukti.</p>
        </div>

        <div class="products-grid">
            <?php foreach ($products as $p): ?>
            <div class="product-card animate-on-scroll">
                <div class="product-image-wrapper">
                    <img src="<?= $p['image'] ?>" alt="<?= sanitize($p['name']) ?> <?= sanitize($p['subtitle']) ?>" loading="lazy">
                    <span class="product-badge"><?= $p['badge'] ?></span>
                </div>
                <div class="product-body">
                    <div class="product-label"><?= sanitize($p['label']) ?></div>
                    <h3 class="product-name"><?= sanitize($p['name']) ?> <span class="gold-text"><?= sanitize($p['subtitle']) ?></span></h3>
                    <p class="product-tagline"><?= sanitize($p['tagline']) ?></p>

                    <div class="product-benefits">
                        <?php foreach ($p['benefits'] as $b): ?>
                        <div class="product-benefit">
                            <span class="benefit-icon"><?= $b['icon'] ?></span>
                            <span><?= $b['text'] ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="product-targets">
                        <?php foreach ($p['targets'] as $t): ?>
                        <span class="product-target-tag">✓ <?= sanitize($t) ?></span>
                        <?php endforeach; ?>
                    </div>

                    <div class="product-footer">
                        <div class="product-reg">📋 <?= sanitize($p['reg']) ?></div>
                        <a href="<?= $waLink ?>&text=<?= urlencode("Halo, saya tertarik dengan produk " . $p['name'] . " " . $p['subtitle'] . ". Boleh minta info harga dan cara pemesanan?") ?>"
                           target="_blank"
                           class="product-cta"
                           id="cta-<?= $p['id'] ?>"
                           onclick="trackClick('<?= $p['id'] ?>')">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            Pesan Sekarang
                        </a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ====================================================
     WHY US SECTION
     ==================================================== -->
<section class="why-us" id="keunggulan">
    <div class="container">
        <div class="section-header animate-on-scroll">
            <span class="section-tag">💎 Keunggulan Kami</span>
            <h2 class="section-title">Mengapa Memilih <span class="gradient-text">Zefa Mulia Sejahtera?</span></h2>
            <p class="section-desc">Kepercayaan ratusan petani dan peternak di seluruh Indonesia menjadi bukti nyata kualitas produk kami.</p>
        </div>
        <div class="features-grid">
            <div class="feature-card animate-on-scroll">
                <div class="feature-icon">🏆</div>
                <h3 class="feature-title">Bersertifikat Resmi</h3>
                <p class="feature-desc">Semua produk sudah terdaftar dan mendapat izin resmi dari Kementerian Pertanian RI. Aman dan legal.</p>
            </div>
            <div class="feature-card animate-on-scroll">
                <div class="feature-icon">🔬</div>
                <h3 class="feature-title">Teknologi Bioteknologi</h3>
                <p class="feature-desc">Diformulasikan oleh CV. Pradipta Paramita Biotechnology Industry menggunakan teknologi modern terkini.</p>
            </div>
            <div class="feature-card animate-on-scroll">
                <div class="feature-icon">🌿</div>
                <h3 class="feature-title">100% Hayati Alami</h3>
                <p class="feature-desc">Bebas bahan kimia berbahaya. Aman untuk tanah, tanaman, hewan, dan lingkungan sekitar Anda.</p>
            </div>
            <div class="feature-card animate-on-scroll">
                <div class="feature-icon">📦</div>
                <h3 class="feature-title">Pengiriman ke Seluruh Indonesia</h3>
                <p class="feature-desc">Jaringan distribusi luas dari Sabang sampai Merauke. Pengiriman cepat dan aman ke rumah Anda.</p>
            </div>
            <div class="feature-card animate-on-scroll">
                <div class="feature-icon">💬</div>
                <h3 class="feature-title">Konsultasi Gratis</h3>
                <p class="feature-desc">Tim ahli pertanian kami siap membantu Anda menentukan produk yang tepat sesuai kebutuhan lahan.</p>
            </div>
            <div class="feature-card animate-on-scroll">
                <div class="feature-icon">💰</div>
                <h3 class="feature-title">Harga Terjangkau</h3>
                <p class="feature-desc">Kualitas premium dengan harga yang sangat terjangkau. Tersedia program reseller untuk penghasilan tambahan.</p>
            </div>
        </div>
    </div>
</section>

<!-- ====================================================
     TESTIMONIALS
     ==================================================== -->
<section class="testimonials" id="testimoni">
    <div class="container">
        <div class="section-header animate-on-scroll">
            <span class="section-tag">⭐ Testimoni</span>
            <h2 class="section-title">Kata Mereka yang Sudah <span class="gradient-text">Merasakan Manfaatnya</span></h2>
        </div>
        <div class="testimonials-grid">
            <div class="testimonial-card animate-on-scroll">
                <div class="testimonial-stars">★★★★★</div>
                <p class="testimonial-text">"Setelah pakai PEPETANI ZEFA, hasil panen durian saya naik hampir 40%! Tanaman lebih sehat, buah lebih besar dan manis. Luar biasa produknya!"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">S</div>
                    <div>
                        <div class="testimonial-name">Pak Samsul</div>
                        <div class="testimonial-location">📍 Petani Durian, Lampung</div>
                    </div>
                </div>
            </div>
            <div class="testimonial-card animate-on-scroll">
                <div class="testimonial-stars">★★★★★</div>
                <p class="testimonial-text">"PRO-B10 benar-benar mengubah usaha ternak ayam saya. FCR turun drastis, ayam lebih sehat, dan produksi telur meningkat. Sangat rekomen!"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">R</div>
                    <div>
                        <div class="testimonial-name">Bu Ratna</div>
                        <div class="testimonial-location">📍 Peternak Ayam, Jawa Tengah</div>
                    </div>
                </div>
            </div>
            <div class="testimonial-card animate-on-scroll">
                <div class="testimonial-stars">★★★★★</div>
                <p class="testimonial-text">"PRAZAK +NUTRISI saya semprotkan ke tanaman cabai. Hasilnya tanaman tumbuh subur, lebih tahan penyakit, dan panen bisa 2x lebih banyak dari biasanya!"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">H</div>
                    <div>
                        <div class="testimonial-name">Pak Hadi</div>
                        <div class="testimonial-location">📍 Petani Cabai, Jawa Timur</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ====================================================
     FINAL CTA
     ==================================================== -->
<section class="cta-section">
    <div class="container">
        <div class="cta-box animate-on-scroll">
            <span class="section-tag">🚀 Mulai Sekarang</span>
            <h2 class="cta-title">Siap Tingkatkan Hasil Panen &<br><span class="gradient-text">Produktivitas Ternak Anda?</span></h2>
            <p class="cta-desc">Konsultasikan kebutuhan pertanian & peternakan Anda sekarang. Gratis! Tim ahli kami siap membantu 24 jam.</p>
            <div class="cta-buttons">
                <a href="<?= $waLink ?>" target="_blank" class="btn btn-wa" id="cta-wa-btn" onclick="trackClick('cta_section')" style="font-size:1.15rem; padding:20px 40px;">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    <?= $reseller ? 'Chat dengan ' . sanitize($resellerName) . ' Sekarang!' : 'Chat WhatsApp Sekarang — GRATIS!' ?>
                </a>
            </div>
            <?php if ($reseller): ?>
            <p style="margin-top:16px;font-size:0.85rem;color:var(--text-secondary);opacity:0.7;">
                Anda akan terhubung langsung dengan agen resmi kami: <strong style="color:#4ade80;"><?= sanitize($resellerName) ?></strong>
            </p>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- ====================================================
     FOOTER
     ==================================================== -->
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-brand">
                <div class="logo-text">🌿 ZEFA MULIA SEJAHTERA</div>
                <p>Bersama Zefa, Tumbuh Lebih dari Sekadar Bisnis. Perusahaan direct selling berbasis produk pertanian & peternakan berkualitas tinggi.</p>
                <div class="footer-socials">
                    <a href="https://instagram.com/zefaaofficial" target="_blank" class="social-link" title="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="https://facebook.com/ZefaMulia" target="_blank" class="social-link" title="Facebook">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="<?= $waLink ?>" target="_blank" class="social-link" title="WhatsApp">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </a>
                </div>
            </div>
            <div>
                <div class="footer-heading">Produk</div>
                <div class="footer-links">
                    <a href="#produk">PRO-B10 Probiotik Herbal</a>
                    <a href="#produk">PEPETANI ZEFA +Slow Release</a>
                    <a href="#produk">PRAZAK +Nutrisi</a>
                </div>
            </div>
            <div>
                <div class="footer-heading">Kontak</div>
                <div class="footer-links">
                    <a href="<?= $waLink ?>" target="_blank">💬 WhatsApp</a>
                    <a href="https://instagram.com/zefaaofficial" target="_blank">📸 @zefaaofficial</a>
                    <a href="https://zefasejahtera.com" target="_blank">🌐 zefasejahtera.com</a>
                    <a href="https://facebook.com/ZefaMulia" target="_blank">👥 Zefa Mulia</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© <?= date('Y') ?> PT. Zefa Mulia Sejahtera. Diproduksi oleh CV. Pradipta Paramita Biotechnology Industry, Karanganyar – Jawa Tengah.</p>
            <p style="font-size:0.8rem;opacity:0.5;">Produk bersertifikat Kementan RI</p>
        </div>
    </div>
</footer>

<!-- ====================================================
     FLOATING WA BUTTON
     ==================================================== -->
<a href="<?= $waLink ?>" target="_blank" class="floating-wa" id="floating-wa" onclick="trackClick('floating')">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    <span>Hubungi Kami</span>
</a>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer"></div>

<!-- ====================================================
     JAVASCRIPT
     ==================================================== -->
<script>
// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Animate on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('animated'), i * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Track CTA clicks (kirim ke server untuk analytics)
function trackClick(source) {
    const slug = '<?= $slug ?>';
    if (slug) {
        fetch('api/track.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: slug, source: source })
        }).catch(() => {}); // Silent fail
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
</script>

</body>
</html>
