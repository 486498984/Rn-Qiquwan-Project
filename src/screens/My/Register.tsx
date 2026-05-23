import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { px } from '../../utils/scaleUtils';
import request from '../../api/request';
import Storage from '../../utils/storage';
import { IMG_URL} from '../../api/config';


const Useritem = ({ item, navigation }) => {
  function hidePhone(phone) {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + "****" + phone.slice(-4);
}
  return (
    <View style={{ width: px(361), height: px(131), backgroundColor: '#fff', borderRadius: px(12), paddingHorizontal: px(16) }}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: px(14) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: px(8) }}>
          <Image
           source={
              item?.avatarUrl == ""
                ?  require('../../../assets/images/my/defultavtar.png')
                : { uri: IMG_URL+item?.avatarUrl }
              }
          style={{ width: px(28), height: px(28), borderRadius: px(14) }} />
          <Text style={styles.nikename}>{item?.nickName || '默认用户'}</Text>
        </View>
        <Text style={styles.idnumber}>手机号：{hidePhone(item?.phone) || '138****0000'}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: px(10) }}>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: px(6) }}>
          <Text style={styles.firtitle}>全部消费(元)</Text>
          <Text style={styles.firmoney}>{item?.totalAmount/100 || '0.00'}</Text>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: px(6) }}>
          <Text style={styles.firtitle}>累计佣金(元)</Text>
          <Text style={styles.firmoney}>{item?.commission/100 || '0.00'}</Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'column', alignItems: 'flex-start', gap: px(6) }}
          onPress={() => navigation.navigate('InviteOrder', { type: 3, userid: item?.userId })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.firtitle}>订单</Text>
            <Image source={require('../../../assets/images/my/cright.png')} style={{ width: px(20), height: px(20) }} />
          </View>
          <Text style={styles.firmoney}>{item.orderCount || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Register({ navigation }) {
  const [registeruser, setRegisteruser] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleback = () => {
    navigation.goBack();
  };

  useEffect(() => {
    fetchUserList(true); // 初次加载
  }, []);

  const fetchUserList = async (isRefresh = false) => {
    const user = await Storage.get('userinfo');
    const nextPage = isRefresh ? 1 : page;
    if (isRefresh) setRefreshing(true);
    else setLoadingMore(true);

    try {
      const response = await request({
        url: '/user/commission/order-list',
        method: 'GET',
        query: { userId: user.user.userId, page: nextPage, pageSize: 10 },
      });
      if (response.code === 0 && response.data?.list) {
        const list = response.data.list;
        setRegisteruser(isRefresh ? list : [...registeruser, ...list]);
        setHasMore(list.length === 10); // 判断是否还有更多数据
        setPage(nextPage + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    fetchUserList(true);
  };

  const onEndReached = () => {
    if (!loadingMore && hasMore) {
      fetchUserList(false);
    }
  };

  const renderFooter = () => {
    if (registeruser.length === 0 && !refreshing) {
      return (
        <View style={{ paddingVertical: px(40), alignItems: 'center' }}>
          <Text style={styles.footerText}>暂无内容</Text>
        </View>
      );
    }
    if (loadingMore) {
      return (
        <View style={{ paddingVertical: px(12), alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#999" />
          <Text style={styles.footerText}>加载中...</Text>
        </View>
      );
    }
    if (!hasMore && registeruser.length > 0) {
      return (
        <View style={{ paddingVertical: px(20), alignItems: 'center' }}>
          <Text style={styles.footerText}>我是有底线的～</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={{ width: px(393), height: px(98), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'flex-end' }}>
        <View style={{ width: '100%', paddingHorizontal: px(16), marginBottom: px(18), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleback} style={{ position: 'absolute', left: px(16) }}>
            <Image source={require('../../../assets/images/my/left.png')} style={{ width: px(22), height: px(22) }} />
          </TouchableOpacity>
          <Text style={styles.title}>注册用户</Text>
        </View>
      </View>

      <FlatList
        data={registeruser}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Useritem item={item} navigation={navigation} />}
        contentContainerStyle={{ paddingHorizontal: px(16), paddingBottom: px(52), gap: px(16) }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#999" />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        style={{marginTop: px(16),}}
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
  firmoney: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(26),
    color: '#1A1A1A',
    lineHeight: px(34),
  },
  firtitle: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(14),
    color: '#767676',
    fontWeight: '400',
    lineHeight: px(19),
  },
  idnumber: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(12),
    color: '#767676',
    fontWeight: '400',
    lineHeight: px(16),
  },
  nikename: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(14),
    color: '#1A1A1A',
    lineHeight: px(19),
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