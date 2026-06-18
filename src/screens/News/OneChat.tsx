import { StyleSheet, Text, View,TouchableOpacity,Keyboard,
    Image,TextInput,FlatList,KeyboardAvoidingView,Platform,Animated,
    SafeAreaView,Pressable,ScrollView,Vibration,Alert,PermissionsAndroid,
ActivityIndicator,
 } from 'react-native'
import React,{useState,useEffect,useRef,useCallback} from 'react'
import { px } from '../../utils/scaleUtils';
import  chat  from '../../utils/im';
import  MessageItem  from './components/MessageItem';
 import TencentCloudChat from '@tencentcloud/chat';
import {
  NoticeBar,
} from '@ant-design/react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { check, request, PERMISSIONS, RESULTS, } from 'react-native-permissions';
import {
  Modal,
  Toast,
List,
Tooltip,
} from '@ant-design/react-native'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Sound from 'react-native-nitro-sound';
import RNHapticFeedback from "react-native-haptic-feedback";
import  {  impact,Patterns  }  from  "react-native-haptic-feedback" ; 
import apiRequest from '../../api/request';
import Storage from '../../utils/storage';
import  {uploadImage}  from '../../api/uploadImage';
import {IMG_URL } from '../../api/config';
import ImageResizer from '@bam.tech/react-native-image-resizer';




 const EMOJIS = [
  // 😀 常用表情
  '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊',
  '🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚',

  // 🤔 情绪类
  '🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮',
  '🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝',

  // 😢 哭/难过
  '😢','😭','🥲','😿','😞','😓','😔','😕','🙁','☹️',

  // 😡 生气
  '😡','😠','🤬','😤','😾',

  // 😳 惊讶
  '😳','😱','😨','😰','😥',

  // 🤢 生病
  '🤒','🤕','🤢','🤮','🥴','😷','🤧',

  // 😎 个性
  '😎','🤓','🧐','😕','😟',

  // 👍 手势（微信高频）
  '👍','👎','👌','✌️','🤞','🤟','🤘','👏','🙌','👐',
  '👊','✊','🤛','🤜','🙏',

  // ❤️ 情感
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎',
  '💔','❣️','💕','💞','💓','💗','💖','💘',

  // 🎉 场景
  '🎉','🎊','🎈','🎂','🍰','🍻','🥂',

  // 🔥 常用符号
  '🔥','✨','⭐','💫','💥','💢','💯',

  // 🐶 动物（微信也常用）
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',

  // 🍔 食物
  '🍎','🍊','🍌','🍉','🍇','🍓','🍒','🍑',
  '🍔','🍟','🍕','🌮','🍜','🍣','🍩','🍪'
];
const loginUserID = Platform.OS === 'ios' ? 'user1' : 'user2';
export default function OneChat({navigation,route}) {
  const { item } = route.params;
   console.log('zheshi1item',item);
   
    const insets = useSafeAreaInsets();
   const [isonline, setIsonline] = useState(true); //是否在线
   const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
    const [isclose, setIsclose] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const listRef = useRef(null);
  const [nextReqMessageID, setNextReqMessageID] = useState(null);
const [loadingMore, setLoadingMore] = useState(false);
const [isCompleted, setIsCompleted] = useState(false); // 是否加载完
const [firstLoaded, setFirstLoaded] = useState(false);
const [isVoiceMode, setIsVoiceMode] = useState(false); // 是否语音模式
const [isRecording, setIsRecording] = useState(false); // 是否正在录音
const [recordTime, setRecordTime] = useState('00:00');
const [recordSeconds, setRecordSeconds] = useState(0);
const [isCancel, setIsCancel] = useState(false); // 是否取消发送
const panelAnim = useRef(new Animated.Value(0)).current;
const [panelType, setPanelType] = useState(null);
const panelRef = useRef(null);
const bubbleRef = useRef<View | null>(null);
const [playingId, setPlayingId] = useState(null);
const [paused, setPaused] = useState(false);
const [opentime, setOpentime] = useState({isOnline:false,businessText:"09:00-22:00"});//营业时间
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMoreApi, setLoadingMoreApi] = useState(false);




const scrollToBottom = (animated = false) => {
  requestAnimationFrame(() => {
    listRef.current?.scrollToOffset({
      offset: 0, // ⭐关键
      animated,
    });
  });
};
useEffect(() => {
  if (keyboardVisible) {
    scrollToBottom();
  }
}, [keyboardVisible, messages.length]);
  const sendMessage = () => {
    if (!text.trim()) return;
    console.log(item.storeName);
    if(item.storeName){ //存在就是用户发送消息
    usersendmessage();
    }else{ //不存在就是客服发送消息
    kefusendmessage()
    }
//     const id = item.conversationID;
// const userId = id.replace("C2C", "");
// //发送消息
// const toUserID =
//   loginUserID === 'user1' ? 'user2' : 'user1';

// const message = chat.createTextMessage({
//   to: userId,
//   conversationType: TencentCloudChat.TYPES.CONV_C2C,
//   payload: {
//     text,
//   },
// });
// chat.sendMessage(message)
//   .then(res => {
//     console.log('✅ 发送成功 ->',);
//         const msg = res.data.message;

//     const newMsg = {
//       id: msg.ID,
//       content: msg.payload.text,
//       isMe: true,
//       time: msg.time,
//       rawMessage: msg, // ⭐关键
//       isRevoked: msg.isRevoked || false,
//     };

//     setMessages(prev => [newMsg,...prev]);
//       chat.setMessageRead({
//     conversationID: item.conversationID,
//   });
//   })
//   .catch(err => {
//     console.log('❌ 发送失败', err);
//   });
    //setText('');
    scrollToBottom();
  };
  const usersendmessage = async() => {
    console.log(text);
    try {
      const response = await apiRequest({
        url: '/message/send',
        method: 'POST',
        data: {
        sessionId: item.id,
        storeId: item.storeId,
        contentType: "text",
        content: text,
        duration: 0
        },
        query: {
      
        },
          }); 
        console.log('message',response);
        if (response.data !== null && response.code == 0) {
        gethistory();
        setText('');
        }else{
          handleCloseAll();
          Toast.fail({
           content: response.data,
           duration: 2,
           position: 'center',
           mask: false,
         })
        }
    } catch (error) {
    console.error(error);
    }
  }
  const kefusendmessage = async() => {
        try {
      const response = await apiRequest({
        url: '/message/reply',
        method: 'POST',
        data: {
        userId:item.userId,
        sessionId: item.sessionId,
        storeId: item.storeId,
        contentType: "text",
        content: text,
        //duration: 0
        },
        query: {
      
        },
          }); 
        console.log('message',response);
        if (response.data !== null && response.code == 0) {
        gethistory();
        setText('');
        }else{
          handleCloseAll();
     Toast.fail({
           content: response.data,
           duration: 2,
           position: 'center',
           mask: false,
         })
        }
    } catch (error) {
    console.error(error);
    }
  }

