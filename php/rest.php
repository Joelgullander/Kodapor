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

    if ($target == "login"){

    }
    if ($target == "user_person") { // CREATE user_person account
      checkIfOccupied($target, $id);
      $sql = "INSERT INTO account (username,email,password,user_table) VALUES ('".$id."','".$input['email']."','".$input['password']."','".$target."');". 
        "INSERT INTO $target (username,firstname,lastname,birthdate,company_tax,company_name,phone) VALUES "."('".$id."','".$input['firstname']."','".
        $input['lastname']."','".$input['birthdate']."','".$input['company_tax']."','".$input['company_name']."','".$input['phone']."');"; 
    }
    elseif ($target == "user_company") { // CREATE user_company account
      checkIfOccupied($target, $id);
      $sql = "INSERT INTO account (username,email,password,user_table) VALUES ('".$id."','".$input['email']."','".$input['password']."','".$target."');".
        "INSERT INTO $target (username,name,contact_person,phone) VALUES ('".$id."','".$input['name']."','".$input['contact_person'].$input['phone']."');";
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

  function checkIfOccupied($table, $username) {
    global $connection;
    $q = $connection -> prepare(
      "SELECT COUNT(*) as count FROM $table ".
      "WHERE username = '$id' "
    );
    $q -> execute();
    $r = $q -> fetchAll();
    var_dump($r[0]['count']);
    if($r[0]["count"] !== '0'){
      // user exists so no go
      var_dump($username);
      echo ("Användarnamnet är upptaget. Försök igen med annat namn!");
    }

  }  

  // READ

  if ($method == "GET") {
    
    $response = array();

    if (substr($target,0,4) == "user") {  // Requests from registration and account view
      
      $id = urldecode($id);
      $sql = "SELECT * FROM account WHERE username = '$id';";// 
      $q = $connection->prepare($sql);
      $q -> execute();
      $response = $q -> fetchAll(PDO::FETCH_ASSOC)[0];
      if ($response !== false) {
        $sql = "SELECT * FROM " . $target . " WHERE username = '$id';";
        $q = $connection->prepare($sql);
        $q -> execute();
        $response['password'] = "It's a secret."; // slice away this..
        $response = array_merge($response, $q -> fetchAll(PDO::FETCH_ASSOC)[0]);
        die(json_encode($response));
      }
      die("Not found");
    }

    if (substr($target,0,7) == "profile") {  // Requests from profile view

      $id = urldecode($id);
      $sql = "SELECT * FROM $target WHERE username = '$id';"; 
      $q = $connection->prepare($sql);
      $q -> execute();
      $response = $q -> fetchAll(PDO::FETCH_ASSOC)[0];
      die(json_encode($response));
    }

    if ($target == "browse") {
      // The hard one... Matching
    }

    if ($target == "testusers") {
      // Only for developement stage and testing. Puts name-passwd of 5 persons and 5 companies
      // to login page with button for direct login 
      $response = array();
      function setTableRow ($username,$password) {
        return array($username,$password);
      }
      $sql = "SELECT username,password FROM account WHERE user_table = 'user_person' LIMIT 5;";
      $q = $connection->prepare($sql);
      $q -> execute();
      $response = $q -> fetchAll(PDO::FETCH_FUNC, 'setTableRow');
      $sql = "SELECT username,password FROM account WHERE user_table = 'user_company' LIMIT 5;";
      $q = $connection->prepare($sql);
      $q -> execute();
      $response = array_merge($response, $q -> fetchAll(PDO::FETCH_FUNC, 'setTableRow'));

      die(json_encode($response));
    }

  }

  // UPDATE --  PUT or PATCH

  if ($method == "PUT" || $method == "PATCH") {

    update($target);

    if (substr($target,0,4) == "user") {
      update('account');
    }
  }

  function update ($table) {
    global $connection, $input, $method, $id;
    $sql = "DESCRIBE $table;";// "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'coderspool' AND TABLE_NAME = '$table';";
    $q = $connection->prepare($sql);
    $q->execute();
    $keys = $q->fetchAll(PDO::FETCH_COLUMN);
    $sql = "UPDATE $table SET ";

    foreach ($keys as $key) {
      if (isset($input[$key])) {
        $sql .= $key . " = '" . $input[$key] . "',";
      }
      elseif ($method == "PUT") {
        $sql .= $key . " = NULL,";
      }
    }
    $sql = substr($sql,0,-1) . " WHERE username = '$id';";

    $q = $connection->prepare($sql);
    $q -> execute();

    // Should make rror check if any column set to NOT NULL
  
  }

  // DELETE

  if ($method == "DELETE") {
    $sql;
    if (substr($target,0,4) == "user") { // Complete delete of user account
      $sql = "DELETE FROM map_tag_user WHERE connect = '$id';";
      $sql .= "DELETE FROM map_category_user WHERE connect = '$id';";
      $sql .= "DELETE FROM advertisement WHERE username = '$id';"; // FIX orphan risk
      $sql .= "DELETE FROM profile_person WHERE username = '$id';";
      $sql .= "DELETE FROM profile_company WHERE username = '$id';";
      $sql .= "DELETE FROM $target WHERE username = '$id';";
      $sql .= "DELETE FROM account WHERE username = '$id';";
    }
    if (substr($target,0,7) == "profile") { // Delete only profile data, preserve account
      $sql = "DELETE FROM profile_person WHERE username = '$id';";
      $sql .= "DELETE FROM profile_company WHERE username = '$id';";
    }
    var_dump($sql);
    $q = $connection->prepare($sql);
    $q -> execute();
  }

  

  function create_metadata($bindMe) {
    global $connection, $input;
    if(!isset($input['meta'])) return null;

    $keyOffset = array_search('meta', array_keys($input));
    $meta = array_values(array_splice($meta, $keyOffset, 1));

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