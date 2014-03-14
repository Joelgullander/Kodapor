'use strict';

computenzControllers.controller('BrowseCtrl', ['$scope','$http','$location','MetaService', function($scope,$http,$location,MetaService) {
/*
		$scope.experienceForm = {};
		$scope.experienceForm.years = 1;
		
		$scope.experienceForm.options = [
			{ years: "1 år" },
			{ years: "3 - 5 års" },
			{ years: " + 5 års" }
		];

		$scope.locations.options = [
			{ place: 'Malmö', id: '1' },
			{ place: 'Lund', id: '2' },
			{ place: 'Kiruna', id: '3' },
			{ place: 'Stockholm', id: '4' },
			{ place: 'Distans', id: '5' }
		];

		$scope.category = {
			'webdev': boolean,
			'webdes': boolean,
			'projman': boolean,
			'appdev': boolean
		};

		$scope.language = {
			'html': boolean,
			'css': boolean,
			'pyton': boolean,
			'javascript': boolean
		};

		$scope.programmers = [
			{ name:'Samuel Mangusson',
			  title: 'webb utvecklare',
			  descr: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
			  salary: '500.000 - 700.000 sek',
			  portfolio :'samuel.se',
			  linkToProfile: 'http://linkToSamuel.html'
			},
			{ name: 'Joel Gullander',
			  title: 'Magento developer',
			  descr: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
			  salary: '500.000 - 700.000 sek',
			  portfolio: 'joel.se',
			  linkToProfile: 'http://linkToJoel.html'
			},
			{ name: 'Herbert Leal',
			  title: 'webb utvecklare',
			  descr: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
			  salary: '500.000 - 700.000 sek',
			  portfolio: 'herbert.se',
			  linkToProfile: 'http://linkToHerbert.html'
			},
			{ name:'Andreas Benatti',
			  title: 'webb utvecklare',
			  descr: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
			  salary: '500.000 - 700.000 sek',
			  portfolio: 'andreas.se',
			  linkToProfile: 'http://linkToAndreas.html'
			},
			{ name: 'Julia Rietveld',
			  title: 'webb utvecklare',
			  descr: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
			  salary: '500.000 - 700.000 sek',
			  portfolio: 'julia.se',
			  linkToProfile: 'http://linkToJulia.html'
			}

		];
		$scope.projects = [{
		'id': 1,
		'title': 'Build mail app',
		'clientId': 'id',
		'category': 'Web development',
		'urgency': 'urgent',
		'price': '$ 300',
		'date': '2014-03-01',
		'description': 'this is a long description of the job. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.',
		'clientId': '4777'
		},
		{
		 "id":2,
		"title":"Design logo",
		"category":"graphic design",
		"urgency": "not urgent",
		"price": "€ 130",
		'date': '2014-02-25',
		"description": "new logo for a football team. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
		"clientId": "456"
	 },
	 {
	 	"id":4,
		"title":"Build a contact manager",
		"category":"web development",
		"urgency": "urgent",
		"price" : "€ 1.400",
		'date': '2014-02-10',
		"description": "install Apache on VPS. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
		"clientId": "897" 
	},
	{
	 	"id":5,
		"title":"Build a booking app",
		"category":"web development",
		"urgency": "urgent",
		"price" : "€ 234",
		'date': '2014-02-05',
		"description": "install Apache on VPS. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
		"clientId": "90" 
	},
	{
	 	"id":6,
		"title":"Tic tac toe",
		"category":"system development",
		"urgency": "not urgent",
		"price" : "€ 567",
		'date': '2014-02-04',
		"description": "install Apache on VPS. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
		"clientId": "23" 
	},
	{
	 	"id":7,
		"title":"Build a membership website",
		"category":"system development",
		"urgency": " not urgent",
		"price" : "€ 400",
		'date': '2013-03-01',
		"description": "install Apache on VPS. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
		"clientId": "234" 
	}];
*/	
	var testData = {

    "tables": ["user_person"],
    "input": "streaming spotify",

    //
    "category": "Webbutveckling",
    "tags": [
      "JavaScript",
      "Node.js",
      "Scrum",
      "Frontend",
      "Social Media"
    ],
    //"region": "Stockholm",

    //conditions
    "company_tax": 0,
    "experience": 2,  // Minimum experience. Less will show up in results but at lower priority.. 
    "active": 0,     // Search only active profiles. Default. If set to 0 will match all visible profiles.

    "amount": 4       // Number of result posts shown for each view. Set by the app. 
                      // Perhaps implement clickable tabs array [<< < 1 2 3 4 5 ... > >>]
  };

  $scope.categories = MetaService.getCategories();
	$scope.selectedCategories = [];
	$scope.tags = MetaService.getTags();
	$scope.selectedTags = [];
  
  $scope.selection = 1;
  
  $scope.req = {
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
      // Display data
      $scope.result = data;
    });
	};

	$scope.go = function(path){
		$location.path(path);
	};

	
}]);


