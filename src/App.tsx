import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View,
  TouchableOpacity,Image,Text,Platform,Vibration,ScrollView,Alert,
  BackHandler,NativeModules,
 } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {Provider} from '@ant-design/react-native';
import { px } from './utils/scaleUtils';
 import  chat  from './utils/im';
 import TencentCloudChat from '@tencentcloud/chat';
 import { NavigationContainer } from '@react-navigation/native';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createStackNavigator } from '@react-navigation/stack';
 import Home from './screens/Home/Home';
import Searchlist from './screens/Home/Searchlist';
import Allcomments from './screens/Home/Allcomments';
import Shopinfo from './screens/Home/Shopinfo';
import MobileGame from './screens/Home/MobileGame';
import Playmate from './screens/Home/Playmate';
import PlayerInfo from './screens/Home/PlayerInfo';
import VideoPlayer from './screens/Home/VideoPlayer';
import Club from './screens/Club/Club';
import ClubInfo from './screens/Club/ClubInfo';
import ClubHome from './screens/Club/ClubHome';
import News from './screens/News/News';
import My from './screens/My/My';
import Lottery from './screens/Lottery/Lottery';
import Preze from './screens/Lottery/Preze';
import Login from './screens/My/Login';
import Code from './screens/My/Code';
import Profile from './screens/My/Profile';
import Setting from './screens/My/Setting';
import Confirm from './screens/My/Confirm';
import Avtar from './screens/My/Avtar';
import Name from './screens/My/Name';
import Notice from './screens/My/Notice';
import Collect from './screens/My/Collect';
import Follow from './screens/My/Follow';
import Order from './screens/My/Order';
import Coupon from './screens/My/Coupon';
import Asset from './screens/My/Asset';
import Register from './screens/My/Register';
import InviteOrder from './screens/My/InviteOrder';
import Withdraw from './screens/My/Withdraw';
import Details from './screens/My/Details';
import Guarantee from './screens/My/Guarantee';
import Join from './screens/My/Join';
import Cashout from './screens/My/Cashout';
import OrderInfo from './screens/My/OrderInfo';
import Comment from './screens/My/Comment';
import Invite from './screens/My/Invite';
import Refund from './screens/My/Refund';
import Aftersales from './screens/My/Aftersales';
import SafeOrderInfo from './screens/My/SafeOrderInfo';
import OneChat from './screens/News/OneChat';
import Noticepla from './screens/News/Noticepla';
import Noticeinfo from './screens/News/Noticeinfo';
import ShopIndex from './screens/Shop/ShopIndex';
import ShopOrder from './screens/Shop/ShopOrder';
import ShopCashout from './screens/Shop/ShopCashout';
import ShopCashItem from './screens/Shop/ShopCashItem';
import ShopPending from './screens/Shop/ShopPending';
import ShopHomeOrder from './screens/Shop/ShopHomeOrder';
import ShopOrderInfo from './screens/Shop/ShopOrderInfo';
import ShopScreenshot from './screens/Shop/ShopScreenshot';
import ShopEnter from './screens/Shop/ShopEnter';
import ShopSetting from './screens/Shop/ShopSetting';
import ShopManage from './screens/Shop/ShopManage';
import ShopEmployee from './screens/Shop/ShopEmployee';
import ShopAddEmployee from './screens/Shop/ShopAddEmployee';
import ShopEditEmployee from './screens/Shop/ShopEditEmployee';
import ShopNotice from './screens/Shop/ShopNotice';
import ShopPreview from './screens/Shop/ShopPreview';
import ShopEdit from './screens/Shop/ShopEdit';
import ShopSale from './screens/Shop/ShopSale';
import ShopSaleInfo from './screens/Shop/ShopSaleInfo';
import ShopDetails from './screens/Shop/ShopDetails';
import Playmateadd from './screens/Shop/Playmateadd';
import PlaymateList from './screens/Shop/PlaymateList';
import Playmateedit from './screens/Shop/Playmateedit';
import Productass from './screens/Shop/Productass';
import KefuManage from './screens/Shop/KefuManage';

