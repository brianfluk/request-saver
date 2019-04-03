var updateBody = function (mockFormat, content, loggingId="") {
    mockFormat.ipr = 0;
    mockFormat.response = JSON.parse(content);
    console.log(loggingId, mockFormat)
    return JSON.stringify(mockFormat);
}
var callCountTotal = 1;
chrome.devtools.panels.create("Mock Server",
    "/icons/icon16.png",
    "options.html",
    function(panel) {
        console.log('Mock Server Panel created');
        chrome.devtools.network.onRequestFinished.addListener(async function(details){
            let callCount = callCountTotal;
            callCountTotal ++;
            try {
                if (! chrome.extension.getBackgroundPage().recording) {
                    console.log('Extension not recording.')
                    return;
                }
            } catch (err) {
                console.log('Extension not recording. See', err)
                return
            }
            console.log(`${callCount} `, " DEVTOOLS NETWORK INCOMING CALL", details);
            let loggingId = "";
            loggingId = details.request.method + ": "

            let mockServerURL = chrome.extension.getBackgroundPage().mockServerURL.replace(/^\/|\/$/g, '');
            let targetURL = chrome.extension.getBackgroundPage().targetURL.replace(/^\/|\/$/g, '');


            let requestFullURL = new URL(details.request.url);
            let desiredEndpoint = (requestFullURL.pathname + requestFullURL.search);

            details.getContent(async function(content, encoding) {
                if (requestFullURL.origin == targetURL) {
                    console.log(`${callCount} `, loggingId, `SHOULD CONTINUE. target endpoint == origin == ${targetURL}`)
                } else {
                    console.log(`${callCount} `, loggingId, `SKIPPING. target endpoint is ${targetURL} but this origin is ${requestFullURL.origin}`)
                    return
                }
                
                let originalPayload = (details.request.postData) ? JSON.parse(details.request.postData.text) : null;
                console.log(`${callCount} `, loggingId, "mockServerURL", mockServerURL, "\ntargetURL", targetURL, `\noriginalPayload:${originalPayload}\ndesiredEndpoint:${desiredEndpoint},\ndetails.request.method:${details.request.method}`)

                fetch(mockServerURL + desiredEndpoint, {
                    method: details.request.method,
                    // mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: originalPayload ? JSON.stringify(originalPayload) : null, // body data type must match "Content-Type" header
                }).then(res => {
                    try{
                        res.json().then(mockFormat => {
                            console.log(loggingId, mockFormat, ".\nAfter updating, ",updateBody(mockFormat, content, loggingId));
        
                            fetch(mockServerURL + '/', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: updateBody(mockFormat, content)
                            }).then(res2 => {
                                res2.text().then(restext => {
                                    console.log("Success. Uploaded completed endpoint", restext)
                                })
                            })
                        })
                    } catch (err) {
                        console.log(loggingId, "res was not json.", res)
                    }
                })
            })
        });
    }
);