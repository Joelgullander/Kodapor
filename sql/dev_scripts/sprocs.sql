USE coderspool;

DELIMITER $$

DROP PROCEDURE IF EXISTS search;

CREATE PROCEDURE search
(
  main          VARCHAR(16),
  ptable        VARCHAR(8),
  categories    VARCHAR(768),
  tags          VARCHAR(768),
  inactive      VARCHAR(8),
  company_tax   VARCHAR(8),
  experience    INT(11)
)
BEGIN

  SET @sql_ands := (SELECT IFNULL(CONCAT_WS(" ",IF(inactive='1',NULL,"AND p.active=b'1'"),IF(company_tax='1',"AND u.company_tax=b'1'",NULL),
    IF(experience>0,CONCAT("AND p.experience>=",experience),NULL)),""));
  
  IF main = "profile" THEN

    IF ptable <> "company" THEN    
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both","SELECT * FROM(" , "" ),
      "SELECT COUNT(cu.connect)+IFNULL(B.count,0) AS count, p.username AS id,CONCAT(u.firstname,' ',u.lastname) AS name,
      p.active,p.visible,p.content,p.snippet,p.experience,p.cv,p.image, NULL 
      FROM user_person u INNER JOIN category_user_map cu ON cu.connect=u.username INNER JOIN category c ON cu.base=c.id 
      LEFT JOIN (SELECT count(tu.connect) AS count, tu.connect AS username FROM tag_user_map tu INNER JOIN tag t ON tu.base=t.id
      WHERE t.name IN",tags,"GROUP BY username) B ON B.username=u.username INNER JOIN profile_person p ON p.username=u.username 
      WHERE c.name IN",categories,@sql_ands,"GROUP BY u.username",IF(ptable="both","UNION ALL","ORDER BY count DESC")));
    END IF;

    IF ptable <> "person" THEN
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both",@sql_main,""),
      "SELECT COUNT(cu.connect)+IFNULL(B.count,0) AS count, p.username AS id,u.name,p.active,p.visible,p.content,
      p.snippet,p.experience,p.image_logo,p.image_view,p.image_contact 
      FROM user_company u INNER JOIN category_user_map cu ON cu.connect=u.username INNER JOIN category c ON cu.base=c.id 
      LEFT JOIN (SELECT count(tu.connect) AS count, tu.connect AS username FROM tag_user_map tu INNER JOIN tag t ON tu.base=t.id
      WHERE t.name IN",tags,"GROUP BY username) B ON B.username=u.username INNER JOIN profile_company p ON p.username=u.username
      WHERE c.name IN",categories,@sql_ands,"GROUP BY u.username",IF(ptable="both",") combined ORDER BY count DESC","ORDER BY count DESC")));
    END IF;

  ELSEIF main = "advertisement" THEN

    IF ptable <> "company" THEN
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both","SELECT * FROM(",""),
      "SELECT COUNT(ca.connect)+IFNULL(B.count,0) AS count, ad.*, CONCAT(u.firstname,' ',u.lastname) as name, p.image FROM advertisement ad
      INNER JOIN user_person u ON ad.username = u.username 
      INNER JOIN category_advertise_map ca ON ad.id = ca.connect INNER JOIN category c ON ca.base = c.id
      LEFT JOIN (SELECT COUNT(ta.connect) AS count, ta.connect AS id FROM tag_advertise_map ta INNER JOIN tag t ON ta.base=t.id
      WHERE t.name IN",tags,"GROUP BY id) B ON B.id=ad.id INNER JOIN profile_person p ON p.username=ad.username
      WHERE c.name IN",categories,@sql_ands,"GROUP BY ad.id",IF(ptable="both",") combined ORDER BY count DESC","ORDER BY count DESC")));
    END IF;

    IF ptable <> "person" THEN
      SET @sql_main := (SELECT CONCAT_WS(' ',IF(ptable="both",@sql_main,""),
      "SELECT COUNT(ca.connect)+IFNULL(B.count,0) AS count, ad.*, u.name, p.image_logo as image FROM advertisement ad
      INNER JOIN user_company u ON ad.username = u.username 
      INNER JOIN category_advertise_map ca ON ad.id = ca.connect INNER JOIN category c ON ca.base = c.id
      LEFT JOIN (SELECT COUNT(ta.connect) AS count, ta.connect AS id FROM tag_advertise_map ta INNER JOIN tag t ON ta.base=t.id
      WHERE t.name IN",tags,"GROUP BY id) B ON B.id=ad.id INNER JOIN profile_company p ON p.username=ad.username
      WHERE c.name IN",categories,@sql_ands,"GROUP BY ad.id",IF(ptable="both",") combined ORDER BY count DESC","ORDER BY count DESC")));
    END IF;

  END IF;

  PREPARE stmt FROM @sql_main;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

END$$

DELIMITER ;


-- QUERY structure profile search
-------------

-- SELECT count(cu.connect)+IFNULL(B.count,0) AS count, u.username AS id 
-- FROM user_person u 
-- INNER JOIN category_user_map cu ON cu.connect=u.username 
-- INNER JOIN category c ON cu.base=c.id 
-- LEFT JOIN
-- (SELECT count(tu.connect) AS count, tu.connect AS username
-- FROM tag_user_map tu
-- INNER JOIN tag t ON tu.base=t.id
-- WHERE t.name IN("Agile") GROUP BY username) B ON B.username = u.username
-- WHERE c.name IN("Webbutveckling","Systemutveckling")  
-- GROUP BY u.username

-- ORDER BY count DESC;