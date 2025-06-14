<?php
class InvestimentoControlador {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function listar() {
        $stmt = $this->pdo->query("SELECT * FROM investimentos");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function criar($dados) {
        $stmt = $this->pdo->prepare("
            INSERT INTO investimentos (nome, valor, usuario_id, id_categoria) 
            VALUES (:nome, :valor, :usuario_id, :id_categoria) 
            RETURNING *
        ");
        $stmt->execute([
            ':nome' => $dados['nome'],
            ':valor' => $dados['valor'],
            ':usuario_id' => $dados['usuario_id'],
            ':id_categoria' => $dados['id_categoria']
        ]);
        http_response_code(201);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    }

    public function alterar($dados) {
        $stmt = $this->pdo->prepare("
            UPDATE investimentos 
            SET nome = :nome, valor = :valor, usuario_id = :usuario_id 
            WHERE id = :id
        ");
        $stmt->execute([
            ':nome' => $dados['nome'],
            ':valor' => $dados['valor'],
            ':usuario_id' => $dados['usuario_id'],
            ':id' => $dados['id']
        ]);
        http_response_code(200);
        echo json_encode(['mensagem' => 'Investimento atualizado com sucesso.']);
    }

    public function deletar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM investimentos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        http_response_code(200);
        echo json_encode(['mensagem' => 'Investimento deletado com sucesso.']);
    }
}
  