document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get('mockServerURL', function(data) {
        document.getElementById('mockServerURL').value = data.mockServerURL;
    });
    chrome.storage.sync.get('targetURL', function(data) {
        document.getElementById('targetURL').value = data.targetURL;
    });
})


var currentTab;
var version = "1.0";
    
document.getElementById('debuggerBtn').addEventListener('click', function() {
    console.log('log: debugger open')
    // chrome.tabs.query( //get current Tab
    //     {
    //         currentWindow: true,
    //         active: true
    //     },
    //     function (tabArray) {
    //         console.log('log: tabArray', tabArray)
    //         currentTab = tabArray[0];
    //         chrome.debugger.attach({ //debug at current tab
    //             tabId: currentTab.id
    //         }, version, function(){
    //             console.log('attached')
    //         } );
    //     }
    // )
    chrome.tabs.query( //get current Tab
        {
            currentWindow: true,
            active: true
        },
        function(tabArray) {
            currentTab = tabArray[0];
            chrome.debugger.attach({ //debug at current tab
                tabId: currentTab.id
            }, version, onAttach.bind(null, currentTab.id));
        }
    )
    
    
    function onAttach(tabId) {
    
        chrome.debugger.sendCommand({ //first enable the Network
            tabId: tabId
        }, "Network.enable");
    
        chrome.debugger.onEvent.addListener(allEventHandler);
    
    }
    
    
    function allEventHandler(debuggeeId, message, params) {
    
        if (currentTab.id != debuggeeId.tabId) {
            return;
        }
    
        if (message == "Network.responseReceived") { //response return 
            chrome.debugger.sendCommand({
                tabId: debuggeeId.tabId
            }, "Network.getResponseBody", {
                "requestId": params.requestId
            }, function(response) {
                // you get the response body here!
                console.log('hi')
                console.log('RESPONSE', response)
                // you can close the debugger tips by:
                chrome.debugger.detach(debuggeeId);
            });
        }
    
    }
})

document.getElementById('enableBtn').addEventListener('click', function() {
    console.log('log: enabled')
    window.alert('Updated names');
})

document.getElementById('mockServerURLBtn').addEventListener('click', function() {
    chrome.storage.sync.get('mockServerURL', function(data) {
        console.log('mock server before update:', data.mockServerURL);
    });
    let mockServerURL = document.getElementById('mockServerURL').value
    if (mockServerURL) {
        chrome.storage.sync.set({ 'mockServerURL': mockServerURL });
    }
})
document.getElementById('targetURLBtn').addEventListener('click', function() {
    chrome.storage.sync.get('targetURL', function(data) {
        console.log('target url before update:', data.targetURL);
    });
    let targetURL = document.getElementById('targetURL').value
    if (targetURL) {
        chrome.storage.sync.set({ 'targetURL': targetURL });
    }
})

document.getElementById('sendGETReqBtn').addEventListener('click', function() {
    let url = "http://localhost:3000/smcfs/language/en.json";
    // console.log("get data from  ", document.getElementById('mockServerURL').value)
    console.log("get data from  ", url)
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var result = xhr.responseText;
            console.log('result', result);
        }
    };
    xhr.send();
})

document.getElementById('sendPOSTReqBtn').addEventListener('click', function() {
    var hostNamePost;
    chrome.storage.sync.get('mockServerURL', function(data) {
        hostNamePost = data.mockServerURL;
    });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/", true); // replace localhost3000 with hostNamePost
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log('result', result);
        }
    };
    xhr.send(`{
        "endpoint": "/smcfs/language/en.json",
        "payload": {
            "info": "request payload"
        },
        "response": {
            "language": "en",
            "height": 111,
            "width": 12,
            "hi": "a",
            "bye": "yup, bye!!!!",
            "sub": {
                "lol": 1337
            }
        },
        "method": "GET",
        "ipr": 0
    }`);
})