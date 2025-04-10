class DATA_BASE
{
    
    constructor(_NAME, _TYPE, _LEN_IN_BYTE)
    {
        this.NAME = _NAME
        this.TYPE = _TYPE
        this.LEN_IN_BYTE = _LEN_IN_BYTE
        this.BYTE_value = new Uint8Array(this.LEN_IN_BYTE)
        this.flags2 = [
            [0x00000001, "АЦП, давно не отвечает."],
            [0x00000002, "Отвалился датчик на ячейку."],
            [0x00000004, "Количество ячеек не совпадает."],
            [0x00000008, "Критически высокое напряжение."],
            [0x00000010, "Критически низкое напряжение."],
            [0x00000020, "Конец заряда."],
            [0x00000040, "Конец разряда."],
            [0x00000080, "Предупреждение высокого напряжения."],
            [0x00000100, "Предупреждение низкое напряжение."],
            [0x00000200, "Критически высокая температура."],
            [0x00000400, "Критически низкая температура."],
            [0x00000800, "Высокая температура."],
            [0x00001000, "Низкая температура."],
            [0x00002000, "Предупреждение высокой температуры."],
            [0x00004000, "Предупреждение низкой температуры."],
            [0x00008000, "Отвалился датчик температуры."],
            [0x00010000, "Зарядный ток превышает порог прупреждение."],
            [0x00020000, "Зарядный ток превышает порог WARNING."],
            [0x00040000, "Зарядный ток превышает порог ALARM."],
            [0x00080000, "Разрядный ток превышает порог прупреждение."],
            [0x00100000, "Разрядный ток превышает порог WARNING."],
            [0x00200000, "Разрядный ток превышает порог ALARM."],
            [0x00400000, "Заряжается."],
            [0x00800000, "Разряжается."],
            [0x01000000, "Отрелаксирована."],
            [0x02000000, "Датчик тока отключен."],
            [0x04000000, "Модулей не то количество."],
            [0x08000000, "Стринг отключен."],
            [0x10000000, "GBMS отключен."],
            
        ];
    }
    
    SET_IN_BYTE(_data_array)
    {
        if(this.LEN_IN_BYTE != _data_array.length)
        {
            return
        }
        for(let i = 0; i < this.LEN_IN_BYTE; i++)
        {
            this.BYTE_value[i] = _data_array[i];
        }
    }
    GET_IN_BYTE()
    {
        return(this.BYTE_value)
    }
    GET_IN_TEXT()
    {
        let ret;
        
        switch(this.TYPE)
        {
            case "INT":
                /*
                ret = 0n;
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    ret += this.BYTE_value[i] << (((this.LEN_IN_BYTE - 1) - i) * 8)
                }
                    */
                ret = 0n;
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    ret = (ret << 8n) | BigInt(this.BYTE_value[i]);
                }
                if(this.BYTE_value[0] & 0x80)
                {
                    const bits = BigInt(this.BYTE_value.length * 8);
                    ret -= (1n << bits); 
                }
                return String(ret);
            case "UINT":
                ret = 0n;
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    ret = (ret << 8n) | BigInt(this.BYTE_value[i]);
                }
                return String(ret);
            case "HEX":
                ret = '0x';
                this.BYTE_value.map(byte => ret += byte.toString(16).padStart(2,'0').toUpperCase());
                return ret;
            case "BIN":
                ret = '0b';
                this.BYTE_value.map(byte => ret += byte.toString(2).padStart(8,'0').toUpperCase());
                return ret;
            case "ASCII":
                ret = '';
                this.BYTE_value.map(byte => ret += String.fromCharCode(byte));
                return ret;
            case "STATUS1":
                ret = 0;
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    ret += this.BYTE_value[i] << (((this.LEN_IN_BYTE - 1) - i) * 8)
                }
                const flags = [
                    [0x00000001, "Модуль АЦП в сети и отвечает.", "Отключился модуль АЦП, давно не отвечает."],
                    [0x00000002, "Датчики на ячейку на месте.", "Отвалился датчик на ячейку."],
                    [0x00000004, "Количество ячеек совпадает.", "Количество ячеек не совпадает."],
                    [0x00000008, "НЕ обнаружено критически высокое напряжение.", "Обнаружено критически высокое напряжение."],
                    [0x00000010, "НЕ обнаружено критически низкое напряжение.", "Обнаружено критически низкое напряжение."],
                    [0x00000020, "НЕ обнаружено конца заряда.", "Обнаружен конец заряда."],
                    [0x00000040, "НЕ обнаружено конца разряда.", "Обнаружен конец разряда."],
                    [0x00000080, "НЕТ предупрежения высокого напряжения.", "Предупреждение высокого напряжения."],
                    [0x00000100, "НЕТ предупрежения низкого напряжения.", "Предупреждение низкое напряжение."],
                    [0x00000200, "НЕ обнаружено критически высокой температуры.", "Обнаружена критически высокая температура."],
                    [0x00000400, "НЕ обнаружено критически низкой температуры.", "Обнаружена критически низкая температура."],
                    [0x00000800, "НЕ обнаружено высокой температуры.", "Обнаружена высокая температура."],
                    [0x00001000, "НЕ обнаружено низкой температуры.", "Обнаружена низкая температура."],
                    [0x00002000, "НЕТ предупреждения высокой температуры.", "Предупреждение высокой температуры."],
                    [0x00004000, "НЕТ предупреждение низкой температуры.", "Предупреждение низкой температуры."],
                    [0x00008000, "Датчики температуры на месте.", "Отвалился датчик температуры."],
                    [0x00010000, "Зарядный ток не превышает порог прупреждение.", "Зарядный ток превышает порог прупреждение."],
                    [0x00020000, "Зарядный ток не превышает порог WARNING.", "Зарядный ток превышает порог WARNING."],
                    [0x00040000, "Зарядный ток не превышает порог ALARM.", "Зарядный ток превышает порог ALARM."],
                    [0x00080000, "Разрядный ток не превышает порог прупреждение.", "Разрядный ток превышает порог прупреждение."],
                    [0x00100000, "Разрядный ток не превышает порог WARNING.", "Разрядный ток превышает порог WARNING."],
                    [0x00200000, "Разрядный ток не превышает порог ALARM.", "Разрядный ток превышает порог ALARM."],
                    [0x00400000, "НЕ заряжается.", "Заряжается."],
                    [0x00800000, "НЕ разряжается.", "Разряжается."],
                    [0x01000000, "НЕ отрелаксирована.", "Отрелаксирована."],
                    [0x02000000, "Датчик тока подключен.", "Датчик тока отключен."],
                    [0x04000000, "Модули все в работе.", "Модулей не то количество."],                    
                    [0x08000000, "Стринги все в работе.", "Стрингов не то количество"],                    
                    [0x10000000, "Поступают команды от GBMS", "Нет команд GBMS."],                    
                ];
                let res = "";
                for (const [bitmask, message0, message1] of flags) {
                    if (ret & bitmask) {
                        res += message1 + "\n";
                    } 
                }
                return res;
            case "STATUS2":
                ret = 0;
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    ret += this.BYTE_value[i] << (((this.LEN_IN_BYTE - 1) - i) * 8)
                }
                let res2 = "";
                for (const [bitmask, message] of this.flags2) {
                    const value = (ret & bitmask) ? 1 : 0;
                    res2 += `${message} : ${value}\n`;
                }
                return res2;
            case "CH_STATE":
                this.flagsCH = [
                    [0x01, "Читается единица"],
                    [0x02, "Назначена единица"],
                    [0x04, "Событие. Чтение единицы"],
                    [0x08, "Событие. Чтение нуля"],
                    [0x10, "Читается единица. Без фильтров."],
                    [0x20, "Событие. Записан ноль"],
                    [0x40, "Событие. Записана единица"],
                    [0x80, "Пытаемя назначить единицу"],
                ];
                let res3 = "";
                for (const [bitmask, message] of this.flagsCH) {
                    const value = (this.BYTE_value[0] & bitmask) ? 1 : 0;
                    res3 += `${message} : ${value}\n`;
                }
                return(res3);
            default:
                break;
        }
    }
    SET_IN_TEXT(_new_val)
    {
        switch(this.TYPE)
        {
            case "INT":
                let int_val = parseInt(_new_val, 10);
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    this.BYTE_value[i] = (int_val >> (((this.LEN_IN_BYTE - 1) - i) * 8))
                    
                }
                break;
            case "UINT":
                let uint_val = parseInt(_new_val, 10);
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    this.BYTE_value[i] = (uint_val >> (((this.LEN_IN_BYTE - 1) - i) * 8))
                }
                break;
            case "HEX":
                if (_new_val.startsWith("0x")) {
                    _new_val = _new_val.slice(2);
                }
                if (_new_val.length % 2 !== 0) { // Проверяем, что длина строки четная (иначе добавляем ведущий 0)
                    _new_val = "0" + _new_val;
                }
                let bytes = [];                    // Разбиваем строку на пары символов (байты) и конвертируем их в числа
                for (let i = 0; i < _new_val.length; i += 2) {
                    bytes.push(parseInt(_new_val.substr(i, 2), 16));
                }
                this.BYTE_value = new Uint8Array(bytes);
                break;
            case "STATUS2":
                // Создаем объект для быстрого поиска маски по тексту параметра
                const messageToBitmask = new Map();
                for (const [bitmask, message] of this.flags2) {
                    messageToBitmask.set(message.trim(), bitmask);
                }

                let ret = 0;
                const lines = _new_val.split('\n');

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue; // Пропускаем пустые строки

                    const [message, valueStr] = trimmedLine.split(' : ');
                    if (!message || !valueStr) continue; // Некорректный формат

                    const bitmask = messageToBitmask.get(message.trim());
                    const value = parseInt(valueStr.trim(), 10);

                    if (bitmask !== undefined && (value === 0 || value === 1)) {
                        if (value === 1) {
                            ret |= bitmask; // Устанавливаем бит, если значение 1
                        }
                        // Если 0, бит остается сброшенным (по умолчанию ret = 0)
                    }
                }
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    this.BYTE_value[i] = (ret >> (((this.LEN_IN_BYTE - 1) - i) * 8))
                }
                break;
            case "ASCII":
                let bytescii = [];
                for (let i = 0; i < _new_val.length; i++) {
                    bytescii.push(_new_val.charCodeAt(i));
                }
                this.BYTE_value = new Uint8Array(bytescii);
                break;
            default:
                break
        }
    }
}

