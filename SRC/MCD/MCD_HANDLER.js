// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
class SYS_INFO extends DATA_PACK{
    constructor(){
        super("SYS_INFO",0x01,0x01)
        this.VALUES.push(new DATA_BASE("HARDWARE_VERSION", "HEX", 4))
        this.VALUES.push(new DATA_BASE("SOFTWARE_VERSION", "HEX", 4))
        this.VALUES.push(new DATA_BASE("TMP_VERSION", "HEX", 4))
        this.VALUES.push(new DATA_BASE("BOOT_VERSION", "HEX", 4))
        this.VALUES.push(new DATA_BASE("SOFT_RESET_CAUSE", "HEX", 1))
        this.VALUES.push(new DATA_BASE("RESET_CAUSE", "BIN", 1))
        this.VALUES.push(new DATA_BASE("COUNT_SECONDS_TIC", "INT", 4))
        this.VALUES.push(new DATA_BASE("COUNT_MSECOND_TIC", "INT", 4))
        this.VALUES.push(new DATA_BASE("YEAR", "HEX", 1))
        this.VALUES.push(new DATA_BASE("MONTH", "HEX", 1))
        this.VALUES.push(new DATA_BASE("DATE", "HEX", 1))
        this.VALUES.push(new DATA_BASE("HOURS", "HEX", 1))
        this.VALUES.push(new DATA_BASE("MINUTES", "HEX", 1))
        this.VALUES.push(new DATA_BASE("SECONDS", "HEX", 1))
        this.VALUES.push(new DATA_BASE("WHERE_IS_PROGRAM", "INT", 1))
        this.VALUES.push(new DATA_BASE("res", "INT", 1))
        this.VALUES.push(new DATA_BASE("res", "INT", 4))
    }
}
class ID_SET extends DATA_PACK {
    constructor(){
        super("ID_SET",0x17,0x18)
        this.VALUES.push(new DATA_BASE("ID", "HEX", 1))
    }
}
class BATTERY_INFO extends DATA_PACK {
    constructor(){
        super("BATTERY_INFO",0x02,0x02)
        this.VALUES.push(new DATA_BASE("V_MIN", "INT", 2));
        this.VALUES.push(new DATA_BASE("V_MAX", "INT", 2));
        this.VALUES.push(new DATA_BASE("T_MIN", "INT", 2)); 
        this.VALUES.push(new DATA_BASE("T_MAX", "INT", 2));
        this.VALUES.push(new DATA_BASE("SUMM_VOLTAGE", "INT", 4));
        this.VALUES.push(new DATA_BASE("AVER_CURRENT1", "INT", 4));
        this.VALUES.push(new DATA_BASE("AVER_CURRENT2", "INT", 4));
        this.VALUES.push(new DATA_BASE("MOD_COUNT", "INT", 1));
        this.VALUES.push(new DATA_BASE("CELL_COUNT", "INT", 2));
        this.VALUES.push(new DATA_BASE("TEMP_COUNT", "INT", 2));
        this.VALUES.push(new DATA_BASE("STATE_CHARGE", "INT", 1));
        this.VALUES.push(new DATA_BASE("ENABLES_MASK", "INT", 1));
        this.VALUES.push(new DATA_BASE("STATE", "HEX", 4));
        this.VALUES.push(new DATA_BASE("CYCLES_CHARGED", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_RELAXING_S", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_CHARGE_S", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_DISCHARGE_S", "INT", 4));
        this.VALUES.push(new DATA_BASE("COUNT_SECOND_WORK_S", "INT", 4));
        this.VALUES.push(new DATA_BASE("COUNT_START_PROGRAMM", "INT", 4));
        this.VALUES.push(new DATA_BASE("BATTERY_CAPACITY_MAH", "INT", 4));
        this.VALUES.push(new DATA_BASE("POS_CURRENT_COUNTER_GLOBAL", "INT", 8));
        this.VALUES.push(new DATA_BASE("POS_CURRENT_COUNTER_CYCLE", "INT", 8));
        this.VALUES.push(new DATA_BASE("NEG_CURRENT_COUNTER_GLOBAL", "INT", 8));
        this.VALUES.push(new DATA_BASE("NEG_CURRENT_COUNTER_CYCLE", "INT", 8));
    }
}
class ADC_SETTINGS extends DATA_PACK {
    constructor(){
        super("ADC_SETTINGS",0x30,0x31)
        for(let i = 0; i < 3; i++)
        {
            this.VALUES.push(new DATA_BASE("  ", "INT", 0));
            this.VALUES.push(new DATA_BASE("AIN_" + i, "INT", 0));
            this.VALUES.push(new DATA_BASE("SETUP", "HEX", 1));
            this.VALUES.push(new DATA_BASE("MUX", "HEX", 1));
            this.VALUES.push(new DATA_BASE("ACR", "HEX", 1));
            this.VALUES.push(new DATA_BASE("ODAC", "HEX", 1));
            this.VALUES.push(new DATA_BASE("DIO", "HEX", 1));
            this.VALUES.push(new DATA_BASE("DIR", "HEX", 1));
            this.VALUES.push(new DATA_BASE("IOCON", "HEX", 1));
            this.VALUES.push(new DATA_BASE("OCR0", "HEX", 1));
            this.VALUES.push(new DATA_BASE("OCR1", "HEX", 1));
            this.VALUES.push(new DATA_BASE("OCR2", "HEX", 1));
            this.VALUES.push(new DATA_BASE("FSR0", "HEX", 1));
            this.VALUES.push(new DATA_BASE("FSR1", "HEX", 1));
            this.VALUES.push(new DATA_BASE("FSR2", "HEX", 1));
        }
    }
}
class CELL_STATE extends DATA_PACK {
    ADD_CELL()
    {
        this.VALUES.push(new DATA_BASE("STATE", "HEX", 2));
        this.VALUES.push(new DATA_BASE("VOLTAGE", "INT", 2));
        this.VALUES.push(new DATA_BASE("TEMP", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_NEED_BALANSING_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("VOLTAGE_MAX_CYCLE", "INT", 2));
        this.VALUES.push(new DATA_BASE("VOLTAGE_MIN_CYCLE", "INT", 2));
        this.VALUES.push(new DATA_BASE("TEMP_MAX_CYCLE", "INT", 2));
        this.VALUES.push(new DATA_BASE("TEMP_MIN_CYCLE", "INT", 2));
    }
    constructor(){
        super("CELL_STATE",0x40,0x41)
        this.VALUES.push(new DATA_BASE("CELL_COUNT", "INT", 2))
        for(let i = 0; i < 16; i++)
        {
            this.ADD_CELL();
        }
    }
}

class BAT_MOD_SETTINGS extends DATA_PACK {
    constructor(){
        super("BAT_MOD_SETTINGS",0x60,0x61)
        this.VALUES.push(new DATA_BASE("CELL_OVER_EMERGENCY_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_OVER_EMERGENCY_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_OVER_EMERGENCY_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_OVER_EMERGENCY_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_UNDER_EMERGENCY_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_UNDER_EMERGENCY_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_UNDER_EMERGENCY_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_UNDER_EMERGENCY_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_OVER_CHARGE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_OVER_CHARGE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_OVER_CHARGE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_OVER_CHARGE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_UNDER_DISCHARGE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_UNDER_DISCHARGE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_UNDER_DISCHARGE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_UNDER_DISCHARGE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_OVER_ATTENTIONE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_OVER_ATTENTIONE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_OVER_ATTENTIONE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_OVER_ATTENTIONE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_UNDER_ATTENTIONE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_UNDER_ATTENTIONE_V", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_UNDER_ATTENTIONE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_UNDER_ATTENTIONE_V_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_OVER_EMERGENCY_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_OVER_EMERGENCY_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_OVER_EMERGENCY_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_OVER_EMERGENCY_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_UNDER_EMERGENCY_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_UNDER_EMERGENCY_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_UNDER_EMERGENCY_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_UNDER_EMERGENCY_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_OVER_LIMITED_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_OVER_LIMITED_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_OVER_LIMITED_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_OVER_LIMITED_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_UNDER_LIMITED_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_UNDER_LIMITED_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_UNDER_LIMITED_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_UNDER_LIMITED_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_OVER_ATTENTION_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_OVER_ATTENTION_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_OVER_ATTENTION_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_OVER_ATTENTION_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_UNDER_ATTENTION_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("CELL_GIST_FROM_UNDER_ATTENTION_T", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_UNDER_ATTENTION_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_UNDER_ATTENTION_T_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TEMP_COUNT_MIN", "INT", 1));
        this.VALUES.push(new DATA_BASE("TIME_FROM_TEMP_COUNT_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_TEMP_COUNT_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_MODULE_UNCONNECT_MS", "INT", 4));
    }
}

class BAT_STR_SETTINGS extends DATA_PACK {
    constructor(){
        super("BAT_STR_SETTINGS",0x62,0x63)
        this.VALUES.push(new DATA_BASE("MODULE_COUNT", "INT", 1));
        this.VALUES.push(new DATA_BASE("CELL_CAPACITY_MAH", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_MODULE_COUNT_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_MODULE_COUNT_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("CELL_COUNT", "INT", 2));
        this.VALUES.push(new DATA_BASE("TIME_FROM_CELL_COUNT_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_CELL_COUNT_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("I_CURRENT_CHA_ATTENTION", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_I_CHA_ATTENTION_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_I_CHA_ATTENTION_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("I_CURRENT_CHA_WARNING", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_I_CHA_WARNING_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_I_CHA_WARNING_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("I_CURRENT_CHA_EMERGENCY", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_I_CHA_EMERGENCY_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_I_CHA_EMERGENCY_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("I_CURRENT_DIS_ATTENTION", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_I_DIS_ATTENTION_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_I_DIS_ATTENTION_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("I_CURRENT_DIS_WARNING", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_I_DIS_WARNING_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_I_DIS_WARNING_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("I_CURRENT_DIS_EMERGENCY", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_I_DIS_EMERGENCY_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_I_DIS_EMERGENCY_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_IS_CHRGE_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_IS_CHRGE_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_IS_DISCHRGE_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_IS_DISCHRGE_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_FROM_IS_RELAXING_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("TIME_TO_IS_RELAXING_MS", "INT", 4));
        this.VALUES.push(new DATA_BASE("MASK_CHARGE_ENABLE", "HEX", 4));
        this.VALUES.push(new DATA_BASE("MASK_DISCHARGE_ENABLE", "HEX", 4));
        this.VALUES.push(new DATA_BASE("MASK_WARNING", "HEX", 4));
        this.VALUES.push(new DATA_BASE("MASK_RESTRICTION_CHARGE", "HEX", 4));
        this.VALUES.push(new DATA_BASE("MASK_RESTRICTION_DISCHARGE", "HEX", 4));
        this.VALUES.push(new DATA_BASE("MASK_COOLING", "HEX", 4));
        this.VALUES.push(new DATA_BASE("MASK_HEATING", "HEX", 4));
        this.VALUES.push(new DATA_BASE("MASK_PRECHARGE", "HEX", 4));
    }
}

class BAT_ALL_VOLTAGES extends DATA_PACK {
    constructor(){
        super("VOLTAGES",0x64,0x64)
        for(let i = 0; i < 24; i++){
            for(let j = 0; j < 16; j++){
                this.VALUES.push(new DATA_BASE("MOD " + (i) + " CELL " + (j+1), "INT", 2));
            }
        }
    }
}
class BAT_ALL_TEMP extends DATA_PACK {
    constructor(){
        super("TEMPS",0x65,0x65)
        for(let i = 0; i < 24; i++){
            for(let j = 0; j < 16; j++){
                this.VALUES.push(new DATA_BASE("MOD " + (i) + " CELL " + (j+1), "INT", 2));
            }
        }
    }
}

class BAT_CUR_SETTINGS extends DATA_PACK {
    constructor(){
        super("CUR_SETTINGS",0x66,0x67)
        this.VALUES.push(new DATA_BASE("CUR 1", "INT", 0));
        this.VALUES.push(new DATA_BASE("ZERO_VAL_BIT", "INT", 4));
        this.VALUES.push(new DATA_BASE("CUR_COEFF_1000", "INT", 4));
        this.VALUES.push(new DATA_BASE("ZERO_ZONE_MA", "INT", 4));

        this.VALUES.push(new DATA_BASE(" ", "INT", 0));
        this.VALUES.push(new DATA_BASE("CUR 2", "INT", 0));
        this.VALUES.push(new DATA_BASE("ZERO_VAL_BIT", "INT", 4));
        this.VALUES.push(new DATA_BASE("CUR_COEFF_1000", "INT", 4));
        this.VALUES.push(new DATA_BASE("ZERO_ZONE_MA", "INT", 4));
    }
}



class DATA_DEVICE
{
    data_base = [];
    constructor()
    {
        this.SYS_INFO = new SYS_INFO()
        this.ID_SET = new ID_SET()
        this.CELL_STATE = new CELL_STATE()
        this.BATTERY_INFO = new BATTERY_INFO();
        //this.BAT_SETTINGS = new BAT_SETTINGS();
        this.ADC_SETTINGS = new ADC_SETTINGS();  
        this.BAT_CUR_SETTINGS = new BAT_CUR_SETTINGS();  
        this.BAT_MOD_SETTINGS = new BAT_MOD_SETTINGS();
        this.BAT_STR_SETTINGS = new BAT_STR_SETTINGS();
        this.BAT_ALL_VOLTAGES = new BAT_ALL_VOLTAGES();
        this.BAT_ALL_TEMP = new BAT_ALL_TEMP();

        this.data_base.push(this.SYS_INFO);
        this.data_base.push(this.ID_SET);
        this.data_base.push(this.BATTERY_INFO);
        this.data_base.push(this.BAT_MOD_SETTINGS);
        this.data_base.push(this.BAT_STR_SETTINGS);
        this.data_base.push(this.BAT_ALL_VOLTAGES);
        this.data_base.push(this.BAT_ALL_TEMP);
        this.data_base.push(this.ADC_SETTINGS);
        this.data_base.push(this.BAT_CUR_SETTINGS);
        //this.data_base.push(this.BAT_SETTINGS);
        this.data_base.push(this.CELL_STATE);
        
    }
}
MCDH_device = new  DATA_DEVICE();
MY_MCD.on("DATA_COME", (event) => {
    console.log("MCD CMD: ", event.detail.COMMAND,"MCD LEN: ", event.detail.PAYLOAD);
    MCDH_device.data_base.forEach(el => {
        if(el.SET_VAL == event.detail.COMMAND){
            el.SET_IN_BYTE(event.detail.PAYLOAD);
        }
        /*
        else{
            if(el.GET_VAL == event.detail.COMMAND){     // TODO Над этим нужно серьезно подумать
                el.SET_IN_BYTE(event.detail.PAYLOAD);
            }
        }       
            */ 
    });
})



