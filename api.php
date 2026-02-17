<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$config = $data['dbConfig'] ?? null;

if (!$config || empty($config['host'])) {
    echo json_encode(["success" => false, "message" => "Database configuration missing."]);
    exit;
}

try {
    $host = $config['host'];
    $dbname = $config['dbName'];
    $user = $config['user'];
    $pass = $config['pass'];

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // إنشاء الجدول المركزي عند أول اتصال
    $pdo->exec("CREATE TABLE IF NOT EXISTS site_content (
        id VARCHAR(100) PRIMARY KEY,
        json_data LONGTEXT NOT NULL,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    if ($data['action'] === 'sync') {
        $table = $data['table'];
        $content = json_encode($data['content'], JSON_UNESCAPED_UNICODE);
        
        $stmt = $pdo->prepare("INSERT INTO site_content (id, json_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE json_data = ?");
        $stmt->execute([$table, $content, $content]);
        
        echo json_encode(["success" => true]);
    } 
    else if ($data['action'] === 'fetch_all') {
        $stmt = $pdo->query("SELECT id, json_data FROM site_content");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $finalData = [];
        foreach ($results as $row) {
            $finalData[$row['id']] = json_decode($row['json_data'], true);
        }
        echo json_encode(["success" => true, "data" => $finalData]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "MySQL Connection Error: " . $e->getMessage()]);
}
?>