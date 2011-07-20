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
			right:10
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
			passwordMask:true
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
			Ti.App.fireEvent('app:show.loader');
			
			Ti.API.info('Logging in...');
			var connection = new com.appconomy.xita.XitaConnection('developerkey');
			Ti.API.info('Got a connection...');			
			connection.login(unField.value, pwField.value, {
				success: function(usr) {
					try {
						Ti.API.info('successful auth! ' + JSON.stringify(usr));
						//store off the connection for later use
						aea.app.connection = connection;
						aea.app.currentUser = user;
						Ti.App.Properties.setString('currentUserId', String(user.id));
						//aea.ui.showSpringboard();
						
					} catch (e) {
						Ti.API.info(JSON.stringify(e));						
					}
				},
				error: function() { 
					Ti.API.error("ERROR authorizing");
				},
				failure: function() {
					Ti.API.error("failed to connect");
				}
			});
			
			// var user = new aea.model.User();
// 			
			// user.authorize({
				// userEmail:unField.value,
				// password:pwField.value,
				// success: function(u) {
					// Ti.API.info('setting currentUser? ' + user.toString());
// 					
					// aea.app.currentUser = user;
					// Ti.App.Properties.setString('currentUserId', String(user.id));
					// aea.ui.showSpringboard();
				// },
				// error: function() {
					// Ti.API.error('error logging in!');
					// //TODO: read the status code and give a more reasonable error msg
					// Ti.UI.createAlertDialog({
						// title:'Authorization Failed', 
						// message:'Sorry, we could not log you in. Please check your username and password and try again.'
					// }).show();
					// Ti.App.fireEvent('app:hide.loader');
				// },
				// failure: function() {
					// alert(L('incrowd_server_down'));
					// Ti.API.error('kablammo!');
				// }
			// });			

		});
		
		return win;
	};
})();