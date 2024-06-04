const { app, BrowserWindow, process, globalShortcut, ipcMain, screen } = require("electron");
const serve = require("electron-serve");
var os = require("os");
const path = require("path");
const { desktopCapturer } = require("electron");
const screenshot = require("screenshot-desktop");

async function captureScreen() {
  try {
    const imgPath = path.join(os.tmpdir(), "screenshot.png"); // Save in the OS's temporary directory
    await screenshot({ filename: imgPath });
    return imgPath; // Return the file path
  } catch (error) {
    console.error("Error capturing the screen: ", error);
    return null;
  }
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
  console.log("Received message: ", args);
  const imagePath = await captureScreen();
  const { spawn } = require("node:child_process");
  const childPython = spawn("python3", ["test.py", args, imagePath]); // send image context as an additional argument

  childPython.stdout.on("data", (data) => {
    console.log("Received data from python: ", data.toString());
    event.reply("receiveTokens", String(data));
  });

  childPython.stdout.on("end", (data) => {
    console.log("Finished executing python script");
    event.reply("endTokens");
    childPython.kill();
  });

  childPython.stderr.on("data", (data) => {
    console.error("Error from python: ", data.toString());
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
