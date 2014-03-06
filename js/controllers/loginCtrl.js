'use strict';

// Controller for login view 
computenzControllers.controller('LoginCtrl', ['$scope','$http','$location', 'UserService', 'LoginToggleService',
  function($scope,$http,$location,UserService,LoginToggleService) {

    $scope.sendForm = function(){
      var requestData = {
        loginHandlerAction: 'login',
        username: $scope.user.username,
        password: $scope.user.password
      };

      $http.post('php/main.php', requestData).success(function(data){
        if(data){
          UserService.setUser(data);
          LoginToggleService.setLinkData(true);
          $location.path('profile/' + UserService.getUsername());
        }else{
          $scope.message = data;
        }
      });
    };

}]);