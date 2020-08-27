const client = require('discord-rich-presence')('748536274452873327')
const { F1TelemetryClient, constants } = require('f1-2020-client')
const { app, BrowserWindow } = require('electron')

const {PACKETS} = constants

const Tracks = require('./config/tracks.json')
const Session = require('./config/SessionTypes.json')
const CarType = require('./config/Cars.json')

const f1Client = new F1TelemetryClient()

let date = Date.now()
let interval

f1Client.start()

resetStatus = () => {
    client.updatePresence({
        state: "In the paddock",
        largeImageKey: "f12020"
    })
}

f1Client.on(PACKETS.session, (data) => {
    if(interval) {
        clearInterval(interval)
    }

    client.updatePresence({
        details: `${Session[data.m_sessionType].Type} at ${Tracks[data.m_trackId].Name}`,
        state: `${CarType[data.m_formula].CarType}`,
        largeImageKey: "f12020",
        startTimestamp: date
    })
    console.log(data)
    interval = setInterval(() => {
        resetStatus()
    }, 5000);
})

client.updatePresence({
    state: "In the paddock",
    largeImageKey: "f12020",
    startTimestamp: date
})

//Electron
function createWindow () {
  // Crea la finestra del browser
  const win = new BrowserWindow({
    width: 300,
    height: 150,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true,
    icon: "./assets/icons/win/icon.ico"
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)