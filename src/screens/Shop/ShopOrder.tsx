import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,
Animated,FlatList,RefreshControl,ActivityIndicator,
 } from 'react-native'
import React,{useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import OrderItem from './components/TodayOrderItem';
import request from '../../api/request'



export default function ShopOrder({navigation,route}) {
  const { type, id } = route.params || {}

  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (id) {
      fetchList(1, true)
    }
  }, [id])

  // ===== 获取列表 =====
  const fetchList = async (pageNum = 1, isRefresh = false) => {
    try {
      const response = await request({
        url: '/store/dashboard/today/orders',
        method: 'GET',
        query: {
          storeId: id,
          page: pageNum,
          pageSize: 10,
        },
      })

      if (response.code === 0 && response.data) {
        const newList = response.data.list || []

        if (isRefresh) {
          setList(newList)
        } else {
          setList(prev => [...prev, ...newList])
        }

        setHasMore(newList.length === 10)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
      setLoadingMore(false)
    }
  }

  // ===== 下拉刷新 =====
  const onRefresh = () => {
    setRefreshing(true)
    setPage(1)
    fetchList(1, true)
  }

  // ===== 上拉加载 =====
  const onEndReached = () => {
    if (loadingMore || !hasMore) return

    const nextPage = page + 1
    setPage(nextPage)
    setLoadingMore(true)
    fetchList(nextPage, false)
  }

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={{ paddingVertical: px(16) }}>
          <ActivityIndicator />
          <Text style={styles.bottomtext}>
            加载中...
          </Text>
        </View>
      )
    }

    if (!hasMore && list.length > 0) {
      return (
        <View style={{ paddingVertical: px(16) }}>
          <Text style={styles.bottomtext}>
            我是有底线的～
          </Text>
        </View>
      )
    }
    if (!hasMore && list.length == 0) {
      return (
        <View style={{ paddingVertical: px(16) }}>
          <Text style={styles.bottomtext}>
            暂无内容
          </Text>
        </View>
      )
    }
    return null
  }
    const handleback = () => navigation.goBack()


  return (
    <View style={styles.container}>
         <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
        flexDirection: 'row',alignItems: 'flex-end',
      }}>
        <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
          flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
        }}>
    <TouchableOpacity onPress={handleback}  style={{  position: 'absolute',
    left: px(16),}}>
      <Image source={require('../../../assets/images/my/left.png')} 
      style={{width:px(22),height:px(22)}}></Image>
      </TouchableOpacity>
      <Text style={styles.title}>{'今日订单'}</Text>

        </View>
      </View>

      {/* 列表 */}
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <OrderItem item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingHorizontal: px(16),
          paddingBottom: px(50),
          paddingTop:px(16)
        }}
      />



    </View>
  )
}

const styles = StyleSheet.create({
    bottomtext: {
    textAlign:'center',
     fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
  },
  tooltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
  },
  alltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
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
        backgroundColor: '#F7F8FC',
    }
})