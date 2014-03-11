'use strict';

// Controller for login view 
computenzControllers.controller('LoginCtrl', ['$scope','$http','$location', 'UserService', 'LoginToggleService',
  function($scope,$http,$location,UserService,LoginToggleService) {

    $scope.sendForm = function(username, password){
      var requestData = {
        loginHandlerAction: 'login',
        username: username || $scope.user.username,
        password: password || $scope.user.password
      };

      $http.post('php/main.php', requestData).success(function(data){
        if(data != "false"){
          UserService.setUser(data);
          LoginToggleService.setLinkData(true);
          $location.path('profile/' + UserService.getUsername());
        }else{
          $scope.message = "Användarnamn eller lösenord felaktigt. Kunde inte logga in!";
        }
      });
    };

    (function(){
      $http.get('php/testusers/', {
        headers : {
          'Content-Type' : 'application/json; charset=UTF-8'
        }
      }).success(function(data){
        $scope.testPersons = data.splice(0,5);
        $scope.testCompanies = data;
      });
    }());

}]);