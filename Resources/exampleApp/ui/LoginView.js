/**
 * Appconomy Example SDK App
 *
 **/

(function() {
	aea.ui.createLoginView = function(_args) {
		var win = Ti.UI.createWindow(aea.combine($$.Window, {
			navBarHidden:true			
		})),
		container = Ti.UI.createScrollView({
			top:$$.headerView.height,
			layout:'vertical',
			contentWidth:'auto',
			contentHeight:'auto',
			showVerticalScrollIndicator:true,
			scrollType: 'vertical'		
		}),

		unLabel = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {
			text:L('username'),
			left:10
		})),
		unField = Ti.UI.createTextField(aea.combine($$.TextField, {
			top:10,
			left:10,
			right:10,
			value:'sandboxuser@appconomy.com'
		})),
		pwLabel = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {
			text:L('password'),
			top:10,
			left:10
		})),
		pwField = Ti.UI.createTextField(aea.combine($$.TextField, {
			top:10,
			left:10,
			right:10,
			passwordMask:true,
			value:'sandbox'
		})),
		loginButton = aea.ui.createButton({localizedText:'login', top:20}),		
		signupButton = aea.ui.createButton({localizedText:'signup', top:30});

		container.add(unLabel);
		container.add(unField);
		container.add(pwLabel);
		container.add(pwField);
		container.add(loginButton);		
		container.add(signupButton);
		win.add(container);

		signupButton.addEventListener('click', function() {
			aea.app.signupWindow = aea.ui.createSignupWindow();
			aea.app.signupWindow.open();
		});
		
		loginButton.addEventListener('click', function() {
			var connection = new com.appconomy.xita.XitaConnection(aea.developerKey);			
			connection.login(unField.value, pwField.value, {
				success: function(usr) { 
					try {
						Ti.API.info('successful auth! ' + JSON.stringify(usr));
						//store off the connection for later use
						aea.app.connection = connection;
						aea.app.currentUser = usr;
						Ti.App.Properties.setString('currentUserId', String(usr.id));
						aea.ui.createInfoView().open();
						
					} catch (e) {
						Ti.API.info(JSON.stringify(e));						
					}
				 },
				error: function() { Ti.API.error("ERROR authorizing");},
				failure: function() {Ti.API.error("failed to connect");}
			});
		});
		
		return win;
	};
})();