import fs from "fs/promises";
import path from "path";

console.log("Start");

// TODO: exclude check+copy code into a function and reuse
(async () => {
  console.log("Purge");
  if ((await fs.readdir(".")).includes("dist")) await fs.rm("./dist", { recursive: true });

  console.log("Create/Recreate dist structure");
  await fs.mkdir("./dist")
  await fs.mkdir("./dist/bundle")
  await fs.mkdir("./dist/bundle/arcfox")

  // the next line will be invalid if pnpm will move this package root dir
  // (it will happen when multiple packages will depend on @arcfox/arcfox)
  console.log("Copy @arcfox/arcfox bundle");
  const arcfoxPackageDist = path.resolve(__dirname, "../node_modules/@arcfox/arcfox/dist")
  await fs.access(arcfoxPackageDist); // it will throw error on fail to access
  console.log(`Found [@arcfox/arcfox] at ${arcfoxPackageDist}`);
  await fs.cp(arcfoxPackageDist + "/", "./dist/bundle/arcfox/", { recursive: true });


  // the next line will be invalid if pnpm will move this package root dir
  // (it will happen when multiple packages will depend on @arcfox/background)
  console.log("Copy @arcfox/background script");
  const backgroundScriptPath = path.resolve(__dirname, "../node_modules/@arcfox/background/dist/background.js")
  await fs.access(backgroundScriptPath); // it will throw error on fail to access
  console.log(`Found [@arcfox/background] at ${backgroundScriptPath}`);
  await fs.cp(backgroundScriptPath, "./dist/bundle/background.js");

  console.log("Copy icon");
  const iconPath = path.resolve(__dirname, "../assets/icon.png");
  await fs.access(iconPath); // it will throw error on fail to access
  console.log(`Found icon at ${iconPath}`);
  await fs.cp(iconPath, "./dist/icon.png");

  console.log("Create manifest");
  // TODO: cleanup this json quotes
  const manifestData = {
    "manifest_version": 2,
    "name": "ArcFox",
    "version": "2.4.5",
    "description": "Make firefox flow like arc.",
    "icons": {
      "16": "icon.png",
      "48": "icon.png",
      "98": "icon.png"
    },
    "permissions": [
      "activeTab",
      "bookmarks",
      "tabs",
      "search",
      "theme"
    ],
    "background": {
      "scripts": ["bundle/background.js"]
    },
    "browser_action": {
      "default_title": "ArcFox",
      "default_icon": {
        "48": "icon.png"
      }
    },
    "commands": {
      "open-sidebar": {
        "suggested_key": {
          "default": "Alt+Q"
        },
        "description": "Open the extension sidebar"
      }
    },
    "sidebar_action": {
      "default_panel": "bundle/arcfox/index.html",
      "default_icon": {
        "48": "icon.png"
      }
    }
  };
  await fs.writeFile("./dist/manifest.json", JSON.stringify(manifestData));
})();



