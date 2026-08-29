<?php
require_once __DIR__ . '/config.php';

// Routing .htaccess mengarahkan /eko ke reseller.php?slug=eko
// File ini bisa juga dipanggil langsung dari .htaccess
$slug = isset($_GET['slug']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['slug']) : '';

if ($slug === '') {
    redirect(SITE_URL . '/');
}

// Redirect ke index.php dengan parameter slug
// index.php sudah handle logic reseller
include __DIR__ . '/index.php';
