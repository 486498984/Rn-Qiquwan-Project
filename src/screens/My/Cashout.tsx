import { StyleSheet, Text, View,TouchableOpacity,Image,Platform,TextInput,

 } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../utils/scaleUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '../../components/My/CustomModal';





export default function Cashout({ navigation }) {
    const [visible, setVisible] = useState(false);
      const insets = useSafeAreaInsets();
      const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
   const handleback = () => {  //返回上一页
   navigation.goBack();
     };
          const [username, setUsername] = useState(null);
           const [usernumber, setUsernumber] = useState(null);
            const onChangeText = (e) => { 
                console.log(e);
                setUsername(e)
              };
                     const onnumChangeText = (e) => { 
                console.log(e);
                setUsernumber(e)
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
              <Text style={styles.title}>提现</Text>
                 </View>
               </View>
<View style={{flexDirection: 'column',marginTop: px(16),backgroundColor: '#FFFFFF',
   padding:px(16),gap:px(16)
}}>
<Text style={styles.titletop}>提现至</Text>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>
 <Image source={require('../../../assets/images/home/zfb.png')} 
              style={{width:px(32),height:px(32)}}></Image>
              <Text style={styles.titletop}>支付宝</Text>
</View>
<View style={{width: px(361),backgroundColor: 'rgba(118, 118, 118,0.2)',height: px(1),}}></View>
<Text style={styles.zfbtitle}>支付宝账号</Text>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}  onPress={() => {
    setVisible(true);
  }}>
 {usernumber ? (
  <Text style={styles.zfbisdes}>{usernumber}</Text>
) : (
  <Text style={styles.zfbdes}>需填写实名认证的本人支付宝账号</Text>
)}
     
 <Image source={require('../../../assets/images/my/cright.png')} 
  style={{width:px(19),height:px(19)}}></Image>   
</TouchableOpacity>
</View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),gap:px(16)}}>
<Text style={styles.titletop}>提现金额</Text>
<View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(6)}}>
 <Text style={styles.titletop}>￥</Text>
  <Text style={styles.titletop}>199.00</Text>
</View>
  <Text style={styles.zfbdes}>可提现:199.00</Text>
</View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
 <Text style={styles.titletop}>手续费</Text>
<Text style={styles.zfbdes}>￥0</Text>
    </View>

<View style={{width: '100%',backgroundColor: '#fff',padding:px(16),
    marginTop: px(16),gap:px(16)}}>
 <Text style={styles.titletop}>提现须知</Text>
<View>
      <Text style={styles.zfbdes}>
        1、每日默认提现1次;{'\n'}
2、提现会产生0%手续费，最低0元，向上取整;{'\n'}
3、支付宝提现2小时内到账;</Text>
</View>
    </View>
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),alignItems: 'center',
        gap:px(3)
    }}>
 <TouchableOpacity>
 <LinearGradient
       colors={['#FEC525', '#FC9026']} // 渐变颜色
       start={{ x: 1, y: 0 }}   
       end={{ x: 0, y: 0 }}
       style={styles.payBox}
       >
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.xiadantx}>立即提现</Text>
       </View>
       </LinearGradient>
       </TouchableOpacity>
       <Text style={styles.bodes}>今日剩余提现次数：1次</Text>
    </View>
 
</View>



   <CustomModal visible={visible} onClose={() => setVisible(false)}
    width={px(323)} isclose={true}>
    <Text style={styles.destitle}>支付宝提现信息</Text>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>姓名</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder="请输入姓名"
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
          />
</View>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>账号</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onnumChangeText}
            value={usernumber || ''}
            placeholder="请输入支付宝账号"
            keyboardType="numbers-and-punctuation"
            placeholderTextColor="#AAAAAA"
            maxLength={22}
            selectionColor='#FC9026'
          />
</View>
<TouchableOpacity
  style={{ marginTop: px(32) }}
  onPress={() => {
    setVisible(false);
  }}
  activeOpacity={0.8}
>
  {
      // 正常渐变按钮
      <LinearGradient
        colors={['#FEC525', '#FC9026']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <Text style={styles.logintext}>
          提交
        </Text>
      </LinearGradient>
  }
</TouchableOpacity>
  </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
      inputbox:{
    marginLeft: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(325),
  height: px(51),
  fontSize: px(14),
    },
  nametx:{
    marginLeft: px(18),
   fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
  },
    logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(18),
    color: '#FFFFFF',
    lineHeight: px(24),
  },
              gradientBox: {
    width:px(291),
    height: px(48),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
        destitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(19),
    color: '#1A1A1A',
    lineHeight: px(25),
    },
    bodes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#9E9E9E',
        fontWeight:'400',
        lineHeight:px(15),
    },
        xiadantx:{
      fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
    },
        payBox:{
      marginTop: px(8),
  width: px(311),
  height: px(44),
  borderRadius: px(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
        zfbisdes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:'400',
        lineHeight:px(19),
    },
    zfbdes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:'400',
        lineHeight:px(19),
    },
    zfbtitle:{
       fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:'400',
        lineHeight:px(19),
    },
    titletop:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#1A1A1A',
        //fontWeight:500,
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