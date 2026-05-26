import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { px } from '../../utils/scaleUtils';
import RewardOrder from '../../components/My/RewardOrder';
import PendOrder from '../../components/My/PendOrder';
import request from '../../api/request';
import Storage from '../../utils/storage';

export default function InviteOrder({ navigation, route }) {
  const { type, userid } = route.params || {};
  const [title, setTitle] = useState("可提现");
  const [order, setOrder] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 是否还有下一页

  useEffect(() => {
    if (type !== undefined && type !== null) {
      setPage(1);
      setHasMore(true);
      if (type === 1) {
        setTitle("可提现");
        fetchOrderList(1, true); // 下拉刷新
      } else if (type === 2) {
        setTitle("待入账");
        fetchOrderList(1, true);
      } else if (type === 3) {
        setTitle("订单");
        fetchOrderList(1, true);
      }
    }
  }, [type, userid]);

  // 公共获取列表方法
  const fetchOrderList = async (pageNum = 1, isRefresh = false) => {
    const user = await Storage.get("userinfo");
    try {
      const url = type === 2 ?  '/user/asset/pending-list' :'/user/commission/order-detail';
      const response = await request({
        url,
        method: 'GET',
        query: {
          userId: user.user.userId,
          page: pageNum,
          pageSize: 10,
            // type=3 时增加 inviteeId
          ...(type === 3 && {
            inviteeId: userid,
          }),
        },
      });
      if (response.code === 0 && response.data) {
        const list = response.data.list || [];
        if (isRefresh) {
          setOrder(list);
        } else {
          setOrder(prev => [...prev, ...list]);
        }
        setHasMore(list.length === 10); // 如果返回数量小于 pageSize，说明没有更多
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchOrderList(1, true);
  };

  // 上拉加载更多
  const onEndReached = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrderList(nextPage, false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

const renderFooter = () => {
  if (order.length === 0 && !refreshing) {
    // 列表为空且不是下拉刷新状态 → 显示暂无内容
    return (
      <View style={{ paddingVertical: px(40), alignItems: 'center' }}>
        <Text style={styles.footerText}>暂无内容</Text>
      </View>
    );
  }

  if (order.length !== 0 && !refreshing) {
    // 列表为空且不是下拉刷新状态 → 显示暂无内容
    return (
      <View style={{ paddingVertical: px(40), alignItems: 'center' }}>
        <Text style={styles.footerText}>我是有底线的～</Text>
      </View>
    );
  }

  if (loadingMore) {
    // 正在加载更多 → 显示加载中
    return (
      <View style={{ paddingVertical: px(12), alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#999" />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  }

  if (!hasMore && order.length > 0) {
    // 列表有内容但已全部加载 → 显示没有更多内容
    return (
      <View style={{ paddingVertical: px(20), alignItems: 'center' }}>
        <Text style={styles.footerText}>没有更多内容了</Text>
      </View>
    );
  }

  return null; // 默认不显示
};

  return (
    <View style={styles.container}>
      {/* 顶部标题栏 */}
      <View style={{ width: px(393), height: px(98), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'flex-end' }}>
        <View style={{ width: '100%', paddingHorizontal: px(16), marginBottom: px(18), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleBack} style={{ position: 'absolute', left: px(16) }}>
            <Image source={require('../../../assets/images/my/left.png')} style={{ width: px(22), height: px(22) }} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      {/* 列表 */}
      <FlatList
        data={order}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
        type === 2 ? (
          <PendOrder item={item} />
        ) : (
          <RewardOrder item={item} />
        )
      }
        contentContainerStyle={{ paddingHorizontal: px(16), paddingBottom: px(42) }}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#999"/>
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    footerText: {
    textAlign:'center',
     fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
  },
  title: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
});