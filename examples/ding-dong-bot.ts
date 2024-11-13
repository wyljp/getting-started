#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'
import axios from 'axios'
import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
}                  from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'

function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function getZhiPuRes (msg:any) {
  const endpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  const apiKey = '73f90711fd136e2c83ec4eca0bf9c545.lxh8IarqhyM4eYob'
  const params = {
    messages: [
      {
        content: msg,
        role: 'user',
      },
    ],
    model: 'glm-4',
  }
  try {
    const response = await axios.post(endpoint, JSON.stringify(params), {
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
    })
    log.info('getZhiPuRes', response.data.choices.map((item:any) => item.message.content).join(''))
    return response.data.choices.map((item:any) => item.message.content).join('')
  } catch (error) {
    log.error('getZhiPuRes', error)
  }
}

async function onMessage (msg: Message) {
  log.info('StarterBot', JSON.stringify(msg))
  const homeGroupId = '@@d3b7489064d5f5656378a47e125a9a94af0c142633db986961ceef515f6bde1d'
  const ljpTestGroupId = '@@6d8b369ad32c83e6b52fb12e7656a7bcd2d60e3de29de3344f0a87f4b9bb87fc'
  const zhongtaiGroupId = '@@9624fcd98efe5f60e9504425ee4fb88522f600efe5c8e0dc2c9338d601a7fac6'
  if (msg.payload?.roomId === zhongtaiGroupId) {
    if (msg.text()) {
      const resMsg = await getZhiPuRes(msg.text())
      await msg.say(resMsg)
    }
  }
}

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot-1111',
  /**
   * You can specific `puppet` and `puppetOptions` here with hard coding:
   *
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,
  },
   */
  /**
   * How to set Wechaty Puppet Provider:
   *
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-whatsapp' }`, see below)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-whatsapp`)
   *
   * You can use the following providers locally:
   *  - wechaty-puppet-wechat (web protocol, no token required)
   *  - wechaty-puppet-whatsapp (web protocol, no token required)
   *  - wechaty-puppet-padlocal (pad protocol, token required)
   *  - etc. see: <https://wechaty.js.org/docs/puppet-providers/>
   */
  // puppet: 'wechaty-puppet-whatsapp'

  /**
   * You can use wechaty puppet provider 'wechaty-puppet-service'
   *   which can connect to remote Wechaty Puppet Services
   *   for using more powerful protocol.
   * Learn more about services (and TOKEN) from https://wechaty.js.org/docs/puppet-services/
   */
  // puppet: 'wechaty-puppet-service'
  // puppetOptions: {
  //   token: 'xxx',
  // }
})

// getZhiPuRes('你会干嘛').catch(() => {})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
