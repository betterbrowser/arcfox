const tabs = {}

const tabTemplate = document.getElementById("tab-template").content.cloneNode(true).querySelector(".tab");
const tabList = document.getElementById("tab-list");

const newTabButton = document.getElementById("new-tab");

let windowID;

function addTab(tabData) {
    if(tabData.windowId != windowID)
    {
        return;
    }
    tabs[tabData.id] = createHTMLTab(tabData);
    insertElementAt(tabList, tabs[tabData.id], tabData.index);
}

function updateTab(tabData) {
    if(tabData.windowId != windowID)
    {
        return;
    }

    applyDataToTab(tabs[tabData.id],tabData);
}

async function removeTab(tabId, tabWindowID) {
    if(tabWindowID != windowID)
    {
        return;
    }
    const tab = tabs[tabId];
    tab.parentNode.removeChild(tab);
    delete tabs[tabId];
}

function setActiveTab(tabId) {
    browser.tabs.update(tabId, {active: true})
}

function changeActiveTab(previousTabId, currentTabId, activeWindowId) {
    if(activeWindowId != windowID)
    {
        return;
    }
    if(previousTabId != null){
        tabs[previousTabId].classList.remove("active");
    }
    tabs[currentTabId].classList.add("active");
}

function createHTMLTab(tabData) {
    const tab = tabTemplate.cloneNode(true);
    const {title, favIconUrl} = tabData;
    applyDataToTab(tab, tabData);

    tab.addEventListener("click", () => setActiveTab(tabData.id));
    tab.addEventListener("contextmenu", (e) => openContextMenu(e, tabData));

    tab.querySelector(".close").addEventListener("click", () => browser.tabs.remove(tabData.id));

    return tab;
}

function applyDataToTab(tab, tabData) {
    let {title, favIconUrl: icon, status} = tabData;


    tab.querySelector(".name").innerText = title;
    tab.title = title;

    tab.dataset.id= tabData.id;
    tab.dataset.windowId = tabData.windowId;

    const iconImg = tab.querySelector(".icon");

    iconImg.classList.remove("loading");
    if(status === "loading")
    {
        icon = "icon/loading.svg"
        iconImg.classList.add("loading");
    }

    if(icon === undefined)
    {
        icon = "icon/undefined.svg"
    }

    iconImg.src = icon;
}

async function displayOpenedTabs()
{
    const tabs = await browser.tabs.query({currentWindow: true});

    for (const tab of tabs) {
        addTab(tab);
        if(tab.active)
        {
            changeActiveTab(null, tab.id, tab.windowId);
        }
    }
}

async function getCurrentWindowId() {
    let window = await browser.windows.getCurrent();
    return window.id;
}

async function loadWindowTabs() {
    windowID = await getCurrentWindowId();
    await displayOpenedTabs();
}

function insertElementAt(parent, element, index) {
    const sibling = parent.children[index];
    if(sibling === undefined)
    {
        parent.appendChild(element);
    }
    else{
        parent.insertBefore(element, sibling);
    }
}

function getElementAtIndex(parent, index) {
    return parent.children[index];
}

function moveBrowserTab(tabID, newIndex) {
    browser.tabs.move(tabID, {index: newIndex});
}

function moveExtensionTab(movedTab, newIndex) {
    tabList.removeChild(movedTab);
    const currentElementAtIndex = getElementAtIndex(tabList, newIndex)
    tabList.insertBefore(movedTab, currentElementAtIndex);
}

browser.tabs.onCreated.addListener((tab) => addTab(tab, tab.windowId));
browser.tabs.onAttached.addListener(async (tabId, attachInfo) => addTab(await browser.tabs.get(tabId)));

browser.tabs.onRemoved.addListener((tabId, removeInfo) => removeTab(tabId, removeInfo.windowId));
browser.tabs.onDetached.addListener((tabId, detachInfo) => removeTab(tabId, detachInfo.oldWindowId));

browser.tabs.onActivated.addListener((activeInfo) => changeActiveTab(activeInfo.previousTabId, activeInfo.tabId, activeInfo.windowId));
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => updateTab(tab));

browser.tabs.onMoved.addListener((tabId, moveInfo) => {
    moveExtensionTab(tabs[tabId], moveInfo.toIndex);
});

newTabButton.addEventListener("click", (e) => {
    browser.tabs.create({active: !e.ctrlKey});
});

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

loadWindowTabs();