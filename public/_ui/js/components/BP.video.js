/*

	Video Component
	VERSION 1.0.0
	AUTHORS: Nick Katarow

	DEPENDENCIES:
	- jQuery 1.7.2
	- HG.main.js

*/

BP.video = {
	init: function (elem) {
		var elementId = $(elem).attr('id'),
			videoId = elementId.replace('video-module-', '');

	    var player = $('#player' + videoId);
	    var playerOrigin = '*';

	    // Listen for messages from the player
	    if (window.addEventListener) {
	        window.addEventListener('message', onMessageReceived, false);
	    }
	    else {
	        window.attachEvent('onmessage', onMessageReceived, false);
	    }

	    // Handle messages received from the player
	    function onMessageReceived(event) {
	        // Handle messages from the vimeo player only
	        if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
	            return false;
	        }

	        if (playerOrigin === '*') {
	            playerOrigin = event.origin;
	        }

	        var data = JSON.parse(event.data);

	        switch (data.event) {
	            case 'ready':
	                onReady();
	                break;

	            case 'finish':
	                onFinish();
	                break;
	        }
	    }

	    // Helper function for sending a message to the player
	    function post(action, value) {
	        var data = {
	          method: action
	        };

	        if (value) {
	            data.value = value;
	        }

	        var message = JSON.stringify(data);
	        player[0].contentWindow.postMessage(message, playerOrigin);
	    }

	    function onReady() {
	        post('addEventListener', 'finish');
	    }

	    function onFinish() {
			$('#player' + videoId).css('opacity', '0');

			setTimeout(function(){
				$('#player' + videoId).css('display', 'none');
			}, 500);
	    }

	    // BUTTONS
		$('#play-button-' + videoId).click(function(event){
			event.preventDefault();
			$('#player' + videoId).css('display', 'block');
			$('#video-close-' + videoId).css('display', 'block');

			setTimeout(function(){
				$('#player' + videoId).css('opacity', '1');
		        post('play');
			}, 500);
		});
		$('#video-close-' + videoId).click(function(event){
			event.preventDefault();
			$('#video-close-' + videoId).css('display', 'none');
			post('unload', 'void');
			onFinish();
		});
	}
};
