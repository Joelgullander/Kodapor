'use strict';

// Controller for container view (index.html body element)
// Here you can declare functions needed in navbars, sidebars, footer etc,
// elements that are in common wherever the user navigates on the site. 

computenzControllers.controller('appCtrl', ['$scope','$http','$location','UserService','LoginToggleService',
  function($scope,$http,$location,UserService,LoginToggleService) {
    
    $scope.updateLogin = function(linkData) {
      $scope.whereToGo = linkData;
    };

    var redirect = window.location.href.split(document.baseURI)[1];
    $location.path(redirect);

    // The following check with database if user has an active session
    // and if so keeps the user loginstatus active in app also
    // when reloading from bookmark/link/subpage.

    var requestData = {loginHandlerAction: 'getUser'};
    $http.post('php/main.php', requestData).success(function(data){
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
      var requestData = {loginHandlerAction: 'logOut'};
      $http.post('php/main.php', requestData).success(function(data){
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

    // THis sets the login/logout link correctly at first load and each reload of the page.
    $scope.updateLogin(LoginToggleService.getLinkData());

}]);