const renderItem = useCallback(({ item, index }) => {
  const prev = messages[index + 1];
  const showTime = shouldShowTimee(item, prev);

  return (
    <MessageItem
      setMessages={setMessages}
      item={item}
      showTime={showTime}
      playingId={playingId}
      setPlayingId={setPlayingId}
      paused={paused}
      setPaused={setPaused}
    />
  );
}, [messages, playingId, paused]);
 // 是否显示时间（微信规则）
const shouldShowTime = (current, prev) => {
  if (!prev) return true;

  const diff = current.time - prev.time;
  return diff > 5 * 60; // 超过5分钟显示
};
const shouldShowTimee = (current, prev) => {

  if (!prev) return true;

  const currentTime = new Date(current.sendTime).getTime();

  const prevTime = new Date(prev.sendTime).getTime();

  // 毫秒转秒
  const diff = (currentTime - prevTime) / 1000;

  return diff > 5 * 60;
};

// 初始值：安全区（避免首次闪动）
const bottomAnim = useRef(
  new Animated.Value(insets.bottom || px(12))
).current;
useEffect(() => {
  const showEvent =
    Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  const hideEvent =
    Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

  const showSub = Keyboard.addListener(showEvent, () => {
    setKeyboardVisible(true);
    Animated.timing(bottomAnim, {
      toValue: px(12), // 键盘弹起固定 12
      duration: 150,
      useNativeDriver: false, // padding 必须 false
    }).start();
   setPanelType(null);
  // Animated.timing(panelAnim, {
  //   toValue: 0,
  //   duration: 0,
  //   useNativeDriver: false,
  // }).start();
  });

  const hideSub = Keyboard.addListener(hideEvent, () => {
    setKeyboardVisible(false);
      // ❗如果是面板触发的 dismiss → 不处理
  if (panelRef.current) return;
    Animated.timing(bottomAnim, {
      toValue: insets.bottom || px(12), // 恢复安全区
      duration: 100,
      useNativeDriver: false,
    }).start();
  });
  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, [insets.bottom]);
  const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     const handlesubmit = () => { 
    console.log(2132131);
    sendMessage();
    };
      const handleclose = () => { 
      setIsclose(true)
       };
const formatMessage = (msg) => {
  const type = msg.type;

  // 文本
  const isText = type === TencentCloudChat.TYPES.MSG_TEXT;

  // 图片
  const isImage = type === TencentCloudChat.TYPES.MSG_IMAGE;
 
  // 音频（⭐新增）
  const isAudio = type === TencentCloudChat.TYPES.MSG_AUDIO;

  return {
    id: msg.ID,

    type, // ⭐统一入口（最重要）

    // 📝 文本
    content: isText ? msg.payload?.text : '',

    // 🖼 图片
    imageUrl: isImage
      ? msg.payload?.imageInfoArray?.[0]?.url
      : '',

    // 🎤 音频（关键）
    audioUrl: isAudio
      ? (msg.payload?.url || '')
      : '',

    duration: isAudio
      ? (msg.payload?.second || 0)
      : 0,

    // 状态
    isImage,
    isText,
    isAudio,

    isMe: msg.from === loginUserID,
    time: msg.time,

    rawMessage: msg,
    isRevoked: msg.isRevoked || false,
  };
};
const hasInit = useRef(false);
useEffect(() => {
    if (hasInit.current) return;
  hasInit.current = true;
  async function loadHistory() {
    const res = await chat.getMessageList({
      conversationID: item.conversationID,
      //count: 20,
    });
    
  // chat.setMessageRead({
  //   conversationID: item.conversationID,
  // });
    const list = res.data.messageList;
    console.log('12123weq',res);

    const formatted = list
      .map(formatMessage)
      .reverse();

    setMessages(formatted);
    setNextReqMessageID(res.data.nextReqMessageID);
    setIsCompleted(res.data.isCompleted);
    setFirstLoaded(true);
  }
  console.log('重新加载了');
  
   //gethistory();
   initHistory();
  //loadHistory();


}, [item]); 
const gethistory = async() => {
  //setPage(1);
  let promises = chat.getConversationList();

promises.then(function(imResponse) {
console.log(imResponse);
 console.log('imlisr',imResponse);
 
  const conversationList = imResponse.data.conversationList;

  conversationList.forEach(item => {

    console.log('会话ID:', item.conversationID);

    console.log('未读数:', item.unreadCount);

  });

});

  if(item.storeName){ //用户访问历史消息
    console.log('name',item.storeName);
    //getstoreinfo();
    //getuserhistory();
    getuserhistory(1, false,true);
  }else{  //客服访问历史消息
    //getcoshistory();
    getcoshistory(1, false,true);
  }
}
const initHistory = () => {
  setPage(1);
  setHasMore(true);

  if (item.storeName) {
    getstoreinfo();
    getuserhistory(1, true);
  } else {
    getcoshistory(1, true);
  }
};

const getstoreinfo = async() => {
             try {
               const response = await apiRequest({
                 url: '/store/detail',
                 method: 'GET',
                 data:{},
                 query: {
                  id:item.storeId
                }
               });
               console.log(response);
              if(response.data!==undefined&&response.code==0){
                let open=response.data.openHours
                if(open&&open!==""){
                  let opentime=JSON.parse(open)
                  console.log(JSON.parse(open));
                  const result = formatBusinessStatus(opentime);
                  console.log(result);
                  setOpentime(result)
                }
              }
             } catch (error) {
               console.error(error);
             }
};

const formatBusinessStatus = (data) => {

  const { start, end } = data;

  const [startHour, startMinute] = start;
  const [endHour, endMinute] = end;

  // 当前时间
  const now = new Date();

  const nowMinutes =
    now.getHours() * 60 + now.getMinutes();

  const startMinutes =
    startHour * 60 + startMinute;

  const endMinutes =
    endHour * 60 + endMinute;

  // 是否跨天
  const isNextDay = startMinutes > endMinutes;

  let isOnline = false;

  if (isNextDay) {

    // 跨天逻辑
    isOnline =
      nowMinutes >= startMinutes ||
      nowMinutes <= endMinutes;

  } else {

    // 正常逻辑
    isOnline =
      nowMinutes >= startMinutes &&
      nowMinutes <= endMinutes;
  }

  // 补零
  const pad = (n) => String(n).padStart(2, '0');

  // 时间字符串
  const startText =
    `${pad(startHour)}:${pad(startMinute)}`;

  const endText =
    `${pad(endHour)}:${pad(endMinute)}`;

  // 营业时间展示
  const businessText = isNextDay
    ? `${startText}-次日${endText}`
    : `${startText}-${endText}`;

  return {
    isOnline,
    businessText,
  };
};
// const getuserhistory = async() => {
//        const user = await Storage.get("userinfo");
//      let myUserId=user.user.userId
//         try {
//           const response = await apiRequest({
//             url: '/message/history',
//             method: 'GET',
//             data: {
//             },
//             query: {
//               sessionId:item.id,
//               page:1,
//               pageSize:20,
//             },
//           }); 
//           console.log('history',response);
// if (response.data !== null && response.code == 0) {
//   if (response.data.list !== null && response.data.list.length !== 0) {

//     let list = response.data.list;

//     const newList = list
//       .map(item => ({
//         ...item,
//         isMe: item.senderId === myUserId,
//       }))
//       //.reverse(); // 倒序

//     console.log('new', newList);

//     setMessages(newList);
//   }
// }
//         } catch (error) {
//           console.error(error);
//         }
// }
const getuserhistory = async (
  pageNum = 1,
  refresh = false,
  add=false
) => {

  if (loadingMoreApi) return;

  setLoadingMoreApi(true);

  const user = await Storage.get("userinfo");

  let myUserId = user.user.userId;

  try {

    const response = await apiRequest({
      url: '/message/history',
      method: 'GET',
      query: {
        sessionId: item.id,
        page: pageNum,
        pageSize: 20,
      },
    });
    console.log('history222',response);
    
    if (
      response.data &&
      response.code === 0
    ) {

      const list = response.data.list || [];

      const newList = list.map(item => ({
        ...item,
        isMe: item.senderId === myUserId,
      }));

      // inverted=true
      // 老消息应该拼接到后面

      // setMessages(prev => {

      //   if (refresh) {
      //     return newList;
      //   }

      //   return [...prev, ...newList];

      // });
setMessages(prev => {

  if (refresh) {
    return uniqueMessages(newList);
  }
 if(add){
  return uniqueMessages([
    ...newList,
    ...prev,
  ]);
 }
  return uniqueMessages([
    ...prev,
    ...newList,
  ]);

});
      // 是否还有更多
      if (list.length < 20) {
        setHasMore(false);
      }

      setPage(pageNum);
    }

  } catch (error) {

    console.error(error);

  } finally {

    setLoadingMoreApi(false);

  }
};
const getcoshistory = async (
  pageNum = 1,
  refresh = false,
  add=false
) => {

  if (loadingMoreApi) return;

  setLoadingMoreApi(true);

  const user = await Storage.get("userinfo");

  let myUserId = user.user.userId;

  try {

    const response = await apiRequest({
      url: '/customer/history',
      method: 'GET',
      query: {
        sessionId: item.sessionId,
        page: pageNum,
        pageSize: 20,
      },
    });

    if (
      response.data &&
      response.code === 0
    ) {

      const list = response.data.list || [];

      const newList = list.map(item => ({
        ...item,
        isMe: item.senderId === myUserId,
      }));

      // setMessages(prev => {

      //   if (refresh) {
      //     return newList;
      //   }

      //   return [...prev, ...newList];

      // });
setMessages(prev => {

  if (refresh) {
    return uniqueMessages(newList);
  }
 if(add){
    return uniqueMessages([
    ...newList,
    ...prev,
  ]);
 }
  return uniqueMessages([
    ...prev,
    ...newList,
  ]);

});
      if (list.length < 20) {
        setHasMore(false);
      }

      setPage(pageNum);
    }

  } catch (error) {

    console.error(error);

  } finally {

    setLoadingMoreApi(false);

  }
};
// const getcoshistory = async() => {
//        const user = await Storage.get("userinfo");
//      let myUserId=user.user.userId
//         try {
//           const response = await apiRequest({
//             url: '/customer/history',
//             method: 'GET',
//             data: {
//             },
//             query: {
//               sessionId:item.sessionId,
//               page:1,
//               pageSize:20,
//             },
//           }); 
//           console.log('history',response);
// if (response.data !== null && response.code == 0) {
//   if (response.data.list !== null && response.data.list.length !== 0) {

//     let list = response.data.list;

//     const newList = list
//       .map(item => ({
//         ...item,
//         isMe: item.senderId === myUserId,
//       }))
//       //.reverse(); // 倒序

//     console.log('new', newList);

//     setMessages(newList);
//   }
// }
//         } catch (error) {
//           console.error(error);
//         }
// }

  useEffect(() => {
    // setTimeout(() => {
    //   scrollToBottomWithoutAnim();
    // }, 400);
   
  const onReceive = (event) => {
    //Vibration.vibrate();
    const msgs = event.data;
    const newMsgs = msgs.map(formatMessage);
     gethistory();
    //setMessages(prev => [...newMsgs,...prev]);
    // chat.setMessageRead({
    // conversationID: item.conversationID,
    // });
  };
const onRevoked=(event)=>{
  const revokedMsgs = event.data;

  setMessages(prev =>
    prev.map(msg => {
      const revoked = revokedMsgs.find(r => r.ID === msg.id);
      if (revoked) {
        return { ...msg, isRevoked: true };
      }
      return msg;
    })
  );
}
  chat.on(
    TencentCloudChat.EVENT.MESSAGE_RECEIVED,
    onReceive
  );
  chat.on(
    TencentCloudChat.EVENT.MESSAGE_REVOKED,
    onRevoked
  );
  return () => {
    chat.off(
      TencentCloudChat.EVENT.MESSAGE_RECEIVED,
      onReceive
    );
  };
}, []);  
const loadMore = () => {

  if (!hasMore || loadingMoreApi) return;

  const nextPage = page + 1;

  if (item.storeName) {

    getuserhistory(nextPage);

  } else {

    getcoshistory(nextPage);

  }
};
//  const loadMore = async () => {

//   if (!firstLoaded) return;
//   if (loadingMore || isCompleted) return;

//   setLoadingMore(true);

//   try {
//     const res = await chat.getMessageList({
//       conversationID: item.conversationID,
//       nextReqMessageID,
    
//     });

//     const list = res.data.messageList;
// console.log('vnewlist',list);

// const formatted = list
//   .map(formatMessage)
//   .reverse();
    
// console.log('formatted',formatted);

//     setMessages(prev => [...prev, ...formatted]);

//     setNextReqMessageID(res.data.nextReqMessageID);
//     setIsCompleted(res.data.isCompleted);

//   } catch (e) {
//     console.log('加载更多失败', e);
//   }

//   setLoadingMore(false);
// };
const handleOpenMore = () => {
    setIsVoiceMode(false)
  if (panelType === 'more') {
    // 关闭
    setPanelType(null);

    Animated.timing(panelAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // 👉 恢复安全区
    Animated.timing(bottomAnim, {
      toValue: insets.bottom || px(12),
      duration: 200,
      useNativeDriver: false,
    }).start();

    return;
  }
  panelRef.current = 'more'; // ⭐标记
  setPanelType('more');
  // 打开
  Keyboard.dismiss();
  Animated.timing(panelAnim, {
    toValue: px(140),
    duration: 250,
    useNativeDriver: false,
  }).start();

  // 👉 固定为 12（关键）
  Animated.timing(bottomAnim, {
    toValue: px(12),
    duration: 250,
    useNativeDriver: false,
  }).start();
};
const handleOpenEmoji = () => {
  setIsVoiceMode(false)
  if (panelType === 'emoji') {
    setPanelType(null);
    Animated.timing(bottomAnim, {
      toValue: insets.bottom || px(12),
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(panelAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    return;
  }

  panelRef.current = 'more'; // ⭐标记
  Keyboard.dismiss();
  setPanelType('emoji');
  Animated.timing(bottomAnim, {
    toValue: px(12),
    duration: 250,
    useNativeDriver: false,
  }).start();
  Animated.timing(panelAnim, {
    toValue: px(260),
    duration: 250,
    useNativeDriver: false,
  }).start();


};
const handleFocus = () => {
  panelRef.current = null;

  setPanelType(null);

  Animated.timing(panelAnim, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
  }).start();
};
const handleCloseAll = () => {
  console.log('closemodal');
  panelRef.current = null;
  // 关闭键盘
  Keyboard.dismiss();

  // 关闭面板
  setPanelType(null);

  Animated.timing(panelAnim, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
  }).start();

  // 恢复安全区
  Animated.timing(bottomAnim, {
    toValue: insets.bottom || px(12),
    duration: 200,
    useNativeDriver: false,
  }).start();
};
const uniqueMessages = (list) => {

  const map = new Map();

  list.forEach(item => {

    map.set(item.id, item);

  });

  return Array.from(map.values());
};
const keyExtractor = useCallback(
  (item) => item.id.toString(),
  []
);
const requestCameraPermission = async () => {
  try {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    // 1️⃣ 先检查
    let result = await check(permission);

    console.log('权限状态:', result);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    // 2️⃣ 未授权 → 自定义弹窗
    return new Promise((resolve) => {
      Alert.alert(
        '相机权限申请',
        '为了拍照发送图片，我们需要使用您的相机权限，仅用于聊天拍摄。',
        [
          {
            text: '取消',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: '继续授权',
            onPress: async () => {
              // 3️⃣ 触发系统授权弹窗
              const requestResult = await request(permission);

              console.log('请求结果:', requestResult);

              if (requestResult === RESULTS.GRANTED) {
                resolve(true);
              } else {
                Alert.alert('提示', '未获得相机权限，无法使用拍照功能');
                resolve(false);
              }
            },
          },
        ]
      );
    });

  } catch (error) {
    console.log('权限申请异常:', error);
    return false;
  }
};
const sendImage = async (type = 'album') => {
  try {
    // ⭐ 如果是相机，先请求权限
    if (type === 'camera') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;
    }

    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.5, // ⭐压缩（很关键）
      includeExtra: true,
    };

    const result =
      type === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

    // ❗取消选择
    if (result.didCancel) return;

    if (!result.assets || result.assets.length === 0) {
      console.log('没有选择图片');
      return;
    }

    const asset = result.assets[0];
    console.log('image',asset);
    console.log(item);


// 🚀 核心：修正 iOS 旋转 + 压缩重绘
const fixImage = async (uri, width, height) => {
  try {
    const res = await ImageResizer.createResizedImage(
      uri,
      width || 1280,
      height || 1280,
      'JPEG',
      80,   // 压缩质量（0~100）
      0     // ⭐关键：不旋转（强制修正 orientation）
    );

    return res.uri;
  } catch (e) {
    console.log('图片处理失败', e);
    return uri; // fallback
  }
};

// 🚀 处理后再上传
const fixedUri = await fixImage(
  asset.uri,
  asset.width,
  asset.height
);

console.log('修正后图片:', fixedUri);

//return
    // if(item.storeName){ //走用户发送图片
    // usersendimg(asset.uri)
    // }else{ //走客服发送图片
    // cussendimg(asset.uri)
    // }
    if(item.storeName){ //走用户发送图片
    usersendimg(fixedUri)
    }else{ //走客服发送图片
    cussendimg(fixedUri)
    }
    // ⭐ RN 必须转格式（重要）
    // const file = {
    //   uri: asset.uri,
    //   type: asset.type || 'image/jpeg',
    //   name: asset.fileName || `image_${Date.now()}.jpg`,
    // };

    // const toUserID =
    //   loginUserID === 'user1' ? 'user2' : 'user1';

    // 1️⃣ 创建消息（立即上屏用）
    // const message = chat.createImageMessage({
    //   to: toUserID,
    //   conversationType: TencentCloudChat.TYPES.CONV_C2C,
    //   payload: { file },
    // });

    // ⭐2️⃣ 先本地上屏（关键：体验像微信）
    // const tempMsg = {
    //   id: message.ID,
    //   imageUrl: asset.uri, // 本地预览
    //   isMe: true,
    //   time: message.time || Date.now() / 1000,
    //   rawMessage: message,
    //   isImage: true,
    //   status: 'sending',
    // };

    //setMessages(prev => [tempMsg, ...prev]);

    scrollToBottom();

    // 3️⃣ 发送
    //const res = await chat.sendMessage(message);

    //const msg = res.data.message;

    // 4️⃣ 替换为真实云端图片
    // const url =
    //   msg.payload.imageInfoArray?.[0]?.url || '';

    // setMessages(prev =>
    //   prev.map(item =>
    //     item.id === message.ID
    //       ? {
    //           ...item,
    //           imageUrl: url,
    //           status: 'success',
    //           rawMessage: msg,
    //         }
    //       : item
    //   )
    // );

  } catch (err) {
    console.log('❌ 图片发送失败', err);

    // 标记失败
    // setMessages(prev =>
    //   prev.map(item =>
    //     item.status === 'sending'
    //       ? { ...item, status: 'fail' }
    //       : item
    //   )
    // );
  }
};
const usersendimg = async (e) => {
  try {
    const formData = new FormData();

    formData.append('file', {
      //uri: Platform.OS === 'ios' ? e.replace('file://', '') : e,
      uri:  e,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    });

    formData.append('sessionId', item.id);
    formData.append('storeId', item.storeId);
    formData.append('contentType', 'image');

    const response = await apiRequest({
      url: '/message/send',
      method: 'POST',
      data: formData, // ⭐关键：直接传FormData
    });

    console.log('send image:', response);

    if (response?.code === 0) {
      gethistory();
      setText('');
    }
  } catch (error) {
    console.error('send image error:', error);
  }
};
const cussendimg = async(e) => {
  console.log(item,e);
  
    try {
    const formData = new FormData();

    formData.append('file', {
      uri: Platform.OS === 'ios' ? e.replace('file://', '') : e,
      //uri:  e,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    });

    formData.append('sessionId', item.sessionId);
    formData.append('storeId', item.storeId);
    formData.append('contentType', 'image');
    formData.append('userId', item.userId);

    const response = await apiRequest({
      url: '/message/reply',
      method: 'POST',
      data: formData, // ⭐关键：直接传FormData
    });

    console.log('send image:', response);

    if (response?.code === 0) {
      gethistory();
      setText('');
    }
  } catch (error) {
    console.error('send image error:', error);
  }
}

const startY = useRef(0);
const requestAudioPermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: '麦克风权限',
        message: '需要麦克风权限用于发送语音消息',
        buttonPositive: '确定',
        buttonNegative: '取消',
      }
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.log('权限异常', err);
    return false;
  }
};
const startRecord = async () => {
  const hasPermission = await requestAudioPermission();
  if (!hasPermission) return;
  try {
    Sound.addRecordBackListener((e) => {
      const sec = Math.floor(e.currentPosition / 1000);
      console.log('监控时长：',sec);
      
      setRecordSeconds(sec);
      setRecordTime(Sound.mmss(sec));

      // ❗最长60秒（微信也是）
      if (sec >= 60) {
        stopRecordAndSend();
      }
    });

    await Sound.startRecorder();
  } catch (e) {
    console.log('开始录音失败', e);
  }
};
const stopRecordAndSend = async () => {
  try {
    const path = await Sound.stopRecorder();
    Sound.removeRecordBackListener();

    // ❗小于1秒直接取消（微信规则）
    if (recordSeconds < 1) {
      Toast.show({ content: '说话时间太短' });
      return;
    }
    console.log('路径',path, '时长',recordSeconds);
  
    sendVoice(path, recordSeconds);
  } catch (e) {
    console.log('停止失败', e);
  }
};
const sendVoice = async (path, duration) => {
  const toUserID =
    loginUserID === 'user1' ? 'user2' : 'user1';
  console.log('音频：',path, duration);
  //return;
  const message = chat.createAudioMessage({
    to: toUserID,
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: {
      file: {
        uri: path,
        duration: duration*1000,
      },
    },
  });

  // ⭐ 本地先显示
  const tempMsg = {
    id: message.ID,
    isMe: true,
    time: Date.now() / 1000,
    type: TencentCloudChat.TYPES.MSG_AUDIO, // ⭐补这个（最关键）
    isAudio: true,   // ⭐统一字段
    duration,
    audioUrl: path,
    status: 'sending',
    rawMessage: message,
  };

  setMessages(prev => [tempMsg, ...prev]);

  try {
    const res = await chat.sendMessage(message);
    const msg = res.data.message;

    setMessages(prev =>
      prev.map(item =>
        item.id === message.ID
          ? {
              ...item,
              status: 'success',
              rawMessage: msg,
              audioUrl: msg.payload.url,
            }
          : item
      )
    );
  } catch (e) {
    console.log('发送失败', e);
  }
};
const cancelRecord = async () => {
  console.log('取消录音');
  try {
    await Sound.stopRecorder();
    Sound.removeRecordBackListener();
  } catch (e) {}
};
  const haptic = () => {
    impact ( "impactMedium" ,  1.0, {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  }) ;
  };
  const handlePressIn = (e) => {
    haptic(); 
    //impact ( "impactHeavy" ,  1 ) ;  // 轻柔的重击
    startY.current = e.nativeEvent.pageY;
    cancelRef.current = false;
    setIsRecording(true);
    setIsCancel(false);
    startRecord(); // 开始录音
  };
