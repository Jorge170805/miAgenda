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
    $id = $_POST["id"];
    $msg = $_POST["msg"];

    $sql = "INSERT INTO chats (fidTarea,fidUsuario,fecha,mensaje) VALUES (:id,:idUsuario,now(),:msg)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id, ":idUsuario" => $idUsuario, ":msg" => $msg]);
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Mensaje creado correctamente"
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al crear el mensaje: " . $e->getMessage()]);
}
?>