class DATA_PACK
{
    constructor(_NAME, GET_VAL, SET_VAL)
    {
        this.NAME = _NAME;
        this.GET_VAL = GET_VAL;
        this.SET_VAL = SET_VAL;
        this.eventTarget = new EventTarget();
    }
    on(eventName, callback) {
        this.eventTarget.addEventListener(eventName, callback);
    }
    off(eventName, callback) {
        this.eventTarget.removeEventListener(eventName, callback);
    }
    VALUES = [];
    LEN_IN_BYTE()
    {
        var len = 0;
        for(let i = 0; i < this.VALUES.length; i++)
        {
            len += this.VALUES[i].LEN_IN_BYTE
        }
        return(len);
    }
    SET_IN_BYTE(_data_array)
    {
        let pos_st = 0;
        let pos_en = 0;
        if(this.LEN_IN_BYTE() != _data_array.length)
        {
            return;
        }
        for(let i = 0; i < this.VALUES.length; i++)
        {
            pos_en = pos_st + this.VALUES[i].LEN_IN_BYTE;
            this.VALUES[i].SET_IN_BYTE(_data_array.slice(pos_st, pos_en));
            pos_st = pos_en;
        }
        this.eventTarget.dispatchEvent(new CustomEvent("VAL_CHAN", { detail: this.NAME }));
    }
    GET_IN_BYTE()
    {
        var ndata = new Uint8Array(this.LEN_IN_BYTE())
        var counter = 0;
        for(let i = 0; i < this.VALUES.length; i++)
        {
            for(let j = 0; j < this.VALUES[i].LEN_IN_BYTE; j++)
            {
                ndata[counter] = this.VALUES[i].BYTE_value[j];
                counter++;
            }
        }
        return (ndata);
    }
}

