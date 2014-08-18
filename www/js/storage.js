/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, Backbone, $ */

angular.module('hq')

	.factory('storage', function(utils) {
		
		
		var PersistentModel = Backbone.Model.extend({
			// shizzles that you are going to override here

			save:function()  {
				console.info('btw dear person we got a save ');

				var return_deferred = new $.Deferred(),
					this_ = this;

				var save_deferred = Backbone.Model.prototype.save.apply(this,arguments);

				save_deferred.then(function() { 
					console.info('im done saving locally, now to the server!');

					// comment me out later when the ajax stuff is implemented
					return_deferred.resolve();
					
					$.parse.init({
						app_id : "NM5AvT58phnsTjnKwOmdRgKgK3ndfociFAMncCBq", // mine
						rest_key : "lGu5IM5PduzO6PwlguFu2EBrTspxKFSDllwTUtno" // mine   
					});
										
					// server bit goes here > 
					
					var getname = this_.get('profName');
					var getemail = this_.get('profEmail');
					var classname = getname + getemail;

					if(this_.get('id') == 'profile')
					{
						$.parse.post('profile',{ data : this_.attributes }, function(response) { 
								console.info('we succeeded at the ajax call ', response);
								return_deferred.resolve(); // "i succeded"
							}, function(error) {
								console.error('we failed at the ajax :( ', error);
								return_deferred.reject(); // "i failed"
							})	
					}
					else if(this_.get('id') == 'test')
					{
						$.parse.post('test',{ data : this_.attributes }, function(response) { 
								console.info('we succeeded at the ajax call ', response);
								return_deferred.resolve(); // "i succeded"
							}, function(error) {
								console.error('we failed at the ajax :( ', error);
								return_deferred.reject(); // "i failed"
							})	
					}
					else if(this_.get('id') == 'control')
					{
						$.parse.post('control',{ data : this_.attributes }, function(response) { 
								console.info('we succeeded at the ajax call ', response);
								return_deferred.resolve(); // "i succeded"
							}, function(error) {
								console.error('we failed at the ajax :( ', error);
								return_deferred.reject(); // "i failed"
							})	
					}
					else
					{
						$.parse.post('question',{ data : this_.attributes }, function(response) { 
								console.info('we succeeded at the ajax call ', response);
								return_deferred.resolve(); // "i suceeded"
							}, function(error) {
								console.error('we failed at the ajax :( ', error);
								return_deferred.reject(); // "i failed"
							})				
					}
					
				}).fail(function(err) { 
					console.error('failed to save locally', err);
					return_deferred.reject();
				});

				return return_deferred.promise();
			}
		});

		return {
			getProfile:function() {
				var d = utils.deferred();
				this.getStore().then(function(s) { 
					var p = s.get('profile');
					if (!p) { 
						// if p doesn't exist yet, we create it the first time
						p = new PersistentModel({id:'profile'});
						s.add(p);
						p.save().then(function() { 
							console.info('Created profile successfully');
							d.resolve(p);
						}).fail(function(err) { 
							console.error('Error creating profile ', err);
							d.reject();
						});
					} else {
						d.resolve(p);
					}

				}).fail(d.reject);
				return d.promise();
			},
			getStore: function() {
				// store for everything but diary
				var d = utils.deferred(),
					C = Backbone.Collection.extend({ 
						model:PersistentModel,
						localStorage:new Backbone.LocalStorage('main') 
					}),
					c = new C();

				// comment me out, barbarians!
				window.Collection = C; 
				// 
				c.fetch().then(function() { d.resolve(c); }).fail(d.reject);
				return d.promise();
			},
			
			getQsAns: function() {
				// store for everything but diary
				var d = utils.deferred(),
					C = Backbone.Collection.extend({ 
						model: PersistentModel,
						localStorage:new Backbone.LocalStorage('question') 
					}),
					c = new C();

				// comment me out, barbarians!
				window.Collection = C; 
				
				// 
				c.fetch().then(function() { d.resolve(c); }).fail(d.reject);
				return d.promise();
			}
		};
	});
	