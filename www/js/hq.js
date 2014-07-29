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
		// home is defined in home.js so don't look for it here!

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
