'use strict';

computenzControllers.controller('RegCtrl', ['$scope','$http', 'UserService', function($scope,$http, UserService) {

  $scope.user={};
  // For getting current users registration data. We don't have routing for this yet, since user now only get to registration view
  // through login view when not logged in. 
  function getUserAccount(username){
    $http({
      url:'php/user_person/' + username,
      method: 'GET',
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      // Display data
      $scope.userData = data;
    });
  }

  getUserAccount(UserService.getUsername());

  // Code to add Person!
  $scope.save = function() {
    // Temporary check if user missed to type in a inputfield!
    if($scope.user.username==undefined || $scope.user.email==undefined || $scope.user.name==undefined ){
       $scope.message = "Registrering felaktigt i fyllt, fyll i fält som saknas!";
    }
    else{
    console.log($scope.user);
    addPerson($scope.user);
    }
  };

  //CREATE - method: POST
  $scope.addPerson = function(obj){
    var personData = obj; 
      
    handlePerson('POST', personData);
  };
    function handlePerson(method, data) {
    $http({
      url:'php/user_person/'/* + testPerson */ ,
      method: method,
      data: data,
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      $scope.res = getUserAccount(personData.username);
    });
  }


}]);

/*

  //UPDATE - method: PATCH
  $scope.patchPerson = function(){
    var testData = {
      "email": "carl@wallin-andersen.se",
      "firstname": "Carl",
      "lastname": "von Wallin-Andersén",
    };
    handleTestPerson('PATCH', testData);
  };

  //UPDATE - method: PUT
  $scope.putTestPerson = function(){
    var testData = {
      "username": "KalleAndersson",
      "email": "carl@wallin-andersen.se",
      "firstname": "Carl",
      "lastname": "von Wallin-Andersén",
    };
    handleTestPerson('PUT', testData);
  };
  //DELETE - method: DELETE
  $scope.deleteTestPerson = function(){
    handleTestPerson('DELETE');
  };

*/