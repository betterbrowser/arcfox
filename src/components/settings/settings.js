browser.storage.local.get('favorites', function (result) {
  var favorites = result.favorites || [{ url: 'https://gmail.com', favicon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png', id: 0 }, { url: 'https://music.youtube.com', favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png', id: 1 }];
  document.querySelector('#f1').value = favorites[0].url;
  document.querySelector('#f2').value = favorites[1].url;
  console.log(result.favorites)
});

document.querySelector('#btn').addEventListener('click', () => {
  browser.windows.getCurrent({ populate: true }).then((window) => {
    browser.windows.remove(window.id);
  });
  browser.storage.local.set({
    favorites: [{ url: document.querySelector('#f1').value, favicon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png', id: 0 }, { url: document.querySelector('#f2').value, favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png', id: 1 }]
  });
})