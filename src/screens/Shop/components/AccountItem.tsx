import { StyleSheet, Text, View,TouchableOpacity, } from 'react-native'
import React from 'react'
import { px } from '../../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';


const AccountItem=({navigation,item,storeinfo})=> {
  return (
    <View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(8),
    padding:px(8),
    }}>
         <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
          <Text style={styles.nickname}>{item?.nickName}</Text>
                <Text style={styles.idnumber}>ID：{item?.userId}</Text>
            </View>
       <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
        marginTop: px(7),
       }}>
          <Text style={styles.idnumber}>账号：{item?.phone}</Text>
                <Text style={styles.idnumber}>状态：{item.status=="ACTIVE"?'可用':'不可用'}</Text>
            </View>
            <View style={{width: px(345),height: px(1),backgroundColor: 'rgba(118, 118, 118, 0.1)',
                marginTop: px(11),
            }}></View>
            
            
            
                  <View style={{marginTop: px(8),flexDirection: 'row',alignItems: 'center',
                          justifyContent: 'flex-end',}}>
                            <View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>
  <TouchableOpacity onPress={()=>navigation.navigate('ShopEditEmployee',{type:1,item:item,storeinfo:storeinfo})}>
                 <LinearGradient
                      colors={['#FEC525', '#FC9026']}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 0 }}
                      style={[styles.gradientBox]}
                    >
                      <Text style={styles.logintext}>
                        添加员工
                      </Text>
                    </LinearGradient>
              </TouchableOpacity>
            
              </View>
              </View>
    </View>
  )
}
export default React.memo(AccountItem);
const styles = StyleSheet.create({
      logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(12),
    color: '#FFFFFF',
    lineHeight: px(16),
  },
    gradientBox: {
    width:px(80),
    height: px(26),
    borderRadius: px(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
    idnumber:{
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    nickname:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
})