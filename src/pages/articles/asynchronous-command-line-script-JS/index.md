---
date: "2018-05-22"
title: "Asynchronous Command Line Script in Javascript"
category: "Development"
layout: post
draft: false
path: "/posts/async-command-line-script-javascript"
tags: ["Node.js", "Javascript"]
description: "Running asynchronous operation in a command line JS script."
---

I was looking for the all time high data on various cryptocurrencies and found that the excellent [Messari](https://messari.io) provides a `getMetricsBySymbol` [API](https://messari.io/api/docs#operation/getMetricsBySymbol) for that:

```javascript
require("got")
  .get("https://data.messari.io/api/v1/assets/btc/metrics")
  .then(response => {
    console.log(response.body);
  });
  ```
  
  But how do I save the ATH (all time high) data for all the cryptocurrencies, not just a particular one?
  
  Messari also provides a `getAllAssets` [API](https://messari.io/api/docs#operation/getAllAssets) and it returns a list of all the assets that they track.
  
  Naturally, it should be possible to ask for all the assets and retrieve the ATH data for each asset.
  
  ## Writing the node script
  
  We are going to use [axios](https://www.npmjs.com/package/axios) to call the API and the standard `fs` module to save the results to a file.
  ```javascript
  const axios = require('axios');
const fs = require('fs');
  ```
  
  Next, we want to call the `getAllAssets` API and save the results to an array:
  
  ```javascript
  async function getAllCoins() {
    let coins = [];
    await axios
      .get('https://data.messari.io/api/v1/assets')
      .then(response => {
        response.data.data.forEach(elem => {
          console.log(`pushing ${JSON.stringify(elem)}`);
          coins.push(elem);
        });
      })
      .catch(err => {
        console.log(`getAllCoins() error ${err}`);
      });
  return coins;
}
```

Now, let's write a function that retrieves the ATH data for a particular asset:

```javascript
async function getATH(symbol) {
  let [ath, pctDown] = [0, 0];
  await axios
    .get(`https://data.messari.io/api/v1/assets/${symbol}/metrics`)
    .then(response => {
      ath = response.data.data.all_time_high.price;
      pctDown = Number.parseFloat(
        response.data.data.all_time_high.percent_down
      ).toFixed(2);
      console.log(`symbol ${symbol} ath ${ath} percent down ${pctDown}%`);
    })
    .catch(err => {
      console.log(`getATH err = ${err}`);
    });
  return { ath, pctDown };
}
```

Now that we have these two blocks, we can write the main function:
```javascript
async function run() {
  let ath = {};
  const coins = await getAllCoins();
  for (let i = 0; i < coins.length; i++) {
    let athData = await getATH(coins[i].symbol);
    if (athData.ath > 0) {
      ath[coins[i].symbol] = athData;
    }
  }
  fs.writeFile('./ath.json', JSON.stringify(ath, null, 4), err => {
    if (err) console.log(err);
  });
}
```

I first tried to use `Array.prototype.forEach()` to go over all the assets, but it didn't work. The crucial thing is that `forEach()` is blocking, so it cannot be used with an asynchronous callback. Old-fashioned `for` loop works fine, however.

Another thing that I've learnt, is that `JSON.stringify()` accepts an optional space parameter, to make the output human-readable.

## Executing the script

`node script.js`, what can be simpler than that? Well, there is a complication.

Messari's `getAllAssets` API returns more than 3000 assets, but `getMetricsBySymbol` doesn't know about most of them and returns a 404 response.

This is how the script's output looks in the terminal:

```shell
getATH err = Error: Request failed with status code 404
symbol lrc ath 2.08774 percent down 97.72%
symbol block ath 56.2216 percent down 97.15%
symbol etc ath 47.7748 percent down 91.01%
symbol rhoc ath 2.85994 percent down 99.38%
symbol edg ath 2.86567 percent down 93.76%
getATH err = Error: Request failed with status code 404
symbol ost ath 1.11477 percent down 98.04%
getATH err = Error: Request failed with status code 404
getATH err = Error: Request failed with status code 404
getATH err = Error: Request failed with status code 404
symbol hydro ath 0.0127895 percent down 87.87%
symbol hot ath 0.00144038 percent down 59.93%
symbol etn ath 0.18547 percent down 96.83%
symbol xcp ath 85.5883 percent down 97.67%
getATH err = Error: Request failed with status code 404
getATH err = Error: Request failed with status code 404
getATH err = Error: Request failed with status code 404
getATH err = Error: Request failed with status code 404
getATH err = Error: Request failed with status code 404
```

The API also seems to have a built-in rate limit, so a few thousands `getMetricsBySymbol` calls took almost half an hour. But at the end, the script managed to save the ATH data on 176 different cryptocurrencies.