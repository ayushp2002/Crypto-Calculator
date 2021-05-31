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
  <th>Open (₹)</th>
  <th>Currency</th>
  <th>Quantity</th>
  <th>Price (₹)</th>
  <th>Cost (₹)</th>
  <th>Fee (₹)</th>
  <th>Close (₹)</th>
`;
const CURR_BALANCE_TABLE_HEAD = `
  <th>Currency</th>
  <th>Balance</th>
  <th>Cost<th>
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
var linkHist = document.getElementById('linkHist');
var linkCurrBal = document.getElementById('linkCurrBal');
var dashboardView = document.getElementById('dashboardView');
// var loadingSpinner = document.getElementById('loadingSpinner');

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

// Return true or false based on if the parameter is a number or not
function isNumber(val) {
    return !isNaN(val);
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
    // linkHist.onclick = handleHistClick;
    // linkCurrBal.onclick = handleCurrBalClick;

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

// window.onload = () => {getDataToTableView(TXN_HISTORY_TABLE_HEAD, 'Transaction History', 'HISTORY!A2:G', 0);}

linkHist.onclick = () => {getDataToTableView(TXN_HISTORY_TABLE_HEAD, 'Transaction History', 'HISTORY!A2:G', 0);}

linkCurrBal.onclick = () => {getDataToTableView(CURR_BALANCE_TABLE_HEAD, 'Currency Balance', 'CURRENCY_BALANCE!A2:C', 1);}

function generateCurrBalanceTableRow(row) {
  // if (row[2] < 0 && row[1] != "Deposit INR") {
  //   var html = '<tr class="table-danger">';
  // } else if (row[2] > 0) {
  //   var html = '<tr class="table-success">';
  // } else {
    var html = '<tr>';
  // }
  for (var i = 0; i < row.length; i++) {
    if (isNumber(row[i])) {
      html += "<td>" + (Math.abs(row[i])).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }) + "</td>";
      // html += "<td>" + Math.abs(row[i]) + "</td>";
    } else {
      html += "<td>" + row[i] + "</td>";
    }
  }
  html += "</tr>"
  return html;
}

function generateHistoryTableRow(row) {
  if (row[2] < 0 && row[1] != "Deposit INR") {
    var html = '<tr class="table-danger">';
  } else if (row[2] > 0) {
    var html = '<tr class="table-success">';
  } else {
    var html = '<tr>';
  }
  for (var i = 0; i < row.length; i++) {
    if (isNumber(row[i])) {
      html += "<td>" + (Math.abs(row[i])).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }) + "</td>";
      // html += "<td>" + Math.abs(row[i]) + "</td>";
    } else {
      html += "<td>" + row[i] + "</td>";
    }
  }
  html += "</tr>"
  return html;
}

/**
 * Print the data in the spreadsheet:
 * https://docs.google.com/spreadsheets/d/1VbfvaiDRT9oQbFPKiPu1Fk6YeNpdpGA1_F9vuCq3PLY/edit#gid=137913916
 * @params
 *    headrow      - Table heading row defined as constants
 *    tableheading - Heading to be shown above the table
 *    range        - range of data to be fetched from the excel spreadsheets
 *    tabletype    - Type of table to be generated
 *        0 = Transaction History table
 *        1 = Currency balance table
 */
function getDataToTableView(headrow, tableheading, range, tabletype) {
  var output;

  tableViewHeadRow.innerHTML = headrow;
  tableViewBody.innerHTML = "";
  tableViewHeading.innerHTML = 'Currency Balance';

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      tableViewBody.innerHTML = "";
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        if (tabletype == 0) {
          tableViewBody.innerHTML += generateHistoryTableRow(row);
        } else if (tabletype == 1) {
          tableViewBody.innerHTML += generateCurrBalanceTableRow(row);
        } else {
          console.log("Table type " + tabletype + " not found. Possible values [0 (Transaction History Table), 1 (Currency Balance Table)]");
        }
        tableView.style.display = 'block';
        // tableViewBody.innerHTML += "<tr>";
        // for (var j = 0; j < row.length; j++) {
        //   tableViewBody.innerHTML += "<td>" + row[j] + "</td>";
        // }
        // tableViewBody.innerHTML += "</tr>";
        // tableViewBody.innerHTML += `
        //   <tr><td>` + row[0] + `
        //   </td><td>` + row[1] + `
        //   </td><td>` + row[2] + `
        //   </td><td>` + row[3] + `
        //   </td><td>` + row[4] + `
        //   </td><td>` + row[5] + `
        //   </td><td>` + row[6] + `
        //   </td></tr>`;
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
