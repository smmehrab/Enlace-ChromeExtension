// NAV BAR

const saveCurrent = document.querySelector('.saveCurrent');
saveCurrent.addEventListener('click', (e) => {
    e.preventDefault();
    if (saveCurrent.innerText == 'toll') {
        saveCurrent.textContent = 'fiber_smart_record';
        saveCurrent.parentElement.querySelector('.tooltiptext').innerText = 'Saved';
        saveCurrentURL();
    }
});

// TOOL BAR

const addItemIcon = document.querySelector('.itemAddIcon');
addItemIcon.addEventListener('click', (e) => {
    e.preventDefault();
    addItem(document.querySelector('.collection'));
});

const addFolderIcon = document.querySelector('.folderAddIcon');
addFolderIcon.addEventListener('click', (e) => {
    e.preventDefault();
    addFolder(document.querySelector('.folderList'));
});

const settings = document.querySelector('.settingsIcon');
settings.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Settings');
});

// COLLECTION
const collection = document.querySelector('.collection');

function getDraggingAbove(folder, y) {
    const items = [...folder.querySelectorAll('.item:not(.dragging)')];
    return items.reduce((closest, item) => {
        const boundingBox = item.getBoundingClientRect();
        const offset = y - boundingBox.top - boundingBox.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: item };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

collection.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const draggingAbove = getDraggingAboveInCollection(collection, e.clientY);
    if (draggingAbove == null) {
        console.log('hey');
        collection.insertBefore(dragging, collection.querySelector('.folderList'));
    } else {
        collection.insertBefore(dragging, draggingAbove);
    }
});

function getDraggingAboveInCollection(collection, y) {
    const items = [...collection.querySelectorAll('a:not(.dragging)')];
    return items.reduce((closest, item) => {
        const boundingBox = item.getBoundingClientRect();
        const offset = y - boundingBox.top - boundingBox.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: item };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ITEMS
const items = document.querySelectorAll('.item');
const itemDeleteIcons = document.querySelectorAll('.itemDelete');
const itemEditIcons = document.querySelectorAll('.itemEdit');
const itemShareIcons = document.querySelectorAll('.itemShare');

items.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Item Clicked");
    });

    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });
});

itemDeleteIcons.forEach((itemDeleteIcon) => {
    itemDeleteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        itemDeleteIcon.parentElement.parentElement.removeChild(itemDeleteIcon.parentElement);
    });
});

itemEditIcons.forEach((itemEditIcon) => {
    itemEditIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Edit Item");
        itemEditIcon.parentElement.querySelector('.linkInput').value = itemEditIcon.parentElement.querySelector('.link').textContent;
        itemEditIcon.parentElement.querySelector('.linkInput').style.display = 'inline-block';
        itemEditIcon.parentElement.querySelector('.linkInput').focus();
        itemEditIcon.parentElement.querySelector('.link').style.display = 'none';
    });
});

itemShareIcons.forEach((itemShareIcon) => {
    itemShareIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Share Item");
        copyToClipboard(itemShareIcon.parentElement.querySelector('.link').textContent);
    });
});

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

// LINKS

const linkInputs = document.querySelectorAll('.linkInput');
linkInputs.forEach((linkInput) => {
    linkInput.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    linkInput.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    linkInput.addEventListener('focus', (e) => {
        document.querySelector('*').style.pointerEvents = 'none';
        linkInput.style.pointerEvents = 'auto';
    });

    linkInput.addEventListener("keyup", function (e) {
        if (e.keyCode == "13") {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.value) {
                linkInput.parentElement.querySelector('.link').textContent = e.target.value;
            }
            document.querySelector('*').style.pointerEvents = 'auto';

            linkInput.parentElement.querySelector('.linkInput').style.display = 'none';
            linkInput.parentElement.querySelector('.link').style.display = 'inline-block';
        }
    });
});


// FOLDERS
const folders = document.querySelectorAll('.folder');
const folderBtns = document.querySelectorAll('.folder>.btn');
const folderDeleteIcons = document.querySelectorAll('.folderDelete');
const folderEditIcons = document.querySelectorAll('.folderEdit');
const folderItemAddIcons = document.querySelectorAll('.folderItemAdd');

folderBtns.forEach((folderBtn) => {
    folderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (folderBtn.parentElement.querySelector('.itemList').style.display == 'none') {
            folderBtn.parentElement.querySelector('.itemList').style.display = 'block';
            folderBtn.querySelector('.folderExpand').textContent = 'keyboard_arrow_up';

        } else {
            folderBtn.parentElement.querySelector('.itemList').style.display = 'none';
            folderBtn.querySelector('.folderExpand').textContent = 'keyboard_arrow_down';
        }
    });
});

