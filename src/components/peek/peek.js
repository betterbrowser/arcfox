// Peek
var peekPage = document.createElement("div");
peekPage.id = "peekpage";
peekPage.popover = true;

// Backdrop
var peekBackdrop = document.createElement('div');
peekBackdrop.style = "display: none; height: 100vh; width: 100vw; top: 0; left: 0; position: fixed; z-index: 2147483647;";
peekBackdrop.onclick = () => closePeek();

// Iframe
var iframeOldSrc;
var peekIframe = document.createElement("iframe");

// Tools
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

function closePeek() {
    peekPage.hidePopover();
    document.body.style.overflow = ''
    peekBackdrop.style.display = 'none'
    iframeOldSrc = peekIframe.src
    peekIframe.src = ""
}

document.body.appendChild(peekBackdrop);
document.body.appendChild(peekPage);
peekPage.appendChild(peekIframe);

// Make peek functional in Anchor elements
let collection = document.getElementsByTagName("a");
Array.from(collection).forEach(function (element) {
    var oldhref = element.href;
    element.onclick = (event) => {
        if (event.shiftKey) {
            event.preventDefault();
            element.href = "javascript:;";
            element.removeAttribute("jsaction");
            element.removeAttribute("target");
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