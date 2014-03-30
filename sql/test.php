<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>PHP-test</title>
    <script src="../js/libs/jquery.js"></script>
    <script>
      var user = {'userdata':["Andreas","ab@live.se","123456","Andreas","Benatti","790512","Torggatan 34","23361","Bara","0736211454","null",0,"null","null","null","null"]}; 
      $.ajax({ 
        method:'POST',
        url:'../php/rest.php/account/',
        data: JSON.stringify(user)
      });
    </script>
  </head>

  <body>
  <p>Testplatta för php-satser</p>
  <?php
  
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
    // Create account - tested, works
  /*  
    $userdata = array(
      "sampa",
      "manka@gmail.com",
      "hello",
      "Samuel",
      "Magnusson",
      "7503016219",
      "Fosievägen 31A",
      "214 31",
      "Malmö",
      "NULL",
      "0700908439",
      "1",
      "Enskild firma",
      "NULL",
      "7503016219",
      "1"
    );
    echo("Hello!");
    $q = $connection -> prepare("CALL create_account(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);");
    $q -> execute($userdata);

    // Create profile - tested, works
    /*
    $target = "profile";
    $id = 1040;
    $input = array(
      "active_out" => "1","active_in" => "1","visible" => "1","display_name" => "Samuel Magnusson",
      "content" => "Hej! Jag är programmerare och pianist. Lorem ipsum dolores clairborn. asdfasf df ad asdf a asdf  asdf asdf asdf asd fhytj hbfa. asedfjgl dfl  .reggegl lrgwl lwergwls  wrg .wregwerg .wgrgw rg.erwgwrgw.wergwergj.werwrg  werg  wrg g re yhrtgr e wdsdgh .erg rg e fg sdfg gger g",
      "snippet" => "Snippety snopp, lorem ipsum hello adad f aadsfa  sadfasdf sadfd adsf asdfas.  ASdff fds dsfadsf asdf. adf fggsd gthej wg s. rgsdfg.",
      "categories" => "3,6,9",
      "tags" => "1,17,34,31",
      "experience" => "9",
      "cv" => "NULL","portrait" => "NULL","image_logo" => "NULL","image_view" => "NULL"
    );*/

    // Create advertisement tested, works
  
    /*
    $target = "advertisement";
    $get_id = "SELECT LAST_INSERT_ID() INTO @created_id;";
    $id = "@created_id";

    $input = array("content_type" => "service","user_id" => "1040", "heading" => "Jag är bäst, anställ mig!","content" => "Vill ni veta vad jag kan göra? Blabbeti blabb lorem ipsum mulett kulett i de dudass viorum. asasdf ahghfbn.ndfgndfgnn ndfgn ndgd dgn .ndfgn.dgndfgndg ndgn  rads mfg vsnytrm sagj sgh.",
      "snippet" => "Snopet sa den snöpta om snöppen trillar av. Då blir det en sån här liten text asadlk ksdfls vj rsd v. asdfj .opfv .sfdadd fFFFF",
      "categories" => "4,1,7","tags" => "11,12,13,14","active" => "1"
    );

  
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
    */

    /* // UPDATE account works 
    $target = "account";
    $method = "PATCH";
    $input = array("password" => "hellotheres");
    $id = 1040; */
/*
    $target = "profile";
    $method = "patch";
    $input = array("portrait"=>"imageRepo/profiles/profile-pic-300x291.jpg");
    $id = 1040;

    switch($target) {
      case "account":
        $primaryKey = "user_id";
        update('user');
        break;
      default: 
        $primaryKey = "content_id";
    };

    update($target);
  
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
      if (strlen($setStatements) == 0) return;
      //$sql .= $setStatements;
      $sql = substr($sql.$setStatements,0,-1) . " WHERE $primaryKey = '$id';";

      $q = $connection->prepare($sql);
      $q -> execute();

      // Should make error check if any column set to NOT NULL?
    }

    /*
    echo(json_encode($input));
      echo "<br><br>";
      echo(json_encode($sql));
*/
    $sql = "SELECT * FROM profile WHERE content_id = 13";  
    $q = $connection->prepare($sql);
    $q -> execute();
    echo(json_encode($q -> fetchAll(PDO::FETCH_ASSOC)[0]));
    
    /*Edit profile (update)*/

    

    /*Edit advertisement (update)*/

    
    
    
  ?>
  </body>

</html>
<!--
  // Fields for advertisement:

  content_type    ENUM('job_offer','service'),   
  user_id         INT(11),
  heading         VARCHAR(64),
  content         TEXT,
  snippet         VARCHAR(256),
  categories      VARCHAR(64),
  tags            VARCHAR(128),
                        
  active          BIT(1) NOT NULL DEFAULT b'0',

  // Fields for profile:
  
  content_id     (but not from frontend)

  active_out     
  active_in       
  visible         
  display_name    
  content         
  snippet         
  categories      
  tags            
  experience      
  cv              
  portrait        
  image_logo      
  image_view      
        
  // Fields for account table
  $input['username'],
  $input['email'],
  $input['password'],
  // Fields for user table
  $input['firstname'],
  $input['lastname'],
  $input['personal_id'],
  $input['street_address'],
  $input['postal_code'],
  $input['city'],
  $input['phone'],
  $input['cell_phone'],
  $input['company_tax'],
  $input['company_type'],
  $input['company_name'],
  $input['org_nr'],
  $input['company_size']
        -->