// Define variables
let tabs = [];
let activeTab = null;
var favorites = [];
var openedFavorites = []
var openedFavoritesIds = [];

const searchInput = document.getElementById("search-input");
const tabList = document.getElementById("tab-list");
const newTabButton = document.getElementById("new-tab-button");
const spaceName = document.querySelector('input#space-name');

// Add event listeners
newTabButton.addEventListener("click", () =>
  newTab()
);

// Put space name on browser storeage
spaceName.addEventListener('change', () => {
  spaceName.blur()
  browser.storage.local.set({ 'spaceName': spaceName.value })
})

// Auto-selects it on click
spaceName.addEventListener('click', () => {
  spaceName.select();
})

// Get space name from localstorage
browser.storage.local.get('spaceName', function (result) {
  spaceName.value = result.spaceName || "Space 1";
});

// Auto-selects address bar on click
searchInput.addEventListener(`click`, () => {
  if (document.activeElement.id == 'search-input') {
    searchInput.select()
  }
});
document.querySelector('div.address-bar').addEventListener(`click`, () => document.getElementById('search-input').select());

// Loads favorites
browser.storage.local.get('favorites', function (result) {
  if (result.favorites == undefined) {
    favorites = [{ url: 'https://gmail.com', favicon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png', id: 0 }, { url: 'https://music.youtube.com', favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png', id: 1 }]
    browser.storage.local.set({
      favorites: favorites
    });
  } else {
    favorites = result.favorites
  }
  loadFavorites()
});

// Update sidebar when a tab changes
browser.tabs.onUpdated.addListener((changeInfo) => {
  if (changeInfo.status === "complete") {
    initTabSidebarControl();
  }
});

// Update sidebar when a tab is created
browser.tabs.onCreated.addListener(function () {
  initTabSidebarControl();
});

// Browser-control
function handleBrowserControl(id) {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let activeTab = tabs[0];
    if (id == 'back') {
      browser.tabs.goBack(activeTab.id);
    } else if (id == 'front') {
      browser.tabs.goForward(activeTab.id);
    } else if (id == 'refresh') {
      browser.tabs.reload(activeTab.id);
    }
  });

  browser.windows.getCurrent({ populate: true }).then((window) => {
    if (id == 'close') {
      browser.windows.remove(window.id);
    } else if (id == 'size') {
      if (window.state === 'maximized') {
        browser.windows.update(window.id, { state: 'normal' });
      } else {
        browser.windows.update(window.id, { state: 'maximized' });
      }
    } else if (id == 'hide') {
      browser.windows.update(window.id, { state: "minimized" });
    }
  });
  initTabSidebarControl();
}

// Handle controls
const controls = ['back', 'front', 'refresh', 'close', 'size', 'hide', 'back', 'front']
controls.forEach((control) => {
  document.getElementById(control).addEventListener("click", function () {
    handleBrowserControl(control);
  });
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("browser-control-button")) {
    handleButtonClick(event);
  }
});

// Search
function updateSearchBar() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
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
      if (!currentTab.url.startsWith('about:')) {
        lockIcon.className = 'fas fa-lock-open';
      } else {
        lockIcon.className = '';
      }
    }
    searchInput.parentNode.insertBefore(lockIcon, searchInput);
    if (currentTab.url.includes('https://arcfox-notes.vercel.app') || currentTab.url.includes('/easel-build')) {
      searchInput.value = currentTab.title;
    } else {
      if (currentUrl.slice(-1) == '/') {
        searchInput.value = currentUrl.replace('https://www.', '').replace('https://', '').slice(0, -1);
      } else {
        searchInput.value = currentUrl.replace('https://www.', '').replace('https://', '');
      }
      if (currentUrl == 'about:newtab') {
        searchInput.value = "";
      }
    }
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
  const query = searchInput.value.trim();
  if (query === "") {
    return;
  }

  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const currentTab = tabs[0];
    let url;

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
      if (query.startsWith('http')) {
        url = query
      } else {
        url = "https://" + query;
      }
    } else {
      url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    }

    browser.tabs.update(currentTab.id, { url: url });
    searchInput.blur();
    updateSearchBar();
  });
}

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchBar();
  }
});

document.querySelector('button#b1').addEventListener("click", function () {
  browser.tabs.create({
    url: 'https://arcfox-notes.vercel.app',
    active: true
  });
});

document.querySelector('button#b2').addEventListener("click", function () {
  newTab();
});

function newTab() {
  browser.tabs.create({});
  document.querySelectorAll('[aria-label="favopen"]')?.forEach((elemento) => {
    elemento.ariaLabel = "";
  })
}

