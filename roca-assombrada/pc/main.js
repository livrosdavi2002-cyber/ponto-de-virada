// Roça Assombrada para computador (Windows/Linux, pronto para a Steam)
const { app, BrowserWindow, ipcMain, Menu, session } = require("electron");
const path = require("path");

Menu.setApplicationMenu(null);
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

function abrir() {
  const win = new BrowserWindow({
    width: 1280, height: 720, minWidth: 960, minHeight: 540, fullscreen: true, backgroundColor: "#06070a",
    title: "Roça Assombrada", icon: path.join(__dirname, "icone.png"), autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  // só abre o próprio jogo; links externos não abrem dentro dele
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", e => e.preventDefault());
  win.webContents.on("before-input-event", (e, i) => {
    if (i.type !== "keyDown") return;
    if (i.key === "F11" || (i.alt && i.key === "Enter")) { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.loadFile(path.join(__dirname, "www", "index.html"));
}
ipcMain.on("sair", () => app.quit());
ipcMain.on("tela-cheia", e => { const w = BrowserWindow.fromWebContents(e.sender); if (w) w.setFullScreen(!w.isFullScreen()); });
app.whenReady().then(() => {
  // nada de pedir câmera/microfone: o jogo não usa
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(false));
  abrir();
});
app.on("window-all-closed", () => app.quit());
