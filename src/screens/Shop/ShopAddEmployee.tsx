import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput,ScrollView, } from 'react-native'
import React,{useState,} from 'react'
import { px } from '../../utils/scaleUtils';
import AccountItem from './components/AccountItem'





export default function ShopAddEmployee({navigation}) {
 const [username, setUsername] = useState(null);

 const handleback = () => {  //返回上一页
   navigation.goBack();
  };
    const onChangeText = (e) => { 
    console.log(e);
    setUsername(e)
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
             justifyContent:'center',marginBottom: px(8),paddingHorizontal:px(16)
            }}>
    <View style={{width: px(317),height: px(32),backgroundColor: '#F2F3F5',
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
            placeholder="输入注册手机号码查询"
            placeholderTextColor="#AAAAAA"
            maxLength={20}
            selectionColor='#FC9026'
            />
            </View>
            </View>
         
          </View>
     <ScrollView contentContainerStyle={{paddingTop: px(8),paddingHorizontal:px(16),
        paddingBottom:px(50)
     }}>
    {[0,1,2,3,4,5,6].map((item,index)=>
    <View key={index} style={{marginTop: px(8)}}>
    <AccountItem navigation={navigation}></AccountItem>
    </View>
    )}

        
     </ScrollView>




    </View>
  )
}

const styles = StyleSheet.create({
          inputbox:{
  paddingTop:0,
  paddingBottom:0,
    marginLeft: px(7),
  width: px(225),
  height: px(32),
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