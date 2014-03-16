'use strict';

// Controller for container view (index.html body element)
// Here you can declare functions needed in navbars, sidebars, footer etc,
// elements that are in common wherever the user navigates on the site. 

computenzControllers.controller('appCtrl', ['$scope','$http','$location','UserService','LoginToggleService', 'MetaService', 'LoginService',
  function($scope,$http,$location,UserService,LoginToggleService,MetaService,LoginService) {
    $scope.sendForm = LoginService.sendForm;
    
    $scope.updateLogin = function(linkData) {
      $scope.whereToGo = linkData;
    };

    // These two lines makes it possible to reload a subpage without being transported to 'home'
    // by splitting out the parts after base directory and using Angulars routing system to redirect.
    // The decode URI part is necessary to stop browser to reinsert encoding for swedish characters
    // if for instance reloadin a profileURI with a swedish name in it.
    var redirect = window.location.href.split(document.baseURI)[1];
    $location.path(decodeURIComponent(redirect));

    // The following check with database if user has an active session
    // and if so keeps the user loginstatus active in app also
    // when reloading from bookmark/link/subpage.

    $http.get('php/login/').success(function(data){
      if (data !== "false") {
        UserService.setUser(data);
        LoginToggleService.setLinkData(true);
      }
      else {
        LoginToggleService.setLinkData(false);
      }
    });

    // This function will be called if user is logged in and clicks the
    // logout link. The $http.post-request is simply calling the logOut function in php.
    // After that the UserService is called to unset user from app, and the link is
    // restored to a 'login' link.

    $scope.logOut = function() {
      $http.delete('php/logout/').success(function(data){
        UserService.unsetUser();
        LoginToggleService.setLinkData(false);
      });
    };

    // These assignments make services available in the scope, so that they can be
    // called in the index.html file like {{ function() }}. 
    // If you need other functions from the services you can just add more assignments here.

    $scope.loginStatus = LoginToggleService.getStatus;
    $scope.getFullName = UserService.getFullName;
    $scope.getUsername = UserService.getUsername;

    // This sets the login/logout link correctly at first load and each reload of the page.
    $scope.updateLogin(LoginToggleService.getLinkData());

    (function loadMetaData(){
        $http({
            method: "GET",
            url: "php/meta/",
            headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
        }).success(function(data){
            MetaService.installData(data);
        });
    }());
    
}]);