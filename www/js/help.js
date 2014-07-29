/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, Backbone */

angular.module('affinity')
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('help', {
			url:'/help',
			templateUrl:'tmpl/help.html',
			resolve: {	profile:function(storage)  { return storage.getProfile(); }	},			
			controller:['$scope', '$state', 'utils', 'profile', function($scope, $state, utils, profile) {
			}]
		});
	});
