/* мой
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
            let elInput = document.createElement('textarea')            
            tdValue.appendChild(elInput);
            tdName.innerHTML= this.DATA_PACK.VALUES[i].NAME;
            elInput.value = this.DATA_PACK.VALUES[i].GET_IN_TEXT();
            elInput.style.cssText = `
            width: 97%;
            overflow: hidden;
            resize: none;
          `;            
            elInput.rows = elInput.value.split('\n').length;
            this.arrayVALUESTEXT.push(elInput);
            item.appendChild(tdName);
            item.appendChild(tdValue);
            //item.appendChild(tdNewValue);
            this.TABLE.appendChild(item);
        }
    }
}
*/
// Оптимизированный VISUAL_TABLE
class VISUAL_TABLE {
    constructor(_TABLE, _DATA_PACK) {
        this.TABLE = document.getElementById(_TABLE);
        this.DATA_PACK = _DATA_PACK;
        this.arrayVALUESTEXT = [];
        this.PRINT_TABLE();
    }

    DELET_ROWS() {
        while (this.TABLE.rows.length > 1) {
            this.TABLE.deleteRow(-1);
        }
        this.arrayVALUESTEXT = [];
    }

    GET_VALUES_FROM_TABLE() {
        this.DATA_PACK.VALUES.forEach((value, i) => {
            value.SET_IN_TEXT(this.arrayVALUESTEXT[i].value);
        });
    }

    PRINT_TABLE() {
        this.DELET_ROWS();
        this.DATA_PACK.VALUES.forEach((value) => {
            const row = document.createElement('tr');
            const [tdName, tdValue] = ['td', 'td'].map(() => document.createElement('td'));
            const input = document.createElement('textarea');
            
            input.value = value.GET_IN_TEXT();
            input.style.cssText = `
                width: 97%;
                overflow: hidden;
                resize: none;
                height: ${input.value.split('\n').length * 20}px;
            `;
            
            tdName.textContent = value.NAME;
            tdValue.appendChild(input);
            row.append(tdName, tdValue);
            this.TABLE.appendChild(row);
            this.arrayVALUESTEXT.push(input);
        });
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
            const value = parseFloat(this.DATA_PACK.VALUES[i].GET_IN_TEXT());
            
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
                text-align:center;
                position: relative;
            `;

            // Создание полоски прогресса
            const progressBar = document.createElement('div');
            const VAL_PROG = value * (100 / 5000);
            
            progressBar.style.cssText = `
                width: ${VAL_PROG}%;
                height: 100%;
                background:rgb(100, 201, 104);
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
            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText); // Добавляем текст внутрь прогресс-бара
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

function TABLE_UPDATE(event)
{
    VTH.tables.forEach(el => {
        if(el.DATA_PACK.NAME === event.detail) {
            el.PRINT_TABLE();
        }
    });
}
/* мой
class VISUAL_TABLE_HANDLER
{
    constructor()
    {
        this.tables = [];
        this.counter = 0;
    }
    ADD_TABLE(el)
    {
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
            <table id="datatable${VTH.counter}" border="2">
                <th>Наименование</th>
                <th>Значение</th>
            </table>
            <button id="but_GET${VTH.counter}" data-counter="${VTH.counter}">GET</button>
            <button id="but_SET${VTH.counter}" data-counter="${VTH.counter}">SET</button>
            <button id="but_SAVE${VTH.counter}" data-counter="${VTH.counter}">SAVE</button>
            <button id="but_LOAD${VTH.counter}" data-counter="${VTH.counter}">LOAD</button>
        <hr><hr>`);
        if(el.NAME === "VOLTAGES")
        {
            VTH.tables.push(new VISUAL_TABLE_PROGRESS("datatable"+VTH.counter,el));
        }
        else if (el.NAME === "TEMPS")
        {
            VTH.tables.push(new VISUAL_TABLE_PROGRESS("datatable"+VTH.counter,el));
        }
        else{
            VTH.tables.push(new VISUAL_TABLE("datatable"+VTH.counter,el));
        }
        el.on('VAL_CHAN', TABLE_UPDATE);
        
        document.getElementById("but_GET"+VTH.counter).addEventListener('click', (event) => {
            const pos = event.target.getAttribute('data-counter');
            event.preventDefault();
            MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(),VTH.tables[pos].DATA_PACK.GET_VAL,[]);
        });
        document.getElementById("but_SET"+VTH.counter).addEventListener('click', (event) => {
            const pos = event.target.getAttribute('data-counter');
            event.preventDefault();
            VTH.tables[pos].GET_VALUES_FROM_TABLE();
            MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(),VTH.tables[pos].DATA_PACK.SET_VAL,VTH.tables[pos].DATA_PACK.GET_IN_BYTE());
        });
        document.getElementById("but_SAVE"+VTH.counter).addEventListener('click', (event) => {
            const pos = event.target.getAttribute('data-counter');
            event.preventDefault();
            saveWORK_FILE(VTH.tables[pos].DATA_PACK.NAME, VTH.tables[pos].DATA_PACK.GET_IN_BYTE());
        });
        document.getElementById("but_LOAD"+VTH.counter).addEventListener('click', (event) => {
            const pos = event.target.getAttribute('data-counter');
            event.preventDefault();
            loadWORK_FILE(VTH.tables[pos]);
            //MY_MCD.SEND_TO_DEV(VTH.tables[pos].DATA_PACK.GET_IN_BYTE(), VTH.tables[pos].DATA_PACK.SET_VAL, getId());
        });
        VTH.counter++;
    }
    RemoveAllTables() {
        // Удаление обработчиков событий и элементов DOM для каждой таблицы
        this.tables.forEach(table => {
            const el = table.DATA_PACK;
            // Отписываемся от события VAL_CHAN
            if (el.off) {
                el.off('VAL_CHAN', TABLE_UPDATE);
            }
    
            const tableId = table.id;
            const counter = tableId.replace('datatable', '');
    
            // Удаляем заголовок h1
            const h1Elements = document.getElementsByTagName('h1');
            Array.from(h1Elements).forEach(h1 => {
                if (h1.textContent === el.NAME && h1.nextElementSibling?.id === tableId) {
                    h1.remove();
                }
            });
    
            // Удаляем таблицу
            const tableElement = document.getElementById(tableId);
            if (tableElement) tableElement.remove();
    
            // Удаляем кнопки
            ['GET', 'SET', 'SAVE', 'LOAD'].forEach(btnType => {
                const btnId = `but_${btnType}${counter}`;
                const btn = document.getElementById(btnId);
                if (btn) btn.remove();
            });
    
            // Удаляем разделители <hr>
            const loadButton = document.getElementById(`but_LOAD${counter}`);
            if (loadButton) {
                let hrCount = 0;
                let nextElement = loadButton.nextElementSibling;
                while (nextElement && hrCount < 2) {
                    if (nextElement.tagName === 'HR') {
                        nextElement.remove();
                        hrCount++;
                    } else {
                        break;
                    }
                    nextElement = loadButton.nextElementSibling;
                }
            }
        });
    
        // Очищаем массив таблиц и сбрасываем счетчик
        this.tables = [];
        this.counter = 0;
    }
}
*/

class VISUAL_TABLE_HANDLER {
    constructor() {
        this.tables = [];
        this.addedTables = []; // Хранит элементы и обработчики
        this.counter = 0;
    }

