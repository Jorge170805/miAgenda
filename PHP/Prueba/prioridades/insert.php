<?php
// Encabezados para permitir peticiones desde frontend con credenciales
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica que la sesion este activa y que el usuario sea administrador
include("../check_session.php");
include("../check_admin.php");
include("../conexion.php");

try {
    // Recoge datos del POST
    $nombre = $_POST["nombre"];
    $prioridad = $_POST["prioridad"];

    // Inserta una nueva prioridad en la base de datos
    $sql = "INSERT INTO prioridades (nombre, prioridad) VALUES (:nombre, :prioridad)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":nombre" => $nombre,
        ":prioridad" => $prioridad
    ]);

    // Respuesta en caso de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Prioridad insertada correctamente"
    ]);
} catch (PDOException $e) {
    // Respuesta en caso de error de base de datos
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al crear la prioridad: " . $e->getMessage()
    ]);
}
?>
