var peekPage = document.createElement("div");
peekPage.id = "peekpage";
peekPage.popover = true;
peekPage.style = "height: 100vh; width: 70vw; margin: auto; border: 0; padding: 0; animation: peekopen 0.5s; "
document.body.appendChild(peekPage);

var peekIframe = document.createElement("iframe");
peekIframe.frameBorder = 0;
peekPage.appendChild(peekIframe);

let collection = document.getElementsByTagName("a");

// convert to an array using Array.from()
Array.from(collection).forEach(function (element) {
    var oldhref = element.href;
    element.onclick = (event) => {
        if (event.shiftKey) {
            event.preventDefault();
            element.href = "javascript:;";
            peekIframe.src = oldhref;
            peekPage.showPopover();
        }
    };
});