'use strict';

computenzControllers.controller('BrowseCtrl', ['$scope','$http','$location','CacheService','MetaService', function($scope,$http,$location,CacheService,MetaService) {

  $scope.categories = MetaService.getCategories();
	$scope.selectedCategories = [];
	$scope.tags = MetaService.getTags();
	$scope.selectedTags = [];
  
  $scope.selection = 1;
  
  $scope.req = {
		main: ["advertisement"],
		users: ["profile_person","profile_company"],
		company_tax: false,
		inactive: false,
		searchText: "",
		experience: 0,
		categories: $scope.selectedCategories,
		tags: $scope.selectedTags
  };

  $scope.search = function(){

		$http({
			method: "POST",
			url: "php/browse/",
			data: $scope.req,
			headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      // Display data
      $scope.result = data;
      // Cache data
      var type = $scope.req.main;
      console.log(type);
      CacheService.cache(type, data);
    });
	};

	$scope.go = function(path){
		$location.path(path);
	};

	
}]);


