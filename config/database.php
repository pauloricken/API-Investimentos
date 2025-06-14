<?php

$host    = '127.0.0.1';
$port    = '5432';
$db      = 'apirest';
$user    = 'postgres';
$pass    = 'admin';
$charset = 'utf8';  

$dsn = "pgsql:host={$host};port={$port};dbname={$db};options='--client_encoding={$charset}'";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, 
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    return $pdo;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro de conexão: ' . $e->getMessage()]);
    exit;
}
