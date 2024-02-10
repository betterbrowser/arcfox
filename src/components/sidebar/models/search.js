// Get the search bar input field
const searchInput = document.getElementById("search-bar");

// Modify the focus event listener
searchInput.addEventListener("focus", async function(event) {
   // Retrieve the full URL when the input field is focused
   var tabs = await browser.tabs.query({active: true, currentWindow: true});
   var currentUrl = tabs[0].url;
   event.target.value = currentUrl;
});

// Modify the blur event listener
searchInput.addEventListener("blur", async function(event) {
   // Shorten the URL when the input field loses focus
   var tabs = await browser.tabs.query({active: true, currentWindow: true});
   var currentUrl = tabs[0].url;
   event.target.value = shortenUrl(currentUrl);
});

// Function to shorten a URL
function shortenUrl(url) {
   const parsedUrl = new URL(url);
   return parsedUrl.hostname;
}
  
// Function to retrieve the full URL
function getFullUrl(url) {
   const parsedUrl = new URL(url);
   return parsedUrl.toString();
}

// Modify the updateSearchBar function
function updateSearchBar() {
   browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
   const currentUrl = tabs[0].url;
   const shortenedUrl = shortenUrl(currentUrl);
   document.getElementById("search-bar").value = shortenedUrl;
   originalUrl = currentUrl; // Store the original URL
   });
}

updateSearchBar();
  
// Call updateSearchBar whenever the active tab changes
browser.tabs.onActivated.addListener(updateSearchBar);

// Call updateSearchBar whenever a tab is updated
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
   if (changeInfo.status === 'complete' && tab.active) {
     updateSearchBar();
   }
});

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
     } else if (query.startsWith('about:')) {
       browser.tabs.update(null, { url: query });
     } else {
       browser.search.search({disposition: "CURRENT_TAB", query: query})
     } 
  
     updateSearchBar();
   });
}

// Add an event listener to the search bar input field
searchInput.addEventListener("keydown", function(event) {
 if (event.key === "Enter") {
  searchBar();
 }
});