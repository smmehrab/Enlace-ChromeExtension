
/********************************************* USER INTERFACE **********************************************/

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
    addItemComponent(document.querySelector('.collection'));
});

const addFolderIcon = document.querySelector('.folderAddIcon');
addFolderIcon.addEventListener('click', (e) => {
    e.preventDefault();
    addFolderComponent(document.querySelector('.folderList'));
});

const settings = document.querySelector('.settingsIcon');
settings.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Settings');
    gotoSettings();
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

// UI FUNCTIONS
function setUpComponents(collection, folders){
    collection.items.forEach(item => setUpItemComponent(item, document.querySelector('.collection')));
    folders.forEach(folder=>{
        var parent = setUpFolderComponent(folder.name, document.querySelector('.folderList'));
        folder.items.forEach(item => setUpItemComponent(item, parent));
    });
}

function setUpItemComponent(itemLink, parent) {
    var item = document.createElement('a');
    item.classList.add('item');
    item.setAttribute('draggable', true);
    item.style.cursor = 'pointer';
    item.href = itemLink;

    item.addEventListener('click', (e) => {
        e.preventDefault();
        goto(link.textContent);
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
            var previousName = link.textContent;
            if (e.target.value) {
                link.textContent = e.target.value;
                item.href = e.target.value;
            }
            var name = link.textContent;
            document.querySelector('*').style.pointerEvents = 'auto';
            linkInput.style.display = 'none';
            link.style.display = 'inline-block';

            // Storage
            if(previousName){
                if(parent.classList.contains('collection')){
                    updateItem(name, previousName, "Collection");
                } else{
                    updateItem(name, previousName, parent.parentElement.querySelector('.folderName').textContent);
                }
            } 
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
        // Storage
        var name = link.textContent;
        if(parent.classList.contains('collection')){
            deleteItem(name, "Collection");
        } else{
            deleteItem(name, parent.parentElement.querySelector('.folderName').textContent);
        }
    });
    
    var itemEdit = document.createElement('i');
    itemEdit.classList.add('material-icons');
    itemEdit.classList.add('itemEdit');
    itemEdit.textContent = 'edit';

    itemEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
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
        copyToClipboard(itemShare.parentElement.querySelector('.link').textContent);
    });

    item.appendChild(link);
    item.appendChild(linkInput);
    item.appendChild(itemDelete);
    item.appendChild(itemEdit);
    item.appendChild(itemShare);

    parent.prepend(item);
}

function setUpFolderComponent(name, parent) {
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
    folderName.textContent = name;
    folderName.style.display = 'inline-block';

    var folderInput = document.createElement('input');
    folderInput.classList.add('folderInput');
    folderInput.placeholder = "Enter Folder Name";
    folderInput.style.display = 'none';

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
            var previousName = folderName.textContent;
            if (e.target.value) {
                folderName.textContent = e.target.value;
            }
            var name = folderName.textContent;

            document.querySelector('*').style.pointerEvents = 'auto';
            folderInput.style.display = 'none';
            folderName.style.display = 'inline-block';
            folderExpand.style.display = 'inline-block';
            folderExpand.textContent = 'keyboard_arrow_up';

            // Storage
            if(previousName){
                updateFolder(name, previousName);
            } 
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
        folderDelete.parentElement.parentElement.parentElement.removeChild(folderDelete.parentElement.parentElement);
        var name = folderName.textContent;
        // Storage
        deleteFolder(name);
    });

    var folderEdit = document.createElement('i');
    folderEdit.classList.add('material-icons');
    folderEdit.classList.add('folderEdit');
    folderEdit.textContent = 'edit';

    folderEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
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
        itemList.style.display = 'block';
        folderExpand.textContent = 'keyboard_arrow_up';
        addItemComponent(folderItemAdd.parentElement.parentElement.querySelector('.itemList'));
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
    return folder.querySelector('.itemList');
}

