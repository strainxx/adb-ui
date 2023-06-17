const { ipcRenderer } = require('electron');
const settings = require('./settings.json');
const fs = require('fs');
const path = require('path');

let log = "Install log:";
const date = new Date

function checkInstalled(){
    let result = ipcRenderer.sendSync('checkInstalled');
    if(!result){
        alert("ADB not installed.")
        document.getElementById("inslabel").style.visibility = "visible";
        let dowloadRes = ipcRenderer.sendSync("download", 
        {
            url: "https://dl.google.com/android/repository/platform-tools-latest-windows.zip",
            properties: {
                directory: __dirname,
                filename: "adb.zip"
            }
        });
        log += `<br>${dowloadRes}`
        document.getElementById("inslabel").innerHTML = log
        let unzipRes = ipcRenderer.sendSync("unzip", "adb.zip")
        log += `<br>Unzip log: ${unzipRes}<br>Deleting adb.zip<br>Saving log<br>`
        document.getElementById("inslabel").innerHTML = log
        fs.unlinkSync("adb.zip")
        setTimeout(() => {
            settings.firstRun = false;
            fs.writeFileSync('./settings.json', JSON.stringify(settings));
            document.getElementById("inslabel").innerHTML += `First run now is false`
            location.href = "menu.html"
        }, 3000);
        fs.appendFileSync("lastest.log", log.replaceAll("<br>", `\n`))
        
    } else {
        settings.firstRun = false;
        location.href = "menu.html"
    }
}

function closepls(info){
    alert(info);
    ipcRenderer.send('closepls');
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }