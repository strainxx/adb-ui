const { ipcRenderer } = require('electron')

function closepls(info){
    alert(info)
    ipcRenderer.send('closepls')
}