folders.forEach((folder) => {
    folder.querySelector('.itemList').addEventListener('click', (e) => {
        e.preventDefault();
    });

    folder.querySelector('.itemList').addEventListener('dragover', (e) => {
        e.preventDefault();
        folder.querySelector('.itemList').style.display = 'block';
        folder.querySelector('.folderExpand').textContent = 'keyboard_arrow_up';
    });

    folder.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        folder.querySelector('.itemList').style.display = 'block';
        folder.querySelector('.folderExpand').textContent = 'keyboard_arrow_up';
        const draggingAbove = getDraggingAbove(folder, e.clientY);
        if (draggingAbove == null) {
            folder.querySelector('.itemList').appendChild(dragging);
        } else {
            folder.querySelector('.itemList').insertBefore(dragging, draggingAbove);
        }

    });
});


folderDeleteIcons.forEach((folderDeleteIcon) => {
    folderDeleteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Folder Deleted");
        folderDeleteIcon.parentElement.parentElement.parentElement.removeChild(folderDeleteIcon.parentElement.parentElement);
    });
});

folderEditIcons.forEach((folderEditIcon) => {
    folderEditIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Edit Folder");
        folderEditIcon.parentElement.querySelector('.folderInput').value = folderEditIcon.parentElement.querySelector('.folderName').textContent;

        folderEditIcon.parentElement.querySelector('.folderInput').style.display = 'inline-block';
        folderEditIcon.parentElement.querySelector('.folderInput').focus();
        folderEditIcon.parentElement.querySelector('.folderName').style.display = 'none';
    });
});

folderItemAddIcons.forEach((folderItemAddIcon) => {
    folderItemAddIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Item Added to Folder");
        folderItemAddIcon.parentElement.parentElement.querySelector('.itemList').style.display = 'block';
        folderItemAddIcon.parentElement.querySelector('.folderExpand').textContent = 'keyboard_arrow_up';
        addItem(folderItemAddIcon.parentElement.parentElement.querySelector('.itemList'));
    });
});


// FOLDER INPUT
const folderInputs = document.querySelectorAll('.folderInput');
folderInputs.forEach((folderInput) => {
    folderInput.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    folderInput.addEventListener('focus', (e) => {
        document.querySelector('*').style.pointerEvents = 'none';
        folderInput.style.pointerEvents = 'auto';
    });

    folderInput.addEventListener("keyup", function (e) {
        if (e.keyCode == "13") {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.value) {
                folderInput.parentElement.querySelector('.folderName').textContent = e.target.value;
            }
            document.querySelector('*').style.pointerEvents = 'auto';
            folderInput.style.display = 'none';
            folderInput.parentElement.querySelector('.folderName').style.display = 'inline-block';
        }
    });
});

// FUNCTIONS

function addItem(parent) {
    var item = document.createElement('a');
    item.classList.add('item');
    item.setAttribute('draggable', true);
    item.style.cursor = 'pointer';

    item.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Item Clicked");
        console.log(item.href);
        goto(item.href);
    });

    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });

    var link = document.createElement('span');
    link.classList.add('link');
    link.style.display = 'none';

    var linkInput = document.createElement('input');
    linkInput.classList.add('linkInput');
    linkInput.placeholder = "Enter URL";
    linkInput.style.display = 'inline-block';

    linkInput.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    linkInput.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    linkInput.addEventListener('focus', (e) => {
        document.querySelector('*').style.pointerEvents = 'none';
        linkInput.style.pointerEvents = 'auto';
    });

    linkInput.addEventListener("keyup", function (e) {
        if (e.keyCode == "13") {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.value) {
                link.textContent = e.target.value;
                item.href = e.target.value;
            }
            document.querySelector('*').style.pointerEvents = 'auto';
            linkInput.style.display = 'none';
            link.style.display = 'inline-block';
        }
    });

    linkInput.focus();

    var itemDelete = document.createElement('i');
    itemDelete.classList.add('material-icons');
    itemDelete.classList.add('itemDelete');
    itemDelete.textContent = 'delete';

    itemDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        itemDelete.parentElement.parentElement.removeChild(itemDelete.parentElement);
    });

    var itemEdit = document.createElement('i');
    itemEdit.classList.add('material-icons');
    itemEdit.classList.add('itemEdit');
    itemEdit.textContent = 'edit';

    itemEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Edit Item");
        linkInput.value = link.textContent;
        itemEdit.parentElement.querySelector('.linkInput').style.display = 'inline-block';
        itemEdit.parentElement.querySelector('.linkInput').focus();
        itemEdit.parentElement.querySelector('.link').style.display = 'none';
    });

    var itemShare = document.createElement('i');
    itemShare.classList.add('material-icons');
    itemShare.classList.add('itemShare');
    itemShare.textContent = 'share';

    itemShare.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Share Item");
        copyToClipboard(itemShare.parentElement.querySelector('.link').textContent);
    });

    item.appendChild(link);
    item.appendChild(linkInput);
    item.appendChild(itemDelete);
    item.appendChild(itemEdit);
    item.appendChild(itemShare);

    parent.prepend(item);
}

