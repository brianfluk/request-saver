// console.log("running RESPONSE SCRIPT")
// chrome.tabs.query( //get current Tab
//     {
//         currentWindow: true,
//         active: true
//     },
//     function(tabArray) {
//         currentTab = tabArray[0];
//         chrome.debugger.attach({ //debug at current tab
//             tabId: currentTab.id
//         }, version, onAttach.bind(null, currentTab.id));
//     }
// )


// function onAttach(tabId) {

//     chrome.debugger.sendCommand({ //first enable the Network
//         tabId: tabId
//     }, "Network.enable");

//     chrome.debugger.onEvent.addListener(allEventHandler);

// }


// function allEventHandler(debuggeeId, message, params) {

//     if (currentTab.id != debuggeeId.tabId) {
//         return;
//     }

//     if (message == "Network.responseReceived") { //response return 
//         chrome.debugger.sendCommand({
//             tabId: debuggeeId.tabId
//         }, "Network.getResponseBody", {
//             "requestId": params.requestId
//         }, function(response) {
//             // you get the response body here!
//             console.log('hi')
//             console.log('RESPONSE', response)
//             // you can close the debugger tips by:
//             chrome.debugger.detach(debuggeeId);
//         });
//     }

// }