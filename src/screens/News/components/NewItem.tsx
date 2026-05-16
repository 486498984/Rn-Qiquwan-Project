import { StyleSheet, Text, View,Image,Platform } from 'react-native'
import React from 'react'
import { px } from '../../../utils/scaleUtils';




const loginUserID = Platform.OS === 'ios' ? 'user1' : 'user2';
export const formatConversationTime = (timestamp) => {
  const date = new Date(timestamp * 1000);

  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const isYesterday =
    new Date(now - 24 * 60 * 60 * 1000).getDate() === date.getDate();

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
const NewItem=({item})=> {
  console.log('传入的数据',item);
  const lastMsg = item?.lastMessage;

const getLastMsgText = () => {
  if (!lastMsg) return '';

  // ✅ 撤回消息
  if (lastMsg.isRevoked) {
    return lastMsg.fromAccount === loginUserID
      ? '你撤回了一条消息'
      : '对方撤回了一条消息';
  }

  // ✅ 正常消息
  return lastMsg.messageForShow || '';
};
  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Image source={require('../../../../assets/images/home/club1.png')} 
    style={{width:px(51),height:px(51)}}></Image>
    <View style={{height: px(51),flexDirection: 'column',
    justifyContent: 'space-between',marginLeft: px(6),width: px(304),
    }}>
        <View style={{flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',
        }}>
<Text style={styles.clubname}>{item.userProfile.nick}</Text>
  <Text style={styles.time}>{formatConversationTime(item.lastMessage.lastTime)}</Text>
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
  )
}
export default NewItem;
const styles = StyleSheet.create({
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