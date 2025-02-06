BUI.insertAdjacentHTML( "beforeend", `
    <h1>FIRM UPDATE</h1>
    <div>
        <label for="firm_file_name">Firm File Name:</label>
        <input type="text" id="firm_file_name" value="0x00000000">
        <button id="but_LOAD_FIRM">LOAD_FIRM_FILE</button>
    </div>
    <div>
    <button id="but_WRITE_FIRMWARE">WRITE_FIRMWARE</button>
    <button id="but_JUMP_TO_USER_CODE">JUMP_TO_USER_CODE</button>
    <button id="but_REFRESH_MAIN_CODE">REFRESH_MAIN_CODE</button>
    <button id="but_REFRESH_BOOT_CODE">REFRESH_BOOT_CODE</button>
    <button id="but_REFRESH_TMP_CODE">REFRESH_TMP_CODE</button>
    <button id="but_TRY_TO_UPDATE">TRY_TO_UPDATE</button>
    <button id="but_ERAZE_TMP_CODE">ERAZE_TMP_CODE</button>
    <button id="but_TRY_UPDATE_BOOTLOADER">TRY_UPDATE_BOOTLOADER</button>
    <button id="but_RESTART">RESTART</button>
    </div>
    <h2>Прогресс-бар</h2>
    <div id="progress-container">
        <div id="FIRM_progress-bar">0%</div>
    </div>
    <br>
    <hr><hr>
        `);
        
const TB_FIRM_FILE_NAME = document.getElementById("firm_file_name");
const FIRM_progress_bar = document.getElementById("FIRM_progress-bar");
const WRITE_FIRMWARE = 0x20;
const FIRMWIRE_MESS = 0x25;
const FIRM_BLOCK_SIZE = 0x100;
//const FIRMWARE_JUMP_TO_USER_CODE = 0x21;
//const FIRMWARE_REFRESH_MAIN_CODE = 0x22;
//const FIRMWARE_REFRESH_BOOT_CODE = 0x28;
//const FIRMWARE_REFRESH_TMP_CODE = 0x23;
//const FIRMWARE_TRY_TO_UPDATE = 0x24;
//const FIRMWARE_ERAZE_TMP_CODE = 0x26;
//const FIRMWARE_TRY_UPDATE_BOOTLOADER = 0x27;

let FIRM_ARRAY_BUFER;
let FIRM_OFFSET = 0;
FIRM_SET_PORGERSS(0);

async function FIRM_LOAD_FILE() {
    const [fileHandle] = await window.showOpenFilePicker({
        startIn: 'desktop',
        types: [
            {
                description: "bin Document",
                accept: { "bin/plain": [".bin"] },
            },
        ],
    });
    const file = await fileHandle.getFile();
    FIRM_ARRAY_BUFER = await file.arrayBuffer();
    TB_FIRM_FILE_NAME.value = file.name;
}


document.getElementById("but_LOAD_FIRM").addEventListener('click', (event) => {
    event.preventDefault();
    FIRM_LOAD_FILE();
});
document.getElementById("but_WRITE_FIRMWARE").addEventListener('click', (event) => {
    event.preventDefault();
    if(FIRM_ARRAY_BUFER == undefined) {
        alert("Не загружен файл прошивки!");
        return;
    }
    FIRM_OFFSET = 0;
    FIRM_SET_PORGERSS(0);
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), FIRMWIRE_MESS, []);
});
document.getElementById("but_JUMP_TO_USER_CODE").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x21, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x21, getId());
});

document.getElementById("but_REFRESH_MAIN_CODE").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x22, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x22, getId());    
});
document.getElementById("but_REFRESH_BOOT_CODE").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x28, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x28, getId());
});

document.getElementById("but_REFRESH_TMP_CODE").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x23, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x23, getId());
});

document.getElementById("but_TRY_TO_UPDATE").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x24, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x24, getId());
});

document.getElementById("but_ERAZE_TMP_CODE").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x26, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x26, getId());
});

document.getElementById("but_TRY_UPDATE_BOOTLOADER").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x27, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x27, getId());
});
document.getElementById("but_RESTART").addEventListener('click', (event) => {
    event.preventDefault();
    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), 0x10, []);
    //MY_MCD.SEND_TO_DEV([0,0], 0x27, getId());
});
function FIRM_SET_PORGERSS(value){
    value = Math.round(value);
    FIRM_progress_bar.style.width = value + "%";
    FIRM_progress_bar.innerText = value + "%";
}


 
MY_MCD.on("DATA_COME", (event) => {
    //console.log("MCD CMD: ", event.detail.command,"MCD ADR: ", event.detail.address,"MCD LEN: ", event.detail._data_array.length);
    if(event.detail.COMMAND == FIRMWIRE_MESS)
    {
        let count_send;
        if((FIRM_OFFSET + FIRM_BLOCK_SIZE) <= FIRM_ARRAY_BUFER.byteLength)
        {
            count_send = FIRM_BLOCK_SIZE;
        }
        else
        {
            count_send = FIRM_ARRAY_BUFER.byteLength - FIRM_OFFSET;
        }
        if(count_send == 0)
        {
            FIRM_OFFSET = 0;
            FIRM_SET_PORGERSS(100);
            FIRM_progress_bar.innerText = "Загрузка завершена";
            console.log("Send FIRMWARE END");
            return;
        }
        let buf = new Uint8Array(count_send + 8);
        buf.set(new Uint8Array(FIRM_ARRAY_BUFER, FIRM_OFFSET, count_send), 8);
        for (let i = 0; i < 4; i++){
            buf[i] = (FIRM_OFFSET >> 24 - (i * 8));
        }
        for (let i = 0; i < 4; i++){
            buf[i + 4] = (count_send >> 24 - (i * 8));
        }
        MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), WRITE_FIRMWARE, buf);
        //MY_MCD.SEND_TO_DEV(buf, WRITE_FIRMWARE, getId());
        FIRM_OFFSET += count_send;
        FIRM_SET_PORGERSS((FIRM_OFFSET * 100)/FIRM_ARRAY_BUFER.byteLength);
        console.log("Send FIRMWARE OFFSET: ", FIRM_OFFSET);

    }
})