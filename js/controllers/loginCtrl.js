'use strict';

// Controller for login view 
computenzControllers.controller('LoginCtrl', ['$scope','$http','$location', 'UserService', 'LoginToggleService',
  function($scope,$http,$location,UserService,LoginToggleService) {

    $scope.sendForm = function(){
      var requestData = {
        loginHandlerAction: 'login',
        username: $scope.user.username,
        password: $scope.user.password
      };

      // Några testpersoner: 
      //  PerCenterwall GzrTCRljCu
      //  VictoriaAsplund spvmM3Zzci
      //  PeterGullberg WaSfW9EcaE
      //  OskarBlomstrand RkBArq1mNA

      $http.post('php/main.php', requestData).success(function(data){
        if(data && data.username === $scope.user.username){
          UserService.setUser(data);
          LoginToggleService.setLinkData(true);
          $location.path('profile/' + UserService.getUsername());
          $scope.message = 'Your login succeeded';
        }else{
          $scope.message = data;
        }
      });
    };

}]);