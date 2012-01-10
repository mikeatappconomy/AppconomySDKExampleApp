/*!
 * Appconomy Xita Platform
 * Copyright (c) 2011 by Appconomy, Inc. All Rights Reserved.
 */

Ext.namespace('com.appconomy.xita');

(function() {
	var xita = com.appconomy.xita;
	
	/**
	 * Xita services pertaining to receipt management. Provides methods for creating
	 *  and accessing and updating receipt information. 
	 * 
	 * No data is cached, so all methods in this class rely on asynchronous 
	 * communication to the server. Therefore none of the methods have a return 
	 * value and instead take an object containing (optional) callback functions: 
	 * success, error, and failure. The callback functions are invoked on successful
	 * response from the server, error response from the server, and failure to 
	 * connect to the server respectively.
	 * 
	 */
	com.appconomy.xita.ReceiptService = function(connection) {
		var xitaConnection = connection;
		
		/**
		 * Load a receipt by id. 
		 * @param {String} receiptId the uuid representing the receiopt.
		 * @param {Object} callback optional callback functions for success, error
		 * and failure.
		 */
		this.loadReceiptById = function(receiptId, callback) {
			var url = 'v1/receipts/' + receiptId;
			xitaConnection.httpGet(url, callback);
		};
		
		/**
		 * Load all receipts by userId. 
		 * @param {String} userid the uuid representing the user.
		 * @param {Object} callback optional callback functions for success, error
		 * and failure.
		 */
		this.loadReceiptsByUserId = function(userId, callback) {
			var url = 'v1/users/' + userId + '/receipts';
			xitaConnection.httpGet(url, callback);
		};
		
		this.loadSkuManifest = function(skuId, callback) {
			var url = 'v1/skus/' + skuId + '/manifest';
			xitaConnection.httpGet(url, callback);
		}
		
		this.loadProduct = function(productId, callback) {
			var url = 'v1/product/' + productId;
			xitaConnection.httpGet(url, callback);
		}
	}
})();
