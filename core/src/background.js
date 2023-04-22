// Called when the user presses Alt+Q
function handleShortcut(command) {
    browser.sidebarAction.open();
}

browser.commands.onCommand.addListener(handleShortcut);  