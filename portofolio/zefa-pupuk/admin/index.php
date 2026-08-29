<?php
require_once __DIR__ . '/../config.php';
session_start();
requireAdmin();

$db = getDB();
$message = '';
$messageType = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add_reseller') {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '', trim($_POST['slug'] ?? '')));
        $nama = trim($_POST['nama'] ?? '');
        $wa = formatWA(trim($_POST['wa_number'] ?? ''));
        $wa_msg = trim($_POST['wa_message'] ?? '') ?: DEFAULT_WA_MESSAGE;
        $kota = trim($_POST['kota'] ?? '');
        $aktif = isset($_POST['aktif']) ? 1 : 0;

        if (!$slug || !$nama || !$wa) {
            $message = 'Slug URL, nama, dan nomor WhatsApp wajib diisi!';
            $messageType = 'error';
        } elseif (in_array($slug, ['admin', 'assets', 'api', 'index', '404'])) {
            $message = "Slug '{$slug}' tidak boleh digunakan karena konflik dengan sistem.";
            $messageType = 'error';
        } else {
            try {
                $stmt = $db->prepare("INSERT INTO resellers (slug, nama, wa_number, wa_message, kota, aktif) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$slug, $nama, $wa, $wa_msg, $kota, $aktif]);
                $message = "Reseller <strong>{$nama}</strong> berhasil ditambahkan! Link: <a href='".SITE_URL."/{$slug}' target='_blank' style='color:#4ade80;'>".SITE_URL."/{$slug}</a>";
                $messageType = 'success';

                $db->prepare("INSERT INTO admin_logs (action, detail, ip_address) VALUES (?, ?, ?)")
                   ->execute(['ADD_RESELLER', "Tambah reseller: {$nama} ({$slug})", $_SERVER['REMOTE_ADDR'] ?? '']);
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) {
                    $message = "Slug '<strong>{$slug}</strong>' sudah digunakan. Gunakan slug lain.";
                } else {
                    $message = 'Terjadi kesalahan: ' . $e->getMessage();
                }
                $messageType = 'error';
            }
        }
    }

    elseif ($action === 'delete_reseller') {
        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $db->prepare("SELECT nama, slug FROM resellers WHERE id = ?");
            $stmt->execute([$id]);
            $r = $stmt->fetch();
            if ($r) {
                $db->prepare("DELETE FROM resellers WHERE id = ?")->execute([$id]);
                $message = "Reseller <strong>{$r['nama']}</strong> ({$r['slug']}) berhasil dihapus.";
                $messageType = 'success';
                $db->prepare("INSERT INTO admin_logs (action, detail, ip_address) VALUES (?, ?, ?)")
                   ->execute(['DELETE_RESELLER', "Hapus reseller: {$r['nama']} ({$r['slug']})", $_SERVER['REMOTE_ADDR'] ?? '']);
            }
        }
    }

    elseif ($action === 'toggle_status') {
        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            $db->prepare("UPDATE resellers SET aktif = 1 - aktif WHERE id = ?")->execute([$id]);
            $message = "Status reseller berhasil diperbarui.";
            $messageType = 'success';
        }
    }

    elseif ($action === 'update_wa_default') {
        $wa = formatWA(trim($_POST['default_wa'] ?? ''));
        $msg = trim($_POST['default_msg'] ?? '');
        if ($wa) {
            $db->prepare("UPDATE settings SET value = ? WHERE key_name = 'default_wa_number'")->execute([$wa]);
            $db->prepare("UPDATE settings SET value = ? WHERE key_name = 'default_wa_message'")->execute([$msg]);
            $message = 'Pengaturan WhatsApp default berhasil disimpan.';
            $messageType = 'success';
        }
    }

    // Redirect to prevent form resubmission
    if ($messageType) {
        $_SESSION['flash_message'] = $message;
        $_SESSION['flash_type'] = $messageType;
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
}

// Get flash message
if (isset($_SESSION['flash_message'])) {
    $message = $_SESSION['flash_message'];
    $messageType = $_SESSION['flash_type'];
    unset($_SESSION['flash_message'], $_SESSION['flash_type']);
}

