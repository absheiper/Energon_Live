class DEVICE_TYPE{
    constructor() {
        this.data_base = [];
    }
}
/*
Если параметры GET и SET совпадают, то нужно опрашивать этот параметр в цикле, если нет, то спрашивается 1 раз при подключении*/

class DEVICE_ANY extends DEVICE_TYPE {
    constructor() {
        super(); 
        this.SYS_INFO = new SYS_INFO();
        this.data_base = [this.SYS_INFO]; // Инициализация базы данных
        this.prevDataBase = null; // Для хранения предыдущего состояния
        this.prevConnectedDevice = null; // Для хранения предыдущего устройства
    }

    PUSH_DEVICE(_device) {
        // Сохраняем текущее состояние перед изменениями
        this.prevDataBase = [...this.data_base]; 
        this.prevConnectedDevice = this.CONNECTE_DEVICE;

        // Оригинальная логика
        this.CONNECTE_DEVICE = _device;
        this.data_base.splice(1, this.data_base.length - 1);
        _device.data_base.forEach(el => this.data_base.push(el));
    }
                                                                      
    POP_DEVICE() {
        if (this.prevDataBase) {
            // Восстанавливаем состояние
            this.data_base = [...this.prevDataBase];
            this.CONNECTE_DEVICE = this.prevConnectedDevice;
            
            // Сбрасываем сохраненные данные
            this.prevDataBase = null;
            this.prevConnectedDevice = null;
        }
    }
}

class EN992_BMU extends DEVICE_TYPE {
    constructor() {
        super();
        this.ID_SET = new ID_SET()
        this.BMU_STATE = new BMU_STATE()
        this.HARD_ID = new HARD_ID();

        this.data_base.push(this.ID_SET);
        this.data_base.push(this.BMU_STATE);
        this.data_base.push(this.HARD_ID);
    }
}

class EN992_CBMS extends DEVICE_TYPE {
    constructor() {
        super();
        this.HARD_ID = new HARD_ID();
        this.ID_SET = new ID_SET()
        this.BATTERY_INFO = new BATTERY_INFO();
        this.ADC_SETTINGS = new ADC_SETTINGS();  
        this.BAT_CUR_SETTINGS = new BAT_CUR_SETTINGS();  
        this.BAT_MOD_SETTINGS = new BAT_MOD_SETTINGS();
        this.BAT_STR_SETTINGS = new BAT_STR_SETTINGS();
        this.BAT_ALL_VOLTAGES = new BAT_ALL_VOLTAGES();
        this.BAT_ALL_TEMP = new BAT_ALL_TEMP();
        this.CH_SETTINGS = new CBMS_CHANNEL_SETTINGS();
        this.CH_STATE = new CBMS_CHANNEL_STATE();

        this.data_base.push(this.ID_SET);
        this.data_base.push(this.BATTERY_INFO);
        this.data_base.push(this.BAT_MOD_SETTINGS);
        this.data_base.push(this.BAT_STR_SETTINGS);
        this.data_base.push(this.BAT_ALL_VOLTAGES);
        this.data_base.push(this.BAT_ALL_TEMP);
        this.data_base.push(this.ADC_SETTINGS);
        this.data_base.push(this.BAT_CUR_SETTINGS);        
        this.data_base.push(this.HARD_ID);
        this.data_base.push(this.CH_SETTINGS);
        this.data_base.push(this.CH_STATE);
    }
}

class EN992_GBMS extends DEVICE_TYPE {
    constructor() {
        super();
        this.ID_SET = new ID_SET()
        this.BAT_INFO = new GBMS_BAT_INFO();
        this.BAT_SETTINGS = new GBMS_BAT_SETTINGS();

        this.data_base.push(this.ID_SET);
        this.data_base.push(this.BAT_INFO);
        this.data_base.push(this.BAT_SETTINGS);
    }
}


MCDH_device = new  DEVICE_ANY();
//
MY_MCD.on("DATA_COME", (event) => {
    console.log("MCD CMD: ", event.detail.COMMAND,"MCD LEN: ", event.detail.PAYLOAD);
    MCDH_device.data_base.forEach(el => {
        if(el.SET_VAL == event.detail.COMMAND){
            el.SET_IN_BYTE(event.detail.PAYLOAD);
        }
    });
})
