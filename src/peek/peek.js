var peekPage = document.createElement("div");
peekPage.id = "peekpage";
peekPage.popover = true;

var peekBackdrop = document.createElement('div');
peekBackdrop.style = "display: none; height: 100vh; width: 100vw; top: 0; left: 0; position: fixed; z-index: 2147483647;";
peekBackdrop.onclick = () => closePeek();

var tools = [{ name: 'close' }, { name: 'open_in_full' }]
tools.forEach((tool) => {
    var btn = document.createElement('button');
    btn.innerHTML = tool.name
    btn.className = 'peektools'
    btn.id = tool.name
    if (tool.name == 'close') {
        btn.onclick = () => closePeek()
    } else {
        btn.onclick = () => {
            closePeek();
            window.open(iframeOldSrc);
        }
    }
    peekPage.appendChild(btn);
})

var iframeOldSrc = ""
function closePeek() {
    peekPage.hidePopover();
    document.body.style.overflow = ''
    peekBackdrop.style.display = 'none'
    iframeOldSrc = peekIframe.src
    peekIframe.src = ""
}

document.body.appendChild(peekBackdrop);
document.body.appendChild(peekPage);

var peekIframe = document.createElement("iframe");
peekPage.appendChild(peekIframe);

let collection = document.getElementsByTagName("a");

// convert to an array using Array.from()
Array.from(collection).forEach(function (element) {
    var oldhref = element.href;
    element.onclick = (event) => {
        if (event.shiftKey) {
            event.preventDefault();
            element.href = "javascript:;";
            element.jsaction = '';
            element.target = ''
            peekIframe.src = oldhref;
            peekBackdrop.style.display = 'block';
            document.body.style.overflow = 'hidden'
            peekPage.showPopover();
        } else {
            if (element.href == "javascript:;") {
                element.href = oldhref
            }
        }
    };
});