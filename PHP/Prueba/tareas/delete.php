<?php
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include("../check_session.php");
include("../conexion.php");



try {
    $id = $_POST["id"];
    $idUsuario = $_SESSION["usuario_id"];

    $sql = "DELETE FROM tareas WHERE id = :id AND fidUsuario = :idUsuario";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id,":idUsuario" => $idUsuario]);
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Tarea borrada correctamente"
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al borrar la tarea: " . $e->getMessage()]);
}
?>
