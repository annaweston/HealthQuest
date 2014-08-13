

/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, d3, $ */

angular.module('hq')
	.factory('qFactory', function() {
		var d = new $.Deferred();
        d3.csv('data/questions.csv').get(function(err, rows) { 
          	if (err) { 
          		d.reject();		
          		console.error('could not load ', err);
          		return;
          	}
          	d.resolve({
          		questions: rows,
          		getCategory: function(c) { 
          			console.log('get category ', c);
          			return rows.filter(function(r) { return r.Category == c; }); 
          		},
				
				
          		chooseRandom : function(c) { 
          			var q = this.getCategory(c);
          			if (!q) { 
          				console.error('no questions of that category');
          				return;
          			}
          			var i = Math.floor(q.length*Math.random()),
          				qrand = q[i];
          			return qrand;
          		},
				
				
          		chooseRandomButNotThese:function(c, forbidden_ids) { 
          			var qs = this.getCategory(c),
          				qfiltered = qs.filter(function(q) { 
          					return forbidden_ids.indexOf(q['questionID']) < 0;
          				});

          			if (qfiltered.length === 0) {
          				console.error('aint got no questions of category ', c, ' left');
          				return; //
          			}

		          	var i = Math.floor(qfiltered.length*Math.random()),
          				qrand = qfiltered[i];

          			return qrand;		
          		}
          	});
        });
        return { 
        	load:function() { 
        		return d.promise();
        	}
        }
	})
	
	.config(function($stateProvider) {
		$stateProvider.state('question', {
			url:'/question/:questionid',
			templateUrl:'tmpl/question.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questions : function(qFactory) { return qFactory.load(); }
			},		
			controller:function(profile, questions, $scope, $stateParams, qFactory) {
				setUIViewTransition('transition-fade');
								
				// setting the questionid into our scope so we can display it (if we want to!)
				$scope.questionid = $stateParams.questionid;
				
/*				var qs_alcohol = questions.filter(function(x) { return x["Category"] == "alcohol"; });
				var qs_fitness = questions.filter(function(x) { return x["Category"] == "fitness"; });
				var qs_food = questions.filter(function(x) { return x["Category"] == "food"; });
				var qs_weight = questions.filter(function(x) { return x["Category"] == "weight"; });
				var qs_sleep = questions.filter(function(x) { return x["Category"] == "sleep"; });
				var qs_smoking = questions.filter(function(x) { return x["Category"] == "smoking"; });
*/					
			
				var category = profile.get("category");

				var qs = questions.chooseRandom(category);
				
				
				$scope.questionid = qs.questionID;
				console.log(qs);
				var id = "questionID";
				
				$scope.question = qs.Question;

/*				var matching_qs = questions.filter(function(x) { return x["questionID"] == qs; });
				if (matching_qs.length < 1) {
					$state.go('error');
					return;
				}
*/				
				
				console.log(qs.Question);
				
				$scope.answerSplit = qs.Answer.split(';').map(function(x) { return x.trim(); });
				
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

