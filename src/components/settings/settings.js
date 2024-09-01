document.querySelector('#btn').addEventListener('click', () => {
  browser.windows.getCurrent().then((window) => {
    browser.windows.remove(window.id)
  })
})