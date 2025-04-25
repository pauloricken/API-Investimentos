<?php
class UsuarioControlador {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function listar() {
        $stmt = $this->pdo->query("SELECT * FROM usuarios");
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($usuarios);
    }

    public function criar($dados) {
        $stmt = $this->pdo->prepare("INSERT INTO usuarios (nome, email) VALUES (:nome, :email) RETURNING *");
        $stmt->execute([
            ':nome' => $dados['nome'],
            ':email' => $dados['email']
        ]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        http_response_code(201);
        echo json_encode($usuario);
    }

    public function alterar($dados) {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET nome = :nome, email = :email WHERE id = :id");
        $stmt->execute([
            ':nome' => $dados['nome'],
            ':email' => $dados['email'],
            ':id' => $dados['id']
        ]);
        http_response_code(200);
        echo json_encode(['mensagem' => 'Usuário atualizado com sucesso.']);
    }

    public function deletar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM usuarios WHERE id = :id");
        $stmt->execute([':id' => $id]);
        http_response_code(200);
        echo json_encode(['mensagem' => 'Usuário deletado com sucesso.']);
    }
}
