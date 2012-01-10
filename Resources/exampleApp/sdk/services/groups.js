/*!
 * Appconomy Xita Platform
 * Copyright (c) 2011 by Appconomy, Inc. All Rights Reserved.
 */

Ext.namespace('com.appconomy.xita');

(function() {
	var xita = com.appconomy.xita;

	var unimplemented = function(callback) {
		if (callback.error !== undefined) {
			callback.error(404, "Not implemented");
		}
	}

	/**
	 * Xita services pertaining to group management. Provides methods for creating 
	 * and updating groups, managing membership, and sending and receiving messages 
	 * from groups.
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
	 *       collectionId:"2c9494ef3142bbb301314320ae030013",
	 *       collectionName:"API Group",
	 *       description:"This group is for discussions related to the use of the Appconomy API",
	 *       ownerId:"2c9494ef3142bbb3013142ddc5f40001",
	 *       memberCount:1,
	 *       childrenCount:0,
	 *       channels:[
	 *         {
	 *           channelId:"8a5cfa602e6f7329012e6f7335670027",
	 *           name:"facebook"
	 *         },
	 *         {
	 *           channelId:"8a5cfa602e6f7329012e6f7335680029",
	 *           name:"twitter"
	 *         }
	 *       ],
	 *       locations:[],
	 *       createdAt:1311091240450,
	 *       updatedAt:1311091240450,
	 *       lastMembershipActivityAt:1311091240450,
	 *       featured:false,
	 *       postable:true,
	 *       commentable:true,
	 *       attachable:true,
	 *       joinable:false,
	 *       locatable:false,
	 *       left:0,
	 *       right:2147483647,
	 *       groupPreferences:[
	 *         {
	 *           groupPreferenceId:"2c9494ef3142bbb301314320ae1f0014",
	 *           type:"pushNotificationEnabled",
	 *           value:"true",
	 *           groupId:"2c9494ef3142bbb301314320ae030013",
	 *           contactId:"2c9494ef3142bbb3013142ddc5f40001",
	 *           userId:"2c9494ef3142bbb3013142ddc5ea0000"
	 *         }
	 *       ],
	 *       unreadMessageCount:0
	 *     }
	 * 
	 * The properties of a group are:
	 * 
	 *  * `collectionId` : _String_  
	 *    Globally unique Identifier for this group
	 *  * `collectionName` : _String_ : **Required**  
	 *    Name of the group. Must be unique in scope to the ownerId
	 *  * `description` : _String_  
	 *    Group description; limited to 255 characters.
	 *  * `ownerId` : _String_  
	 *    GUID Foreign Key to the user that created this group
	 *  * `memberCount` : _Integer_  
	 *    Number of members in this group.
	 *  * `childrenCount` : _Integer_  
	 *    The number of direct children (subgroups) this group has
	 *  * `channels` : _Array_  
	 *    The channels enabled for this group for feed-related messages
	 *    * `channelId` : _String_  
	 *      Globally Unique Identifier for this particular group-channel
	 *    * `name` : _String_  
	 *      Name of this channel. The options are twitter, facebook, linkedIn and chatter.
	 *  * `locations` : _Array_  
	 *    An array of location objects (latitude, longitude) that specify where this group lives geographically.
	 *  * `createdAt` : _Long_  
	 *    Timestamp of when the group was created. Epoch Time in milliseconds
	 *  * `updatedAt` : _Long_  
	 *    Timestamp of the last update time. Epoch Time in milliseconds
	 *  * `lastMembershipActivityAt` : _String_  
	 *    Timestamp of the last time a member was added, updated, or deleted. Epoch Time in milliseconds
	 *  * `featured` : _Boolean_  
	 *    Whether this is a featured group or a private group. Featured groups have additional properties that afect membership and interaction, detailed below
	 *  * `postable` : _Boolean_ : **Featured Group Only**  
	 *    Whether or not non-members can post new messages to this featured group.
	 *  * `commentable` : _Boolean_ **Featured Group Only**  
	 *    Whether or not non-members can comment on messages to this featured group.
	 *  * `attachable` : _Boolean_ **Featured Group Only**  
	 *    Whether or not non-members can post images to this featured group.
	 *  * `joinable` : _Boolean_ **Featured Group Only**  
	 *    Whether or not non-members can join the group.
	 *  * `locatable` : _Boolean_  
	 *    Indicates that this group has a location aspect related to it.
	 *  * `left` : _Long_  
	 *    Order in a sub group hierarchy, from the left-most edge of the adjacency list
	 *  * `right` : _Long_  
	 *    Order in a sub group hierarchy, from the right-most edge of the adjacency list
	 *  * `groupPreferences` : _Array_  
	 *    The given preferences for a group. The supported preferences are groupSMSMute, pushNotificationEnabled, tabMode and preferredEmail. Some preferences are global to the group (GroupSMSMute, 
	 * 	  pushNotificationEnabled), whereas others are specific to a given user/contact (tabMode, preferredEmail) 
	 *  * `unreadMessageCount` : _Integer_  
	 *    Count of unread messages for the given user making the request
	 */	
	com.appconomy.xita.GroupService = function(connection) {
		var xitaConnection = connection;
		var json = xita.Json;
		
		/**
		 * Load the groups for the logged in user.
		 * @param {Object} callback optional callback methods for success, error, 
		 * and failure.
		 */
		this.loadGroups = function(callback) {
			
			var url = 'v1.3/groups';
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					var jsObj = json.parse(result.text);
					s(jsObj);
				}
			}
			connection.httpGet(url, callback);
		};
		
		/**
		 * Load a given group. The retrieval of this group is dependent on the logged-in users' rights to view said group
		 * @param {Object} callback optional callback methods for success, error, 
		 * and failure.
		 */
		this.loadGroup = function(groupId, callback) {
			var url = 'v1.3/groups/' + groupId;
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					var jsObj = json.parse(result.text);
					s(jsObj);
				}
			}
			connection.httpGet(url, callback);
		};
		
		/**
		 * Create a new group owned by the logged in user.
		 * @param {Object} group the group definition.
		 * @param {Object} callback optional callback methods for success, error 
		 * and failure.
		 */
		this.createGroup = function(group, callback) {
			xita.Log.debug('Creating group: ' + group.name);
			var url = 'v1.2/groups';
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					var jsObj = json.parse(result.text);
					s(jsObj);
				}
			}
			connection.httpPost(url, json.stringify(group), callback);
		};
		
		/**
		 * Update the properties of a group, including its membership.
		 * @param {Object} group the updated group definition.
		 * @param {Object} callback optional callback methods for success, error 
		 * and failure.
		 */
		this.updateGroup = function(group, callback) {
			xita.Log.debug('Updating group: ' + group.name);
			var url = 'v1.2/groups' + group.id + '/members'; 
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					var jsObj = json.parse(result.text);
					s(jsObj);
				}
			}
			connection.httpPut(url, json.stringify(group), callback);
		}
		
		/**
		 * Delete a group. 
		 * <p>
		 * <em>Important:</em> Data from other Xita services that utilize groups (for example
		 * group messaging) corresponding to deleted groups will become inaccessible.
		 * @param {String} groupId the id of the group to delete.
		 * @param {Object} callback optional callback methods for success, error
		 * and failure.
		 */
		this.deleteGroup = function(groupId, callback) {
			xita.Log.debug('Deleting group: ' + groupId);
			var url = 'v1.2/groups' + groupId;
			if (callback.success !== undefined) {
				var s = callback.success;
				callback.success = function(code, result) {
					s();
				}
			}
			connection.httpDelete(url, callback);
		};
		
		/**
		 * Add members to a group.
		 * @param {String} groupId the id of the group to add members to.
		 * @param {Array} members array of users or userIds to add to the group.
		 * @param {Object} callback optional callback methods for success, error,
		 * and failure.
		 */
		this.addMembers = function(groupId, members, callback) {
			unimplemented(callback);
		};
		
		/**
		 * Delete members from a group.
		 * @param {String} groupId the id of the group to remove members from.
		 * @param {Array} members array of users or userIds to remove from the group.
		 * @param {Object} callback optional callback methods for success, error,
		 * and failure.
		 */
		this.deleteMembers = function(groupId, members, callback) {
			unimplemented(callback);
		};
		
		/**
		 * Set the members of a group.
		 * @param {String} groupId the id of the group to set the members of.
		 * @param {Array} members the members of the group
		 * @param {Object} callback optional callback methods for sucesss, error, 
		 * and failure.
		 */
		this.setMembers = function(groupId, members, callback) {
			unimplemented(callback);
		}
		
		/**
         * Get groups near a location.
         * @param {Number} latitude latitude coordinate.
         * @param {Number} longitude longitude coordinate.
         * @param {Number} distance threshold in meters.
         * @param {Object} callback optional callback methods for success, error
         * and failure.
         */
        this.getGroupsNearLocation = function(latitude, longitude, distance, callback) {

        };
	}
	
	
})();
