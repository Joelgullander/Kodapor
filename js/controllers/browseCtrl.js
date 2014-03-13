'use strict';

computenzControllers.controller('BrowseCtrl', 
	['$scope','$http', function($scope,$http) {
		$scope.experienceForm = {};
		$scope.experienceForm.years = 1;
		$scope.locations.options = {};
		$scope.category = {};
		$scope.language = {};
		
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
			{ 
      "username": "AndersAhlin",
      "firstname": "Anders",
      "lastname": "Ahlin",
      "category":"Webbutveckling",
      "image": "php/imageRepo/profiles/AndersAhlin.jpg",
      "snippet": "Lorem ipsum...",
      "link": "www.andersahlinit.com",
      "location": "Huddinge"
			},
			{ 
				"username": "SvenGurra",
      "firstname": "Sven-Göran",
      "lastname": "Lindquist",
      "category":"Webbutveckling",
      "image": "php/imageRepo/profiles/SvenGurra.jpg",
      "snippet": "Lorem ipsum...",
      "link": "www.piratsvenne.com",
      "location": "Märsta"
			},
			{ 
				"username": "SvenGurra",
      "firstname": "Sven-Göran",
      "lastname": "Lindquist",
      "category":"Webbutveckling",
      "image": "php/imageRepo/profiles/SvenGurra.jpg",
      "snippet": "Lorem ipsum...",
      "link": "www.piratsvenne.com",
      "location": "Märsta"
			},
			{ 
				"username": "SvenGurra",
      "firstname": "Sven-Göran",
      "lastname": "Lindquist",
      "category":"Webbutveckling",
      "image": "php/imageRepo/profiles/SvenGurra.jpg",
      "snippet": "Lorem ipsum...",
      "link": "www.piratsvenne.com",
      "location": "Märsta"
			},
			{ 
				"username": "SvenGurra",
      "firstname": "Sven-Göran",
      "lastname": "Lindquist",
      "category":"Webbutveckling",
      "image": "php/imageRepo/profiles/SvenGurra.jpg",
      "snippet": "Lorem ipsum...",
      "link": "www.piratsvenne.com",
      "location": "Märsta"
			}

		];

		
		
}]);


