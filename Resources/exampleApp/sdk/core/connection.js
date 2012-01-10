/*!
 * Appconomy Xita Platform
 * Copyright (c) 2011 Appconomy, Inc.
 */

Ext.namespace('com.appconomy.xita');
(function() {
	var xita = com.appconomy.xita;
	var BASE_URL = aea.sandboxServer+'/matrix/rest/';
	
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
	com.appconomy.xita.XitaConnection = function(key) {
		var companyKey = key;
		var username = null;
		var password = null;
		var userid = null;
		var that = this;
		var cloud = null;
		
		this.normalizeLocalHostUri = function(uri){
			if(uri === 'http://localhost:8080'){
				return aea.sandboxServer;
			}
			return uri;
		},
		
		/*
		 * Execute an HTTP request after resolving the relative URL. 
		 * @param {String} relativeUrl the relative URL to request.
		 * @param {Function} httpMethod the HTTP method to invoke.
		 * @param {Array} config the http configuration
		 * @param {Object/String} data (optional) the POST/PUT data. 
		 */
		this.executeRequestWithCloudUrl = function(relativeUrl, httpMethod, config, data) {
		    if (cloud === null) {
		        var cloudUrl = BASE_URL + 'v1/cloud?xid=' + companyKey;
		        Ti.API.error('!!!!cloud request with ' + cloudUrl);
		        com.appconomy.xita.Http.httpGet(cloudUrl, {
		            success: function(code, response) {
		                var parsedCloud = xita.Json.parse(response.text);
		                cloud = parsedCloud.uri;
		                cloud = that.normalizeLocalHostUri(cloud);
		                that.executeRequestWithCloudUrl(relativeUrl, httpMethod, config, data);
		            },
		            error: config.error,
		            failure: config.failure
		        });
		    } else {
                var arguments = [config];
                if (data !== undefined) {
                    arguments.unshift(data);
                }
                arguments.unshift(this.getUrl(relativeUrl));
		        httpMethod.apply(this, arguments);
		    }
		},
		
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
			                   	error: function(code) {
			                   		callback.error(code);
			                   	},
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
		
		this.getUrl = function(relativeUrl) {
		    var result = cloud + "/matrix/rest/" + relativeUrl;
		    if (result.indexOf("?") == -1) {
		        result = result + "?";
		    } else { 
		        result = result + "&";
		    }
		    result = result + "xid=" + companyKey; 
		    return result;
		},
		
		this.httpGet = function(relativeUrl, callback) {
			var config = this.getConfig(callback);
            this.executeRequestWithCloudUrl(relativeUrl, xita.Http.httpGet, config);
		},
		
		this.httpGetFullyQualified = function(fullyQualifiedUrl, callback) {
			Ti.API.info('httpGet: ' + fullyQualifiedUrl);
			var config = this.getConfig(callback);
			//remove username and password so that the http call doesn't have the basic auth properties, which can confuse some non-appconomy services
			delete config.username;
			delete config.password;			
			xita.Http.httpGet(fullyQualifiedUrl, config);
		},
		
		this.httpPost = function(relativeUrl, data, callback) {
			var config = this.getConfig(callback);
            this.executeRequestWithCloudUrl(relativeUrl, xita.Http.httpPost, config, data);
		}, 
		
		this.httpPut = function(relativeUrl, data, callback) {
			var config = this.getConfig(callback);
            this.executeRequestWithCloudUrl(relativeUrl, xita.Http.httpPut, config, data);
		},
		
		this.httpDelete = function(relativeUrl, callback) {
			var config = this.getConfig(callback);
            this.executeRequestWithCloudUrl(relativeUrl, xita.Http.httpDelete, config);
		},
		
		this.httpHead = function(relativeUrl, callback) {
			var config = this.getConfig(callback);
			this.executeRequestWithCloudUrl(relativeUrl, xita.Http.httpHead, config);
		}
	
	};
})();