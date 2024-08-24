browser.storage.local.get('favorites', function (result) {
  var favorites = result.favorites || [{ url: 'https://gmail.com', favicon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png', id: 0 }, { url: 'https://music.youtube.com', favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png', id: 1 }];
  if (favorites[0] !== undefined) {
    document.querySelector('#f1').value = favorites[0].url;
  }
  if (favorites[1] !== undefined) {
    document.querySelector('#f2').value = favorites[1].url;
  }
  if (favorites[2] !== undefined) {
    document.querySelector('#f3').value = favorites[2].url;
  }
});

document.querySelector('#btn').addEventListener('click', () => {
  browser.storage.local.get('favorites', function (result) {
    var favoritesc = result.favorites || [{ url: 'https://gmail.com', favicon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png', id: 0 }, { url: 'https://music.youtube.com', favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png', id: 1 }];

    [0, 1, 2].forEach((i) => {
      if (favoritesc[i] == undefined) {
        if (document.querySelector('#f' + (i + 1)).value !== "") {
          favoritesc[i] = {}
          favoritesc[i].url = document.querySelector('#f' + (i + 1)).value
          favoritesc[i].favicon = 'https://i0.wp.com/www.flyycredit.com/wp-content/uploads/2018/06/globe-icon-white.png?fit=512%2C512&ssl=1';
          favoritesc[i].id = i;
        }
      } else {
        if (document.querySelector('#f' + (i + 1)).value !== "" && document.querySelector('#f' + (i + 1)).value !== favoritesc[i].url) {
          favoritesc[i].url = document.querySelector('#f' + (i + 1)).value
          favoritesc[i].favicon = 'https://i0.wp.com/www.flyycredit.com/wp-content/uploads/2018/06/globe-icon-white.png?fit=512%2C512&ssl=1';
        }
      }

      if (document.querySelector('#f' + (i + 1)).value == "") {
        delete favoritesc[i]
      }
    })
    browser.storage.local.set({
      favorites: favoritesc
    });
  })
  browser.windows.create({})
  browser.windows.getAll({ populate: true }).then((windows) => {
    for (let window of windows) {
      browser.windows.remove(window.id);
    }
  });
})