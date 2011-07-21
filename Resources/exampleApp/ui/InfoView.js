/**
 * Appconomy Example SDK App
 *
 **/

(function() {
	aea.ui.createInfoView = function(_args) {
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
		headerView = Ti.UI.createView(aea.combine($$.headerView,{top:0})),
		userNameLabel = Ti.UI.createLabel(aea.combine($$.smallText, {text:L('lbl_uname') + aea.app.currentUser.userName, top:0, left:10})),
		userEmailLabel = Ti.UI.createLabel(aea.combine($$.smallText, {text:L('lbl_email') + aea.app.currentUser.userEmail, top:5, left:10})),
		userGuidLabel = Ti.UI.createLabel(aea.combine($$.smallText, {text:L('lbl_guid') + aea.app.currentUser.userID, top:10, left:10}));
		
		headerView.addEventListener('click', function(){
			win.close();
		});
		
		//assemble main app window
		win.add(headerView);
		container.add(userNameLabel);
		container.add(userEmailLabel);
		container.add(userGuidLabel);

		win.add(container);

		//pull groups for this user when the window opens
		win.addEventListener('open', function(){
			Ti.API.info('loading groups');
			
			var groupService = new com.appconomy.xita.GroupService(aea.app.connection);
			groupService.loadGroups({
				success: function(groupJson) {
					try {
						Ti.API.error('Success! Got groups.');
						var groupLabel = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {text:L('lbl_groups') + ': ', top:20, left:10}));
						container.add(groupLabel);
						var topPos = 22;
						if (groupJson.membershipGroups) {
							var mGroups = groupJson.membershipGroups;
							for (var i = 0; i < mGroups.length; i++) {								
								var group = {
									name:mGroups[i].collectionName,
									groupId:mGroups[i].collectionId
								};
								var groupNameLbl = Ti.UI.createLabel(aea.combine($$.smallText, {text:group.name, top:topPos, left:10}));
								container.add(groupNameLbl);
								topPos += 2;
							}
						}						
					} catch (e) {
						Ti.API.error('GOT EXCEPTION');
						Ti.API.info(JSON.stringify(e));
					}
				},
				error: function(code, response) {
					Ti.API.error('ERROR loading groups: ' + code);					
				},
				failure: function() {
					alert(L('incrowd_server_down'));
					Ti.API.error("ERROR: failed to connect while trying to get groups ");
				}
			});
			
		});
		
		return win;
	};
})();