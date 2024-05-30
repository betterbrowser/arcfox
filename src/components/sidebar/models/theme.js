function setSidebarStyle(theme) {
    // Selecionando todos os elementos com a classe "tab"
    const tabs = document.querySelectorAll('.tab');
    const spacename = document.getElementById("space-name");
    const newtab = document.getElementById("new-tab");
    const search = document.getElementById("search");
    const urlbar = document.getElementById("search-bar");
  
    if (theme.colors && theme.colors.frame) {
        document.body.style.backgroundColor = theme.colors.frame;
    } else {
        document.body.style.backgroundColor = "white";
    }

    document.documentElement.style.setProperty('--hover-color', theme.colors.toolbar);

    // Verificando se a cor do toolbar está definida no tema
    if (theme.colors && theme.colors.toolbar) {
        search.style.backgroundColor = theme.colors.toolbar;
        urlbar.style.color = theme.colors.tab_text;
        spacename.style.color = theme.colors.tab_text;
        newtab.style.backgroundColor = "transparent";
        newtab.style.color = theme.colors.tab_text;
        // Iterando sobre todos os elementos "tabs" para aplicar a cor do toolbar
        tabs.forEach(tab => {
            tab.style.backgroundColor = "transparent";

            // Checking if the tab is active and applying the theme's selected tab color
            if (tab.classList.contains('active')) {
                tab.style.backgroundColor = theme.colors.tab_selected;
                // Setting the text color for the active tab
                tab.style.color = theme.colors.tab_text;
            } else {
                // Setting the text color for inactive tabs
                tab.style.color = theme.colors.tab_background_text;
            }
        });
    } else {
        // Caso a cor do toolbar não esteja definida, defina o fundo vermelho para indicar um problema
        document.body.style.backgroundColor = "red";
    }

    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('tab-hover');
            }
        });

        tab.addEventListener('mouseleave', function() {
            this.classList.remove('tab-hover');
        });
    });
}
  
// Definindo o estilo do elemento quando a página da extensão é carregada
async function setInitialStyle() {
    const theme = await browser.theme.getCurrent();
    setSidebarStyle(theme);
}
setInitialStyle();
  
// Observando por atualizações de tema
browser.theme.onUpdated.addListener(async ({ theme, windowId }) => {
    const sidebarWindow = await browser.windows.getCurrent();
    /*
        Somente atualiza o tema se ele se aplicar à janela em que a barra lateral está.
        Se um windowId for passado durante uma atualização, significa que o tema é aplicado a essa janela específica.
        Caso contrário, o tema é aplicado globalmente a todas as janelas.
    */
    if (!windowId || windowId == sidebarWindow.id) {
        setSidebarStyle(theme);
    }
});

// Listen for the tab activation event
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    // Get the current theme
    const theme = await browser.theme.getCurrent();
    // Update the sidebar style with the current theme
    setSidebarStyle(theme);
});

// Update every second
//setInterval(async () => {
//    const theme = await browser.theme.getCurrent();
//    setSidebarStyle(theme);
//}, 1000);