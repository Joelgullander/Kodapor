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

    switch ($target) {

      case 'login':

        $q = $connection -> prepare("CALL login(?,?)");
        $q -> execute($input['logindata']);
        
        $response = json_encode($q -> fetchAll(PDO::FETCH_ASSOC)[0]);
        
        if($response != [0]){
          $_SESSION["LoginHandlerCurrentUser"] = $response;
        }

        exit($response);
      
      case 'search':

        $q = $connection -> prepare("CALL search(?,?,?,?,?,?,?,?)");
        $q -> execute($input['criteria']);
        
        $hits = $q -> fetchAll(PDO::FETCH_ASSOC);
        exit(json_encode($hits));

      case 'account':

        $q = $connection -> prepare("CALL create_account(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $q -> execute($input['userdata']);

        exit;

      case 'advertisement':
        
        $get_id = "SELECT LAST_INSERT_ID() INTO @created_id;";
        $id = "@created_id";

        /* Fall-through:
        *  Advertisements and profiles can share the SQL statements for creating entries, since the code need only to loop through 
        *  the user-supplied fields for respective table. But since the advertisement table's primary key is autoincremented,
        *  it will be created with the insert statement below and need to be retrieved for twofold use in connecting the metadata 
        *  (tags and categories). The profile table will share it's primary key (content_id) with the account and user 
        *  tables (user_id), and therefore it's value already exists and is supplied as the user_id of the url.  
        */ 

      case 'profile':
      
        $sql = $get_id ? "INSERT INTO $target (" : "INSERT INTO $target (content_id,";
        $values = $get_id ? " VALUES ('" : " VALUES ('$id','";

        foreach ($input as $key => $value) {
          $sql .= $key . ",";
          $values .= $value . "','";
        }
        $sql = substr($sql,0,-1) . ")" . substr($values, 0,-2) . ");" . $get_id;
        
        if(isset($input['categories'])) {
          $sql .= "INSERT INTO category_".$target."_map (base,connect) SELECT category_id,".$id." FROM category WHERE category_id IN(".$input['categories'].");";
        }
        if(isset($input['tags'])) {
          $sql .= "INSERT INTO tag_".$target."_map (base,connect) SELECT tag_id,".$id." FROM tag WHERE tag_id IN(".$input['tags'].");";
        }
        
        $q = $connection->prepare($sql);
        $q -> execute(); 
        exit;
    } 
  }


                  /***************************************
                  *                                      *
                  *                 READ                 *
                  *                                      *
                  ***************************************/

  elseif ($method == "GET") {

    switch ($target) { 

      case "login":    // Check if there is a current login session, and if so return user account data
     
        if (!isset($_SESSION["LoginHandlerCurrentUser"])){
          exit("false"); 
        }
        exit($_SESSION["LoginHandlerCurrentUser"]);
    

      case "meta": // Fetch and send to webbapp all category names and tag names + two-way-mappings name->id,id->name. 
                   // pseudo JSON created by stored procedure in db will contain for evaluation:
                   // "{ 
                   //   'category_map': {'cat_name-1':'cat_id-1(primary key)','cat_id-1':'cat_name-1','cat_name-2':'cat_id-2'...}, 
                   //   'categories':   ['cat_name-1','cat_name-2',...],
                   //   'tag_map':      {...as for categories...},
                   //   'tags':         [...as for categories...]
                   // }" 
        
        $q = $connection->prepare("CALL fetch_meta_items();");
        $q -> execute();
        exit(json_encode($q->fetchAll(PDO::FETCH_ASSOC)[0]));

      case "advertisements": // OBS! Pluralis. Get all of a users advertisements - compared to user_id
        $q = $connection->prepare("SELECT * FROM advertisement WHERE user_id = $id;");
        $q -> execute();
        exit(json_encode($q->fetchAll(PDO::FETCH_ASSOC)));

      case "advertisement": // OBS Singularis. Get single advertisement - compared to ads content_id
      case "profile": 

        $q = $connection->prepare("SELECT * FROM $target WHERE content_id = $id;");
        $q -> execute();
        exit(json_encode($q->fetchAll(PDO::FETCH_ASSOC)[0]));

      case "testusers": 

        // Only for developement stage and testing. Retrieves names and passwords of 5 persons and 5 companies
        // to be displayed on the login page with a button for direct login 
        $response = array();
        function setTableRow ($username,$password) {
          return array($username,$password);
        }
        $sql = "SELECT a.username,a.password FROM account a INNER JOIN user u ON a.user_id=u.user_id WHERE u.company_tax=b'0' LIMIT 5;";
        $q = $connection->prepare($sql);
        $q -> execute();
        $response = $q -> fetchAll(PDO::FETCH_FUNC, 'setTableRow');
        $sql = "SELECT a.username,a.password FROM account a INNER JOIN user u ON a.user_id=u.user_id WHERE u.company_type='Aktiebolag' LIMIT 5;";
        $q = $connection->prepare($sql);
        $q -> execute();
        $response = array_merge($response, $q -> fetchAll(PDO::FETCH_FUNC, 'setTableRow'));

        exit(json_encode($response));
    } 
    
  }

                  /***************************************
                  *                                      *
                  *               UPDATE                 *
                  *                                      *
                  ***************************************/

  elseif ($method == "PUT" || $method == "PATCH") {

    function update ($table) {
      
      global $connection, $input, $method, $primaryKey, $id;
      
      $sql = "DESCRIBE $table;";// "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'coderspool' AND TABLE_NAME = '$table';";
      $q = $connection->prepare($sql);
      $q->execute();
      
      $keys = $q->fetchAll(PDO::FETCH_COLUMN);
     
      $sql = "UPDATE $table SET ";
      $setStatements = "";
      foreach ($keys as $key) {
        
        if (isset($input[$key])) 
          $setStatements .= $key . " = '" . $input[$key] . "',";
       
        elseif ($method == "PUT") 
          $setStatements .= $key . " = NULL,";
        
      }
      if (strlen($setStatements) == 0) {
        return;
      }

      $sql = substr($sql.$setStatements,0,-1) . " WHERE $primaryKey = '$id';";

      $q = $connection->prepare($sql);
      $q -> execute();
      
      // Should make error check if any column set to NOT NULL?
    }

    switch($target) {
      case "account":
        $primaryKey = "user_id";
        update('user');
        break;
      default: 
        $primaryKey = "content_id";
    };

    update($target);
  }
  
                  /***************************************
                  *                                      *
                  *               DELETE                 *
                  *                                      *
                  ***************************************/

  elseif ($method == "DELETE") {

    switch($target) {

      case "logout":  // DELETE session
        
        unset($_SESSION["LoginHandlerCurrentUser"]);
        // return true to show that we succeeded
        exit("true");
    
      case "advertisements":
      case "advertisement":
      case "profile":
      case "user":

        $q = $connection -> pepare("CALL delete_entry(?,?)");
        $q -> execute(array($target,$id));
        break;
    }
  }

  

  

  
