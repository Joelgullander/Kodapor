<?php

  session_start();

  $host = "localhost";
  $db = "coderspool";
  try {
    $connection = new PDO(
      "mysql:host=$host;dbname=$db;charset=utf8", 
      "root", 
      "",
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

  $id = urldecode(array_pop($urlFragments));
  $target = array_pop($urlFragments);

  $sql;
  $response;
  
                  /***************************************
                  *                                      *
                  *                CREATE                *
                  *                                      *
                  ***************************************/

  if ($method == "POST") {

    if ($target == "login"){ // CREATE session

      $sql = "SELECT COUNT(*) as count, user_table FROM account WHERE username = '$id' && password = '".$input['password']."'";
      $q = $connection -> prepare($sql); 

      // check if login is ok
      $q -> execute();
      $r = $q -> fetchAll();

      if($r[0]["count"] == 0){
        // combination of username and password does not exist
        // so no go
        die("false");
      }
      $table = $r[0]['user_table'];
      $name = $table == "user_person" ? "t.firstname, CONCAT(t.firstname,' ',t.lastname) as name" : "t.name";
      $sql = "SELECT $name FROM $table t WHERE t.username = '$id'";

      $response = array();
      $q = $connection -> prepare($sql);  
      $q -> execute();
      $response = $q -> fetchAll(PDO::FETCH_ASSOC)[0];
      $response["username"] = $id;
      $response["user_table"] = $table;
      // store the user in a session variable
      $_SESSION["LoginHandlerCurrentUser"] = json_encode($response);
     
      die(json_encode($response));
    }
    if ($target == "user_person") { // CREATE account user_person 
      checkIfOccupied($target, $id);
      $sql = "INSERT INTO account (username,email,password,user_table) VALUES ('".$id."','".$input['email']."','".$input['password']."','".$target."');". 
        "INSERT INTO $target (username,firstname,lastname,birthdate,company_tax,company_name,phone) VALUES "."('".$id."','".$input['firstname']."','".
        $input['lastname']."','".$input['birthdate']."','".$input['company_tax']."','".$input['company_name']."','".$input['phone']."');"; 
    }
    elseif ($target == "user_company") { // CREATE account user_company 
      checkIfOccupied($target, $id);
      $sql = "INSERT INTO account (username,email,password,user_table) VALUES ('".$id."','".$input['email']."','".$input['password']."','".$target."');".
        "INSERT INTO $target (username,name,contact_person,phone) VALUES ('".$id."','".$input['name']."','".$input['contact_person'].$input['phone']."');";
    }
    elseif (substr($target,0,7) == "profile") { // CREATE profile (person or company)
      createMetadata('username', $input['username']);
      $sql = "INSERT INTO $target (";
      $values = " VALUES ('";
      foreach ($input as $key => $value) {
        $sql .= $key . ",";
        $values .= $value . "','";
      }
      $sql = substr($sql,0,-1) . ")";
      $values = substr($sql, 0,-2) . ");";
    }
    elseif ($target == "browse") { // CREATE match from search
      // The hard one...  
      $ors = "("; 
      $COMands = "";

      if ($input['inactive'] == "false") {
        $COMands .= "p.active = b'1' AND ";
      }
      if (isset($input['experience'])) {
        $COMands .= "p.experience >= ".$input['experience'] . " AND ";
      }
      foreach ($input['tags'] as $tag) {
        $ors .= "tg.name = '$tag' OR "; 
      };
      foreach ($input['categories'] as $cat) {
        $ors .= "c.name = '$cat' OR ";
      }
      $ors = substr($ors, 0,-4).")";

      if ($input['main'] == "profile") { // Profile search 

        $sql = $sqlPrologue = $sqlBridge = "";
        $sqlTail = "ORDER BY count DESC;"; 

        if (count($input['users']) == 2) {
          $sql = "SELECT * FROM (";
          $sqlBridge = "UNION ALL ";
          $sqlTail = ") combined ORDER BY count DESC;";
        }
        
        $profile = array_shift($input['users']);
        if ($profile == "profile_person") {
          if ($input['company_tax'] == "true") {
            $ands = $COMands . "t.company_tax = b'1'";
          }
          else {
            $ands = substr($COMands,0,-4);
          }
          $sql .= "SELECT COUNT(u.username) as count, u.username as username, CONCAT(u.firstname,' ',u.lastname) as name, p.snippet as snippet, p.image as image FROM user_person u ".
                  "INNER JOIN profile_person p ON u.username = p.username ".
                  "INNER JOIN map_tag_user mt ON p.username = mt.connect ".
                  "INNER JOIN tag tg ON mt.base = tg.id ".
                  "INNER JOIN map_category_user mc ON p.username = mc.connect ".
                  "INNER JOIN category c ON mc.base = c.id ".
                  "WHERE $ors AND $ands ".
                  "GROUP BY p.username $sqlBridge ";
          if ($input['company_tax'] == 1) {
            
          }
          $profile = array_shift($input['users']);
        }

        if ($profile == "profile_company") {
          $ands = substr($COMands,0,-4);
          $sql .= "SELECT COUNT(u.username) as count, u.username as username, u.name as name, p.snippet as snippet, p.image as image FROM user_person u ".
                  "INNER JOIN profile_company p ON u.username = p.username ".
                  "INNER JOIN map_tag_user mt ON p.username = mt.connect ".
                  "INNER JOIN tag tg ON mt.base = tg.id ".
                  "INNER JOIN map_category_user mc ON p.username = mc.connect ".
                  "INNER JOIN category c ON mc.base = c.id ".
                  "WHERE $ors AND $ands ".
                  "GROUP BY p.username ";  
        }    
        // die($sql);
        $q = $connection->prepare($sql);
        $q -> execute(); 
        $hits = $q -> fetchAll(PDO::FETCH_ASSOC);
        $response = array_slice($hits, 0, $input['amount']);
        $_SESSION["lastSearch"] = $hits;
/*
        $sql = "";
        foreach ($firstRound as $username) {
          $sql .= "SELECT t.username, $name, p.snippet, p.image FROM $table t INNER JOIN $profile p ON t.username = p.username WHERE t.username = '$username' UNION ";
        }       
        $sql = substr($sql, 0,-6).";";
        
        $q = $connection -> prepare($sql);

        $q -> execute();
        $response = $q -> fetchAll(PDO::FETCH_ASSOC);
*/
      }
      die(json_encode($response));
    }

    $q = $connection->prepare($sql);
    $q -> execute(); 
  }

  function checkIfOccupied($table, $username) {
    global $connection;
    $q = $connection -> prepare(
      "SELECT COUNT(*) as count FROM $table ".
      "WHERE username = '$username' "
    );
    $q -> execute();
    $r = $q -> fetchAll();
    if($r[0]["count"] != 0){
      // user exists so no go
      die("Användarnamnet är upptaget. Försök igen med annat namn!");
    }
  }  

  function createMetadata($bindMe) {
    global $connection, $input;
    if(!isset($input['meta'])) return null;

    $keyOffset = array_search('meta', array_keys($input));
    $meta = array_values(array_splice($meta, $keyOffset, 1));

    foreach ($meta as $table => $content) {
      $base = substr($table, 0, strpos($table, '_'));
      foreach ($content as $name) {
        $sql = "INSERT INTO $table (base,connect) VALUES ((SELECT id FROM $base WHERE name = '$name'), $bindMe);";
        $q->prepare($sql);
        $q->execute();
      }
    }
  }

                  /***************************************
                  *                                      *
                  *                 READ                 *
                  *                                      *
                  ***************************************/

  if ($method == "GET") {
    
    if ($target == "login") { // READ if there is a current login session
      if (!isset($_SESSION["LoginHandlerCurrentUser"])){
        die("false"); 
      }
      die($_SESSION["LoginHandlerCurrentUser"]);
    }

    $response = array();    

    if (substr($target,0,4) == "user") {  // READ user account (registration view)
      
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

    if (substr($target,0,7) == "profile") {  // READ profile (profile view)

      $id = urldecode($id);
      $sql = "SELECT * FROM $target WHERE username = '$id';"; 
      $q = $connection->prepare($sql);
      $q -> execute();
      $response = $q -> fetchAll(PDO::FETCH_ASSOC)[0];
      die(json_encode($response));
    }

    if ($target == "meta") {

      $sql = "SELECT name FROM category";
      $q = $connection -> prepare($sql);
      $q -> execute();
      $categories = $q -> fetchAll(PDO::FETCH_COLUMN);
      $sql = "SELECT name FROM tag";
      $q = $connection -> prepare($sql);
      $q -> execute();
      $tags = $q -> fetchAll(PDO::FETCH_COLUMN);
      $response = array("categories" => $categories, "tags" => $tags);
      die(json_encode($response));
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

  function getTags($id) {
    global $connection;
    $sql = "SELECT t.name FROM tag_user_map tm INNER JOIN tag t ON tm.base = t.id WHERE tm.connect = $id;";
    $q = $connection -> prepare($sql);
    $q -> execute();
    return $q -> fetchAll(PDO::FETCH_COLUMN);
  }

  function getCategories($id) {
    global $connection;
    $sql = "SELECT t.name FROM category_user_map cm INNER JOIN category c ON cm.base = c.id WHERE cm.connect = $id;";
    $q = $connection -> prepare($sql);
    $q -> execute();
    return $q -> fetchAll(PDO::FETCH_COLUMN);
  }


                  /***************************************
                  *                                      *
                  *               UPDATE                 *
                  *                                      *
                  ***************************************/

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

    // Should make error check if any column set to NOT NULL
  
  }
                  /***************************************
                  *                                      *
                  *               DELETE                 *
                  *                                      *
                  ***************************************/

  if ($method == "DELETE") {

    if ($target == "logout") { // DELETE session
      // delete user from session variables
      unset($_SESSION["LoginHandlerCurrentUser"]);
      // return true to show that we succeeded
      die("true");
    }

    $sql;
    
    if (substr($target,0,4) == "user") { // DELETE user account
      $sql = "DELETE FROM map_tag_user WHERE connect = '$id';";
      $sql .= "DELETE FROM map_category_user WHERE connect = '$id';";
      $sql .= "DELETE FROM advertisement WHERE username = '$id';"; // FIX orphan risk
      $sql .= "DELETE FROM profile_person WHERE username = '$id';";
      $sql .= "DELETE FROM profile_company WHERE username = '$id';";
      $sql .= "DELETE FROM $target WHERE username = '$id';";
      $sql .= "DELETE FROM account WHERE username = '$id';";
    }
    
    if (substr($target,0,7) == "profile") { // DELETE profile data, preserving account
      $sql = "DELETE FROM profile_person WHERE username = '$id';";
      $sql .= "DELETE FROM profile_company WHERE username = '$id';";
    }

    $q = $connection->prepare($sql);
    $q -> execute();
  }

  

  

  