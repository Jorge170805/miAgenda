<?php

// Configura los encabezados para permitir solicitudes desde frontend en localhost:3000
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("conexion.php"); // conexión a la base de datos
include("log.php");      // para registrar logs

// Recoge los datos del formulario
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

// Validar que se recibieron datos
if ($email == null || $password == null) {
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos"]);
    exit;
}

try {
    // Consulta para buscar al usuario por su email
    $sql = "SELECT id, nombre, email, password, admin FROM usuarios WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":email" => $email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario != null) {
        $idUsuario = $usuario["id"];

        // Verifica si la contraseña ingresada es correcta
        if (password_verify($password, $usuario["password"])) {
            session_start(); // Inicia la sesión
            // Guarda el ID y rol del usuario en la sesión
            $_SESSION["usuario_id"] = $idUsuario;
            $_SESSION["usuario_admin"] = ($usuario["admin"] == 1);

            // Cuenta las tareas con aviso activado que ya han iniciado
            $sql = "SELECT COUNT(*)
                    FROM v_tareas_x_usuarios v
                    INNER JOIN tareas t ON t.id = v.fidTarea
                    INNER JOIN estadostareas e ON e.id = t.fidEstado
                    WHERE v.fidUsuario = :idUsuario
                    AND e.avisos = 1
                    AND t.fechaInicio <= now()";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([":idUsuario" => $idUsuario]);
            $numAvisos = $stmt->fetchColumn();

            // Respuesta con éxito: incluye datos del usuario y número de avisos
            echo json_encode([
                "status" => "ok",
                "mensaje" => "Login correcto",
                "numAvisos" => $numAvisos,
                "usuario" => [
                    "id" => $usuario["id"],
                    "nombre" => $usuario["nombre"],
                    "email" => $usuario["email"],
                    "admin" => ($usuario["admin"] == 1)
                ]
            ]);
        } else {
            // Contraseña incorrecta
            echo json_encode(["status" => "error", "mensaje" => "Contraseña incorrecta"]);
        }
    } else {
        // Usuario no encontrado por email
        echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado"]);
    }
} catch (PDOException $e) {
    // Error de base de datos
    echo json_encode(["status" => "error", "mensaje" => "Error al buscar usuario: " . $e->getMessage()]);
}
?>
