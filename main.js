const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { autoUpdater } = require("electron-updater");
//const log = require("electron-log");
const path = require('path')
const url = require('url')
let mainWindow;

// Логирование в файл (по умолчанию сохраняется в %appdata%/your-app/logs/)
//log.transports.file.level = "info";
//autoUpdater.logger = log;

// Проверка обновлений при старте
app.whenReady().then(() => {
  checkForUpdates();
});
// 🔹 Функция проверки обновлений
function checkForUpdates() {
  autoUpdater.autoDownload = false; // Спрашиваем перед скачиванием
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBox(mainWindow, {
      type: "info",
      title: "Обновление",
      message: "Вы используете актуальную версию приложения!",
      buttons: ["Окей"],
    });
  });

  autoUpdater.on("update-available", (info) => {
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "Обновление найдено",
        message: `Доступна новая версия: ${info.version}. Хотите скачать?`,
        buttons: ["Да", "Нет"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "Обновление загружено",
        message: "Обновление скачано. Перезапустить приложение?",
        buttons: ["Перезапустить", "Позже"],
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.on("error", (err) => {
    dialog.showErrorBox("Ошибка обновления", err.message || "Неизвестная ошибка");
  });
}


// 🔹 Функция создания меню
function createMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        { label: "Выход", role: "quit" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Проверить обновления",
          click: () => {
            checkForUpdates();
          },
        },
        { type: "separator" },
        { label: "О программе", role: "about" },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}


// Функция для создания главного окна
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,  // Безопасность
      contextIsolation: false, // Окружение изолировано
      preload: path.join(__dirname, 'preload.js')
      }
  });
  mainWindow.webContents.openDevTools()
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
  }))
  mainWindow.on('closed', function() {
    mainWindow = null
  })
  // Проверяем обновления при старте
  checkForUpdates();
  createMenu();
  //autoUpdater.checkForUpdatesAndNotify(); // Проверка обновлений при запуске
}
app.on('ready', createWindow)
app.on('window-all-closed', function() {
  app.quit()
})

app.on('activate', function() {
  if (mainWindow === null) {
      createWindow()
  }
})


