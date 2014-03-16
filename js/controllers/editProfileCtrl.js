'use strict';


computenzControllers.controller('editProfileCtrl', ['$scope','$http','$routeParams','UserService', function($scope,$http,$routeParams, UserService) {
  

  
  $scope.currentUserProfile = decodeURIComponent(window.location.href.split('/').pop());

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
  

}]);


