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
    $sql = "SELECT p.id, u.nombre, u.email, p.fecha, p.fidUsuario
            FROM participantes p 	INNER JOIN tareas t     ON t.id = p.fidTarea
			                        INNER JOIN usuarios u   ON u.id = p.fidUsuario
            WHERE p.fidTarea = :idTarea";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idTarea" => $idTarea]);
    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " participantes",
        "listado" => $listado,
        "tarea" => $tarea,
        "soloConsulta" => $idUsuario != $tarea["propietarioId"],
        "idUsuarioLogado" => $idUsuario
    ]);

    
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al buscar los participantes: " . $e->getMessage()]);
}
?>
