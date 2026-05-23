import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView,RefreshControl,

 } from 'react-native';
import React, { useEffect, useState } from 'react';
import { px } from '../../utils/scaleUtils';
import request from '../../api/request';
import Storage from '../../utils/storage';
import OrderItem from '../../components/Shop/SaleItem';
   import useAuthStore from '../../utils/zustand';




export default function ShopSale({ navigation,route }) {
    const {id}=route.params||{}
  const [salelist, setSalelist] = useState([]); // 售后订单
  const [page, setPage] = useState(1); // 当前页
  const [pageSize] = useState(10); // 每页条数
  const [total, setTotal] = useState(0); // 数据总数
  const [loading, setLoading] = useState(false); // 加载中
  const [refreshing, setRefreshing] = useState(false); // 下拉刷新

    const orderListRefreshKey =
  useAuthStore(
    state => state.orderListRefreshKey
  );
  const handleback = () => {
    navigation.goBack();
  };

  useEffect(() => {
    
    if(id){
        console.log(id);
        getorderlist(page);
    }
  }, [orderListRefreshKey,id]);

  const getorderlist = async (currentPage = 1) => {
    const user = await Storage.get("userinfo");
    if (loading) return; // 防止重复加载
    setLoading(true);
    try {
      const response = await request({
        url: '/store/after-sale/list',
        method: 'GET',
        data: {},
        query: {
          storeId: id,
          page: currentPage,
          pageSize: pageSize,
        },
      });
      if (response.data !== undefined && response.code == 0) {
        const newList = response.data.list || [];
        if (currentPage === 1) {
          setSalelist(newList);
        } else {
          setSalelist(prev => [...prev, ...newList]);
        }
        setTotal(response.data.total || 0);
        setPage(currentPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (salelist.length >= total || loading) return;
    getorderlist(page + 1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getorderlist(1);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: px(393), height: px(98), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'flex-end' }}>
        <View style={{ width: '100%', paddingHorizontal: px(16), marginBottom: px(18), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleback} style={{ position: 'absolute', left: px(16) }}>
            <Image source={require('../../../assets/images/my/left.png')} style={{ width: px(22), height: px(22) }} />
          </TouchableOpacity>
          <Text style={styles.title}>售后</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: px(16), paddingBottom: px(50) }}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
            handleLoadMore(); // 滑到底部加载更多
          }
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200} // 控制 onScroll 的触发频率
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={{ gap: px(16), marginTop: px(16) }}>
          {salelist.map((item, index) => (
            <OrderItem item={item} key={index} navigation={navigation} />
          ))}
          {loading && <Text style={styles.smadestitle}>加载中...</Text>}
          {salelist.length > 0 && !loading && <Text style={styles.smadestitle}>我是有底线的～</Text>}
          {salelist.length == 0 && !loading && <Text style={styles.smadestitle}>暂无售后订单</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
          smadestitle:{
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