'use strict';

// This file contains registration of the global app, its 
// controllers, services etc. 

var computenzApp = angular.module('computenzApp', [
    'ngRoute',
    'computenzControllers',
    'computenzServices'
  ]);

computenzApp.config(['$locationProvider', function($locationProvider){
  $locationProvider.html5Mode(true);
}]);

var computenzControllers = angular.module('computenzControllers', []);
var computenzServices = angular.module('computenzServices', []).value('version', '0.1');

// The routing is configured here, to redirect to desired partial
// according to what is in the url after the app root (Kodapor/...)

computenzApp.config(['$routeProvider', function($routeProvider){
    
    $routeProvider.
      when('/register/:type', {
        templateUrl: 'partials/registrationPerson.html',
        controller: 'RegCtrl'
      }).
      when('/account', {
        templateUrl: 'partials/registrationPerson.html',
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
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
}]);
