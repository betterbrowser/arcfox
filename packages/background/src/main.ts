type InferredMozillaCommand = Parameters<typeof browser.commands.onCommand.addListener>[0]; // TODO: improvement is welcome

// Turning extension on and checking for updates
chrome.runtime.onInstalled.addListener(function () {
  if (chrome.storage) {
    chrome.storage.sync.set({ isEnabled: true });
  }
});

// Open Sidebar Shortcut - ALT+Q
const handleShortcut: InferredMozillaCommand = (command) => {
  var match = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
  var ver = match ? parseInt(match[1]) : 0;
  if (ver >= 73) {
    browser.sidebarAction.toggle();
  } else {
    browser.sidebarAction.open();
  }
}

browser.commands.onCommand.addListener(handleShortcut);