function addItemComponent(parent) {
    var item = document.createElement('a');
    item.classList.add('item');
    item.setAttribute('draggable', true);
    item.style.cursor = 'pointer';

    item.addEventListener('click', (e) => {
        e.preventDefault();
        goto(link.textContent);
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
            var previousName = link.textContent;
            if (e.target.value) {
                link.textContent = e.target.value;
                item.href = e.target.value;
            }
            var name = link.textContent;
            document.querySelector('*').style.pointerEvents = 'auto';
            linkInput.style.display = 'none';
            link.style.display = 'inline-block';

            // Storage
            if(previousName){
                if(parent.classList.contains('collection')){
                    updateItem(name, previousName, "Collection");
                } else{
                    updateItem(name, previousName, parent.parentElement.querySelector('.folderName').textContent);
                }
            } 
            else{
                if(parent.classList.contains('collection')){
                    addItem(name, "Collection");
                } else{
                    addItem(name, parent.parentElement.querySelector('.folderName').textContent);
                }
            }
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
        // Storage
        var name = link.textContent;
        if(parent.classList.contains('collection')){
            deleteItem(name, "Collection");
        } else{
            deleteItem(name, parent.parentElement.querySelector('.folderName').textContent);
        }
    });

    var itemEdit = document.createElement('i');
    itemEdit.classList.add('material-icons');
    itemEdit.classList.add('itemEdit');
    itemEdit.textContent = 'edit';

    itemEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
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
        copyToClipboard(itemShare.parentElement.querySelector('.link').textContent);
    });

    item.appendChild(link);
    item.appendChild(linkInput);
    item.appendChild(itemDelete);
    item.appendChild(itemEdit);
    item.appendChild(itemShare);

    parent.prepend(item);
}

function addFolderComponent(parent) {
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
            var previousName = folderName.textContent;
            if (e.target.value) {
                folderName.textContent = e.target.value;
            }
            var name = folderName.textContent;

            document.querySelector('*').style.pointerEvents = 'auto';
            folderInput.style.display = 'none';
            folderName.style.display = 'inline-block';
            folderExpand.style.display = 'inline-block';
            folderExpand.textContent = 'keyboard_arrow_up';

            // Storage
            if(previousName){
                updateFolder(name, previousName);
            } 
            else{
                addFolder(name);
            }
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
        folderDelete.parentElement.parentElement.parentElement.removeChild(folderDelete.parentElement.parentElement);
        var name = folderName.textContent;
        // Storage
        deleteFolder(name);
    });

    var folderEdit = document.createElement('i');
    folderEdit.classList.add('material-icons');
    folderEdit.classList.add('folderEdit');
    folderEdit.textContent = 'edit';

    folderEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
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
        itemList.style.display = 'block';
        folderExpand.textContent = 'keyboard_arrow_up';
        addItemComponent(folderItemAdd.parentElement.parentElement.querySelector('.itemList'));
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

/********************************************* STORAGE **********************************************/

// COMMUNICATION WITH BACKGROUND
var port = chrome.extension.connect({
    name: "Storage"
});

port.onMessage.addListener((response)=>{
    if(response == "Make A Wish"){
        getAll();
    }
    else if(response.type == "setCollectionItem"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.collectionItems);
    }     
    else if(response.type == "addFolder"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.folders);
    }
    else if(response.type == "updateFolder"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.folders);
    }
    else if(response.type == "deleteFolder"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.folders);
    }
    else if(response.type == "addItem"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.parent);
    }
    else if(response.type == "updateItem"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.parent);
    }
    else if(response.type == "deleteItem"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.parent);
    }
    else if(response.type == "getAll"){
        console.log(response.type);
        console.log(response.message);
        console.log(response.collection.items);
        response.folders.forEach(folder => console.log(folder.items));
        setUpComponents(response.collection, response.folders);
    }
});

// port.postMessage({"type": "clearStorage"});

// STORAGE FUNCTIONS
function saveCurrentURL() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        url = tabs[0].url;
        port.postMessage({"type": "addItem", "data": {"parent": "Collection", "itemName":url}});
        setUpItemComponent(url, document.querySelector('.collection'));
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

function gotoSettings(){

}

function addFolder(folderName){
    port.postMessage({"type": "addFolder", "data": {"folderName": folderName}});
}

function updateFolder(folderName, folderPreviousName){
    port.postMessage({"type": "updateFolder", "data": {"folderName": folderName, "folderPreviousName":folderPreviousName}});
}

function deleteFolder(folderName){
    port.postMessage({"type": "deleteFolder", "data": {"folderName": folderName}});
}

function addItem(name, parent){
    port.postMessage({"type": "addItem", "data": {"parent": parent, "itemName":name}});
}

function updateItem(name, previousName, parent){
    port.postMessage({"type": "updateItem", "data": {"parent": parent, "itemName":name, "itemPreviousName": previousName}});
}

function deleteItem(name, parent){
    port.postMessage({"type": "deleteItem", "data": {"parent": parent, "itemName":name}});
}

function getAll(){
    port.postMessage({"type": "getAll"});
}