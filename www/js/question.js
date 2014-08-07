

/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3, $ */

angular.module('hq')
	.config(function($stateProvider) {
		$stateProvider.state('question', {
			url:'/question/:questionid',
			templateUrl:'tmpl/question.html',
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
			controller:function($scope, $state, utils, $swipe, $stateParams, profile, questions, $rootScope) {
				setUIViewTransition('transition-fade');
				var u = utils, sa = function(f) { utils.safeApply($scope, f); };
				
				// setting the questionid into our scope so we can display it (if we want to!)
				$scope.questionid = $stateParams.questionid;
				
				var qs_alcohol = questions.filter(function(x) { return x["Category"] == "alcohol"; });
				var qs_fitness = questions.filter(function(x) { return x["Category"] == "fitness"; });
				var qs_food = questions.filter(function(x) { return x["Category"] == "food"; });
				var qs_weight = questions.filter(function(x) { return x["Category"] == "weight"; });
				var qs_sleep = questions.filter(function(x) { return x["Category"] == "sleep"; });
				var qs_smoking = questions.filter(function(x) { return x["Category"] == "smoking"; });
					
				profile.category = "alcohol";	
				console.log(profile.category);	
					
				var matching_qs = questions.filter(function(x) { return x["Question ID"] == $stateParams.questionid; });
				if (matching_qs.length < 1) {
					$state.go('error');
					return;
				}
				
				$scope.q = matching_qs[0];
				$scope.q.AnswerSplit = $scope.q.Answer.split(';').map(function(x) { return x.trim(); });
				$scope.setResponse = function(response) {
					$rootScope.explanation = $scope.q.explanation;	
					//if correct go to home, if not go to start
					if($scope.q.correctAnswer == response){
						$state.go('success');
						return;
					}
					else{
						$state.go('failure');
						return;
					}
				};
			}
		});
	});

