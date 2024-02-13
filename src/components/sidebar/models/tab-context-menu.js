const tabContextMenu = document.getElementById("tab-context-menu");
tabContextMenu.tabIndex = 0;

let contextTab;

const close = document.getElementById("close");
const mute = document.getElementById("mute");
const unmute = document.getElementById("unmute");
const duplicate = document.getElementById("duplicate");
const createFolder = document.getElementById("create-folder");
const copyLink = document.getElementById("copy-link"); // Add this line
const unloadTab = document.getElementById("unload-tab"); // Add this line

close.addEventListener("click", async (e) => {
    browser.tabs.remove(Number.parseInt(contextTab.dataset.id));
    tabContextMenu.classList.remove("active");
});

mute.addEventListener("click", async (e) => {
    browser.tabs.update(Number.parseInt(contextTab.dataset.id), { muted: true });
    tabContextMenu.classList.remove("active");
});

unmute.addEventListener("click", async (e) => {
    browser.tabs.update(Number.parseInt(contextTab.dataset.id), { muted: false });
    tabContextMenu.classList.remove("active");
});

duplicate.addEventListener("click", async (e) => {
    browser.tabs.duplicate(Number.parseInt(contextTab.dataset.id));
    tabContextMenu.classList.remove("active");
});

createFolder.addEventListener("click", async (e) => {
    const tabId = Number.parseInt(contextTab.dataset.id);
    const tab = tabs[tabId];
    const tabContainer = tab.parentNode;
    createFolderContainer(tabId, tabContainer);
    tabContextMenu.classList.remove("active");
});

copyLink.addEventListener("click", async (e) => { // Add this block
    const tabId = Number.parseInt(contextTab.dataset.id);
    const tabData = await browser.tabs.get(tabId);
    const pageUrl = tabData.url;
    navigator.clipboard.writeText(pageUrl);
    tabContextMenu.classList.remove("active");
});

unloadTab.addEventListener("click", async (e) => {
    const tabId = Number.parseInt(contextTab.dataset.id);
    browser.tabs.discard(tabId).catch(error => console.error(error));
    tabContextMenu.classList.remove("active");
});

async function openContextMenu(e) {
    e.preventDefault();

    const tabId = Number.parseInt(e.currentTarget.dataset.id);

    contextTab = tabs[tabId];

    const tabData = await browser.tabs.get(tabId);

    displayCreateFolder(contextTab.parentNode);

    displayMuteButtons(tabData);

    tabContextMenu.classList.add("active");
    tabContextMenu.style.top = e.clientY + "px";
    tabContextMenu.style.left = getXPosition(contextTab, e.clientX) + "px";

    tabContextMenu.focus();
}

function displayCreateFolder(tabContainer) {
    createFolder.classList.remove("hidden");

    if (tabContainer === tabList) {
        createFolder.classList.add("hidden");
    }
}

function displayMuteButtons(tabData) {
    if (tabData.mutedInfo.muted) {
        mute.classList.add("hidden");
        unmute.classList.remove("hidden");
    } else {
        mute.classList.remove("hidden");
        unmute.classList.add("hidden");
    }
}

tabContextMenu.addEventListener("focusout", (e) => {
    if (e.relatedTarget === null) {
        tabContextMenu.classList.remove("active");
        return;
    }

    if (e.relatedTarget.parentNode !== tabContextMenu) {
        tabContextMenu.classList.remove("active");
    }
});

function getXPosition(tab, clientX) {
    const maxLeftPosition = tab.getBoundingClientRect().width - tabContextMenu.getBoundingClientRect().width;
    return Math.min(clientX, maxLeftPosition);
}