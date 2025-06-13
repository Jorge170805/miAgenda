<?php
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include("../../check_session.php");
include("../../conexion.php");

try {
    
    $idUsuario = $_SESSION["usuario_id"];
    $idMsg = $_POST["idMsg"];
    $msg = $_POST["msg"];

    $sql = "UPDATE chats SET mensaje = :msg, editado = 1 WHERE id = :idMsg";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idMsg" => $idMsg, ":msg" => $msg]);
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Mensaje actualizado correctamente"
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al actualizar el mensaje: " . $e->getMessage()]);
}
?>
