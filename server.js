const {WebSocketServer} = require("ws");
const Bot = require("./library/bot.js");

let {botAmount, url} = require("./config.json");

const wsUrl = url;

let botList = [];

const wsServer = new WebSocketServer({
    port: "8381"
})

function sendBotKeys(state, x) {

    botList.forEach(bot => {
        if(state == 1) {
            bot.wsSend(JSON.stringify(["\t",{"device":"key","key":x}]));
        } else if(state == 0) {
            bot.wsSend(JSON.stringify(["\n",{"device":"key","key":x}]));
        } else if(state == 2) {
            bot.wsSend(JSON.stringify(["\t",{"device":"key","key":x}]));
            bot.wsSend(JSON.stringify(["\n",{"device":"key","key":x}]));
        } else if(state == 3) {
            bot.wsSend(JSON.stringify(["\t",{"device":"mouse","key":x}]));
            bot.wsSend(JSON.stringify(["\n",{"device":"mouse","key":x}]));
        }
    });

}

function buyItem(item) {
    let stringified = JSON.stringify(["\u000f",item]);

    botList.forEach(bot => {
        console.log(stringified);
        bot.wsSend(stringified);
    })

}

function forward(json) {

    botList.forEach(bot => {

        bot.wsSend(json);

    })

}

let localWebSocket;

function runBots() {

    for (let i=0; i < botAmount; i++) {

        let initKeysArr = [
            ["G","1"],
            ["\u0004",{"number":Math.floor(Math.random()*850)/*i*/,"_id":"","isAdBlockEnabled":false}],
        ]
        let curBot = new Bot(wsUrl, i, initKeysArr, localWebSocket);
        botList.push(curBot);

        curBot.connect();

    }

}

wsServer.on("connection", function(ws) {

    console.log("Server open");
    localWebSocket = ws;
    runBots();
    ws.on("message", (msg) => {

        let msgParsed = JSON.parse(msg);

        if(msgParsed.buyItem) {
            buyItem(msgParsed.buyItem);
            return;

        } else if(msgParsed.forward && msgParsed.forward.json) {
            forward(msgParsed.forward.json);
        }

        sendBotKeys(msgParsed.state, msgParsed.key);

    });

});

/*


WebSocket.prototype.oldSend = WebSocket.prototype.send;

WebSocket.prototype.send = function(arg){
    let parsed = JSON.parse(arg);

    if(parsed[0] == "\u000b") {

        if(cli) {

            cli.wsSend({

                forward: {

                    json: arg

                }

            });

        }

    }
}


    WebSocket.prototype.oldSend = WebSocket.prototype.send;

    WebSocket.prototype.send = function(arg){
        let parsed = JSON.parse(arg);

        if(parsed[0] == "\u000b" || parsed[0] == "\r") {

            if(cli) {

                cli.wsSend({

                    forward: {

                        json: arg

                    }

                });

            }

        }

        this.oldSend(arg);

        return;
    }

*/