function addCurrentItem(itemLink, parent) {
    var item = document.createElement('a');
    item.classList.add('item');
    item.setAttribute('draggable', true);
    item.style.cursor = 'pointer';
    item.href = itemLink;

    item.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Item Clicked");
        goto(item.href);
    });

    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });

    var link = document.createElement('span');
    link.classList.add('link');
    link.style.display = 'inline-block';
    link.textContent = itemLink;

    var linkInput = document.createElement('input');
    linkInput.classList.add('linkInput');
    linkInput.placeholder = "Enter URL";
    linkInput.style.display = 'none';

    linkInput.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    linkInput.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    linkInput.addEventListener('focus', (e) => {
        document.querySelector('*').style.pointerEvents = 'none';
        linkInput.style.pointerEvents = 'auto';
    });

    linkInput.addEventListener("keyup", function (e) {
        if (e.keyCode == "13") {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.value) {
                link.textContent = e.target.value;
            }
            document.querySelector('*').style.pointerEvents = 'auto';
            linkInput.style.display = 'none';
            link.style.display = 'inline-block';
        }
    });

    var itemDelete = document.createElement('i');
    itemDelete.classList.add('material-icons');
    itemDelete.classList.add('itemDelete');
    itemDelete.textContent = 'delete';

    itemDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        itemDelete.parentElement.parentElement.removeChild(itemDelete.parentElement);
    });

    var itemEdit = document.createElement('i');
    itemEdit.classList.add('material-icons');
    itemEdit.classList.add('itemEdit');
    itemEdit.textContent = 'edit';

    itemEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Edit Item");
        linkInput.value = link.textContent;
        itemEdit.parentElement.querySelector('.linkInput').style.display = 'inline-block';
        itemEdit.parentElement.querySelector('.linkInput').focus();
        itemEdit.parentElement.querySelector('.link').style.display = 'none';
    });

    var itemShare = document.createElement('i');
    itemShare.classList.add('material-icons');
    itemShare.classList.add('itemShare');
    itemShare.textContent = 'share';

    itemShare.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Share Item");
        copyToClipboard(itemShare.parentElement.querySelector('.link').textContent);
    });

    item.appendChild(link);
    item.appendChild(linkInput);
    item.appendChild(itemDelete);
    item.appendChild(itemEdit);
    item.appendChild(itemShare);

    parent.prepend(item);
}

