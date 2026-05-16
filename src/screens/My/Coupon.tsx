import { StyleSheet, Text, View ,TouchableOpacity,Image,TextInput,
TouchableWithoutFeedback,Keyboard,ScrollView,FlatList,
} from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import request from '../../api/request';
import CouponItem from '../../components/My/CouponItem'
import { Toast } from '@ant-design/react-native';
import Storage from '../../utils/storage';


const shoplistd=[
    { key: "0",title:'全部',type:1, },
  { key: "1",title:'护航',type:2, },
  { key: "2",title:'大神',type:3, },
    { key: "0",title:'全部',type:1, },
  { key: "1",title:'护航',type:2, },
  { key: "2",title:'大神',type:3, },
    { key: "0",title:'全部',type:1, },
  { key: "1",title:'护航',type:2, },
  { key: "2",title:'大神',type:3, },
];
export default function Coupon({navigation}) {
       const [username, setUsername] = useState(null);


const [couponList, setCouponList] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
          const onChangeText = (e) => { 
           console.log(e);
           setUsername(e)
         };
 const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     const handleExchange = () => { 
         console.log(131);
         if(username==null||username==""){
         Toast.show({
          content: '请先输入兑换码',
          duration: 1,
          position: 'center',
          mask: false,
        })
        return
        }
      };
      useEffect(() => {
      getcoupons(1, true);
      }, [])
 const getcoupons = async (currentPage = 1, refresh = false) => {

  // 防止重复加载
  if (loading) {
    return;
  }

  // 没有更多了
  if (!hasMore && !refresh) {
    return;
  }

  setLoading(true);

  const user = await Storage.get("userinfo");

  if (user == null) {
    setLoading(false);
    return;
  }

  try {

    const response = await request({
      url: '/user/coupons',
      method: 'GET',
      query: {
        userId: user.user.userId,
        page: currentPage,
        size: 1000,
      },
    });

    console.log(response);

    if (response.data && response.code == 0) {

      const newList = response.data.list || [];

      // 下拉刷新 / 首次加载
      if (refresh) {

        setCouponList(newList);

      } else {

        // 加载更多
        setCouponList(prev => [...prev, ...newList]);

      }

      // 更新页码
      setPage(currentPage);

      // 是否还有更多
      setHasMore(response.data.hasMore);

    }

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};
const loadMore = () => {

  if (loading || !hasMore) {
    return;
  }

  getcoupons(page + 1);

};
  return (

    <View style={styles.container} >
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
            <Text style={styles.title}>优惠券</Text>
               </View>
             </View>

{/* <View style={{paddingHorizontal:px(16),flexDirection: 'column',alignItems: 'center',
    paddingBottom:px(10)
}}>
<View style={{width: px(361),height: px(51),backgroundColor: '#fff',
    borderRadius: px(14),marginTop: px(10),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <TextInput
    allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder="请输入兑换码"
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
            keyboardType="ascii-capable"
          />
          <TouchableOpacity style={{width:px(68),height: px(35),backgroundColor: '#FF9500',
            borderRadius: px(8),flexDirection: 'row',alignItems: 'center',
            justifyContent: 'center',marginRight: px(8),
          }} onPress={()=>handleExchange()}>
 <Text style={styles.exchange}>兑换</Text>
          </TouchableOpacity>
</View>
</View> */}
<FlatList
  data={couponList}
  keyExtractor={(item, index) => index.toString()}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingHorizontal: px(16),
    paddingBottom: px(32),
  }}

  renderItem={({ item }) => (
    <CouponItem
      item={item}
      navigation={navigation}
    />
  )}

  // 触底加载
  onEndReached={loadMore}

  // 提前触发
  onEndReachedThreshold={0.2}

  ListFooterComponent={() => {

    // 没数据
    if (couponList.length == 0) {
      return (
        <View style={{ alignItems:'center', marginTop:px(20) }}>
          <Text style={styles.bottomtext}>暂无内容</Text>
        </View>
      )
    }

    // 加载中
    if (loading) {
      return (
        <View style={{ alignItems:'center', marginTop:px(16) }}>
          <Text style={styles.bottomtext}>加载中...</Text>
        </View>
      )
    }

    // 没更多
    if (!hasMore) {
      return (
        <View style={{ alignItems:'center', marginTop:px(16) }}>
          <Text style={styles.bottomtext}>我是有底线的～</Text>
        </View>
      )
    }

    return null;
  }}
/>
    </View>
      
  )
}

const styles = StyleSheet.create({
          bottomtext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(17),
  },
    exchange:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#fff',
        fontWeight:400,
        lineHeight:px(19),
    },
      inputbox:{
    marginLeft: px(12),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(240),
  height: px(51),
  fontSize: px(14),
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
        backgroundColor: '#F2F3F5',
    }
})