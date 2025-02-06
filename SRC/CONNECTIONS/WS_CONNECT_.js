


class WS_INTERACTION
{
    is_connected = 0
    is_TRY_CONNECT = 0
    socket
    MCD
    constructor (_MCD)
    {
        this.MCD = _MCD;
    }
    // *****************************************************************************
    // *****************************************************************************
    // *****************************************************************************
    TRY_CONNECT()
    {
        // socket = new WebSocket('ws:'+window.location.href.substr(7).slice(0,-1)+':81/WS_CONNECT');
        //socket = new WebSocket('ws:192.168.1.77:81/WS_CONNECT')
        this.socket = new WebSocket('ws:192.168.1.101:81/WS_CONNECT')
        this.socket.binaryType = "arraybuffer"
        this.is_TRY_CONNECT = 1
        this.socket.onopen = function(e)
        {
            console.log('Connection opened')
            this.is_connected = 1
        };
        this.socket.onclose = function(e)
        {
            console.log('Connection Closed')
            this.is_connected = 0
            this.is_TRY_CONNECT = 0
        };
        this.socket.onerror = function(e)
        {
            console.log('ERROR')
            this.is_connected = 0
            this.is_TRY_CONNECT = 0
        };
        this.socket.onmessage = function(event)
        {	
            //this.socket.binaryType = "arraybuffer"
            //let raw_data = new Uint8Array(event.data)
            let raw_data = new Uint8Array(event.data)
            console.log(raw_data);
            WS_STATE.MCD.ADD_NEW_DATA_BYTE(raw_data)
        }
    }
    // *****************************************************************************
    // *****************************************************************************
    // *****************************************************************************
}    
/*
setInterval(function()
{
    if(WS_STATE.is_connected == 1)
    {
        //MCD_SEND_GET_REQUEST(MCD_ADDRRES,MCD_DATA.cmd_get)				
    } 
    else
    {
        if(WS_STATE.is_TRY_CONNECT == 0)
        {
            WS_STATE.TRY_CONNECT()
            WS_STATE.is_TRY_CONNECT = 1
        }
    }
}, 2000);
*/