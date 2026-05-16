import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView, } from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import CashItem from './components/CashItem';

export default function ShopCashItem({navigation}) {
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
       <Text style={styles.title}>历史提现</Text>
          </View>
        </View>

    <ScrollView contentContainerStyle={{paddingTop:px(16),paddingBottom:px(50)}}>
    {[0,1,2,3,4,5,6,7,8,9,10].map((item,index)=>
        <View key={index}>
    <CashItem></CashItem>
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
        backgroundColor: '#F7F8FC',
    }
})