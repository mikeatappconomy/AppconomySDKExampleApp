/**
 * Appconomy inCrowd
 */

(function() {	
	aea.ui.createSignupWindow = function(_args) {		
		var win = Ti.UI.createWindow(aea.combine($$.Window,{
			fullscreen:false
		})),
		headerView = Ti.UI.createButton(aea.combine($$.headerView, {
			top:0
		})),		
		profileLabel = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {
			text:L('profile_settings'),
			left:20,
			top: headerView.height + 5,
			height:30
		}));
		
		headerView.addEventListener('click', function(e) {
			win.close();
		});
		
		var tableView = createTableView({top: (profileLabel.top + profileLabel.height + 15)});
		var saveButton = aea.ui.createButton({top:(tableView.height + tableView.top + 10), localizedText:'save'});
		
		win.add(headerView);
		win.add(profileLabel);
		win.add(tableView);
		win.add(saveButton);
		
		saveButton.addEventListener('click', function() {
			Ti.App.fireEvent('app:show.loader');

			Ti.API.info('creating user...');
			var conn = new com.appconomy.xita.XitaConnection('developerkey');
			var userService = new com.appconomy.xita.UserService(conn);
			
			var user = {};
			var data = tableView.data[0];
			
			user.firstName = data.rows[0].children[1].value;
			user.lastName = data.rows[1].children[1].value;
			user.userName = user.firstName + ' ' + user.lastName;
			user.userEmail = data.rows[2].children[1].value;
			var pass = data.rows[3].children[1].value;
			user.userPass = pass;
			user.userPhone = data.rows[4].children[1].value;
			//TODO: the API shouldn't require this value
			user.externalRefId = null;
			
			
			userService.createUser(user, {
				success: function(user) { 
					Ti.API.info("Saved!" + JSON.stringify(user));					
					conn.login(user.userEmail, pass, {
						success: function(usr) {
							try {
								Ti.API.info('successful auth! ' + JSON.stringify(usr));
								//store off the connection for later use
								aea.app.connection = conn;
								aea.app.currentUser = usr;
								Ti.App.Properties.setString('currentUserId', String(usr.id));
								aea.ui.createInfoView().open();
								
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
				},
				error: function() {
					Ti.App.fireEvent('app:hide.loader');
					Ti.UI.createAlertDialog({
						title:'Signup Failed', 
						message:'Sorry, there was a problem creating your account!'
					}).show();					
				},
				failure: function() {
					Ti.App.fireEvent('app:hide.loader');
					Ti.UI.createAlertDialog({
						title:'Signup Failed', 
						message:'Sorry, there was a problem creating your account!'
					}).show();
				}
			});
			
		});
		
		return win;
	};
	
	function createTableView(_args) {
		Ti.API.info('~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!createTableView top! ' + _args.top);
		var tableView = Ti.UI.createTableView({
			style: Ti.UI.iPhone.TableViewStyle.GROUPED,
			width: 300,
			top: _args.top||145,
			backgroundColor: '#00ffffff',
		});

		var rowHeight = 50;
		tableView.appendRow(createTableRow({labelText:'First', rowHeight:rowHeight}));
		tableView.appendRow(createTableRow({labelText:'Last', rowHeight:rowHeight}));
		tableView.appendRow(createTableRow({labelText:'Email', rowHeight:rowHeight}));
		tableView.appendRow(createTableRow({labelText:'Pass', rowHeight:rowHeight}));
		tableView.appendRow(createTableRow({labelText:'Phone', rowHeight:rowHeight}));
		
		var numRows = 5;
		tableView.height = (numRows*rowHeight)+22;
		
		return tableView;
	}
	
	function createTableRow(_args) {
		var row = Ti.UI.createTableViewRow({
			backgroundColor: aea.ui.theme.textColor,
			height:_args.rowHeight
		});

		var lbl = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {
			text: _args.labelText,
			left: 2,
			width: aea.ui.properties.platformWidth / 3,
			color: aea.ui.theme.black
		}));

		var txt = Ti.UI.createTextField({
			right: 0,
			width: aea.ui.properties.platformWidth - (aea.ui.properties.platformWidth/3 + 5),
			value:'',
			color:aea.ui.theme.lightBlue
		});

		row.add(lbl);
		row.add(txt);
		
		return row;
	}
	
})();