import { StyleSheet, Text, View,Image,Platform,TouchableOpacity,
Animated,
 } from 'react-native'
import React,{useRef,} from 'react'
import { px } from '../../../utils/scaleUtils';
import { IMG_URL } from '../../../api/config';
import SafeFastImage from '../../../components/Home/SafeFastImage'
import { Swipeable } from 'react-native-gesture-handler';
import request from '../../../api/request'



const loginUserID = Platform.OS === 'ios' ? 'user1' : 'user2';
export const formatConversationTime = (timeString) => {
  // 直接解析 ISO 时间
  const date = new Date(timeString);
  const now = new Date();
  // 今天
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  // 昨天
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const pad = (n) => (n < 10 ? '0' + n : n);

  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());

  // 👉 今天：显示时间
  if (isToday) {
    return `${hh}:${mm}`;
  }

  // 👉 昨天
  if (isYesterday) {
    return `昨天 ${hh}:${mm}`;
  }

  // 👉 今年
  if (date.getFullYear() === now.getFullYear()) {
    return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  // 👉 跨年
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
};
const NewItem=({item,getuserinfo,getclubpermission})=> {
  console.log('传入的数据',item);
  const lastMsg = item?.lastMsgContent;

const getLastMsgText = () => {
  if (!lastMsg) return '';

  // ✅ 撤回消息
  if (lastMsg.isRevoked) {
    return lastMsg.fromAccount === loginUserID
      ? '你撤回了一条消息'
      : '对方撤回了一条消息';
  }
  // 图片消息
  if (isImageFile(lastMsg)) {
    return '[图片]';
  }
  // ✅ 正常消息
  return lastMsg || '';
};
const isImageFile = (text = '') => {
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(text);
};

  const swipeRef = useRef(null);

  // 右侧删除按钮
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // ⭐点击后先收回
          swipeRef.current?.close();
          getuserinfo();
          // ⭐再执行删除
          onDelete?.(item);
        }}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>删除</Text>
      </TouchableOpacity>
    );
  };
const onDelete = async(e) => {
  console.log(item);
  if(item.storeName){ //用户隐藏
          try {
      const response = await request({
        url: '/session/hide',
        method: 'PUT',
        data: {
          
          },
        query: {
          sessionId:e.id
        },
          }); 
        console.log('address',response);
        if (response.data !== null && response.code == 0) {
        getuserinfo();
        getclubpermission();
        }
        } catch (error) {
        console.error(error);
        }
  }else{ //客服隐藏
          try {
      const response = await request({
        url: '/session/agent/hide',
        method: 'POST',
        data: {
          sessionId:e.sessionId
          },
        query: {
        },
          }); 
        console.log('address',response);
        if (response.data !== null && response.code == 0) {
        getuserinfo();
        getclubpermission();
        }
        } catch (error) {
        console.error(error);
        }
  }
  return

};

  return (
        <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
    <View style={styles.container}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
<SafeFastImage
  source={
    item?.userAvatar||item?.storeLogo
      ? { uri: IMG_URL+(item.userAvatar||item.storeLogo) }
      : require('../../../../assets/images/my/defultavtar1.png')
  }
  style={{ width: px(51), height: px(51), borderRadius: px(4) }}
/>
    <View style={{height: px(51),flexDirection: 'column',
    justifyContent: 'space-between',marginLeft: px(6),width: px(304),
    }}>
        <View style={{flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',
        }}>
<Text style={styles.clubname}>{item.userNickName||item.storeName}</Text>
  <Text style={styles.time}>{formatConversationTime(item.lastActiveTime||item.lastMsgTime)}</Text>
        </View>
 <View style={{flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',
        }}>
<Text style={styles.messgtx} numberOfLines={1}> {getLastMsgText()}</Text>
  {item?.unreadCount!==0&&
      <View style={{paddingHorizontal:px(4),height: px(16),backgroundColor: '#DE5452',
    borderRadius: px(8),flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    minWidth: px(16),
   }}>
<Text style={styles.message}>{item.unreadCount}</Text>
  </View>
    }
        </View>
        </View>
    </View>
    </View>
    </Swipeable>
  )
}
export default NewItem;
const styles = StyleSheet.create({
  deleteBtn: {
  width: px(80),
  backgroundColor: '#FF3B30',
  justifyContent: 'center',
  alignItems: 'center',
},

deleteText: {
  color: '#fff',
  fontSize: px(16),
},
      message:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(16),
},
    time:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
    },
    messgtx:{
        width: px(276),
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
    },
    clubname:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
    },
container:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'red',
}
})