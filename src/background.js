// Open Sidebar Shortcut - ALT+Q
function handleShortcut(command) {
    var match = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    var ver = match ? parseInt(match[1]) : 0;
    if (ver >= 73) {
        browser.sidebarAction.toggle();
    } else {
        browser.sidebarAction.open();
    }
}

browser.commands.onCommand.addListener(handleShortcut);

// Remove X-frame headers - required for Peek to work
const handleReceivedHeaders = details => ({
    responseHeaders: details.responseHeaders.filter(header =>
        header.name.toLowerCase() !== "x-frame-options"
    ),
});

browser.webRequest.onHeadersReceived.addListener(
    handleReceivedHeaders,
    { urls: ['<all_urls>'] },
    ['blocking', 'responseHeaders'],
);