/**
* Appconomy Example SDK App
* Copyright (c) 2009-2011 by Appconomy, Inc. All Rights Reserved.
**/
Ti.include('../sdk/adapter/titanium.js');
(function() {
	var platformWidth = Ti.Platform.displayCaps.platformWidth;
	
	//create the main application window
	aea.ui.createApplicationWindow = function(_args) {
		var win = Ti.UI.createWindow(aea.combine($$.Window,{
			exitOnClose:true,
			orientationModes:[Ti.UI.PORTRAIT]
		})),
		headerView = Ti.UI.createView(aea.combine($$.headerView,{top:0}));
		
		//assemble main app window
		win.add(headerView);

		return win;
	};		
})();