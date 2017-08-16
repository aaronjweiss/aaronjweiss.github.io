// create the module and name it myApp
var app = angular.module('ngApp', ['ui.router']);
    
	app.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');
	
		$stateProvider
			.state('home',{
				url: '/',
				templateUrl: '/views/home.html'	
			})
			
			.state('about',{
				url: '/about',			
				templateUrl: '/views/about.html'	
			});	
	});