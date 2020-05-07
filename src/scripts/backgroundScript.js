var storagePortStatus = false;
var storagePortBuffer = [];

chrome.runtime.onInstalled.addListener(function () {
    // chrome.contextMenus.create({
    //   "id": "sampleContextMenu",
    //   "title": "Sample Context Menu",
    //   "contexts": ["selection"]
    // });
    // chrome.runtime.sendMessage("Hola");
    // var emptyArray = [];
    // chrome.storage.local.set({ "collectionItems": emptyArray }, function () {
    //     var error = chrome.runtime.lastError;
    //     if (error) {
    //         reject(error);
    //     }
    // });
});

// clearStorage().then((response) => {
//     console.log(response);
// });

// Open Ports
chrome.browserAction.onClicked.addListener((tab) => {
    var port = chrome.extension.connect({
        name: "Storage"
    });
});

// Receive & Handle Requests
chrome.extension.onConnect.addListener((port) => {
    console.log("Popup Connected");
    port.postMessage("Make A Wish");

    port.onMessage.addListener((request) => {
        storagePortBuffer.push(request);
        if(!storagePortStatus){
            handleBuffer(port);
        } 
    });
});

// Handle Buffer
function handleBuffer(port) {
    if(storagePortBuffer.length>0){
        handleRequests(port, storagePortBuffer.pop());
    } else{
        storagePortStatus = false;
    }
}

// Handle Requests
function handleRequests(port, request) {
    if (request.type == "clearStorage") {
        clearStorage().then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if (request.type == "setCollectionItem") {
        setCollectionItem(request.data).then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if (request.type == "getCollectionItems") {
        getCollectionItems().then((data) => {
            port.postMessage(data);
            handleBuffer(port);
        });
    }

    else if (request.type == "addFolder") {
        addFolder(request.data).then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if (request.type == "updateFolder") {
        updateFolder(request.data).then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if(request.type == "deleteFolder"){
        deleteFolder(request.data).then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if(request.type == "addItem"){
        addItem(request.data).then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if(request.type == "updateItem"){
        updateItem(request.data).then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if(request.type == "deleteItem"){
        deleteItem(request.data).then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }

    else if(request.type == "getAll"){
        getAll().then((response) => {
            port.postMessage(response);
            handleBuffer(port);
        });
    }
}

// CHROMGE STORAGE Functions
function clearStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.clear(function () {
            var error = chrome.runtime.lastError;
            if (error) {
                reject(error);
            }
            resolve("Storage Cleared!");
        });
    });
}

function setCollectionItem(item) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({collectionItems:[]}, function (before) {
            var items = before.collectionItems;
            items.push(item);
            chrome.storage.local.set({ "collectionItems": items }, function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    reject(error);
                }
                chrome.storage.local.get("collectionItems", function (after) {
                    resolve({ "type": "setCollectionItem", "collectionItems": after.collectionItems, "message": item + " Set!" });
                });
            });
        });
    });
}

function getCollectionItems() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('collectionItems', function (data) {
            resolve({ "type": "getCollectionItems", "collectionItems": data.collectionItems });
        });
    });
}

function addFolder(data) {
    var folder = {"name" : data.folderName, "items": []};
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({folders:[]}, (before) => {
            var folders = before.folders;
            folders.push(folder);
            chrome.storage.local.set({ "folders": folders }, function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    reject(error);
                }
                chrome.storage.local.get("folders", (after) => {
                    resolve({ "type": "addFolder", "folders": after.folders, "message": "New Folder : " +  folder });
                });
            });
        });
    });
}

function updateFolder(data) {
    var folderName = data.folderName;
    var folderPreviousName = data.folderPreviousName;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({folders:[]}, (before)=>{
            var folders = before.folders;
            var folderNames = folders.map(folder=>folder.name);

            // Update
            const index = folderNames.indexOf(folderPreviousName);
            folders[index].name = folderName;

            chrome.storage.local.set({ "folders": folders }, function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    reject(error);
                }
                chrome.storage.local.get("folders", (after)=>{
                    resolve({ "type": "updateFolder", "folders": after.folders, "message": "Updated : "+ folderPreviousName + " --> " + folderName });
                });
            });
        });
    });
}