const cancelRef = useRef(false); // ⭐新增
const handleTouchMove = (e) => {
  const moveY = e.nativeEvent.pageY;
  //console.log(moveY);
  // 上滑超过80px = 取消
if (startY.current - moveY > 80) {
  if (!cancelRef.current) {
    cancelRef.current = true;   // ⭐立即生效
    setIsCancel(true);
    haptic();
  }
} else {
  if (cancelRef.current) {
    cancelRef.current = false;  // ⭐立即生效
    setIsCancel(false);
    console.log('取消111');
    haptic();
  }
}
};

const handlePressOut = () => {
  if (!isRecording) return;

  setIsRecording(false);

  if (isCancel) {
    console.log('取消录制');
    cancelRecord();
  } else {
    console.log('完成录制');
    stopRecordAndSend();
  }
};
const handlechangemic = () => { 
setIsVoiceMode(!isVoiceMode);
if(isVoiceMode==false){
handleCloseAll()
}
Keyboard.dismiss();
 };
  return (
    <View style={styles.container}>
      <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
              flexDirection: 'row',alignItems: 'flex-end',
            }}>
              <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(9),
                flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
              }}>
         <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
          left: px(16),}}>
           <Image source={require('../../../assets/images/my/left.png')} 
           style={{width:px(22),height:px(22)}}></Image>
           </TouchableOpacity>
 <View style={{flexDirection: 'column',alignItems: 'center',gap:px(6),
  paddingBottom:item.storeName?0:px(6)
 }}>
  <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
 <Text style={styles.title}>{item.userNickName||item.storeName}</Text>
   {item.storeName&&
 <View style={opentime.isOnline?styles.onlinebox:styles.noonlinebox}>
 <Text style={opentime.isOnline?styles.onlinetx:styles.noonlinetx}>{opentime.isOnline?'在线':'打烊'}</Text>
 </View>
 }
   </View>
  {item.storeName&&
   <Text style={styles.destitle}>客服在线时间：{opentime.businessText}</Text>
  }
           </View>
          
              </View>
            </View>

