'use strict';

computenzControllers.controller('BrowseCtrl', ['$scope','$http','$location','CacheService','MetaService', function($scope,$http,$location,CacheService,MetaService) {

  var pageSize = 6;

  $scope.req = CacheService.getSearchCriteria();
  $scope.result = CacheService.getSearchResult();
  
  $scope.categories = MetaService.getCategories();
  $scope.tags = MetaService.getTags();
  
  $scope.selectedCategories = $scope.req ? $scope.req.categories : [];
  $scope.selectedTags = $scope.req ? $scope.req.tags : [];

  // Ugly???  You bet!  :) Nöden har ingen lag...
  $scope.selection = $scope.req ? CacheService.stupid($scope.req.users) : 1;
  if ($scope.req) {
    $('select[name="experience"]').val($scope.req.experience);
    var pageStart = CacheService.getPagination();
    $scope.resultPage = $scope.result.slice(pageStart,pageSize);
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

  $scope.search = function(){

    $http({
      method: "POST",
      url: "php/browse/",
      data: $scope.req,
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      // Prepare and display data
      $scope.result = data;
      $scope.resultPage = data.slice(0,pageSize);
      $scope.pagesCount = Math.floor(data.length / pageSize);
      $scope.pages = [];
      $scope.currentPage = 0;
      makePagination();
      makeResultHeader(0);
      CacheService.cacheCurrentSearch( $scope.req, data );
    });
  };

  function makeResultHeader(pageStart){
    if ($scope.result.length) {
      $scope.resultHeader = "Visar resultat " + (pageStart) + " - " + (pageStart + pageSize) + " av " + $scope.result.length;
    }
  }
  var paginationLength = 6;
  function makePagination() {
    
    for (var i = 0; i < $scope.pagesCount && i < paginationLength; i++) {
      $scope.pages.push(i+1);
    }
    if ($scope.pagesCount > $scope.pages.length) {
      $scope.pageTail = "..." + $scope.pagesCount;
    }
  }

  $scope.getResultPage = function(page){

    $scope.currentPage = page;
    var newPageStart = page*pageSize;
    makeResultHeader(newPageStart);
    $scope.resultPage = $scope.result.slice(newPageStart,newPageStart+pageSize);

    var index;
    while ((index = $scope.pages.indexOf(page)) >= 5) {
      $scope.pages.shift();
      $scope.pages.push(page + (paginationLength - index));
    }
    if (newPageStart+pageSize >= $scope.pagesCount - 1) {
      $scope.pageTail = "";
    }
    CacheService.cachePagination(page);
  };

  $scope.go = function(path,post){  // When clicking on an item in the results 
    CacheService.cacheDestination(post);
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


