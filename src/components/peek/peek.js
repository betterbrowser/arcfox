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


document.addEventListener('DOMSubtreeModified', loadPeek, false);
function loadPeek() {
    // Make peek functional in Anchor elements
    let collection = document.getElementsByTagName("a");
    Array.from(collection).forEach(function (element) {
        element.removeAttribute("jsaction");
        element.removeAttribute("target");
        element.onclick = (event) => {
            if (event.shiftKey) {
                event.preventDefault();
                peekIframe.src = element.href;
                peekBackdrop.style.display = 'block';
                document.body.style.overflow = 'hidden';
                peekPage.showPopover();
            }
        };
    });
}
loadPeek();