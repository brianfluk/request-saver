if (chrome.extension.getBackgroundPage().recording == false) {
    document.getElementById('disableRecordBtn').setAttribute("class", "hidden")
} else {
    document.getElementById('recordBtn').setAttribute("class", "hidden")
}

document.getElementById('recordBtn').addEventListener('click', function() {
    chrome.extension.getBackgroundPage().recording = true;
    document.getElementById('recordBtn').setAttribute("class", "hidden")
    document.getElementById('disableRecordBtn').removeAttribute("class", "hidden")
})
document.getElementById('disableRecordBtn').addEventListener('click', function() {
    chrome.extension.getBackgroundPage().recording = false;
    document.getElementById('disableRecordBtn').setAttribute("class", "hidden")
    document.getElementById('recordBtn').removeAttribute("class", "hidden")
})