<View style={{top: px(98),position: 'absolute',zIndex: 1,width: '100%',}}>
   <NoticeBar 
     action={<Image source={require('../../../assets/images/home/yclose.png')} 
     style={{width:px(16),height:px(16),}}></Image>}
     mode="closable"
     marqueeProps={{ loop: true,autoFill:true }}
     icon={<View 
     style={{width:px(16),height:px(16),}}></View>}
      styles={{
    font: { color: '#1A1A1A',},
    marquee:{fontSize:px(12),fontFamily: 'MiSans-Regular',lineHeight:px(16),color:'#FF9500'},
    background: { backgroundColor: '#FEF7E0' },
    iconWrap:{marginLeft: px(0),},
    container:{height: px(32),},
    }}
    onClose={()=>handleclose()}
     >
  若客服引导您私下交易、私下加群等行为，请截图保存并在个人中心提交平台
</NoticeBar>
</View>

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >


    <View
      style={{ flex: 1 }}
      //onPress={handleCloseAll}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={keyExtractor} 
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={{
        paddingTop:px(24),
        paddingHorizontal:px(16),
        //paddingBottom:px(0)
        }}
        showsVerticalScrollIndicator={false}
        inverted
        // onContentSizeChange={() => {
        // scrollToBottom(true);
        // }}
          onEndReached={loadMore}
        onEndReachedThreshold={0.1}
