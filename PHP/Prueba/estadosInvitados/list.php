<?php
// Configura encabezados para permitir peticiones desde frontend (localhost:3000)
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Incluye verificaciones de sesion y admin, y la conexion a la base de datos
include("../check_session.php");
include("../check_admin.php");
include("../conexion.php");

try {
    // Consulta para obtener todos los estados de invitados
    $sql = "SELECT id, nombre FROM estadosInvitados";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Recupera todos los resultados como array asociativo
    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve resultado con lista y mensaje de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " estados",
        "listado" => $listado
    ]);
    
} catch (PDOException $e) {
    // En caso de error, devuelve mensaje con el detalle
    echo json_encode(["status" => "error", "mensaje" => "Error al recuperar los estados: " . $e->getMessage()]);
}
?>
