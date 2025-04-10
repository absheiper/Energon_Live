class DATA_BASE
{
    constructor(_NAME, _TYPE, _LEN_IN_BYTE)
    {
        this.NAME = _NAME
        this.TYPE = _TYPE
        this.LEN_IN_BYTE = _LEN_IN_BYTE
        this.BYTE_value = new Uint8Array(this.LEN_IN_BYTE)
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
                ret = 0;
                for(let i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    ret += this.BYTE_value[i] << (((this.LEN_IN_BYTE - 1) - i) * 8)
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
            case "STATUS1":
                const flags = [
                [0x00000001, "Модуль АЦП в сети и отвечает.", "Отключился модуль АЦП, давно не отвечает."],
                [0x00000002, "Датчики на ячейку на месте.", "Отвалился датчик на ячейку."],
                [0x00000004, "Количество ячеек совпадает.", "Количество ячеек не совпадает."],
                [0x00000008, "НЕ обнаружено перенапряжение.", "Обнаружено перенапряжение."],
                [0x00000010, "НЕ обнаружено критически низкое напряжение.", "Обнаружено критически низкое напряжение."],
                [0x00000020, "НЕ обнаружено конца заряда.", "Обнаружен конец заряда."],
                [0x00000040, "НЕ обнаружено конца разряда.", "Обнаружен конец разряда."],
                [0x00000080, "НЕ обнаружено конца заряда.", "Обнаружен конец заряда."],
                [0x00000100, "НЕ обнаружено конца разряда.", "Обнаружен конец разряда."],
                [0x00000200, "НЕ обнаружено критически высокой температуры.", "Обнаружена критически высокая температура."],
                [0x00000400, "НЕ обнаружено критически низкой температуры.", "Обнаружена критически низкая температура."],
                [0x00000800, "НЕ обнаружено высокой температуры.", "Обнаружена высокая температура."],
                [0x00001000, "НЕ обнаружено низкой температуры.", "Обнаружена низкая температура."],
                [0x00002000, "НЕ обнаружено предупреждение высокой температуры.", "Обнаружено предупреждение высокой температуры."],
                [0x00004000, "НЕ обнаружено предупреждение низкой температуры.", "Обнаружено предупреждение низкой температуры."],
                [0x00008000, "Датчики температуры на месте.", "Отвалился датчик температуры."],
                [0x00010000, "Зарядный ток не превышает порог внимание.", "Зарядный ток превышает порог внимание."],
                [0x00020000, "Зарядный ток не превышает порог авария.", "Зарядный ток превышает порог авария."],
                [0x00040000, "Зарядный ток не превышает порог ЧП.", "Зарядный ток превышает порог ЧП."],
                [0x00080000, "Разрядный ток не превышает порог внимание.", "Разрядный ток превышает порог внимание."],
                [0x00100000, "Разрядный ток не превышает порог авария.", "Разрядный ток превышает порог авария."],
                [0x00200000, "Разрядный ток не превышает порог ЧП.", "Разрядный ток превышает порог ЧП."],
                [0x00400000, "НЕ заряжается.", "Заряжается."],
                [0x00800000, "НЕ разряжается.", "Разряжается."],
                [0x01000000, "НЕ отрелаксирована.", "Отрелаксирована."],
                [0x02000000, "Датчик тока подключен.", "Датчик тока отключен."],
                [0x04000000, "Модули все в работе.", "Модулей не то количество."],
            ];
        
            const result = [];
            for (const [bitmask, message0, message1] of flags) {
                if (value & bitmask) {
                    result.push(message1);
                } else {
                    result.push("0");
                }
            }
            return result.join('\n');
                break;
            default:
                break;
        }
    }
    SET_IN_TEXT(_new_val)
    {
        switch(this.TYPE)
        {
            case "INT":
                int_val = Number(_new_val)
                for(i = 0; i < this.LEN_IN_BYTE; i++)        
                {
                    this.BYTE_value[i] = (int_val >> i + 8) & 0xFF
                }
                break;
            case "HEX":
                this.BYTE_value = _new_val.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
                break;
            default:
                break
        }
    }
}

class DATA_PACK
{
    constructor(_NAME, GAT_VAL, SET_VAL)
    {
        this.NAME = _NAME;
        this.GAT_VAL = GAT_VAL;
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
        if(this.LEN_IN_BYTE() != _data_array.length)
        {
            return;
        }
        for(let i = 0; i < this.VALUES.length; i++)
        {
            this.VALUES[i].SET_IN_BYTE(_data_array.splice(0, this.VALUES[i].LEN_IN_BYTE));
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

class MCD
{
    constructor()
    {
        this.MCD_START_BYTE = 0x18;
        this.MCD_MIN_LEN = 7;
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
    HANDEL_INCOME_DATA(_data_array)
    {
        let command = _data_array[0];
        let address = (_data_array[1] << 8) +_data_array[2];
        _data_array.splice(0,3);
        this.eventTarget.dispatchEvent(new CustomEvent("DATA_COME", { detail: {command, address, _data_array} }));
    }
    UPDATE()
    {
        while(true)
        {
            this.TRIM_BY_BYTE();
            if(this.INCOME_BUFFER.length < this.MCD_MIN_LEN)
            {
                break
            }
            var income_len = (this.INCOME_BUFFER[1] << 8) | (this.INCOME_BUFFER[2]);
            var income_crc = (this.INCOME_BUFFER[3] << 8) | (this.INCOME_BUFFER[4]);
            if(income_len > this.INCOME_BUFFER.len - 5)                             // мало данных
            {
                break
            }
            if(income_len >= 0x1000)
            {
                this.INCOME_BUFFER.splice(0, 1)
                break
            }
            var data_buff = []
            for(let i = 0; i < income_len; i++)
            {
                data_buff[i] = this.INCOME_BUFFER[i + 5]
            }
            var crc_calk = this.CALC_CRC16(data_buff)
            if(income_crc != crc_calk)
            {
                this.INCOME_BUFFER.splice(0, 1)
                break
            }
            this.HANDEL_INCOME_DATA(data_buff)
            this.INCOME_BUFFER.splice(0, income_len + 5)
            break;
        }
    }
    ADD_COMMAND_LEN(_data_array, _command, _adr) //Добавлет кодманду и адресс устройства
    {
        let tx_buff = new Uint8Array(_data_array.length + 3);
        tx_buff[0] = (_command & 0xFF)
        tx_buff[1] = (_adr & 0xFF00) >> 8
        tx_buff[2] = (_adr & 0x00FF)
        tx_buff.set(_data_array, 3)
        return(tx_buff)
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
    SEND_TO_DEV(_data_array, _command, _address)
    {
        let tx_buff = this.ADD_COMMAND_LEN(_data_array, _command, _address)
        tx_buff = this.ADD_HEADER(tx_buff)
        this.SEND_DATA(tx_buff)
    }
}
/*
let MY_MCD = new MCD();
setInterval(function() 
{
    MY_MCD.UPDATE();
}, 100);
*/
