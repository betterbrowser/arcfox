const tabGroup = "tabGroup";
const animation = 100;
const easing = "cubic-bezier(0.76, 0, 0.24, 1)";


new Sortable.create(tabList, {
    group: tabGroup, // set both lists to same group
    animation,
    easing,
    dragClass: "hidden",
    onEnd : function (event) {
        moveBrowserTab(Number.parseInt(event.item.dataset.id), event.newIndex);
    }
});

new Sortable(folderContainer, {
    group: tabGroup, // set both lists to same group
    animation,
    easing,
    dragClass: "hidden",
    onAdd: function(event) {
        const tabId = event.item.dataset.id;

    },
    onRemove: function(event) {
        /*const tabId = event.item.dataset.id;
        browser.tabs.remove(tabId);*/
    }
});

