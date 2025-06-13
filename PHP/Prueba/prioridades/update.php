<?php
// Permite peticiones desde localhost:3000 con credenciales
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica sesion activa y permisos de administrador
include("../check_session.php");
include("../check_admin.php");
include("../conexion.php");

try {
    // Recoge datos enviados por POST
    $id = $_POST["id"];
    $nombre = $_POST["nombre"];
    $prioridad = $_POST["prioridad"];

    // Actualiza la prioridad con los nuevos datos
    $sql = "UPDATE prioridades SET nombre = :nombre, prioridad = :prioridad WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":id" => $id,
        ":nombre" => $nombre,
        ":prioridad" => $prioridad
    ]);

    // Devuelve respuesta exitosa
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Prioridad modificada correctamente"
    ]);
} catch (PDOException $e) {
    // En caso de error devuelve mensaje con detalle
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al modificar la prioridad: " . $e->getMessage()
    ]);
}
?>
