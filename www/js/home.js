/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3, $ */

angular.module('hq')
	.config(function($stateProvider) {
		$stateProvider.state('home', {
			url:'/home',
			templateUrl:'tmpl/home.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questions : function(utils) { 
		        	var u = utils, d = u.deferred();
			        d3.csv('data/questions.csv').get(function(err, rows) { 
			          	if (err) { 
			          		d.reject();		
			          		console.error('could not load ', err);
			          		return;
			          	}
			          	d.resolve(rows);
			        });
			        return d.promise();
				}
			},			
			controller:function($scope, $state, utils, $swipe, profile, questions) {
				setUIViewTransition('transition-fade');
				var u = utils, sa = function(f) { utils.safeApply($scope, f); };
				$scope.home = {};
				$scope.unsetShowMenu = function(evt) { 
					// console.log(' evt.target ', evt.target, $('.home .button.menu').has(evt.target).length);
					if (evt && evt.target && $('.home .button.menu').has(evt.target).length > 0){
						return;
					}
					$scope.home.showmenu = false;
					return true;
				};
			    $scope.go = function(s) {  $state.go(s);  };
			    $scope.openCompose = function() {
			    	$state.go('diary', { openCompose: true });
			    };
			    $scope.goCalendar = function() { 
			    	$state.go('diary', { openCalendar: true });
			    };
				$scope.profile = profile.attributes;
				window.profile = profile;
				window.$s = $scope;
				console.log('questions ', questions);
				// if you want to try cool swiping action with ngTouch
				// $swipe.bind(angular.element('.home'), {
				// 	move: function(evt) { 
				// 		console.log('event >> ', evt);
				// 		sa(function() { $scope.home.showmenu = !$scope.home.showmenu; });
				// 	}
				// });
				console.log('home initialised');
			}
		});
	});

