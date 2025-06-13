<?php
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include("../../check_session.php");
include("../../conexion.php");

try {
    $idMsg = $_POST["idMsg"];

    $sql = "UPDATE chats SET borrado = 1 WHERE id = :idMsg";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idMsg" => $idMsg]);
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Mensaje borrado correctamente"
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al borrar el participante: " . $e->getMessage()]);
}
?>
