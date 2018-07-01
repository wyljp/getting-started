# WECHATY-GETTING-STARTED

Wechaty is a Bot Framework for Wechat **Personal** Accounts which can help you create a bot in 6 lines of javascript by an easy to use API, with cross-platform support including [Linux](https://travis-ci.org/wechaty/wechaty), [Windows](https://ci.appveyor.com/project/wechaty/wechaty), [Darwin(OSX/Mac)](https://travis-ci.org/wechaty/wechaty) and [Docker](https://circleci.com/gh/wechaty/wechaty).

[![Join the chat at https://gitter.im/zixia/wechaty](https://badges.gitter.im/zixia/wechaty.svg)](https://gitter.im/zixia/wechaty?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![node](https://img.shields.io/node/v/wechaty.svg?maxAge=604800)](https://nodejs.org/)

:octocat: <https://github.com/wechaty/wechaty>  
:beetle: <https://github.com/wechaty/wechaty/issues>  
:book: <https://github.com/wechaty/wechaty/wiki>  
:whale: <https://hub.docker.com/r/zixia/wechaty>  

Wechaty is super easy to use, especially when you are using Docker.   
This repo contains the code for the video tutorial.   

Functions as follows:

1. Show a QR Code for scan
1. Login with your user information
1. Log all the messages to console

<div align="center">
<a target="_blank" href="https://blog.chatie.io/getting-started-wechaty/"><img src="https://cloud.githubusercontent.com/assets/1361891/21722581/3ec957d0-d468-11e6-8888-a91c236e0ba2.jpg" border=0 width="60%"></a>
</div>

Above is a 10 minute video tutorial, which is a good way to start if you are new to Wechaty.

Learn more about wechaty: [Wechaty](https://github.com/chatie/wechaty "Wechaty")

## RUN

You can run Wechaty in two modes:

1. NPM Mode
1. Docker Mode

### 1. NPM

```sh
git clone https://github.com/lijiarui/wechaty-getting-started.git
cd wechaty-getting-started

npm install

# Run Bot in JavaScript
node examples/simplest-bot/bot.js

# Run Bot in TypeScript
./node_modules/.bin/ts-node examples/simplest-bot/bot.ts
```

### 2. Docker

```sh
git clone https://github.com/lijiarui/wechaty-getting-started.git
cd wechaty-getting-started

# Run Bot in TypeScript
docker run -ti --volume="$(pwd)":/bot --rm zixia/wechaty examples/simplest-bot/bot.ts

# Run Bot in JavaScript
docker run -ti --volume="$(pwd)":/bot --rm zixia/wechaty examples/simplest-bot/bot.js
```
