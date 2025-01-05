<p align="center">
  <a href="#">
  </a>
  <p align="center">
   <img width="150" height="150" src="public/media/icon.png" alt="ArcFox Icon">
  </p>
  <h1 align="center"><b>ArcFox</b></h1>
  <p align="center">
  Make firefox flow like arc
    <br />
    <a href="https://github.com/betterbrowser/arcfox/releases"><strong>Install »</strong></a>
    <br />
  </p>
</p>

<img src="public/media/screenshot.png" width="100%"/>

> Arcfox is a side-project under slow development.

# What is ArcFox?

ArcFox is a pack of firefox improvements that brings the appearance and some of the features of arc browser to firefox. Developed by a non-profit community of passionate browser enthusiats to let people experience arc through their favorite browser.

> I really recomend you to give a try on arc browser anyways.

Please refer to the [roadmap](https://github.com/orgs/betterbrowser/projects/2/views/3) to check the development or our [discord](https://discord.gg/jDASpgt68t) for helps and leaks :D

# Installation
- Download the extension from [the Firefox Add-ons page](https://addons.mozilla.org/firefox/addon/arcfox/).
- Remember to check **Run in Private Windows**.
- Type <a href="about:config">"about:config"</a> in the url bar and press enter.
- Click on **Accept the Risk and Continue**.
- Search for `toolkit.legacyUserProfileCustomizations.stylesheets` and set the value to `true`.
- Type <a href="about:support">"about:support"</a> in the url bar and click on **Open Directory** at **Profile Directory**.
- Inside your Profile Directory, search for a folder called `chrome`. If you don't find it, create one.
- Inside your `chrome` folder, drop <a href="https://github.com/betterbrowser/arcfox/releases/latest/download/userChrome.css">the `userChrome.css` file of the latest release</a>.
- Re-open Firefox.

# Removing ArcFox
- Remove `(Firefox Profile)/chrome/userChrome.css`.
- Remove the 'ArcFox' extension from Firefox.
- Re-open Firefox and it should be gone.
- Be happy with your now boring and unproductive Firefox!

# Support

If you have any problems you can open a issue or contact our team on our [Discord](https://discord.gg/jDASpgt68t).

And if you want to support BetterBrowser financially you can donate to our [OpenCollective](https://opencollective.com/betterbrowser).

# License

Arcfox is developed and Distributed under [MIT License](/LICENSE).
