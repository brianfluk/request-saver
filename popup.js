document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get('mockServerURL', function(data) {
        document.getElementById('mockServerURL').value = data.mockServerURL;
    });
    chrome.storage.sync.get('targetURL', function(data) {
        document.getElementById('targetURL').value = data.targetURL;
    });
})

document.getElementById('enableBtn').addEventListener('click', function() {
    console.log('log: enabled')
    window.alert('Updated names');
})
document.getElementById('sendReqBtn').addEventListener('click', function() {
    // console.log('log: enabled')
    // window.alert('Updated names');
    var hostNamePost;
    console.log("mockServerURL's url: ", document.getElementById('mockServerURL').value)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/smcfs/language/en.json", false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var result = xhr.responseText;
            window.alert('result', result);
            console.log('result', result);
        }
    };
    xhr.send();
})

document.getElementById('mockServerURLBtn').addEventListener('click', function() {
    chrome.storage.sync.get('mockServerURL', function(data) {
        console.log('current value:', data.mockServerURL);
    });
    let mockServerURL = document.getElementById('mockServerURL').value
    if (mockServerURL) {
        chrome.storage.sync.set({ 'mockServerURL': mockServerURL });
    }
})
document.getElementById('targetURLBtn').addEventListener('click', function() {
    chrome.storage.sync.get('targetURL', function(data) {
        console.log('current value:', data.mockServerURL);
    });
    let mockServerURL = document.getElementById('targetURL').value
    if (mockServerURL) {
        chrome.storage.sync.set({ 'targetURL': mockServerURL });
    }
})