import UserAgree from './screens/Policy/UserAgree';
import PrivacyAgree from './screens/Policy/PrivacyAgree';









import RNBootSplash from "react-native-bootsplash";
import CustomModal from './components/My/CustomModal';
import React,{useEffect,useRef,useState} from 'react'
import useAuthStore from './utils/zustand';
import Storage from './utils/storage';
import LinearGradient from 'react-native-linear-gradient';
import PrivacyModal from './components/Home/PrivacyModal'; // 引入组件
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  init,
  getDeviceInfo,
  exitApp,
} from '@react-native-hero/umeng-analytics'
import { useIMStore } from './store/imStore';
//import { TUILogin } from '@tencentcloud/tui-core';
 import * as WeChat from 'react-native-wechat-lib';
  import { navigationRef,navigate } from './api/navigationService';
  import request from './api/request';
  import Push from '@tencentcloud/react-native-push';
  import notifee, {
    AndroidImportance,
  } from '@notifee/react-native';
import DeviceInfo from 'react-native-device-info';
import { trackOAID } from './utils/oaidTracker';
import {
  initBDConvertAfterPrivacyAgree,
} from './utils/bdConvert';
import {
  KeyboardProvider
} from 'react-native-keyboard-controller';



const { OaidModule } = NativeModules;
  const loginInfo =
  Platform.OS === 'ios'
    ? {
        userID: 'user1',
        userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwqXFqUWGUInilOzEgoLMFCUrQzMDA0NjE0tLC4hMakVBZlEqUNzU1NTIwMAAIlqSmQsSMzc3NbQwN7WAqi3OTAeaG5rjmF7sGhWclWoc6JkYEuQfYlBRURCa7GHqGhoY6e1oUFKUYZqk7eVvZGCrVAsAI*Iw7w__',
      }
    : {
        userID: 'user2',
        userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwqXFqUVGUInilOzEgoLMFCUrQzMDA0NjE0tLC4hMakVBZlEqUNzU1NTIwMAAIlqSmQsSMzc3NbQwtzAxg5qSmQ4018fQ18*vMNvCzTzYPNcjzNsyKNGiPLnUOSzQOTJG3zerKjc10q3ALCgxz8fAVqkWAEDnMUk_',
      };
  const appKey = "1109260309225797#demo";
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  //const Stack = createStackNavigator();
  // 底部导航
