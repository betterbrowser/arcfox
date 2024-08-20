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
var defaultRgx = ["<all_urls>", "*://*/*", "https://*.w3schools.com/*"].join('\n')
var theRegex = null;
var headersdo = {
    "content-security-policy": (x => { return false }),
    "x-frame-options": (x => { return false })
}

function updateRegexpes() {
    browser.storage.local.get(null, function (res) {
        var regstr = (res.regstr_allowed || defaultRgx);
        browser.webRequest.onHeadersReceived.removeListener(setHeader)
        if (!res.is_disabled) {
            theRegex = new RegExp(
                regstr.split("\n").map(
                    x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')	// Sanitize regex
                        .replace(/(^<all_urls>|\\\*)/g, "(.*?)")	// Allow wildcards
                        .replace(/^(.*)$/g, "^$1$")).join("|")	// User multi match
            )
            browser.webRequest.onHeadersReceived.addListener(
                setHeader,
                { urls: ["<all_urls>"], types: ["sub_frame", "object"] },
                ["blocking", "responseHeaders"]
            );
        }
    });
}

function setHeader(e) {
    return new Promise((resolve, reject) => {
        browser.webNavigation.getFrame({ tabId: e.tabId, frameId: e.parentFrameId })
            .then(parentFrame => {
                if (parentFrame.url.match(theRegex)) {
                    e.responseHeaders = e.responseHeaders.filter(x => (headersdo[x.name.toLowerCase()] || Array)())
                }
                resolve({ responseHeaders: e.responseHeaders });
            })
    })
}
updateRegexpes();
var portFromCS;
function connected(p) {
    portFromCS = p;
    portFromCS.onMessage.addListener(function (m) {
        browser.storage.local.set(m, updateRegexpes);
    });
}
browser.runtime.onConnect.addListener(connected);