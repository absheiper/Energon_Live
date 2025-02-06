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

