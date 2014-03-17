'use strict';

computenzControllers.controller('ShowAdController', ['$scope','$http', 'CacheService', function($scope,$http,CacheService) {

  
  var currentAd = window.location.href.split('/').pop();
  $scope.currentAd = CacheService.getAdvertisement(currentAd);

  $http({
    method: 'GET',
    url: 'php/rest.php/ad_meta/' + currentAd,
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  }).success(function(data){
    $scope.categories = data.categories;
    $scope.tags = data.tags;
  });

  $http({
    method: 'GET',
    url: 'php/rest.php/profile/' + $scope.currentAd.username,
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  }).success(function(data){
    data.id = data.username;
    CacheService.cacheDestination(data);
  });

}]);