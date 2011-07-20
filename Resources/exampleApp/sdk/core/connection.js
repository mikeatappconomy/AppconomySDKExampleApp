/*!
 * Appconomy Xita Platform
 * Copyright (c) 2011 Appconomy, Inc.
 */

Ext.namespace('com.appconomy.xita');
(function() {
	var xita = com.appconomy.xita;
	var BASE_URL = aea.sandboxServer+'groups/rest/';
	
	/**
	 * @class com.appconomy.xita.XitaConnection
	 * <p>A connection to the Xita services. All of the Xita services are initialized
	 * with a XitaConnection instance which provides the connection to the Xita servers.
	 * </p>
	 * 
	 * @constructor
	 * A XitaConnection is created using a company key which identifies the domain of
	 * the 
	 */
	com.appconomy.xita.XitaConnection = function(companyKey) {
		var companyKey = companyKey;
		var username = null;
		var password = null;
		var userid = null;
		var that = this;
		
		/**
		 * Login a user using the provided credentials.
		 * @param {String} username the user's login.
		 * @param {String} password the user's password.
		 * @param {Function} callback optional callback functions for success, error, and
		 * failure. The success callback will be invoked with a single argument, the user
		 * object for the logged in user.
		 */
		this.login = function(username, password, callback) {
			var user = { 'userEmail' : username, 'password': password };
			var url = BASE_URL + 'v1/session';
			com.appconomy.xita.Http.httpPost(url, 
			                   xita.Json.stringify({user: user}),
			                   {
			                   	username: username,
			                   	password: password,
			                   	success: function(code, response) {
			                   		that.username = username;
			                   		that.password = password;
			                   		var usr = xita.Json.parse(response.text);
			                   		that.userid = usr.userId;
			                   		if (callback.hasOwnProperty('success')) {
			                   			callback.success(usr);
			                   		}
			                   	},
			                   	error: callback.error,
			                   	failure: callback.failure
			                   });
		}, 
		
		/**
		 * Clear the stored credentials from this connection. Subsequent uses of this
		 * connection for methods that require credentials will fail until login() is
		 * called.
		 */
		this.logout = function() {
			that.username = null;
			that.password = null;
			that.userid = null;
		},
		
		this.getConfig = function(callback) {
			var config = {};
			if (that.username) {
				config.username = that.username;
			}
			if (that.password) {
				config.password = that.password;
			}
			config.success = function(code, result) {
				if (callback.success) {
					callback.success(code, result);
				}
			}
			config.error = function(code, result) {
				if (callback.error) {
					callback.error(code, result);
				}
			}
			config.failure = function() {
				if (callback.failure) {
					callback.failure();
				}
			}
			return config;
		},
		
		this.httpGet = function(relativeUrl, callback) {
			Ti.API.info('httpGet: ' + relativeUrl);
			var config = this.getConfig(callback);
			var url = BASE_URL + relativeUrl;
			Ti.API.info('httpGet: ' + url);
			xita.Http.httpGet(url, config);
		},
		
		this.httpPost = function(relativeUrl, data, callback) {
			var config = this.getConfig(callback);
			var url = BASE_URL + relativeUrl;
			Ti.API.error('URL: ' + url);
			xita.Http.httpPost(url, data, config);
		}, 
		
		this.httpPut = function(relativeUrl, data, callback) {
			var config = this.getConfig(callback);
			xita.Http.httpPut(BASE_URL + relativeUrl, data, config);
		},
		
		this.httpDelete = function(relativeUrl, callback) {
			var config = this.getConfig(callback);
			xita.Http.httpPut(BASE_URL + relativeUrl, config);
		},
		
		this.httpHead = function(relativeUrl, callback) {
			var config = this.getConfig(callback);
			xita.Http.httpPut(BASE_URL + relativeUrl, config);
		}
	
	};
})();
