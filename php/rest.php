<?php
  $host = "localhost";
  $db = "coderspool";
  try {
    $connection = new PDO(
      "mysql:host=$host;dbname=$db;charset=utf8", 
      "sonix", 
      "coders",
      array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING)
    );
  }
  catch (PDOException $e) {
    echo '\nConnection failed: ' . $e->getMessage();
    exit;
  }

  $rawInput = file_get_contents("php://input");
  $input = json_decode($rawInput, true);

  $method = $_SERVER["REQUEST_METHOD"];
  $url = $_SERVER["REQUEST_URI"];

  // Split url into pieces
  $urlFragments = explode("/",$url);

  $id = array_pop($urlFragments);
  $target = array_pop($urlFragments);

  $sql;
  $response;
  
  // CREATE

  if ($method == "POST") {

    if ($target == "user_person") { // CREATE user_person account
      $sql = "INSERT INTO account (username,email,password,user_table) VALUES ('".$input['username']."','".$input['email']."','".$input['password']."','".$target."');". 
        "INSERT INTO $target (username,firstname,lastname,birthdate,company_tax,company_name,phone) VALUES "."('".$input['username']."','".$input['firstname']."','".
        $input['lastname']."','".$input['birthdate']."','".$input['company_tax']."','".$input['company_name']."','".$input['phone']."');"; 
    }
    elseif ($target == "user_company") { // CREATE user_company account
      $sql = "INSERT INTO account (username,email,password,user_table) VALUES ('".$input['username']."','".$input['email']."','".$input['password']."','".$target."');".
        "INSERT INTO $target (username,name,contact_person,phone) VALUES ('".$input['username']."','".$input['name']."','".$input['contact_person'].$input['phone']."');";
    }
    elseif (substr($target,0,7) == "profile") {
      create_metadata('username', $input['username']);
      $sql = "INSERT INTO $target (";
      $values = " VALUES ('";
      foreach ($input as $key => $value) {
        $sql .= $key . ",";
        $values .= $value . "','";
      }
      $sql = substr($sql,0,-1) . ")";
      $values = substr($sql, 0,-2) . ");";
    } 

    $q = $connection->prepare($sql);
    $q -> execute(); 
  }

  // READ

  if ($method == "GET") {
    
    if (substr($target,0,4) == "user") {  // Requests from registration and account view
      $response = array();
      $sql = "SELECT * FROM account WHERE username = '$id';";// 
      $q = $connection->prepare($sql);
      $q -> execute();
      $response = $q -> fetchAll(PDO::FETCH_ASSOC)[0];
      $sql = "SELECT * FROM " . $target . " WHERE username = '$id';";
      $q = $connection->prepare($sql);
      $q -> execute();
      array_merge($response, $q -> fetchAll(PDO::FETCH_ASSOC)[0]);
      $response['password'] = "not sent with response.";
      die(json_encode($response));
    }

    if (substr($target,0,7) == "profile") {  // Requests from profile view
      $response = array();
      var_dump($target);
      $sql = "SELECT * FROM $target WHERE username = '$id'; SELECT * FROM profile_company WHERE username = '$id';"; 
      $q = $connection->prepare($sql);
      $q -> execute();
      $response = $q -> fetchAll(PDO::FETCH_ASSOC)[0];
      die(json_encode($response));
    }

    if ($target == "browse") {
      // The hard one... Matching
    }

  }

  // UPDATE - PUT - PATCH

  if ($method == "PUT" || $method == "PATCH") {

    update($target);

    if (substr($target,0,4) == "user") {
      update('account');
    }
  }

  function update ($table) {

    $keys;
    if ($method == "PUT") {
      $sql = "DESCRIBE $table;";
      $q->prepare($sql);
      $q->execute();
      $keys = $q->fetchColumn();
    }
    else {
      $keys = $input;
    }

    $sql = "UPDATE $table SET ";

    foreach ($keys as $key) {
      if (isset($input[$key])) {
        $sql .= $key . " = '" . $input[$key] . "',";
      }
      elseif ($method == "PUT") {
        $sql .= $key . " = NULL,";
      }
    }
    $sql = substr($sql,0,-1) . ")";

    $q = $connection->prepare($sql);
    $q -> execute();

    // Error check if any column set to NOT NULL
  
  }

  // DELETE

  if ($method == "DELETE") {
    if (substr($target,0,4) == "user") { // Complete delete of user account
      $sql = "DELETE FROM map_tag_user WHERE username = '$id';";
      $sql .= "DELETE FROM map_category_user WHERE username = '$id';";
      $sql .= "DELETE FROM advertisement WHERE username = '$id';"; // FIX orphans
      $sql .= "DELETE FROM $target WHERE username = '$id';";
      $sql .= "DELETE FROM profile_person WHERE username = '$id';";
      $sql .= "DELETE FROM profile_company WHERE username = '$id';";
      $sql .= "DELETE FROM account WHERE username = '$id';";
    }
    if (substr($target,0,7) == "profile") { // Delete only profile data, preserve account
      $sql = "DELETE FROM profile_person WHERE username = '$id';";
      $sql .= "DELETE FROM profile_company WHERE username = '$id';";
    }
    $q = $connection->prepare($sql);
    $q -> execute();
  }

  

  function create_metadata($bindMe) {
    if(!isset($input['meta'])) return null;

    $keyOffset = array_search('meta', array_keys($input));
    $meta = array_values(array_splice($array, $keyOffset, 1));

    foreach ($meta as $table => $content) {
      $base = substr($table, 0, strpos($table, '_'));
      foreach ($content as $name) {
        $q = $connection->prepare("SELECT id FROM $base WHERE name = '$name'");
        $q->execute();
        if ($q->rowCount <= 0) {
          // Tag/Category not found. Allow user created tags? How to check validity?
          return;
        }
        $base_id = $q->fetchColumn();
        $sql = "INSERT INTO $table (connect) VALUES ($bindMe) WHERE base = $base_id;";
        $q->prepare($sql);
        $q->execute();
      }
    }

  }