// Sidebar Code
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
  tabList.innerHTML = '';
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
    closeButton.addEventListener('click', closeTab);

    node.appendChild(iconNode);
    node.appendChild(titleNode);
    node.appendChild(closeButton);

    node.addEventListener('drag', setDragging);
    node.addEventListener('dragover', setDraggedOver);
    node.addEventListener('drop', compare);
    node.addEventListener('click', navigateToTab);
    node.addEventListener('auxclick', (event) => {
      if (event.button === 1) {
        closeTab(event);
      }
    });

    if (tab.id === activeTabId) {
      node.classList.add('active');
    }

    if (!openedFavoritesIds.includes(tab.id)) {
      tabList.appendChild(node);
    }
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

const closeTab = (e, middleclick = false) => {
  e.stopPropagation();
  var tabId;
  if (middleclick) {
    tabId = parseInt(e.currentTarget.dataset.tabId);
  } else {
    tabId = parseInt(e.target.parentNode.dataset.tabId);
  }
  browser.tabs.remove(tabId);
  const index = base.findIndex((tab) => tab.id === tabId);
  if (index !== -1) {
    base.splice(index, 1);
    renderItems(base);
  }
  initTabSidebarControl();
  updateSearchBar();
};

const navigateToTab = (e) => {
  const tabId = parseInt(e.currentTarget.dataset.tabId);
  browser.tabs.update(tabId, { active: true, highlighted: false });
  updateSearchBar();

  tabList.querySelector('.active')?.classList.remove('active');
  document.querySelector('[aria-label="favopen"]')?.setAttribute('aria-label', '');

  activeTabId = tabId;
  tabList.querySelector(`[data-tab-id="${activeTabId}"]`)?.classList.add('active');

  e.currentTarget.classList.add('current-tab');
};

document.getElementById('settings').addEventListener('click', () => {
  browser.windows.create({
    url: "../settings/settings.html",
    type: "popup",
    width: 400,
    height: 600
  });
})

// Favorites
function loadFavorites() {
  // Render
  favorites.forEach(async (favorite) => {
    if (favorite !== undefined) {
      const element = document.createElement('button')
      element.className = "favorite"
      element.dataset.url = favorite.url;
      element.onclick = async () => {
        if (!openedFavoritesIds[favorite.id]) {
          const tabCreated = await browser.tabs.create({ url: element.dataset.url });
          openedFavorites.push(tabCreated);
          openedFavoritesIds[favorite.id] = tabCreated.id;
        } else {
          tabList.querySelector('.active')?.classList.remove('active');
          browser.tabs.update(openedFavoritesIds[favorite.id], { active: true });
        }
        document.querySelectorAll('[aria-label="favopen"]')?.forEach((elemento) => {
          elemento.ariaLabel = "";
        })
        element.ariaLabel = "favopen";
        updateSearchBar();
        while (true) {
          await new Promise(resolve => setTimeout(resolve, 200));
          var tabsn = []
          await browser.tabs.query({ currentWindow: true }).then((tabs) => {
            tabsn = tabs
          })
          if ((tabsn.find((elems) => elems.id == openedFavoritesIds[favorite.id]).favIconUrl !== undefined)) {
            break
          }
        }

        browser.tabs.query({ currentWindow: true }).then((tabs) => {
          favIcon.src = tabs.find((elems) => elems.id == openedFavoritesIds[favorite.id]).favIconUrl
          browser.storage.local.get('favorites', function (result) {
            var favoritesc = result.favorites;
            favoritesc[favorite.id].favicon = favIcon.src;
            browser.storage.local.set({ favorites: favoritesc })
          });
        });
      }
      const favIcon = document.createElement('img');
      favIcon.src = favorite.favicon;

      element.appendChild(favIcon)
      document.querySelector('#favorites').appendChild(element);
      // Look for updates on settings
      browser.storage.onChanged.addListener(() => {
        browser.storage.local.get('favorites', function (result) {
          var favoritesg = result.favorites;
          if (JSON.stringify(favoritesg) !== JSON.stringify(favorites)) {
            [0, 1, 2].forEach(i => {
              var url1 = ""
              if (favoritesg[i]) {
                url1 = favoritesg[i].url
              } else {
                url1 = "none"
              }
              var url2 = ""
              if (favorites[i]) {
                url2 = favorites[i].url
              } else {
                url2 = "none"
              }
              if (url1 !== url2) {
                if (favoritesg[i]) {
                  favoritesg[i].favicon = 'https://i0.wp.com/www.flyycredit.com/wp-content/uploads/2018/06/globe-icon-white.png?fit=512%2C512&ssl=1';
                }
                if (openedFavoritesIds[favorite.id]) {
                  browser.tabs.remove(openedFavoritesIds[favorite.id]);
                  openedFavoritesIds.splice(favorite.id, 1);
                }

                document.querySelector('#favorites').innerHTML = "";
                favorites = favoritesg
                loadFavorites();
              }
            })
          }
        })
      })
    }
  });
}

// Remove the context menu
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

// Init Sidebar
function initTabSidebarControl() {
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
}

initTabSidebarControl();