'use strict';

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
        return user.name;
    },
    getUser: function(){
      return user;
    },
    setUser: function(n){
      user = n;
    },
    unsetUser: function(){
      for (var prop in user) {
        user[prop] = null;
      }
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
    sendForm: function(username,password){
      $http.post('php/login/' + username,{password:password}).success(function(data){
        if(data != "false"){
          if (data.user_table == "user_person") {
            data.name = data.firstname + ' ' + data.lastname;
          }
          UserService.setUser(data);
          setLinkData(true);
          $location.path('myprofile');
        }else{
          return "Användarnamn eller lösenord felaktigt. Kunde inte logga in!";
        }
      });
    },
    getLinkData: function(){
      return linkData;
    },
    logOut: function() {
      $http.delete('php/logout/').success(function(data){
        UserService.unsetUser();
        setLinkData(false);
      });
    },
    getLoginStatusApp: function(){
      if (status)
        return true;
    },
    getLoginStatusServer: function(){
      $http.get('php/login/').success(function(data){
      if (data !== "false") {
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

  var cache = {};
  var history = []; // Not implemented
  var searchHistory = []; // not implemented
  var reloadCache = undefined;

  return {
    cache: function(datatype, data) {
      for (var i=0; i < data.length; i++) {
        cache[data[i]['id']] = data[i];
        console.log("Caching: ", cache[data[i]['id']]);
      }
    },
    getAdvertisement: function(id) {
      return cache[id];
    },
    getProfile: function(username) {
      return cache[username];
    },
    getLastSeach: function() {
      return searchHistory[0];
    },
    cacheLastSearch: function(data) {
      searchHistory.unshift(data);
    },
    cacheLastDisplay: function(data) {
      reloadCache = data;
      console.log(reloadCache);
    },
    retrieveLastDisplay: function(){
      return reloadCache;
    },
    clear: function(){
      cache = {};
    }

  };
});

computenzServices.service('MetaService', function() {

    var categories = [];
    var tags = [];

  return {
    installData: function(data){
      categories = data.categories;
      tags = data.tags;
    },
    getCategories: function(){
      return categories;
    },
    getTags: function(){
      return tags;
    }
  };
});








