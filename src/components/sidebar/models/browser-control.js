// Handle Browser Controls

// Check click
document.addEventListener("click", (e) => {
    // Get current window
    function getCurrentWindow() {
        return browser.windows.getCurrent({populate: true});
    }
    
    // handle Actions
    getCurrentWindow().then((window) => {
        // Go one page back if previous-page button pressed
        if (e.target.id === "previous-page") {
            browser.tabs.goBack();
        }
        
        // Go one page if next-page button pressed
        if (e.target.id === "next-page") {
            browser.tabs.goForward();
        }
        
        // Refresh the page if refresh-page button pressed
        if (e.target.id === "refresh-page") {
            browser.tabs.reload();
        }
    });
});