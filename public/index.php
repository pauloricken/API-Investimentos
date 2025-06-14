<?php
// public/index.php

header('Content-Type: application/json');
// liberar chamadas de qualquer origem (CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // preflight CORS
}

// conecta ao banco
$pdo = require_once __DIR__ . '/../config/database.php';

// dispatch de rotas
$rota = $_GET['rota'] ?? '';
switch ($rota) {
    case 'usuarios':
        require_once __DIR__ . '/../rotas/usuarios.php';
        break;

    case 'categorias':
        require_once __DIR__ . '/../rotas/categorias.php';
        break;

    case 'investimentos':
        require_once __DIR__ . '/../rotas/investimentos.php';
        break;

    case 'transacoes':
        require_once __DIR__ . '/../rotas/transacoes.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(['erro' => 'Rota não encontrada']);
        break;
}
