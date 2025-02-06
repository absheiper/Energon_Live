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

;

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
    BUI.insertAdjacentHTML( "beforeend", `
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
    tables.push(new VISUAL_TABLE("datatable"+counter,el));
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