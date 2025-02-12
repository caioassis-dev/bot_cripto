
const axios = require("axios");

const buy_price = 96003;
const sell_price = 96380;
const symbol = "BTCUSDT";

const api_url = "https://testnet.binance.vision";

let position = false;

//open, high, low, close
// it its the candle default.

async function start() {
    const { data } = await axios.get(api_url + "/api/v3/klines?limit=21&interval=15m&symbol="+ symbol)
    const lastCandle = data[data.length -1]
    const price = parseFloat(lastCandle[4]);


    console.clear();
    console.log(`Price: ${price}`)

    if(price <= buy_price && position === false){
        console.log("buy")
        position = true;
    }else if(price >= sell_price && position === true){
        console.log("sell")
        position = false;
    }else{
        console.log("wait")
    }
}



// start it is the begin and the 3000 é miliseconds it is 3 seconds.
setInterval(start, 3000);

start();