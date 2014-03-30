'use strict';

computenzControllers.controller('RegCtrl', ['$scope','$http', 'UserService', function($scope,$http, UserService) {

  $scope.user={};

  $scope.save = function() {
    if($scope.user.password !== $scope.user.repeatPassword){
      alert("Lösenordet upprepades inte korrekt. Försök igen!");
    }
    else {
      registerAccount('POST');
    }
  };

  function registerAccount(method) {

    $scope.user.company_tax = ($scope.user.company_type = $scope.isEnabled) ? 1 : 0;

    $http({
      url:'php/rest.php/account/',
      method: method,
      data: {'userdata':
        ["username","email","password","firstname","lastname","personal_id",
        "street_address","postal_code","city","phone","cell_phone",
        "company_tax","company_type","company_name","org_nr","company_size"]
        .map(function(item){
          return $scope.user[item];
        })
      },
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      // $scope.res = getUserAccount(testData.username); 
    });
  }
}]);