ListFooterComponent={
  <View
    style={{
      height: px(40),
      //paddingTop:px(41),
      marginTop: px(41),
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {loadingMoreApi && (
      <Text style={styles.emptyText}>
        加载中...
      </Text>
    )}

    {!hasMore&&messages.length!==0 && (
      <Text style={styles.emptyText}>
        没有更多了
      </Text>
    )}
  </View>
}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
      />
  {/* 点击空白关闭 */}
  {panelType && (
    <Pressable
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
      }}
      onPress={handleCloseAll}
    />
  )}
    </View>

 
  
      <Animated.View   style={[
      styles.inputContainer,
      { paddingBottom: bottomAnim }
      ]}>
        {/* <TouchableOpacity 
          style={{flexDirection: 'row',width: px(32),height: px(32),
            justifyContent: 'center',alignItems: 'center',
          }}  onPress={() => {
    handlechangemic()
    }}>
    {!isVoiceMode&&
         <Image source={require('../../../assets/images/home/microphone.png')} 
           style={{width:px(23),height:px(23)}}></Image>
    }
     {isVoiceMode&&
         <Image source={require('../../../assets/images/my/keyboard.png')} 
           style={{width:px(24),height:px(24)}}></Image>
    }
        </TouchableOpacity> */}

      <View style={{flexDirection: 'row',alignItems: 'center',borderRadius: px(4),
        backgroundColor: '#fff',width:text!==''? px(290):px(315),marginLeft: px(0),
        justifyContent: 'space-between',paddingHorizontal:px(0)
      }}>

