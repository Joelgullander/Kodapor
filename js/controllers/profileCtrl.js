'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$routeParams','UserService', function($scope,$routeParams, UserService) {
  $scope.currentProfile = window.location.href.split('/').pop();
  //$scope.getFullName = UserService.getFullName;
}]);