    ADD_TABLE(el) {
        const container = this.determineContainer(el.NAME);
        const tableId = `datatable${this.counter}`;
        const buttonIds = ['GET', 'SET', 'SAVE', 'LOAD'];
        
        // Создание элементов
        const h1 = document.createElement('h1');
        h1.textContent = el.NAME;

        const table = document.createElement('table');
        table.id = tableId;
        table.border = "2";
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['Наименование', 'Значение'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        const buttons = buttonIds.map(id => {
            const button = document.createElement('button');
            button.id = `but_${id}${this.counter}`;
            button.textContent = id;
            button.dataset.counter = this.counter;
            return button;
        });

        const hrElements = [document.createElement('hr'), document.createElement('hr')];

        // Добавление элементов в контейнер
        const elements = [h1, table, ...buttons, ...hrElements];
        elements.forEach(el => container.appendChild(el));

        // Обработчики событий
        const handlers = [];
        const handleButtonClick = (type) => (event) => {
            const pos = event.target.dataset.counter;
            const table = this.tables[pos];
            switch (type) {
                case 'GET':
                    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), table.DATA_PACK.GET_VAL, []);
                    break;
                case 'SET':
                    table.GET_VALUES_FROM_TABLE();
                    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), table.DATA_PACK.SET_VAL, table.DATA_PACK.GET_IN_BYTE());
                    break;
                case 'SAVE':
                    saveWORK_FILE(table.DATA_PACK.NAME, table.DATA_PACK.GET_IN_BYTE());
                    break;
                case 'LOAD':
                    loadWORK_FILE(table);
                    break;
            }
        };

        buttons.forEach((button, i) => {
            const handler = handleButtonClick(buttonIds[i]);
            button.addEventListener('click', handler);
            handlers.push({ button, handler });
        });

        // Сохранение информации
        this.addedTables.push({
            elements,
            handlers: handlers.map(({ button, handler }) => ({
                element: button,
                type: 'click',
                handler
            }))
        });

        // Создание экземпляра таблицы
        const tableClass = ['VOLTAGES', 'TEMPS'].includes(el.NAME) 
            ? VISUAL_TABLE_PROGRESS 
            : VISUAL_TABLE;
        const tableInstance = new tableClass(tableId, el);
        this.tables.push(tableInstance);
        el.on('VAL_CHAN', TABLE_UPDATE);

        this.counter++;
    }

    determineContainer(name) {
        switch (name) {
            case "VOLTAGES":
                return col3;
            case "TEMPS":
                return col3;
            case "ID_SET":
                return col1;
            case "CELL_STATE":
                return col3;
            case "BMU_STATE":
                return col3;
            case "HARD_ID":
                return col1;
            case "BAT_INFO":
                return col3;
            default:
                return col2;
        }
    }

    CLEAR_ALL_TABLES() {
        this.addedTables.forEach(({ elements, handlers }) => {
            handlers.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
            elements.forEach(el => el.remove());
        });
        this.addedTables = [];
        this.tables = [];
        this.counter = 0;
    }
}