{!isVoiceMode ? (
<TextInput
      onFocus={handleFocus}
      selectionColor='#FC9026'
      lineBreakModeIOS={'char'}
      textBreakStrategy={'simple'}
      allowFontScaling={false}
      multiline={true}
      style={[styles.input,{width: text==''?px(220):px(200),}]}
      value={text}
      onChangeText={setText}
      placeholder="请输入您要咨询的内容..."
      maxLength={100}
      placeholderTextColor="#9E9E9E"
      onSubmitEditing={()=>handlesubmit()}
      />
) : (
  <Pressable
    hitSlop={{ top:isRecording? 480:0,}} // ⭐关键
    onPressIn={handlePressIn}
    onPressOut={handlePressOut}
    onTouchMove={handleTouchMove}
    style={styles.voiceBtn}
  >
    <Text style={styles.anzhutx}>
      {isRecording
        ? (isCancel ? '松开 取消' : '松开 发送')
        : '按住 说话'}
    </Text>
  </Pressable>
)}
      {/* <TextInput
      onFocus={handleFocus}
      selectionColor='#FC9026'
      lineBreakModeIOS={'char'}
      textBreakStrategy={'simple'}
      allowFontScaling={false}
      multiline={true}
      style={[styles.input,{width: text==''?px(220):px(200),}]}
      value={text}
      onChangeText={setText}
      placeholder="请输入您要咨询的内容..."
      maxLength={100}
      placeholderTextColor="#9E9E9E"
      onSubmitEditing={()=>handlesubmit()}
      /> */}

       <TouchableOpacity onPress={handleOpenEmoji}
       style={{width:px(38),height:px(38),
        flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
       }}> 
          <Image source={require('../../../assets/images/home/emoji.png')} 
           style={{width:px(20),height:px(20)}}></Image>
           </TouchableOpacity>
     </View>
  
        {text==''&&
           <TouchableOpacity  style={{width: px(32),height: px(32),
         marginLeft: px(12),flexDirection: 'row',
          alignItems: 'center',justifyContent: 'center',
        }} onPress={handleOpenMore}>
        <Image source={require('../../../assets/images/home/add.png')} 
           style={{width:px(23),height:px(23)}}></Image>
        </TouchableOpacity>
        }
        {text!==''&&
           <TouchableOpacity  style={{width: px(58),height: px(42),
         marginLeft: px(12),flexDirection: 'row',borderRadius: px(4),
          alignItems: 'center',justifyContent: 'center',
          backgroundColor: '#FF9500',
        }} onPress={sendMessage}>
        <Text style={styles.submittx}>发送</Text>
        </TouchableOpacity>
        }
      </Animated.View>

      <Animated.View style={{  
      height: panelAnim,
      backgroundColor: '#F5F5F5',
      overflow: 'hidden',
      }}> 


       {panelType === 'more'&&
       <View style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal:px(16),
    paddingTop:px(12),
    paddingBottom: insets.bottom?insets.bottom+px(12):px(12),
    gap:px(26)
  }}>
        <TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8)}}
        onPress={() => sendImage('album')}>
  <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    backgroundColor: '#fff',width:px(58),height:px(58),borderRadius: px(10),
  }}>
        <Image source={require('../../../assets/images/my/photo.png')} 
           style={{width:px(26),height:px(26)}}></Image>
  </View>
   <Text style={styles.bottomText}>照片</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8)}}
