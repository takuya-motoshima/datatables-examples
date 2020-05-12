<?php

// Get parameters
$draw = $_GET['draw'];// This is used by DataTables to ensure that the Ajax returns from server-side processing requests are drawn in sequence by DataTables (Ajax requests are asynchronous and thus can return out of sequence). This is used as part of the draw return parameter.
$offset = $_GET['start'];// 
$limit = $_GET['length'];
$searchValue = $_GET['search']['value'];
$sortColumnIndex = $_GET['order'][0]['column'];
$sortColumn = $_GET['columns'][$sortColumnIndex]['data'];
$sortOrder = $_GET['order'][0]['dir'];

// Get all the rows
$rows = json_decode(file_get_contents('data.json'), true);

// Sort rows
array_multisort(array_column($rows, $sortColumn), $sortOrder === 'asc' ? SORT_ASC : SORT_DESC, $rows);

// Get only the lines that match the search word
if (!empty($searchValue)) {
  $rows = array_filter($rows, function(array $columns) use($searchValue) {
    foreach($columns as $column) {
      if(strpos($column, $searchValue) !== false) {
        return true;
      }
    }
    return false;
  });
}

// Get a page of rows
$list = array_slice($rows, $offset, $limit);
$total = count($rows);

// Return data as JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
  'draw' => $draw,
  'total' => $total,
  'list' => $list
]);