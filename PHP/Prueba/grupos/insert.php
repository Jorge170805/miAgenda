<?php
// Encabezados para permitir peticiones desde localhost:3000 con credenciales
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica que la sesion este activa y establece conexion con la base de datos
include("../check_session.php");
include("../conexion.php");

try {
    // Recoge los datos enviados desde el frontend
    $idUsuario = $_SESSION["usuario_id"];
    $nombre = $_POST["nombre"];
    $colorFondo = $_POST["colorFondo"];
    $colorTexto = $_POST["colorTexto"];

    // Inserta un nuevo grupo asociado al usuario actual
    $sql = "INSERT INTO grupos (fidUsuario, nombre, colorFondo, colorTexto) 
            VALUES (:idUsuario, :nombre, :colorFondo, :colorTexto)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":idUsuario" => $idUsuario,
        ":nombre" => $nombre,
        ":colorFondo" => $colorFondo,
        ":colorTexto" => $colorTexto
    ]);

    // Devuelve mensaje de exito
    echo json_encode([
        "status" => "ok",
        "mensaje" => "Grupo creado correctamente"
    ]);
} catch (PDOException $e) {
    // Devuelve mensaje de error si algo falla
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al crear el grupo: " . $e->getMessage()
    ]);
}
?>