onPress={() => sendImage('camera')}>
  <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    backgroundColor: '#fff',width:px(58),height:px(58),borderRadius: px(10),
  }}>
        <Image source={require('../../../assets/images/my/camer.png')} 
           style={{width:px(26),height:px(26)}}></Image>
  </View>
   <Text style={styles.bottomText}>拍摄</Text> 
</TouchableOpacity>
{/* <TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8)}}>
  <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    backgroundColor: '#fff',width:px(58),height:px(58),borderRadius: px(10),
  }}>
        <Image source={require('../../../assets/images/my/order1.png')} 
           style={{width:px(26),height:px(26)}}></Image>
  </View>
   <Text style={styles.bottomText}>订单</Text> 
</TouchableOpacity> */}
</View>
}
 

  {panelType === 'emoji'&&
  <ScrollView style={{backgroundColor: '#E9E9E9'}}
  contentContainerStyle={{paddingBottom:insets.bottom}}>
          <View style={styles.emojiPanel}>
          {EMOJIS.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setText(prev => prev + item)}
              style={{width: '12.5%',height: px(42),flexDirection: 'row',
                alignItems: 'center',justifyContent: 'center',
              }}
            >
              <Text style={styles.emoji}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </ScrollView>
       }
      </Animated.View>
</KeyboardAvoidingView>


