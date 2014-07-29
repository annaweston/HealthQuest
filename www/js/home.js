/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3, $ */
angular.module('affinity')
	.config(function($stateProvider) {
		$stateProvider.state('home', {
			url:'/home',
			templateUrl:'tmpl/home.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				diary:function(storage)  { return storage.getDiary(); },
				meds : function(utils) { 
		        	var u = utils, d = u.deferred();
			        d3.json('data/meds.json').get(function(err, rows) { 
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
			controller:['$scope', '$state', 'utils', '$swipe', 'meds', 'diary', 'profile', function($scope, $state, utils, $swipe, meds, diary, profile) {
				setUIViewTransition('transition-fade');
				$scope.meds = meds;
				$scope.diary = diary;
				var u = utils, sa = function(f) { utils.safeApply($scope, f); };
				var d = new Date();
				var dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				var dowfull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var mon = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
				$scope.dow = dowfull[d.getDay()].toLowerCase();
				$scope.date = [d.getDate(), mon[d.getMonth()], d.getFullYear()].join(' ');
				$scope.home = {};
				$scope.unsetShowMenu = function(evt) { 
					// console.log(' evt.target ', evt.target, $('.home .button.menu').has(evt.target).length);
					if (evt && evt.target && $('.home .button.menu').has(evt.target).length > 0){
						return;
					}
					$scope.home.showmenu = false;
					return true;
				};
				$scope.showINR = profile.get('meds') && profile.get('meds').filter(function(x) { return x.med.id == 'warfarin'; }).length > 0;
				$scope.showMenu = function() { $scope.home.showmenu = true; };
				$scope.hideMenu = function() { $scope.home.showmenu = false; };
				jQuery(document).on('scroll', function(evt) { 
				 	sa(function() { $scope.home.showmenu = false; });
				});
			    $scope.go = function(s) { 
			    	// console.log('go!! ', s);
			    	$state.go(s); 
			    };
			    $scope.openCompose = function() {
			    	$state.go('diary', { openCompose: true });
			    };
			    $scope.goCalendar = function() { 
			    	$state.go('diary', { openCalendar: true });
			    };
				$scope.home = {};
				$scope.profile = profile.attributes;
				window.profile = profile;
				window.$s = $scope;

				// $swipe.bind(angular.element('.home'), {
				// 	move: function(evt) { 
				// 		console.log('event >> ', evt);
				// 		sa(function() { $scope.home.showmenu = !$scope.home.showmenu; });
				// 	}
				// });
			}]
		});
	});

