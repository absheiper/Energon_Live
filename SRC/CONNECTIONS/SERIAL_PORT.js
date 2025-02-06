// Проверяем поддержку Web Serial API
if (!("serial" in navigator)) {
    alert("Ваш браузер не поддерживает Web Serial API.");
    throw new Error("Web Serial API не поддерживается.");
}

BUI.insertAdjacentHTML( "beforeend", `
    <h1>COM CONNECTION</h1>
    <div>
<form id="com-port-form">
<div class="form-group">
    <label for="port">COM Port</label>
    <select id="port" name="port"></select>
</div>
<div class="form-group">
    <label for="baudrate">Baud Rate</label>
    <select id="baudrate" name="baudrate">
        <option value="9600">9600</option>
        <option value="19200">19200</option>
        <option value="38400">38400</option>
        <option value="57600">57600</option>
        <option value="115200" selected>115200</option>
    </select>
</div>
<div class="form-group">
    <label for="parity">Parity</label>
    <select id="parity" name="parity">
        <option value="none" selected>None</option>
        <option value="even">Even</option>
        <option value="odd">Odd</option>
    </select>
</div>
<div class="form-group">
    <label for="databits">Data Bits</label>
    <select id="databits" name="databits">
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8" selected>8</option>
    </select>
</div>
<div class="form-group">
    <label for="stopbits">Stop Bits</label>
    <select id="stopbits" name="stopbits">
        <option value="1" selected>1</option>
        <option value="1.5">1.5</option>
        <option value="2">2</option>
    </select>
<button id="ComConn">Connect</button>
</div>
<hr><hr>
    `);
const portV = document.getElementById("port");
const connect_button = document.getElementById("ComConn");
const { SerialPort } = require('serialport');



let serialPort = null;
let handlers = null;

async function listSerialPorts() {
    await SerialPort.list().then((ports, err) => {
        if(err) {
        console.log(err.message);
        return
        }
        console.log('ports', ports);
        portV.innerHTML = "";
        for(let i = 0; i < ports.length; i++) {
        portV.innerHTML += `<option value="${ports[i].path}">${ports[i].path}</option>`;
        }
    })
    }
    

async function writeToSerialPort(byteArray) {
    try {
        // Преобразуем массив байт в Buffer
        const buffer = Buffer.from(byteArray);

        // Записываем данные в порт
        serialPort.write(buffer, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
            } 
        });
    } catch (err) {
        console.error('Failed to write to serial port:', err);
    }
}

portV.addEventListener("mousedown", function() {
    listSerialPorts();
});

function Connected() {
    connect_button.textContent = "Disconnect";
}
function Disconnected() {
    connect_button.textContent = "Connect";
    MY_MCD.off('DATA_SEND', handlers);
    //serialPort = null;
}





async function connectSerialPort() {
try {
    // Создаем экземпляр SerialPort
    MY_MCD.off('DATA_SEND', handlers);
    serialPort = new SerialPort({
        path: portV.value,
        baudRate: parseInt(document.getElementById("baudrate").value, 10),
        parity: document.getElementById("parity").value,
        dataBits: parseInt(document.getElementById("databits").value, 10),
        stopBits: parseFloat(document.getElementById("stopbits").value)
    });

    // Устанавливаем событие для чтения данных
    serialPort.on('data', (data) => {
        //console.log('Data received:', data);
        MY_MCD.ADD_NEW_DATA_BYTE(data);
    });

    // Обработка ошибок
    serialPort.on('error', (err) => {
        console.error('Error occurred:', err);
        Disconnected();
    });

    // Если соединение успешно
    serialPort.on('open', () => {
        console.log(`Connected to ${serialPort.path} at ${serialPort.baudRate} baud rate`);
        handlers = (event) => writeToSerialPort(event.detail);
        MY_MCD.on('DATA_SEND', handlers);
        Connected();
    });

    serialPort.on('close', () => {
        console.log(`Disconnected from port ${serialPort.path}`);
        Disconnected();
    });
} catch (err) {
    console.error('Failed to connect to serial port:', err);
}
}

connect_button.addEventListener('click', function (event) {
    event.preventDefault();
    if(serialPort == null) {
        connectSerialPort();
    }
    else {
        if(serialPort.isOpen) {
            serialPort.close();
            return;
        }
        else {
            connectSerialPort();
        }
    }
    
});