

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
				
				nextQs : function(c, n) { 
          			var q = this.getCategory(c);
          			if (!q) { 
          				console.error('no questions of that category');
          				return;
          			}
          			var i = n + 1;
						qrand = q[i];
          			return qrand;
          		},

				
          		chooseRandomButNotThese:function(c, forbidden_ids) { 
          			var qs = this.getCategory(c),
          				qfiltered = qs.filter(function(c) { 
          					return forbidden_ids.indexOf(c['questionID']) < 0;
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
		$stateProvider
		
		.state('question', {
			url:'/question/',
			templateUrl:'tmpl/question.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }
			},		
			controller:function(profile, questions, $scope, $stateParams, qFactory, $state, $filter, questionsAnswered) {
				
				setUIViewTransition('transition-fade');
		
			/*		function getQuestions(quest, profile)
					{	
						var qs = [];
						var profGender = profile.get('gender');	
						console.log('2', profGender);
						
						console.log(quest);
						
						//console.log('2e', quest.questions.length);
						for (i = 3; i < quest.questions.length; i++) 
						{ 
							var questionGender = (quest.questions[i].Gender);
							if(questionGender == profGender)
							{
								qs.push(quest.questions[i]);
							}
							else if (questionGender == "")
							{
								qs.push(quest.questions[i]);
							}
							else
							{
								console.log('nope');
							}
						}
						return qs;
	
					}
				*/
				
				var timeStart = new Date().getTime();				
				var category = profile.get("category");
				
				var qs = questions.chooseRandom(category);
//				var qs = getQuestions(qs, profile);
											
				$scope.questionid = qs.questionID;		
				$scope.question = qs.Question;
				$scope.category = qs.Category;				
				$scope.answerSplit = qs.Answer.split(';').map(function(x) { return x.trim(); });
				$scope.correctAnswer = qs.correctAnswer;
				
			$scope.setResponse = function(response) {
				var timeStop= new Date().getTime();				
				var timetoAns = ((timeStop - timeStart)/1000);
				var qsAnswered = {};
				
				var qs_completed = profile.get("qsNumber");
				var qs_streak = profile.get("qsStreak");
				var qs_correct = profile.get("qsCorrect");
				var qs_fastest = profile.get("qsfastestTime");
				var longest_streak = profile.get("longestStreak");
				var profile_name = profile.get("name");
				var profile_email = profile.get("email");
				
				if(!qs_completed)
				{
					qs_completed = 1;
				}
				else{
					qs_completed = qs_completed + 1;
				}
				
				if(!response)
				{
					response = "timedOut";
				}
				if(!longest_streak){
					longest_streak = 0;
				}
				if(!qs_correct){
					qs_correct = 0;
				}

				
				if(response == $scope.correctAnswer)
				{
					//set the fastest time for answering correctly
					if(!qs_fastest){
							qs_fastest = timetoAns;
					}
						else
						{
							if(timetoAns < qs_fastest)
							{
								qs_fastest = timetoAns;
							}
						}

					qs_correct = qs_correct + 1;
					if(qs_streak >= longest_streak)
					{
						qs_streak = qs_streak + 1;
						longest_streak = qs_streak;
					}
					else
					{
						qs_streak = qs_streak + 1;
					}
				}
				else 
				{
					if(qs_streak > longest_streak)
					{
						longest_streak = qs_streak;
						qs_streak = 0;
					}
					else
					{
						qs_streak = 0;
					}
					
				}
				
				questionsAnswered.create({
					id: timeStart,
					pName: profile_name,
					pEmail: profile_email,
					qNumberCompleted: qs_completed,
					questionID : $scope.questionid,
					qUserAns : response,
					qCorrectAns : $scope.correctAnswer,
					qTimeStart : timeStart,
					qTimeStop : timeStop,
					qTimetoAns : timetoAns,
					qTimeofDay: timeStop});
					
				//questionsAnswered.save();				
				profile.set({ profName: profile_name,
					profEmail: profile_email, qsNumber: qs_completed, qsStreak : qs_streak, longestStreak: longest_streak, qsCorrect : qs_correct, qsfastestTime: qs_fastest });
				
					timeOut = profile.get('startOfExp');
					
					if(!timeOut)
					{
						timeOut= new Date().getTime();
					}
					console.log(timeOut);
					$scope.now= new Date().getTime();				
					console.log($scope.now);
									
					var diffDays = ($scope.now - timeOut);

				//if correct go to home, if not go to start
				if($scope.correctAnswer == response){
					if(diffDays >= 864000000)
						{
							profile.set({ complete: 'complete'});
							profile.save();
							$state.go('test');
						}
						else
						{	
							profile.save();
							$state.go('success');
						}
					}
				else
				{
					if(diffDays >= 864000000)
					{
						profile.set({ complete: 'complete'});
						profile.save();
						$state.go('test');
					}
					else
					{	
						$state.go('failure');
						profile.save();
						return;
					}
				}
				}
			
				$scope.finishedTimer = function(){
						$scope.setResponse();
				}
			}
		})
		
		.state('test', {
			url:'/test',
			templateUrl:'tmpl/test.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }
			},		
			controller:function(profile, questions, $scope, $stateParams, qFactory, $state, questionsAnswered) {
				
				setUIViewTransition('transition-fade');
								
				var timeStart = new Date().getTime();				
				var	categoryList = ['alcohol', 'fitness', 'food', 'weight', 'sleep','smoking'];				
				
				var randCategory = (Math.random() * (5 - 0) + 0);
				randCategory = Math.round(randCategory);
				var selectCategory = categoryList[randCategory];								
				var qs = questions.chooseRandom(selectCategory);
				
				$scope.questionid = qs.questionID;		
				$scope.question = qs.Question;
				$scope.category = qs.Category;				
				$scope.answerSplit = qs.Answer.split(';').map(function(x) { return x.trim(); });
				$scope.correctAnswer = qs.correctAnswer;
				
/*				var profile_name = profile.get("name");
				var profile_email = profile.get("email");
	
*/				//$scope.questionid = qs.questionID;		

				$scope.question = qs.Question;
				//$scope.category = qs.Category;				
				$scope.answerSplit = qs.Answer.split(';').map(function(x) { return x.trim(); });
				//$scope.correctAnswer = qs.correctAnswer;
				
				
			$scope.setResponse = function(response) {
				var timeStop= new Date().getTime();				
				var timetoAns = ((timeStop - timeStart)/1000);
				
				var profile_name = profile.get("name");
				var profile_email = profile.get("email");
				var qs_completed = 0 ; //profile.get("qNumberCompleted");


				console.log(qs_completed);
				
				if(!response)
				{
					response = "timedOut";
				}

				if(!qs_completed)
				{
					qs_completed = 1;
					
				}
				else
				{
					qs_completed = qs_completed + 1;

				}

				questionsAnswered.create({
					id: "test",
					pName: profile_name,
					pEmail: profile_email,
					qNumberCompleted: qs_completed,
					questionID : $scope.questionid,
					qUserAns : response,
					qCorrectAns : $scope.correctAnswer,
					qTimeStart : timeStart,
					qTimeStop : timeStop,
					qTimetoAns : timetoAns,
					qTimeofDay: timeStop});
				
				profile.set({ profName: profile_name, profEmail: profile_email, qNumberCompleted: qs_completed });
	
				profile.save();
				
				if(qs_completed >= 20)
				{
					console.log(qs_completed);
					$state.go('healthassessGeneral');
				}
				else
				{	
					console.log(qs_completed);
					$state.go('reload');
				}

			
				}
				
				$scope.finishedTimer = function(){
					$scope.setResponse();
				}
				
			}
		})
	});

