// Handle Window Controls

// Check click
document.addEventListener("click", (e) => {
    // Get current window
    function getCurrentWindow() {
        return browser.windows.getCurrent({populate: true});
    }
    
    // Close window if close-window button pressed
    if (e.target.id === "close-window") {
        getCurrentWindow().then((window) => {
            browser.windows.remove(window.id);
        });
    }
    
    // Minimize window if minimize-window button pressed
    if (e.target.id === "minimize-window") {
        getCurrentWindow().then((window) => {
            browser.windows.update(window.id, {state: "minimized"});
        });
    }
    
    // Resize and maximize if resize-window button pressed
    if (e.target.id === "resize-window") {
        getCurrentWindow().then((window) => {
            if (window.state === 'maximized') {
                browser.windows.update(window.id, { state: 'normal' });
            } else {
                browser.windows.update(window.id, { state: 'maximized' });
            }
        });
    }

    // Close if close-sidebar button pressed
    if (e.target.id === "close-sidebar") {
        browser.sidebarAction.close();
    }
});