'use strict';


computenzControllers.controller('editProfileCtrl', ['$scope','$http','$routeParams','UserService','CacheService','MetaService', function($scope,$http,$routeParams, UserService,CacheService,MetaService) {
  $scope.categories = MetaService.getCategories();
  $scope.tags = MetaService.getTags();

  var currentUserProfile = window.location.href.split('/').pop();
  $scope.user = CacheService.call('destination');
  $scope.selectedCategories = MetaService.convertCategories($scope.user.categories);
  $scope.selectedTags = MetaService.convertTags($scope.user.tags);

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

$scope.update = function(){
  $http({
    method: "PUT",
    url: "php/profile/" + $scope.user.content_id,
    data: $scope.user,
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  });

};

}]);