class POINT
{
    constructor(_DEVICE, _WIRE){
        this.DEVICE = _DEVICE;
        this.WIRE = _WIRE;
    }
}
class MAPPING
{   
    constructor(){
        this.ARRAY_POINTS = new Array();
        this.FROM  = 0;
        this.VNP_NESTING_LEN = 0;
        this.VNP_POS = 0;
        this.VNP_VECTOR = false;
        this.TO = 0;
        this.POS = 0;
    }
    GET_VNUMPOS(){
        let VNP = 0;
        this.VNP_NESTING_LEN = this.ARRAY_POINTS.length;
        VNP += (this.VNP_NESTING_LEN << 4) & 0x70;
        VNP += this.POS;
        if(this.VNP_VECTOR){
            VNP += 0x80;
        }
        return(VNP);
    }
    SET_VNUMPOS(_VNUMPOS){
        this.VNP_NESTING_LEN = ((_VNUMPOS & 0x70) >> 4);
        this.POS = (_VNUMPOS & 0x07);
        if(_VNUMPOS & 0x80){
            this.VNP_VECTOR = true;
            }
        else{
            this.VNP_VECTOR = false;
        }
    }
    GET_IN_BYTE(){
        let buff = new Uint8Array(this.ARRAY_POINTS.length * 2 + 3);
        buff[0] = this.FROM;
        buff[1] = this.GET_VNUMPOS();
        let i;
        for(i = 0; i < this.ARRAY_POINTS.length; i++)
        {
            buff[2 + i * 2] = this.ARRAY_POINTS[i].DEVICE;
            buff[2 + i * 2 + 1] = this.ARRAY_POINTS[i].WIRE;
        }
        buff[2 + i * 2] = this.TO;
        return(buff);
    }
    SET_IN_BYTE(_array){
        this.FROM = _array[0];
        this.SET_VNUMPOS(_array[1]);
        this.ARRAY_POINTS = new Array();
        var i = 0;
        for(i = 0; i < this.VNP_NESTING_LEN; i++){
            this.ARRAY_POINTS.push(new POINT(_array[2 + i * 2], _array[2 + i * 2 + 1]))
        }
        this.TO = _array[2 + i * 2];
        return(2 + i * 2 + 1);
    }
}

