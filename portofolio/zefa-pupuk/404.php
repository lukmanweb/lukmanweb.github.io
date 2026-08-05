<?php
require_once __DIR__ . '/config.php';
$pageTitle = "Halaman Tidak Ditemukan — Zefa Mulia Sejahtera";
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <meta name="robots" content="noindex">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at center, rgba(34,197,94,0.04) 0%, var(--dark-900) 70%);">
    <div style="text-align:center;padding:40px;">
        <div style="font-size:5rem;margin-bottom:20px;">🌱</div>
        <h1 style="font-family:'Outfit',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:900;margin-bottom:12px;">
            <span class="gradient-text">404</span>
        </h1>
        <p style="font-size:1.2rem;font-weight:700;margin-bottom:12px;">Halaman tidak ditemukan</p>
        <p style="color:var(--text-secondary);margin-bottom:32px;max-width:400px;line-height:1.7;">
            URL reseller yang Anda akses tidak terdaftar atau sudah tidak aktif.
        </p>
        <a href="<?= SITE_URL ?>/" class="btn btn-primary">← Kembali ke Halaman Utama</a>
    </div>
</div>
</body>
</html>
