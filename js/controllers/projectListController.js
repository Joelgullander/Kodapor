'use strict';

computenzControllers.controller('ProjectListController', 
	['$scope','$http', function($scope,$http) {
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
}]);