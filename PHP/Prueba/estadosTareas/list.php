<?php
// Configura los encabezados para permitir peticiones desde localhost:3000
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica que el usuario tenga sesion activa y permisos de admin
include("../check_session.php");
include("../check_admin.php");
include("../conexion.php");

try {
    // Consulta para obtener todos los estados de tareas con sus campos
    $sql = "SELECT id, nombre, avisos FROM estadosTareas ORDER BY id ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Almacena todos los resultados en un array asociativo
    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve respuesta con el listado y mensaje de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " estados",
        "listado" => $listado
    ]);
} catch (PDOException $e) {
    // Devuelve mensaje de error si la consulta falla
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al recuperar los estados: " . $e->getMessage()
    ]);
}
?>
