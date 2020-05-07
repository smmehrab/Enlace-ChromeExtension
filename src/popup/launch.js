var popupWindow = window.open(
    chrome.extension.getURL("./src/popup/popup.html"),
    "Enlace",
    "width=400,height=400"
);
window.close();