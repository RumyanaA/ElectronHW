/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const os = require('os');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
};
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
ipcMain.on('sendMail', (event, args) => {
  function sendMail() {
    const transporter = nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: 'test.testmail22@yahoo.com',
        pass: 'xydrjwrtmyedsdoe',
      },
    });
    transporter.sendMail({
      from: 'test.testmail22@yahoo.com',
      to: args[0],
      subject: 'Hello ✔',
      text: args[1],
      html: `<b>${args[1]}</b>`,
    });
  }
  sendMail();
});
ipcMain.on('writeFile', (event, args) => {
  fs.appendFile('./config/Output.txt', args[0] + os.EOL, 'UTF-8', { flags: 'a+' });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
