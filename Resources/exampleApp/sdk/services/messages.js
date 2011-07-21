/*!
 * Appconomy Xita Platform
 * Copyright (c) 2011 by Appconomy, Inc. All Rights Reserved.
 */

Ext.namespace('com.appconomy.xita');

(function() {
	var xita = com.appconomy.xita;

	/**
	 * Xita services pertaining to group messaging. Provides methods for communicating 
	 * with groups.
	 * 
	 * No data is cached, so all methods in this class rely on asynchronous 
	 * communication to the server. Therefore, none of the methods hava  return 
	 * value and instead take an object containing (optional) callback functions:
	 * success, error, and failure. The callback functions are invoked on successful
	 * response from the server, error response from the server, and failure to 
	 * connect to the server respectively.
	 * 
	 * The error callback is invoked with two arguments: the http response code
	 * and the response data. The failure callback is invoked with no arguments.
	 * The success callback is invoked with the arguments specified in each method.
	 * 
	 * Message objects returned by the server will look like the following:
	 * 
	 *     {
	 *       messageId:"2c9494ef3142bbb301314324d0e70019",
	 *       message:"Hello everyone, let's talk about the Appconomy API",
	 *       sender:"2c9494ef3142bbb3013142ddc5f40001",
	 *       senderName:"API User",
	 *       userId:"2c9494ef3142bbb3013142ddc5ea0000",
	 *       groups:[
	 *         "2c9494ef3142bbb301314320ae030013"
	 *       ],
	 *       group:"2c9494ef3142bbb301314320ae030013",
	 *       messageTime:1311091511521,
	 *       updateTime:1311095972141,
	 *       isNew:true,
	 *       location:false,
	 *       lat:0,
	 *       lon:0,
	 *       attachmentUrl:"http://someurlto.animage.com/image.png",
	 *       comments:[
	 *         {
	 *           commentId:"2c9494ef3142bbb301314368b0b9001a",
	 *           commentText:"This is a comment.",
	 *           commentTime:1311095956111,
	 *           commentMaker:"2c9494ef3142bbb3013142ddc5f40001",
	 *           commentMakerName:"API User",
	 *           subjectMessage:"2c9494ef3142bbb301314324d0e70019"
	 *         },
	 *         {
	 *           commentId:"2c9494ef3142bbb301314368ef82001b",
	 *           commentText:"and this is another comment",
	 *           commentTime:1311095972141,
	 *           commentMaker:"2c9494ef3142bbb3013142ddc5f40001",
	 *           commentMakerName:"API User",
	 *           subjectMessage:"2c9494ef3142bbb301314324d0e70019"
	 *         }
	 *       ]
	 *     }
	 * 
	 * 
	 * The properties of a group are:
	 * 
	 *  * `messageId` : _String_  
	 *    Globally Unique Identifier for this message
	 *  * `message` : _String_  
	 *    Text of the message, limited to 512 characters
	 *  * `sender` : _String_  
	 *    GUID for contactId foreignKey
	 *  * `senderName` : _String_  
	 *    Convenience method for contact name
	 *  * `userId` : _String_  
	 *    GUID for userId foreignKey
	 *  * `groups` : _Array_  
	 *    Array of groupIds this message is associated with
	 *  * `group` : _String_ : **Deprecated**  
	 *    groupId for message this is related to. Use groups, this value will be deprecated
	 *  * `messageTime` : _Long_  
	 *    Creation Time. Epoch time in milliseconds
	 *  * `updateTime` : _Long_  
	 *    Update Time. Epoch time in milliseconds
	 *  * `isNew` : _Boolean_ : **Deprecated**  
	 *    No longer in use
	 *  * `location` : _Boolean_  
	 *    Whether this message has a geolocation associated with it
	 *  * `lat` : _Float_  
	 *    Latitude of geolocation associated with this message. Only valid if 'location' property is true
	 *  * `lon` : _Float_  
	 *    Longitude of geolocation associated with this message. Only valid if 'location' property is true
	 *  * `attachmentUrl` : _String_  
	 *    URL to image attached to the message
	 *  * `comments` : _Array_  
	 *    Globally unique Identifier for this group
	 *    * `commentId` : _String_  
	 *      Globally Unique Identifier for this comment
	 *    * `commentText` : _String_  
	 *      Text of the comment
	 *    * `commentTime` : _Long_  
	 *      Timestamp for when the comment was created. Epoch time in milliseconds
	 *    * `commentMaker` : _String_  
	 *      GUID of the user that made the comment
	 *    * `commentMakerName' : _String_  
	 *      Convenience method for the name of the user that made the comment
	 *    * `subjectMessage` : _String_  
	 *      GUID of the parent message the comment is associated with
	 */
	com.appconomy.xita.MessageService = function(connection) {
		var xitaConnection = connection;
		
		/**
		 * Load the messages for the specified group.
		 * @param {String} groupId the id of the group.
		 * @param {Object} callback optional callback methods for success, error
		 * and failure.
		 */
		this.getMessages = function(groupId, callback) {
			xita.Log.debug('Loading group messages: ');// + groupId);
			var url = 'v1.2/messages/group/' + groupId;
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					Ti.API.debug('success - Loading group messages: ');
					var jsObj = xita.Json.parse(result.text).messages;
					s(jsObj);
				}
			}
			connection.httpGet(url, callback);
		};
		
		/**
		 * Send a message to a group.
		 * @param {String} groupId the id of the group.
		 * @param {Object} message the message.
		 * @param {Object} callback optional callback methods for success, error
		 * and failure.
		 */
		this.sendMessage = function(groupId, message, callback) {
			xita.Log.debug('Sending message to: ' + groupId);
			var url = 'v1.3/messages/groups?groupIds='  + groupId;
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					var jsObj = xita.Json.parse(result.text);
					s(jsObj);
				}
			}
			connection.httpPost(url, xita.Json.stringify(message), callback);
		};
		
		/**
		 * Comment on an existing message.
		 * @param {String} messageId the id of the message.
		 * @param {String/Object} comment the comment text string or a comment object.
		 * @param {Object} callback optional callback methods for success, error
		 * and failure.
		 */
		this.sendComment = function(messageId, comment, callback) {
			xita.Log.debug('Sending comment to: ' + messageId);
			var url = 'v1.2/messages/'  + messageId + '/comment';
			
			// determine if the provided comment is an object or the comment text
			var commentObject;
			if(Ext.isString(comment)){
				commentObject = {commentText:comment};
			}
			else{
				commentObject = comment;
			}
			
			// set all required properties in they are undefined
			if(commentObject.commentMaker === undefined) {
				commentObject.commentMaker = aea.app.currentUser.contactId;
			}
			if(commentObject.subjectMessage === undefined){
				commentObject.subjectMessage = messageId;
			}
			if(commentObject.commentTime === undefined){
				var d = new Date();
				commentObject.commentTime = d.getTime();
			}
			
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					var jsObj = xita.Json.parse(result.text);
					s(jsObj);
				}
			}
			connection.httpPut(url, xita.Json.stringify(commentObject), callback);
		};
		
		/**
		 * Load a message and its comments. 
		 * @param {String} messageId the id of the message.
		 * @param {String} originatingGroupId the id of the group containing the message.
		 * @param {Object} callback optional callback methods for success, error
		 * and failure.
		 */
		this.getMessageAndComments = function(messageId,originatingGroupId,callback) {
			xita.Log.debug('Loading group message: ' + messageId);
			var url = 'v1.3/messages/' + messageId +"?originatingGroupId="+originatingGroupId;
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					var jsObj = xita.Json.parse(result.text);
					s(jsObj);
				}
			}
			connection.httpGet(url, callback);
		};
		
		/**
         * Load the messages near a location.
         * @param {Number} latitude latitude coordinate.
         * @param {Number} longitude longitude coordinate.
         * @param {Number} distance threshold in meters.
         * @param {Object} callback optional callback methods for success, error
         * and failure.
         */
        this.getMessagesNearLocation = function(latitude, longitude, distance, callback) {

        };
	}
})();