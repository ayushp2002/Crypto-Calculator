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
const TXN_HISTORY_TABLE_HEAD = `
  <th>Open</th>
  <th>Currency</th>
  <th>Quantity</th>
  <th>Price</th>
  <th>Buy</th>
  <th>Sell</th>
  <th>Fee</th>
  <th>Close</th>
`;

// HTML Elements declaration
var body = document.getElementById('body');
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var numberinput1 = document.getElementById('numberinput1');
var numberinput2 = document.getElementById('numberinput2');
var calculatebutton = document.getElementById('calculatebutton');
var tableView = document.getElementById('tableView');
var tableViewBody = document.getElementById('tableViewBody');
var tableViewHeading = document.getElementById('tableViewHeading');
var tableViewHeadRow = document.getElementById('tableViewHeadRow');
var linkInrHist = document.getElementById('linkInrHist');
var linkUsdtHist = document.getElementById('linkUsdtHist');
var dashboardView = document.getElementById('dashboardView');
var loadingSpinner = document.getElementById('loadingSpinner');

// window.onload = function () {
//   loadingSpinner.style.display = 'none';
// };
// window.onunload = function () {
//   loadingSpinner.style.display = 'block';
// };

// ================================================
// Begin of utility functions
// ================================================

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Wait before performing a new action
 *
 * @param {int} duration Duration to wait.
 */
 async function sleep(duration) {
   await new Promise(r => setTimeout(r, duration));
 }

// append elements to the table head
function generateTHead(fullhead) {
  tableViewHeadRow.innerHTML = fullhead;
}

// clear table tbody
function clearTBody() {
  tableViewBody.innerHTML = "";
}

// ================================================
// Begin of running functions
// ================================================

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
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
    // Declare all onclicks here
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    // calculatebutton.onclick = handleCalculateClick;
    linkInrHist.onclick = handleInrHistClick;
    linkUsdtHist.onclick = handleUsdtHistClick;

  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'inline';
    body.style.display = 'block';
  } else {
    authorizeButton.style.display = 'inline';
    signoutButton.style.display = 'none';
    body.style.display = 'none';
  }
}

// ========================================================
// Onclick function declarations here
// ========================================================

// Sign in the user upon button click.
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click.
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// async function handleCalculateClick() {
//   updateSpreadsheetData('Fee Calculator!D7', numberinput1.value);
//   updateSpreadsheetData('Fee Calculator!D9', numberinput2.value);
//   await sleep(150);
//   listSpreadsheetData('Fee Calculator!H7');
//   listSpreadsheetData('Fee Calculator!H8');
//   listSpreadsheetData('Fee Calculator!H9');
// }

function handleInrHistClick() {
  clearTBody();
  tableViewHeading.innerHTML = 'INR History';
  generateTHead(TXN_HISTORY_TABLE_HEAD);
  getDataToTableView('INR History!A2:H');
  tableView.style.display = 'block';
}

function handleUsdtHistClick() {
  clearTBody();
  tableViewHeading.innerHTML = 'USDT History';
  generateTHead(TXN_HISTORY_TABLE_HEAD);
  getDataToTableView('USDT History!A2:H');
  tableView.style.display = 'block';
}

/**
 * Print the data in the spreadsheet:
 * https://docs.google.com/spreadsheets/d/1VbfvaiDRT9oQbFPKiPu1Fk6YeNpdpGA1_F9vuCq3PLY/edit#gid=137913916
 */
function getDataToTableView(range) {
  var output;
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      // appendPre('Read values: ');
      for (i = 0; i < range.values.length; i++) {
        // output = ' ';
        var row = range.values[i];
        tableViewBody.innerHTML += `
          <tr><td>` + row[0] + `
          </td><td>` + row[1] + `
          </td><td>` + row[2] + `
          </td><td>` + row[3] + `
          </td><td>` + row[4] + `
          </td><td>` + row[5] + `
          </td><td>` + row[6] + `
          </td><td>` + row[7] + `
          </td></tr>`;
        // for (var j = 0; j < row.length; j++) {
        //   output =+ " " + row[j];
        // }
        // appendPre(output);
      }
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

/**
 * Update the data in the spreadsheet:
 * https://docs.google.com/spreadsheets/d/1VbfvaiDRT9oQbFPKiPu1Fk6YeNpdpGA1_F9vuCq3PLY/edit#gid=137913916
 */
function updateSpreadsheetData(range, value) {
  var values = [
    [value]
  ];
  var body = {
    values: values
  };
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: body
  }).then((response) => {
    var result = response.result;
    appendPre(result.updatedCells + ' cells updated.');
  });
}
