import WKSDK, {
  MessageText,
  Channel,
  ChannelTypePerson,
  ChannelTypeGroup,
} from 'wukongimjssdk'

const sdk = WKSDK.shared()

// 初始化
export const initIM = ({ uid, token }) => {
  sdk.config.addr = 'ws://47.109.185.211:5200'
  sdk.config.uid = uid
  sdk.config.token = token
}

// 连接
export const connectIM = () => {
  console.log('开始连接IM...')
  sdk.connectManager.connect()
}

// 断开
export const disconnectIM = () => {
  sdk.connectManager.disconnect()
}

// 监听连接状态
export const onConnectStatus = (callback) => {
  sdk.connectManager.addConnectStatusListener((status, reasonCode) => {
    console.log('IM状态:', status, reasonCode)

    callback && callback(status, reasonCode)
  })
}

/**
 * ✅ 发送文本消息（单聊/群聊统一）
 */
export const sendTextMessage = (text, { channelId, channelType }) => {
  if (!text?.trim()) return

  const msg = new MessageText(text)
  const channel = new Channel(channelId, ChannelTypePerson)

  return sdk.chatManager.send(msg, channel)
}

/**
 * ✅ 监听发送状态
 */
export const onMessageStatus = (callback) => {
  const listener = (packet) => {
    console.log('发送状态:', packet)
    callback && callback(packet)
  }

  sdk.chatManager.addMessageStatusListener(listener)

  return () => {
    sdk.chatManager.removeMessageStatusListener(listener)
  }
}

/**
 * ✅ 监听普通消息（收消息）
 */
export const onMessage = (callback) => {
  const listener = (message) => {
    console.log('收到消息:', message)
    callback && callback(message)
  }

  sdk.chatManager.addMessageListener(listener)

  return () => {
    sdk.chatManager.removeMessageListener(listener)
  }
}

/**
 * ✅ 监听 CMD 消息（可选）
 */
export const onCMDMessage = (callback) => {
  const listener = (message) => {
    callback && callback(message)
  }

  sdk.chatManager.addCMDListener(listener)

  return () => {
    sdk.chatManager.removeCMDListener(listener)
  }
}

// 导出 sdk（后面发消息会用）
export default sdk