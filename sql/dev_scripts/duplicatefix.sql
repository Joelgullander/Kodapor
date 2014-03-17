USE coderspool;

delete from category_user_map using category_user_map, category_user_map cu where category_user_map.map_id > cu.map_id and category_user_map.connect = cu.connect and category_user_map.base = cu.base;
delete from tag_user_map using tag_user_map, tag_user_map um where tag_user_map.map_id > um.map_id and tag_user_map.connect = um.connect and tag_user_map.base = um.base;
delete from category_advertise_map using category_advertise_map, category_advertise_map ca where category_advertise_map.map_id > ca.map_id and category_advertise_map.connect = ca.connect and category_advertise_map.base = ca.base;
delete from tag_advertise_map using tag_advertise_map, tag_advertise_map ta where tag_advertise_map.map_id > ta.map_id and tag_advertise_map.connect = ta.connect and tag_advertise_map.base = ta.base;
