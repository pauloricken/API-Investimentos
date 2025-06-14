<?php
// controladores/UsuarioControlador.php

class UsuarioControlador {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function listar() {
        $stmt = $this->pdo->query("SELECT * FROM usuarios");
        $usuarios = $stmt->fetchAll();
        echo json_encode($usuarios);
    }

    public function criar($dados) {
        if (empty($dados['nome']) || empty($dados['email'])) {
            http_response_code(422);
            echo json_encode(['erro' => 'Nome e email são obrigatórios.']);
            return;
        }

        // insere e captura último ID
        $stmt = $this->pdo->prepare("INSERT INTO usuarios (nome, email) VALUES (:nome, :email)");
        $stmt->execute([
            ':nome'  => $dados['nome'],
            ':email' => $dados['email']
        ]);
        $id = $this->pdo->lastInsertId();

        // busca registro completo
        $stmt2 = $this->pdo->prepare("SELECT * FROM usuarios WHERE id = :id");
        $stmt2->execute([':id' => $id]);
        $usuario = $stmt2->fetch();

        http_response_code(201);
        echo json_encode($usuario);
    }

    public function alterar($dados) {
        if (empty($dados['id']) || empty($dados['nome']) || empty($dados['email'])) {
            http_response_code(422);
            echo json_encode(['erro' => 'ID, nome e email são obrigatórios.']);
            return;
        }

        $stmt = $this->pdo->prepare("
            UPDATE usuarios
               SET nome = :nome,
                   email = :email
             WHERE id   = :id
        ");
        $stmt->execute([
            ':id'    => $dados['id'],
            ':nome'  => $dados['nome'],
            ':email' => $dados['email']
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
