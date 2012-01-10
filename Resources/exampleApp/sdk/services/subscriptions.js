/*!
 * Appconomy Xita Platform
 * Copyright (c) 2011 by Appconomy, Inc. All Rights Reserved.
 */

Ext.namespace('com.appconomy.xita');

(function() {
    var xita = com.appconomy.xita;

    /**
     * Xita services pertaining to purchasing and downloading additional application content.  
     *
     * This service enables adding additional content to existing applications.  
     * Developers will use this service in conjunction with services that process payments and possibly host the content.
     *
     * Additional content types:  
     *
     *  * Subscription  
     *    Time-based content enabling user to download content. Examples inlcude muchly digital publications or podcasts.  
     *  * One-time content purchase  
     *    A one-time purchase of additional content for an application.  Examples include books or additional levels for games.  
     *  * Unlocking content or features already in application  
     *    A one-time purchase that enables existing application features. Examples include enabling special characters or special abilities in games.  
     * 
     * The properties of a Payment are:
     * 
     *  * `applicationId` : _String_  **Required**  
     *     Globally unique Identifier for the application
     *  * `contentId` : _String_  **Required**  
     *     Globally unique Identifier for the content
     *  * `transactionId` : _String_  **Required**  
     *     Id for the purchase transaction
     *  * `purchaseDate` : _Long_  **Required**  
     *     A System-generated epoch time in milliseconds of the purchase
     *  * `userId` : _String_  
     *     Globally unique Identifier for the user.    
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
     */
    com.appconomy.xita.SubscriptionService = function(connection) {
        var xitaConnection = connection;
        
        /**
         * Load the enabled subscriptions for a specified application & user.
         * This content is available to the user now.
         * 
         * @param {String} appId the Id of the application
         * @param {String} userId the Id of the user
         * @param {Object} callback optional callback methods for success, error
         * and failure.
         */
        this.getEnabledContent = function(appId, userId, callback) {
 
        };
        
        /**
         * Load the available subscriptions for a specified application & user.
         * These subscriptions may need to be authorized through a purchase or other process.
         * 
         * @param {String} appId the Id of the application
         * @param {String} userId the Id of the user
         * @param {Object} callback optional callback methods for success, error
         * and failure.
         */
        this.getAvailableContent = function(appId, userId, callback) {
 
        };
        
        /**
         * Buy new content
         * 
         * @param {Object} payment object. 
         * @param {Object} callback optional callback methods for success, error
         * and failure.
         */
        this.buyContent = function(payment, callback) {
 
        };      
        
        /**
         * Download content.  Will confirm content is enabled for user.
         * 
         * @param {String} subscriptionId Id of new content
         * @param {String} userId the Id of the user 
         * @param {Object} callback optional callback methods for success, error
         * and failure.
         */
        this.downloadContent = function(subscriptionId, user, callback) {
 
        };      
        
        
    }
})();