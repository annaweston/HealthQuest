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

angular.module('hq', ['ui.router', 'ngAnimate', 'ngTouch', 'timer'])
	
	.config(function($stateProvider, $urlRouterProvider) {
		// anna: define your states here
		// define default state:
		$urlRouterProvider.otherwise('/start');
		$urlRouterProvider.when('/healthassessment', '/healthassessment/1');
		$stateProvider.state('start', {
			url:'/start',
			templateUrl:'tmpl/start.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }
			},		
			controller: function($scope, $state, utils, profile) 
			{
				
				switch(profile.get('stage')) {
					case 'profileform':
						$state.go('healthassess.general');
						break;
					case 'healthgen1':
						$state.go('healthassess.general2');
						break;
					case 'healthgen2':
						$state.go('healthassess.general3');
						break;
					case 'healthgen3':
						$state.go('healthassess.smoking');
						break;
					case 'healthsmoke':
						$state.go('healthassess.eating');
						break;
					case 'healtheat':
						$state.go('healthassess.alcohol');
						break;	
					case 'healthalco':
						$state.go('healthassess.category');
						break;	
					case 'category':
						$state.go('question');
						break;	
					default:
						$state.go('profileReg');				
				}
			}
		})
		.state('success', {
			url:'/feedback/success',
			templateUrl:'tmpl/feedback.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }

			},		
			controller: 'feedbackController',
		})
		.state('failure', {
			url:'/feedback/failure',
			templateUrl:'tmpl/feedbackwrong.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }

			},		
			controller: 'feedbackController',
				
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
			resolve : 
			{
				profile:function(storage)  { return storage.getProfile(); },
			},		
			controller:function($scope, $state, $stateParams, profile) {
				setUIViewTransition('transition-fade');
				$scope.categoryList = [
					{name : 'alcohol'},
					{name : 'fitness'},
					{name : 'food'},
					{name : 'weight'},
					{name : 'sleep'},
					{name : 'smoking'}
				];			
				$scope.title = 'Choose your category';
								
				$scope.addCategory = function() {
					var this_ = this;
					profile.set({ category : this_.slide.name});
					profile.set({ stage : 'category'});
					profile.save();
					$state.go('question');
				};
				
				window.prof = profile;
			}
		})
		
		.state('healthassess', {
			url: '/healthassessment',
			templateUrl: 'tmpl/healthassessment.html',	
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},		

	
		})

		.state('healthassess.general', {
			url: '/1',
			templateUrl: 'tmpl/healthassessment-general.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	

		})

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
		
		.state('healthassess.smoking', {
			url: '/2',
			templateUrl: 'tmpl/healthassessment-smoking.html',
			controller: 'healthAssessController',
		})
		
		.state('healthassess.eating', {
			url: '/3',
			templateUrl: 'tmpl/healthassessment-eating.html',
			controller: 'healthAssessController',	
		})

		.state('healthassess.alcohol', {
			url: '/4',
			templateUrl: 'tmpl/healthassessment-alcohol.html',
			controller: 'healthAssessController',
		})

		.state('healthassess.fitness', {
			url: '/5',
			templateUrl: 'tmpl/healthassessment-fitness.html',
			controller: 'healthAssessController',
		})
		
		.state('welcome', {
			url:'/welcome',
			templateUrl:'tmpl/welcome.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	
			controller:function($scope, $state, $stateParams, profile) {
				setUIViewTransition('transition-fade');				
			}
	
		})
		
		
		.state('stats', {
			url:'/statistics',
			templateUrl:'tmpl/stats.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }

			},		
			controller: 'statController',
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
			//window.rootScope = arguments;
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
					profile.set({ name : $scope.input.nameText});
					profile.set({ email : $scope.input.emailText});
					profile.set({ age : $scope.input.ageText});
					profile.set({ gender : $scope.input.genderText});
					profile.set({ stage : 'profileform'});
					profile.save();
					$state.go('healthassess.general');
				}
	})
	
	.controller('statController', function($scope, profile, $state, questionsAnswered, questions) {
				setUIViewTransition('transition-fade');
				
				
				
				$scope.title = "your stats";
												
				console.log(profile);

				$scope.percentage = Math.round((profile.get('qsCorrect') / profile.get('qsNumber')) * 100);

				$scope.timeTaken = profile.get('qsfastestTime');

				$scope.number = profile.get('qsNumber');
				$scope.correctstreak = profile.get('longestStreak');
			
	})
	.controller('feedbackController', function($scope, $state, utils, $swipe, questionsAnswered, profile, questions) {
				setUIViewTransition('transition-fade');
				$scope.feedbackWrong = "Sorry, that was incorrect!";
				$scope.feedbackCorrect = "Well Done!";

				var explanationNumber = questionsAnswered.models[questionsAnswered.models.length-1].get('questionID');	
								
				explanationNumber = (explanationNumber - 1);
				
				var explanation = questions.questions[explanationNumber].explanation;
				$scope.explanation = explanation;
				var question = questions.questions[explanationNumber].Question;
				$scope.question = question;
	})

	.controller('healthAssessController', function($scope, profile, $state) {
				setUIViewTransition('transition-fade');
				
				$scope.addHealthGen1 = function(){
						profile.set({ healthAssess1a : $scope.healthassessSection1a});
						profile.set({ healthAssess1b : $scope.healthassessSection1b});
						profile.set({ stage : 'healthgen1'});
						profile.save();
						$state.go('healthassess.general2');
				}

				$scope.addHealthGen2 = function(){
					profile.set({ healthAssess1c : $scope.healthassessSection1c});
					profile.set({ healthAssess1d : $scope.healthassessSection1d});
					profile.set({ healthAssess1e : $scope.healthassessSection1e});

					profile.set({ stage : 'healthgen2'});
					profile.save();
					$state.go('healthassess.general3');
				}
				
				$scope.addHealthGen3 = function(){
					profile.set({ healthAssess1f : $scope.healthassessSection1f});
					profile.set({ stage : 'healthgen3'});
					profile.save();
					console.log(profile);
					$state.go('healthassess.smoking');
				}
				
				
				$scope.addHealthSmoking = function(){
					profile.set({ healthAssess2a : $scope.healthassessSection2a});
					profile.set({ healthAssess2b : $scope.healthassessSection2b});
					profile.set({ healthAssess2c : $scope.healthassessSection2c});
					profile.set({ stage : 'healthsmoke'});
					profile.save();
					$state.go('healthassess.eating');
				}
				
								
				$scope.addHealthEating = function(){
					profile.set({ healthAssess3a : $scope.healthassessSection3a});
					profile.set({ healthAssess3b : $scope.healthassessSection3b});
					profile.set({ stage : 'healtheat'});
					profile.save();
					$state.go('healthassess.alcohol');
				}
				
				$scope.addHealthAlcohol = function(){
					profile.set({ healthAssess4a : $scope.healthassessSection4a});
					profile.set({ healthAssess4b : $scope.healthassessSection4b});
					profile.set({ stage : 'healthalco'});
					profile.save();
					$state.go('healthassess.fitness');
				}
				
				$scope.addHealthFitness = function(){
					profile.set({ healthAssess5a : $scope.healthassessSection5a});
					profile.set({ stage : 'healthfit'});
					profile.save();
					$state.go('categories');
				}

	})