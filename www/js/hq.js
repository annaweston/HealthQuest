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
						$state.go('healthassessGeneral');
						break;
					case 'healthgen1':
						$state.go('healthassessGeneral2');
						break;
					case 'healthgen2':
						$state.go('healthassessGeneral3');
						break;
					case 'healthgen3':
						$state.go('healthassessSmoking');
						break;
					case 'healthsmoke':
						$state.go('healthassessEating');
						break;
					case 'healtheat':
						$state.go('healthassessAlcohol');
						break;	
					case 'healthalco':
						$state.go('categories');
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
		
		.state('healthassessGeneral', {
			url: '/healthassessment1',
			templateUrl: 'tmpl/healthassessment-general.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	

		})

		.state('healthassessGeneral2', {
			url: '/healthassessment1b',
			templateUrl: 'tmpl/healthassessment-general-2.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	

		})
		
		.state('healthassessGeneral3', {
			url: '/healthassessment1c',
			templateUrl: 'tmpl/healthassessment-general-3.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	
		})
		
		.state('healthassessSmoking', {
			url: '/healthassessment2',
			templateUrl: 'tmpl/healthassessment-smoking.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	
		})
		
		.state('healthassessEating', {
			url: '/healthassessment3',
			templateUrl: 'tmpl/healthassessment-eating.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	
		})

		.state('healthassessAlcohol', {
			url: '/healthassessment4',
			templateUrl: 'tmpl/healthassessment-alcohol.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	
		})

		.state('healthassessFitness', {
			url: '/healthassessment5',
			templateUrl: 'tmpl/healthassessment-fitness.html',
			controller: 'healthAssessController',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
			},	
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
				
				
				$scope.ProfileGender = [
					{gender: 'male', Value1: 'male'},
					{gender: 'female', Value1: 'female'},
					]

				$scope.addProfile = function(){				
					profile.set({ name : $scope.input.nameText});
					profile.set({ email : $scope.input.emailText});
					profile.set({ age : $scope.input.ageText});
					profile.set({ gender : $scope.input.genderText});
					profile.set({ stage : 'profileform'});
					profile.save();
					$state.go('healthassessGeneral');
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
				
				$scope.HealthGen1 = [
					{healthassessSection1a: 'Very Good', Value1: 'Very Good'},
					{healthassessSection1a: 'Good', Value1: 'Good'},
					{healthassessSection1a: 'Fair', Value1: 'Fair'},
					{healthassessSection1a: 'Bad', Value1: 'Bad'},
					{healthassessSection1a: 'Very Bad', Value1: 'Very Bad'},
				  ];
				  
				  				
				$scope.HealthGen1b = [
					{healthassessSection1b: '0', Value1: '0 (Not at all satisfied)'},
					{healthassessSection1b: '1', Value1: '1'},
					{healthassessSection1b: '2', Value1: '2'},
					{healthassessSection1b: '3', Value1: '3'},
					{healthassessSection1b: '4', Value1: '4'},
					{healthassessSection1b: '5', Value1: '5'},
					{healthassessSection1b: '6', Value1: '6'},
					{healthassessSection1b: '7', Value1: '7'},
					{healthassessSection1b: '8', Value1: '8'},
					{healthassessSection1b: '9', Value1: '9'},
					{healthassessSection1b: '10', Value1: '10 (Completely satisfied)'},
				  ];

				$scope.HealthGen1c = [
					{healthassessSection1c: '0', Value1: '0 (Not at all happy)'},
					{healthassessSection1c: '1', Value1: '1'},
					{healthassessSection1c: '2', Value1: '2'},
					{healthassessSection1c: '3', Value1: '3'},
					{healthassessSection1c: '4', Value1: '4'},
					{healthassessSection1c: '5', Value1: '5'},
					{healthassessSection1c: '6', Value1: '6'},
					{healthassessSection1c: '7', Value1: '7'},
					{healthassessSection1c: '8', Value1: '8'},
					{healthassessSection1c: '9', Value1: '9'},
					{healthassessSection1c: '10', Value1: '10 (Completely happy)'},
				  ];
				  
				$scope.HealthGen1d = [
					{healthassessSection1d: '0', Value1: '0 (Not at all anxious)'},
					{healthassessSection1d: '1', Value1: '1'},
					{healthassessSection1d: '2', Value1: '2'},
					{healthassessSection1d: '3', Value1: '3'},
					{healthassessSection1d: '4', Value1: '4'},
					{healthassessSection1d: '5', Value1: '5'},
					{healthassessSection1d: '6', Value1: '6'},
					{healthassessSection1d: '7', Value1: '7'},
					{healthassessSection1d: '8', Value1: '8'},
					{healthassessSection1d: '9', Value1: '9'},
					{healthassessSection1d: '10', Value1: '10 (Completely anxious)'},
				  ];

				$scope.HealthGen1e = [
					{healthassessSection1e: '0', Value1: '0 (Not at all worthwhile)'},
					{healthassessSection1e: '1', Value1: '1'},
					{healthassessSection1e: '2', Value1: '2'},
					{healthassessSection1e: '3', Value1: '3'},
					{healthassessSection1e: '4', Value1: '4'},
					{healthassessSection1e: '5', Value1: '5'},
					{healthassessSection1e: '6', Value1: '6'},
					{healthassessSection1e: '7', Value1: '7'},
					{healthassessSection1e: '8', Value1: '8'},
					{healthassessSection1e: '9', Value1: '9'},
					{healthassessSection1e: '10', Value1: '10 (Completely worthwhile)'},
				  ];

				$scope.HealthGen2a = [
					{healthassessSection2a: 'yes', Value1: 'yes'},
					{healthassessSection2a: 'no', Value1: 'no'},
				  ];

				$scope.HealthGen2b = [
					{healthassessSection2b: 'yes', Value1: 'yes'},
					{healthassessSection2b: 'no', Value1: 'no'},
				  ];

				$scope.HealthGen4a = [
					{healthassessSection4a: '1-2 a week', Value1: '1-2 a week'},
					{healthassessSection4a: '3-4 a week', Value1: '3-4 a week'},
					{healthassessSection4a: '5-6 a week', Value1: '5-6 a week'},
					{healthassessSection4a: '1-2 a month', Value1: '1-2 a month'},
					{healthassessSection4a: '1 every couple of months', Value1: '1 every couple of months'},
					{healthassessSection4a: '1/2 a year', Value1: '1/2 a year'},
					{healthassessSection4a: 'Not at all', Value1: 'Not at all'},
				  ];
	
				$scope.HealthGen5a = [
					{healthassessSection5a: '0', Value1: '0'},
					{healthassessSection5a: '1', Value1: '1'},
					{healthassessSection5a: '2', Value1: '2'},
					{healthassessSection5a: '3', Value1: '3'},
					{healthassessSection5a: '4', Value1: '4'},
					{healthassessSection5a: '5', Value1: '5'},
					{healthassessSection5a: '6', Value1: '6'},
					{healthassessSection5a: '7', Value1: '7'}
				  ];
				  



				$scope.addHealthGen1 = function(response){
					if(response != false)
					{
						profile.set({ healthAssess1a : $scope.healthassessSection1a});
						profile.set({ healthAssess1b : $scope.healthassessSection1b});
						profile.set({ stage : 'healthgen1'});
						profile.save();
						$state.go('healthassessGeneral2');
					}
				}
								
				$scope.addHealthGen2 = function(response){
				if(response != false)
					{
						profile.set({ healthAssess1c : $scope.healthassessSection1c});
						profile.set({ healthAssess1d : $scope.healthassessSection1d});
						profile.set({ stage : 'healthgen2'});
						profile.save();
						$state.go('healthassessGeneral3');
					}
				}
				
				$scope.addHealthGen3 = function(response){
				if(response != false)
					{

					profile.set({ healthAssess1e : $scope.healthassessSection1e});
					profile.set({ stage : 'healthgen3'});
					profile.save();
					console.log(profile);
					$state.go('healthassessSmoking');
					}
				}
				
				$scope.addHealthSmoking = function(response){
					if(response != false)
					{
						profile.set({ healthAssess2a : $scope.healthassessSection2a});
						profile.set({ healthAssess2b : $scope.healthassessSection2b});
						profile.set({ healthAssess2c : $scope.healthassessSection2c});
						profile.set({ stage : 'healthsmoke'});
						profile.save();
						$state.go('healthassessEating');
					}
				}
				
								
				$scope.addHealthEating = function(response){
					if(response != false)
					{
						profile.set({ healthAssess3a : $scope.healthassessSection3a});
						profile.set({ healthAssess3b : $scope.healthassessSection3b});
						profile.set({ stage : 'healtheat'});
						profile.save();
						$state.go('healthassessAlcohol');
					}
				}
				
				$scope.addHealthAlcohol = function(response){
					if(response != false)
					{
						profile.set({ healthAssess4a : $scope.healthassessSection4a});
						profile.set({ healthAssess4b : $scope.healthassessSection4b});
						profile.set({ stage : 'healthalco'});
						profile.save();
						$state.go('healthassessFitness');
					}
				}
				
				$scope.addHealthFitness = function(response){					
				if(response != false)
					{
						profile.set({ healthAssess5a : $scope.healthassessSection5a});
						profile.set({ stage : 'healthfit'});
						profile.save();
						$state.go('categories');
					}
				}

	})