class PACKET
{
    constructor(){
        this.MAP = new MAPPING();
        this.COMMAND = 0;
        this.COMMAND_VER = 0;
        this.PAYLOAD = [];
    }
    SET_BY_ARRAY(_array){
        let pos = this.MAP.SET_IN_BYTE(_array);
        this.COMMAND = _array[pos];
        pos++;
        this.COMMAND_VER = _array[pos];
        pos++;
        this.PAYLOAD = _array.slice(pos, _array.length);
    }
    ST_BY_PARAMETERS(_MAP, _COMMAND, _COMMAND_VER, _PAYLOAD){
        this.MAP = _MAP;
        this.COMMAND = _COMMAND;
        this.COMMAND_VER = _COMMAND_VER;
        this.PAYLOAD = _PAYLOAD;
    }
    CONVER_TO_ARRAY(){
        let _arr = this.MAP.GET_IN_BYTE();
        let len = _arr.length + 2;
        if(this.PAYLOAD != undefined){
            len += this.PAYLOAD.length
        }
        let ret = new Uint8Array(len);
        ret.set(_arr, 0);
        ret[_arr.length] = this.COMMAND;
        ret[_arr.length+1] = this.COMMAND_VER;
        if(this.PAYLOAD != undefined){
            ret.set(this.PAYLOAD, _arr.length+2);
        }
        return(ret);
    }
}

