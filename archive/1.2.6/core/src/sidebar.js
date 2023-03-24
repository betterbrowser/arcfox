// Define variables
let tabs = [];
let activeTab = null;
const searchInput = document.getElementById("search-input");
const tabList = document.getElementById("tab-list");
const newTabButton = document.getElementById("new-tab-button");
const settingsButton = document.getElementById("settings");

// Add event listeners
searchInput.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) { // Enter key
    searchBar();
  }
});

newTabButton.addEventListener("click", function() {
  browser.tabs.create({});
});

// Browser-control
function handleBrowserControl(id) {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
  let activeTab = tabs[0];
    if (id == 'back') {
      browser.tabs.goBack(activeTab.id);
    } else if (id == 'front') {
      browser.tabs.goForward(activeTab.id);
    } else if (id == 'refresh') {
      browser.tabs.reload(activeTab.id);
    }
  });

  browser.windows.getCurrent({populate: true}).then((window) => {
    if (id == 'close') {
      browser.windows.remove(window.id);
    } else if (id == 'size') {
      if (window.state === 'maximized') {
        browser.windows.update(window.id, { state: 'normal' });
      } else {
        browser.windows.update(window.id, { state: 'maximized' });
      }
    } else if (id == 'hide') {
      browser.windows.update(window.id, {state: "minimized"});
    }
  });
}

document.getElementById("back").addEventListener("click", function() {
  handleBrowserControl("back");
});

document.getElementById("front").addEventListener("click", function() {
  handleBrowserControl("front");
});

document.getElementById("refresh").addEventListener("click", function() {
  handleBrowserControl("refresh");
});

document.getElementById("close").addEventListener("click", function() {
  handleBrowserControl("close");
});

document.getElementById("size").addEventListener("click", function() {
  handleBrowserControl("size");
});

document.getElementById("hide").addEventListener("click", function() {
  handleBrowserControl("hide");
});

document.getElementById("back").addEventListener("click", function() {
  handleBrowserControl("back");
});

document.getElementById("front").addEventListener("click", function() {
  handleBrowserControl("front");
});

document.getElementById("refresh").addEventListener("click", function() {
  handleBrowserControl("refresh");
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("browser-control-button")) {
    handleButtonClick(event);
  }
});

// Search
browser.tabs.onActivated.addListener(async () => {
  const tab = await browser.tabs.query({ active: true, currentWindow: true });
  const currentUrl = tab[0].url;
  searchInput.placeholder = currentUrl;
});

function updateSearchBar() {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    const currentUrl = tabs[0].url;
    searchInput.placeholder = currentUrl;
  });
}

setInterval(updateSearchBar, 50);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const newTitle = performSearch(changeInfo.url)
    browser.tabs.executeScript(tabId, { code: `document.title = '${newTitle}';` });
    renderTabs(tabs)
  }
});

// Function to perform the search and return a new tab title
function performSearch(url) {
  // Perform your search logic here...
  // For example, you could extract keywords from the URL and use them to generate a new title
  const keywords = extractKeywords(url);
  const newTitle = `Search results for ${keywords}`;

  return newTitle;
}

// Function to extract keywords from a URL
function extractKeywords(url) {
  // Perform your keyword extraction logic here...
  // For example, you could extract the query parameter from a search engine URL
  const queryParam = new URLSearchParams(new URL(url).search).get('q');

  return queryParam;
}

function searchBar() {
  const query = searchInput.value.trim();
  if (query === "") {
    return;
  }
  browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    const currentTab = tabs[0];
    let url;
    if (query.startsWith("http://") || query.startsWith("https://")) {
      url = query;
    } else if (query.endsWith(".com")) {
      url = "https://" + query;
    } else {
      url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    }
    browser.tabs.update(currentTab.id, {url: url});
    // Clear the search input
    searchInput.value = "";
    // Update the search bar with the current URL
    updateSearchBar();
  });
  // When clicked, clear the search input
  searchInput.onclick = function() {
    searchInput.placeholder = "";
  }
}

// Render the tabs on sidebar
function renderTabs(tabsToRender) {
  tabList.innerHTML = "";
  for (let i = 0; i < tabsToRender.length; i++) {
    const tab = tabsToRender[i];
    const tabItem = document.createElement("li");
    tabItem.textContent = tab.title;
    tabItem.classList.add("tab-item");
    if (tab === activeTab) {
      tabItem.classList.add("active");
    }
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "x";
    closeButton.addEventListener("click", function(event) {
      event.stopPropagation();
      closeTab(tab);
    });
    tabItem.appendChild(closeButton);
    tabItem.addEventListener("click", function() {
      activateTab(tab);
    });
    tabList.appendChild(tabItem);
  }
}

function activateTab(tab) {
  activeTab = tab;
  browser.tabs.update(tab.id, {active: true});
  renderTabs(tabs);
}

function closeTab(tab) {
  browser.tabs.remove(tab.id);
  tabs = tabs.filter(function(t) { return t.id !== tab.id; });
  renderTabs(tabs);
}

// Get tabs on extension startup
browser.tabs.query({}, function(results) {
  tabs = results;
  renderTabs(tabs);
});

// Listen for tab changes
browser.tabs.onCreated.addListener(function(tab) {
  tabs.push(tab);
  renderTabs(tabs);
});
browser.tabs.onRemoved.addListener(function(tabId) {
  tabs = tabs.filter(function(tab) {
    return tab.id !== tabId;
  });
  renderTabs(tabs);
});
browser.tabs.onActivated.addListener(function(activeInfo) {
  activeTab = tabs.find(function(tab) {
    return tab.id === activeInfo.tabId;
  });
  renderTabs(tabs);
});