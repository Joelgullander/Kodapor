

DROP DATABASE IF EXISTS coderspool;
CREATE DATABASE coderspool DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;

USE coderspool;

------------------------------------------------------------------------------------------------------------------------------
--
--                                          SECTION: Database schema
--
------------------------------------------------------------------------------------------------------------------------------



  -------------- Base tables ---------------

CREATE TABLE account (

  user_id         INT(11) AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(32) NOT NULL UNIQUE,
  email           VARCHAR(64) NOT NULL UNIQUE,
  password        VARCHAR(32) NOT NULL       

);

CREATE TABLE user (

  user_id         INT(11) PRIMARY KEY,

  -- For corporations the three following fields stores data for company agent/contact --

  firstname       VARCHAR(32) NOT NULL,
  lastname        VARCHAR(32) NOT NULL,
  personal_id     VARCHAR(16) NOT NULL, 
  
  -- Contact info

  street_address  VARCHAR(64) NOT NULL,
  postal_code     VARCHAR(16) NOT NULL,
  city            VARCHAR(32) NOT NULL,
  phone           VARCHAR(64),
  cell_phone      VARCHAR(64),

  -- Account type/business 

  company_tax     BIT(1)      NOT NULL,
  company_type    ENUM("Aktiebolag","Handelsbolag","Ekonomisk förening","Enskild firma"),
  company_name    VARCHAR(64),
  org_nr          VARCHAR(32),  
  company_size    INT(11),

  FOREIGN KEY (user_id) REFERENCES account(user_id)

);


  -------------- User related data ---------------

CREATE TABLE profile (

  content_id      INT(11) PRIMARY KEY,                  
  active_out      BIT(1) NOT NULL DEFAULT b'0',
  active_in       BIT(1) NOT NULL DEFAULT b'1',
  visible         BIT(1) NOT NULL DEFAULT b'0',
  display_name    VARCHAR(64),
  content         TEXT,
  snippet         TINYTEXT,
  categories      VARCHAR(64),
  tags            VARCHAR(128),
  experience      INT(11),
  cv              VARCHAR(256), -- URL
  portrait        VARCHAR(256), -- URL
  image_logo      VARCHAR(256), -- URL
  image_view      VARCHAR(256), -- URL
  date_created    DATE,                         -- generated when created --
  date_updated    DATE,                         -- generated when updated --

  -- one-to-one relation to user/account, shared primary key
  FOREIGN KEY (content_id) REFERENCES account(user_id)

);

CREATE TABLE advertisement (

  content_id      INT(11) AUTO_INCREMENT PRIMARY KEY,
  content_type    ENUM('job_offer','service'),   
  user_id         INT(11),
  heading         VARCHAR(64),
  content         TEXT,
  snippet         VARCHAR(256),
  categories      VARCHAR(64),
  tags            VARCHAR(128),
  date_publish    DATE,                         -- generated when activated first time--
  date_updated    DATE,                         -- generated when updated --
  date_expire     DATE,                         -- user supplied --
  active          BIT(1) NOT NULL DEFAULT b'0',

  -- many-to-one relation to user/account
  FOREIGN KEY (user_id) REFERENCES user(user_id)

);

            --------- METADATA ---------

  ----------- TAGS - Storage and mappings -----------

CREATE TABLE tag (

  tag_id          INT(11) AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(64) UNIQUE

);

CREATE TABLE tag_profile_map (

  base            INT(11),
  connect         INT(11),

  PRIMARY KEY   (base,connect),
  UNIQUE INDEX  (connect,base),
  FOREIGN KEY (base)      REFERENCES tag(tag_id),
  FOREIGN KEY (connect)   REFERENCES profile(content_id)

);


CREATE TABLE tag_advertisement_map (

  base            INT(11),
  connect         INT(11),
  
  PRIMARY KEY   (base,connect),
  UNIQUE INDEX  (connect,base),
  FOREIGN KEY (base)      REFERENCES tag(tag_id),
  FOREIGN KEY (connect)   REFERENCES advertisement(content_id)

);

  ------- CATEGORIES - Storage and mapping --------

CREATE TABLE category (

  category_id     INT(11) AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(64) UNIQUE

);

CREATE TABLE category_profile_map (
  
  base            INT(11),
  connect         INT(11),

  PRIMARY KEY   (base,connect),
  UNIQUE INDEX  (connect,base),
  FOREIGN KEY (base)     REFERENCES category(category_id),
  FOREIGN KEY (connect)   REFERENCES profile(content_id)

);

CREATE TABLE category_advertisement_map (
  
  base            INT(11),
  connect         INT(11),
  
  PRIMARY KEY   (base,connect),
  UNIQUE INDEX  (connect,base),
  FOREIGN KEY (base)      REFERENCES category(category_id),
  FOREIGN KEY (connect)   REFERENCES advertisement(content_id)

);

------------------------------------------------------------------------------------------------------------------------------
--
--                                               SECTION: Executable code
--
------------------------------------------------------------------------------------------------------------------------------

DELIMITER $$

------------------ TRIGGERS -------------------

