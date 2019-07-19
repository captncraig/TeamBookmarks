
const tempTitle="TeamBookmarksTMP"

async function buildFullTree(title, data){
    // remove any hanging temp folders
    var found = await chrome.bookmarks.search({title: tempTitle});
    for (item of found){
        await chrome.bookmarks.removeTree(item.id);
    }
    // build new temporary tree
    var root = await chrome.bookmarks.create({'parentId': "1", 'title': tempTitle});
    build(root.id, data)
    // find any old tree we need to replace (remember the index)
    // copy temp tree into place
    // delete old tree
}

async function build(parentId, data){
    for (key in data){
        var item = data[key];
        var obj = {'parentId': parentId, 'title': key}
        var dir = true;
        if (typeof item === 'string' || item instanceof String){
            obj.url = item;
            dir = false;
        }
        var newDir = await chrome.bookmarks.create(obj);
        if (dir){
            await build(newDir.id, item);
        }
    }
}

var data = {
    "XYZ": "https://google.com",
    "XYZ2": "https://com.google",
    "Subdir": {
        "A": "http://1.2.3.4",
        "B": "http://3.4.5.6"
    }
}

// assume data is sanity and type checked before this.
// should be objects for folders and strings for links all the way down
buildFullTree("SyncedData", data)