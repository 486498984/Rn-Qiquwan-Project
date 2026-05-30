import { StyleSheet, Text, View,TouchableOpacity,Image,
ScrollView,
 } from 'react-native'
import React,{useEffect,useState} from 'react'
import { px } from '../../utils/scaleUtils';
import request from '../../api/request'
import {
  Tooltip,
  Toast,
} from '@ant-design/react-native';
import Storage from '../../utils/storage';
import Noticeplam from './components/Noticepla'

export default function Noticepla({navigation}) {
  const [noticelist, setNoticelist] = useState([]); //公告列表
  const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);



    const handleback = () => {  //返回上一页
     navigation.goBack();
     };
     useEffect(() => {
      getnoticelist()
     }, [])
const getnoticelist = async (pageNum = 1) => {
  if (loading) return;

  setLoading(true);

  try {
    const response = await request({
      url: '/notice/admin/list',
      method: 'GET',
      query: {
        page: pageNum,
        pageSize: 20,
      },
    });

    if (response.data !== null && response.code === 0) {
      const list = response.data.list || [];

      if (pageNum === 1) {
        setNoticelist(list);
      } else {
        setNoticelist(prev => [...prev, ...list]);
      }

      // 是否还有更多
      if (list.length < 20) {
        setHasMore(false);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
     const handleLoadMore = () => {
  if (loading || !hasMore) return;

  const nextPage = page + 1;
  setPage(nextPage);
  getnoticelist(nextPage);
};



  return (
    <View style={styles.container}>
       <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
               flexDirection: 'row',alignItems: 'flex-end',
             }}>
               <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
                 flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
               }}>
          <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
           left: px(16),}}>
            <Image source={require('../../../assets/images/my/left.png')} 
            style={{width:px(22),height:px(22)}}></Image>
            </TouchableOpacity>
            <Text style={styles.title}>官方公告</Text>
               </View>
             </View>

 <ScrollView contentContainerStyle={{flexDirection: 'column',alignItems: 'center',
  gap:px(16),paddingTop:px(16),paddingBottom:px(50)
 }}   showsVerticalScrollIndicator={false}
  onScroll={(e) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;

    const distance =
      contentSize.height -
      layoutMeasurement.height -
      contentOffset.y;

    if (distance < 80) {
      handleLoadMore();
    }
  }}
  scrollEventThrottle={16}
>
  {noticelist.map((item,index)=>
  <View key={index}>
  <Noticeplam item={item} navigation={navigation}></Noticeplam>
  </View>
  )}

</ScrollView>      


    </View>
  )
}

const styles = StyleSheet.create({
                title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
    container:{
        flex: 1,
        backgroundColor: '#F2F3F5',
    }
})