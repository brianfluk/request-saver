document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get('mockServerURL', function(data) {
        document.getElementById('mockServerURL').value = data.mockServerURL;
    });
    chrome.storage.sync.get('targetURL', function(data) {
        document.getElementById('targetURL').value = data.targetURL;
    });
})

document.getElementById('targetURL').addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("targetURLBtn").click();
    }
});
document.getElementById('mockServerURL').addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("mockServerURLBtn").click();
    }
});

function transitionSaved(id) {
    document.getElementById(id).classList.remove('transparent')
    setTimeout(function () {
        document.getElementById(id).classList.add('transparent')
    }, 500)
}

document.getElementById('targetURLBtn').addEventListener('click', function() {
    chrome.storage.sync.get('targetURL', function(data) {
        console.log('target url before update:', data.targetURL);
    });
    let targetURL = document.getElementById('targetURL').value
    if (targetURL) {
        chrome.storage.sync.set({ 'targetURL': targetURL }, function() {
            transitionSaved('targetSaved')
        });
    }
})

document.getElementById('mockServerURLBtn').addEventListener('click', function() {
    chrome.storage.sync.get('mockServerURL', function(data) {
        console.log('mock server before update:', data.mockServerURL);
    });
    let mockServerURL = document.getElementById('mockServerURL').value
    if (mockServerURL) {
        chrome.storage.sync.set({ 'mockServerURL': mockServerURL }, function() {
            transitionSaved('mockServerSaved')
        });
    }
})

if (chrome.extension.getBackgroundPage().enabled == false) {
    document.getElementById('disableBtn').setAttribute("class", "hidden")
} else {
    document.getElementById('enableBtn').setAttribute("class", "hidden")
}

if (chrome.extension.getBackgroundPage().isRedirecting == false) {
    document.getElementById('isRedirectingBtn').setAttribute("class", "hidden")
} else {
    document.getElementById('isNotRedirectingBtn').setAttribute("class", "hidden")
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


document.getElementById('isNotRedirectingBtn').addEventListener('click', function() {
    chrome.extension.getBackgroundPage().isRedirecting = true;
    chrome.extension.getBackgroundPage().enabled = false;
    document.getElementById('isNotRedirectingBtn').setAttribute("class", "hidden")
    document.getElementById('isRedirectingBtn').removeAttribute("class", "hidden")
    
    // disable --> enable
    document.getElementById('disableBtn').setAttribute("class", "hidden")
    document.getElementById('enableBtn').removeAttribute("class", "hidden")
})
document.getElementById('isRedirectingBtn').addEventListener('click', function() {
    chrome.extension.getBackgroundPage().isRedirecting = false;
    chrome.extension.getBackgroundPage().enabled = false;
    document.getElementById('isRedirectingBtn').setAttribute("class", "hidden")
    document.getElementById('isNotRedirectingBtn').removeAttribute("class", "hidden")
})


