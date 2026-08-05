<?php
require_once __DIR__ . '/../config.php';
session_start();
requireAdmin();

$db = getDB();
$resellers = $db->query("SELECT id, slug, nama, wa_number, kota, aktif, total_klik, created_at FROM resellers ORDER BY created_at DESC")->fetchAll();

header('Content-Type: application/json');
header('Content-Disposition: attachment; filename="zefa-resellers-' . date('Y-m-d') . '.json"');
echo json_encode([
    'export_date' => date('Y-m-d H:i:s'),
    'total' => count($resellers),
    'resellers' => $resellers
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
