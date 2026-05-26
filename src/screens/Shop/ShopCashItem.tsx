import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { px } from '../../utils/scaleUtils';
import CashItem from './components/CashItem';
import request from '../../api/request';
import { Toast } from '@ant-design/react-native';

export default function ShopCashItem({ navigation, route }) {
  const { id, type } = route.params || {};

  const [withlist, setWithlist] = useState([]); // 提现列表
  const [page, setPage] = useState(1);          // 当前页
  const [pageSize] = useState(10);             // 每页条数
  const [loading, setLoading] = useState(false); // 底部加载状态
  const [refreshing, setRefreshing] = useState(false); // 下拉刷新状态
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据

  const handleback = () => navigation.goBack();

  useEffect(() => {
    if (id) {
      fetchData(1, true); // 初始加载第一页
    }
  }, [id]);

  // 获取提现记录
  const fetchData = async (pageNumber = 1, replace = false) => {
    if (loading) return; // 避免重复请求
    setLoading(true);
    try {
      const response = await request({
        url: '/withdraw/list',
        method: 'GET',
        query: {
          ownerId: id,
          ownerType: type,
          page: pageNumber,
          pageSize,
        },
      });

      if (response.data !== null && response.code === 0) {
        const list = response.data.list || [];
        if (replace) {
          setWithlist(list);
        } else {
          setWithlist(prev => [...prev, ...list]);
        }
        setHasMore(list.length === pageSize); // 如果返回条数 < pageSize，则没有更多
        setPage(pageNumber); // 更新当前页
      }
    } catch (error) {
      console.error(error);
      Toast.show('获取提现记录失败');
    } finally {
      setLoading(false);
      if (refreshing) setRefreshing(false);
    }
  };

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(1, true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 底部加载更多
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchData(page + 1);
    }
  };

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator style={{ marginVertical: px(10) }} />;
    }
    if (withlist.length === 0) {
      return <Text style={styles.footerText}>暂无内容</Text>;
    }
    if (!hasMore) {
      return <Text style={styles.footerText}>我是有底线的～</Text>;
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
          <Text style={styles.title}>历史提现</Text>
        </View>
      </View>

      <FlatList
        data={withlist}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item,index }) => 
          <View style={{backgroundColor: '#fff',flexDirection: 'column',
            justifyContent: 'center',
          }}>

        <CashItem data={item} />
        <View style={{width: '100%',flexDirection: 'row',justifyContent: 'center',
            marginTop: px(12),
        }}>
          {index!==withlist.length-1&&
           <View style={{width: px(361),height: px(1),
        backgroundColor: 'rgba(118, 118, 118, 0.2)',
        }}></View> 
          }
       
        </View> 
 </View>
      }
        contentContainerStyle={{ paddingTop: px(16), paddingBottom: px(50) }}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    footerText: {
      marginTop: px(16),
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
    backgroundColor: '#F7F8FC',
  },
});