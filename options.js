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