browser.storage.local.get('favorites', function (result) {
  var favorites = result.favorites || [{ url: 'https://gmail.com', favicon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png', id: 0 }, { url: 'https://music.youtube.com', favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png', id: 1 }];
  // Sets the URLs
  [0, 1, 2].forEach(i => favorites[i] && (document.querySelector(`#f${i + 1}`).value = favorites[i].url));
});

document.querySelector('#btn').addEventListener('click', () => {
  browser.windows.getCurrent().then((window) => {
    browser.windows.remove(window.id)
  })
})