CREATE TRIGGER ad_publish_insert 
  BEFORE INSERT ON advertisement
  FOR EACH ROW 
BEGIN
  IF NEW.active=b'1' THEN
    SET NEW.date_publish = (SELECT CURDATE());
  END IF;
END$$

CREATE TRIGGER ad_publish_update
  BEFORE UPDATE ON advertisement
  FOR EACH ROW
BEGIN
  IF NEW.active=b'1' AND OLD.date_publish IS NULL THEN
    SET NEW.date_publish = (SELECT CURDATE());
  ELSE 
    SET NEW.date_updated = (SELECT CURDATE());
  END IF; 
END$$

CREATE TRIGGER create_profile 
  BEFORE INSERT ON profile
  FOR EACH ROW 
BEGIN
  SET NEW.date_created = (SELECT CURDATE());
END$$

CREATE TRIGGER update_profile
  BEFORE UPDATE ON profile
  FOR EACH ROW
BEGIN
  SET NEW.date_updated = (SELECT CURDATE());
END$$


-------------------- EVENTS ---------------------

SET GLOBAL event_scheduler = ON$$

CREATE EVENT manage_ad_publishing
ON SCHEDULE EVERY 1 DAY 
STARTS (SELECT CONCAT_WS(' ',DATE_ADD(CURDATE(), INTERVAL 1 DAY),'00:00:00'))
DO BEGIN
  DECLARE today DATE;
  SELECT CURDATE() INTO today;
  -- publish according to maturing dates
  UPDATE advertisement SET active=b'1' WHERE date_publish >= today;
  -- remove according to expire dates 
  UPDATE advertisement SET active=b'0' WHERE date_expire >= today;
END$$

--------------- STORED PROCEDURES ---------------
--
--    Contents:
--    
--    search
--    fetch_meta_items
--    login
--    create_account
--    delete_entry
--




--------------- search procedure ----------------


DROP PROCEDURE IF EXISTS search$$

CREATE PROCEDURE search (

  main          VARCHAR(16),
  categories    VARCHAR(768),
  tags          VARCHAR(768),
  inactive      INT(11),
  company_tax   INT(11),
  company_type  INT(11),
  experience    INT(11),
  text_search   TINYTEXT

)

BEGIN
  
  -- TODO:
  -- text search

  SET @conditions := (

    SELECT 

    CONCAT_WS(" ","AND p.visible=b'1'", -- Always only show profiles set to visible status
    IF(inactive='1',NULL,"AND p.active_out=b'1'"), -- If set, show results even if not active 
    IF(company_tax='1',"AND u.company_tax=b'1'",NULL), -- If set, only show companies
    IF(company_type>0,CONCAT("AND u.company_type IN(",MAKE_SET(company_type,"'Aktiebolag'","'Enskild firma'","'Handelsbolag'","'Ekonomisk förening'"),")"),NULL), -- Only include companys of given type
    IF(experience>0,CONCAT("AND p.experience>=",experience),NULL)) -- If lower limit of experience is set

  );

  -- Construct the query with dynamic SQL

  IF main = "profile" THEN

    SET @sql_main := (

      SELECT CONCAT_WS(" ",

        "SELECT 
          COUNT(cu.connect)+IFNULL(B.count,0) AS count, 
          p.* 

        FROM user u 
        INNER JOIN category_profile_map cu ON cu.connect=u.user_id 
        INNER JOIN category c ON cu.base=c.category_id 
        LEFT JOIN (

          SELECT 
            count(tu.connect) AS count, 
            tu.connect AS id 
          
          FROM tag_profile_map tu 
          INNER JOIN tag t ON tu.base=t.tag_id 
          WHERE t.tag_id IN(",tags,") GROUP BY id

        ) B ON B.id=u.user_id 
        INNER JOIN profile p ON p.content_id=u.user_id 
        WHERE c.category_id IN(",categories,")",@conditions,
        " GROUP BY u.user_id ORDER BY count DESC")

    );

  ELSEIF main = "advertisement" THEN

    SET @sql_main := (

      SELECT CONCAT_WS(" ",

        "SELECT 

          COUNT(ca.connect)+IFNULL(B.count,0) AS count, 
          ad.*, 
          IFNULL(p.image_logo,p.portrait) AS image, 
          p.display_name
    
        FROM advertisement ad 
        INNER JOIN user u ON ad.user_id = u.user_id
        INNER JOIN category_advertisement_map ca ON ad.content_id = ca.connect 
        INNER JOIN category c ON ca.base = c.category_id
        LEFT JOIN (

          SELECT 
            COUNT(ta.connect) AS count, 
            ta.connect AS id 

          FROM tag_advertisement_map ta 
          INNER JOIN tag t ON ta.base=t.tag_id
          WHERE t.tag_id IN(",tags,") GROUP BY id

        ) B ON B.id=ad.content_id 
        INNER JOIN profile p ON p.content_id=ad.user_id
        WHERE c.category_id IN(",categories,")",@conditions,
        " GROUP BY ad.content_id ORDER BY count DESC"));

  END IF;

  -- SELECT @sql_main; -- Uncomment for debugging query. If called from PHP this will only return query, but from mysql-client (and probably phpMyAdmin) you can see both query and result. Don't forget to comment again!

  -- Execute the query and exit

  PREPARE stmt FROM @sql_main;
  EXECUTE stmt; 
  DEALLOCATE PREPARE stmt;

