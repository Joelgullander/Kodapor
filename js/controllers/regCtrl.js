'use strict';

computenzControllers.controller('RegCtrl', ['$scope','$http', 'UserService', function($scope,$http, UserService) {

  // For getting current users registration data. We don't have routing for this yet, since user now only get to registration view
  // through login view when not logged in. 
  function getUserAccount(){
    $http({
      url:'php/user_person/' + UserService.getUsername(),
      method: 'GET',
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      // Display data
      $scope.userData = data;
    });
  }

  getUserAccount();

}]);