/*
class VISUAL_TABLE_HANDLER {
    constructor() {
        this.tables = [];
        this.addedTables = [];
        this.counter = 0;
    }

    ADD_TABLE(el) { // Исправлено: было ADD_TABLE
        const container = this.determineContainer(el.NAME);
        const groupId = `table-group-${this.counter}`;
        const elements = [];

        // Создаем группу для управления видимостью
        const group = document.createElement('div');
        group.id = groupId;
        
        // Заголовок
        const h1 = document.createElement('h1');
        h1.textContent = el.NAME;
        h1.style.cursor = "pointer";
        elements.push(h1);

        // Таблица
        const table = document.createElement('table');
        table.id = `datatable${this.counter}`;
        table.border = "2";
        table.innerHTML = `
            <thead><tr>
                <th>Наименование</th>
                <th>Значение</th>
            </tr></thead>
        `;
        elements.push(table);

        // Кнопки
        const buttons = ['GET', 'SET', 'SAVE', 'LOAD'].map(type => {
            const btn = document.createElement('button');
            btn.id = `but_${type}${this.counter}`;
            btn.textContent = type;
            btn.dataset.counter = this.counter;
            return btn;
        });
        elements.push(...buttons);

        // Разделители
        elements.push(document.createElement('hr'), document.createElement('hr'));

        // Добавляем элементы в группу и контейнер
        elements.forEach(el => group.appendChild(el));
        container.appendChild(group);

        // Обработчик сворачивания
        h1.addEventListener('click', () => {
            const isHidden = group.style.display === "none";
            group.style.display = isHidden ? "" : "none";
        });

        // Сохраняем ссылки для очистки
        this.addedTables.push({
            group,
            handlers: buttons.map(btn => ({
                element: btn,
                type: 'click',
                handler: this.createButtonHandler(btn.id.split('but_')[1])
            }))
        });

        // Инициализация таблицы (ваш существующий код)
        let tableInstance;
        if (['VOLTAGES', 'TEMPS'].includes(el.NAME)) {
            tableInstance = new VISUAL_TABLE_PROGRESS(table.id, el);
        } else {
            tableInstance = new VISUAL_TABLE(table.id, el);
        }
        this.tables.push(tableInstance);
        el.on('VAL_CHAN', TABLE_UPDATE);

        this.counter++;
    }

    createButtonHandler(type) {
        return (e) => {
            const pos = e.target.dataset.counter;
            const table = this.tables[pos];
            switch(type) {
                case 'GET': 
                    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), table.DATA_PACK.GET_VAL, []);
                    break;
                case 'SET':
                    table.GET_VALUES_FROM_TABLE();
                    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), table.DATA_PACK.SET_VAL, table.DATA_PACK.GET_IN_BYTE());
                    break;
                case 'SAVE':
                    saveWORK_FILE(table.DATA_PACK.NAME, table.DATA_PACK.GET_IN_BYTE());
                    break;
                case 'LOAD':
                    loadWORK_FILE(table);
                    break;
            }
        };
    }

    CLEAR_ALL_TABLES() {
        this.addedTables.forEach(({ group, handlers }) => {
            handlers.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
            group.remove();
        });
        this.addedTables = [];
        this.tables = [];
        this.counter = 0;
    }

    determineContainer(name) {
        // Ваша существующая логика
    }
}
*/
const VTH = new VISUAL_TABLE_HANDLER();

/*
//
setInterval(function() 
{
    tables.forEach(el => {
        el.PRINT_TABLE();
    });
}, 1000);

*/