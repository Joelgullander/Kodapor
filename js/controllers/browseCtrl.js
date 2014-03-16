'use strict';

computenzControllers.controller('BrowseCtrl', ['$scope','$http','$location','CacheService','MetaService', function($scope,$http,$location,CacheService,MetaService) {

  $scope.req = CacheService.getSearchCriteria();
  console.log("After recaching req: ", $scope.req, $scope.req ? 10 : 20);
  $scope.result = CacheService.getSearchResult();
  
  $scope.categories = MetaService.getCategories();
  $scope.tags = MetaService.getTags();
  
  $scope.selectedCategories = $scope.req ? $scope.req.categories : [];
  $scope.selectedTags = $scope.req ? $scope.req.tags : [];
  
  // Ugly???  You bet!  :) Nöden har ingen lag...
  $scope.selection = $scope.req ? CacheService.stupid($scope.req.users) : 1;
  if ($scope.req) {
    $('select[name="experience"]').val($scope.req.experience);
  }

  $scope.req = $scope.req || {
    main: ["advertisement"],
    users: ["profile_person","profile_company"],
    company_tax: false,
    inactive: false,
    searchText: "",
    experience: 0,
    categories: $scope.selectedCategories,
    tags: $scope.selectedTags
  };
  console.log($scope.req);



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
      console.log(data);
      // Cache data
      CacheService.cacheCurrentSearch( $scope.req, data );
    });
  };

  $scope.go = function(path){  // When clicking on an item in the results 
    $location.path(path);
  };

  $(document).on('click', '.catcloud', function(){
    var index = $(this).parent().children().index(this);
    $scope.selectedCategories.splice(index,1);
    $(this).remove();
  });

  $(document).on('click','.tagcloud', function(){
    var index = $(this).parent().children().index(this);
    $scope.selectedTags.splice(index,1);
    $(this).remove();
  });

}]);


