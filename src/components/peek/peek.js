// Peek
var peekPage = document.createElement("div");
peekPage.id = "peekpage";
peekPage.popover = true;

// Backdrop
var peekBackdrop = document.createElement('div');
peekBackdrop.id = 'peekbackdrop'
peekBackdrop.onclick = () => closePeek();

// Iframe
var iframeOldSrc;
var peekIframe = document.createElement("iframe");

// Tools
var tools = [{ name: 'close' }, { name: 'open_in_full' }]
tools.forEach((tool) => {
    var btn = document.createElement('button');
    var icn = document.createElement('img')
    btn.className = 'peektools'
    btn.id = tool.name
    if (tool.name == 'close') {
        icn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAADQklEQVR4Xu2cgU0cMRBFoQNKoIS0QAfQQVJJSoioICVAB1ACJVBCSognOqNTuNsd7+33/5P8lSwhnY/xvLdj39mru77yRSVwTY3u4FcWQL4JLMACyATI4V0BFkAmQA7vCrAAMgFyeFeABZAJkMO7AiyATIAc3hVgAWQC5PCuAAsgEyCHdwVYAJkAObwr4D8QcNNy/NHaY2tv5Hyz4b+0jt9b+9bar+ybtvRDV0DA/9na/SGRuwISAv5Ta7eHscaYYRKQAo7h95sjElGWcAy/jzmqFiYBJeAUfHUJp+DDJSAELMFXlbAEHyoBISDm/K+JBUllOsrA7+m8HqajRHq5LggBkdBLa1EJaxdbwgj8GGt8KnpeS2rkdYSAiF9BAh1+gEIJUJcgAR8tQFWCDPwZAtQkSMGfJUBFghz8mQLYEiThzxbAkiALnyFgtgRp+CwBsyTIw2cKQEsoAZ8tACWhDHwFAXtLKAVfRcBeEsrBVxJwqYSS8NUEbJUQ7+tnuPH30gXZUl4LuvQ6cjd067hGt7ID6m0imBx8xQroHEckJNj/eaph98OUTOC1PooVsLcEWfjKFbCXBGn4FQSMLszHFS8Pv4qALRJKwK8mIPtRM/JiP22xtvZ+vK68CB+vAyPw+/tKSFAXMPIN99RdJy9BWcCl8EtUgqqAveDLS1AUMAI/ppi4bhKrnuR0pCZgFH5sL7y3VuVZ1E/3iZKALfCfDxmN7B1JVYKKgEvgb9m2kJGgIGAP+GUlsAXsCb+kBKYABPxyElgCkPBLSWAImAG/jITZAmbCLyFhpgAGfHkJswQw4UtLmCFAAb6sBLQAJfiSEpACFOHLSUAJUIYvJQEhoAJ8GQkIAXGAfp88IFF4XHBkK/u15XWXyC3dBSEgTqfigCQSO3fFdrAC/JFKeGudH1p7T9NNdEQIiLBLEtTgZyRA4EdglIBzElThL0mAwUcL+FuCOvxTEqDwZwjoEmJhjp+t7Ge4idmR2iXWr/ipzX7oDxsMcgqCDfpf+scWQLZpARZAJkAO7wqwADIBcnhXgAWQCZDDuwIsgEyAHN4VYAFkAuTwrgALIBMgh3cFWACZADm8K8ACyATI4V0BFkAmQA7/G7QFKHBqnVVRAAAAAElFTkSuQmCC"
        btn.onclick = () => closePeek()
    } else {
        icn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACo0lEQVR4Xu2c6VEDMQxGkw4oISVASVRISqKEdAC7w2YmE5KsJB+fj8cMv5At+z3LeJ3jeOBHSuAozU7yAwLEiwABCBATEKenAhAgJiBOTwUgQExAnJ4KQICYgDg9FYCA7AR+svfo69C1qF3BvnHIohEgQ/+XGAEIsBNgC7Kzska6mLqCrSMQx7EFIcBOgAqws7JGupi6gq0jGCDufZnD1/J7CszFxdQVHBhMj01S4K/zdTF1BfdI0znmVPgIcAK/Dc8BHwFBAbngIyAgwAP/svT/tpPDta27ggOTa72JF/7ndjp6NS8XU1dw6zSd44vAPy859p60XUxdwc4Jthwehb/OCQGJZlPgI0AMHwEJAlJX/jU1W1BAQi74VIAYPgKcAnKufLagBuBTAUYJJVY+FdAAfCpgR0LJlU8FNACfCngiocbKpwIagE8F3EmoufKpgAbgUwGbBMXKN56CfWE9viAzDPxVVW8ChoLfm4Dh4PckYEj4vQgYFn4PAoaG37qA4eFHBWR9UbqR6wXf4T1jdOQYWlrAFCv/6rA1AVPBb20Lmg5+SwKmhN+KgGnhtyBgavhqAdPDVwoA/nYOVRxDgX/zIFdbAPDvnqJrCgD+gyuMWgKA/+T+qIYA4L+4vCstAPg7N6clBQDfcG1dSgDwDfBLPYh9LB1bv+zossSuH/8/G8c7XFiJCvheKJ0MpKaHX6oCDOwPwC94FbEnAPiFryJeCQB+hauIZwKAX+kq4pEA4Fe8itj7H5D698jJLTVnsfaRyey9L6jYYBMODqXHFO4fAWF0eRoiIA/HcC8ICKPL0xABeTiGe0FAGF2ehgjIwzHcS0RAOBkN/xNAgHhVIAABYgLi9FQAAsQExOmpAASICYjTUwEIEBMQp6cCECAmIE7/C1340WHSbvzYAAAAAElFTkSuQmCC"
        btn.onclick = () => {
            closePeek();
            window.open(iframeOldSrc);
        }
    }
    btn.appendChild(icn)
    peekPage.appendChild(btn);
})

async function closePeek() {
    peekPage.style.scale = 0;
    peekBackdrop.style.opacity = 0;
    await new Promise(resolve => setTimeout(resolve, 300));
    peekPage.hidePopover();
    document.body.style.overflow = ''
    peekBackdrop.style.display = 'none'
    iframeOldSrc = peekIframe.src
    peekIframe.src = ""
}

document.body.appendChild(peekBackdrop);
document.body.appendChild(peekPage);
peekPage.appendChild(peekIframe);

function loadPeek() {
    // Make peek functional in Anchor elements
    let collection = document.getElementsByTagName("a");
    Array.from(collection).forEach((element) => {
        element.onclick = (event) => {
            if (event.shiftKey) {
                event.preventDefault();
                peekPage.showPopover();
                peekPage.style.scale = "";
                peekIframe.src = element.href;
                peekBackdrop.style.display = 'block';
                peekBackdrop.style.opacity = 1;
                document.body.style.overflow = 'hidden';
            }
        };
    });
}
loadPeek();

const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType == Node.ELEMENT_NODE && node.tagName == 'A') {
                loadPeek();
            }
        });
    })
});

observer.observe(document.body, { childList: true, subtree: true });