<?php
require_once __DIR__ . '/../config.php';
session_start();

$error = '';
$success = '';

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['last_activity'] = time();
        $_SESSION['admin_username'] = $username;

        // Log login
        try {
            $db = getDB();
            $db->prepare("INSERT INTO admin_logs (action, detail, ip_address) VALUES (?, ?, ?)")
               ->execute(['LOGIN', "Admin login berhasil", $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
        } catch (Exception $e) {}

        redirect('../admin/');
    } else {
        $error = 'Username atau password salah. Silakan coba lagi.';
        sleep(1); // Prevent brute force
    }
}

// Redirect if already logged in
if (isAdminLoggedIn()) {
    redirect('../admin/');
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — Zefa Mulia Sejahtera</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="admin-body">

<div class="login-page">
    <div class="login-card">
        <div class="logo">
            <div class="brand">🌿 ZEFA ADMIN</div>
            <div class="sub">Panel Manajemen Reseller</div>
        </div>

        <?php if ($error): ?>
        <div class="alert alert-error">⚠️ <?= sanitize($error) ?></div>
        <?php endif; ?>

        <h2>Selamat Datang</h2>
        <p>Masuk ke dashboard admin untuk mengelola reseller</p>

        <form method="POST" action="">
            <div class="form-group">
                <label class="form-label" for="username">USERNAME</label>
                <input type="text" id="username" name="username" class="form-input"
                       placeholder="Masukkan username"
                       value="<?= isset($_POST['username']) ? sanitize($_POST['username']) : '' ?>"
                       required autocomplete="username">
            </div>
            <div class="form-group">
                <label class="form-label" for="password">PASSWORD</label>
                <div style="position:relative;">
                    <input type="password" id="password" name="password" class="form-input"
                           placeholder="Masukkan password"
                           required autocomplete="current-password"
                           style="padding-right: 48px;">
                    <button type="button" onclick="togglePassword()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-secondary);font-size:1.1rem;" title="Tampilkan password">👁️</button>
                </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px;">
                Masuk ke Dashboard
            </button>
        </form>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); text-align: center;">
            <a href="../" style="font-size:0.85rem; color:var(--text-secondary); opacity:0.7;">
                ← Kembali ke Website
            </a>
        </div>
    </div>
</div>

<script>
function togglePassword() {
    const pwd = document.getElementById('password');
    pwd.type = pwd.type === 'password' ? 'text' : 'password';
}
</script>

</body>
</html>
