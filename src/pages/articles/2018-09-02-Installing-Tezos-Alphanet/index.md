---
date: "2019-09-03"
title: "Installing a Tezos Alphanet Node"
category: "Development"
layout: post
draft: false
path: "/posts/how-to-install-tezos-alphanet-node"
tags: ["Tezos"]
description: "Tezos Alphanet node installation tutorial."
---

As a student in the B9Lab's [Tezos Developer Course](https://academy.b9lab.com/courses/course-v1:B9lab+BLOCKSTARS-TEZ-1+2019-04/info), I've installed a full Tezos Alphanet node on a server.

The procedure proved to be a bit trickier than what is described in the docs, so this article will share some information learnt along the way. Hopefully it will help other new Tezos developers.

## Choose The Right VPS

As I've discovered the hard way, your server needs at least 4GB RAM. I recommend 8GB to synch the blockchain faster. The recommended OS is Ubuntu 18.04 LTS offered by the maojr VPS providers.

As of today, the alphanet blockchain is about 61.5GB so you need 80GB SSD storage on your machine.

I've been using a [Hetzner](https://www.hetzner.com) VPS with 160GB SSD storage and 16GB RAM, so the whole synching process took about 36 hours. It will take longer if you have less RAM.

Other good VPS providers that I recommend are [DigitalOcean](https://m.do.co/c/b76b363cdc21), [Linode](https://www.linode.com/?r=0fb15cb08ca7516d4381a1669bd9919602e320f9) and [Amazon](https://aws.amazon.com/lightsail/).



## Preparing the VPS

Once you get your VPS, create a new user, add it to the sudo group and do the necessary security hardening described in multiple VPS guides.

Once you're ready, install Docker exactly as described in the [official installation guide](https://docs.docker.com/install/linux/docker-ce/ubuntu/).

Next, install Docker Compose as described [here](https://docs.docker.com/compose/install/) in the Linux section. Tezos needs it because it requires multiple containers, one for each network component (node, endorser, accuser, baker and client).

The last preparation step is to add your current user to the docker group like so:
`sudo usermod -a -G docker $USER`

This will prevent the `docker: Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock` error message.

## Installing Alphanet

Follow the official [guide](https://tezos.gitlab.io/alphanet/introduction/howtoget.html) to download the alphanet.sh script and run it

`./alphanet.sh start`

The node will start synchronizing the blockchain. You can run  `./alphanet.sh bootstrapped` to see the blocks downloaded in real-time.

There is one issue with this process. Sometimes, the node will think that he's already received the latest block and will stop synchronizing.

Here is how this problem is explained on the [Tezos StackExchange](https://tezos.stackexchange.com/questions/1117/tezos-client-bootstrapped-why-it-quits-too-early-really-without-waiting-boot)

> There is no indicator on the blockchain or the node to know if the chain is at latest or "bootstrapped".  That's how blockchains work. At any moment there could be a new block or a new fork of the chain. The only way for your node to know if your local stored version of the blockchain is the  
source of truth is by asking other node peers on the network. As you already know, the way to do this 
is via tezos-client bootstrapped.

The author suggests increasing the threshold for how many node peers confirm bootstrapped status.

I've followed his recommendation and set the bootstrap threshold to 20. Edit the alphanet.sh script, find the command that runs `tezos-node` and add `--bootstrap-threshold=20` to the command, so the relevant script section looks like this:

```
services:

  node:
    image: $docker_image
    hostname: node
    command: tezos-node --net-addr :$port $@ --bootstrap-threshold=20
```

    
Then run `./alphanet.sh stop; ./alphanet.sh start`. Don't use `./alphanet.sh restart` as it will update the script and write over your changes.

I've found that this change reduces the chances of the node stopping the bootstrap process prematurely. So I still needed to stop and start the node a couple of times, after seeing that it doesn't download new blocks.

You can check the progress by running `docker system df -v` and making sure that `alphanet_node_data` size keeps growing. If it doesn't download new blocks for a while, simply stop and start the node.

So here it is in a nutshell. Installing a Tezos Alphanet node is not complicated, but it also has a few quirks so you have to check on the bootstrap and gently nudge it a few times by restarting.

## Alternative Installations

Another option for installing a Tezos Alphanet node is to download a snapshot. At the moment, the snapshots for all three Tezos network (mainnet, alphanet and zeronet) are available at [Tulip Tools](https://snapshots.tulip.tools/#/).

Thanks for reading and hope it helps.
