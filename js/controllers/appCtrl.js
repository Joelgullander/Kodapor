'use strict';

// Controller for container view (index.html body element)
// Here you can declare functions needed in navbars, sidebars, footer etc,
// elements that are in common wherever the user navigates on the site. 

computenzControllers.controller('appCtrl', ['$scope','$http','UserService','LoginToggleService',
  function($scope,$http, UserService, LoginToggleService) {
    
    $scope.updateLogin = function(statusObj) {
      $scope.whereToGo = statusObj;
    };

    $scope.logOut = function() {
      var requestData = {loginHandlerAction: 'logOut'};
      $http.post('php/main.php', requestData).success(function(data){
        UserService.unsetUser();
        LoginToggleService.setLinkData(false);
      });
    };

    $scope.loginStatus = LoginToggleService.getStatus;
    $scope.getFullName = UserService.getFullName;
    $scope.updateLogin(LoginToggleService.getLinkData());

}]);