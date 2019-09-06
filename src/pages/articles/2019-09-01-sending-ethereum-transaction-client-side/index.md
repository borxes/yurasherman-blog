---
date: "2019-09-01"
title: "Executing Ethereum Transactions from the Client Side"
category: "Development"
layout: post
draft: false
path: "/posts/executing-eth-transactions-client-side"
tags: ["Ethereum", "Javascript"]
description: "In this guide we will see how to execute Ethereum transaction from the client-side, i.e. from the browser, without third-party tools (e.g. Metamask). Namely, we will transfer ERC20 tokens from a wallet controlled by the web application to an arbitrary user's wallet."
---

In this guide we will see how to execute Ethereum transaction from the client-side, i.e. from the browser, without third-party tools (e.g. Metamask). Namely, we will transfer ERC20 tokens from a wallet controlled by the web application to an arbitrary user's wallet.

Typically, a dapp user will initiate a smart contract transaction by signing it and paying for its gas costs from his Ethereum wallet, like Metamask or Dapper. This is perfectly fine for users who know how to work with these tools. 

What if our users are not involved in the crypto community? They have no idea how to use an Ethereum wallet, but we still would like to run a promotion, send them a cryptokitty or some ERC20 tokens.

In this scenario, we need to execute a transaction by signing it and paying for its gas cost ourselves.
This would be done by a server side code, but in this guide we will look at how to do it from the browser.

The obvious downside to running transactions from the browser is that we store the private key to our funds  in the web page. **This is an anti-security practice**, solely done on the testnet where the funds have no value. In the real world, only store your private key on a secure server! And even then, an account with a private key exposed to the Internet shouldn't have too much money.

## The ERC20 Token Contract

We will be working with an ERC20 token contract called VeganCoin,  [deployed](https://ropsten.etherscan.io/address/0xd45b14cc23e1fa8ddd022b7a2e2ffd62fe90f80e) on the Ropsten network.

It's been deployed from [Remix](https://remix.ethereum.org) and we saved the resulting ABI to a [Javascript file](https://github.com/borxes/vcntransfer/blob/master/abi.js) so that we can interact with the contract from our web application.

## Front-end

The [front-end](https://goofy-williams-bc3a47.netlify.com) is very basic so that we can focus on the transaction. There is a "to" address field and an "amount" field. "Send" button sends the specified amount as long as the application has it.

## Interacting With the Blockchain from the Browser

Let's look at how this demo application actually transfers ERC20 tokens by going over the [code](https://github.com/borxes/vcntransfer/blob/master/transfer.js)

```javascript
web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/db600dd237574abfad7b1f30e77132f9'
  )
);

//0x as web3.js needs it
const PRIVATE_KEY =
  '0x5A9B27252FAF8EBB2FB9FBE0ED1E1973154BE6B096190F48F20CC50653A091B0';
const OWNER = '0x3587613C07A95A7f471449f90E757647A3f1E86A';

// contract address
const VEGANCOIN_ROPSTEN = '0xd45b14cc23e1fa8ddd022b7a2e2ffd62fe90f80e';

const veganCoin = new web3.eth.Contract(VEGANCOIN_ABI, VEGANCOIN_ROPSTEN);
```

First, we connect to Infura, the Ethereum node provider. Note that we store the API key in cleartext, which is also an anti-secure practice, shown here for the demo only!

Next, we define the private key of our wallet (**don't do it at home!**), our wallet address and the ERC20 smart contract address.

Then we initiate a web3 Contract address with these constants.

## Displaying Token Balance

To display the app's token balance, we need to call the standard ERC20 method balanceOf with the address of our app's wallet. Querying the balance doesn't modify the state of the blockchain, so it's free in terms of gas.


```javascript
veganCoin.methods
  .balanceOf(OWNER)
  .call()
  .then(response => {
    document.getElementById('balance').innerHTML =
      'Owner Balance: ' + parseInt(response) / 1e18 + ' $VCN';
  });
```

All the ERC20 standard functions are available `under web3.Contract.methods`, here we call balanceOf and display the result on the page. To display the result properly we should account for the 18 decimals that this particular ERC20 token has, so we divide the response by 1E18.

## Transferring Tokens

In this demo we want to transfer tokens as soon as the app user clicks on the Send button. 

Here we get the "To" address and the amount from the user's input.
```javascript
// send tokens on click
document.getElementById('button').onclick = () => {
  const to = document.getElementById('to').value;
  const amount = document.getElementById('amount').value;
```

Now we can use these parameters to encode a smart contract call. The standard ERC20 function transfer() needs the _to_ address and a token amount, so we supply these two parameters and call `encodeABI` which translates our function call to a hexadecimal string that EVM understands.

```javascript

    const encoded = veganCoin.methods.transfer(to, amount * 1e18).encodeABI();
```

With the encoded function call we can now populate the transaction object.

```javascript
    const tx = {
      to: VEGANCOIN_ROPSTEN,
      data: encoded,
      gasLimit: 100000,
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
    };
```

To send this transaction, we must sign it with our private key and then send the signed transaction.
Once we get the transaction receipt, we simply log it to the console. 

```javascript
    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(signed => {
      web3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .on('receipt', console.log);
    });
  });
};
```

That's it! The web application transfers tokens without the need for a third-party tool or anything complicated.

Just to reiterate, this is a basic testnet demo. Under no circumstances should anybody expose their private key in a real application. In a more realistic scenario, user input goes to a server which validates it, prepares a transaction as explained above, signs it with a securely stored key and sends it to the blockchain.












  