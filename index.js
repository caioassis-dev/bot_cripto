
// removi esse trecho pois na pagina front-end já estou importando, deixar isso ativo so se for rodar em back-end.
// const axios = require("axios");

const period = 14;
const symbol = "BTCUSDT";

const api_url = "https://api.binance.com"; //https://testnet.binance.vision

function averages(prices, period, startIndex){
    let gains = 0, losses = 0;

    for(let i = 0; i < period && (i + startIndex) < prices.length; i++){
        const diff = prices[i + startIndex] - prices[i + startIndex - 1];
        if(diff >= 0){
            gains += diff;
        }else{
            losses += Math.abs(diff);
        }
    }
    let avgGains = gains / period;
    let avgLosses = losses / period;
    return { avgGains, avgLosses}
}

function RSI(prices, period){
    let avgGains = 0, avgLosses = 0;

    for(let i=1; i <prices.length; i++){
        let newAverages = averages(prices, period, i);

        if(i === 1){
            avgGains = newAverages.avgGains;
            avgLosses = newAverages.avgLosses;
            continue;
        }

        avgGains = (avgGains * (period - 1) + newAverages.avgGains) / period;
        avgLosses = (avgLosses * (period - 1) + newAverages.avgLosses) / period;
    }

    const rs = avgGains / avgLosses;
    return 100 - (100 / (1 + rs));
}


let position = false;

//open, high, low, close
// it its the candle default.

async function start() {
    const { data } = await axios.get(api_url + "/api/v3/klines?limit=100&interval=15m&symbol="+ symbol)
    const lastCandle = data[data.length -1]
    const lastPrice = parseFloat(lastCandle[4]);

    const prices = data.map(k => parseFloat(k[4]));
    const rsi = parseFloat(RSI(prices,period)).toFixed(2);

    document.getElementById("rsi").innerText = `$${rsi}`;
    document.getElementById("price").innerText = `$${lastPrice}`;
    
    let actionText = "WAIT";
    let buy = "oversold, It's time to BUY!!"
    let sell = "overbought, It's time to SELL!!"


    if(rsi <= 48){
        actionText = buy
    }else if(rsi >= 58){
        actionText = sell
    }else{
        actionText = "WAIT"
    }

    document.getElementById("action").innerText = actionText;

    let card = document.querySelector(".card");
    if(actionText == buy){
        card.classList.remove("text-bg-danger", "text-bg-warning");
        card.classList.add("text-bg-sucess")
    } else if (actionText === sell) {
        card.classList.remove("text-bg-success", "text-bg-warning");
        card.classList.add("text-bg-danger");
    } else {
        card.classList.remove("text-bg-success", "text-bg-danger");
        card.classList.add("text-bg-warning");
    }

}

// start it is the begin and the 3000 é miliseconds it is 3 seconds.
setInterval(start, 3000);

start();