const path = require('path');
const {app, BrowserWindow, Menu, clipboard, ipcMain, Tray, downloadURL, shell} = require('electron');
const fs = require('fs')
const settings = require('./settings.json')
const {download} = require("electron-dl");
const decompress = require("decompress");

let win;

function createWindow() {
    win = new BrowserWindow({
            width: 700,
            height: 500,
            frame: false,
            transparent: true,
            webPreferences:{
                nodeIntegration: true,
                contextIsolation: false
            },
            autoHideMenuBar: true,
            resizable: false,
            titleBarStyle: 'hidden',
            icon: __dirname + "/img/icon.png"
    });
    if(settings.firstRun){
        win.loadFile("installer.html");
    } else {
        win.loadFile("menu.html")
    }
    
    fs.writeFileSync("lastest.log", "App started \n")
    
    //win.webContents.openDevTools();

    const WM_INITMENU = 0x0116;
    const menu = Menu.buildFromTemplate([{
        label: "Electron JS context menu bug :("
    }]);
    win.hookWindowMessage(WM_INITMENU, () => {
        win.setEnabled(false);
        win.setEnabled(true);
        //menu.popup();
    });

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow)
let tray = null

app.whenReady().then(() => {
    if(!settings.tray){return false}
    tray = new Tray(__dirname + "/img/icon.png")
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Source Code', click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/strainxx')
            shell.beep()
        }},
        { label: 'split', type: 'separator' },
        { label: 'Installation', type: 'radio', checked: true },
        { label: 'Quit', click: async () => {
            app.quit()
        }}
    ])
    tray.setToolTip('ADB UI Tray')
    tray.setContextMenu(contextMenu)
})

ipcMain.on('closepls', () =>{
    //fs.writeFileSync('./settings.json', JSON.stringify(settings));
    app.quit()
})

ipcMain.on('checkInstalled', (event, arg) => {
    let adbExist = fs.existsSync('./platform_tools/adb.exe');
    event.returnValue = adbExist;
})

ipcMain.on("download", (event, info) => {
    download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
        .then(dl => event.returnValue = `Absolute path: ${dl.getSavePath()} <br> URL: ${info.url}<br>Succefully downloaded`)
});

ipcMain.on("unzip", (event, args) => {
    decompress(args, "./")
    .then((files) => {
        event.returnValue = `Unziped ${args}`
    })
    .catch((error) => {
        event.returnValue = error
    });
})

ipcMain.on("cmd", (event, args) => {
    shell.openExternal("cmd.exe")
})

console.log('Hello')