function TabNavigator({ totalcount,unreadTotal }) {
  return (
    <Tab.Navigator
      //tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false, // 不显示顶部header
        tabBarButton: (props) => <TouchableOpacity {...props}  onPressIn={(ev) => {
          if (Platform.OS === 'ios') {
            //Vibration.vibrate(5);
            // Add a soft haptic feedback when pressing down on the tabs.
            //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }else{
            Vibration.vibrate(5);
          }
          props.onPressIn?.(ev);
        }}/>,

        tabBarStyle: {
          height: Platform.select({ ios: px(88), android: px(66) }), // 设置不同平台高度
          backgroundColor: '#FFFFFF', // 背景颜色
          paddingTop: px(4),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },  // 阴影在上方，所以 height 取负
          shadowOpacity: 0.1,
          shadowRadius: px(20),
          elevation: 10,
          ...Platform.select({
            ios: {
              // position: 'absolute', // iOS浮动效果
              // borderTopLeftRadius: 20, // iOS圆角
              // borderTopRightRadius: 20
            },
            android: {
              
              pressColor: 'transparent',
              rippleColor: 'transparent', // 关键属性
              
            }
          })
          
        },
        
      tabBarBackground: () =>
      null,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{
              fontSize: px(11),
              color: focused ? '#FEC525' : '#AAAAAA',
              marginTop: px(4),
              fontWeight: focused ? 'normal' : 'normal',
              fontFamily:focused ?'MiSans-Medium':'MiSans-Regular',
              lineHeight:px(15)
            }}>
              首页
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
            source={focused 
              ? require('../assets/icons/sehome.png')
              :require('../assets/icons/home.png')
              }
              //source={require('../assets/icons/index.png')} // 替换成你的图片
              style={{
                width: px(28),
                height: px(28),
                //tintColor: focused ? '#007AFF' : '#222',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Club"
        component={Club}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{
              fontSize: px(11),
              color: focused ? '#FEC525' : '#AAAAAA',
              marginTop: px(4),
              fontWeight: focused ? 'normal' : 'normal',
              fontFamily:focused ?'MiSans-Medium':'MiSans-Regular',
              lineHeight:px(15)
            }}>
              俱乐部
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
            source={focused 
              ? require('../assets/icons/seclub.png')
              :require('../assets/icons/club.png')
              }
              style={{
                width: px(28),
                height: px(28),
                //tintColor: focused ? '#007AFF' : '#222',
              }}
            />
          ),
        }}
      />
      {/* <Tab.Screen
  name="WeatherButton"
  component={View} 
  options={({ navigation }) => ({
    tabBarLabel: () => null,
    tabBarIcon: () => null,
    tabBarButton: (props) => (
      <TouchableOpacity
        {...props} 
        activeOpacity={0.8}
        onPress={() => {
          handlegoai(navigation)
        }}
        style={{
          top: Platform.OS === 'ios' ? -px(7) : -px(7),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../assets/icons/ai.png')}
          style={{
            width: px(89),
            height: px(78),
          }}
        />
      </TouchableOpacity>
    ),
  })}
/>  */}
        <Tab.Screen
        name="Lottery"
        component={Lottery}
        options={{
          tabBarLabel: ({ focused, color }) => (
          //  <Text style={{
          //     fontSize: px(11),
          //     color: focused ? '#1A1A1A' : '#AAAAAA',
          //     marginTop: px(4),
          //     fontWeight: focused ? 'normal' : 'normal',
          //     fontFamily:focused ?'MiSans-Medium':'MiSans-Regular',
          //     lineHeight:px(15)
          //   }}>
          //     活动
          //   </Text>
          <></>
          ),
          tabBarIcon: ({ focused }) => (
          <View style={{position: 'relative',width: px(34),
          height: px(34),}}>
          {/* {totalcount!==0&& 
             <View style={{height: px(16),borderRadius: px(8),zIndex: 1,
              backgroundColor: '#DE5452',position: 'absolute',right: -px(8),top:0,
              flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
              paddingHorizontal:px(4),minWidth: px(16),}}>
          <Text style={styles.message}>{totalcount}</Text>
            </View>
          } */}
            <LinearGradient
    colors={[
      '#FC9026',
      '#FEC525',
    ]}
    start={{
      x: 0,
      y: 1,
    }}
    end={{
      x: 1,
      y: 0,
    }}
    style={{
      width: '100%',
      height: '100%',
      borderRadius: px(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Image
      source={
        // focused 
        // ?require('../assets/icons/slottery.png')
        // :
        require('../assets/icons/lottery.png')
        }
        style={{
          width: px(22),
          height: px(22),
          zIndex: 999,
          //tintColor: focused ? '#007AFF' : '#222',
        }}
      />
   </LinearGradient>

          </View>
          
          ),
        }}
      />

        <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarLabel: ({ focused, color }) => (
           <Text style={{
              fontSize: px(11),
              color: focused ? '#FEC525' : '#AAAAAA',
              marginTop: px(4),
              fontWeight: focused ? 'normal' : 'normal',
              fontFamily:focused ?'MiSans-Medium':'MiSans-Regular',
              lineHeight:px(15)
            }}>
              消息
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
          <View style={{position: 'relative',width: px(28),
        height: px(28),}}>
          {unreadTotal!==0&&
             <View style={{height: px(16),borderRadius: px(8),zIndex: 1,
              backgroundColor: '#DE5452',position: 'absolute',right: -px(8),top:0,
              flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
              paddingHorizontal:px(4),minWidth: px(16),}}>
          <Text style={styles.message}>{unreadTotal}</Text>
            </View>
          }
          <Image
            source={focused 
              ?require('../assets/icons/senews.png')
              :require('../assets/icons/news.png')
              }
              style={{
                width: px(28),
                height: px(28),
                //tintColor: focused ? '#007AFF' : '#222',
              }}
            />
          </View>
          
          ),
        }}
      />

      <Tab.Screen
        name="My"
        component={My}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{
              fontSize: px(11),
              color: focused ? '#FEC525' : '#AAAAAA',
              marginTop: px(4),
              fontWeight: focused ? 'normal' : 'normal',
              fontFamily:focused ?'MiSans-Medium':'MiSans-Regular',
              lineHeight:px(15)
            }}>
              我的
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
            source={focused 
              ? require('../assets/icons/semy.png')
              :require('../assets/icons/my.png')
              }
              style={{
                width: px(28),
                height: px(28),
                //tintColor: focused ? '#007AFF' : '#222',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
function App() {
  const [showPrivacy, setShowPrivacy] = useState(false); //是否展示隐私协议
  const setPrivacyAgreed = useAuthStore(state => state.setPrivacyAgreed);
  const messageChanged = useAuthStore(state => state.loginChanged);
  const unreadTotal = useAuthStore(
  state => state.unreadTotal
  );
    const isNewmessageChanged = useAuthStore(
  state => state.isNewmessageChanged
  );
    const setUnreadTotal = useAuthStore(
  state => state.setUnreadTotal
  );
  const isLogin = useAuthStore(state => state.isLogin);
  const isDarkMode = useColorScheme() === 'dark';
  const { setConversationList } = useIMStore.getState();
  const [totalcount, setTotalcount] = useState(0);
  const [privacyReady, setPrivacyReady] = useState(false); //隐私协议是否同意

 

const showLocalNotification = async(e) => {
  // 请求权限
  await notifee.requestPermission();

  // 创建通知渠道（Android）
  const channelId = await notifee.createChannel({
    id: 'default',
    name: '默认通知',
    importance: AndroidImportance.HIGH,
  });

  // 显示通知
  await notifee.displayNotification({
    title: '您有新的消息',
    body: e,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });

 };
useEffect(() => {

  if (!privacyReady) return;

  // const onReady = () => {
  //   console.log('✅ IM ready');
  // };

  const onMessageReceived = (event) => {
     console.log(event);
    //Vibration.vibrate();
    console.log('新消息cccc:', event.data);
    
    if(event.data[0].from=="administrator"){ //支付订单通知
    console.log('noticeyy',event.data[0].payload.text);
    
    showLocalNotification(event.data[0].payload.text);
    deleteOneMessage(event.data[0].conversationID)
    }
    getclubpermission();
    isNewmessageChanged();
  };
const deleteOneMessage = async (message) => {
  try {
    await chat.clearHistoryMessage(message);
    console.log('删除成功');
  } catch (e) {
    console.log('删除失败', e);
  }
};
  // const onConversationListUpdated = function(event) {
  //   console.log(event);
    
  //   messageChanged();
  //   setConversationList(event.data);
  // };

  // const onTotalUnreadMessageCountUpdated = function(event) {
  //    console.log(event);
  //   setTotalcount(event.data);
  // };

  // chat.on(
  //   TencentCloudChat.EVENT.SDK_READY,
  //   onReady
  // );

  chat.on(
    TencentCloudChat.EVENT.MESSAGE_RECEIVED,
    onMessageReceived
  );

  // chat.on(
  //   TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED,
  //   onConversationListUpdated
  // );

  // chat.on(
  //   TencentCloudChat.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED,
  //   onTotalUnreadMessageCountUpdated
  // );
  const getuserinfo = async() => {
   const user = await Storage.get("userinfo");
   if(user!==null&&user){
   ImLogin(user.user.userId);
   getclubpermission();
   console.log('用户信息',user.user.userId);
   }else{
    setUnreadTotal(0)
   }
   }

   getuserinfo()
       const getclubpermission = async() => { 
           try {
           const response = await request({
             url: '/store/role/auth',
             method: 'GET',
             data: {
             },
             query: {},
           }); 
           console.log('auth',response);
         if (response.data !== null && response.code == 0&&response.data.length!==0) {
           const storelist=response.data
         //   const customerServiceItem = storelist.find(item =>
         //   item.roleName?.includes('客服')
         // );
         const customerServiceItem = storelist
     .flatMap(store => store.users || [])
     .find(user => user.roleCode === 'STORE_CS');
   
   console.log(customerServiceItem);
         const hasCustomerService = storelist.some(store =>
         store.users?.some(user => user.roleCode === 'STORE_CS')
       );
          console.log(hasCustomerService);
         //const hasCustomerService = !!customerServiceItem;
         console.log(hasCustomerService);
         console.log(customerServiceItem);
         //   const hasCustomerService = storelist.some(item =>
         //   item.roleName?.includes('客服')
         // );
         //console.log(hasCustomerService);
         if (hasCustomerService) {
           getuntotal(customerServiceItem)
           //handlegetservice(customerServiceItem)
         //setCurrentTab('service');
         } else {
          //setCurrentTab('user');
          getuntotal('user')
          }
   
         }
         } catch (error) {
           console.error(error);
         }
       };
  const getuntotal = async(e) => {
    console.log('qwfqwrqwr',e);
     if(e=='user'){ //用户获取未读数字
    try {
    const response = await request({
      url: '/unread/total',
      method: 'GET',
      data: {
        },
      query: {
        type:'user'
      },
      });
      console.log('imlist',response);
      if (response.data !== null && response.code == 0) {
       if(response.data.type=='user'&&response.data.unreadTotal!==null&&response.data.unreadTotal!==undefined){
        setUnreadTotal(response.data.unreadTotal)
       }
      }
      } catch (error) {
      console.error(error);
      }
     }else{ //客服获取未读数字
    try {
    const response = await request({
      url: '/customer/unread',
      method: 'GET',
      data: {
        },
      query: {
        //type:'user'
      },
      });
      console.log('imlist',response);
      if (response.data !== null && response.code == 0) {
       if(response.data.unreadCount!==null&&response.data.unreadCount!==undefined){
        setUnreadTotal(response.data.unreadCount)
       }
      }
      } catch (error) {
      console.error(error);
      }
     }
  };

  return () => {

    // chat.off(
    //   TencentCloudChat.EVENT.SDK_READY,
    //   onReady
    // );

    chat.off(
      TencentCloudChat.EVENT.MESSAGE_RECEIVED,
      onMessageReceived
    );

    // chat.off(
    //   TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED,
    //   onConversationListUpdated
    // );

    // chat.off(
    //   TencentCloudChat.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED,
    //   onTotalUnreadMessageCountUpdated
    // );
  };
  
}, [privacyReady,isLogin]);
  const ImLogin = async(e) => {
    console.log('imlogin',e);
    
    try {
      const response = await request({
        url: '/im/register',
        method: 'POST',
        data:{
          userId:e,
        },
        query: {}
      });
      console.log('imlogin',response);
    if(response.data!==undefined&&response.code==0){
        const loginInfo ={
        userID: String(e),
        userSig: response.data.userSig,
      }
        chat.login(loginInfo)
    .then(res => {
      console.log('✅ 登录成功', res);
    })
    .catch(err => {
      console.log('❌ 登录失败', err);
    });
    }
    } catch (error) {
      console.error(error);
    }
 
   }; 
  useEffect(() => {
 console.log('App render', isLogin);

    const checkPrivacy = async () => {
      //await Storage.clear();
      const agreed = await Storage.get('privacyAgreed');
      console.log(agreed);
      if (agreed == true) {
        setPrivacyReady(true);
        // 已同意，直接进入 App
        console.log("已经同意协议");
        getAndroidId();
        goinit(); 
        setPrivacyAgreed(true);
        setShowPrivacy(false);
        RNBootSplash.hide({ fade: true });
      } else {
        console.log("未同意协议");
        // 未同意，显示弹窗
        setShowPrivacy(true);
      }
    };
    checkPrivacy();
  }, [isLogin]);
  async function getAndroidId() {
  const androidId = await DeviceInfo.getAndroidId();
  console.log('Android ID:', androidId);
  return androidId;
}
  const goinit = async() => {  //初始化sdk
      //const totalUnreadCount = chat.getTotalUnreadMessageCount();
        await initBDConvertAfterPrivacyAgree(); //巨量归因激活
      //console.log('当前总未读数:', totalUnreadCount);
        await notifee.setBadgeCount(0);
        await notifee.cancelAllNotifications();
        WeChat.registerApp('wxa6e17fe1975fb8a6', 'https://tourok.com.cn').then((res) => {
      console.log("registerApp: " + res)
      WeChat.getApiVersion().then((num) => {
        console.log("test:1 " + num)
      })
      checkWeChat();
      
      //openWeChat();
    });
  init().then(() => {
  // 初始化完成
  //console.log("友盟初始化完成");
  //exitApp() //退出app的方法
  getDeviceInfo().then(data => {
  console.log(data);
  data.deviceId
  data.deviceType
  data.brand
  data.bundleId
  })
  })

const SDKAppID = 1600137039; // 您的 SDKAppID
const appKey = 'oL2Yk4JlJEZtu0GqtssWuCCguQdPoXPDU0hqBnlyRfOlSTCNNAWs6NyEtPRqytmi'; // 客户端密钥

if (Push) {
     const user = await Storage.get("userinfo");
     console.log('userinfo123',user);
     
   if(user!==null&&user){
    let userId=user.user.userId
    
      Push.setRegistrationID(String(userId), () => {
      console.log('setRegistrationID ok123', String(userId));
  });
   console.log('用户信息',String(userId));
  }  
  // 如果您需要与 Chat 的登录 userID 打通（即向此 userID 推送消息），请使用 setRegistrationID 接口
  // Push.setRegistrationID(userID, () => {
      // console.log('setRegistrationID ok', userID);
  // });
  
  Push.registerPush(SDKAppID, appKey, (data) => {
      console.log('registerPush ok', data);
      Push.disablePostNotificationInForeground(true);
      Push.getRegistrationID((registrationID) => {
        console.log('getRegistrationID ok', registrationID);
      });
    }, (errCode, errMsg) => {
      console.error('registerPush failed', errCode, errMsg);
    }
  );
   
  
  // 监听通知栏点击事件，获取推送扩展信息
  Push.addPushListener(Push.EVENT.NOTIFICATION_CLICKED, (res) => {
    // res 为推送扩展信息
    //navigation.navigate('OneChat',)
     //navigate('News');
    console.log('notification clicked', res);
  });
  
  // 监听在线推送
  Push.addPushListener(Push.EVENT.MESSAGE_RECEIVED, (res) => {
    // res 为消息内容
    console.log('message received', res);
  });

  // 监听在线推送被撤回
  Push.addPushListener(Push.EVENT.MESSAGE_REVOKED, (res) => {
    // res 为被撤回的消息 ID
    console.log('message revoked', res);
  });
}
    //getOAID();
    if(Platform.OS=='android'){
    trackOAID();
    }

  };
   const getOAID = async() => { 
    console.log("getoaid");
    await OaidModule.init();
    const oaid = await OaidModule.getOAID();
    console.log('oaid',oaid);
    adactivate(oaid)
    const info = await OaidModule.getDeviceInfo();
    console.log('info',info);
    };
    const adactivate = async(e) => { //上报激活
    try {
    const response = await request({
      url: '/ad/activate',
      method: 'POST',
      data: {
      //oaid:e
      },
      query: {
        oaid:e
        //type:'user'
      },
      });
      console.log('adactivate',response);
      if (response.data !== null && response.code == 0) {
      }
      } catch (error) {
      console.error(error);
      }
     };
  const checkWeChat = async () => {
  const installed = await WeChat.isWXAppInstalled();
  console.log('是否安装微信:', installed);
};
const openWeChat = async () => {
  const res = await WeChat.openWXApp();
  console.log('打开微信结果:', res);
};
  const handlagree = async() => {  //同意协议
  await Storage.set('privacyAgreed', true);

  setPrivacyReady(true);

  goinit();

  setPrivacyAgreed(true);

  RNBootSplash.hide({ fade: true });

  setShowPrivacy(false);
  };
    const handldisagree = () => { //拒绝协议
      // 二次确认弹窗
    Alert.alert(
      "提示",
      "您未同意授权，将无法继续使用 App。是否确认拒绝？",
      [
        {
          text: "再看看",
          style: "cancel",
        },
        {
          text: "确认拒绝",
          style: "destructive",
          onPress: () => {
           exitApp();// 直接退出
          },
        },
      ],
      { cancelable: false }
    );
   }; 
  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
      <KeyboardProvider>
       <Provider
       theme={{
        brand_primary: '#FF9500',     // 按钮背景颜色 <Button type="primary">
       }}>
      <NavigationContainer ref={navigationRef}>
     <StatusBar
        hidden={false}               // 显示状态栏
        translucent={true}           // 让状态栏背景透明
        backgroundColor="transparent" // 透明背景
        barStyle="dark-content"      // 字体颜色（dark-content / light-content）
      />
      {/* <Text style={{marginTop: px(100),}}>{oaid}</Text> */}
      <Stack.Navigator screenOptions={{ headerShown: false,
     animation: 'simple_push',
    }}>
         {/* Tab 导航 */}
     <Tab.Screen name="MainTab">
  {() => <TabNavigator totalcount={totalcount} unreadTotal={unreadTotal}/>}
</Tab.Screen>
      {/* 登录页 */}
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Code" component={Code}/>
       <Stack.Screen name="Confirm" component={Confirm}/>
      <Stack.Screen name="ClubHome" component={ClubHome}/>
      <Stack.Screen name="ClubInfo" component={ClubInfo}/>
<Stack.Screen name="Setting" component={Setting}/>
<Stack.Screen name="Profile" component={Profile}/>
<Stack.Screen name="Avtar" component={Avtar}/>
<Stack.Screen name="Name" component={Name}/>
<Stack.Screen name="Notice" component={Notice}/>
<Stack.Screen name="Shopinfo" component={Shopinfo}/>
<Stack.Screen name="Collect" component={Collect}/>
<Stack.Screen name="Follow" component={Follow}/>
<Stack.Screen name="Order" component={Order}/>
<Stack.Screen name="Coupon" component={Coupon}/>
<Stack.Screen name="Asset" component={Asset}/>
<Stack.Screen name="Register" component={Register}/>
<Stack.Screen name="InviteOrder" component={InviteOrder}/>
<Stack.Screen name="Withdraw" component={Withdraw}/>
<Stack.Screen name="Details" component={Details}/>
<Stack.Screen name="Guarantee" component={Guarantee}/>
<Stack.Screen name="Join" component={Join}/>
<Stack.Screen name="Cashout" component={Cashout}/>
<Stack.Screen name="OrderInfo" component={OrderInfo}/>
<Stack.Screen name="Comment" component={Comment}/>
<Stack.Screen name="OneChat" component={OneChat}/>
<Stack.Screen name="ShopIndex" component={ShopIndex}/>
<Stack.Screen name="ShopOrder" component={ShopOrder}/>
<Stack.Screen name="ShopCashout" component={ShopCashout}/>
<Stack.Screen name="ShopCashItem" component={ShopCashItem}/>
<Stack.Screen name="ShopPending" component={ShopPending}/>
<Stack.Screen name="ShopHomeOrder" component={ShopHomeOrder}/>
<Stack.Screen name="ShopOrderInfo" component={ShopOrderInfo}/>
<Stack.Screen name="ShopScreenshot" component={ShopScreenshot}/>
<Stack.Screen name="ShopEnter" component={ShopEnter}/>
<Stack.Screen name="ShopSetting" component={ShopSetting}/>
<Stack.Screen name="ShopManage" component={ShopManage}/>
<Stack.Screen name="ShopEmployee" component={ShopEmployee}/>
<Stack.Screen name="ShopAddEmployee" component={ShopAddEmployee}/>
<Stack.Screen name="ShopEditEmployee" component={ShopEditEmployee}/>
<Stack.Screen name="ShopNotice" component={ShopNotice}/>
<Stack.Screen name="Allcomments" component={Allcomments}/>
<Stack.Screen name="UserAgree" component={UserAgree}/>
<Stack.Screen name="PrivacyAgree" component={PrivacyAgree}/>
<Stack.Screen name="ShopPreview" component={ShopPreview}/>
<Stack.Screen name="ShopEdit" component={ShopEdit}/>
<Stack.Screen name="Preze" component={Preze}/>
<Stack.Screen name="Invite" component={Invite}/>
<Stack.Screen name="Refund" component={Refund}/>
<Stack.Screen name="Aftersales" component={Aftersales}/>
<Stack.Screen name="SafeOrderInfo" component={SafeOrderInfo}/>
<Stack.Screen name="ShopSale" component={ShopSale}/>
<Stack.Screen name="ShopSaleInfo" component={ShopSaleInfo}/>
<Stack.Screen name="ShopDetails" component={ShopDetails}/>
<Stack.Screen name="Searchlist" component={Searchlist}/>
<Stack.Screen name="Noticepla" component={Noticepla}/>
<Stack.Screen name="Noticeinfo" component={Noticeinfo}/>
<Stack.Screen name="MobileGame" component={MobileGame}/>
<Stack.Screen name="Playmate" component={Playmate}/>
<Stack.Screen name="Playmateadd" component={Playmateadd}/>
<Stack.Screen name="PlaymateList" component={PlaymateList}/>
<Stack.Screen name="Playmateedit" component={Playmateedit}/>
<Stack.Screen name="Productass" component={Productass}/>
<Stack.Screen name="PlayerInfo" component={PlayerInfo}/>
<Stack.Screen name="VideoPlayer" component={VideoPlayer}/>
<Stack.Screen name="KefuManage" component={KefuManage}/>



      </Stack.Navigator>
       </NavigationContainer>
       <PrivacyModal
        privacyUrl="https://tourok.com.cn/policy/privacy.html"
        termsUrl="https://tourok.com.cn/policy/user.html"
        sanfangUrl="https://jieqirili.com/sanfang.html"
        onAgree={() => handlagree()}
        showPrivacyModal={showPrivacy}
        ondisAgree={() => handldisagree()}
      />
    </Provider>
    </KeyboardProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    link: { 
    color: '#C85541', textDecorationLine: 'underline' 
},
    noargee:{
      marginTop: px(18),
  fontFamily: 'MiSans-Regular',
        fontSize:px(18),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(24),
},
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
    //marginTop: px(12),
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
  message:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(16),
},
  container: {
    flex: 1,
  },
});

export default App;
