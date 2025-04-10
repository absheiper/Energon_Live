class DIRECTOR_CLASS
{

    constructor(_device){
        this.DEVICE_TYPE = "NONE";
        this.TASKS = [];
        this.DEVICE = _device;
    }

    PLASE_TABLES()
    {
        VTH.CLEAR_ALL_TABLES();
        MCDH_device.data_base.forEach(el => {
            VTH.ADD_TABLE(el);
        });
    }

    ADD_TASK(task){
        this.TASKS.push(task);
    }
    UPDATE(){
        if(this.TASKS.length > 0)
        {
            const curr_task = this.TASKS.shift();
            curr_task();
        }
        let New_dev_type = MCDH_device.SYS_INFO.VALUES[0].GET_IN_TEXT();
        if(!(New_dev_type === this.DEVICE_TYPE))
        {                                                                
            MCDH_device.POP_DEVICE();
            switch(New_dev_type)
            {
                case "0x20250307":
                    this.DEVICE = new DIRECTOR_GBMS()
                    MCDH_device.PUSH_DEVICE(new EN992_GBMS());
                    this.DEVICE.ADD_CONNECT_TASK();
                    break;
                case "0xE9920021":
                    this.DEVICE = new DIRECTOR_CBMS()
                    MCDH_device.PUSH_DEVICE(new EN992_CBMS());
                    this.DEVICE.ADD_CONNECT_TASK();
                    break;
                case "0xE9920011":
                    this.DEVICE = new DIRECTOR_BMU()
                    MCDH_device.PUSH_DEVICE(new EN992_BMU());
                    this.DEVICE.ADD_CONNECT_TASK();
                    break;
            }
            this.PLASE_TABLES();
            this.DEVICE_TYPE = New_dev_type;
        }
    }
}

class DIRECTOR_GBMS{
    constructor(){
        this.POSITION = 0;
    }
    TASKER_ADDER(){
        if(this.POSITION >= MCDH_device.data_base.length)
        {
            this.POSITION = 0;
        }
        let i;
        for(i = this.POSITION; i < MCDH_device.data_base.length; i++)
        {
            if(MCDH_device.data_base[i].GET_VAL == MCDH_device.data_base[i].SET_VAL)
            {
                Director.ADD_TASK(() => {
                    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), MCDH_device.data_base[i].GET_VAL);  // автополучение инфы от BAT INFO   
                });
                break;
            }
        }
        this.POSITION = i+1;
    }
    ADD_CONNECT_TASK(){
        MCDH_device.data_base.forEach((el) => {
            Director.ADD_TASK(() => {
                MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), el.GET_VAL);  
            });
        });
    }
}

class DIRECTOR_CBMS{
    constructor(){
        this.POSITION = 0;
    }
    TASKER_ADDER(){
        if(this.POSITION >= MCDH_device.data_base.length)
        {
            this.POSITION = 0;
        }
        let i;
        for(i = this.POSITION; i < MCDH_device.data_base.length; i++)
        {
            if(MCDH_device.data_base[i].GET_VAL == MCDH_device.data_base[i].SET_VAL)
            {
                Director.ADD_TASK(() => {
                    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), MCDH_device.data_base[i].GET_VAL);  // автополучение инфы от BAT INFO   
                });
                break;
            }
        }
        this.POSITION = i+1;
    }
    ADD_CONNECT_TASK(){
        MCDH_device.data_base.forEach((el) => {
            Director.ADD_TASK(() => {
                MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), el.GET_VAL);  
            });
        });
    }
}

class DIRECTOR_BMU{
    constructor(){
        this.POSITION = 0;
    }
    TASKER_ADDER(){
        if(this.POSITION >= MCDH_device.data_base.length)
        {
            this.POSITION = 0;
        }
        let i;
        for(i = this.POSITION; i < MCDH_device.data_base.length; i++)
        {
            if(MCDH_device.data_base[i].GET_VAL == MCDH_device.data_base[i].SET_VAL)
            {
                Director.ADD_TASK(() => {
                    MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), MCDH_device.data_base[i].GET_VAL);  // автополучение инфы от BAT INFO   
                });
                break;
            }
        }
        this.POSITION = i+1;
    }
    ADD_CONNECT_TASK(){
        MCDH_device.data_base.forEach((el) => {
            Director.ADD_TASK(() => {
                MY_MCD.SEND_SIMPLE_TO_DEV(ID_GET_MAP(), el.GET_VAL);  
            });
        });
    }
}

const Director = new DIRECTOR_CLASS(new DIRECTOR_CBMS());
setInterval(function() 
{
    Director.UPDATE();
}, 100);

setInterval(function() 
{
    Director.DEVICE.TASKER_ADDER();
}, 1000);