import { StyleSheet, Text, View,Image,TouchableOpacity,Modal,Platform,DeviceEventEmitter } from 'react-native'
import React,{useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { NativeModules } from 'react-native';
import { Button, Toast } from '@ant-design/react-native';
import { scheduleOnRN } from 'react-native-worklets';
import WebviewModal from '../../components/Home/WebviewModal'
import  request  from '../../api/request';
import Storage from '../../utils/storage';
import useAuthStore from '../../utils/zustand'
import { BASE_URL } from '../../api/config';




const sdkKey = Platform.OS === 'ios'
  ? 'dk4tqJZqC6XgvqGwFeg2bs1aNGsgMD72jBzac+he6GRPW08uV7qfrMioGtzDK1wDKoZ/rMGUCD06yGFYnb0CML7OvQZ+Mwhg+ljHkb/9rNn9swtPS/4ebltAAvfEtEsfWxtFojeJIgLPo6cCZTMzQiM3geOUdlNL8hou78VuQclSzYRAoyBBUOSsrSiirzuYDKcysNHYSk3Jsm9Yu52TZ3HLhrE0o7io/3vkkQUQiZPOzOzvWiqkj8HXdNnNAUvPb8Mf2IDcU8A='
  : 'xO7oZqhXc7ruvkCxEbbflaZLJ1O7ZWUoxbPnWYN/u9jz3g5B0bgJ8Bxuif6Xl8IItRyoSD2DnQ9Q8WiDUp21LqByV/jD73uUq2Ojyp44elJBSTHbRGfOVUhChBkqcx8v4KVD4MZg54zKmv4A9xYfMSbPEKLGvQEzIjgyrHwki21NeurYUX8efg0X5hdpVoQ33GJ+Kfq2Pxe7goMk8vS3sLPOgCJw9HhaY8fSjbQABnlsWhFIViaWpe9+RrVi6IUUIcdSduVTx49HrfWT1U5Nl8jJ/V9s0Af7f48b4bv9lMzUolxHz52AVw==';
const { AliOnePassModule,OaidModule, } = NativeModules;
export default function Login({navigation}) {
        const loginChanged = useAuthStore(state => state.loginChanged);
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
      const handleback = () => {  //返回上一页
      navigation.goBack();
     };
    const handleradio = () => { 
    setRadiostatus(!radiostatus)
   };
      const handleUserAgreement = () => { //用户协议
        navigation.navigate('UserAgree')
    //setVisible(true)
    //Alert.alert('跳转', '打开用户协议页面');
    // 这里可以用 navigation.navigate('UserAgreement');
  };

  const handlePrivacyPolicy = () => { //隐私协议
    navigation.navigate('PrivacyAgree')
    //setYinsivisible(true)
    //Alert.alert('跳转', '打开隐私政策页面');
    // 这里可以用 navigation.navigate('PrivacyPolicy');
  };
    const [radiostatus, setRadiostatus] = useState(false);
    const [visible, setVisible] = useState(false);
    const [yinsivisible, setYinsivisible] = useState(false);
    const [oaid, setOaid] = useState(""); //获取oaid


const handleLogin = async () => { //点击一键登陆
  //console.log(NativeModules)
  if(!radiostatus){
       Toast.show({
          content: '请勾选用户协议与隐私协议',
          duration: 1,
          position: 'center',
          mask: false,
        })
    return
  }
  try {
    const result = await AliOnePassModule.setAuthSDKInfo(sdkKey);
    console.log('SDK初始化结果:', result);
    // 先设置 UI
    await AliOnePassModule.setAuthUI();
    // 获取 token
    const token = await AliOnePassModule.getLoginToken();
    const tokenObj = JSON.parse(token);
    console.log(tokenObj.token);
    getuserinfo(tokenObj.token)
    console.log('拿到 Token:', token);
    // 成功后可以自动关闭授权页
    //AliOnePassModule.quitLoginPage();
  } catch (err) {
    console.log(err);
    
      //const tokenObj = JSON.parse(err);
      //console.log(tokenObj);
        const errObj = parseAliOnePassError(err);

  console.log('解析后的错误:', errObj);
    if (errObj?.code === '700000') {
    // 用户取消
    return;
  }
     Toast.show({
          content: '一键登陆失败，请重试或使用其他登陆方式',
          duration: 1,
          position: 'center',
          mask: false,
        })
    //console.error('获取 Token 失败:', err);
  }
};
useEffect(() => {
  getOAID();
}, [])
   const getOAID = async() => {
  try {
   console.log("getoaid");
   await OaidModule.init();
  const oaid = await OaidModule.getOAID();
  console.log('oaid',oaid);
  setOaid(oaid)
  } catch (e) {
    console.log(e);
  }
  };
//   const getOAID = async () => {
//   try {
//     const oaid = await OaidModule.getOAID();
//   console.log('modliue',oaid);
//   setOaid(oaid)
//     console.log('OAID=', oaid);
//   } catch (e) {
//     console.log(e);
//   }
// };  
const getuserinfo = async(e) => {
      const res = await fetch(`${BASE_URL}/onekey/login?token=${e}&deviceType=${Platform.OS}&deviceId=${1}&oaid=${oaid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      });
        var data = await res.json();
        console.log(data);
        if(data.code==0&&data.data!==null&&data.data!==undefined){
        await Storage.set('userinfo', JSON.stringify(data.data));
        loginChanged();
        setTimeout(() => {
        navigation.goBack(); // 返回上一个页面
        }, 500);

        }else{
         Toast.show({
          content: '一键登陆失败，请重试或使用其他登陆方式',
          duration: 1,
          position: 'center',
          mask: false,
        })
        } 
 };

function parseAliOnePassError(err) {
  try {
    // err 可能是 Error 对象
    let str = err?.message || err;

    // 去掉 Error: 前缀
    str = str.replace(/^Error:\s*/, '');

    // 第一层 JSON
    const obj = JSON.parse(str);

    // 第二层 JSON（运营商错误信息）
    if (obj.carrierFailedResultData) {
      try {
        obj.carrierFailedResultData = JSON.parse(obj.carrierFailedResultData);
      } catch (e) {}
    }

    return obj;
  } catch (e) {
    console.warn('解析失败:', err);
    return null;
  }
}
const handlephone = () => { 
  navigation.navigate('Code')
 };
  return (
    <View style={styles.container}>
    <Image source={require('../../../assets/images/my/loginback.png')} 
    style={{width: '100%',height:'100%',position: 'absolute',}}></Image>
    <View style={{marginTop: px(58),}}>
        <TouchableOpacity onPress={handleback}>
 <Image source={require('../../../assets/images/my/close.png')} 
    style={{width:px(22),height:px(22),marginLeft: px(15),}}></Image>
        </TouchableOpacity>
     
    <View style={{width: '100%',flexDirection: 'column',
    alignItems: 'center',marginTop: px(56),
    }}>
   <Image source={require('../../../assets/images/my/applogo.png')} 
    style={{width:px(85),height:px(85)}}></Image>
   <Text style={styles.title}>柒趣玩</Text>
      <Text style={styles.antitle}>让游戏体验更美好</Text>
      <TouchableOpacity style={{marginTop: px(164),}}
      onPress={handleLogin} activeOpacity={0.8}>
     <LinearGradient
        colors={['#FEC525', '#FC9026']} // 渐变颜色
        start={{ x: 1, y: 0 }}   
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
          <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Text style={styles.logintext}>一键登陆/注册</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>handlephone()}>
       <Text style={styles.anphone}>使用其他手机号登陆</Text>
      </TouchableOpacity>

  <View style={{flexDirection: 'row',marginTop:px(171),alignItems: 'center',
    justifyContent: 'center',}}>
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
  )
}

const styles = StyleSheet.create({
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
    anphone:{
        marginTop: px(22),
     fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#FC9026',
        fontWeight:400,
        lineHeight:px(19),
    },
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
        antitle:{
        marginTop: px(2),
        fontFamily: 'MiSans-Regular',
        fontSize:px(18),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(24),
    },
    title:{
        marginTop: px(14),
        fontFamily: 'DingTalk JinBuTi',
        fontSize:px(26),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(31),
    },
container:{
    flex: 1,
    //height: 800,
    backgroundColor: '#FFFFFF',
    position: 'relative',
}
})