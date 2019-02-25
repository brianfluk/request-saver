document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get('mockServerURL', function(data) {
        document.getElementById('mockServerURL').value = data.mockServerURL;
    });
    chrome.storage.sync.get('targetURL', function(data) {
        document.getElementById('targetURL').value = data.targetURL;
    });
})

if (chrome.extension.getBackgroundPage().enabled == false) {
    document.getElementById('disableBtn').setAttribute("class", "hidden")
} else {
    document.getElementById('enableBtn').setAttribute("class", "hidden")
}


document.getElementById('enableBtn').addEventListener('click', function() {
    chrome.extension.getBackgroundPage().enabled = true;
    document.getElementById('enableBtn').setAttribute("class", "hidden")
    document.getElementById('disableBtn').removeAttribute("class", "hidden")
})
document.getElementById('disableBtn').addEventListener('click', function() {
    chrome.extension.getBackgroundPage().enabled = false;
    document.getElementById('disableBtn').setAttribute("class", "hidden")
    document.getElementById('enableBtn').removeAttribute("class", "hidden")
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

// document.getElementById('sendGETReqBtn').addEventListener('click', function() {
//     let url = "http://localhost:3000/smcfs/language/en.json";
//     // console.log("get data from  ", document.getElementById('mockServerURL').value)
//     console.log("get data from  ", url)
    
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             var result = xhr.responseText;
//             console.log('result', result);
//         }
//     };
//     xhr.send();
// })

// document.getElementById('sendPOSTReqBtn').addEventListener('click', function() {
//     var hostNamePost;
//     chrome.storage.sync.get('mockServerURL', function(data) {
//         hostNamePost = data.mockServerURL;
//     });

//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "http://localhost:3000/", true); // replace localhost3000 with hostNamePost
//     xhr.setRequestHeader('Content-type', 'application/json');
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             var result = xhr.responseText;
//             console.log('result', result);
//         }
//     };
//     xhr.send(`{
//         "endpoint": "/smcfs/language/en.json",
//         "payload": {
//             "info": "request payload"
//         },
//         "response": {
//             "language": "en",
//             "height": 111,
//             "width": 12,
//             "hi": "a",
//             "bye": "yup, bye!!!!",
//             "sub": {
//                 "lol": 1337
//             }
//         },
//         "method": "GET",
//         "ipr": 0
//     }`);
// })