import { StyleSheet, Text, View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Image,TextInput,
Animated,RefreshControl,
ScrollView,Platform,
 } from 'react-native'
import React,{useState,useEffect,useCallback,} from 'react'
import { px } from '../../utils/scaleUtils';
import {
  Toast,
  Tooltip,
} from '@ant-design/react-native'
import EmployeeItem from './components/EmployeeItem'
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import request from '../../api/request'
import { useFocusEffect } from '@react-navigation/native';

export default function ShopEmployee({ navigation,route }) {
         const insets = useSafeAreaInsets();
          const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
      const [username, setUsername] = useState(null);
    const {storeinfo}=route.params||{}

const [list, setList] = useState([]);
const [page, setPage] = useState(1);
const [refreshing, setRefreshing] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);
const [hasMore, setHasMore] = useState(true);




     const onChangeText = (e) => {
      console.log(e);
      setUsername(e)
        // 搜索时重新加载第一页
     getemployeelist(1, true, e);
     };
      const handleback = () => {  //返回上一页
   navigation.goBack();
  };

    const handlesubmit = () => {  //提交
    navigation.navigate('ShopAddEmployee',{storeinfo})
    };
useFocusEffect(
  useCallback(() => {
    if (!storeinfo) return;

    // 重置状态
    setPage(1);
    setHasMore(true);

    // 关键：必须是“刷新模式”
    getemployeelist(1, true, username);

  }, [storeinfo, username])
);
useEffect(() => {
  if (storeinfo) {
    console.log(storeinfo);
    getemployeelist(1, true);
  }
}, [storeinfo]);
const getemployeelist = async(pageNum = 1, 
  isRefresh = false ,keyword = username,) => {
  try {

    if (!isRefresh) {
      setLoadingMore(true);
    }

    const response = await request({
      url: '/store/role/list',
      method: 'GET',
      data:{},
      query: {
        storeId: storeinfo,
        page: pageNum,
        pageSize: 10,
        keyword: keyword || '',
      }
    });

    console.log(response);

    if (response.data !== undefined && response.code == 0) {

      let res = response.data.list || [];

      // 是否还有更多
      setHasMore(res.length >= 10);

      // 刷新
      if (isRefresh) {
        setList(res);
      } else {
        setList(prev => [...prev, ...res]);
      }

      setPage(pageNum);
    }

  } catch (error) {
    console.error(error);
  } finally {
    setRefreshing(false);
    setLoadingMore(false);
  }
};
const onRefresh = () => {
    setRefreshing(true);
  getemployeelist(1, true);
};
const loadMore = () => {

  if (loadingMore || !hasMore) return;

  getemployeelist(page + 1, false);
};


  return (
    
     <View style={styles.container}>
        <View style={{width: px(393),height: px(135),backgroundColor: '#fff',
                   flexDirection: 'column',justifyContent: 'flex-end',
                 }}>
                   <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(15),
                     flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                   }}>
      <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
        left: px(16),}}>
        <Image source={require('../../../assets/images/my/left.png')} 
        style={{width:px(22),height:px(22)}}></Image>
        </TouchableOpacity>
        <Text style={styles.title}>员工管理</Text>
            </View>
            <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
             justifyContent:'space-between',marginBottom: px(8),paddingHorizontal:px(16)
            }}>
    <View style={{width: '100%',height: px(32),backgroundColor: '#F2F3F5',
             borderRadius: px(20), flexDirection: 'row',alignItems: 'center',
             padding:px(0),
            }}>
            <Image source={require('../../../assets/images/my/search1.png')} 
            style={{width:px(16),height:px(16),marginLeft: px(8),}}></Image>
            <TextInput
            allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder="搜索"
            placeholderTextColor="#AAAAAA"
            maxLength={20}
            selectionColor='#FC9026'
            />
            </View>

            </View>
         
          </View>
 <ScrollView contentContainerStyle={{paddingTop:px(8),paddingHorizontal:px(16),
 paddingBottom:px(155),}}  showsVerticalScrollIndicator={false}
   refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#FC9026']}
      tintColor={'#FC9026'}
    />
   }
   onScroll={({ nativeEvent }) => {
  const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

  const isCloseToBottom =
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - 20;

  if (isCloseToBottom) {
    loadMore();
  }
}}
scrollEventThrottle={200}
 >
  {list?.map((item,index)=>
      <View key={index} style={{marginTop: px(8),}}>
    <EmployeeItem navigation={navigation} item={item}
      onRefresh={onRefresh}
    ></EmployeeItem>
      </View>
  )}
{
  loadingMore &&
  <View style={{paddingVertical:px(18),alignItems:'center'}}>
    <Text style={styles.bottomtext}>
      加载中...
    </Text>
  </View>
}

{
  !hasMore && list.length > 0 &&
  <View style={{paddingVertical:px(18),alignItems:'center'}}>
    <Text style={styles.bottomtext}>
      没有更多了
    </Text>
  </View>
}

{
  !hasMore && list.length == 0 &&
  <View style={{paddingVertical:px(18),alignItems:'center'}}>
    <Text style={styles.bottomtext}>
      暂无员工
    </Text>
  </View>
}
 </ScrollView>

    <View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
    flexDirection: 'row',justifyContent: 'center',
 }}>
     <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
     alignItems: 'center',gap:px(3)}}>
 <View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
     gap:px(21)
 }}>
        <TouchableOpacity onPress={()=>handlesubmit()}>
         <LinearGradient
               colors={['#FEC525', '#FC9026']} // 渐变颜色
               start={{ x: 1, y: 0 }}   
               end={{ x: 0, y: 0 }}
               style={[styles.payBox,{width: px(242),}]}
               >
               <View style={{flexDirection: 'row',alignItems: 'center',}}>
               <Text style={styles.xiadantx}>添加员工</Text>
               </View>
               </LinearGradient>
               </TouchableOpacity>
 </View>
 </View>
 </View>  
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
                    xiadantx:{
      fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(20),
    },
            payBox:{
      //marginTop: px(8),
  width: px(170),
  height: px(38),
  borderRadius: px(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
      alltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
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
      inputbox:{
       //backgroundColor: 'red',
  paddingTop:0,
  paddingBottom:0,
    marginLeft: px(7),
  
  width: px(285),
  //height: px(32),
  fontSize: px(12),
  fontFamily: 'MiSans-Regular',
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