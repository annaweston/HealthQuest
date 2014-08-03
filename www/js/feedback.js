/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3, $ */

angular.module('hq')
	.config(function($stateProvider) {
		$stateProvider.state('feedback', {
			url:'/feedback',
			templateUrl:'tmpl/feedback.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				
			},			
			controller:function($scope, $state, utils, $swipe, $stateParams, profile, questions) {
				setUIViewTransition('transition-fade');
				console.log($stateParams.status);
				
			/*	var u = utils, sa = function(f) { utils.safeApply($scope, f); };
			console.log('question initialised with qid ', $stateParams.questionid);
				// setting the questionid into our scope so we can display it (if we want to!)
				$scope.questionid = $stateParams.questionid;
				var matching_qs = questions.filter(function(x) { return x["Question ID"] == $stateParams.questionid; });
				if (matching_qs.length < 1) {
					$state.go('error');
					return;
				}
				$scope.q = matching_qs[0];
				$scope.q.AnswerSplit = $scope.q.Answer.split(';').map(function(x) { return x.trim(); });
				$scope.setResponse = function(response) {
					console.log('anna clicked on ', response);
					// show feedback, then probably go to next question
				};
				console.log('question is ', $scope.q);*/
			}
		});
	});

