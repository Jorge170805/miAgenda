<?php
// Encabezados para permitir peticiones desde el frontend con credenciales
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica que haya sesion iniciada y conecta a la base de datos
include("../check_session.php");
include("../conexion.php");

try {
    // Obtiene el ID del usuario desde la sesion
    $idUsuario = $_SESSION["usuario_id"];

    // Consulta los grupos pertenecientes al usuario
    $sql = "SELECT id, nombre, colorTexto, colorFondo FROM grupos WHERE fidUsuario = :idUsuario";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":idUsuario" => $idUsuario]);
    $listado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devuelve el listado de grupos
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Se han recuperado " . count($listado) . " grupos",
        "listado" => $listado
    ]);

} catch (PDOException $e) {
    // Devuelve error si falla la consulta
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al buscar usuario: " . $e->getMessage()
    ]);
}
?>
