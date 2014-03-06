  'use strict';

var computenzApp = angular.module('computenzApp', [
    'ngRoute',
    'computenzControllers',
    'computenzServices'
  ]);

computenzApp.config(['$locationProvider', function($locationProvider){
  $locationProvider.html5Mode(true);
}]);

computenzApp.config(['$routeProvider', function($routeProvider){
    
    $routeProvider.
      when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/profile/:userID', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl'
      }).
      when('/browse', {
        templateUrl: 'partials/browse.html',
        controller: 'BrowseCtrl'
      }).
      when('home', {
        redirectTo: 'index.html'
      });

}]);

var computenzControllers = angular.module('computenzControllers', []);

var computenzServices = angular.module('computenzServices', []).value('version', '0.1');