// Fetch data
$resellers = $db->query("SELECT * FROM resellers ORDER BY created_at DESC")->fetchAll();
$totalResellers = count($resellers);
$activeResellers = array_filter($resellers, fn($r) => $r['aktif'] == 1);
$totalKlik = array_sum(array_column($resellers, 'total_klik'));

$settingWA = $db->query("SELECT value FROM settings WHERE key_name = 'default_wa_number'")->fetchColumn() ?: DEFAULT_WA_NUMBER;
$settingMsg = $db->query("SELECT value FROM settings WHERE key_name = 'default_wa_message'")->fetchColumn() ?: DEFAULT_WA_MESSAGE;
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin — Zefa Mulia Sejahtera</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body class="admin-body">

<!-- Overlay untuk menutup sidebar di mobile -->
<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

<!-- ====================================================
     SIDEBAR
     ==================================================== -->
<aside class="admin-sidebar" id="adminSidebar">
    <div class="admin-logo">
        <!-- Tombol tutup sidebar di mobile -->
        <button class="sidebar-close-btn" onclick="closeSidebar()" aria-label="Tutup menu">✕</button>
        <div class="brand">🌿 ZEFA ADMIN</div>
        <div class="sub">Panel Manajemen Reseller</div>
    </div>

    <nav class="admin-nav">
        <a href="#dashboard" class="admin-nav-item active" onclick="showSection('dashboard', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
        </a>
        <a href="#resellers" class="admin-nav-item" onclick="showSection('resellers', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Kelola Reseller
        </a>
        <a href="#tambah" class="admin-nav-item" onclick="showSection('tambah', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Tambah Reseller
        </a>
        <a href="#pengaturan" class="admin-nav-item" onclick="showSection('pengaturan', this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Pengaturan
        </a>
    </nav>

    <div style="padding: 16px 24px; border-top: 1px solid var(--border-color);">
        <div style="font-size:0.8rem; color:var(--text-secondary); opacity:0.6; margin-bottom:12px;">
            Login sebagai: <strong style="color:var(--green-400);"><?= ADMIN_USERNAME ?></strong>
        </div>
        <a href="logout.php" style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:#f87171;opacity:0.8;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
        </a>
    </div>
</aside>

<!-- ====================================================
     MAIN CONTENT
     ==================================================== -->
