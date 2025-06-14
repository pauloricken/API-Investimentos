<?php
class CategoriaControlador {
    private $pdo;

    public function __construct($pdo) { 
        $this->pdo = $pdo;
    }

    public function listar() {
        $stmt = $this->pdo->query("SELECT * FROM categorias");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function criar($dados) {
        $stmt = $this->pdo->prepare("INSERT INTO categorias (nome) VALUES (:nome) RETURNING *");
        $stmt->execute([':nome' => $dados['nome']]);
        http_response_code(201);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    }

    public function alterar($dados) {
        $stmt = $this->pdo->prepare("UPDATE categorias SET nome = :nome WHERE id = :id");
        $stmt->execute([':nome' => $dados['nome'], ':id' => $dados['id']]);
        http_response_code(200);
        echo json_encode(['mensagem' => 'Categoria atualizada com sucesso.']);
    }

    public function deletar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM categorias WHERE id = :id");
        $stmt->execute([':id' => $id]);
        http_response_code(200);
        echo json_encode(['mensagem' => 'Categoria deletada com sucesso.']);
    }
}