END$$




---------- fetch_meta_items procedure ----------

CREATE PROCEDURE fetch_meta_items ()

BEGIN
  
  SET group_concat_max_len=2048; -- May need to be reset to higher value again if number of tag/categories is increased in future...

  -- Create JSON string of meta item names, and also mappings name -> id and id -> name for use in MetaService  --

  SELECT CONCAT (     
    (SELECT CONCAT("{'category_map':{'",GROUP_CONCAT(name,"':'",category_id,"','",category_id,"':'", name SEPARATOR "','"),"'},'categories':['",GROUP_CONCAT(name SEPARATOR "','"),"'],") FROM category),      
    (SELECT CONCAT("'tag_map':{'",GROUP_CONCAT(name,"':'",tag_id,"','",tag_id,"':'",name SEPARATOR "','"),"'},'tags':['",GROUP_CONCAT(name SEPARATOR "','"),"']}") FROM tag)
  ) AS meta_items;

END$$


--------------- login prodedure -----------------

CREATE PROCEDURE login (

  identifier      VARCHAR(64), 
  password        VARCHAR(32)

)

BEGIN
  
  DECLARE   user_id   INT(11);
  DECLARE   username  VARCHAR(32);
  DECLARE   email     VARCHAR(64);

  SELECT a.user_id,a.username,a.email FROM account a WHERE a.username=identifier OR a.email=identifier AND a.password=password INTO user_id,username,email;

  IF user_id IS NULL THEN
    SELECT 0;
  ELSE
    
    -- Send all userdata to the application for session storage --

    SELECT username, email, u.*, p.* FROM user u INNER JOIN profile p ON u.user_id = p.content_id WHERE u.user_id=user_id;
  END IF;

END$$

------------- create account procedure --------------

CREATE PROCEDURE create_account (

  -- Parameters for account table --
  username          VARCHAR(32),
  email             VARCHAR(64),
  password          VARCHAR(32),

  -- Parameters for user table --
  firstname         VARCHAR(32),
  lastname          VARCHAR(32),
  personal_id       VARCHAR(16),
  street_address    VARCHAR(64),
  postal_code       VARCHAR(16),
  city              VARCHAR(32),
  phone             VARCHAR(64),
  cell_phone        VARCHAR(64),
  company_tax       TINYINT,
  company_type      VARCHAR(32),
  company_name      VARCHAR(64),
  org_nr            VARCHAR(32),
  company_size      INT(11)
)

processing: BEGIN
  
  -- CHECK if username already taken or email used for exisiting account --

  SELECT IF(a.username=username,"Användarnamnet är upptaget. Försök igen med annat namn!",NULL),
         IF(a.email=email,"Epostadressen är ogiltig.",NULL) 
  FROM account a 
  WHERE a.username=username OR a.email=email
  INTO @username_error, @email_error; 

  -- IF so, send error messages and exit procedure --

  IF @username_error IS NOT NULL OR @email_error IS NOT NULL THEN
    SELECT @username_error AS username_error, @email_error AS email_error;
    LEAVE processing;
  END IF;

  -- ELSE proceed with inserting the new data --

  INSERT INTO account (username,email,password) VALUES (username,email,password);
  
  INSERT INTO user (user_id,firstname,lastname,personal_id,street_address,postal_code,city,phone,cell_phone,company_tax,company_type,company_name,org_nr,company_size)
   VALUES (LAST_INSERT_ID(),firstname,lastname,personal_id,street_address,postal_code,city,phone,cell_phone,company_tax,company_type,company_name,org_nr,company_size);

END$$


---------------- delete procedure ------------------

CREATE PROCEDURE delete_entry(

  target          VARCHAR(16),
  entry           INT(11)

)

BEGIN

  IF target LIKE "advertise%" OR target = "account" THEN
    IF target = "account" OR target = "advertisements" THEN
      DELETE FROM category_advertisement_map WHERE connect IN(SELECT content_id FROM advertisement WHERE user_id = entry);
      DELETE FROM tag_advertisement_map WHERE connect IN(SELECT content_id FROM advertisement WHERE user_id = entry);
      DELETE FROM advertisement WHERE user_id = entry;
    ELSE
      DELETE FROM category_advertisement_map WHERE connect = entry;
      DELETE FROM tag_advertisement_map WHERE connect = entry;
      DELETE FROM advertisement WHERE content_id = entry;
    END IF;
  END IF;

  IF target = "profile" OR target = "account" THEN
    DELETE FROM category_profile_map WHERE connect = entry;
    DELETE FROM tag_profile_map WHERE connect = entry;
    DELETE FROM profile WHERE content_id = entry;
  END IF;

  IF target = "account" THEN
    DELETE FROM user WHERE user_id = entry;
    DELETE FROM account WHERE user_id = entry;
  END IF;

END$$

-------------------------------------------------------------------------------------------------------------------------------

DELIMITER ;
