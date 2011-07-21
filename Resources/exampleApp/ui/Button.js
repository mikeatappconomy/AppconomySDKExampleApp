/**
 * Appconomy Example SDK App
 *
 **/

(function() {
	aea.ui.createButton = function(_args) {		
		var buttonContainer = Ti.UI.createView({width:_args.width||278, top:_args.top||0, height:_args.height||45});
		
		var labelText = L(_args.localizedText||'no localized text given');

		var button = Ti.UI.createImageView({
			height:45,
			width:278,
			top:0,
			image:_args.buttonImage||'images/button_blank.png'
		});
		
		var label = Ti.UI.createLabel(aea.combine($$.boldHeaderText, {			
			text:labelText,
			top:9,
			left:_args.labelLeftPos||(button.width/2)-25,
			color:aea.ui.theme.black
		})); 
		
		buttonContainer.add(button);
		buttonContainer.add(label);
		
		return buttonContainer;
	};
})();