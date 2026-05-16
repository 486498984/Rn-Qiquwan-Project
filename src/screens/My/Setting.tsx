import { StyleSheet, Text, View,TouchableOpacity,Image,Alert,TextInput,

} from 'react-native'
import React,{useEffect,useState} from 'react'
import { px } from '../../utils/scaleUtils';
import Storage from '../../utils/storage';
import useAuthStore from '../../utils/zustand'
import CustomModal from '../../components/My/CustomModal';
import LinearGradient from 'react-native-linear-gradient';
import WebviewModal from '../../components/Home/WebviewModal'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { Toast } from '@ant-design/react-native';
import request from '../../api/request';



 const Underline=()=>{
return(
    <View style={{width: '100%',height: px(1),
    backgroundColor: 'rgba(118, 118, 118, 0.2)',
    marginTop: px(0),
}}></View>
)
 };
export default function Setting({navigation}) {
    const [toastApi, contextHolder] = Toast.useToast();
      const [visible, setVisible] = useState(false);
      const isLogin = useAuthStore(state => state.isLogin);
      const loginChanged = useAuthStore(state => state.loginChanged);
      const [userinfo, setUserinfo] = useState(null);
          const [uservisible, setUservisible] = useState(false);
          const [yinsivisible, setYinsivisible] = useState(false);
          const [editableinput, setEditableinput] = useState(true); //输入状态
       const handleback = () => {  //返回上一页
      navigation.goBack();
     };
     const logout = () => {
  Alert.alert(
    '提示',
    '确定要退出登录吗？',
    [
      {
        text: '取消',
        style: 'cancel',
        onPress: () => console.log('取消'),
      },
      {
        text: '确定',
        style: 'destructive', // iOS 红色按钮
        onPress: async() => {
          console.log('执行退出逻辑');
           await Storage.remove('userinfo');
           loginChanged();
           handleback();
          // 👉 在这里写你的退出登录逻辑
        },
      },
    ],
    {
      cancelable: true, // 安卓点击外部是否可关闭
    }
  );
};
  useEffect(() => {
   console.log('isLogin:', isLogin);
   getloginstatus();//获取登陆状态
   }, [isLogin]);
   const getloginstatus = async() => {  //获取登陆状态
   const user = await Storage.get("userinfo");
   if(user!==null){
   setUserinfo(user)
   getuserinfo(user)
   }else{
    setUserinfo(null)
   }
   console.log(user); // { name: 'Tom', age: 18 }
   };
   const getuserinfo = async(e) => {  //获取用户信息
   console.log(e.user.userId);
           try {
             const response = await request({
               url: '/user/profile',
               method: 'GET',
               data:{},
               query: { userId: e.user.userId }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            let userinfo=response.data.profile
            if(userinfo.realName!==""){
            setEditableinput(false)
            setUsername(hideName(userinfo.realName))
            setUsernumber(hideIdCard(userinfo.idCardNum))
            }
            }
           } catch (error) {
             console.error(error);
           }
    };
    // 姓名脱敏
 const hideName = (name) => {
  if (!name) return '';

  // 2个字：张*
  if (name.length === 2) {
    return name[0] + '*';
  }

  // 3个字：张*丰
  if (name.length === 3) {
    return name[0] + '*' + name[2];
  }

  // 4个字以上：张**强
  return (
    name[0] +
    '*'.repeat(name.length - 2) +
    name[name.length - 1]
  );
};

// 身份证脱敏
 const hideIdCard = (idCard) => {
  if (!idCard) return '';

  return idCard.replace(
    /^(.{6})(?:\d+)(.{4})$/,
    '$1********$2'
  );
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
  const closeModal = () => {
  setUservisible(false)
  setYinsivisible(false)
};
           // 定义手势
           const swipeRightGesture = Gesture.Pan()
             .onUpdate(e => {
                 console.log(e);
               // e.translationX 大于一定值认为右滑
               if (e.translationX > 35) {
               scheduleOnRN(closeModal);
               }
             });
  const handlesetting = (e) => { 
    console.log(e);
    if(userinfo==null){
          Toast.show({
            content: '请先完成登陆',
            duration: 2,
            position: 'center',
            mask: false,
          })
    return;
    }
    if(e==1){
   setVisible(true)
    }else if(e==2){
      navigation.navigate('Profile')
    }else if(e==3){
      navigation.navigate('Notice')
    }else if(e==4){
      Cancellation()
    }
   };
      const [cannelvisible, setCannelvisible] = useState(false);
       const [countdown, setCountdown] = useState(10);
       const [disabled, setDisabled] = useState(true);
  const Cancellation = () => {  //注销账号
  setCannelvisible(true);
  setCountdown(10);
  setDisabled(true);
      };
         useEffect(() => {
        if (!cannelvisible) return;
      
        if (countdown === 0) {
          setDisabled(false);
          return;
        }
      
        const timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      
        return () => clearTimeout(timer);
      }, [countdown, cannelvisible]);
const handleCertification = async() => {  //身份认证
 console.log(username,usernumber);
 if(!editableinput){
      toastApi.show({
    content: '该账号已认证',
    duration: 2,
    position: 'center',
    mask: false,
    });
 return
 }
     if(username==""||username==null||usernumber==""||usernumber==null){
    toastApi.show({
    content: '请输入完整身份证信息',
    duration: 2,
    position: 'center',
    mask: false,
    });
   return
   }
   const user = await Storage.get("userinfo");
           try {
             const response = await request({
               url: '/user/realname/auth',
               method: 'POST',
               data:{
                  userId: user.user.userId,
                  realName: username,
                  idCardNum: usernumber
               },
               query: {}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
         Toast.success({
            content: '认证成功',
            duration: 2,
            position: 'center',
            mask: false,
          })
     setVisible(false);
            }else{
toastApi.fail({
    content: '认证失败,请确保填写信息正确',
    duration: 2,
    position: 'center',
    mask: false,
    });
            }
           } catch (error) {
             console.error(error);
           }

    

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
       <Text style={styles.title}>设置</Text>
          </View>
        </View>

        <View style={{padding:px(16),marginTop: px(10),backgroundColor: '#fff',
            flexDirection: 'column',alignItems: 'center',
        }}>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: '100%',
paddingBottom:px(16)}} 
onPress={()=>handlesetting(1)}>
<Text style={styles.smalltitle}>实名认证</Text>
   <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(22),height:px(22)}}></Image>
</TouchableOpacity>
<Underline/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: '100%',paddingVertical:px(16)}}
onPress={()=>handlesetting(2)}>
<Text style={styles.smalltitle}>账号设置</Text>
   <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(22),height:px(22)}}></Image>
