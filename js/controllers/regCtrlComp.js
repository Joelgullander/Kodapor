'use strict';

computenzControllers.controller('RegCtrl', ['$scope','$http', 'UserService', function($scope,$http, UserService) {

  $scope.user={};

  var testData ={};

  function getUserAccount(username){
    $http({
      url:'php/user_company/' + username,
      method: 'GET',
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
     
      $scope.userData = data;
    });
  }

  $scope.save = function() {
    testData = $scope.user;
    handlePerson('POST', testData);
  };
  function handlePerson(method, data) {

    console.log(data);
    
    $http({
      url:'php/user_company/' + testData.username,
      method: method,
      data: data,
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      $scope.res = getUserAccount(testData.username);
     
    });
  }


}]);