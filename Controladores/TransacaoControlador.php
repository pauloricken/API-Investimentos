<?php
class TransacaoControlador {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function listar() {
        $stmt = $this->pdo->query("SELECT * FROM transacoes");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function criar($dados) {
        $stmt = $this->pdo->prepare("
            INSERT INTO transacoes (id_investimento, tipo, valor, data, categoria_id, usuario_id, descricao)
            VALUES (:id_investimento, :tipo, :valor, :data, :categoria_id, :usuario_id, :descricao)
            RETURNING *
        ");
        $stmt->execute([
            ':id_investimento' => $dados['id_investimento'],
            ':tipo' => $dados['tipo'],
            ':valor' => $dados['valor'],
            ':data' => $dados['data'],
            ':categoria_id' => $dados['categoria_id'],
            ':usuario_id' => $dados['usuario_id'],
            ':descricao' => $dados['descricao']
        ]);
        http_response_code(201);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    }
    

    public function alterar($dados) {
        $stmt = $this->pdo->prepare("UPDATE transacoes SET descricao = :descricao, valor = :valor, categoria_id = :categoria_id, data = :data WHERE id = :id");
        $stmt->execute([
            ':descricao' => $dados['descricao'],
            ':valor' => $dados['valor'],
            ':categoria_id' => $dados['categoria_id'],
            ':data' => $dados['data'],
            ':id' => $dados['id']
        ]);
        http_response_code(200); 
        echo json_encode(['mensagem' => 'Transação atualizada com sucesso.']);
    }

    public function deletar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM transacoes WHERE id = :id");
        $stmt->execute([':id' => $id]);
        http_response_code(200);
        echo json_encode(['mensagem' => 'Transação deletada com sucesso.']);
    }
}
