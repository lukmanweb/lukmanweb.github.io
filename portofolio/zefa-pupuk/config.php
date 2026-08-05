<?php
// ====================================================
// KONFIGURASI ZEFA MULIA SEJAHTERA
// ====================================================

// Database Configuration (sesuaikan dengan hosting RumahWeb)
define('DB_HOST', 'localhost');
define('DB_NAME', 'zefa_pupuk');
define('DB_USER', 'root');         // Ganti dengan username DB hosting
define('DB_PASS', '');             // Ganti dengan password DB hosting
define('DB_CHARSET', 'utf8mb4');

// Site Configuration
define('SITE_NAME', 'Pupuk Zefa Sejahtera');
define('SITE_TAGLINE', 'Solusi Pertanian & Peternakan Terbaik Indonesia');
define('SITE_URL', 'https://pupukzefasejahtera.com'); // Domain resmi Anda
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'godmode'); // Sudah di-hash saat install

// Default WhatsApp (Nomor Admin Utama)
define('DEFAULT_WA_NUMBER', '6285727289279');
define('DEFAULT_WA_MESSAGE', 'Halo Pupuk Zefa Sejahtera, saya tertarik dengan produk pupuk Anda. Boleh minta info lebih lanjut?');

// Social Media
define('INSTAGRAM', '@zefaaofficial');
define('FACEBOOK', 'Zefa Mulia');
define('WEBSITE', 'zefasejahtera.com');

// Session
define('SESSION_TIMEOUT', 3600); // 1 jam

// ====================================================
// DATABASE CONNECTION
// ====================================================
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
        }
    }
    return $pdo;
}

// ====================================================
// HELPER FUNCTIONS
// ====================================================
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function formatWA($number) {
    // Normalisasi nomor WA ke format 62xxx
    $number = preg_replace('/[^0-9]/', '', $number);
    if (substr($number, 0, 1) === '0') {
        $number = '62' . substr($number, 1);
    }
    return $number;
}

function generateWALink($number, $message = '') {
    $number = formatWA($number);
    $message = urlencode($message ?: DEFAULT_WA_MESSAGE);
    return "https://wa.me/{$number}?text={$message}";
}

function isAdminLoggedIn() {
    if (session_status() === PHP_SESSION_NONE) session_start();
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true
        && isset($_SESSION['last_activity'])
        && (time() - $_SESSION['last_activity']) < SESSION_TIMEOUT;
}

function requireAdmin() {
    if (!isAdminLoggedIn()) {
        header('Location: ' . SITE_URL . '/admin/login.php');
        exit;
    }
    if (session_status() === PHP_SESSION_NONE) session_start();
    $_SESSION['last_activity'] = time();
}

function redirect($url) {
    header("Location: $url");
    exit;
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
