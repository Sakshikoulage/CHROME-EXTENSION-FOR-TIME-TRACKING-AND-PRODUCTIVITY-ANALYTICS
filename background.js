console.log("Background script started");

let currentTab = "";
let startTime = Date.now();

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        trackTime(tab.url);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        trackTime(tab.url);
    }
});

function trackTime(url) {
    if (!url) return;

    let domain = new URL(url).hostname;
    let endTime = Date.now();
    let timeSpent = endTime - startTime;

    // 🔥 THIS SENDS DATA TO BACKEND
    fetch("http://localhost:5000/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            website: domain,
            timeSpent: timeSpent,
            category: "Neutral",
            date: new Date()
        }),
        keepalive: true
    })
    .then(res => console.log("Data sent"))
    .catch(err => console.log("Error:", err));

    currentTab = domain;
    startTime = Date.now();
}