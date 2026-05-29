import React,{useRef,useState,useEffect} from 'react';
import { View, Text, Image, TouchableOpacity,Clipboard,StyleSheet,
Alert,Modal,Platform
 } from 'react-native';
import { px } from '../../../utils/scaleUtils';
import ContextMenu from "react-native-context-menu-view";
import {Toast } from '@ant-design/react-native';
import  chat  from '../../../utils/im';
import ImageViewer from 'react-native-image-zoom-viewer';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ReactNativeBlobUtil from 'react-native-blob-util'
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-nitro-sound';
import VoiceWave from './VoiceWave';
import { IMG_URL } from '../../../api/config';
import SafeFastImage from '../../../components/Home/SafeFastImage'




interface MessageItemProps {
  item: any;
  showTime: boolean;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;

  playingId: string | null;
  setPlayingId: (id: string | null) => void;

  paused: boolean;
  setPaused: (p: boolean) => void;
}
const calcImageSize = (w, h) => {
  const maxWidth = px(180);
  const maxHeight = px(240);

  let width = w;
  let height = h;

  // 宽超了
  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = height * ratio;
  }

  // 高再超
  if (height > maxHeight) {
    const ratio = maxHeight / height;
    height = maxHeight;
    width = width * ratio;
  }

  return { width, height };
};

  const myAvatar = require('../../../../assets/images/my/defultavtar1.png');
  const otherAvatar = require('../../../../assets/images/my/applogo1.png');

const MessageItem = React.memo(({ 
  item, 
  showTime, 
  setMessages,
  playingId,
  setPlayingId,
  paused,
  setPaused
 }:MessageItemProps) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewUri, setPreviewUri] = useState('');
    const [size, setSize] = useState({ width: px(180), height: px(240) });
    const itemRefs = useRef({});
//     const [playingId, setPlayingId] = useState(null);
// const [paused, setPaused] = useState(false);
const currentUrlRef = useRef(null);
    const isMe = item.isMe;
const images = previewUri
  ? [ 
      {
        url: previewUri,
      },
    ]
  : [];
