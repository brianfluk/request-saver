chrome.devtools.panels.create("Mock Server",
    "/icons/icon16.png",
    "panel.html",
    function(panel) {
        console.log('Mock Server Panel created');
        chrome.devtools.network.onRequestFinished.addListener(function(details){
            console.log("DEVTOOLS NETWORK MONITOR", details);

            let mockServerURL = chrome.extension.getBackgroundPage().mockServerURL;
            let targetURL = chrome.extension.getBackgroundPage().targetURL;

            let requestFullURL = new URL(details.request.url);
            let desiredEndpoint = (requestFullURL.pathname + requestFullURL.search).replace(/^\/+/g, '');

            /** TODO: match targetURL before continuing
             */
            if (requestFullURL.origin == targetURL) {
                // TODO actually put everything below this in this block 
                console.log('should continue')
            } else {
                // doesn't match so dont even include this else. I'm just leaving it here for development purposes
                console.log(`target endpoint is ${targetURL} but this origin is ${requestFullURL.origin}`)
            }

            // get the ipr data from the mock server by replicating call to mock
            // i.e. calling desired endpoint on mock
            var xhr = new XMLHttpRequest();
            console.log("mockServerURL", mockServerURL)
            console.log("targetURL", targetURL)
            
            let originalPayload = (details.method == "POST" && details.request.postData) ? JSON.parse(details.request.postData.params[0].name) : null;
            
            xhr.open(details.request.method, mockServerURL + desiredEndpoint, true); // replace localhost3000 with hostNamePost
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onreadystatechange = function () {
                // console.log('result from devtools call 1', xhr);
                // console.log('xhr.readyState == 4? ', xhr.readyState == 4);
                // console.log('xhr.status == 200? ', xhr.status == 200);
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log('YESSSSSSSSSSSS NOW SEND BACK', xhr)
                    var result = xhr.responseText; // save this as response

                    // json parse xhr responsetext
                    console.log('parsed xhr.responsetext', JSON.parse(xhr.responseText))
                    let mockServerFormat = JSON.parse(xhr.responseText);
                    mockServerFormat.ipr = 0;
                    // mockServerFormat.response = 
                    console.log('details.response', details.response)
                    // in that parse object, insert details.response as the "response" field, and set IPR to false
                    // send that modified responsetext object back to mockServerURL via POST
                }
            };
            console.log("originalPayload", originalPayload)
            console.log('desiredEndpoint', desiredEndpoint)
            console.log('details.request.method', details.request.method)
            xhr.send(originalPayload);






            // xhr.send(JSON.stringify({
            //     "endpoint": desiredEndpoint,
            //     "payload": originalPayload,
            //     "response": {},
            //     "method": details.request.method,
            //     "ipr": 1
            // }));

            // make a second call to mock with ipr false with response appended
            // i.e. posting to '/' endpoint on mock
        });
    }
);