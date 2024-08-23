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
  browser.storage.local.get('favorites', function (result) {
    var favoritesc = result.favorites || [{ url: 'https://gmail.com', favicon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png', id: 0 }, { url: 'https://music.youtube.com', favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png', id: 1 }];
    if (favoritesc[0].url !== document.querySelector('#f1').value) {
      favoritesc[0].url = document.querySelector('#f1').value
      favoritesc[0].favicon = 'undefined';
    }
    if (favoritesc[1].url !== document.querySelector('#f2').value) {
      favoritesc[1].url = document.querySelector('#f2').value
      favoritesc[1].favicon = 'undefined';
    }
    browser.storage.local.set({
      favorites: favoritesc
    });
  })
})