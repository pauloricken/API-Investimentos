<?php
header('Content-Type: application/json');
$pdo = require_once __DIR__ . '/../config/database.php';

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
}

