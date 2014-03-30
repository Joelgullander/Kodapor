'use strict';


computenzControllers.controller('editProfileCtrl', ['$scope','$http','$routeParams','UserService','CacheService','MetaService', function($scope,$http,$routeParams, UserService,CacheService,MetaService) {
  $scope.categories = MetaService.getCategories();
  $scope.tags = MetaService.getTags();

  var currentUserProfile = window.location.href.split('/').pop();
  $scope.user = CacheService.call('destination');
  $scope.selectedCategories = MetaService.convertCategories($scope.user.categories);
  $scope.selectedTags = MetaService.convertTags($scope.user.tags);

  $scope.getFullName = UserService.getFullName;


$scope.update = function(){

  $scope.user.categories = (MetaService.convertCategories($scope.selectedCategories)).join(",");
  $scope.user.tags = (MetaService.convertTags($scope.selectedTags)).join(",");
  
  $http({
    method: "PUT",
    url: "php/profile/" + $scope.user.content_id,
    data: $scope.user,
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  }).success ( function(data){
    //UserService.setUser($scope.user);
    CacheService.call('destination', $scope.user);
    console.log("IN success: ",UserService.getUser());
});

};

}]);