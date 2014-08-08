/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery */

// this utility helps us change the class of the main ng-view
// to support fancy transitions between views
var setUIViewTransition = function(transitionclass) {
	var view = jQuery('[ui-view].app');
	var classes = view.attr('class').split(/\s+/);
	classes.map(function(x) { 
		if (x.indexOf('transition-') === 0) { 
			view.removeClass(x);
		}
	});
	jQuery('[ui-view].app').addClass(transitionclass);
};

angular.module('hq', ['ui.router', 'ngAnimate', 'ngTouch'])
	.config(function($stateProvider, $urlRouterProvider) {
		// anna: define your states here
		// define default state:
		$urlRouterProvider.otherwise('/start');
		$stateProvider.state('start', {
			url:'/start',
			templateUrl:'tmpl/start.html',
			resolve: {	profile:function(storage)  { return storage.getProfile(); }	},			
			controller:['$scope', '$state', 'utils', 'profile', function($scope, $state, utils, profile) {
				if (profile.get('onboarded')) { 
					console.log('already onboarded - go home!');
					$state.go('home');
				}				
				var u = utils, sa = function(f) { utils.safeApply($scope, f); };
				console.log('start was loaded > ');
			}]
		})
		.state('success', {
			url:'/feedback/success',
			templateUrl:'tmpl/feedback.html',
			controller:function($scope, $state, utils, $swipe, $stateParams, $rootScope) {
				setUIViewTransition('transition-fade');
				$scope.feedback = "Correct";
				console.log($rootScope.explanation);	
				}
		})
		.state('failure', {
			url:'/feedback/failure',
			templateUrl:'tmpl/feedback.html',
			controller:function($scope, $state, utils, $swipe, $stateParams) {
				setUIViewTransition('transition-fade');
				$scope.feedback = "Incorrect"			
				}
		})
		.state('profile', {
			url:'/setup',
			templateUrl:'tmpl/profileform.html',
			controller:function($scope, $state, utils, $swipe, $stateParams) {
				setUIViewTransition('transition-fade');
				$scope.title = 'Welcome';
				}
		})
		.state('categories', {
			url:'/categories',
			templateUrl:'tmpl/categories.html',
			controller:function($scope, $state, utils, $swipe, $stateParams) {
				setUIViewTransition('transition-fade');
				$scope.categoryList = ['alcohol', 'fitness', 'food', 'weight', 'sleep', 'smoking'];			
				$scope.title = 'Choose your category';
				}
		})
		.state('alcohol', {
			url:'/categories',
			templateUrl:'tmpl/questions.html',
			controller:function($scope, $state, utils, $swipe, $stateParams) {
				setUIViewTransition('transition-fade');
				$scope.title = 'Choose your category';
				}
		})
		// home is defined in home.js so don't look for it here!
		// route to show our basic form (/form)
		.state('healthassess', {
			url: '/healthassess',
			templateUrl: 'tmpl/healthassessment.html',
			controller: 'formController'
		})
		
		// nested states 
		// each of these sections will have their own view
		// url will be nested (/form/profile)
		.state('healthassess.general', {
			templateUrl: 'tmpl/healthassessment-general.html'
		})
		
		// url will be /form/interests
		.state('healthassess.smoking', {
			templateUrl: 'tmpl/healthassessment-smoking.html'
		})
		
		// url will be /form/payment
		.state('healthassess.eating', {
			templateUrl: 'tmpl/healthassessment-eating.html'
		})
		// url will be /form/payment
		.state('healthassess.alcohol', {
			templateUrl: 'tmpl/healthassessment-alcohol.html'
		})
		// url will be /form/payment
		.state('healthassess.fitness', {
				templateUrl: 'tmpl/healthassessment-fitness.html'
		});
			
	})
	
	.controller('main', ['$scope','$rootScope', function($scope, $rootScope) { 
		window.$s = $scope;
		$scope.profile = {};
		// $scope.$watch('profile', function(x) { console.log('profile change >> ', x); });
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
			console.log('stateChangeStart', toState.name);
		});
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
			console.log('stateChangeSuccess', toState.name);
		});
		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams){ 
			console.log('stateChangeError', toState.name, event, toParams, fromState, fromParams);
			console.log(arguments);
		});
	
		// console.log('backbone localstorage ', typeof Backbone.LocalStorage);
	}])
	.controller('explanationCtrl', ['$scope','$rootScope', function($scope, $feedback) {
		$scope.msg = $feedback;
	}])
	
	.controller('formController', function($scope) {  
		// we will store all of our form data in this object
		$scope.formData = {};
		
		// function to process the form
		$scope.processForm = function() {
			alert('awesome!');  
		};
		
	})