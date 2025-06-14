<?php
require_once __DIR__ . '/../controladores/InvestimentoControlador.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$controlador = new InvestimentoControlador($pdo);

switch ($metodo) {
    case 'GET':
        $controlador->listar();
        break;

    case 'POST':
        $dados = json_decode(file_get_contents('php://input'), true);
        $controlador->criar($dados);
        break;

    case 'PUT':
        $dados = json_decode(file_get_contents('php://input'), true);
        $controlador->alterar($dados);
        break;

    case 'DELETE':
        $dados = json_decode(file_get_contents('php://input'), true);
        if (isset($dados['id'])) {
            $controlador->deletar($dados['id']);
        } else {
            http_response_code(400);
            echo json_encode(['erro' => 'ID não informado.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido']);
}
