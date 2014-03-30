'use strict';

var decoded;
/* Services */

// If you inject this service you can access the contained user data.
// Now there is only names, but maybe all user data should be stored here
// with getters and setters

computenzServices.service('UserService', function(){

  var user = {
    username: null,
    firstname: null,
    name: null
  };

  return {
    getUsername: function(){
      return user.username;
    },
    getFirstname: function(){
      return user.firstname;
    },
    getFullName: function(){
      if (user.username !== null)
        return user.display_name;
    },
    getUser: function(){
      return user;
    },
    setUser: function(n){
      user = n;
    },
    unsetUser: function(){
      user = {};
      /*
      for (var prop in user) {
        user[prop] = null;
      }*/
    },
    call: function(prop,val){
      if(val){
        user[prop] = val;
      }
      return user[prop];
    }
  };
});

// Service used by login forms

computenzServices.service('LoginService', function($http,$location,UserService) {

  var linkData = {
    link: 'login',
    text: 'Logga in'
  };

  var status = false;

  function setLinkData(bool) {
    if (bool) {
      linkData.link = 'home';
      linkData.text = 'Logga ut';
      status = true;
    }
    else {
      linkData.link = 'login';
      linkData.text = 'Logga in';
      status = false;
    }
  }

  return {
    sendForm: function(identifier,password){
      console.log("sendForm args: ", identifier,password);
      $http.post('php/login/', { logindata: [identifier,password] }).success(function(data){
        if(data[0] != 0){
          // Here the user object is set from the data received
          UserService.setUser(data);
          // Link is changed from 'login' to 'logout'
          setLinkData(true);
          // Redirect to the users own profile
          $location.path('myprofile');
        }else{
          console.log("Användarnamn eller lösenord felaktigt. Kunde inte logga in!");
        }
      });
    },
    getLinkData: function(){
      return linkData;
    },
    logOut: function() {
      $http.delete('php/logout/').success(function(data){
        // Delete the user object in the browser
        UserService.unsetUser();
        // Set link back to 'login'
        setLinkData(false);
      });
    },
    getLoginStatusApp: function(){  // If need to check loginstatus
      if (status)
        return true;
    },
    getLoginStatusServer: function(){ // Check with server if user has an ongoing session, done on every page reload
      $http.get('php/login/').success(function(data){
        if (data != "false") {
          UserService.setUser(data);
          setLinkData(true);
        }
        else {
          setLinkData(false);
        }
      });
    }
  };
});

computenzServices.service('CacheService', function() {

  // This service uses memory for retrieving as long as the app is not refreshed, 
  // but stores tha cache also in localStorage (with totalStorage plugin for jQuery) 
  // If refreshed, the app retrieves its cache again through totalStorage

  var cache = {};

  return {
    call: function(prop,val){
      if(val){
        cache[prop] = val;
        $.totalStorage('Kodapor',cache);
      }
      else {
        console.log("Returning cache...");
        return cache[prop];
      }
    },
    // If a partial needs to store multiple entities it can bundle them in an object
    // and call this function instead of individual calls to the function above.
    storeWithObject: function(data){
      for(var name in data){
        if (data.hasOwnProperty(name)) {
          cache[name] = data[name];
        }
      }
      $.totalStorage('Kodapor',cache);
    },
    all: function(){
      return cache;
    },
    clear: function(){
      cache = {};
      $.totalStorage('Kodapor',cache);
    },
    loadCache: function(){
      if ($.totalStorage('Kodapor')) {
          cache = $.totalStorage('Kodapor');
      }
    }
  }
});

computenzServices.service('MetaService', function() {

    var category_map = {};
    var categories = [];
    var tag_map = {};
    var tags = [];

  return {
    installData: function(data){
      decoded = category_map = data.category_map;
      categories = data.categories;
      tag_map = data.tag_map;
      tags = data.tags;
    },
    getCategories: function(){
      return categories;
    },
    getTags: function(){
      return tags;
    },
    askCategoryMap: function(key){
      return category_map[key];
    },
    askTagMap: function(key) {
      return tag_map[key];
    },
    convertCategories: function(source) {
      if (typeof source == "string") {
        return source.split(',').map(function(item){return category_map[item];});
      } else {
        return source.map(function(item){return category_map[item];});
      }
    },
    convertTags: function(source) {
      if (typeof source == "string") {
        return source.split(',').map(function(item){return tag_map[item];});
      } else {
        return source.map(function(item){return tag_map[item];});
      }
    }
  };
});








