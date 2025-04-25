<?php
$dotenv = parse_ini_file(__DIR__ . '/../.env');

try {
    $pdo = new PDO(
        "pgsql:host={$dotenv['DB_HOST']};dbname={$dotenv['DB_NAME']}",
        $dotenv['DB_USER'],
        $dotenv['DB_PASS']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
} catch (PDOException $e) {
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}
