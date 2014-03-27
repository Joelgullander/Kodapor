'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$http','$location','$routeParams','UserService','CacheService','MetaService',function($scope,$http,$location,$routeParams,UserService,CacheService,MetaService) {
  

  var destination = decodeURIComponent(window.location.href.split('/').pop());

  if (destination == "myprofile") {
    // This means the user is currently logged in and clicked on the "Min profil"-link.
    // Profile data can be retrieved from UserService
    $scope.user = UserService.getUser();
  }
  else {
    // This means we was redirected here from search or advertisement page. Before redirection
    // data was fetched and stored in cache, so no new request to server is needed. 
    $scope.user = CacheService.call('destination');
  }

  $http({
    method: "GET",
    url: "php/advertisements/" + $scope.user.user_id, // OBS! pluralis must remain! Otherwise it gets single ad and probably wrong ad
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  }).success(function(data){
      $scope.user.advertisements = data;
  });


  // Save profila data to cache so the user can come back after leaving or reloading page
  CacheService.call('destination',$scope.user);

  // The profile stores categories and tags as number. Call to MetaService convert these to strings
  // that can be displayed in the ng-repeated ul-elements.
  $scope.categories = MetaService.convertCategories($scope.user.categories);
  $scope.tags = MetaService.convertTags($scope.user.tags);

  // This function is called when user is logged in and has an edit button to press..
  // TODO: Only show button when user is logged in and on his/her own profile page.
  // You can check the 'destination' variable above if it holds 'myprofile'...
  $scope.edit = function(){
    $location.path('profile/edit/'+UserService.getUsername());
  };

  console.log("Profile data: ", $scope.user);

}]);