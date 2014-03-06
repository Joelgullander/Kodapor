'use strict';

/* Services */

// If you inject this service you can access the contained user data.
// Now there is only names, but maybe all user data should be stored here
// with getters and setters

computenzServices.service('UserService', function(){

  var user = {
    username: null,
    firstname: null,
    lastname: null
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
        return user.firstname + ' ' + user.lastname;
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

// Service used by main and login page to set login/logout-link and redirect
// the user when clicking. Also has function for detecting if user is logged in.

computenzServices.service('LoginToggleService', function() {

  var linkData = {
    link: 'login',
    text: 'Logga in'
  };

  var status = false;

  return {
    getLinkData: function(){
      return linkData;
    },
    setLinkData: function(bool) {
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
    },
    getStatus: function() {
      if (status)
        return true;

    },
  };

});











