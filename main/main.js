const {
  app,
  BrowserWindow,
  process,
  globalShortcut,
  ipcMain,
  screen,
} = require("electron");
const serve = require("electron-serve");
var os = require("os");
const path = require("path");
const { desktopCapturer } = require('electron');
const screenshot = require('screenshot-desktop');

async function captureScreen() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  return sources[0].thumbnail.toDataURL(); // returns image as dataURL
}

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: 360,
    height: 500,
    x: 0,
    y: height, // Set y position to height - window height for bottom
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    //win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", async () => {
  createWindow();
  isWindowOpen = true;
});

app.on("ready", () => {
  globalShortcut.register("Alt+X", () => {
    if (isWindowOpen) {
      BrowserWindow.getFocusedWindow().close();
      isWindowOpen = false;
    } else {
      createWindow();
      isWindowOpen = true;
    }
  });
});

app.on("window-all-closed", () => {
  if (process?.platform !== "darwin") {
    // app.quit();
  }
});

ipcMain.on("sendChat", async (event, args) => {
    const screenImage = await captureScreen();
    const { spawn } = require("node:child_process");
    const childPython = spawn("python3", ["test.py", args, screenImage]); // send image context as an additional argument

    childPython.stdout.on("data", (data) => {
        event.reply("receiveTokens", String(data));
    });

    childPython.stdout.on("end", (data) => {
        event.reply("endTokens");
        childPython.kill();
    });
});
ipcMain.on("getCpuUsage", (event, args) => {
  const result = {
    cpus: os.cpus(),
    total_mem: os.totalmem(),
    free_mem: os.freemem(),
    used_mem: os.totalmem() - os.freemem(),
    cpu_usage: (os.loadavg()[0] / os.cpus().length) * 100,
  };
  event.reply("receiveCpuUsage", JSON.stringify(result));
});


/*
Idea:

Every time we launch an m
*/