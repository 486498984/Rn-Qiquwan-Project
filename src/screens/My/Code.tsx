import { StyleSheet, Text, View ,Image,TextInput,
    Keyboard, TouchableWithoutFeedback,TouchableOpacity,Modal,Platform
} from 'react-native'
import React,{useState} from 'react'
import { px } from '../../utils/scaleUtils';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import LinearGradient from 'react-native-linear-gradient';
import { Toast } from '@ant-design/react-native';
import WebviewModal from '../../components/Home/WebviewModal'
import { smsState } from '../../utils/global';
import { BASE_URL } from '../../api/config';



export default function Code({navigation}) {
  const [radiostatus, setRadiostatus] = useState(false);
    const [visible, setVisible] = useState(false);
    const [yinsivisible, setYinsivisible] = useState(false);
    const [phonenum, setPhonenum] = useState(null);
    const onChangeText = (e) => { 
        console.log(e);
        setPhonenum(e)
      };
    const handleradio = () => { 
    setRadiostatus(!radiostatus)
   };
  const handleUserAgreement = () => {
    setVisible(true)
  };

  const handlePrivacyPolicy = () => {
    setYinsivisible(true)
  };
  const closeModal = () => {
  setVisible(false)
  setYinsivisible(false)
}
    // 定义手势
    const swipeRightGesture = Gesture.Pan()
      .onUpdate(e => {
          console.log(e);
        // e.translationX 大于一定值认为右滑
        if (e.translationX > 35) {
        scheduleOnRN(closeModal);
        }
      });
        // 判断手机号是否为11位数字
  const isFullPhone = phonenum?.length === 11;
  const isValidPhone = (phone) => /^1[3-9]\d{9}$/.test(phone);
    const handleLogin = () => {  //点击获取验证码
  if(!radiostatus){
       Toast.show({
          content: '请勾选用户协议与隐私协议',
          duration: 1,
          position: 'center',
          mask: false,
        })
    return
  }
       if(!isValidPhone(phonenum)){
          Toast.show({
          content: '请输入正确格式的手机号',
          duration: 1,
          position: 'center',
          mask: false,
        })
          return;
        }
      const now = Date.now();
      if (smsState.expireTime > now) {
      console.log('还在倒计时中');
      navigation.navigate('Confirm',{phonenum:phonenum});
      }else{
      console.log("请求接口");
      getphonenum();
      }
      };
      const handleback = () => {  //返回上一页
      navigation.goBack();
      };
       const getphonenum = async() => {  //获取手机验证码
          const res = await fetch(`${BASE_URL}/sms/send-code?phone=${phonenum}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          var data = await res.json();
          console.log(data);
          if(data.code==0){
          navigation.navigate('Confirm',{phonenum:phonenum});
          const now = Date.now();
          smsState.expireTime = now + 60 * 1000;
          Toast.info('验证码已发送，请注意查收', 3);
          }else{
          Toast.info('验证码发送失败，请稍后重试或其他登陆方式', 2);
          }
        };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <View style={styles.topbox}>
 <Image source={require('../../../assets/images/my/codeback.png')} 
    style={{width:px(393),height:px(386),position: 'absolute',top:0}}></Image>
      <TouchableOpacity onPress={handleback}>
     <Image source={require('../../../assets/images/my/left.png')} 
    style={{width:px(22),height:px(22),marginTop:px(58),marginLeft: px(16),}}></Image>
    </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal:px(34),marginTop: px(32),}}>
   <Text style={styles.title}>Hi~欢迎登录</Text>
   <View style={styles.input}>
  <Text style={styles.phonedes}>+86</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: '#767676',
    marginLeft: px(8),
  }}></View>
   <TextInput
   allowFontScaling={false}
          style={styles.inputbox}
          onChangeText={onChangeText}
          value={phonenum || ''}
          placeholder="请输入手机号"
          keyboardType="number-pad"
          placeholderTextColor="#AAAAAA"
          maxLength={11}
          selectionColor='#FC9026'
        />
   </View>
           <Text style={styles.destext}>未注册的手机号验证后将自动注册为新账号</Text>

             <View style={{flexDirection: 'row',marginTop:px(0),alignItems: 'center',
               marginLeft: px(10),}}>
                   {!radiostatus&& <TouchableOpacity onPress={handleradio}
                   style={{width: px(32),height: px(32),
                       flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                   }}>
                       <Image resizeMode="contain" source={require('../../../assets/images/my/nopre.png')} 
                       style={{width: px(17),height: px(17)}}></Image></TouchableOpacity>}
                   {radiostatus&&<TouchableOpacity onPress={handleradio}
                   style={{width: px(32),height: px(32),
                       flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                   }}>
                       <Image resizeMode="contain" source={require('../../../assets/images/my/sepre.png')} 
                       style={{width: px(17),height: px(17)}}></Image></TouchableOpacity>}
                   <Text style={styles.text}>
                 阅读并同意
                 <Text style={styles.link} onPress={handleUserAgreement}>
                   《用户协议》
                 </Text>
                 和
                 <Text style={styles.link} onPress={handlePrivacyPolicy}>
                   《隐私政策》
                 </Text>
               
               </Text>
                 </View>
                 <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
                    justifyContent: 'center',
                 }}>
  <TouchableOpacity style={{marginTop: px(10),opacity:isFullPhone ? 1 : 0.5}}
          onPress={handleLogin} activeOpacity={0.8}>
         <LinearGradient
            colors={['#FEC525', '#FC9026']} // 渐变颜色
            start={{ x: 1, y: 0 }}   
            end={{ x: 0, y: 0 }}
            style={styles.gradientBox}
          >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
            <Text style={styles.logintext}>获取验证码</Text>
            </View>
          </LinearGradient>
          </TouchableOpacity>
                 </View>
      
      </View>
         <WebviewModal visible={visible} setVisible={setVisible} 
         uri={'https://s.tourok.com.cn/user.html'} swipeRightGesture={swipeRightGesture}
         title={"柒趣玩用户协议"}
         ></WebviewModal>
           <WebviewModal visible={yinsivisible} setVisible={setYinsivisible} 
         uri={'https://s.tourok.com.cn/privacy.html'} swipeRightGesture={swipeRightGesture}
         title={"柒趣玩隐私保护政策"}
         ></WebviewModal>
    </View>
    
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
        logintext:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
    },
          gradientBox: {
    width:px(303),
    height: px(48),
    borderRadius: px(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
              titlee: {
        flex: 1,
        textAlign: 'center',
         fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        //color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
        marginRight: px(24),
      },
       header: {
        height: px(50),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px(10),
        backgroundColor: '#fff',
        borderBottomWidth: px(1),
        borderBottomColor: '#ddd',
      },
            text: {
        marginLeft: px(0),
        //width: px(285),
        fontFamily: 'MiSans-Regular',
        lineHeight:px(17),
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
      },
        link: {
        fontFamily: 'MiSans-Regular',
        lineHeight:px(17),
        fontSize:px(13),
        fontWeight:400,
        color: '#1A1A1A', // 蓝色高亮
      },
    destext:{
    fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
        marginLeft: px(18),
        marginTop: px(10),
    },
    inputbox:{
          flexDirection: 'row',
  alignItems: 'center',
  width: px(325),
  height: px(60),
        fontSize: px(16),
  marginLeft: px(8),
    },
    phonedes:{
    fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
        marginLeft: px(7),
    },
    input:{
        flexDirection: 'row',
        alignItems: 'center',
  width: px(325),
  height: px(60),
  borderWidth: px(1.5),
  borderColor: '#FEC525',
  borderRadius: px(30),
  marginTop: px(30),
  backgroundColor: '#fff',
    },
    title:{
         letterSpacing:px(2),
    fontFamily: 'MiSans-Medium',
        fontSize:px(25),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(33),
    },
    topbox:{
    position: 'relative',
    },
    container:{
        flex: 1,
        backgroundColor: '#fff',
    }
})