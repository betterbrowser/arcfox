// Define variables
let tabs = [];
let activeTab = null;
const searchInput = document.getElementById("search-input");
const tabList = document.getElementById("tab-list");
const newTabButton = document.getElementById("new-tab-button");
const searchIcon = document.querySelector('.address-bar i');

// Add event listeners
newTabButton.addEventListener("click", function() {
  browser.tabs.create({});
});

// Update sidebar when a tab changes
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    initTabSidebarControl();
  }
});

// Update sidebar when a tab is created
browser.tabs.onCreated.addListener(function(tab) {
  initTabSidebarControl();
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
  initTabSidebarControl();
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

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("browser-control-button")) {
    handleButtonClick(event);
  }
});

// Search
function updateSearchBar() {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    const previousIcon = document.querySelector('#search-icon');
    if (previousIcon) {
      previousIcon.remove();
    }
    const lockIcon = document.createElement('i');
    lockIcon.id = 'search-icon';
    if (currentTab.url.startsWith('https://')) {
      lockIcon.className = 'fas fa-lock';
    } else {
      lockIcon.className = 'fas fa-lock-open';
    }
    searchInput.parentNode.insertBefore(lockIcon, searchInput);
    searchInput.value = currentUrl;
  });
}

updateSearchBar();

// Function to perform the search and return a new tab title
function performSearch(url) {
  const keywords = extractKeywords(url);
  const newTitle = `Search results for ${keywords}`;

  return newTitle;
}

// Function to extract keywords from a URL
function extractKeywords(url) {
  const queryParam = new URLSearchParams(new URL(url).search).get('q');

  return queryParam;
}

function searchBar() {
  const query = searchInput.value.trim().toLowerCase();
  if (query === "") {
    return;
  }

  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const isValidUrl = urlString => {
      var urlPattern = new RegExp('^(https?:\\/\\/)?' + 
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
        '((\\d{1,3}\\.){3}\\d{1,3}))' + 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$', 'i'); 
      return !!urlPattern.test(urlString);
    }

    if (isValidUrl(query)) {
      browser.tabs.update(null, { url: query.startsWith('http') ? query : `https://${query}` });
    } else {
      browser.search.search({disposition: "CURRENT_TAB", query: query})
    }  

    updateSearchBar();
  });
}

searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    searchBar();
  }
});

