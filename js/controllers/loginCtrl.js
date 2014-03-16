'use strict';

// Controller for login view 
computenzControllers.controller('LoginCtrl', ['$scope','$http','$location', 'UserService', 'LoginToggleService', 'LoginService',
  function($scope,$http,$location,UserService,LoginToggleService,LoginService) {
/*
    $scope.sendForm = function(username, password){
      alert("sending");
      var requestData = {
        password: password
      };
      
      $http.post('php/login/' + username,{password:password}).success(function(data){

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
*/
    $scope.sendForm = LoginService.sendForm;

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