function addFolder(parent) {
    var folder = document.createElement('li');
    folder.classList.add('folder');

    var folderBtn = document.createElement('a');
    folderBtn.classList.add('btn');
    folderBtn.style.cursor = 'pointer';

    folderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (itemList.style.display == 'none') {
            itemList.style.display = 'block';
            folderExpand.textContent = 'keyboard_arrow_up';
        } else {
            itemList.style.display = 'none';
            folderExpand.textContent = 'keyboard_arrow_down';
        }
    });

    var folderName = document.createElement('span');
    folderName.classList.add('folderName');
    folderName.style.display = 'none';

    var folderInput = document.createElement('input');
    folderInput.classList.add('folderInput');
    folderInput.placeholder = "Enter Folder Name";
    folderInput.style.display = 'inline-block';

    folderInput.addEventListener('input', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    folderInput.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
    });

    folderInput.addEventListener('focus', (e) => {
        document.querySelector('*').style.pointerEvents = 'none';
        folderInput.style.pointerEvents = 'auto';
    });

    folderInput.addEventListener("keyup", function (e) {
        if (e.keyCode == "13") {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.value) {
                folderName.textContent = e.target.value;
            }
            document.querySelector('*').style.pointerEvents = 'auto';
            folderInput.style.display = 'none';
            folderName.style.display = 'inline-block';
            folderExpand.style.display = 'inline-block';
            folderExpand.textContent = 'keyboard_arrow_up';
        }
    });

    folderInput.focus();

    var folderDelete = document.createElement('i');
    folderDelete.classList.add('material-icons');
    folderDelete.classList.add('folderDelete');
    folderDelete.textContent = 'delete';

    folderDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Folder Deleted");
        folderDelete.parentElement.parentElement.parentElement.removeChild(folderDelete.parentElement.parentElement);
    });

    var folderEdit = document.createElement('i');
    folderEdit.classList.add('material-icons');
    folderEdit.classList.add('folderEdit');
    folderEdit.textContent = 'edit';

    folderEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Edit Folder");
        folderInput.value = folderName.textContent;
        folderInput.style.display = 'inline-block';
        folderInput.focus();
        folderName.style.display = 'none';
    });

    var folderExpand = document.createElement('i');
    folderExpand.classList.add('material-icons');
    folderExpand.classList.add('folderExpand');
    folderExpand.textContent = 'keyboard_arrow_down';

    var folderItemAdd = document.createElement('i');
    folderItemAdd.classList.add('material-icons');
    folderItemAdd.classList.add('folderItemAdd');
    folderItemAdd.textContent = 'insert_link';

    folderItemAdd.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Item Added to Folder");
        itemList.style.display = 'block';
        folderExpand.textContent = 'keyboard_arrow_up';
        addItem(folderItemAdd.parentElement.parentElement.querySelector('.itemList'));
    });

    var itemList = document.createElement('div');
    itemList.classList.add('itemList');
    itemList.style.display = 'block';

    folderBtn.appendChild(folderName);
    folderBtn.appendChild(folderInput);
    folderBtn.appendChild(folderExpand);
    folderBtn.appendChild(folderEdit);
    folderBtn.appendChild(folderDelete);
    folderBtn.appendChild(folderItemAdd);

    folder.appendChild(folderBtn);
    folder.appendChild(itemList);

    folder.querySelector('.itemList').addEventListener('click', (e) => {
        e.preventDefault();
    });

    folder.querySelector('.itemList').addEventListener('dragover', (e) => {
        e.preventDefault();
        folder.querySelector('.itemList').style.display = 'block';
        folder.querySelector('.folderExpand').textContent = 'keyboard_arrow_up';
    });

    folder.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        folder.querySelector('.itemList').style.display = 'block';
        folder.querySelector('.folderExpand').textContent = 'keyboard_arrow_up';
        const draggingAbove = getDraggingAbove(folder, e.clientY);
        if (draggingAbove == null) {
            itemList.appendChild(dragging);
        } else {
            itemList.insertBefore(dragging, draggingAbove);
        }

    });


    parent.prepend(folder);
}

// TAB HANDLING

function saveCurrentURL() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        url = tabs[0].url;
        addCurrentItem(url, document.querySelector('.collection'));
    });
}

function goto(link) {

    link = link.split('https://');
    if (link[1]) {
        link = 'https://' + link[1];
    } else {
        link = link[0].split('http://');
        if (link[1]) {
            link = 'http://' + link[1];
        } else {
            link = 'https://' + link[0];
        }
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabList) {
        chrome.tabs.update(tabList[0].id, { url: link });
    });
}


// function chat(){
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         url = tabs[0].url;
//         chrome.tabs.sendMessage(tabs[0].id, {message: "Hey, there!"}, function(response) {
//             console.log('Hello, my friend!');
//         });
//       });
// }




// CHROMGE STORAGE
// function addCollectionItem(item) {
//     chrome.storage.local.get({ collectionItems: [] }, function (data) {
//         var items = data.collectionItems;
//         items.push(item);
//         chrome.storage.local.set({ collectionItems: items }, function () {
//             chrome.storage.local.get('collectionItems', function (data) {
//                 console.log(data.collectionItems[0]);
//             });
//         });
//     });
// }

// chrome.storage.local.clear(function () {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// });

// addCollectionItem('www.youtube.com');
// addCollectionItem('www.dtube.com');
// addCollectionItem('www.google.com');


// // by passing an object you can define default values e.g.: []
// chrome.storage.local.get({userKeyIds: []}, function (result) {
//     // the input argument is ALWAYS an object containing the queried keys
//     // so we select the key we need
//     var userKeyIds = result.userKeyIds;
//     userKeyIds.push({'hello': 'hi', HasBeenUploadedYet: false});

//     // set the new array value to the same key
//     chrome.storage.local.set({userKeyIds: userKeyIds}, function () {
//         // you can use strings instead of objects
//         // if you don't  want to define default values
//         chrome.storage.local.get('userKeyIds', function (result) {
//             console.log(result.userKeyIds);
//         });
//     });
// });