<main class="admin-main">

    <!-- Topbar Mobile (hanya tampil di mobile) -->
    <div class="admin-topbar-mobile">
        <button class="hamburger-btn" onclick="openSidebar()" aria-label="Buka menu">
            <span></span><span></span><span></span>
        </button>
        <div class="topbar-title">🌿 ZEFA ADMIN</div>
    </div>

    <!-- Flash Message -->
    <?php if ($message): ?>
    <div class="alert alert-<?= $messageType === 'success' ? 'success' : 'error' ?>" id="flashMsg">
        <?= $message ?>
        <button onclick="document.getElementById('flashMsg').remove()" style="float:right;background:none;border:none;cursor:pointer;color:inherit;font-size:1.1rem;">✕</button>
    </div>
    <?php endif; ?>

    <!-- ====== DASHBOARD SECTION ====== -->
    <div id="section-dashboard">
        <div class="admin-header">
            <h1>📊 Dashboard</h1>
            <p>Selamat datang, <strong><?= ADMIN_USERNAME ?></strong>! Kelola reseller Anda di sini.</p>
        </div>

        <div class="admin-stat-grid">
            <div class="admin-stat">
                <div class="stat-value"><?= $totalResellers ?></div>
                <div class="stat-label">Total Reseller</div>
            </div>
            <div class="admin-stat">
                <div class="stat-value"><?= count($activeResellers) ?></div>
                <div class="stat-label">Reseller Aktif</div>
            </div>
            <div class="admin-stat">
                <div class="stat-value"><?= $totalResellers - count($activeResellers) ?></div>
                <div class="stat-label">Reseller Nonaktif</div>
            </div>
            <div class="admin-stat">
                <div class="stat-value"><?= number_format($totalKlik) ?></div>
                <div class="stat-label">Total Klik WA</div>
            </div>
        </div>

        <div class="admin-card">
            <h3 style="margin-bottom:8px;">🚀 Cara Kerja Sistem</h3>
            <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px;line-height:1.7;">
                Tambahkan reseller baru dengan mengisi nama, slug URL, dan nomor WhatsApp mereka.
                Sistem otomatis membuat halaman replika dengan CTA yang mengarah ke nomor WA reseller tersebut.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;">
                <div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);border-radius:12px;padding:20px;text-align:center;">
                    <div style="font-size:2rem;margin-bottom:8px;">1️⃣</div>
                    <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">Tambah Reseller</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);opacity:0.8;">Isi nama, slug, & nomor WA</div>
                </div>
                <div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);border-radius:12px;padding:20px;text-align:center;">
                    <div style="font-size:2rem;margin-bottom:8px;">2️⃣</div>
                    <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">Link Otomatis Dibuat</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);opacity:0.8;">domain.com/nama-reseller</div>
                </div>
                <div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);border-radius:12px;padding:20px;text-align:center;">
                    <div style="font-size:2rem;margin-bottom:8px;">3️⃣</div>
                    <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">Bagikan ke Reseller</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);opacity:0.8;">CTA → nomor WA reseller</div>
                </div>
            </div>
        </div>

        <!-- Recent Resellers Preview -->
        <?php if (!empty($resellers)): ?>
        <div class="admin-card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <h3>👥 Reseller Terbaru</h3>
                <button class="btn btn-outline btn-sm" onclick="showSection('resellers', null)">Lihat Semua</button>
            </div>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Link Replika</th>
                        <th>WhatsApp</th>
                        <th>Status</th>
                        <th>Klik</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (array_slice($resellers, 0, 5) as $r): ?>
                    <tr>
                        <td><strong><?= sanitize($r['nama']) ?></strong><?= $r['kota'] ? "<br><small style='opacity:.6'>📍 " . sanitize($r['kota']) . "</small>" : '' ?></td>
                        <td>
                            <a href="<?= SITE_URL ?>/<?= sanitize($r['slug']) ?>" target="_blank" style="color:var(--green-400);font-family:monospace;font-size:0.85rem;">
                                /<?= sanitize($r['slug']) ?>
                            </a>
                        </td>
                        <td style="font-family:monospace;font-size:0.85rem;"><?= sanitize($r['wa_number']) ?></td>
                        <td><span class="badge-<?= $r['aktif'] ? 'active' : 'inactive' ?>"><?= $r['aktif'] ? 'Aktif' : 'Nonaktif' ?></span></td>
                        <td><?= number_format($r['total_klik']) ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>
    </div>

    <!-- ====== RESELLERS SECTION ====== -->
    <div id="section-resellers" style="display:none;">
        <div class="admin-header">
            <h1>👥 Kelola Reseller</h1>
            <p>Daftar semua reseller yang terdaftar. Total: <strong><?= $totalResellers ?></strong> reseller.</p>
        </div>
        <div class="admin-card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
                <h3>Daftar Reseller</h3>
                <button class="btn btn-primary btn-sm" onclick="showSection('tambah', null)">+ Tambah Reseller Baru</button>
            </div>

            <?php if (empty($resellers)): ?>
            <div class="empty-state">
                <div class="icon">👥</div>
                <p>Belum ada reseller. Klik "Tambah Reseller" untuk mulai.</p>
            </div>
            <?php else: ?>
            <div style="overflow-x:auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama Reseller</th>
                            <th>Link Replika</th>
                            <th>WhatsApp</th>
                            <th>Status</th>
                            <th>Klik WA</th>
                            <th>Dibuat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($resellers as $i => $r): ?>
                        <tr>
                            <td style="opacity:.5;"><?= $i + 1 ?></td>
                            <td>
                                <strong><?= sanitize($r['nama']) ?></strong>
                                <?= $r['kota'] ? "<br><small style='opacity:.6;font-size:0.78rem'>📍 " . sanitize($r['kota']) . "</small>" : '' ?>
                            </td>
                            <td>
                                <a href="<?= SITE_URL ?>/<?= sanitize($r['slug']) ?>" target="_blank"
                                   style="color:var(--green-400);font-family:monospace;font-size:0.82rem;text-decoration:none;">
                                    /<?= sanitize($r['slug']) ?>
                                </a>
                            </td>
                            <td style="font-family:monospace;font-size:0.82rem;">
                                <a href="https://wa.me/<?= $r['wa_number'] ?>" target="_blank" style="color:var(--text-secondary);">
                                    <?= sanitize($r['wa_number']) ?>
                                </a>
                            </td>
                            <td>
                                <form method="POST" style="display:inline;">
                                    <input type="hidden" name="action" value="toggle_status">
                                    <input type="hidden" name="id" value="<?= $r['id'] ?>">
                                    <button type="submit" class="badge-<?= $r['aktif'] ? 'active' : 'inactive' ?>"
                                            style="cursor:pointer;border:none;background:none;padding:3px 10px;"
                                            title="Klik untuk toggle status">
                                        <?= $r['aktif'] ? 'Aktif ✓' : 'Nonaktif ✗' ?>
                                    </button>
                                </form>
                            </td>
                            <td style="text-align:center;"><?= number_format($r['total_klik']) ?></td>
                            <td style="font-size:0.78rem;opacity:.6;"><?= date('d/m/Y', strtotime($r['created_at'])) ?></td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn btn-sm btn-copy"
                                            onclick="copyLink('<?= SITE_URL ?>/<?= $r['slug'] ?>')"
                                            title="Copy link">📋 Copy</button>
                                    <form method="POST" style="display:inline;"
                                          onsubmit="return confirm('Hapus reseller <?= sanitize($r['nama']) ?>? Tindakan ini tidak dapat dibatalkan!')">
                                        <input type="hidden" name="action" value="delete_reseller">
                                        <input type="hidden" name="id" value="<?= $r['id'] ?>">
                                        <button type="submit" class="btn btn-sm btn-danger" title="Hapus">🗑️ Hapus</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- ====== TAMBAH RESELLER SECTION ====== -->
    <div id="section-tambah" style="display:none;">
        <div class="admin-header">
            <h1>➕ Tambah Reseller Baru</h1>
            <p>Isi form berikut untuk membuat halaman replika untuk reseller baru.</p>
        </div>
        <div class="admin-card" style="max-width:640px;">
            <form method="POST" action="">
                <input type="hidden" name="action" value="add_reseller">

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="nama">NAMA RESELLER *</label>
                        <input type="text" id="nama" name="nama" class="form-input"
                               placeholder="Contoh: Budi Santoso" required maxlength="255">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="slug">SLUG URL * <small style="text-transform:none;font-weight:400;opacity:.7;">(domain.com/<span id="slugPreview" style="color:#4ade80;">nama</span>)</small></label>
                        <input type="text" id="slug" name="slug" class="form-input"
                               placeholder="Contoh: budi atau budi-santoso"
                               pattern="[a-zA-Z0-9_-]+"
                               title="Hanya huruf, angka, strip, dan underscore"
                               required maxlength="100"
                               oninput="updateSlugPreview(this.value)">
                        <div class="form-hint">⚠️ Slug tidak bisa diubah setelah disimpan. Gunakan huruf kecil tanpa spasi.</div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="wa_number">NOMOR WHATSAPP * <small style="text-transform:none;font-weight:400;opacity:.7;">(format bebas, otomatis dikonversi)</small></label>
                        <input type="text" id="wa_number" name="wa_number" class="form-input"
                               placeholder="Contoh: 08123456789 atau 628123456789"
                               required maxlength="20">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="kota">KOTA/AREA <small style="text-transform:none;font-weight:400;opacity:.7;">(opsional)</small></label>
                        <input type="text" id="kota" name="kota" class="form-input"
                               placeholder="Contoh: Jakarta Selatan" maxlength="100">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="wa_message">PESAN WA CUSTOM <small style="text-transform:none;font-weight:400;opacity:.7;">(opsional — default jika kosong)</small></label>
                    <textarea id="wa_message" name="wa_message" class="form-textarea"
                              placeholder="Halo, saya tertarik dengan produk pupuk Zefa. Boleh info lebih lanjut?"
                              maxlength="500"></textarea>
                    <div class="form-hint">Pesan yang otomatis muncul ketika pelanggan klik tombol WhatsApp di halaman reseller ini.</div>
                </div>

                <div class="form-group">
                    <label class="form-checkbox-label">
                        <input type="checkbox" name="aktif" checked>
                        <span>Aktifkan halaman reseller ini segera setelah disimpan</span>
                    </label>
                </div>

                <!-- Preview -->
                <div class="reseller-preview-box">
                    <div class="reseller-preview-title">🔗 PREVIEW LINK RESELLER</div>
                    <div class="reseller-preview-url">
                        <?= rtrim(SITE_URL, '/') ?>/<span id="slugPreviewFull" class="reseller-preview-slug">nama-reseller</span>
                    </div>
                </div>

                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <button type="submit" class="btn btn-primary">✅ Simpan Reseller</button>
                    <button type="reset" class="btn btn-outline" onclick="document.getElementById('slugPreview').textContent='nama';document.getElementById('slugPreviewFull').textContent='nama-reseller';">Reset Form</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ====== PENGATURAN SECTION ====== -->
    <div id="section-pengaturan" style="display:none;">
        <div class="admin-header">
            <h1>⚙️ Pengaturan</h1>
            <p>Konfigurasi nomor WhatsApp default untuk halaman utama website.</p>
        </div>

        <div class="admin-card" style="max-width:640px;">
            <h3 style="margin-bottom:20px;">📱 WhatsApp Default (Halaman Utama)</h3>
            <form method="POST" action="">
                <input type="hidden" name="action" value="update_wa_default">
                <div class="form-group">
                    <label class="form-label" for="default_wa">NOMOR WA DEFAULT</label>
                    <input type="text" id="default_wa" name="default_wa" class="form-input"
                           value="<?= sanitize($settingWA) ?>"
                           placeholder="6285727289279" required>
                    <div class="form-hint">Nomor ini digunakan di landing page utama (tanpa slug reseller).</div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="default_msg">PESAN WA DEFAULT</label>
                    <textarea id="default_msg" name="default_msg" class="form-textarea"><?= sanitize($settingMsg) ?></textarea>
                </div>
                <button type="submit" class="btn btn-primary">💾 Simpan Pengaturan</button>
            </form>
        </div>

        <div class="admin-card" style="max-width:640px;margin-top:24px;">
            <h3 style="margin-bottom:20px;">📤 Export Data Reseller</h3>
            <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:16px;">Download semua data reseller sebagai file JSON untuk backup.</p>
            <a href="export.php" class="btn btn-outline">⬇️ Download JSON</a>
        </div>

        <div class="admin-card" style="max-width:640px;margin-top:24px;">
            <h3 style="margin-bottom:16px;">🔐 Info Keamanan</h3>
            <div class="alert alert-warning">
                ⚠️ Untuk keamanan, ubah password admin di file <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;">config.php</code> setelah deployment.
            </div>
        </div>
    </div>

