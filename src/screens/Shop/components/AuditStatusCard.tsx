import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { px } from '../../../utils/scaleUtils';

const STATUS_MAP = {
  PENDING: {
    title: '待审核',
    desc: '店铺信息已提交，等待平台审核',
    bg: '#FFF7E8',
    border: '#FFD591',
    titleColor: '#FA8C16',
    descColor: '#AD6800',
    //icon: require('../../../assets/images/shop/pending.png'),
  },

  VERIFYING: {
    title: '审核中',
    desc: '当前店铺信息正在审核中，预计1-3个工作日完成',
    bg: '#FFF7E8',
    border: '#FFD591',
    titleColor: '#FA8C16',
    descColor: '#AD6800',
   //icon: require('../../../assets/images/shop/reviewing.png'),
  },

  APPROVED: {
    title: '审核通过',
    desc: '当前店铺信息已生效',
    bg: '#F6FFED',
    border: '#B7EB8F',
    titleColor: '#52C41A',
    descColor: '#389E0D',
    //icon: require('../../../assets/images/shop/success.png'),
  },

  REJECTED: {
    title: '审核未通过',
    desc: '请根据提示修改后重新提交',
    bg: '#FFF1F0',
    border: '#FFA39E',
    titleColor: '#F5222D',
    descColor: '#CF1322',
    //icon: require('../../../../assets/images/my/clock.png'),
  },
};

export default function AuditStatusCard({
  status = 'PENDING',
  reason = '',
  submitTime = '',
}) {
  const current = STATUS_MAP[status] || STATUS_MAP.PENDING;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
        },
      ]}
    >
      <View style={styles.leftBox}>
        {/* <Image source={current.icon} style={styles.icon} /> */}

        <View style={styles.contentBox}>
          <Text
            style={[
              styles.title,
              {
                color: current.titleColor,
              },
            ]}
          >
            {current.title}
          </Text>

          {/* <Text
            style={[
              styles.desc,
              {
                color: current.descColor,
              },
            ]}
          >
            {current.desc}
          </Text> */}

          {
            status === 'REJECTED' && !!reason && (
              <Text style={styles.reason}>
                拒绝原因：{reason}
              </Text>
            )
          }

          {
            !!submitTime && (
           <Text style={styles.time}>
                {
                status === 'VERIFYING' || status === 'PENDING'
                ? `提交时间：${submitTime}`
                : `审核时间：${submitTime}`
                }
                </Text>
            )
          }
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: px(1),
    borderRadius: px(12),
    paddingHorizontal: px(14),
    paddingVertical: px(14),
    marginTop: px(12),
  },

  leftBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  icon: {
    width: px(22),
    height: px(22),
    marginTop: px(1),
  },

  contentBox: {
    flex: 1,
    marginLeft: px(10),
  },

  title: {
    fontSize: px(15),
    fontFamily: 'MiSans-Medium',
    lineHeight: px(20),
  },

  desc: {
    marginTop: px(4),
    fontSize: px(12),
    fontFamily: 'MiSans-Regular',
    lineHeight: px(18),
  },

  reason: {
    marginTop: px(8),
    fontSize: px(12),
    color: '#F5222D',
    fontFamily: 'MiSans-Regular',
    lineHeight: px(18),
  },

  time: {
    marginTop: px(6),
    fontSize: px(11),
    color: '#999999',
    fontFamily: 'MiSans-Regular',
    lineHeight: px(16),
  },
});