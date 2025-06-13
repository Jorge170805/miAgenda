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
    // Consulta todas las prioridades ordenadas por el campo 'prioridad'
    $sql = "SELECT id, nombre, prioridad FROM prioridades ORDER BY prioridad ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Obtiene todas las filas en un array asociativo
    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve resultado con estado ok y listado de prioridades
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " prioridades",
        "listado" => $listado
    ]);
} catch (PDOException $e) {
    // En caso de error devuelve mensaje con detalle
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al recuperar las prioridades: " . $e->getMessage()
    ]);
}
?>
