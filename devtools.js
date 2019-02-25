chrome.devtools.panels.create("Mock Server",
    "/icons/icon16.png",
    "options.html",
    function(panel) {
        console.log('Mock Server Panel created');
        chrome.devtools.network.onRequestFinished.addListener(function(details){
            if (! chrome.extension.getBackgroundPage().enabled) {
                console.log('Extension not enabled.')
                return;
            }
            console.log("DEVTOOLS NETWORK INCOMING CALL", details);
            let mockServerURL = chrome.extension.getBackgroundPage().mockServerURL.replace(/^\/|\/$/g, '');
            let targetURL = chrome.extension.getBackgroundPage().targetURL.replace(/^\/|\/$/g, '');


            let requestFullURL = new URL(details.request.url);
            let desiredEndpoint = (requestFullURL.pathname + requestFullURL.search).replace(/^\/+/g, '');

            details.getContent(function(content, encoding) {
                console.log("DEVTOOLS RESPONSE encoding", encoding)

                if (requestFullURL.origin == targetURL) {
                    console.log('should continue')
                } else {
                    console.log(`target endpoint is ${targetURL} but this origin is ${requestFullURL.origin}`)
                    return
                }

                // get the ipr data from the mock server by replicating call to mock
                // i.e. calling desired endpoint on mock
                var xhr = new XMLHttpRequest();
                console.log("mockServerURL", mockServerURL)
                console.log("targetURL", targetURL)
                
                let originalPayload = (details.method == "POST" && details.request.postData) ? JSON.parse(details.request.postData.params[0].name) : null;
                
                xhr.open(details.request.method, mockServerURL + '/' + desiredEndpoint, true); // replace localhost3000 with hostNamePost
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.onreadystatechange = async function () {
                    console.log('part 2 START xhr:', xhr)
                    if (xhr.readyState == 4) {
                        console.log('YESSSSSSSSSSSS NOW SEND BACK', xhr)
                        var result = xhr.responseText; // save this as response

                        console.log('parsed xhr.responsetext', JSON.parse(xhr.responseText))
                        let mockServerFormat = JSON.parse(xhr.responseText);
                        mockServerFormat.ipr = await 0;
                        
                        console.log('details.getContent()', JSON.parse(content))

                        mockServerFormat.response = await JSON.parse(content);
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("POST", mockServerURL + '/',false)
                        xhr2.setRequestHeader('Content-type', 'application/json');
                        xhr2.onreadystatechange = function () {
                            console.log("TOTAL UPLOAD COMPLETE, xhr: ", xhr2)
                        }
                        console.log('mockServerFormat', mockServerFormat)
                        // part 2
                        xhr2.send(JSON.stringify(mockServerFormat))
                    }
                };
                console.log(`originalPayload:${originalPayload}\ndesiredEndpoint:${desiredEndpoint},\ndetails.request.method:${details.request.method}`)
                xhr.send(JSON.stringify(originalPayload));
            })
        });
    }
);