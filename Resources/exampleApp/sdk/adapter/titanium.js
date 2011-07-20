/*!
 * Adapters for core HTTP and JSON services for Appcelerator Titanium users.
 *
 * Copyright (c) 2011 Appconomy, Inc.
 */

Ext.namespace('com.appconomy.xita');

/**
 * An HTTP wrapper class that provides convenient access to the five common HTTP verbs
 * used in REST APIs: GET, PUT, POST, DELETE, and HEAD. The HTTP requests are performed
 * asynchronously, so callback functions must be specified if you want to handle the
 * responses.
 * <p>
 * Each method includes an optional <code>config</code> parameter which encapsulates
 * configuration of the request as follows:
 *
 * <ul>
 * <li><b>success</b> : Function (Optional) : A callback function invoked on successful
 * completion of the request (HTTP Status Codes < 300). The callback will be invoked with
 * two arguments: the HTTP status code and an object representing the result. The result
 * will have two properties <code>text</code> and <code>data</code> which are the returned
 * data represented as text (String) and binary (Blob)</li>
 * <li><b>error</b> : Function (Optional) : A callback function invoked on HTTP errors
 * (HTTP Status Codes >= 300). The callback will be invoked with two arguments: the HTTP
 * status code and an object representing the result. The result will have two properties
 * <code>text</code> and <code>data</code> which are the returned data represented as text
 * (String) and binary (Blob).</li>
 * <li><b>failure</b> : Function (Optional) : A callback function invoked on error
 * response from the server or a timeout accessing the server.</li>
 * <li><b>timeout</b> : Number (Optional) : The timeout in milliseconds to use before a
 * request is considered failed. Default is 30000.
 * <li><b>username</b> : String (Optional) : The username to use for BASIC authentication
 * of the HTTP request. Required if password is set.
 * <li><b>password</b> : String (Optional) : The password to use for BASIC authentication
 * of the HTTP request.
 * </ul>
 * @singleton
 */
com.appconomy.xita.Http = function() {

	var createHttpRequest = function(method, url, config) {
		var xhr = Titanium.Network.createHTTPClient();
		if (config.hasOwnProperty('success') || config.hasOwnProperty('error')) {
			xhr.onload = function() {
				var code = xhr.status;
				if (code < 300) {
					if (config.hasOwnProperty('success')) {
						config.success(code, {
							data: xhr.responseData,
							text: xhr.responseText
						});
					}
				} else {
					if (config.hasOwnProperty('error')) {
						config.error(code, xhr.responseData);
					}
				}
			};
		}
		if (config.hasOwnProperty('failure')) {
			xhr.onerror = config.failure;
		}
		if (config.hasOwnProperty('timeout')) {
			xhr.timeout = config.timeout;
		}
		if (typeof url == 'function') {
			url = url();
		}

		xhr.open(method, url);
		// Basic Auth
		if (config.hasOwnProperty('username')) {
			var creds = config.username + ':' + (config.hasOwnProperty('password') ? config.password : '');
			var authstr = 'Basic ' + Ti.Utils.base64encode(creds);
			xhr.setRequestHeader('Authorization', authstr);
		}

		return xhr;
	}
	return {
		/**
		 * Invoke an HTTP GET request on the specified URL.
		 * @param {String/Function} url the URL of the request or a function that returns
		 * the URL of the request.
		 * @param {Object} config optional configuration for the request as specified above.
		 */
		httpGet : function(url, config) {
			var xhr = createHttpRequest('GET', url, config);
			xhr.send();
		},
		/**
		 * Invoke an HTTP PUT request on the specified URL.
		 * @param {String/Function} url the URL of the request or a function that returns
		 * the URL of the request.
		 * @param {Object} data the data to be put in the request. This can be null, a string,
		 * a dictionary, or a File object.
		 * @param {Object} config optional configuration for the request as specified above.
		 */
		httpPut : function(url, data, config) {
			var xhr = createHttpRequest('PUT', url, config);
			xhr.send(data);
		},
		/**
		 * Invoke an HTTP POST request on the specified URL.
		 * @param {String/Function} url the URL of the request or a function that returns
		 * the URL of the request.
		 * @param {Object} data the data to be put in the request. This can be null, a string,
		 * a dictionary, or a File object.
		 * @param {Object} config optional configuration for the request as specified above.
		 */
		httpPost : function(url, data, config) {
			var xhr = createHttpRequest('POST', url, config);
			xhr.send(data);
		},
		/**
		 * Invoke an HTTP DELETE request on the specified URL.
		 * @param {String/Function} url the URL of the request or a function that returns
		 * the URL of the request.
		 * @param {Object} config optional configuration for the request as specified above.
		 */
		httpDelete : function(url, config) {
			var xhr = createHttpRequest('DELETE', url, config);
			xhr.send();
		},
		/**
		 * Invoke an HTTP HEAD request on the specified URL.
		 * @param {String/Function} url the URL of the request or a function that returns
		 * the URL of the request.
		 * @param {Object} config optional configuration for the request as specified above.
		 */
		httpHead : function(url, config) {
			var xhr = createHttpRequest('HEAD', url, config);
			xhr.send();
		}
	};
}();
/**
 * JSON parsing and generation routines.
 * @singleton
 */
com.appconomy.xita.Json = function() {

	return {
		/**
		 * Parse a JSON string into a JavaScript object.
		 * @param {String/Function} json the String to convert or a function that returns a String
		 * to convert.
		 * @return {Object} the JavaScript object for the provided string (or function).
		 */
		parse : function(json) {
			if (Ext.isFunction(json)) {
				json = json();
			}
			return JSON.parse(json);
		},
		/**
		 * Convert the value into a JSON string.
		 * @param {Object} value the value to convert.
		 * @return {String} the JSON string representing the object.
		 */
		stringify : function(value) {
			return JSON.stringify(value);
		}
	};

}();

/**
 * @class com.appconomy.xita.Log
 * @singleton 
 * Logging facilities.
 */
com.appconomy.xita.Log = function() {
	
	return {

		/**
		 * function for logging debug messages
		 * @param {String} message the message to log
		 */
		debug : function() {
			Ti.API.debug(arguments);
		},
		/**
		 * function for logging informational messages
		 * @param {String} message the message to log
		 */
		info : function() {
			Ti.API.info(arguments);
		},
		/**
		 * function for logging warning messages
		 * @param {String} message the message to log
		 */
		warn: function() {
			Ti.API.warn(arguments);
		},
		/**
		 * function for logging error messages
		 * @param {String} message the message to log
		 */
		error: function() {
			Ti.API.error(arguments);
		}
	}
}();
