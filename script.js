// Client ID and API key from the Developer Console
const CLIENT_ID = '992723977865-h83ciu7b4e9csj9hr6tdq652fo9d42em.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBsN2AIqojIArdGkEL1JJ3S2Zai6P9SbKo';
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
// Google sheets API data
const SPREADSHEET_ID = '1VbfvaiDRT9oQbFPKiPu1Fk6YeNpdpGA1_F9vuCq3PLY';

// define onclicks here
$("#authorize_button").click(function() {gapi.auth2.getAuthInstance().signIn()});
$("#signout_button").click(function() {gapi.auth2.getAuthInstance().signOut()});

// Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // authorizeButton.style.display = 'none';
    // $("#signout_button").css("display", 'inline');
    // body.style.display = 'block';
    console.log(window.location.pathname);
    if (window.location.pathname == "/" || window.location.href == "/index.html") {
      window.location.replace("./dashboard.html");
    }
  } else {
    // authorizeButton.style.display = 'inline';
    // signoutButton.style.display = 'none';
    // body.style.display = 'none';
    if (window.location.pathname == "/dashboard.html") {
      window.location.replace("./");
    }
  }
}

// On load, called to load the auth2 library and API client library.
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initializes the API client library and sets up sign-in state listeners.
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}
