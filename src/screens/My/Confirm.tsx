import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image,
    TouchableWithoutFeedback,Keyboard,Platform
 } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { px } from '../../utils/scaleUtils';
import { Toast } from '@ant-design/react-native';
import { CommonActions } from '@react-navigation/native';
import CustomModal from '../../components/My/CustomModal';
import LinearGradient from 'react-native-linear-gradient';
import { smsState } from '../../utils/global';
import { BASE_URL } from '../../api/config';
import Storage from '../../utils/storage';
import useAuthStore from '../../utils/zustand'
import { NativeModules } from 'react-native';
import {
  reportActiveRegister,
} from '../../utils/bdConvert';



export default function Confirm({ navigation,route }) {
  const { OaidModule } = NativeModules;
  const [code, setCode] = useState(['', '', '', '']); // 四位验证码
  const hiddenInputRef = useRef(null); // 隐藏输入框
  const [timer, setTimer] = useState(60);
  const [isCounting, setIsCounting] = useState(true);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [oaid, setOaid] = useState(""); //获取oaid
  //const route = useRoute();
  const { phonenum } = route.params || {};
  const loginChanged = useAuthStore(state => state.loginChanged);



useEffect(() => {
  getOAID();
  const timer = setInterval(() => {
    const left = Math.max(0, Math.floor((smsState.expireTime - Date.now()) / 1000));
    setCount(left);
  }, 1000);
  return () => clearInterval(timer);
}, []);
  // 输入逻辑：逐位输入/删除
const verifyTimer = useRef(null);
const hasVerifiedRef = useRef(false);

const handleChange = (text) => {
  const digits = text.replace(/\D/g, '');

  const newCode = ['', '', '', ''];
  for (let i = 0; i < 4; i++) {
    newCode[i] = digits[i] || '';
  }
  setCode(newCode);

  if (digits.length === 4) {
    // 清除之前的定时器
    if (verifyTimer.current) {
      clearTimeout(verifyTimer.current);
    }

    verifyTimer.current = setTimeout(() => {
      // 防重复
      if (hasVerifiedRef.current) return;

      hasVerifiedRef.current = true;

      console.log('最终验证码:', digits);
      verifyCode(digits);
    }, 300); // 👈 等输入稳定
  }
};
// 示例验证函数
const verifyCode = (code) => {
  console.log(code);
 getuserinfo(code)
  return;
  if(code==7856){
 
navigation.dispatch(
  CommonActions.reset({
    index: 0, // stack 的第0个路由
    routes: [
      {
        name: 'MainTab', // Stack 根路由
        state: {
          index: 3, // TabNavigator 的第几个 tab 显示 My（从0开始：0=Home,1=Club,2=News,3=My）
          routes: [
            { name: 'Home' },
            { name: 'Club' },
            { name: 'News' },
            { name: 'My' },
          ],
        },
      },
    ],
  })
);
  }else{
 Toast.show({
          content: '验证码错误',
          duration: 1,
          position: 'center',
          mask: false,
        })
        setTimeout(() => {
            clearCode() 
        }, 300);
       
  }
};
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
const getuserinfo = async(e) => { 
      const res = await fetch(`${BASE_URL}/sms/login?phone=${phonenum}&code=${e}&deviceType=${Platform.OS}&deviceId=${1}&oaid=${oaid}`, {
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
        clearCode() 
        await reportActiveRegister('phone', true);
        navigation.dispatch(
  CommonActions.reset({
    index: 0, // stack 的第0个路由
    routes: [
      {
        name: 'MainTab', // Stack 根路由
        state: {
          index: 3, // TabNavigator 的第几个 tab 显示 My（从0开始：0=Home,1=Club,2=News,3=My）
          routes: [
            { name: 'Home' },
            { name: 'Club' },
            { name: 'News' },
            { name: 'My' },
          ],
        },
      },
    ],
  })
        );
      
        }else{
         Toast.show({
          content: '验证码错误',
          duration: 1,
          position: 'center',
          mask: false,
        })
          hasVerifiedRef.current = false;
  if (verifyTimer.current) {
    clearTimeout(verifyTimer.current);
  }
      setCode(['', '', '', '']);
      hiddenInputRef.current.clear();
      hiddenInputRef.current.focus();
        } 
 };
const clearCode = () => {
  hasVerifiedRef.current = false;

  if (verifyTimer.current) {
    clearTimeout(verifyTimer.current);
  }

  setCode(['', '', '', '']);
  Keyboard.dismiss();
};

  const handleBack = () => navigation.goBack();
  const handleGetCode = () => { //重新获取
    console.log(phonenum);
    getphonenum();
    //Toast.info('验证码已重新发送，请注意查收', 1);
    //hiddenInputRef.current.focus(); // 自动聚焦隐藏输入框
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
    const now = Date.now();
    smsState.expireTime = now + 60 * 1000;
       Toast.show({
          content: '验证码已重新发送，请注意查收',
          duration: 3,
          position: 'center',
          mask: false,
        })
    }else{
      Toast.show({
          content: '验证码发送失败，请稍后重试或其他登陆方式',
          duration: 2,
          position: 'center',
          mask: false,
        })
    }
  };
  const handleques = () => { 
   Keyboard.dismiss();
    setVisible(true)
   };
  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      {/* 顶部背景和返回按钮 */}
      <View style={styles.topbox}>
        <Image
          source={require('../../../assets/images/my/codeback.png')}
          style={{ width: px(393), height: px(386), position: 'absolute', top: 0 }}
        />
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require('../../../assets/images/my/left.png')}
            style={{ width: px(22), height: px(22), marginTop: px(58), marginLeft: px(16) }}
          />
        </TouchableOpacity>
      </View>

      {/* 文案 */}
      <View style={{ paddingHorizontal: px(34), marginTop: px(32) }}>
        <Text style={styles.title}>填写验证码</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: px(9), gap: px(6) }}>
          <Text style={styles.destext}>短信验证码已发送至</Text>
          <Text style={styles.destext}>{phonenum}</Text>
        </View>
      </View>

      {/* 验证码格子 */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: px(32), width: '100%' }}>
        <View style={styles.codebox}>
          {code.map((num, index) => (
            <TouchableOpacity
              key={index}
              style={styles.inputBox}
              activeOpacity={1}
              onPress={() => hiddenInputRef.current.focus()} // 点击格子唤起键盘
            >
              <Text style={{ fontSize: px(24), textAlign: 'center', color: '#1A1A1A' }}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 隐藏输入框 */}
      <TextInput
        ref={hiddenInputRef}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        value={code.join('')}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={4}
        autoFocus
      />

      {/* 倒计时 / 重新获取 */}
      <View style={{ marginLeft: px(36), marginTop: px(40) }}>
        {count !== 0 ? (
          <Text style={styles.mindes}>({count}s)后重新获取</Text>
        ) : (
          <TouchableOpacity onPress={handleGetCode}>
            <Text style={[styles.mindes, { color: '#1A1A1A' }]}>重新获取</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 帮助 */}
      <View style={{ marginLeft: px(36), marginTop: px(12), flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.destext}>收不到验证码？</Text>
        <TouchableOpacity onPress={()=>handleques()}>
         <Text style={[styles.destext, { color: '#FC9026' }]}>查看解决方案</Text>
            
        </TouchableOpacity>
    
      </View>

       <CustomModal visible={visible} onClose={() => setVisible(false)}
        width={px(323)} isclose={false}>
        <Text style={styles.destitle}>收不到验证码</Text>
        <Text style={styles.dessmall}>可以尝试以下方案快速解决</Text>
        <Text style={styles.descontent}>
        1.可能是网络通信异常引起，可以尝试重启手机。{"\n"}
        2.可能是手机设置了黑名单，查看路径:手机设置-信息-黑名单。{"\n"}
        3.可能安装了一些安全助手或者软件，对验证码或电话进行了拦截，需要自检安装软件设置。{"\n"}
        4.可以将SIM卡换到其他手机上测试。{"\n"}
        5.可以联系手机号码运营商进行咨询。
        </Text>
            <TouchableOpacity style={{marginTop: px(32),}}
              onPress={() => setVisible(false)} activeOpacity={0.8}>
             <LinearGradient
                colors={['#FEC525', '#FC9026']} // 渐变颜色
                start={{ x: 1, y: 0 }}   
                end={{ x: 0, y: 0 }}
                style={styles.gradientBox}
              >
                  <View style={{flexDirection: 'row',alignItems: 'center',}}>
                <Text style={styles.logintext}>知道了</Text>
                </View>
              </LinearGradient>
              </TouchableOpacity>
        {/* <Button title="关闭" onPress={() => setVisible(false)} /> */}
      </CustomModal>
    </View>
    </TouchableWithoutFeedback>
  );
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
    width:px(221),
    height: px(48),
    borderRadius: px(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
    descontent:{
 fontFamily: 'MiSans-Regular',
    fontSize: px(15),
    color: '#767676',
    fontWeight: 400,
    lineHeight: px(26),
    marginTop: px(12),
    },
    dessmall:{
    fontFamily: 'MiSans-Regular',
    fontSize: px(14),
    color: '#AAAAAA',
    fontWeight: 400,
    lineHeight: px(19),
    marginTop: px(8),
    },
    destitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(19),
    color: '#1A1A1A',
    lineHeight: px(25),
    },
  mindes: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(15),
    color: '#AAAAAA',
    fontWeight: 400,
    lineHeight: px(20),
  },
  destext: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(13),
    color: '#AAAAAA',
    fontWeight: 400,
    lineHeight: px(17),
  },
  title: {
    letterSpacing: px(2),
    fontFamily: 'MiSans-Medium',
    fontSize: px(25),
    color: '#1A1A1A',
    lineHeight: px(33),
  },
  topbox: {
    position: 'relative',
  },
  codebox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: px(18),
  },
  container: {
    flex: 1,
    height: 800,
    backgroundColor: '#fff',
  },
  inputBox: {
    backgroundColor: '#fff',
    width: px(67),
    height: px(67),
    borderWidth: px(1.5),
    borderColor: '#FEC525',
    borderRadius: px(8),
    justifyContent: 'center',
  },
});