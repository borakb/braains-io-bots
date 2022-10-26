const fs = require("fs");
const request = require("request");

const reqHeaders = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36"
};

// const proxies = fs.readFileSync(proxiesDir, "utf8");

function parseProxies(proxyList) {

    let parsedProxies = [];

    parsedProxies = proxyList.split("\r\n").filter(x => x != / +/);

    return parsedProxies;

}

// function testProxies(proxyList) {

//     let validProxies = [];
//     let index = 0;

//     proxyList.forEach(x => {

//         request({
//             url: testUrl,
//             headers: reqHeaders,
//             proxy: proxyType + x
//         }, function(err, res) {
            
//             if(res.statusCode == 200) {

//                 validProxies.push(x);
//                 console.log("Valid Proxy No.", index);


//             } else {
//                 console.log("=====\nProxy Invalid: No. ", index, "\nStatus Code:", res.statusCode, "=====");
//             }

//         });

        

//         index++;
//     });

//     return validProxies;
// }

module.exports = parseProxies;