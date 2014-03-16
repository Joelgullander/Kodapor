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
      console.log(user);
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
            // Make string of full name easily accessible for person name
            data.name = data.firstname + ' ' + data.lastname;
          }
          // Here the user object is set from the data received
          UserService.setUser(data);
          // Link is changed from 'login' to 'logout'
          setLinkData(true);
          // Redirect to the users own profile
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
    getLoginStatusServer: function(){ // Check with server if user has an ongoing session, done on page reload
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

  // This service uses memory for retrieving as long as the app is not refreshed, 
  // but stores tha cache also in localStorage (with totalStorage plugin for jQuery) 
  // If refreshed the app retrieves its cache again through totalStorage

  var searchIndex = 0;

  // Cache object will beside these predefined properties contain the 
  // id's of profiles and adverisements
  var cache = {
    history : [],
    results: [],
    criteria: []
  };

  var stupidComparison = { // The tale of the two tables
    "profile_person": 3,
    "profile_company": 2
  };

  return {
    cache: function(data) {
      for (var i=0; i < data.length; i++) {
        cache[data[i]['id']] = data[i];
      }
      $.totalStorage('Kodapor',cache);
    },
    getAdvertisement: function(id) {
      return cache[id];
    },
    getProfile: function(username) {
      return cache[username];
    },
    getSearchCriteria: function() {
      console.log(cache);
      return cache.criteria[searchIndex];
    },
    getSearchResult: function() {
      return cache.results[searchIndex];
    },
    cacheCurrentSearch: function(criteria,result) {
      cache.criteria.unshift(criteria);
      cache.results.unshift(result);
      console.log(cache);
      $.totalStorage('Kodapor',cache);
    },
    cacheLastDisplay: function(data) {
      cache.reloadCache = data;
      $.totalStorage('Kodapor',cache);
    },
    clear: function(){
      cache = {};
    },
    stupid: function(obj) {
      if (obj.length == 2) return 1;
      else return stupidComparison[obj[0]];
    },
    loadCache: function(){
      if ($.totalStorage('Kodapor').length) {
        cache = $.totalStorage('Kodapor');
      }
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








