import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React,{useEffect,useState} from 'react'
import { px } from '../../utils/scaleUtils';
import Storage from '../../utils/storage';
import CustomModal from '../../components/My/CustomModal';
import LinearGradient from 'react-native-linear-gradient';
import request from '../../api/request';
import useAuthStore from '../../utils/zustand'
import { IMG_URL } from '../../api/config';
import TextRadioModal from '../../components/Shop/TextRadioModal';



 const Underline=()=>{
return(
    <View style={{width: '100%',height: px(1),
    backgroundColor: 'rgba(118, 118, 118, 0.2)',
    marginTop: px(0),
}}></View>
)
 };
 const gamesOptions = [
  { label: '王者荣耀', value: 0 },
  { label: '三角洲行动', value: 1 },
];
 const gamesquOptions = [
  { label: '微信', value: 0 },
  { label: 'QQ', value: 1 },
  { label: 'Steam', value: 2 },
];
export default function Profile({navigation}) {
    const isLogin = useAuthStore(state => state.isLogin);
  const [userinfo, setUserinfo] = useState(null); //登陆状态
    const [visible, setVisible] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [disabled, setDisabled] = useState(true);
    const [userprofile, setUserprofile] = useState(null); //个人信息
    const [avatarError, setAvatarError] = useState(false);
    const [config, setConfig] = useState({}); //个人偏好
    const [games, setGames] = useState(gamesOptions); //游戏选择
    const [gamesindex, setGamesindex] = useState(0); //选择游戏下标
    const [gamesvs, setGamesvs] = useState(false) //游戏弹窗开关
    const [gamesqu, setGamesqu] = useState(gamesquOptions); //游戏分区选择
    const [gamesquindex, setGamesquindex] = useState(0); //选择游戏分区下标
    const [gamesquvs, setGamesquvs] = useState(false) //游戏分区弹窗开关
    useEffect(() => {
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
  const getuserinfo = async(e) => { 
  console.log(e);
        try {
          const response = await request({
            url: '/user/profile',
            method: 'GET',
            data:{},
            query: { userId: e.user.userId }
          });
          console.log(response);
        if(response.data!==undefined&&response.code==0){
        setAvatarError(false);
        setUserprofile(response.data.profile)
        const configStr = response.data.profile.config;
        let config = {};
        if (configStr) {
          try {
            config = JSON.parse(configStr);
          } catch (error) {
            console.log('config JSON解析失败:', error);
            config = {};
          }
        }
        console.log(config);
        setConfig(config);
        if (config?.games === '三角洲行动') {
          setGamesindex(1);
        }
        if (config?.partition === 'qq') {
          setGamesquindex(1);
        } else if (config?.partition === 'steam') {
          setGamesquindex(2);
        }
        }
        } catch (error) {
          console.error(error);
        }
    };
  const avatarUrl = userprofile?.avatarUrl
    ? `${IMG_URL}${userprofile.avatarUrl}`
    : null;
   useEffect(() => {
  if (!visible) return;

  if (countdown === 0) {
    setDisabled(false);
    return;
  }

  const timer = setTimeout(() => {
    setCountdown(prev => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
  }, [countdown, visible]);
  const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     const logout = () => {  //注销账号
  setVisible(true);
  setCountdown(10);
  setDisabled(true);
      };
  const maskPhone = (phone) => {
    if (!phone || phone.length < 7) return phone; // 防止异常
    return phone.slice(0, 3) + '****' + phone.slice(-4);
  };
  const handlegames = async(e) => { 
  console.log(e);
  if(e==gamesindex){
  return
  }
  console.log('sett');
  try {
    const response = await request({
      url: '/user/preferences/set',
      method: 'POST',
      data:{
      games:e==0?'王者荣耀':'三角洲行动'
    },
      query: {
      
      }
    });
    console.log(response);
  if(response.data!==undefined&&response.code==0){
  getloginstatus();
  }
  } catch (error) {
    console.error(error);
  }
  };
  const gameAreaMap = [
  '微信',
  'qq',
  'steam'
];
const getGameArea = (index) => {
  return gameAreaMap[index] || '';
};
    const handlegamesqu = async(e) => { 
  console.log(e);
  if(e==gamesquindex){
  return
  }
  console.log('sett');
  try {
    const response = await request({
      url: '/user/preferences/set',
      method: 'POST',
      data:{
      partition:getGameArea(e)
    },
      query: {
      
      }
    });
    console.log(response);
  if(response.data!==undefined&&response.code==0){
  getloginstatus();
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
       <Text style={styles.title}>账号设置</Text>
          </View>
        </View>
        <View style={{padding:px(16),marginTop: px(10),backgroundColor: '#fff',
            flexDirection: 'column',alignItems: 'center',
        }}>
        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',paddingBottom:px(16),}}
        onPress={()=>navigation.navigate('Avtar')}>
        <Text style={styles.smalltitle}>个人头像</Text>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Image
          source={
            avatarError || !avatarUrl
              ? require('../../../assets/images/my/defultavtar.png')
              : { uri: avatarUrl }
            }
          style={{
            width: px(40),
            height: px(40),
            borderRadius: px(20),
          }}
          onError={() => setAvatarError(true)}
        />
 <Image source={require('../../../assets/images/my/right.png')} 
               style={{width:px(19),height:px(19)}}></Image>
        </View>
          
        </TouchableOpacity>
        <Underline/>
        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',paddingVertical:px(16)
        }} onPress={()=>navigation.navigate('Name',{type:1})}>
        <Text style={styles.smalltitle}>昵称</Text>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
     <Text style={styles.version}>{userprofile?.nickName}</Text>
           <Image source={require('../../../assets/images/my/right.png')} 
               style={{width:px(19),height:px(19)}}></Image>
        </View>
        </TouchableOpacity>
        <Underline/>
        <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
            width: '100%',paddingVertical: px(16),
        }}>
        <Text style={styles.smalltitle}>账号</Text>
          <Text style={styles.version}>{maskPhone(userinfo?.user?.phone)}</Text>
        </View>
<Underline/>
        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',paddingVertical:px(16)
        }} onPress={()=>setGamesvs(true)}>
        <Text style={styles.smalltitle}>常玩游戏</Text>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
     <Text style={styles.version}>{config?.games ? config.games : '请选择'}</Text>
           <Image source={require('../../../assets/images/my/right.png')} 
               style={{width:px(19),height:px(19)}}></Image>
        </View>
        </TouchableOpacity>
<Underline/>
        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',paddingVertical:px(16)
        }} onPress={()=>navigation.navigate('Name',{type:2})}>
        <Text style={styles.smalltitle}>游戏ID</Text>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
     <Text style={styles.version}>{config?.gameId || '请填写'}</Text>
           <Image source={require('../../../assets/images/my/right.png')} 
               style={{width:px(19),height:px(19)}}></Image>
        </View>
        </TouchableOpacity>
<Underline/>
        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',paddingVertical:px(16)
        }} onPress={()=>navigation.navigate('Name',{type:3})}>
        <Text style={styles.smalltitle}>游戏账号</Text>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
     <Text style={styles.version}>{config?.account || '请填写'}</Text>
           <Image source={require('../../../assets/images/my/right.png')} 
               style={{width:px(19),height:px(19)}}></Image>
        </View>
        </TouchableOpacity>
