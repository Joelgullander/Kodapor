'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$http','$location','$routeParams','UserService', function($scope,$http,$location,$routeParams, UserService) {
  
  var currentUserProfile = window.location.href.split('/').pop();

  $http({
    url: 'php/profile_person/' + encodeURIComponent(currentUserProfile),
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
  $scope.edit = function(){
    $location.path('profile/edit/'+UserService.getUsername());
  };

}]);