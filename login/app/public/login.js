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
	var playButton = $(".main-login").text("Play");
	if (authResult && !authResult.error) {
      authorizeButton.style.display = 'none';
      facebookButton.style.display = 'none';
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

// Display modal when first arriving on page.
// Initialize tooltips
$(document).ready(function () {
     $('.loginModal').modal({
         backdrop: 'static',
         keyboard: false
     })
     $('.loginModal').modal('show');
     $('[data-toggle="tooltip"]').tooltip(); 
});
