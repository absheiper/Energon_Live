class VISUAL_TABLE
{
    constructor(_TABLE, _DATA_PACK)
    {
        this.TABLE = document.getElementById(_TABLE);
        this.DATA_PACK = _DATA_PACK;
        this.arrayVALUESTEXT = new Array();
        this.PRINT_TABLE()
    }
    // *****************************************************************************
    // *****************************************************************************
    // *****************************************************************************
    DELET_ROWS()
    {
        var rows_arr = this.TABLE.getElementsByTagName("tr"); // все строки таблицы
        var i = rows_arr.length;			
        this.arrayVALUESTEXT = new Array();
        while (i!=1) 
        { 
            i--;	
            this.TABLE.deleteRow(i);									
        }
    }
    GET_VALUES_FROM_TABLE(){
        for (let i = 0; i < this.DATA_PACK.VALUES.length; i++){
            this.DATA_PACK.VALUES[i].SET_IN_TEXT(this.arrayVALUESTEXT[i].value);
        }
    }
    // *****************************************************************************
    // *****************************************************************************
    // *****************************************************************************
    PRINT_TABLE()
    {
        this.DELET_ROWS()
        for (let i = 0; i < this.DATA_PACK.VALUES.length; i++){
            let item = document.createElement('tr');
            let tdName = document.createElement('td');
            let tdValue = document.createElement('td');
            //let tdNewValue = document.createElement('td');
            let elInput = document.createElement('input')
            tdValue.appendChild(elInput);
            tdName.innerHTML= this.DATA_PACK.VALUES[i].NAME;
            elInput.value = this.DATA_PACK.VALUES[i].GET_IN_TEXT();
            this.arrayVALUESTEXT.push(elInput);
            item.appendChild(tdName);
            item.appendChild(tdValue);
            //item.appendChild(tdNewValue);
            this.TABLE.appendChild(item);
        }
    }
}

class VISUAL_TABLE_PROGRESS extends VISUAL_TABLE {
    constructor(_TABLE, _DATA_PACK) {
        super(_TABLE, _DATA_PACK);
    }

