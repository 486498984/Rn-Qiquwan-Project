import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'

import React from 'react'
import { px } from '../../utils/scaleUtils';
import { CommonActions } from '@react-navigation/native';

const CouponItem = ({ navigation, item }) => {

const isUsed = item?.useStatus === 'USED';

const isExpired = item?.useStatus === 'EXPIRED';

const isUnused = item?.useStatus === 'UNUSED';

// 是否不可用
const disabled = isUsed || isExpired;

const getStatusText = () => {

  switch (item?.useStatus) {

    case 'USED':
      return '已使用';

    case 'EXPIRED':
      return '已过期';

    case 'UNUSED':
      return '去使用';

    default:
      return '不可用';
  }
};

  // 返回主题颜色
const getThemeColor = () => {

  switch (item?.useStatus) {

    case 'USED':
      return '#C4C4C4';

    case 'EXPIRED':
      return '#C4C4C4';

    case 'UNUSED':
      return '#DE5452';

    default:
      return '#C4C4C4';
  }
};

  // 时间格式化
  const formatTime = (time) => {

    const date = new Date(time);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    const hour = String(date.getHours()).padStart(2, '0');

    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  // 优惠券金额/折扣显示
  const getCouponValue = () => {

    switch (item?.couponType) {

      // 满减券
      case 'FULL_REDUCE':
        return `￥${item?.reduceAmount / 100}`;

      // 无门槛券
      case 'NO_THRESHOLD':
        return `￥${item?.reduceAmount / 100}`;

      // 折扣券
      case 'DISCOUNT':

        // discountRate=85 -> 8.5折
      const discount = item?.discountRate / 1000;

     return `${parseFloat(discount.toFixed(1))}折`;

      // 赠品券
      case 'GIFT':
        return '赠品券';

      default:
        return '优惠券';
    }
  };

  // 优惠说明
  const getCouponDesc = () => {

    switch (item?.couponType) {

      case 'FULL_REDUCE':
        return `满${item?.fullAmount / 100}元可用`;

      case 'NO_THRESHOLD':
        return '无门槛使用';

      case 'DISCOUNT':

        if (item?.maxReduce > 0) {
          return `最高减${item?.maxReduce / 100}元`;
        }

        return '折扣优惠';

      case 'GIFT':
        return '赠品专用券';

      default:
        return item?.couponDesc || '优惠券';
    }
  };

  // 去使用
  const handleuse = () => {

    if (disabled) {
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTab',
            state: {
              index: 0,
              routes: [
                { name: 'Home' },
                { name: 'Club' },
                { name: 'News' },
                { name: 'My' },
              ],
            },
          },
        ],
      })
    );
  };

  return (

    <View
      style={{
        width: px(361),
        height: px(93),
        marginTop: px(10),
        paddingHorizontal: px(16),
        backgroundColor: disabled
          ? 'rgba(196,196,196,0.12)'
          : 'rgba(222,84,82,0.1)',
        borderRadius: px(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >

      {/* 左边 */}
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          gap: px(3)
        }}
      >

        <Text
          style={[
            styles.title,
            {
              color: disabled
                ? '#999999'
                : '#1A1A1A'
            }
          ]}
        >
          {item?.couponName}
        </Text>

        <Text style={styles.time}>
          {formatTime(item?.expireTime)} 前有效
        </Text>

      </View>

      {/* 右边 */}
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: px(6)
        }}
      >

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >

          <Text
            style={[
              styles.price,
              {
                color: getThemeColor()
              }
            ]}
          >
            {getCouponValue()}
          </Text>

          <Text
            style={[
              styles.pricedes,
              {
                color: getThemeColor()
              }
            ]}
          >
            {getCouponDesc()}
          </Text>

        </View>

        <TouchableOpacity
          disabled={disabled}
          style={{
            width: px(54),
            height: px(25),
            backgroundColor: getThemeColor(),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: px(4),
          }}
          onPress={handleuse}
        >

          <Text style={styles.usetx}>
            {getStatusText()}
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  )
}

export default React.memo(CouponItem);

const styles = StyleSheet.create({

  usetx: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(10),
    color: '#fff',
    lineHeight: px(13),
  },

  pricedes: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(10),
    lineHeight: px(13),
    fontWeight: '400',
  },

  price: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(13),
    lineHeight: px(17),
  },

  time: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(10),
    lineHeight: px(13),
    color: '#AAAAAA',
    fontWeight: '400',
  },

  title: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(14),
    lineHeight: px(19),
    fontWeight: '400',
  }

});