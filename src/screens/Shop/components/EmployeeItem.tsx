import { StyleSheet, Text, View,TouchableOpacity, } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';


const EmployeeItem=({navigation})=> {
  const [type, setType] = useState(1);
  return (
    <View style={styles.employbox}>
        <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
      <Text style={styles.nickname}>刘先生</Text>
            <Text style={styles.idnumber}>ID：549072</Text>
        </View>
   <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(7),
   }}>
      <Text style={styles.idnumber}>账号：19983458001</Text>
            <Text style={styles.idnumber}>角色：客服、运营</Text>
        </View>
<View style={{width: px(345),height: px(1),backgroundColor: 'rgba(118, 118, 118, 0.1)',
    marginTop: px(11),
}}></View>



      <View style={{marginTop: px(8),flexDirection: 'row',alignItems: 'center',
              justifyContent: 'space-between',}}>
                <Text style={styles.creattime}>创建时间： 2026.04.02</Text>
                <View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>
                             <TouchableOpacity style={styles.cannelbox} 
          >
    <Text style={styles.canneltext}>删除</Text>
      </TouchableOpacity>
           <TouchableOpacity style={styles.cannelbox} 
           onPress={()=>navigation.navigate('ShopEditEmployee',{type:2})}>
    <Text style={styles.canneltext}>编辑</Text>
      </TouchableOpacity>
      {type==1&&
        <TouchableOpacity style={styles.cannelbox} >
    <Text style={styles.canneltext}>禁用</Text>
      </TouchableOpacity>
      }
       {type==2&&
          <TouchableOpacity>
     <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.gradientBox]}
        >
          <Text style={styles.logintext}>
            启用
          </Text>
        </LinearGradient>
  </TouchableOpacity>
    }

  </View>
  </View>


    </View>
  )
}
export default React.memo(EmployeeItem);
const styles = StyleSheet.create({
        creattime:{
        width: px(59),
        height: px(26),
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
            canneltext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        lineHeight:px(16),
        color:'#1A1A1A',
        fontWeight:400,
    },
    cannelbox:{
width: px(80),
height: px(26),
borderRadius: px(15),
borderWidth: px(1),
borderColor: '#D8D8D8',
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
    },
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
employbox:{
    backgroundColor: '#fff',
    padding:px(8),
    width: '100%',
    borderRadius: px(8),
}
})