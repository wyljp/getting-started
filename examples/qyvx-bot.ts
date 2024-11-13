import { ScanStatus, WechatyBuilder, log } from '@juzi/wechaty'
// @ts-ignore
import QrcodeTerminal from 'qrcode-terminal'
import axios from 'axios'
import fs from 'fs'
const filePath = './verifyCode.txt'
// 验证码
const store = {
  qrcodeKey: '',
}
async function onVerify (id:any, message:any, scene:any, status:any) {
  log.info('store qrcodeKey ====>', store.qrcodeKey)
  log.info('>>>>>>>>=======onVerify=======>>>>>>', id, message)
  // 需要注意的是，验证码事件不是完全即时的，可能有最多10秒的延迟。
  // 这与底层轮询二维码状态的时间间隔有关。
  if (status === 1 && scene === 1 && id === store.qrcodeKey) {
    log.info(`receive verify-code event, id: ${id}, message: ${message}, scene: ${scene} status: ${status}`)
    // const verifyCode = '058948' // 通过一些途径输入验证码
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const verifyCode = fileContent
    try {
      await bot.enterVerifyCode(id, verifyCode) // 如果没抛错，则说明输入成功，会推送登录事件
    } catch (e:any) {
      log.info(e.message)
      // 如果抛错，请根据 message 处理，目前发现可以输错3次，超过3次错误需要重新扫码。
      // 错误关键词: 验证码错误输入错误，请重新输入
      // 错误关键词：验证码错误次数超过阈值，请重新扫码'
      // 目前不会推送 EXPIRED 事件，需要根据错误内容判断
    }
  }
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
    console.error('getZhiPuRes', error)
  }
}

const token = 'puppet_workpro_224dd51d0354496eae06e0592a63ae1c' // put your token here
const bot = WechatyBuilder.build({
  puppet: '@juzi/wechaty-puppet-service',
  puppetOptions: {
    authority: 'token-service-discovery-test.juzibot.com',
    tls: {
      disable: true,
      // currently we are not using TLS since most puppet-service versions does not support it. See: https://github.com/wechaty/puppet-service/issues/160
    },
    token,
  },
})
bot.on('verify-code', onVerify)

bot.on('scan', (qrcode, status, data:any) => {
  log.info(`
  ============================================================
  qrcode : ${qrcode}, status: ${status}, data: ${data}
  ============================================================
  `)
  if (data) {
    log.info(typeof data, JSON.parse(data))
    store.qrcodeKey = JSON.parse(data).key
  }
  if (status === ScanStatus.Waiting) {
    QrcodeTerminal.generate(qrcode, {
      small: true,
    })
  }
}).on('login', user => {
  log.info(`
  ============================================
  user: ${JSON.stringify(user)}, friend: ${user.friend()}, ${user.coworker()}
  ============================================
  `)
}).on('message',  async message => {
  const testRoomId = 'R:10820989098193921'
  const ztRoommId = 'R:1307056438'
  const text = message.payload?.text
  log.info(`new message received: ${JSON.stringify(message)}`)
  if (message.payload?.roomId === testRoomId && text) {
    const res = await getZhiPuRes(text)
    log.info('response', res)
    message.say(res)
  }
}).on('error', err => {
  log.error('getZhiPuRes', err)
})
// bot.logout()
bot.start()
