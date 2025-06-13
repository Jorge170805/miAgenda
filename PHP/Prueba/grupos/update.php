<?php
// Encabezados para permitir peticiones desde frontend con credenciales
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica sesion activa y conecta con la base de datos
include("../check_session.php");
include("../conexion.php");

try {
    // Recoge datos del POST
    $id = $_POST["id"];
    $nombre = $_POST["nombre"];
    $colorFondo = $_POST["colorFondo"];
    $colorTexto = $_POST["colorTexto"];

    // Obtiene ID del usuario desde la sesion
    $idUsuario = $_SESSION["usuario_id"];

    // Actualiza los datos del grupo solo si pertenece al usuario
    $sql = "UPDATE grupos 
            SET nombre = :nombre,
                colorFondo = :colorFondo,
                colorTexto = :colorTexto
            WHERE id = :id 
            AND fidUsuario = :idUsuario";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":nombre" => $nombre,
        ":id" => $id,
        ":idUsuario" => $idUsuario,
        ":colorFondo" => $colorFondo,
        ":colorTexto" => $colorTexto
    ]);

    // Respuesta si se actualiza correctamente
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Grupo modificado correctamente"
    ]);
} catch (PDOException $e) {
    // Respuesta en caso de error
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al modificar el grupo: " . $e->getMessage()
    ]);
}
?>