    PRINT_TABLE() {
        this.DELET_ROWS(); // Очистка существующих строк
        for (let i = 0; i < this.DATA_PACK.VALUES.length; i++) {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const progressCell = document.createElement('td');

            // Установка названия параметра
            nameCell.textContent = this.DATA_PACK.VALUES[i].NAME;

            nameCell.style.cssText = `
                width: 130px;
            `;

            // Создание контейнера для прогресс-бара
            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `
                width: 100%;
                height: 20px;
                background: #eee;
                border-radius: 0px;
                overflow: hidden;
                position: relative;
            `;

            // Создание полоски прогресса
            const progressBar = document.createElement('div');
            const value = parseFloat(this.DATA_PACK.VALUES[i].GET_IN_TEXT());
            const VAL_PROG = value * (100 / 5000);
            
            progressBar.style.cssText = `
                width: ${VAL_PROG}%;
                height: 100%;
                background: #4CAF50;
                transition: width 0.3s ease;
                position: relative;
            `;

            // Добавление текста с значением
            const progressText = document.createElement('span');
            progressText.textContent = `${value}`; // Отображаем значение
            progressText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #000;
                font-size: 12px;
                font-weight: bold;
            `;

            // Сборка элементов
            progressBar.appendChild(progressText); // Добавляем текст внутрь прогресс-бара
            progressContainer.appendChild(progressBar);
            progressCell.appendChild(progressContainer);
            row.appendChild(nameCell);
            row.appendChild(progressCell);
            this.TABLE.appendChild(row);
        }
    }
}

// Проверяем поддержку Web Serial API
if (!("serial" in navigator)) {
    alert("Ваш браузер не поддерживает Web Serial API.");
    throw new Error("Web Serial API не поддерживается.");
}

if (window.File && window.FileReader && window.FileList && window.Blob) 
{
    // Работает
}
else 
{
    alert('File API не поддерживается данным браузером');
}

async function saveWORK_FILE(Name, byte_array) {
    const opts = 
    {
        startIn: 'desktop',
        suggestedName: Name,//document.baseURI,
        types: [
        {
            description: "bin Document",
            accept: { "bin/plain": [".bin"] },
        },
        ],
    };
    let newHandle_SAVER = await window.showSaveFilePicker(opts);                 // create a new handle
    const writableStream = await newHandle_SAVER.createWritable();    // create a FileSystemWritableFileStream to write to
    await writableStream.write(byte_array);
    await writableStream.close();
}

async function loadWORK_FILE(ex_func) {
    const [fileHandle] = await window.showOpenFilePicker({
        startIn: 'desktop',
        //suggestedName: Name,//document.baseURI,
        types: [
            {
                description: "bin Document",
                accept: { "bin/plain": [".bin"] },
            },
            
        ],
        //multiple: false, 
    });

    const file = await fileHandle.getFile();
    const arrayBuffer = await file.arrayBuffer();
    ex_func.DATA_PACK.SET_IN_BYTE(Array.from(new Uint8Array(arrayBuffer)));
}

let tables = [];
let counter = 0;



function TABLE_UPDATE (event)
{
    tables.forEach(el => {
        if(el.DATA_PACK.NAME === event.detail) {
            el.PRINT_TABLE();
        }
    });
}




MCDH_device.data_base.forEach(el => {
    let cloumn_selector = BUI;
    switch (el.NAME)
    {
        case "VOLTAGES":
            cloumn_selector = col3;
            break;
        case "TEMPS":
            cloumn_selector = col3;
            break;
        case("ID_SET"):
            cloumn_selector = col1;
            break;
        default:
            cloumn_selector = col2;
            break;
    }

    cloumn_selector.insertAdjacentHTML( "beforeend", `
        <h1>${el.NAME}</h1>
        <table id="datatable${counter}" border="2">
            <th>Наименование</th>
            <th>Значение</th>
        </table>
        <button id="but_GET${counter}" data-counter="${counter}">GET</button>
        <button id="but_SET${counter}" data-counter="${counter}">SET</button>
        <button id="but_SAVE${counter}" data-counter="${counter}">SAVE</button>
        <button id="but_LOAD${counter}" data-counter="${counter}">LOAD</button>
    <hr><hr>`);
    if(el.NAME === "VOLTAGES")
    {
        tables.push(new VISUAL_TABLE_PROGRESS("datatable"+counter,el));
    }
    else if (el.NAME === "TEMPS")
    {
        tables.push(new VISUAL_TABLE_PROGRESS("datatable"+counter,el));
    }
    else{
        tables.push(new VISUAL_TABLE("datatable"+counter,el));
    }
    el.on('VAL_CHAN', TABLE_UPDATE);
    
    document.getElementById("but_GET"+counter).addEventListener('click', (event) => {
        const pos = event.target.getAttribute('data-counter');
        event.preventDefault();
        MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(),tables[pos].DATA_PACK.GET_VAL,[]);
    });
    document.getElementById("but_SET"+counter).addEventListener('click', (event) => {
        const pos = event.target.getAttribute('data-counter');
        event.preventDefault();
        tables[pos].GET_VALUES_FROM_TABLE();
        MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(),tables[pos].DATA_PACK.SET_VAL,tables[pos].DATA_PACK.GET_IN_BYTE());
    });
    document.getElementById("but_SAVE"+counter).addEventListener('click', (event) => {
        const pos = event.target.getAttribute('data-counter');
        event.preventDefault();
        saveWORK_FILE(tables[pos].DATA_PACK.NAME, tables[pos].DATA_PACK.GET_IN_BYTE());
    });
    document.getElementById("but_LOAD"+counter).addEventListener('click', (event) => {
        const pos = event.target.getAttribute('data-counter');
        event.preventDefault();
        loadWORK_FILE(tables[pos]);
        //MY_MCD.SEND_TO_DEV(tables[pos].DATA_PACK.GET_IN_BYTE(), tables[pos].DATA_PACK.SET_VAL, getId());
    });
    counter++;
});

/*
//
setInterval(function() 
{
    tables.forEach(el => {
        el.PRINT_TABLE();
    });
}, 1000);

*/