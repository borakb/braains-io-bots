const fs = require("fs");
const ws = require("ws");

let { botAmount } = require("../config.json");
let connected = 0;
const { HttpsProxyAgent } = require("https-proxy-agent");

// const LZStr = require("lz-string");

const parseProxies = require("./parser.js");

const proxiesUnparsed = fs.readFileSync("./library/proxies.txt", {encoding: "utf-8"});
const parsedProxies = parseProxies(proxiesUnparsed);

const wsHeaders = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36"
};



function Bot(wsUrl, id, initKeysArr, localWs) {

    this.wsUrl = wsUrl;
    this.localWs = localWs;
    this.id = id;
    this.ws = null;
    this.nick = null;
    this.initKeysArr = initKeysArr;
    // this.terminateBot = false;
    this.hasConnected = false;

}

Bot.prototype = {

    connect: function() {

        // if(this.terminateBot) return;

        let randomProxy = parsedProxies[Math.floor(Math.random() * parsedProxies.length)].split(":");

        this.ws = new ws(this.wsUrl, {
            // agent: new SocksProxyAgent({
            //     host: randomProxy[0],
            //     port: randomProxy[1],
            //     type: 4
            // })
            agent: new HttpsProxyAgent({
                host: randomProxy[0],
                port: randomProxy[1]
            }),
            headers: wsHeaders
        });

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);

        // this.ws.onmessage = this.onMessage.bind(this);

    },

    // reconnect: function() {
    //     console.log("Reconnecting...")
    //     this.connect();
    // },

    // terminateWs: function() {

    //     this.terminateBot = true;
    //     if(this.ws) {
    //         this.ws.close();
    //     }

    // },

    // decode: function(data) {

    //     var decomp = LZStr.decompressFromUTF16(data);
        
    //     return JSON.parse(decomp);

    // },

    updateConnected: function() {

        this.localWsSend(JSON.stringify({botAmount: botAmount, connected: connected}));

    },

    localWsSend: function(x) {
        
        if(this.localWs && this.localWs.readyState == this.localWs.OPEN) {

            this.localWs.send(x);

        }


    },

    wsSend: function(x) {
        if(this.ws && this.ws.readyState == ws.OPEN) {
            this.ws.send(x);
            //console.log(x);
        }
    },

    onOpen: function() {

        console.log("Bot #", this.id, "Connected");
        this.initKeysArr.forEach(x => {
            this.wsSend(JSON.stringify(x));
        });

        this.hasConnected = true;
        connected++;
        this.updateConnected();
        
    },

    onClose: function() {
        if(!this.hasConnected) return this.connect();

        console.log("Bot #", this.id, "Disconnected");
        this.hasConnected = false;
        connected--;
        this.updateConnected();
        this.connect();
    }, 

    // onMessage: function(msg) {

    //     console.log(this.decode(msg.data));

    // },

    onError: function() {
        return;
        // console.log("#", this.id, ": Error Occurred");
    }

}

module.exports = Bot;