var scopes = ['https://www.googleapis.com/auth/plus.me','profile', 'email'];

function handleClientLoad() {
	window.setTimeout(checkAuth,1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: googleClientId, scope: scopes, immediate: true}, handleAuthResult);
}

// Idempotent auth handler.
function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('google-login');
	var facebookButton = document.getElementById('facebook-login');
	var playButton = $(".main-login");
	if (authResult && !authResult.error) {
      authorizeButton.style.display = 'none';
      facebookButton.style.display = 'none';
      playButton.text("Play");
      makeApiCall();
    } else {
      authorizeButton.style.display = '';
      facebookButton.style.display = '';
      authorizeButton.onclick = handleAuthClick;
	}
}

function handleAuthClick(event) {
// Step 3: get authorization to use private data
gapi.auth.authorize({client_id: googleClientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
	// Step 4: Load the Google+ API
	gapi.client.load('plus', 'v1').then(function() {
	  // Step 5: Assemble the API request
	  var request = gapi.client.plus.people.get({
	    'userId': 'me'
	  });
	  // Step 6: Execute the API request
	  request.then(function(resp) {
	  window.location.href = '/auth/google'; // authenticate with 
	    // Do Stuff
	  }, function(reason) {
	    console.log('Error: ' + reason.result.error.message);
	  });
	});
}

function getCookie(cname) {
	console.log("Seeking cookie: " + cname);
	console.log(document.cookie);
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// Display modal when first arriving on page.
// Initialize tooltips
$(document).ready(function () {
     $('.loginModal').modal({
         backdrop: 'static',
         keyboard: false
     })
     $('.loginModal').modal('show');
     $('[data-toggle="tooltip"]').tooltip(); 


     // Wait for host to be selected & connect.
     var intervalID = setInterval(function(){
     	console.log("Checking for host....");
     	gameHost = getCookie('gameHost');
     	gamePort = getCookie('gamePort');
     	if(gameHost != null && gameHost != "") {
     		console.log("Gamehost set... making connection." + gameHost);
     		if(gamePort != null && gamePort != "") {
     			var socket = io( "http://" + gameHost + ":" + gamePort);
     			clearInterval(intervalID);
     		}
     	}
     }, 500);
});
