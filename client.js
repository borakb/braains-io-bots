// ==UserScript==
// @name         BrainBot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Boris
// @match        https://www.modd.io/*
// @icon         https://www.google.com/s2/favicons?domain=modd.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function Client() {

        this.ws = null;

    }

    Client.prototype = {

        connect: function() {
            this.ws = new WebSocket("ws://localhost:8381");
            this.ws.onopen = this.onOpen.bind;
            this.ws.onclose = this.onClose.bind;
        },

        onOpen: function() {
            console.log("Successfully established connection with the server.");
        },

        onClose: function() {
            console.log("Failed to establish connection with the server.");
        },

        wsSend: function(x) {

            if(this.ws && this.ws.readyState == WebSocket.OPEN) {
                console.log("SENDING: ", x);
                this.ws.send(JSON.stringify(x));

            }
        }
    }

    let cli = new Client();
    let keyFlags = {};
    let mode = true;
    let modeFlag = false;
    const modeMap = {
        "o": "w",
        "k": "a",
        "l": "s",
        ";": "d"

    }
    cli.connect();

    function holdKey(key, state) {
        if(!cli) return;
        let f = {
            state: state,
            key: key
        }
        cli.wsSend(f);
    }

    document.addEventListener("keydown", function(e) {
        let lower = e.key.toLowerCase();
        if(e.key == "Home") {

             if(!modeFlag) {

                 mode = true;
                 modeFlag = true;

             }

        } else if (lower == "z") {

            holdKey("z", 2);

        } else if(lower == "p") {

            holdKey("button1", 3);

        } else if(lower == "]") {

            if(cli) {

                cli.wsSend({buyPills: true});
            }
        }

        if(lower == "w" || lower == "a" || lower == "s" || lower == "d" || lower == "o" || lower == "k" || lower == "l" || lower == ";") {
            if(mode) {
                if(!keyFlags[lower]) {

                    holdKey(lower, 1);
                    keyFlags[lower] = true;

                }

            } else {

                if(!keyFlags[modeMap[lower]]) {

                    holdKey(modeMap[lower], 1);
                    keyFlags[modeMap[lower]] = true;
                }
            }
        }

    });

    document.addEventListener("keyup", function(e) {
        let lower = e.key.toLowerCase();
        if(e.key == "Home") {

             if(modeFlag) {

                 mode = false;
                 modeFlag = false;

             }

        }
        if(lower == "w" || lower == "a" || lower == "s" || lower == "d" || lower == "o" || lower == "k" || lower == "l" || lower == ";") {
            if(mode) {
                if(keyFlags[lower]) {

                    holdKey(lower, 0);
                    keyFlags[lower] = false;

                }

            } else {

                if(keyFlags[modeMap[lower]]) {

                    holdKey(modeMap[lower], 0);
                    keyFlags[modeMap[lower]] = false;
                }
            }
        }

    });

})();