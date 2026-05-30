import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useRef } from 'react';
import { px } from '../../../utils/scaleUtils';
import { IMG_URL } from '../../../api/config';
import SafeFastImage from '../../../components/Home/SafeFastImage';
import { Swipeable } from 'react-native-gesture-handler';
import request from '../../../api/request';

const loginUserID = Platform.OS === 'ios' ? 'user1' : 'user2';

// ================= 时间格式化 =================
export const formatConversationTime = (timeString) => {
  const date = new Date(timeString);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const pad = (n) => (n < 10 ? '0' + n : n);

  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());

  if (isToday) return `${hh}:${mm}`;
  if (isYesterday) return `昨天 ${hh}:${mm}`;
  if (date.getFullYear() === now.getFullYear()) {
    return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
};

// ================= 主组件 =================
const NoticeItem = ({  navigation,noticelist }) => {
  const swipeRef = useRef(null);

  // ================= 系统会话（官方公告） =================
  //const isSystemNotice = item?.conversationID === 'SYSTEM_NOTICE';

  // ================= 消息显示 =================
  //const lastMsg = item?.lastMsgContent;

  const getLastMsgText = () => {

      return noticelist?.content;

  };



  // ================= UI =================
  return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
        
            navigation.navigate('Noticepla');
        }}
      >
        <View style={styles.container}>
          {/* 头像 */}
          <SafeFastImage
            source={
             require('../../../../assets/images/home/notice1.png')
            }
            style={{ width: px(51), height: px(51), borderRadius: px(4) }}
          />

          {/* 内容 */}
          <View
            style={{
              height: px(51),
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginLeft: px(6),
            }}
          >
            {/* 标题 + 时间 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.clubname}>
               官方公告
              </Text>

              <Text style={styles.time}>
                { formatConversationTime(
                      noticelist?.updatedAt
                    )}
              </Text>
            </View>

            {/* 内容 + 未读 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.messgtx} numberOfLines={1}>
                {getLastMsgText()}
              </Text>

             
                {/* <View style={styles.badge}>
                  <Text style={styles.message}>{1}</Text>
                </View> */}
             
            </View>
          </View>
        </View>
      </TouchableOpacity>
  );
};

export default NoticeItem;

// ================= 样式 =================
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

  message: {
    fontSize: px(12),
    color: '#fff',
  },

  badge: {
    paddingHorizontal: px(4),
    height: px(16),
    backgroundColor: '#DE5452',
    borderRadius: px(8),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: px(16),
  },

  time: {
    fontSize: px(13),
    color: '#AAAAAA',
  },

  messgtx: {
    width: px(276),
    fontSize: px(14),
    color: '#AAAAAA',
  },

  clubname: {
    fontSize: px(17),
    color: '#1A1A1A',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});