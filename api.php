<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data = json_decode(file_get_contents("php://input"), true);
$config = $data['dbConfig'] ?? null;

if (!$config) {
    echo json_encode(["success" => false, "message" => "No configuration provided"]);
    exit;
}

try {
    $host = $config['host'];
    $dbname = $config['dbName'];
    $user = $config['user'];
    $pass = $config['pass'];

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // إنشاء الجداول تلقائياً في حال عدم وجودها
    $pdo->exec("CREATE TABLE IF NOT EXISTS site_data (
        id VARCHAR(50) PRIMARY KEY,
        content LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    if ($data['action'] === 'sync') {
        $table = $data['table'];
        $content = json_encode($data['content'], JSON_UNESCAPED_UNICODE);
        
        $stmt = $pdo->prepare("INSERT INTO site_data (id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?");
        $stmt->execute([$table, $content, $content]);
        
        echo json_encode(["success" => true]);
    } 
    else if ($data['action'] === 'fetch_all') {
        $stmt = $pdo->query("SELECT id, content FROM site_data");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $finalData = [];
        foreach ($results as $row) {
            $finalData[$row['id']] = json_decode($row['content'], true);
        }
        echo json_encode(["success" => true, "data" => $finalData]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>