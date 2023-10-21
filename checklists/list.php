<?

$dir    = __DIR__;

$all = array();

if (isset($_GET['category'])) {
    $categories = array($_GET['category']);
} else {
    $categories = scandir($dir, SCANDIR_SORT_ASCENDING);
}

foreach ($categories as $category) {
    if (substr($category, 0, 1) == '.') {
        continue;
    }

    if (!is_dir($dir . '/' . $category)) {
        continue;
    }

    $d = $dir . '/' . $category . '/';
    
    $checklists = scandir($d, SCANDIR_SORT_ASCENDING);
    
    foreach ($checklists as $checklist) {
        if (strtolower(substr($checklist, -5)) != '.yaml') {
            continue;
        }

        $checklist = substr($checklist, 0, -5);

        if (!isset($all[$category])) {
            $all[$category] = array();
        }

        //echo $category . ' ' . $checklist . "\n";
        $all[$category][] = $checklist;
    }
}


header('Content-Type: application/json; charset=utf-8');

echo json_encode($all);
?>