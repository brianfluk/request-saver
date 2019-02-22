var targetURL = "";
var mockServerURL = ""
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ color: '#3aa757' }, function () {
        console.log('The color is green.');
    });
    chrome.storage.sync.set({ 'mockServerURL': 'http://localhost:3000/', 'targetURL': 'http://someOMSIthing' });

    /** Listen to outgoing requests */
    chrome.webRequest.onBeforeRequest.addListener(function(details) {
            chrome.storage.sync.get('targetURL', function(data) {
                targetURL = data.targetURL;
            });
            chrome.storage.sync.get('mockServerURL', function(data) {
                mockServerURL = data.mockServerURL;
            });
            console.log("outgoing request: ", details);
            console.log('targetURL: ', targetURL, " mockserverURL", mockServerURL)
            
            
            let requestURL = new URL(details.url);
            console.log("request url", requestURL);

            if (requestURL.origin == targetURL && requestURL.origin != mockServerURL) { // disallow tracking mock server itself
                console.log('requestURL.origin ==', targetURL)
                let sendUrlEndpoint = requestURL.pathname + requestURL.search;
                let sendPayload;
                if (details.requestBody) {
                    sendPayload = JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
                        new Uint8Array(details.requestBody.raw[0].bytes))));
                } else {
                    sendPayload = {};
                }
                console.log('sendPayload', sendPayload)
    
                var xhr = new XMLHttpRequest();
                xhr.open("POST", mockServerURL, true); // replace localhost3000 with hostNamePost
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var result = xhr.responseText;
                        console.log('result', result);
                    }
                };
                xhr.send(JSON.stringify({
                    "endpoint": sendUrlEndpoint,
                    "payload": sendPayload,
                    "response": {},
                    "method": details.method,
                    "ipr": 1
                }));
            }
        }, 
        {urls: ["<all_urls>"]},
        ["requestBody"]
    )

    /** Listen to incoming requests */
    // chrome.webRequest.onResponseStarted.addListener(function(details) {
    //         console.log('incoming request: ', details)
    //     },
    //     {urls: ["<all_urls>"]},
    //     ["responseHeaders"]
    // )

    chrome.debugger.onEvent.addListener(function(source, method, params) {
        console.log(' INCOMING:params.response', params.response)
    })

});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}