'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$http','$routeParams','UserService', function($scope,$http,$routeParams, UserService) {
  
  var currentUserProfile = window.location.href.split('/').pop();

  $http({
    url: 'php/profile_person/' + encodeURIComponent(currentUserProfile),
    method: 'GET',
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  }).success(function(data) {
    $scope.data = data;
  });

  $scope.getFullName = UserService.getFullName;

}]);