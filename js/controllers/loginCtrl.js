'use strict';

// Controller for login view 
computenzControllers.controller('LoginCtrl', ['$scope','$http','$location', 'UserService', 'LoginToggleService',
  function($scope,$http,$location,UserService,LoginToggleService) {

    $scope.sendForm = function(username, password){
      var requestData = {
        loginHandlerAction: 'login',
        password: password || $scope.password
      };
      
      $http.post('php/login/' + username || $scope.username, requestData).success(function(data){
        if(data != "false"){
          data.firstname = decodeURIComponent(data.firstname);
          data.name = decodeURIComponent(data.name);
          console.log(data);
          UserService.setUser(data);
          LoginToggleService.setLinkData(true);
          $location.path('profile/' + UserService.getFullName());
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