<?php
// Permite peticiones desde el frontend (localhost:3000)
header("Access-Control-Allow-Origin:http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("conexion.php"); // Conexion a la base de datos

// Recoge datos enviados por POST
$nombre = $_POST['nombre'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;

// Patron de contraseña segura
$patronPass = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/';

// Validación básica y de seguridad para la contraseña
if ($nombre == null || $email == null || $password == null) {
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos"]);
    exit;
} else if (!preg_match($patronPass, $password)) {
    echo json_encode(["status" => "error", "mensaje" => "La contraseña no es segura. Debe contener al menos: 
    - Mínimo 8 caracteres
    - 1 Mayúscula
    - 1 minúscula
    - 1 número
    - 1 caracter especial"]);
    exit;
}

// Verifica si el email ya esta registrado
$sql_check_email = "SELECT COUNT(*) FROM usuarios WHERE email = :email";
$stmt_check_email = $pdo->prepare($sql_check_email);
$stmt_check_email->execute([":email" => $email]);
$email_exists = $stmt_check_email->fetchColumn();

if ($email_exists > 0) {
    echo json_encode(["status" => "error", "mensaje" => "El correo electrónico ya está registrado"]);
    exit;
}

try {
    // Encripta la contraseña antes de guardarla
    $password = password_hash($password, PASSWORD_DEFAULT);

    // Inserta al nuevo usuario (por defecto no es admin)
    $sql = "INSERT INTO usuarios (nombre, email, password, admin, fechaAlta) 
            VALUES (:nombre, :email, :password, 0 , NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":nombre" => $nombre,
        ":email" => $email,
        ":password" => $password
    ]);

    // Confirmación de registro
    echo json_encode(["status" => "ok", "mensaje" => "Usuario registrado"]);
} catch (PDOException $e) {
    // Error al insertar en la base de datos
    echo json_encode(["status" => "error", "mensaje" => "Error al registrar: " . $e->getMessage()]);
}
?>
