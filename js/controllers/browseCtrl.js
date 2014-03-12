'use strict';

computenzControllers.controller('BrowseCtrl', 
	['$scope','$http', function($scope,$http) {
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
		
		
}]);


