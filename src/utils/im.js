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

export default chat;