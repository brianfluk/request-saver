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