<Underline/>
        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',paddingTop:px(16)
        }} onPress={()=>setGamesquvs(true)}>
        <Text style={styles.smalltitle}>游戏分区</Text>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
     <Text style={styles.version}>{config?.partition ? config.partition : '请选择'}</Text>
           <Image source={require('../../../assets/images/my/right.png')} 
               style={{width:px(19),height:px(19)}}></Image>
        </View>
        </TouchableOpacity>
        </View>

                        {/* <View style={{width: '100%',bottom:px(56),position: 'absolute',
                flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={()=>logout()} activeOpacity={0.4} style={{width: px(303),height: px(48),backgroundColor: '#fff',
                    borderRadius: px(24),flexDirection: 'row',alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Text style={styles.outlogin}>注销账号</Text>
                </TouchableOpacity>
                </View> */}


    {/* <CustomModal visible={visible} onClose={() => setVisible(false)}
    width={px(323)} isclose={true}>
    <Text style={styles.destitle}>收不到验证码</Text>
    <Text style={styles.dessmall}>危险操作</Text>
 <Image source={require('../../../assets/images/my/warn.png')} 
   style={{width:px(70),height:px(70),marginTop: px(8),}}></Image>
   <Text style={styles.descontent}>注销后账号所有信息将清空且无法找回，请您仔细确认！！！</Text>
<TouchableOpacity
  style={{ marginTop: px(32) }}
  onPress={() => {
    if (disabled) return;
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
  </CustomModal> */}
  <TextRadioModal
    visible={gamesvs}
    onClose={() => setGamesvs(false)}
    data={games}
    value={gamesindex}
    onConfirm={(val) => {
      setGamesindex(val);
      setGamesvs(false);
      handlegames(val);
    }}
    />
      <TextRadioModal
    visible={gamesquvs}
    onClose={() => setGamesquvs(false)}
    data={gamesqu}
    value={gamesquindex}
    onConfirm={(val) => {
      setGamesquindex(val);
      setGamesquvs(false);
      handlegamesqu(val);
    }}
    />
    </View>
  )
}

const styles = StyleSheet.create({
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
      destitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(19),
    color: '#1A1A1A',
    lineHeight: px(25),
    },
        version:{
          fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
    },
        outlogin:{
   fontFamily: 'MiSans-Regular',
        fontSize:px(18),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(24),
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