var targetURL = "";
var mockServerURL = ""
var defaultTarget = "https://jsonplaceholder.typicode.com";
var defaultMock = "http://localhost:3000/";

var enabled = false;
var isRedirecting = false;
var callCountTotal = 1;
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ 'mockServerURL': defaultMock, 'targetURL': defaultTarget }, function() {
        console.log(`mock server URL defaulted at ${defaultMock}, target URL at ${defaultTarget}`)
    });

    /** Listen to outgoing requests */
    chrome.webRequest.onBeforeRequest.addListener(async function(details) {
        let callCount = callCountTotal;
        callCountTotal ++;
        if (! enabled) { // don't proceed
            console.log('extension not enabled')
            return;
        }
        chrome.storage.sync.get('targetURL', function(data) {
            targetURL = data.targetURL.replace(/^\/|\/$/g, '');
            chrome.storage.sync.get('mockServerURL', function(data) {
                mockServerURL = data.mockServerURL.replace(/^\/|\/$/g, '');

                console.log(`${callCount} `, "outgoing request: ", details);
                
                let requestURL = new URL(details.url);
                console.log(`${callCount} `, "request url", requestURL);
                let requestURLOrigin = requestURL.origin.replace(/^\/|\/$/g, '')
                
                console.log(`${callCount} `, 'targetURL: ', targetURL, " mockserverURL", mockServerURL, "requestURL.origin",requestURL.origin)


                if (isRedirecting) { // redirect requests to mockServerURL
                    if (requestURLOrigin == targetURL && requestURLOrigin != mockServerURL) {
                        return {redirectUrl: host + details.url.match(/^https?:\/\/[^\/]+([\S\s]*)/)[1]};
                    }
                    return;
                } 
                // otherwise, record requests and save to mockServerURL


    
                if (requestURLOrigin == targetURL && requestURLOrigin != mockServerURL) { // disallow tracking mock server itself
                    console.log(`${callCount} `, 'requestURL.origin ==', targetURL)
                    let sendUrlEndpoint = requestURL.pathname + requestURL.search;
                    let sendPayload;
                    if (details.requestBody) {
                        sendPayload = JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
                            new Uint8Array(details.requestBody.raw[0].bytes))));
                    } else {
                        sendPayload = {};
                    }
                    console.log(`${callCount} `, 'sendPayload', sendPayload)
                    
                    console.log(`${callCount} `, `mockServerURL gonna send part 1:\n\tendpoint: ${sendUrlEndpoint}\n\tpayload: ${JSON.stringify(sendPayload)}`)
                    fetch(mockServerURL + '/', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ // part 1
                            "endpoint": sendUrlEndpoint,
                            "payload": sendPayload,
                            "response": {},
                            "method": details.method,
                            "ipr": 1
                        })
                    }).then(res => {
                        const contentType = res.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            res.json().then(resJson => {
                                console.log(`${callCount} `, "\tpart 1 result: ", resJson)
                            })
                        } else {
                            res.text().then(resJson => {
                                console.log(`${callCount} `, "\tpart 1 result: ", resJson)
                            })
                        }
                    }).catch((err)=> {
                        console.log(`${callCount} `, "\tpart 1 ERROR:", err)
                    })

                } else {
                    console.log(`${callCount} `, `(requestURL.origin ${requestURL.origin} NOT == targetURL ${targetURL}),    or    (targetURL == mockServerURL ${mockServerURL})`)
                }

            });
        });
        
        }, 
        {urls: ["<all_urls>"]},
        ["requestBody"]
    )

});
