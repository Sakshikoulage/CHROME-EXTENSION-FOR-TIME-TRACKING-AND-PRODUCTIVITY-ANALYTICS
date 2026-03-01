document.getElementById("view").onclick = () => {
    chrome.storage.local.get(null, data => {
        console.log(data);
    });
};