</main>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer"></div>

<script>
// Section navigation
function showSection(name, el) {
    document.querySelectorAll('[id^="section-"]').forEach(s => s.style.display = 'none');
    document.getElementById('section-' + name).style.display = 'block';
    document.querySelectorAll('.admin-nav-item').forEach(a => a.classList.remove('active'));
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);
    // Tutup sidebar otomatis setelah klik menu di mobile
    if (window.innerWidth < 768) closeSidebar();
}

// Sidebar mobile toggle
function openSidebar() {
    document.getElementById('adminSidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    document.getElementById('adminSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Slug preview
function updateSlugPreview(val) {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    document.getElementById('slugPreview').textContent = clean || 'nama';
    document.getElementById('slugPreviewFull').textContent = clean || 'nama-reseller';
    document.getElementById('slug').value = clean;
}

// Copy link
function copyLink(url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => showToast('Link berhasil disalin!'));
    } else {
        const el = document.createElement('input');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('Link berhasil disalin!');
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

// Auto-hide flash message
const flash = document.getElementById('flashMsg');
if (flash) setTimeout(() => flash.style.opacity = '0', 5000);

// Check URL hash for section
const hash = window.location.hash.replace('#', '');
if (hash && document.getElementById('section-' + hash)) {
    showSection(hash, document.querySelector(`[href="#${hash}"]`));
}
</script>

</body>
</html>

