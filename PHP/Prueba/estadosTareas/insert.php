<?php
// Configura los encabezados para aceptar peticiones desde frontend (localhost:3000)
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
    // Obtiene los datos enviados por POST
    $nombre = $_POST["nombre"];
    $avisos = $_POST["avisos"];

    // Inserta el nuevo estado en la tabla estadosTareas
    $sql = "INSERT INTO estadosTareas (nombre, avisos) VALUES (:nombre, :avisos)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":nombre" => $nombre,
        ":avisos" => $avisos
    ]);

    // Devuelve respuesta de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Estado insertado correctamente"
    ]);
} catch (PDOException $e) {
    // Devuelve mensaje de error si la consulta falla
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al crear el estado: " . $e->getMessage()
    ]);
}
?>
