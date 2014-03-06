'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$routeParams','UserService', function($scope,$routeParams, UserService) {
  $scope.getFullName = UserService.getFullName;
}]);