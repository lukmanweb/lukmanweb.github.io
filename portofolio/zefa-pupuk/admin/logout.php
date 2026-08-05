<?php
require_once __DIR__ . '/../config.php';
session_start();

if (isAdminLoggedIn()) {
    $db = getDB();
    $db->prepare("INSERT INTO admin_logs (action, detail, ip_address) VALUES (?, ?, ?)")
       ->execute(['LOGOUT', 'Admin logout', $_SERVER['REMOTE_ADDR'] ?? '']);
}

session_destroy();
redirect('../admin/login.php');
