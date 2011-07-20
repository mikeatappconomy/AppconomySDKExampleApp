/**
 * Appconomy inCrowd app
 **/

(function() {
	//Globally available theme object to hold theme colors/constants
	aea.ui.theme = {
		textColor:'#FFFFFF',
		grayTextColor:'#a8a8a8',
		headerColor:'#333333',
		red:'#ff0000',
		black:'#000000',
		backgroundImage:'images/background.png',
		fontFamily: aea.os({
			iphone:'Helvetica Neue',
			android:'Droid Sans'
		})
	};

	//All shared property sets are declared here.
	aea.ui.properties = {
		//grab platform dimensions only once to save a trip over the bridge
		platformWidth: Ti.Platform.displayCaps.platformWidth,
		platformHeight: Ti.Platform.displayCaps.platformHeight,

		//we use these for default components
		Button: {
			height:45,
			width:278,
			color:'#000',
			font: {
				fontSize:18,
				fontWeight:'bold'
			}
		},
		Label: {
			color:aea.ui.theme.textColor,
			font: {
				fontFamily:aea.ui.theme.fontFamily,
				fontSize:12
			},
			height:'auto'
		},
		Window: {
			backgroundImage:aea.ui.theme.backgroundImage,
			navBarHidden:true,
			fullscreen:false,
			softInputMode:(Ti.UI.Android) ? Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE : ''
		},		
		TextField: {
			height:40,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			color:'#000000'
		},

		//we use these as JS-based 'style classes'
		animationDuration: 500,
		stretch: {
			top:0,
			bottom:0,
			left:0,
			right:0
		},		
		headerText: {
			top:8,
			height:'auto',
			textAlign:'center',
			color:aea.ui.theme.headerColor,
			font: {
				fontFamily:aea.ui.theme.fontFamily,
				fontSize:18,
				fontWeight:'bold'
			}
		},
		headerView: {
			backgroundColor:aea.ui.theme.black,
			height:40,
			width: Ti.Platform.displayCaps.platformWidth
		},
		boldHeaderText: {
			height:'auto',
			color:aea.ui.theme.grayTextColor,
			font: {
				fontFamily:aea.ui.theme.fontFamily,
				fontSize:18,
				fontWeight:'bold'
			}
		},
		smallText: {
			color:aea.ui.theme.textColor,
			font: {
				fontFamily:aea.ui.theme.fontFamily,
				fontSize:10
			},
			height:'auto'
		}
	};
})();
//global shortcut for UI properties, since these get used A LOT. polluting the global
//namespace, but for a good cause (saving keystrokes)
var $$ = aea.ui.properties;