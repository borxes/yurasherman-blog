---
date: "2019-09-20"
title: "Using Eztz Tezos Javascript library with React"
category: "Development"
layout: post
draft: false
path: "/posts/how-to-use-eztz-with-react"
tags: ["Tezos", "Javascript", "React"]
description: "How to connect to the Tezos blockchain using the Eztz library and React"
---

This is a brief tutorial for using [Eztz](https://github.com/TezTech/eztz) library with React.

## What is Eztz?

[Eztz](https://github.com/TezTech/eztz/wiki/Documentation) is a simple Javascript library for communicating with the Tezos blockchain. It can wrap any RPC call to a Tezos node via its `eztz.rpc` interfact, but let's be honest: the whole point of using a library is saving us the hastle of constructing RPC calls. That's why Eztz also gives us a few convenient APIs for interacting with Tezos smart contracting. Of course, these functions construct RPC calls and execute them under the hood.

## Adding Eztz to your React project

There is no NPM module for Eztz at the moment, so we cannot run `npm install eztz`. Actually, we can, but it will install a completely different `eztz` module, one that deals with date and time calculations.

What we will do, is add it directly to our dependencies in `package.json` of our `create-react-app`. 

Like so:

```javascript
{
  "dependencies": {
    "eztz": "git://github.com/TezTech/eztz.git#e1e5bd1fad83237219dd7723dcaf909c90ebc80b",
    "react": "^16.9.0",
}
```

That long hexadecimal number that comes in the end of the `eztz` line is the ID of the last commit to Eztz. We can always verify that it's indeed the latest commit on the [commits page](https://github.com/TezTech/eztz/commits/master). If a newer commit has been published, just use its ID instead.

Think about it as a bit of a quick and dirty hack to use the library until it's published to the NPM registry.

## Using Eztz in a React Project

Now that we've added Eztz, we can call it from our React project. But first, we have to set a provider.

A provider is a Tezos full node that is nice enough to respond to our RPC calls. Like what [Infura](https://infura.io) is to the Ethereum blockchain, we need a public node to work with. We can also work with our own node (see my tutorial on [installing a Tezos alphanet node](https://yurasherman.com/posts/how-to-install-tezos-alphanet-node)), but this will take some time to install.

At the moment of writing, [Cryptonomic](https://cryptonomic.tech), a US company developing on Tezos, offers provider nodes:
- `https://tezos-dev.cryptonomic-infra.tech` for the Alphanet
- `https://tezos-prod.cryptonomic-infra.tech` for the Mainnet

Before we interact with the Tezos blockchain, we connect to a provider  like so:
```javascript
eztz.node.setProvider("https://tezos-dev.cryptonomic-infra.tech")
```

Now we're ready to talk to any smart contract deployed on the Tezos blockchain (in this case, the Alphanet).

## Eztz Demo

In this small [demo](https://jolly-elion-ba96a7.netlify.com/) we interact with a certifier [contract](https://better-call.dev/alpha/KT1PuiY1QmvY7tvrbm94AoUDtEpqiA7BybZG/operations) that stores certified addresses in its storage.

We want to ask it if a particular address is certified, so we will use `eztz.contract.storage` to retrieve the contract's storage and search it for a given address, like so:

```javascript
  eztz.contract.storage(CONTRACT_ADDR)
      .then(contractStorage => {
        const students = contractStorage.args[0];
        }
```

This code retrieves the list of certified addresses from the smart contract's storage and now we run any query on the data. In a similar fashion, we can  send transactions to the smart contract with `eztz.contract.send`.

That's it! We've connected to the Tezos blockchain from a React project. Eztz is a basic library and in the next tutorial we will see how to use [ConseilJS](https://github.com/Cryptonomic/ConseilJS), a more advanced Tezos library, in our React app.

The source code for this tutorial is on [Github](https://github.com/borxes/eztz-react-demo).



