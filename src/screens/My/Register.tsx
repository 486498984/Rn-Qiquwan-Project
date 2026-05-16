import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView} from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';


const Useritem=({navigation})=>{
    return(
<View style={{width: px(361),height: px(131),backgroundColor: '#fff',
    borderRadius: px(12),paddingHorizontal:px(16)
}}>
  <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',marginTop: px(14),
  }}>
<View style={{flexDirection: 'row',alignItems:'center',
    gap:px(8)
}}>
       <Image source={require('../../../assets/images/my/defultavtar.png')} 
   style={{width:px(28),height:px(28),borderRadius: px(14),}}></Image>
<Text style={styles.nikename}>Cougar Liu</Text>
</View>
<Text style={styles.idnumber}>ID 352235</Text>
  </View>

  <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(10),
  }}>
    <View style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(6)}}>
<Text style={styles.firtitle}>全部消费(元)</Text>
<Text style={styles.firmoney}>1718.99</Text>
    </View>
        <View style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(6)}}>
<Text style={styles.firtitle}>累计佣金(元)</Text>
<Text style={styles.firmoney}>17.99</Text>
    </View>
    <TouchableOpacity style={{flexDirection: 'column',alignItems: 'flex-start',
    gap:px(6)}} onPress={()=>navigation.navigate('InviteOrder',{type:3,userid:15})}>
   <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.firtitle}>订单</Text>
  <Image source={require('../../../assets/images/my/cright.png')} 
   style={{width:px(20),height:px(20)}}></Image>
        </View>
<Text style={styles.firmoney}>12</Text>
    </TouchableOpacity>
  </View>
</View>
    )

};
export default function Register({navigation}) {
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
               <Text style={styles.title}>注册用户</Text>
                  </View>
                </View>
                <ScrollView contentContainerStyle={{paddingHorizontal:px(16),
                    paddingBottom:px(52)
                }}
                showsVerticalScrollIndicator={false} style={{paddingTop:px(16),
                }}>
                <View style={{gap:px(16)}}>
                {[0,1,2,3,4,5].map((item,index)=>
                    <View key={index}>
                    <Useritem navigation={navigation}/>
                    </View>
                    )}
                </View>
                  

                </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
        firmoney:{
    fontFamily: 'MiSans-Medium',
        fontSize:px(26),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(34),
    },
    firtitle:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(19),
    },
        idnumber:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(16),
    },
        nikename:{
    fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(19),
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