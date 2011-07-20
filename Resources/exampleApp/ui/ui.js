/**
* Appcelerator Example SDK App
* Copyright (c) 2009-2011 by Appconomy, Inc. All Rights Reserved.
**/

//Use the UI namespace for all UI component creation.  A few common components will be defined in this file,
//but the bigger ones get their own file (along with styles)
(function() {
	aea.ui = {};
	
	aea.ui.createStackView = function(_args) {
		var stack = Ti.UI.createView(aea.combine($$.stretch,_args.props||{}));
		stack.currentIndex = _args.currentIndex||0;

		//populate stack
		for (var i = 0; i < _args.views.length; i++) {
			var w = _args.views[i];
			if (i == stack.currentIndex) {
				w.visible = true;
			}
			else {
				w.visible = false;
			}
			stack.add(w);
		}

		stack.addEventListener('changeIndex', function(e) {
			for (var j = 0;j < _args.views.length;j++) {
				if (j == e.idx) {
					_args.views[j].visible = true;
					stack.currentIndex = j;

				}
				else {
					_args.views[j].visible = false;
				}
			}
		});

		return stack;
	};
	
	//create a film strip like view 
	aea.ui.createFilmStripView = function(_args) {
		var root = Ti.UI.createView(aea.combine($$.stretch,_args)),
		views = _args.views,
		container = Ti.UI.createView({
			top:0,
			left:0,
			bottom:0,
			width:$$.platformWidth*_args.views.length
		});
			
		for (var i = 0, l = views.length; i<l; i++) {
			var newView = Ti.UI.createView({
				top:0,
				bottom:0,
				left:$$.platformWidth*i,
				width:$$.platformWidth
			});
			newView.add(views[i]);
			container.add(newView);
		}
		root.add(container);
		
		//set the currently visible index
		root.addEventListener('changeIndex', function(e) {
			var leftValue = $$.platformWidth*e.idx*-1;
			container.animate({
				duration:$$.animationDuration,
				left:leftValue
			});
		});
		
		return root;
	};
	
	//create a tweet row from the given data from twitter
	aea.ui.createTweetRow = function(_tweet,_isDM) {
		var row = Ti.UI.createTableViewRow(aea.combine($$.TableViewRow, {
			height:'auto'
		})),
		spacing = 6,
		imgDimensions = 45,
		nameHeight = 18,
		metaHeight = 14,
		retweeted = _tweet.retweeted_status; //should give a 'truthy' or 'falsy' value
		
		var avatar = Ti.UI.createImageView(aea.combine($$.avatarView,{
			top:spacing,
			left:spacing,
			height:imgDimensions,
			width:imgDimensions,
			borderRadius:5,
			image:aea.os({
				android: 'images/twitteranon.png', //waiting on a fix for remote images in TableView
				iphone: (_tweet.retweeted_status) ? _tweet.retweeted_status.user.profile_image_url : (_isDM) ? _tweet.sender.profile_image_url : _tweet.user.profile_image_url
			})
		}));
		row.add(avatar);
		
		var avatarOffset = spacing*2+imgDimensions;
		
		var name = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {
			text:(_tweet.retweeted_status) ? _tweet.retweeted_status.user.name : (_isDM) ? _tweet.sender.name : _tweet.user.name,
			top:spacing,
			left:avatarOffset,
			height:nameHeight
		}));
		row.add(name);
		
		if (retweeted) {
			metaText = String.format(L('retweeted_by'), _tweet.user.name);
			var meta = Ti.UI.createLabel(aea.combine($$.smallText, {
				text:metaText,
				top:nameHeight+3,
				left:avatarOffset,
				right:spacing,
				height:'auto',
				textAlign:'left'
			}));
			row.add(meta);
		}
		
		var tweet = Ti.UI.createLabel(aea.combine($$.Label, {
			text: (retweeted) ? _tweet.retweeted_status.text : _tweet.text,
			top: (retweeted) ? spacing*3+nameHeight : spacing+nameHeight,
			left:avatarOffset,
			right:spacing,
			height:'auto',
			textAlign:'left'
		}));
		row.add(tweet);
		
		var timeAgo = Ti.UI.createLabel(aea.combine($$.smallText, {
			text:_tweet.timeAgoInWords(),
			width:'auto',
			top:spacing,
			right:spacing
		}));
		row.add(timeAgo);
		
		return row;
	};
	
	//create a spacer row for a table view
	aea.ui.createSpacerRow = function() {
		return Ti.UI.createTableViewRow($$.spacerRow);
	};
	
	//shorthand for alert dialog
	aea.ui.alert = function(/*String*/ _title, /*String*/ _message) {
		Ti.UI.createAlertDialog({
			title:_title, 
			message:_message
		}).show();
	};
})();

//Include major UI components and styling properties
Ti.include(
	'/exampleApp/ui/styles.js',
	'/exampleApp/ui/LoginView.js',
	'/exampleApp/ui/SignupWindow.js',
	'/exampleApp/ui/InfoView.js',
	'/exampleApp/ui/Button.js'
);

