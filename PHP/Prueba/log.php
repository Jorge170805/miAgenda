<?php
// Funcion para escribir mensajes en un archivo de log
function writeLog($msg) {
    // Abre el archivo log.txt en modo append (crea si no existe)
    $logFile = fopen("log.txt", 'a') or die("Error creando archivo");

    // Escribe la fecha, hora y mensaje en una nueva linea
    fwrite($logFile, "\n" . date("d/m/Y H:i:s") . " " . $msg) or die("Error escribiendo en el archivo");

    // Cierra el archivo
    fclose($logFile);
}
?>
