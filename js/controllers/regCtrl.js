'use strict';

computenzControllers.controller('RegCtrl', ['$scope','$http', 'UserService', function($scope,$http, UserService) {

  $scope.user={};

  var testData ={};
  // For getting current users registration data. We don't have routing for this yet, since user now only get to registration view
  // through login view when not logged in. 
  var resultArray=[];


  function getUserAccount(username){
    $http({
      url:'php/rest.php/account' ,
      method: 'GET',
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      // Display data
      $scope.userData = data;
    });
  }
  /* används inte!
  $scope.checkReg = function(){
  }
  */
  $scope.save = function() {

    testData = $scope.user;
    
    checkPassword();
  };
  function handlePerson(method) {

    console.log("nu ser Arrayn ut såhär: " + resultArray);
    console.log("detta är objectet" +testData);
    //Add person to database!
    $http({
      url:'php/rest.php/account/',
      method: method,
      data: resultArray ,
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      $scope.res = getUserAccount(testData.username);
     
    });

    resultArray=[]; // nollställer den!
  }

  function checkPassword () {
   if(testData.password !==$scope.user.repeatPassword){
      alert("password dont match");
    }
    else{

    resultArray.push("Andreas","ab@live.se","123","Andreas","Benatti","790512","Torggatan 34","23361","Bara","0736211454",null,null,null,null,null,null);//l,testData.password,testData.firstname,testData.lastname,testdata.personal_id,testData.street_adress,testData.postal_code,testData.city,testData.phone,null,null,null,testData.company_name,restData.org_nr,null);//,$scope.user.email,$scope.user.password,$scope.user.firstname,$scope.user.lastname, ,$scope.user.street_address,$scope.user.postal_code,$scope.user.city,$scope.user.phone, , , ,$scope.user.company_name,$scope.user.org_nr,...);
          
      /*
      var obj = testData;
      for (var prop in obj) {
         if (obj.hasOwnProperty(prop)) {
            resultArray.push(obj[prop]);
           
         }
      }
      */
      console.log(resultArray);

      handlePerson('POST');


    }
  };

}]);