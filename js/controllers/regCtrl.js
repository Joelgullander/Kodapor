'use strict';

computenzControllers.controller('RegCtrl', ['$scope','$http', 'UserService', function($scope,$http, UserService) {

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

  $scope.save = function() {
    alert("sparad");
  };

  var testPerson = "KalleAndersson";

  //CREATE - method: POST
  $scope.addTestPerson = function(){
    var testData = {
      // Everything mandatory in this table.
      // How to do with location - region and address??
      "firstname": "Kalle",
      "lastname": "Andersson",
      "birthdate": "19860714-1234",     // Should we demand full or date only?
      "company_tax": "1",               // = true  "Godkänd för F-skatt"
      "company_name": "Kalles IT-Byrå",
      "phone": "070912223",
      "email": "kalle@gmail.com",
      "password": "QWdfpe34F2"
    };
    handleTestPerson('POST', testData);
  };

  //UPDATE - method: PATCH
  $scope.patchTestPerson = function(){
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

  function handleTestPerson(method, data) {
    $http({
      url:'php/user_person/' + testPerson,
      method: method,
      data: data,
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      $scope.res = getUserAccount(testPerson);
    });
  }


}]);