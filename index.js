const path = require('path');
const {app, BrowserWindow, Menu, clipboard, ipcMain, Tray} = require('electron');
const fs = require('fs')
const settings = require('./settings.json')

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
    win.loadFile("installer.html");
    
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
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
    tray.setToolTip('ADB UI Tray')
    tray.setContextMenu(contextMenu)
})

ipcMain.on('closepls', () =>{
    app.quit()
})

console.log('Hello')