</TouchableOpacity>
<Underline/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: '100%',paddingVertical:px(16)}}
onPress={()=>handlesetting(3)}>
<Text style={styles.smalltitle}>消息通知</Text>
   <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(22),height:px(22)}}></Image>
</TouchableOpacity>
<Underline/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: '100%',paddingTop:px(16)}}
onPress={()=>handlesetting(4)}>
<Text style={styles.smalltitle}>账号注销</Text>
   <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(22),height:px(22)}}></Image>
</TouchableOpacity>
        </View>

              <View style={{padding:px(16),marginTop: px(8),backgroundColor: '#fff',
            flexDirection: 'column',alignItems: 'center',
        }}>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: '100%',paddingBottom:px(16)}}
onPress={()=>navigation.navigate('PrivacyAgree')}>
<Text style={styles.smalltitle}>隐私政策</Text>
   <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(22),height:px(22)}}></Image>
</TouchableOpacity>
<Underline/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: '100%',paddingVertical:px(16)}}
onPress={()=>navigation.navigate('UserAgree')}>
<Text style={styles.smalltitle}>用户协议</Text>
   <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(22),height:px(22)}}></Image>
</TouchableOpacity>
<Underline/>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    width: '100%',marginTop: px(16),
}}>
<Text style={styles.smalltitle}>当前版本</Text>
   <Text style={styles.version}>V1.0.0</Text>