{isRecording && (
  <View style={styles.recordMaskWrap}>
    <View style={styles.recordMaskBox}>
      
      {/* 图标 */}
      <Image
        source={
          isCancel
            ? require('../../../assets/images/my/redmick.png') // 红色取消图
            : require('../../../assets/images/my/mick.png')  // 正常麦克风
        }
        style={{ width: px(60), height: px(60) }}
      />

      {/* 状态文字 */}
      <Text style={styles.recordTitle}>
        {isCancel ? '松手取消' : '松开发送'}
      </Text>

      {/* 辅助提示 */}
      <Text style={styles.recordDesc}>
        {isCancel ? '松开手指，取消发送' : '上滑取消'}
      </Text>
    </View>
  </View>
)}
    </View>
  )
}

const styles = StyleSheet.create({
  emptyText: {
   fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
},
  recordMaskWrap: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.3)', // 半透明背景
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},

recordMaskBox: {
  width: px(180),
  height: px(180),
  backgroundColor: 'rgba(0,0,0,0.8)',
  borderRadius: px(12),
  justifyContent: 'center',
  alignItems: 'center',
},

recordTitle: {
  marginTop: px(12),
  fontSize: px(16),
  color: '#fff',
},

recordDesc: {
  marginTop: px(6),
  fontSize: px(12),
  color: '#ccc',
},
  anzhutx:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
  voiceBtn:{
// backgroundColor: 'red',
 height: px(41.5),
 width: px(230),
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'center',
  },
  recordMask: {
  position: 'absolute',
  top: '35%',
  left: '25%',
  width: px(180),
  height: px(180),
  backgroundColor: 'rgba(0,0,0,0.75)',
  borderRadius: px(12),
  justifyContent: 'center',
  alignItems: 'center',
},
  bottomText: {
//maxWidth: px(252),
  //backgroundColor: 'red',
   fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#676767',
        fontWeight:400,
        lineHeight:px(17),
},
  emoji: { fontSize: px(28),},
  emojiPanel: { flexDirection: 'row', 
    flexWrap: 'wrap', padding: px(12), 
    backgroundColor: '#E9E9E9',gap:px(0) },
  row: {
  flexDirection: 'row',
  marginVertical: px(6),
  alignItems: 'flex-end',
},

rowLeft: {
  justifyContent: 'flex-start',
},

rowRight: {
  justifyContent: 'flex-end',
},

avatar: {
  width: px(43),
  height: px(43),
  borderRadius:px(4),
},

bubble: {
  // flexDirection: 'row',
  // flexWrap: 'wrap',
  maxWidth: px(252),
  padding: px(10),
  borderRadius: px(4),
},

bubbleLeft: {
  backgroundColor: '#fff',
  marginLeft: px(12),
},

bubbleRight: {
  backgroundColor: '#fff',
  marginRight:px(12),
},

messageText: {
//maxWidth: px(252),
  //backgroundColor: 'red',
   fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
},
  submittx:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(19),
  },
      messageItem: {
    alignSelf: 'flex-end',
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '70%'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:px(16),
    paddingVertical:px(12),
    //borderTopWidth: 1,
    //borderColor: '#ddd',
    backgroundColor: '#F5F5F5'
  },
  input: {
    padding: px(10),
    fontFamily: 'MiSans-Regular',
    //minHeight: px(32),
    //backgroundColor: 'red',
    //height: px(32),
    width: px(220),
    fontSize: px(16),
 
  },
        noonlinetx:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(17),
    },
    noonlinebox:{
        borderRadius: px(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
height: px(21),
backgroundColor: '#FEF7E0',
paddingHorizontal:px(10)
    },
    onlinetx:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#3CF15F',
        fontWeight:400,
        lineHeight:px(17),
    },
    onlinebox:{
        borderRadius: px(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
height: px(21),
backgroundColor: '#DEFFE5',
paddingHorizontal:px(10)
    },
    destitle:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
          title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
container:{
  flex: 1,
  backgroundColor: '#EEEEEE',
}
})