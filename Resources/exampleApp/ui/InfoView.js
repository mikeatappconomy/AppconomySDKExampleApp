/**
 * Appconomy Example SDK App
 *
 **/

(function() {
	aea.ui.createInfoView = function(_args) {
		var win = Ti.UI.createWindow(aea.combine($$.Window, {
			navBarHidden:true			
		}));

		var topPos = 0;
		var props = [aea.app.currentUser.userName, aea.app.currentUser.userEmail];
		for (var i=0; i< props.length; i++) {			
			var lbl = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {
				text:props[i],
				top:topPos,
				left:10
			}));
			topPos += 20;
			win.add(lbl);
		}

		return win;
	};
})();