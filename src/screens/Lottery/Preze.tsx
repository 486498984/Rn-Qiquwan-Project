import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,
    RefreshControl,
 } from 'react-native'
import React,{useEffect,useState,} from 'react'
import { px } from '../../utils/scaleUtils';
import request from '../../api/request';
import PrizeItem from "./components/PrizeItem";
import Storage from '../../utils/storage';


export default function Preze({navigation}) {
    const [prize, setPrize] = useState([]);
   const handleback = () => {  //返回上一页
   navigation.goBack();
     };
useEffect(() => {
 getprize();
}, [])

    const getprize = async() => { 
  const user = await Storage.get("userinfo");
  if(user==null){
    return
  }
  try {
    const response = await request({
      url: '/lottery/records',
      method: 'GET',
        query: {
        userId: user.user.userId,
        page:1,
        pageSize:10,
      },
    });
    console.log(response);
    if (response.data && response.code == 0&&response.data.list!==null&&
        response.data.list.length!==0
    ) {
      setPrize(response.data.list)
      }
      } catch (error) {
        console.error(error);
      }
     };
           const [refreshing, setRefreshing] = useState(false);
     
       // 下拉触发
       const onRefresh = async () => {
         setRefreshing(true);
       getprize();
         // 模拟请求
         setTimeout(() => {
           setRefreshing(false);
         }, 1000);
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
               <Text style={styles.title}>已获得奖品</Text>
                  </View>
                </View>
                <ScrollView contentContainerStyle={{paddingHorizontal:px(16),
                    marginTop: px(10),backgroundColor: '#fff',flex: 1,
                }}
                showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }
      >
    {prize?.map((item,index)=>
    <PrizeItem key={index} item={item}></PrizeItem>
    )}
    {prize.length==0?
    (
    <View style={{width: '100%',flexDirection: 'row',justifyContent: 'center',
        marginTop: px(16),
    }}>
    <Text style={styles.bottomtext}>暂未获得奖品</Text>
    </View>)
    :(
         <Text style={styles.footerText}>
                  我是有底线的～
                </Text>
    )
    }
</ScrollView>
    </View>
  )
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
          bottomtext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
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