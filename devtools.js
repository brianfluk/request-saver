chrome.devtools.panels.create("Mock Server",
    "/icons/icon16.png",
    "options.html",
    function(panel) {
        console.log('Mock Server Panel created');
        chrome.devtools.network.onRequestFinished.addListener(function(details){
            if (! chrome.extension.getBackgroundPage().enabled) {
                console.log('extension not enabled')
                return;
            }
            console.log("DEVTOOLS NETWORK INCOMING CALL", details);
            let mockServerURL = chrome.extension.getBackgroundPage().mockServerURL.replace(/^\/|\/$/g, '');
            let targetURL = chrome.extension.getBackgroundPage().targetURL.replace(/^\/|\/$/g, '');


            let requestFullURL = new URL(details.request.url);
            let desiredEndpoint = (requestFullURL.pathname + requestFullURL.search).replace(/^\/+/g, '');

            details.getContent(function(content, encoding) {
                // console.log("DEVTOOLS RESPONSE content", content)
                console.log("DEVTOOLS RESPONSE encoding", encoding)

                /** TODO: match targetURL before continuing
                 */
                if (requestFullURL.origin == targetURL) {
                    // TODO actually put everything below this in this block 
                    console.log('should continue')
                } else {
                    // doesn't match so dont even include this else. I'm just leaving it here for development purposes
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
                    // if (xhr.readyState == 4 && xhr.status == 200) {
                    if (xhr.readyState == 4) {
                        console.log('YESSSSSSSSSSSS NOW SEND BACK', xhr)
                        var result = xhr.responseText; // save this as response

                        // json parse xhr responsetext
                        console.log('parsed xhr.responsetext', JSON.parse(xhr.responseText))
                        let mockServerFormat = JSON.parse(xhr.responseText);
                        mockServerFormat.ipr = await 0;
                        // mockServerFormat.response = 
                        
                        console.log('details.getContent()', JSON.parse(content))
                        // in that parse object, insert details.response as the "response" field, and set IPR to false

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
                console.log("originalPayload", originalPayload)
                console.log('desiredEndpoint', desiredEndpoint)
                console.log('details.request.method', details.request.method)
                xhr.send(JSON.stringify(originalPayload));
            })
        });
    }
);