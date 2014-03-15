'use strict';


computenzControllers.controller('editProfileCtrl', ['$scope','$http','$routeParams','UserService', function($scope,$http,$routeParams, UserService) {
  
  var currentUserProfile = window.location.href.split('/').pop();

  $http({
   url: 'php/profile_person/' + encodeURIComponent(UserService.getUsername()),
    method: 'GET',
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  }).success(function(data) {
    $scope.data = data;
    $scope.content = data.content;
    $scope.image = data.image;
    $scope.experience = data.experience;
   
  });

  $scope.getFullName = UserService.getFullName;

  // for save!

  $scope.save = function() {
    testData = $scope.user;
    handlePerson('POST', testData);
    console.log(testData);
  };
  function handlePerson(method, data) {

    console.log(data);
    //Add person to database!
    $http({
      url:'php/user_person/' + testData.username,
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