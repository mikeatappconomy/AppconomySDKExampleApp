/*!
 * Appconomy Xita Platform
 * Copyright (c) 2011 by Appconomy, Inc. All Rights Reserved.
 */

Ext.namespace('com.appconomy.xita');

(function() {
	var xita = com.appconomy.xita;
	
	/**
	 * Xita services pertaining to user management. Provides methods for creating
	 * and disabling users and accessing and updating user information. 
	 * 
	 * No data is cached, so all methods in this class rely on asynchronous 
	 * communication to the server. Therefore none of the methods have a return 
	 * value and instead take an object containing (optional) callback functions: 
	 * success, error, and failure. The callback functions are invoked on successful
	 * response from the server, error response from the server, and failure to 
	 * connect to the server respectively.
	 * 
	 * Users objects returned by the server will look like the following:
	 * 
	 *     {
	 *       userID:"2c9494ef3142bbb3013142ddc5ea0000",
	 *       userName:"API User",
	 *       firstName:"API",
	 *       lastName:"User",
	 *       userEmail:"apiuser@appconomy.com",
	 *       userPhone:"5125555555",
	 *       lastOnlineTime:1311086855250,
	 *       accountCreated:1311086855250,
	 *       verified:false,
	 *       countryCode:"1",
	 *       countryAbbreviation:"US \/ USA",
	 *       contactId:"2c9494ef3142bbb3013142ddc5f40001",
	 *       links:[
	 *         {
	 *           linkId:"2c9494ef3142bbb3013142ddc6520002",
	 *           type:"email",
	 *           ownerId:"2c9494ef3142bbb3013142ddc5f40001",
	 *           valid:false,
	 *           linkName:"email",
	 *           emailAddress:"apiuser@appconomy.com",
	 *           primary:true,
	 *           deleted:false
	 *         },
	 *         {
	 *           linkId:"2c9494ef3142bbb3013142ddc68a0003",
	 *           type:"phone",
	 *           ownerId:"2c9494ef3142bbb3013142ddc5f40001",
	 *           valid:false,
	 *           linkName:"mobile phone",
	 *           phoneNumber:"5125555555",
	 *           primary:true,
	 *           countryCode:"1",
	 *           countryAbbreviation:"US \/ USA"
	 *         }
	 *       ]
	 *     }
	 * 
	 * 
	 * The properties of a user are:
	 * 
	 *  * `userId` : _String_  
	 *     Globally unique Identifier for this user
	 *  * `userName` : _String_  
	 *     Convenience method of firstName + lastName
	 *  * `firstName` : _String_ : **Required**  
	 *     Users' first name
	 *  * `lastName` : _String_ : **Required**  
	 *     Users' last name
	 *  * `userEmail` : _String_ : **Required**  
	 *     Users' email address. Located on user object for convenience
	 *  * `userPhone` : _String_ : **Required**  
	 *     Users' phone number. Located on user object for convenience
	 *  * `lastOnlineTime` : _Long_  
	 *     A System-generated epoch time in milliseconds of the last time the user logged in.
	 *  * `accountCreated` : _Long_  
	 *     When the user was created. Epoch time in milliseconds
	 *  * `verified` : _Boolean_  
	 *     If the user has been verified (email + phone)
	 *  * `countryCode` : _String_ : **Required**  
	 *     Convenience method for storing the users' phone country code.
	 *  * `countryAbbreviation` : _String_  
	 *     Convenience method for storing the users' phone country code abbreviation
	 *  * `contactId` : _String_  
	 *     Globally unique identifier as a foreign key to the users' contact records.
	 *  * `links` : _Array_  
	 *     An array of contact records and types for the user. 
	 *    * `linkdId` : _String_  
	 *      Globally unique indentifier for this link record
	 *    * `type` : _String_  
	 *      Type of link. Values can be email, phone, twitter and facebook
	 *    * `ownerId` : _String_ 
	 *      GUID foreign key for User object
	 *    * `valid` : _Boolean_  
	 *      whether this particular link has been validated. Only used for email and phone
	 *    * `linkName` : _String_  
	 *      Name of the link
	 */
	com.appconomy.xita.UserService = function(connection) {
		var xitaConnection = connection;
		
		/**
		 * Load a user by id. 
		 * @param {String} userid the uuid representing the user.
		 * @param {Object} callback optional callback functions for success, error
		 * and failure.
		 */
		this.loadUserById = function(userid, callback) {
			var url = 'v1.2/users/' + userid;
			xitaConnection.httpGet(url, callback);
		};
		
		/**
		 * Load a user by login.
		 * @param {String} login the user's login.
		 * @param {Object} callback optional callback functions for success, error
		 * and failure. The success callback will be invoked with a single argument, 
		 * the loaded user object.
		 */
		this.loadUserByLogin = function(login, callback) {
			var url = 'v1.2/users/' + login;
			var s = callback.success;
			callback.success = function(code, response) {
				s(xita.Json.parse(response.text));
			}
			xitaConnection.httpGet(url, callback);
		};
		
		/**
		 * Create a new user account. 
		 * @param {Object} user the user object in JSON notataion.
		 * @param {Object} callback optional callback functions for success, error
		 * and failure. The success callback will be invoked with a single argument,
		 * the created user object.
		 */
		this.createUser = function(user, callback) {
			var url = 'v1.2/users/';
			var s = callback.success;
			callback.success = function(code, response) {
				s(xita.Json.parse(response.text));
			}
			xitaConnection.httpPost(url, xita.Json.stringify({user:user}), callback);
		};
		
		/**
		 * Delete a user.
		 * @param {String} userid the id of the user to delete.
		 * @param {Object} callback optional callback functions for success, error
		 * and failure. The success callback will be invoked with no arguments.
		 */
		this.deleteUser = function(userid, callback) {
			var url = 'v1.2/users/' + userid;
			var s = callback.success;
			callback.success = function(code, response) {
				s();
			}
			xitaConnection.httpDelete(url, callback);
		};
		
		/**
		 * Update a user.
		 * @param {Object} user the user to update.
		 * @param {Object} callback optional callback functions for success, error
		 * and failure. The success callback will be invoked with a single argument, 
		 * the updated user.
		 */
		this.updateUser = function(user, callback) {
			var url = 'v1.2/users/' + user.userID;
			var s = callback.success;
			callback.success = function(code, response) {				
				s(xita.Json.parse(response.text));
			}
			xitaConnection.httpPut(url, xita.Json.stringify({'user':user}), callback)
		};
		
	}
})();
