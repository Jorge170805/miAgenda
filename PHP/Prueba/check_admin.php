<?php 
// Obtiene el valor que indica si el usuario es admin desde la sesion
$admin = $_SESSION['usuario_admin'];

// Si el usuario no es admin, devuelve un error en formato JSON y detiene la ejecucion
if (!$admin) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Permisos Insuficientes"
    ]);
    exit();
}
?>