// Sidebar Code
function initTabSidebarControl() {
  const list = document.getElementById('tab-list');
  let base, draggedOver, dragging, activeTabId;

  const init = (array) => {
    base = array.map((tab) => ({
      id: tab.id,
      title: tab.title,
      favIconUrl: tab.favIconUrl,
    }));
    renderItems(base);
  };

  const renderItems = (data) => {
    list.innerHTML = '';
    data.forEach((tab) => {
      const node = document.createElement('li');
      node.draggable = true;
      node.dataset.tabId = tab.id;

      const titleNode = document.createElement('div');
      titleNode.classList.add('tab-title');
      titleNode.textContent = tab.title;

      let iconNode;
      if (tab.favIconUrl) {
        iconNode = document.createElement('img');
        iconNode.src = tab.favIconUrl;
        iconNode.alt = tab.title;
      } else {
        iconNode = document.createElement('i');
        iconNode.classList.add('fa', 'fa-solid', 'fa-globe');
        iconNode.setAttribute('aria-hidden', 'true');
      }

      const closeButton = document.createElement('button');
      closeButton.classList.add('close');
      closeButton.title = 'Close Tab';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', handleCloseTabButtonClick);

      node.appendChild(iconNode);
      node.appendChild(titleNode);
      node.appendChild(closeButton);

      node.addEventListener('drag', setDragging);
      node.addEventListener('dragover', setDraggedOver);
      node.addEventListener('drop', compare);
      node.addEventListener('click', navigateToTab);
      node.addEventListener('auxclick', (event) => {
        if (event.button === 1) {
          handleCloseTabWithMiddleButton(event);
        }
      });

      if (tab.id === activeTabId) {
        node.classList.add('active');
      }

      list.appendChild(node);
    });
  };

  const compare = (e) => {
    const index1 = base.findIndex((tab) => tab.id === dragging);
    const index2 = base.findIndex((tab) => tab.id === draggedOver);
    const [draggedTab] = base.splice(index1, 1);
    if (index2 === base.length) {
      base.push(draggedTab);
    } else {
      base.splice(index2, 0, draggedTab);
    }
    renderItems(base);
  };

  const setDraggedOver = (e) => {
    e.preventDefault();
    draggedOver = parseInt(e.target.dataset.tabId);
  };

  const setDragging = (e) => {
    dragging = parseInt(e.target.dataset.tabId);
  };

  const closeTab = (tabId) => {
    browser.tabs.remove(tabId);
    const index = base.findIndex((tab) => tab.id === tabId);
    if (index !== -1) {
      base.splice(index, 1);
      renderItems(base);
    }
    initTabSidebarControl();
  }

  const handleCloseTabButtonClick = (e) => {
    e.stopPropagation();
    const tabId = parseInt(e.target.parentNode.dataset.tabId);
    closeTab(tabId);
  };

  const handleCloseTabWithMiddleButton = (e) => {
    e.stopPropagation();
    const tabId = parseInt(e.currentTarget.dataset.tabId);
    closeTab(tabId);
  };

  const navigateToTab = (e) => {
    const tabId = parseInt(e.currentTarget.dataset.tabId);
    browser.tabs.update(tabId, { active: true, highlighted: false });
    updateSearchBar();

    const currentActiveTab = list.querySelector('.active');
    if (currentActiveTab) {
      currentActiveTab.classList.remove('active');
    }

    activeTabId = tabId;
    const newActiveTab = list.querySelector(`[data-tab-id="${activeTabId}"]`);
    if (newActiveTab) {
      newActiveTab.classList.add('active');
    }
  
    e.currentTarget.classList.add('current-tab');
  };
  
  function createFloatingDiv() {
    const floatingDiv = document.createElement("div");
    floatingDiv.classList.add("floating-div");
  
    const button = document.createElement("button");
    button.innerHTML = '<i class="fa-regular fa-square-plus"></i> New Tab';
    button.classList.add('floating-button');
  
    button.addEventListener("click", function() {
      browser.tabs.create({});
    });

    const secondbutton = document.createElement("button");
    secondbutton.innerHTML = '<i class="fa-regular fa-folder"></i> New Folder (coming soon)';
    secondbutton.classList.add('floating-button');
  
    secondbutton.addEventListener("click", function() {
      browser.tabs.create({});
    });

    const thirdbutton = document.createElement("button");
    thirdbutton.innerHTML = '<i class="fa-brands fa-codepen"></i> New Pen';
    thirdbutton.classList.add('floating-button');
  
    thirdbutton.addEventListener("click", function() {
      const codepenUrl = "https://codepen.io/pen/define";
      const options = {
        url: codepenUrl,
        active: true
      };
      browser.tabs.create(options);
    });  

    const fourthbutton = document.createElement("button");
    fourthbutton.innerHTML = '<i class="fa-regular fa-note-sticky"></i> New Notion';
    fourthbutton.classList.add('floating-button');
  
    fourthbutton.addEventListener("click", function() {
      const newPageUrl = "https://www.notion.so/?newPage";
      browser.tabs.create({ url: newPageUrl });
    });
  
    browser.tabs.onActivated.addListener(() => {
      const floatingDiv = document.querySelector(".floating-div");
      if (floatingDiv) {
        floatingDiv.remove();
      }
    });
  
    floatingDiv.appendChild(button);
    floatingDiv.appendChild(secondbutton);
    floatingDiv.appendChild(thirdbutton);
    floatingDiv.appendChild(fourthbutton);
    document.body.appendChild(floatingDiv);

    document.addEventListener("mousedown", function(event) {
      const isClickInside = floatingDiv.contains(event.target);
  
      if (!isClickInside) {
        floatingDiv.remove();
      }
    });
  }

  const newButton = document.getElementById("new");
  newButton.addEventListener("click", createFloatingDiv);

  function archivetab() {
    const floatingDiv = document.createElement("div");
    floatingDiv.classList.add("floating-div");
  
    const button = document.createElement("button");
    button.innerHTML = '<i class="fa-solid fa-box-archive"></i> Open Library (coming soon)';
    button.classList.add('floating-button');
  
    button.addEventListener("click", function() {
      browser.tabs.create({});
    });
  
    const secondbutton = document.createElement("button");
    secondbutton.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> Clear History';
    secondbutton.classList.add('floating-button');
  
    secondbutton.addEventListener("click", function() {
      browser.tabs.create({});
    });
  
    browser.tabs.onActivated.addListener(() => {
      const floatingDiv = document.querySelector(".floating-div");
      if (floatingDiv) {
        floatingDiv.remove();
      }
    });
  
    floatingDiv.appendChild(button);
    floatingDiv.appendChild(secondbutton);
    document.body.appendChild(floatingDiv);
  
    document.addEventListener("mousedown", function(event) {
      const isClickInside = floatingDiv.contains(event.target);
  
      if (!isClickInside) {
        floatingDiv.remove();
      }
    });
  }  
  
  const ArchiveButton = document.getElementById("archive");
  ArchiveButton.addEventListener("click", archivetab);

  browser.tabs.query({ currentWindow: true }).then((tabs) => {
    init(tabs);
    activeTabId = tabs.find((tab) => tab.active).id;
    renderItems(base);
  });
  
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const index = base.findIndex((t) => t.id === tabId);
    if (index !== -1) {
      base[index].title = tab.title;
      base[index].favIconUrl = tab.favIconUrl;
      renderItems(base);
      updateSearchBar();
    }
  });

  browser.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    closeTab(tabId);
  })  
}

initTabSidebarControl();