</View>
        </View>
        {userinfo!==null&&
        <View style={{width: '100%',bottom:px(56),position: 'absolute',
flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}}>
<TouchableOpacity onPress={()=>logout()} activeOpacity={0.4} style={{width: px(303),height: px(48),backgroundColor: '#fff',
    borderRadius: px(24),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',
}}>
<Text style={styles.outlogin}>退出登录</Text>
</TouchableOpacity>
</View>
        }
 
    <CustomModal visible={visible} onClose={() => setVisible(false)}
    width={px(323)} isclose={true}>
      {contextHolder}
    <Text style={styles.destitle}>请您使用有效身份证信息认证</Text>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>姓名</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={[styles.inputbox,{color:!editableinput?'#999':'#1A1A1A',}]}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder="请输入姓名"
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={8}
            selectionColor='#FC9026'
            editable={editableinput}
          />
</View>
<View style={{width: px(291),height: px(60),backgroundColor: '#EEEEEE',
  borderRadius: px(30),marginTop: px(23),flexDirection: 'row',alignItems: 'center',
}}>
  <Text style={styles.nametx}>证件号码</Text>
  <View style={{width: px(1),height: px(19),backgroundColor: "#767676",
    marginLeft: px(8),
  }}></View>
     <TextInput
     allowFontScaling={false}
            style={[styles.inputbox,{color:!editableinput?'#999':'#1A1A1A',}]}
            onChangeText={onnumChangeText}
            value={usernumber || ''}
            placeholder="请输入证件号码"
            keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={18}
            selectionColor='#FC9026'
            editable={editableinput}
          />
</View>
<TouchableOpacity
  style={{ marginTop: px(32) }}
  onPress={() => {
    handleCertification()

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
          立即认证
        </Text>
      </LinearGradient>
  }
</TouchableOpacity>
  </CustomModal>
    
        <WebviewModal visible={uservisible} setVisible={setUservisible} 
        uri={'https://s.tourok.com.cn/user.html'} swipeRightGesture={swipeRightGesture}
        title={"柒趣玩用户协议"}
        ></WebviewModal>
          <WebviewModal visible={yinsivisible} setVisible={setYinsivisible} 
        uri={'https://s.tourok.com.cn/privacy.html'} swipeRightGesture={swipeRightGesture}
        title={"柒趣玩隐私保护政策"}
        ></WebviewModal>


            <CustomModal visible={cannelvisible} onClose={() => setCannelvisible(false)}
            width={px(323)} isclose={true}>
            <Text style={styles.destitle}>注销账号</Text>
            <Text style={styles.dessmall}>危险操作</Text>
         <Image source={require('../../../assets/images/my/warn.png')} 
           style={{width:px(70),height:px(70),marginTop: px(8),}}></Image>
           <Text style={styles.descontent}>注销后账号所有信息将清空且无法找回，请您仔细确认！！！</Text>
        <TouchableOpacity
          style={{ marginTop: px(32) }}
          onPress={() => {
            if (disabled) return;
            setCannelvisible(false);
          }}
          activeOpacity={0.8}
        >
          {
              // 正常渐变按钮
              <LinearGradient
                colors={['#FEC525', '#FC9026']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={[styles.gradientBox,{opacity:disabled?0.7: 1,}]}
              >
                <Text style={styles.logintext}>
                  我已知晓，确认注销
                  {disabled&&
                  <Text>({countdown})s</Text>  
                  }
                </Text>
              </LinearGradient>
          }
        </TouchableOpacity>
          </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
    descontent:{
    marginTop: px(8),
         fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(26),
        textAlign:'center'
  },
    dessmall:{
    marginTop: px(8),
         fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(19),
  },
  inputbox:{
    marginLeft: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(325),
  height: px(51),
  fontSize: px(15),
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
    outlogin:{
   fontFamily: 'MiSans-Regular',
        fontSize:px(18),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(24),
    },
    version:{
          fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
    },
    smalltitle:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
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