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
		$urlRouterProvider.when('/healthassessment', '/healthassessment/1');
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
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},		
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
		.state('profileSaved', {
			url:'/setup',
			templateUrl:'tmpl/profileform.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},		
			controller:function($scope, $state, utils, $swipe, $stateParams) {
				setUIViewTransition('transition-fade');
				$scope.title = 'Welcome';
				}
		})
		.state('profileReg', {
			url:'/profile',
			templateUrl:'tmpl/profile.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},		
			controller: 'formController',
		})
		
		.state('categories', {
			url:'/categories',
			templateUrl:'tmpl/categories.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},		
			controller:function($scope, $state, utils, $swipe, $stateParams, profile, $rootScope) {

				setUIViewTransition('transition-fade');
				var u = utils, sa = function(f) { utils.safeApply($scope, f); };
				$scope.categoryList = ['alcohol', 'fitness', 'food', 'weight', 'sleep', 'smoking'];			
				$scope.title = 'Choose your category';

				
				$scope.addProfile = function(response) {
					profile.category = response;
					
				};
			}
		})
		
	
/*		.state('alcohol', {
			url:'/categories',
			templateUrl:'tmpl/questions.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},		
			controller:function($scope, $state, utils, $swipe, $stateParams) {
				setUIViewTransition('transition-fade');
				$scope.title = 'Choose your category';
				}
		})
*/		// home is defined in home.js so don't look for it here!
		// route to show our basic form (/form)
		.state('healthassess', {
			url: '/healthassessment',
			templateUrl: 'tmpl/healthassessment.html',	
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},		

	
		})
		// nested states 
		// each of these sections will have their own view
		// url will be nested (/form/profile)
		.state('healthassess.general', {
			url: '/1',
			templateUrl: 'tmpl/healthassessment-general.html',
			controller: 'healthAssessController',

		})
		// nested states 
		// each of these sections will have their own view
		// url will be nested (/form/profile)
		.state('healthassess.general2', {
			url: '/1b',
			templateUrl: 'tmpl/healthassessment-general-2.html',
			controller: 'healthAssessController',

		})
		
		.state('healthassess.general3', {
			url: '/1c',
			templateUrl: 'tmpl/healthassessment-general-3.html',
			controller: 'healthAssessController',
		})
		
		// url will be /form/interests
		.state('healthassess.smoking', {
			url: '/2',
			templateUrl: 'tmpl/healthassessment-smoking.html',
			controller: 'healthAssessController',
		})
		
		// url will be /form/payment
		.state('healthassess.eating', {
			url: '/3',
			templateUrl: 'tmpl/healthassessment-eating.html',
			controller: 'healthAssessController',	
		})
		// url will be /form/payment
		.state('healthassess.alcohol', {
			url: '/4',
			templateUrl: 'tmpl/healthassessment-alcohol.html',
			controller: 'healthAssessController',
		})
		// url will be /form/payment
		.state('healthassess.fitness', {
			url: '/5',
			templateUrl: 'tmpl/healthassessment-fitness.html',
			controller: 'healthAssessController',
		})
	
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
	
	.controller('formController', function($scope, profile, $state) {
				setUIViewTransition('transition-fade');
				console.log(profile);
				
				$scope.addProfile = function(){				
					profile.name = $scope.input.nameText;
					profile.email = $scope.input.emailText;
					profile.age = $scope.input.ageText;
					profile.gender = $scope.input.genderText;
					console.log(profile);
					profile.save();
					$state.go('healthassess.general');
				}
	})
	.controller('healthAssessController', function($scope, profile, $state) {
				setUIViewTransition('transition-fade');
				console.log(profile);

				$scope.addHealthGen1 = function(){
						profile.healthAssess1a = $scope.healthassessSection1a;
						profile.healthAssess1b = $scope.healthassessSection1b;
						console.log(profile);
						profile.save();
						console.log(profile);
						$state.go('healthassess.general2');
				}

				$scope.addHealthGen2 = function(){
					profile.healthAssess1c = $scope.healthassessSection1c;
					profile.healthAssess1d = $scope.healthassessSection1d;
					profile.healthAssess1e = $scope.healthassessSection1e;
					//console.log($scope.healthassessSection1c);
					console.log(profile);
					profile.save();
					$state.go('healthassess.general3');
				}
				
				$scope.addHealthGen3 = function(){
					$scope.profile.healthAssess1f = $scope.healthassessSection1f;
					profile.save();
					console.log(profile);
					$state.go('healthassess.smoking');
				}
				
				
				$scope.addHealthSmoking = function(){
					profile.healthAssess2a = $scope.healthassessSection2a;
					profile.healthAssess2b = $scope.healthassessSection2b;
					profile.healthAssess2c = $scope.healthassessSection2c;
					profile.save();
					console.log(profile);
					$state.go('healthassess.eating');
				}
				
								
				$scope.addHealthEating = function(){
					profile.healthAssess3a = $scope.healthassessSection3a;
					profile.healthAssess3b = $scope.healthassessSection3b;
					profile.save();
					console.log(profile);
					$state.go('healthassess.alcohol');
				}
				
				$scope.addHealthAlcohol = function(){
					profile.healthAssess4a = $scope.healthassessSection4a;
					profile.healthAssess4b = $scope.healthassessSection4b;
					profile.save();
					console.log(profile);
					$state.go('healthassess.fitness');
				}
				
				$scope.addHealthFitness = function(){
					profile.healthAssess5a = $scope.healthassessSection5a;
					profile.save();
					console.log(profile);
					$state.go('categories');
				}

	})