/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery */

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

angular.module('affinity', ['ui.router', 'ngAnimate', 'ngTouch'])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/splash');
		$stateProvider.state('splash', {
			url:'/splash',
			templateUrl:'tmpl/splash.html',
			resolve: {	profile:function(storage)  { return storage.getProfile(); }	},			
			controller:['$scope', '$state', 'utils', 'profile', function($scope, $state, utils, profile) {
				if (profile.get('onboarded')) { 
					console.log('already onboarded - go home!');
					$state.go('home');
				}				
				var u = utils, sa = function(f) { utils.safeApply($scope, f); };
				if (typeof cordova === 'undefined') { 
					setTimeout(function() { 
						console.log('timeout!');
			        	sa(function() { $state.go('start'); });
					}, 1000);
				} else {
			        document.addEventListener('deviceready', function() { 
			        	sa(function() { $state.go('start'); });
			        }, false);
			    }
			}]
		}).state('start', {
			url:'/start',
			templateUrl:'tmpl/start.html',
			controller:['$scope','$state','storage','utils', function($scope, $state, storage, utils) {
				window.storage = storage;
				setUIViewTransition('transition-panright');
				$scope.next = function() { 
					console.log('$scope.el -- ', $scope.el);
					$('.app').find('.copy').addClass('left');
					setTimeout(function() { 
						$('.app').find('.start').fadeOut(1000);					
					}, 1000);
					setTimeout(function() { 
						$('.app').find('.copy').addClass('left');
						$state.go('start2'); 					
					}, 2000);
				};
			}]
		}).state('start2', {
			url:'/start2',
			templateUrl:'tmpl/start2.html',
			controller:['$scope','$state','utils',function($scope, $state, utils) {
				setUIViewTransition('transition-panright');
			}]
		}).state('start-name', {
			url:'/start-name',
			resolve: {	
				profile:function(storage)  { 
					try { 
						var d = storage.getProfile();
						d.fail(function(x)   { console.log("ERROR reject profile ", x);	});
						return d;
					} catch(e) { 
						console.log("ERROR exception ", e);
					}
				}
			},
			templateUrl:'tmpl/start-name.html',
			controller:['$scope','$state','profile','utils',function($scope, $state, profile, utils) {
				$scope.input = { firstname:profile.get('firstname'), lastname: profile.get('lastname') };
				setUIViewTransition('transition-panright');
				$scope.saveAndAdvance = function(props) {
					console.log('setting properties ', props);
					profile.set(props);
					profile.save();
					$state.go('start-bday');
				};
			}]
		}).state('start-bday', {
			url:'/start-bday',
			templateUrl:'tmpl/start-bday.html',
			resolve: {	profile:function(storage)  { return storage.getProfile(); }	},			
			controller:['$scope','$state','profile','utils',function($scope, $state, profile, utils) {
				$scope.input = {dob:profile.get('dob'), gender: profile.get('gender')};
				setUIViewTransition('transition-panright');
				$scope.saveAndAdvance = function(props) {
					console.log('setting properties ', props);
					profile.set(props);
					profile.save();
					$state.go('start-af');
				};				
			}]
		}).state('start-af', {
			url:'/start-af',
			templateUrl:'tmpl/start-af.html',
			resolve: {	profile:function(storage)  { return storage.getProfile(); }	},
			controller:['$scope','$state','profile','utils',function($scope, $state, profile, utils) {
				setUIViewTransition('transition-panright');
				$scope.input = {af:profile.get('af')};
				setUIViewTransition('transition-panright');
				$scope.closeHelp = function() {
					$scope.helpSection = false;	
				};
				$scope.showHelp = function(t) { 
					$scope.helpSection = t; 
				};
				$scope.saveAndAdvance = function(props) {
					profile.set(props);
					profile.save();
					$state.go('start-done');
				};
			}]
		}).state('start-done', {
			url:'/start-done',
			templateUrl:'tmpl/start-done.html',
			resolve: {	profile:function(storage)  { return storage.getProfile(); }	},			
			controller:['$scope','$state','profile','utils',function($scope, $state, profile, utils) {
				setUIViewTransition('transition-panright');
				$scope.saveAndAdvance = function(props) {
					profile.set({onboarded:true});
					profile.save();
					$state.go('home');
				};
			}]
		});
	}).directive('startAfHelp', function() { 
		return {
			restrict:'E',
			replace:true,			
			templateUrl:'tmpl/start-af-help.html',
			scope:{ section:'=', cancel:'=' }
		};
	}).controller('main', ['$scope','$rootScope', function($scope, $rootScope) { 
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
		});
		// console.log('backbone localstorage ', typeof Backbone.LocalStorage);
	}]);
