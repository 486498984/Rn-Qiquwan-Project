import { StyleSheet, Text, View ,TouchableOpacity,Image,ScrollView} from 'react-native'
import React,{useEffect,useState} from 'react'
import { px } from '../../utils/scaleUtils';
import RewardOrder from '../../components/My/RewardOrder'

const orderlist1=[{type:1},{type:1},{type:1},{type:1},{type:1},{type:1}] //待入账
const orderlist2=[{type:2},{type:2},{type:2},{type:2},{type:2},{type:2}] //可提现
const orderlist3=[{type:1},{type:1},{type:2},{type:2},{type:2},{type:2}] //订单
export default function InviteOrder({navigation,route}) {
 const { type, userid } = route.params || {};
   const [title, setTitle] = useState("可提现");
   const [order, setOrder] = useState(orderlist1);
     console.log(type);   // 3
  console.log(userid); // 15
  useEffect(() => {
  if (type!==undefined&&type!==null) {
   console.log(type);
   if(type==1){
    setOrder(orderlist2)
  setTitle("可提现")
   }else if(type==2){
    setOrder(orderlist1)
  setTitle("待入账")
   }else if(type==3){
    setOrder(orderlist3)
  setTitle("订单")
   }
  }
}, [type, userid]);
  const handleback = () => {  //返回上一页
   navigation.goBack();
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
             <Text style={styles.title}>{title}</Text>
                </View>
              </View>
<ScrollView contentContainerStyle={{paddingHorizontal:px(16),paddingBottom:px(42)}}
showsVerticalScrollIndicator={false}>
   {order.map((item,index)=>
        <View key={index}>
        <RewardOrder item={item}/>
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