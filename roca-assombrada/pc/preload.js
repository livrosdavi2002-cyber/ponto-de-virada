const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("PC", { sair: () => ipcRenderer.send("sair"), telaCheia: () => ipcRenderer.send("tela-cheia") });
