chrome.devtools.panels.create("Mock Server",
    "/icons/icon16.png",
    "options.html",
    function(panel) {
        console.log('Mock Server Panel created');
        chrome.devtools.network.onRequestFinished.addListener(async function(details){
            if (! chrome.extension.getBackgroundPage().enabled) {
                console.log('Extension not enabled.')
                return;
            }
            console.log("DEVTOOLS NETWORK INCOMING CALL", details);
            let mockServerURL = chrome.extension.getBackgroundPage().mockServerURL.replace(/^\/|\/$/g, '');
            let targetURL = chrome.extension.getBackgroundPage().targetURL.replace(/^\/|\/$/g, '');


            let requestFullURL = new URL(details.request.url);
            let desiredEndpoint = (requestFullURL.pathname + requestFullURL.search);

            details.getContent(async function(content, encoding) {
                if (requestFullURL.origin == targetURL) {
                    console.log('should continue')
                } else {
                    console.log(`target endpoint is ${targetURL} but this origin is ${requestFullURL.origin}`)
                    return
                }
                
                let originalPayload = (details.method == "POST" && details.request.postData) ? JSON.parse(details.request.postData.params[0].name) : null;
                console.log("mockServerURL", mockServerURL, "    targetURL", targetURL)
                console.log(`originalPayload:${originalPayload}\ndesiredEndpoint:${desiredEndpoint},\ndetails.request.method:${details.request.method}`)

                fetch(mockServerURL + desiredEndpoint, {
                    method: details.request.method,
                    // method: "GET",
                    // mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: originalPayload ? JSON.stringify(originalPayload) : null, // body data type must match "Content-Type" header
                }).then(res => res.json().then(mockFormat => {
                    console.log(mockFormat);

                    let updateBody = function (mockFormat) {
                        mockFormat.ipr = 0;
                        mockFormat.response = JSON.parse(content);
                        console.log(mockFormat)
                        return JSON.stringify(mockFormat);
                    }

                    fetch(mockServerURL + '/', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: updateBody(mockFormat)
                    })

                }))
            })
        });
    }
);