function deleteFolder(data) {
    var folderName = data.folderName;
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({folders:[]}, (before)=>{
            var folders = before.folders;
            var folderNames = folders.map(folder=>folder.name);

            // Delete
            const index = folderNames.indexOf(folderName);
            folders.splice(index, 1);

            chrome.storage.local.set({ "folders": folders }, function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    reject(error);
                }
                chrome.storage.local.get("folders", (after)=>{
                    resolve({ "type": "deleteFolder", "folders": after.folders, "message": "Deleted : " +folderName });
                });
            });
        });
    });
}

function addItem(data){
    var item = data.itemName;
    var parent = data.parent;
    return new Promise((resolve, reject) => {
        if(parent == "Collection"){
            chrome.storage.local.get({collection:{"items":[]}}, (before) => {
                var items = before.collection.items;
                items.push(item);
                chrome.storage.local.set({"collection": {"items":items}}, function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        reject(error);
                    }
                    chrome.storage.local.get("collection", (after) => {
                        resolve({ "type": "addItem", "parent": after.collection, "message": parent + " : New Item --> " + item  });
                    });
                });
            });
        } else{
            chrome.storage.local.get({folders:[]}, (before)=>{
                var folders = before.folders;
                var folderNames = folders.map(folder=>folder.name);
                const index = folderNames.indexOf(parent);
                folders[index].items.push(item);
                chrome.storage.local.set({ "folders": folders }, function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        reject(error);
                    }
                    chrome.storage.local.get("folders", (after)=>{
                        resolve({ "type": "addItem", "parent": after.collection, "message": parent + " : New Item --> " + item  });
                    });
                });
            });
        }
    });
}

function updateItem(data){
    var item = data.itemName;
    var itemPrevious = data.itemPreviousName;
    var parent = data.parent;
    return new Promise((resolve, reject) => {
        if(parent == "Collection"){
            chrome.storage.local.get({collection:{"items":[]}}, (before) => {
                var items = before.collection.items;
                var index = items.indexOf(itemPrevious);
                items[index] = item;
                chrome.storage.local.set({"collection": {"items":items}}, function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        reject(error);
                    }
                    chrome.storage.local.get("collection", (after) => {
                        resolve({ "type": "updateItem", "parent": after.collection, "message":   "Updated : " + itemPrevious + " --> " + item});
                    });
                });
            });
        } else{
            chrome.storage.local.get({folders:[]}, (before)=>{
                var folders = before.folders;
                var folderNames = folders.map(folder=>folder.name);
                var indexOfParent = folderNames.indexOf(parent);
                var indexOfItem = folders[indexOfParent].items.indexOf(itemPrevious);
                folders[indexOfParent].items[indexOfItem] = item;
                chrome.storage.local.set({ "folders": folders }, function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        reject(error);
                    }
                    chrome.storage.local.get("folders", (after)=>{
                        resolve({ "type": "updateItem", "parent": after.collection, "message":   "Updated : " + itemPrevious + " --> " + item});
                    });
                });
            });
        }
    });
}

function deleteItem(data){
    var item = data.itemName;
    var parent = data.parent;    
    return new Promise((resolve, reject) => {
        if(parent == "Collection"){
            chrome.storage.local.get({collection:{"items":[]}}, (before) => {
                var items = before.collection.items;
                var index = items.indexOf(item);
                items.splice(index, 1);
                chrome.storage.local.set({"collection": {"items":items}}, function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        reject(error);
                    }
                    chrome.storage.local.get("collection", (after) => {
                        resolve({ "type": "deleteItem", "parent": after.collection, "message": " Deleted : " + item});
                    });
                });
            });
        } else{
            chrome.storage.local.get({folders:[]}, (before)=>{
                var folders = before.folders;
                var folderNames = folders.map(folder=>folder.name);
                var indexOfParent = folderNames.indexOf(parent);
                var indexOfItem = folders[indexOfParent].items.indexOf(item);
                folders[indexOfParent].items.splice(indexOfItem, 1);
                chrome.storage.local.set({ "folders": folders }, function () {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        reject(error);
                    }
                    chrome.storage.local.get("folders", (after)=>{
                        resolve({ "type": "deleteItem", "parent": after.folders, "message": " Deleted : " + item});
                    });
                });
            });
        }
    });
}

function getAll(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({collection:{"items":[]}}, (before) => {
            var collection = before.collection;
            chrome.storage.local.get({folders:[]}, (before)=>{
                var folders = before.folders;
                resolve({ "type": "getAll","message": "Got All !!!", "collection": collection, "folders": folders});
            });
        });
    });
}