const actions = [
  // ⭐ 只有文本才显示复制
...(item.contentType!=="image" && !item.isAudio
  ? [{ title: "复制", systemIcon: "doc.on.doc" }]
  : []),

  // ⭐ 自己的消息才有撤回
  // ...(isMe
  //   ? [
  //       {
  //         title: "撤回",
  //         systemIcon: "arrow.uturn.backward",
  //         destructive: true,
  //       },
  //     ]
  //   : []),
];
const renderAudio = () => {
   console.log(item);
  const uri = item.rawMessage.payload.remoteAudioUrl ||  item.rawMessage.payload.url;
  const isPlaying = playingId === item.id && !paused;
 console.log('status:',isPlaying,playingId,item.id,paused);
 
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => playVoice(uri, item.id)}
    >
      <View
        style={{
          flexDirection: item.isMe ? 'row-reverse' : 'row',
          alignItems: 'center',
          backgroundColor: item.isMe ? '#8CE762' : '#fff',
          paddingHorizontal: px(12),
          height: px(42),
          borderRadius: px(6),
          //width: getAudioWidth(item.duration),
        }}
      >
        {/* 喇叭图标 */}
        <View style={{left:-px(10)}}>
        <VoiceWave isPlaying={isPlaying} isme={item.isMe}
        key={item.id + '_' + isPlaying} />
        </View>


        {/* 时长 */}
        <Text
          style={styles.audiotx}
        >
         {item.duration}"
        </Text>
      <View style={{width: px(20),}}></View>
      {/* 发送中 */}
        {item.status === 'sending' && (
          <Text style={{ color: '#999' }}>...</Text>
        )}

        {/* 失败 */}
        {item.status === 'fail' && (
          <Text style={{ color: 'red' }}>!</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
    useEffect(() => {
  if (item.contentType=="image" && item.content) {
    Image.getSize(IMG_URL+item.content, (w, h) => {
      const result = calcImageSize(w, h);
      setSize(result);
    });
  }
}, [item.content]);
    const handleCopy = (text) => {
    Clipboard.setString(text);
         Toast.show({
            content: '已复制',
            duration: 1,
            position: 'center',
            mask: false,
          })
};
    // 时间格式化
const formatTime = (timeString) => {
  // ISO 时间格式直接解析
  const date = new Date(timeString);
  const now = new Date();

  // 今天 00:00
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  // 昨天 00:00
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  // 7天前
  const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;

  const time = date.getTime();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const HM = `${hours}:${minutes}`;

  // ✅ 今天
  if (time >= todayStart) {
    return HM;
  }

  // ✅ 昨天
  if (time >= yesterdayStart) {
    return `昨天 ${HM}`;
  }

  // ✅ 7天内
  if (time >= weekStart) {
    const weekMap = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];

    return `${weekMap[date.getDay()]} ${HM}`;
  }

  // ✅ 超过7天
  const year = date.getFullYear();
  const month = (date.getMonth() + 1)
    .toString()
    .padStart(2, '0');

  const day = date.getDate()
    .toString()
    .padStart(2, '0');

  return `${year}/${month}/${day} ${HM}`;
};
    if (item.isRevoked) {
  return (
    <View style={{ alignItems: 'center', marginVertical: px(10) }}>
      <Text
        style={{
          fontSize: px(12),
          color: '#999',
          backgroundColor: '#EAEAEA',
          paddingHorizontal: px(8),
          paddingVertical: px(2),
          borderRadius: px(4),
        }}
      >
        {item.isMe ? '你撤回了一条消息' : '对方撤回了一条消息'}
      </Text>
    </View>
  );
  };
    const handledownimg = async() => {  //下载图片
      console.log('imageurl:',previewUri);
        try {
      let imageUrl=previewUri
      // 自动从 URL 提取扩展名（jpg/png/jpeg/gif 等）
      const urlParts = imageUrl.split('.');
      let ext = urlParts[urlParts.length - 1];
      // 防止 URL 没有扩展名，默认 png
      if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext.toLowerCase())) {
        ext = 'png';
      }

      // 临时保存路径
      const dirs = ReactNativeBlobUtil.fs.dirs;
      const localPath =
        Platform.OS === 'android'
          ? `${dirs.CacheDir}/${Date.now()}.${ext}`
          : `${dirs.DocumentDir}/${Date.now()}.${ext}`;

      // 下载到本地
      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: ext,
        path: localPath,
      }).fetch('GET', imageUrl);
      console.log(res);
        // 保存到相册
      const savedUri = await CameraRoll.save(
        Platform.OS === 'android' ? 'file://' + res.path() : res.path(),
        { type: 'photo', album: 'MyApp' }
      );
      //setShowActionSheet(false);
      console.log('保存成功:', savedUri);
      Alert.alert('保存成功', '图片已保存到相册');
    } catch (error) {
      //setShowActionSheet(false);
      console.log('保存失败:', error);
      Alert.alert('保存失败', '请检查相册权限');
    }
      };
  const playVoice = async (url, id) => {
    try {
      // 点当前 → 暂停/继续
      if (playingId === id) {
        if (paused) {
          await Sound.resumePlayer();
          setPaused(false);
        } else {
          await Sound.pausePlayer();
          setPaused(true);
        }
        return;
      }

      // ⭐停止之前的
      await Sound.stopPlayer();
      Sound.removePlayBackListener();

      // ⭐先清空（防止动画残留）
      setPlayingId(null);

      // ⭐再设置新的
      setPlayingId(id);
      setPaused(false);

      await Sound.startPlayer(url);

      Sound.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
          Sound.stopPlayer();
          Sound.removePlayBackListener();

          setPlayingId(null);
          setPaused(false);
        }
      });

    } catch (e) {
      console.log('播放失败', e);
      setPlayingId(null);
      setPaused(false);
    }
  };
   return (
    <View>
      {showTime && (
        <View style={{
          alignItems: 'center',
          marginVertical: px(10),
        }}>
          <Text style={{
            fontSize: px(12),
            color: '#999',
            backgroundColor: '#EAEAEA',
            paddingHorizontal: px(8),
            paddingVertical: px(2),
            borderRadius: px(4),
          }}>
            {formatTime(item.sendTime)}
          </Text>
        </View>
      )}

      <View style={{
        flexDirection: item.isMe ? 'row-reverse' : 'row',
        marginVertical: px(6),
        alignItems: 'flex-start',
      }}>
    <SafeFastImage
      source={
        item.isMe
          ? item?.senderAvatar
            ? { uri: IMG_URL + item.senderAvatar }
            : require('../../../../assets/images/my/defultavtar1.png')
          : item?.senderAvatar
          ? { uri: IMG_URL + item.senderAvatar }
          : require('../../../../assets/images/my/defultavtar1.png')
      }
      style={{
        width: px(43),
        height: px(43),
        borderRadius: px(4),
      }}
    />
    <View>
      {!item.isMe&&
      <Text style={styles.nickname}>{item?.senderName}</Text>
      }
    <ContextMenu
       actions={actions}
     onPress={(e) => {
  const { name } = e.nativeEvent;

  if (name === "复制") {
    handleCopy(item.content);
  }

 if (name === "撤回") {
  Alert.alert(
    "撤回消息",
    "确定要撤回这条消息吗？",
    [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "确定",
        style: "destructive",
        onPress: () => {
          chat.revokeMessage(item.rawMessage)
            .then(() => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === item.id
                    ? { ...msg, isRevoked: true }
                    : msg
                )
              );
            })
            .catch(err => {
              Toast.show({
                content: '已超过2分钟，无法撤回',
                duration: 1,
                position: 'center',
                mask: false,
              });
              console.log('撤回失败', err);
            });
        },
      },
    ]
  );
}
}}
    >
        <TouchableOpacity
        activeOpacity={1}
          style={{
            maxWidth: px(252),
            //padding: px(10),
            marginTop:item.isMe?0: px(6),
            //borderRadius: px(4),
            marginHorizontal: px(12),
            //backgroundColor: '#fff',
          }}
        >
          {/* <Text style={{ fontSize: px(17), color: '#1A1A1A' }}>
            {item.content}
          </Text> */}
  {item.contentType=="image" ? (
    <TouchableOpacity
  activeOpacity={0.9}
  onPress={() => {
    setPreviewUri(IMG_URL+item.content);
    setPreviewVisible(true);
  }}
>
  <SafeFastImage
  source={{
    uri: IMG_URL+item.content,
    //priority: FastImage.priority.normal,
    //cache: FastImage.cacheControl.immutable, // ⭐强缓存（推荐IM用）
  }}
  style={{
    width: size.width,
    height: size.height,
    borderRadius: px(6),
  }}
  resizeMode="contain"
  //resizeMode={FastImage.resizeMode.cover}
  />
  </TouchableOpacity>
) : item.isAudio ? (
  renderAudio()
) : (
  <View style={{backgroundColor:item.isMe ? '#8CE762' : '#fff',padding: px(10),borderRadius: px(4),}}>
  <Text style={styles.messageText}>
    {item.content}
  </Text>
  </View>
)}
        </TouchableOpacity>
        </ContextMenu>
        </View>

        
      </View>