class MCD
{
    constructor()
    {
        this.MCD_START_BYTE = 0x17;
        this.MCD_MIN_LEN = 10;
        this.INCOME_BUFFER = [];
        this.eventTarget = new EventTarget();
    }
    on(eventName, callback) {
        this.eventTarget.addEventListener(eventName, callback);
    }
    off(eventName, callback) {
        this.eventTarget.removeEventListener(eventName, callback);
    }
    TRIM_BY_BYTE()
    {
        let len = this.INCOME_BUFFER.length
        while(len != 0)
        {
            if(len == NaN)
            {
                break;
            }
            if(this.INCOME_BUFFER[0] != this.MCD_START_BYTE)
            {
                this.INCOME_BUFFER.splice(0, 1);
                len--;
            }
            else
            {
                break;
            }
        }        
    }
    ADD_NEW_DATA_BYTE(_data_array)
    {
        for(let i = 0; i < _data_array.length; i++)
        {
            this.INCOME_BUFFER.push(_data_array[i]);
        }
        this.UPDATE();
        //console.log(this.INCOME_BUFFER.length)
    }
    CALC_CRC16(_data_array)
    {			
        let crc = 0;
        for (let i = 0; i < _data_array.length; i++)
        {
            crc ^= _data_array[i];
            for (let j = 0; j < 8; j++)
            {
                if(crc & 1)
                {
                    crc = (crc >> 1) ^ 0xA001;
                }
                else
                {
                    crc = (crc >> 1);
                }		
            }
        }
        return crc & 0xFFFF;
    }
    HANDEL_INCOME_DATA(_pack)
    {
        this.eventTarget.dispatchEvent(new CustomEvent("DATA_COME", { detail: _pack }));
    }
    UPDATE()
    {
        while(true)
        {
            this.TRIM_BY_BYTE();
            if(this.INCOME_BUFFER.length < this.MCD_MIN_LEN)
            {
                break;
            }
            var income_len = (this.INCOME_BUFFER[1] << 8) | (this.INCOME_BUFFER[2]);
            var income_crc = (this.INCOME_BUFFER[3] << 8) | (this.INCOME_BUFFER[4]);
            if(income_len > this.INCOME_BUFFER.len - 5)                             // мало данных
            {
                break;
            }
            if(income_len >= 0x1000)
            {
                this.INCOME_BUFFER.splice(0, 1)
                break;
            }
            if(this.INCOME_BUFFER.length < income_len + 5)                                     // еще не все данные пришли
            {
                break;
            }
            var data_buff = new Uint8Array(this.INCOME_BUFFER.slice(5, 5 + income_len));
            //data_buff.set(this.INCOME_BUFFER, 5, income_len);
            var crc_calk = this.CALC_CRC16(data_buff)
            if(income_crc != crc_calk)
            {
                this.INCOME_BUFFER.splice(0, 1)
                break;
            }
            var pack = new PACKET();
            pack.SET_BY_ARRAY(data_buff);
            this.HANDEL_INCOME_DATA(pack);
            this.INCOME_BUFFER.splice(0, income_len + 5)
            break;
        }
    }
    ADD_HEADER(_data_array) //Добавляет заголовок и выводит новый массив
    {
        let len = _data_array.length
        let tx_buff = new Uint8Array(len + 5)
        tx_buff[0] = this.MCD_START_BYTE
        tx_buff[1] = (len & 0xFF00) >> 8 	// length high
        tx_buff[2] = (len & 0x00FF) 		// length low
        let crc = this.CALC_CRC16(_data_array)
        tx_buff[3] = (crc & 0xFF00) >> 8 	// crc high
        tx_buff[4] = (crc & 0x00FF) 		// crc low	
        tx_buff.set(_data_array, 5)
        return(tx_buff)
    }
    SEND_DATA(_data)
    {
        this.eventTarget.dispatchEvent(new CustomEvent("DATA_SEND", { detail: _data }));
    }
    SEND_TO_DEV(_packet)
    {
        let tx_buff = this.ADD_HEADER(_packet.CONVER_TO_ARRAY());
        this.SEND_DATA(tx_buff);
    }
    SEND_SIMPLE_TO_DEV(_MAP, comman, _data_array){
        let pack = new PACKET();
        pack.ST_BY_PARAMETERS(_MAP, comman, 0, _data_array);
        this.SEND_TO_DEV(pack);
    }
}
let MY_MCD = new MCD();
setInterval(function() 
{
    MY_MCD.UPDATE();
}, 100);

