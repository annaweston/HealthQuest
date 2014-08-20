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
          			//console.log('get category ', c);
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
		
		.state('timeout', {
			url:'/OutOfTime',
			templateUrl:'tmpl/timeout.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }
			},		
			controller: 'questionTimeoutController',
		})
		
		.state('question', {
			url:'/question',
			templateUrl:'tmpl/question.html',
			resolve : {
				profile:function(storage)  { return storage.getProfile(); },
				questionsAnswered : function(storage) { return storage.getQsAns(); },
				questions : function(qFactory) { return qFactory.load(); }
			},		
			controller: 'questionController',
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
								
				$scope.timeStart = new Date().getTime();				
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
				
				
				
			$scope.setResponse = function(response) {
				var timeStop= new Date().getTime();				
				var timetoAns = ((timeStop - $scope.timeStart)/1000);
				
				var profile_name = profile.get("name");
				var profile_email = profile.get("email");
				var qs_completed = profile.get("qNumberCompleted");


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
					qTimeStart : $scope.timeStart,
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
		
	})
	
	.controller('questionController', function(profile, questions, $scope, $stateParams, qFactory, $state, $filter, questionsAnswered) {
				
				setUIViewTransition('transition-fade');
		
				$scope.timeStart = new Date().getTime();				
				var category = profile.get("category");
				
				var qs = questions.chooseRandom(category);
											
				$scope.questionid = qs.questionID;		
				$scope.question = qs.Question;
				$scope.category = qs.Category;				
				$scope.answerSplit = qs.Answer.split(';').map(function(x) { return x.trim(); });
				$scope.correctAnswer = qs.correctAnswer;

			$scope.redirectPage = function(response){
				$scope.userAnswer = "timedOut";
				$scope.finishedTimer();
				
			}

			$scope.finishedTimer = function(response){

				$scope.userAnswer = "timedOut";
				var timeStop= new Date().getTime();				
				var timetoAns = ((timeStop - $scope.timeStart)/1000);
				var qsAnswered = {};

				var qs_completed = profile.get("qsNumber");
				var qs_streak = profile.get("qsStreak");
				var qs_correct = profile.get("qsCorrect");
				var qs_fastest = profile.get("qsfastestTime");
				var longest_streak = profile.get("longestStreak");
				var profile_name = profile.get("name");
				var profile_email = profile.get("email");
				
				if(typeof qs_completed === "undefined" )
				{
					qs_completed = 1;
				}
				else{
					qs_completed = qs_completed + 1;
				};
				
				
				if(typeof longest_streak === "undefined" )
				{
					longest_streak = 0;
				};
				
				if(typeof qs_correct === "undefined")
				{
					qs_correct = 0;
				}
			
				if(qs_streak > longest_streak)
				{
					longest_streak = qs_streak;
					qs_streak = 0;
				}
				else
				{
					qs_streak = 0;
				}
				
				questionsAnswered.create({
					id: qs_completed,
					pName: profile_name,
					pEmail: profile_email,
					qNumberCompleted: qs_completed,
					questionID : $scope.questionid,
					qUserAns : response,
					qCorrectAns : $scope.correctAnswer,
					qTimeStart : $scope.timeStart,
					qTimeStop : timeStop,
					qTimetoAns : timetoAns,
					qTimeofDay: timeStop});
				profile.set({ profName: profile_name, profEmail: profile_email, qsNumber: qs_completed, qsStreak : qs_streak, longestStreak: longest_streak, qsCorrect : qs_correct, qsfastestTime: qs_fastest });
				profile.save();
$state.go('timeOut');				
				
			}
			
			$scope.setResponse = function(response) {
				
				$scope.userAnswer = response;
				var timeStop= new Date().getTime();				
				var timetoAns = ((timeStop - $scope.timeStart)/1000);
				var qsAnswered = {};

				var qs_completed = profile.get("qsNumber");
				var qs_streak = profile.get("qsStreak");
				var qs_correct = profile.get("qsCorrect");
				var qs_fastest = profile.get("qsfastestTime");
				var longest_streak = profile.get("longestStreak");
				var profile_name = profile.get("name");
				var profile_email = profile.get("email");

				if(typeof qs_completed === "undefined" )
				{
					qs_completed = 1;
				}
				else{
					qs_completed = qs_completed + 1;
				};
				
				if(typeof $scope.userAnswer === "undefined" )
				{ 
					console.log('fjklj;mdsamfdsamfmsdmfas', $scope.userAnswer);
					$scope.userAnswer = "timedOut";
				};
				
				if(typeof $scope.userAnswer === "null" )
				{ 
					console.log('fjkljnull', $scope.userAnswer);
					$scope.userAnswer = "timedOut";
				};
				
				
				if(typeof longest_streak === "undefined" )
				{
					longest_streak = 0;
				};
				
				if(typeof qs_correct === "undefined")
				{
					qs_correct = 0;
				}

				if($scope.correctAnswer == $scope.userAnswer)
				{
					qs_correct = qs_correct + 1;
					//set the fastest time for answering correctly
					if(!qs_fastest)
					{
							qs_fastest = timetoAns;
					}
					else
					{
							if(timetoAns < qs_fastest)
							{
								qs_fastest = timetoAns;
							}
					}

					if(qs_streak >= longest_streak)
					{
						qs_streak = qs_streak + 1;
						longest_streak = qs_streak;
					}
					else
					{
						qs_streak = qs_streak + 1;
					}
					addNewData();
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
					addNewData();
					
				};
				
				function addNewData()
				{
					questionsAnswered.create({
						id: qs_completed,
						pName: profile_name,
						pEmail: profile_email,
						qNumberCompleted: qs_completed,
						questionID : $scope.questionid,
						qUserAns : response,
						qCorrectAns : $scope.correctAnswer,
						qTimeStart : $scope.timeStart,
						qTimeStop : timeStop,
						qTimetoAns : timetoAns,
						qTimeofDay: timeStop});
					profile.set({ profName: profile_name, profEmail: profile_email, qsNumber: qs_completed, qsStreak : qs_streak, longestStreak: longest_streak, qsCorrect : qs_correct, qsfastestTime: qs_fastest });
					checkAnswer();
				}
				
				
				//this is for the count down of days
	/*			timeOut = profile.get('startOfExp');
				if(! timeOut)
				{
					timeOut= new Date().getTime();
				}
				else{};
					//console.log(timeOut);
				$scope.now= new Date().getTime();				
					//console.log($scope.now);
									
				var diffDays = ($scope.now - timeOut);*/

				//if correct go to home, if not go to start
		function checkAnswer ()
				{
					console.log($scope.correctAnswer);

					console.log($scope.userAnswer);
					if($scope.correctAnswer == $scope.userAnswer)
					{
						console.log('neojv');
							/*if(diffDays >= 864000000)
							{
								profile.set({ complete: 'complete'});
								profile.save();
								$state.go('test');
							}
							else
							{	*/
								profile.save();
								$state.go('success');
						/*	}*/
					}
					else
					{
						
					/*	console.log('nfkenvosjeojv');
						if(diffDays >= 864000000)
						{
							profile.set({ complete: 'complete'});
							profile.save();
							$state.go('test');
						}
						else
						{*/	
							profile.save();
							$state.go('failure');
						/*}*/
					}
				}
			};
		
			})
	.controller('questionTimeoutController', function(profile, questions, $scope, $stateParams, qFactory, $state, $filter, questionsAnswered) {

			$scope.finishedTimer = function(response){

				$scope.userAnswer = "timedOut";
				var timeStop= new Date().getTime();				
				var timetoAns = ((timeStop - $scope.timeStart)/1000);
				//var qsAnswered = {};

				var qs_completed = profile.get("qsNumber");
				var qs_streak = profile.get("qsStreak");
				var qs_correct = profile.get("qsCorrect");
				var qs_fastest = profile.get("qsfastestTime");
				var longest_streak = profile.get("longestStreak");
				var profile_name = profile.get("name");
				var profile_email = profile.get("email");
				
				if(typeof qs_completed === "undefined" )
				{
					qs_completed = 1;
				}
				else{
					qs_completed = qs_completed + 1;
				};
				
				
				if(typeof longest_streak === "undefined" )
				{
					longest_streak = 0;
				};
				
				if(typeof qs_correct === "undefined")
				{
					qs_correct = 0;
				}
			
				if(qs_streak > longest_streak)
				{
					longest_streak = qs_streak;
					qs_streak = 0;
				}
				else
				{
					qs_streak = 0;
				}
				
				questionsAnswered.create({
					id: qs_completed,
					pName: profile_name,
					pEmail: profile_email,
					qNumberCompleted: qs_completed,
					questionID : $scope.questionid,
					qUserAns : response,
					qCorrectAns : $scope.correctAnswer,
					qTimeStart : $scope.timeStart,
					qTimeStop : timeStop,
					qTimetoAns : timetoAns,
					qTimeofDay: timeStop});
				profile.set({ profName: profile_name, profEmail: profile_email, qsNumber: qs_completed, qsStreak : qs_streak, longestStreak: longest_streak, qsCorrect : qs_correct, qsfastestTime: qs_fastest });
				profile.save();
				$state.go('failure');
				
				
			}
			
			$scope.setResponse = function(response) {
				
				$scope.userAnswer = response;
				var timeStop= new Date().getTime();				
				var timetoAns = ((timeStop - $scope.timeStart)/1000);
				var qsAnswered = {};

				var qs_completed = profile.get("qsNumber");
				var qs_streak = profile.get("qsStreak");
				var qs_correct = profile.get("qsCorrect");
				var qs_fastest = profile.get("qsfastestTime");
				var longest_streak = profile.get("longestStreak");
				var profile_name = profile.get("name");
				var profile_email = profile.get("email");

				if(typeof qs_completed === "undefined" )
				{
					qs_completed = 1;
				}
				else{
					qs_completed = qs_completed + 1;
				};
				
				if(typeof $scope.userAnswer === "undefined" )
				{ 
					console.log('fjklj;mdsamfdsamfmsdmfas', $scope.userAnswer);
					$scope.userAnswer = "timedOut";
				};
				
				if(typeof $scope.userAnswer === "null" )
				{ 
					console.log('fjkljnull', $scope.userAnswer);
					$scope.userAnswer = "timedOut";
				};
				
				
				if(typeof longest_streak === "undefined" )
				{
					longest_streak = 0;
				};
				
				if(typeof qs_correct === "undefined")
				{
					qs_correct = 0;
				}

				if($scope.correctAnswer == $scope.userAnswer)
				{
					qs_correct = qs_correct + 1;
					//set the fastest time for answering correctly
					if(!qs_fastest)
					{
							qs_fastest = timetoAns;
					}
					else
					{
							if(timetoAns < qs_fastest)
							{
								qs_fastest = timetoAns;
							}
					}

					if(qs_streak >= longest_streak)
					{
						qs_streak = qs_streak + 1;
						longest_streak = qs_streak;
					}
					else
					{
						qs_streak = qs_streak + 1;
					}
					addNewData();
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
					addNewData();
					
				};
				
				function addNewData()
				{
					questionsAnswered.create({
						id: qs_completed,
						pName: profile_name,
						pEmail: profile_email,
						qNumberCompleted: qs_completed,
						questionID : $scope.questionid,
						qUserAns : response,
						qCorrectAns : $scope.correctAnswer,
						qTimeStart : $scope.timeStart,
						qTimeStop : timeStop,
						qTimetoAns : timetoAns,
						qTimeofDay: timeStop});
					profile.set({ profName: profile_name, profEmail: profile_email, qsNumber: qs_completed, qsStreak : qs_streak, longestStreak: longest_streak, qsCorrect : qs_correct, qsfastestTime: qs_fastest });
					checkAnswer();
				}
				
				
				//this is for the count down of days
	/*			timeOut = profile.get('startOfExp');
				if(! timeOut)
				{
					timeOut= new Date().getTime();
				}
				else{};
					//console.log(timeOut);
				$scope.now= new Date().getTime();				
					//console.log($scope.now);
									
				var diffDays = ($scope.now - timeOut);*/

				//if correct go to home, if not go to start
		function checkAnswer ()
				{
					console.log($scope.correctAnswer);

					console.log($scope.userAnswer);
					if($scope.correctAnswer == $scope.userAnswer)
					{
						console.log('neojv');
							/*if(diffDays >= 864000000)
							{
								profile.set({ complete: 'complete'});
								profile.save();
								$state.go('test');
							}
							else
							{	*/
								profile.save();
								$state.go('success');
						/*	}*/
					}
					else
					{
						
					/*	console.log('nfkenvosjeojv');
						if(diffDays >= 864000000)
						{
							profile.set({ complete: 'complete'});
							profile.save();
							$state.go('test');
						}
						else
						{*/	
							profile.save();
							$state.go('failure');
						/*}*/
					}
				}
			};
		
			});