<Modal
  visible={previewVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setPreviewVisible(false)}
  statusBarTranslucent={true}
>
  <View style={{ flex: 1, backgroundColor: "black" }}>
    {previewVisible && previewUri ? (
      <ImageViewer
      onClick={() => setPreviewVisible(false)}
        imageUrls={[{ url: previewUri }]}
        enableSwipeDown
        onSwipeDown={() => setPreviewVisible(false)}
        onCancel={() => setPreviewVisible(false)}
        backgroundColor="black"
        useNativeDriver={true}
        doubleClickInterval={500}
        saveToLocalByLongPress={false}
        onLongPress={() => {
      Alert.alert(
      "保存图片",
      "是否保存到相册？",
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "保存",
          onPress: () =>handledownimg(),
        },
      ]
      );
      }}
        renderIndicator={() => null}
          onSave={(url) => {
    console.log("保存图片URL:", url);

    // 你在这里自己写保存逻辑
  }}
      />
    ) : null}
  </View>
</Modal>

    {/* <ImageView
  images={images}
  imageIndex={0} 
  visible={previewVisible}
  onRequestClose={() => setPreviewVisible(false)}
  /> */}
    </View>
  );
});

export default MessageItem;
const styles = StyleSheet.create({
  nickname:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
        marginLeft: px(12),
  },
  audiotx:{
      fontFamily: 'MiSans-Regular',
      fontSize:px(13),
      color:'#1A1A1A',
      fontWeight:400,
      lineHeight:px(17),
  },
  messageText:{
    fontSize: px(17),
    color: '#1A1A1A'
  }
})