'use strict';
var ctype,bits;

computenzControllers.controller('BrowseCtrl', ['$scope','$http','$location','CacheService','MetaService', function($scope,$http,$location,CacheService,MetaService) {

  var pageSize = 6;
  var resultHeight;

  console.log("cache: ", CacheService.all(), " totalStorage: ",$.totalStorage('Kodapor'));

  $scope.req = CacheService.call('searchCriteria');
  $scope.result = CacheService.call('searchResults') || [];
  $scope.resultHeader = CacheService.call('resultHeader');
  
  $scope.types = CacheService.call('types') || [0,0,0,0];
  
  $scope.categories = MetaService.getCategories();
  $scope.tags = MetaService.getTags();
  
  $scope.selectedCategories = CacheService.call('selectedCategories') || [];
  $scope.selectedTags = CacheService.call('selectedTags') || [];

  $scope.main = 'advertisement';
  // $scope.main = CacheService.call('main') || 1;
  // $scope.selection = 1; // This choice has no function right now...

  if ($scope.req) {
    $('select[name="experience"]').val($scope.req.experience);
    var pageStart = CacheService.call('currentSearchPage');
    $scope.resultHeader = CacheService.call('resultHeader');
    $scope.resultPage = $scope.result.slice(pageStart,pageSize);
  }

  else $scope.req = {
    main: "advertisement",
    categories: $scope.selectedCategories,
    tags: $scope.selectedTags,
    inactive: 0,
    company_tax: 0,
    company_type: 0,
    experience: 0,
    searchText: ""
  };

  $scope.reset = function(){
    $scope.selectedCategories = [];
    $scope.selectedTags = [];
  };

  $scope.search = function(){
    
    CacheService.storeWithObject({
      'selectedCategories': $scope.selectedCategories,
      'selectedTags': $scope.selectedTags,
      'searchCriteria': $scope.req,
      'main': $scope.main,
      'types': $scope.types
    });
    
    // Change selected categories/tags from array to string before sending,for inserting into dynamic SQL in php and db.
    $scope.req.categories = (MetaService.convertCategories($scope.selectedCategories)).join(",");
    $scope.req.tags = (MetaService.convertTags($scope.selectedTags)).join(",");
    // Bitwise oring of selected company types. The resulting number can be used in the database to extract back the types for a 
    // comparison in a conditional statement, utilising MySQLs MAKE_SET() function. 
    $scope.req.company_type = $scope.types[0] | $scope.types[1] | $scope.types[2] | $scope.types[3];

    $http({
      method: "POST",
      url: "php/search/",
      data: {"criteria":

        // The map function will replace the following keys with its corresponding value from $scope.req
        ["main","categories","tags","inactive","company_tax","company_type","experience","searchText"]
              
        .map(function(item){
          return $scope.req[item];
        })

      },
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      $('.cards').addClass('flipped');
      $('.flips .cards .back').css({'display':'block', 'margin-bottom':0});
      // Thank you jQuery!!!
      resultHeight = resultHeight || $('.back').height();
      $('body').css({'height':resultHeight+500});
      // Prepare and display data
      $scope.result = data;
      $scope.resultPage = data.slice(0,pageSize);
      $scope.pagesCount = Math.floor(data.length / pageSize);
      $scope.pages = [];
      $scope.currentPage = 0;
      makePagination();
      makeResultHeader(0);
      CacheService.call('searchResults',data);

    });
  }; // END search

  function makeResultHeader(pageStart){
    if ($scope.result.length) {
      $scope.resultHeader = "Visar resultat " + (pageStart) + " - " + (pageStart + pageSize) + " av " + $scope.result.length;
      CacheService.call('resultHeader', $scope.resultHeader);
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

  // The resultPage is an array containing the subset of result items to be showed simultaneously on screen.
  // The function is called when clicking on page number in pagination menu. When the array is 
  // updated the display will change automatically in the ng-repeat ul.

  $scope.getResultPage = function(page){

    $scope.currentPage = page;
    var newPageStart = page*pageSize;
    makeResultHeader(newPageStart);
    $scope.resultPage = $scope.result.slice(newPageStart,newPageStart+pageSize);

    // Supposed to 'scroll' the pagination menu. Need fix...
    var index;
    while ((index = $scope.pages.indexOf(page)) >= 5) {
      $scope.pages.shift();
      $scope.pages.push(page + (paginationLength - index));
    }
    if (newPageStart+pageSize >= $scope.pagesCount - 1) {
      $scope.pageTail = "";
    }
    // Supposed to save the pagenumber so when leaving and returning to the partial
    // the user will come back to where he were.
    CacheService.call("currentSearchPage",page);
  };

  // Redirection to profile or advertisement page when clicking
  // an item in the result list.

  $scope.go = function(path,post){
    CacheService.call("destination",post);
    $location.path(path);
  };

  $scope.newSearch = function() {
    $('.flips .cards .back').css({'display':'none'});
    $('.cards').removeClass('flipped');
    $('body').css({'height':'auto'});
  };

  // Eventhandlers for selected categories and tags. 
  // When clicking on an item it will be removed from the DOM
  // and from the array which will be sent to make the search query.

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


