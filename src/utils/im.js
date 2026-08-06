import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import NetInfo from '@react-native-community/netinfo';

const options = {
  SDKAppID: '1600137039',
};

const chat = TencentCloudChat.create(options);

// 日志等级（开发建议开）
chat.setLogLevel(0);

// 注册插件
chat.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
chat.registerPlugin({ 'chat-network-monitor': NetInfo });


/**
 * 获取所有会话未读总数
 */
export function getTotalUnreadCount() {
  try {
    return chat.getTotalUnreadMessageCount();
  } catch (error) {
    console.log('获取未读总数失败:', error);
    return 0;
  }
}


export default chat;