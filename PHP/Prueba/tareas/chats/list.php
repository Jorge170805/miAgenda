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
    $idTarea = $_POST["id"];
    // --------------------------------------------------------
    $sql = "SELECT t.nombre, t.descripcion, u.id as propietarioId, u.nombre as propietarioNombre, u.email as propietarioEmail
            FROM tareas t INNER JOIN usuarios u ON u.id = t.fidUsuario
            WHERE t.id = :idTarea";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idTarea" => $idTarea]);
    $tarea = $stmt->fetch(PDO::FETCH_ASSOC);

    // --------------------------------------------------------
    $sql = "SELECT c.id as idMsg, u.id as idUsuario, u.nombre as usuarioNombre, u.email as usuarioEmail, c.fecha, 
            CASE WHEN c.borrado = 1 THEN '-- El mensaje ha sido eliminado --' ELSE c.mensaje END as mensaje,
            c.editado, c.borrado
            FROM chats c INNER JOIN usuarios u ON u.id = c.fidUsuario
            WHERE c.fidTarea = :idTarea
            ORDER BY c.fecha asc;";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idTarea" => $idTarea]);
    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " mensajes",
        "listado" => $listado,
        "tarea" => $tarea,
        "idUsuarioLogado" => $idUsuario
    ]);

    
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al buscar los mensajes: " . $e->getMessage()]);
}
?>
