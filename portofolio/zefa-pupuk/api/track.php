<?php
// API endpoint untuk tracking klik WA reseller
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$slug = isset($data['slug']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $data['slug']) : '';
$source = isset($data['source']) ? sanitize($data['source']) : 'unknown';

if ($slug) {
    try {
        $db = getDB();
        $db->prepare("UPDATE resellers SET total_klik = total_klik + 1 WHERE slug = ? AND aktif = 1")
           ->execute([$slug]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No slug']);
}
