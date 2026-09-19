<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method === 'GET' && preg_match('#/api/?(?:health)?$#', $path)) {
    echo json_encode([
        'ok' => true,
        'service' => 'yadeto-api',
        'version' => '1.2.0',
        'time' => gmdate('c'),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

http_response_code(404);
echo json_encode([
    'ok' => false,
    'error' => ['code' => 'NOT_FOUND', 'message' => 'مسیر مورد نظر پیدا نشد.'],
], JSON_UNESCAPED_UNICODE);
