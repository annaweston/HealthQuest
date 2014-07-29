/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, Backbone*/

angular.module('hq')
	.factory('storage', function(utils) {
		return {
			getProfile:function() {
				var d = utils.deferred();
				this.getStore().then(function(s) { 
					var p = s.get('profile');
					if (!p) { 
						p = new Backbone.Model({id:'profile'});
						s.add(p);
						p.save();
					}
					d.resolve(p);
				}).fail(d.reject);
				return d.promise();
			},
			getStore: function() {
				// store for everything but diary
				var d = utils.deferred(),
					C = Backbone.Collection.extend({ localStorage:new Backbone.LocalStorage('main') }),
					c = new C();
				c.fetch().then(function() { d.resolve(c); }).fail(d.reject);
				return d.promise();
			}
		};
	});
	