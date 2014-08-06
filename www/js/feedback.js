/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3, $ */

angular.module('hq')
	.config(function($stateProvider) {
		$stateProvider
		.state('feedback', {
			url:'/feedback',
			templateUrl:'tmpl/feedback.html',
			controller:function($scope, $state, utils, $swipe, $stateParams, profile,  $rootScope) {
				setUIViewTransition('transition-fade');
				}
		})
		.state('feedback.success', {
			url:'/feedback/success',
			templateUrl:'tmpl/feedback.html',
			controller:function($scope, $state, utils, $swipe, $stateParams, profile,  $rootScope) {
				setUIViewTransition('transition-fade');
				$scope.feedback = "correct";
				console.log($rootScope);
				}
		})
		.state('feedback.failure', {
			url:'/feedback/failure',
			templateUrl:'tmpl/feedback.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				},			
			controller:function($scope, $state, utils, $swipe, $stateParams, profile) {
				setUIViewTransition('transition-fade');
			}
		});
	});