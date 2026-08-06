import { StyleSheet, Text, View,ScrollView,TouchableOpacity,
  RefreshControl,TextInput,Image,Animated,Vibration,AppState,
  ActivityIndicator,
 } from 'react-native'
import React,{useState,useEffect,useRef,useCallback,} from 'react'
import { px } from '../../utils/scaleUtils';
import NewItem from './components/NewItem'
import NoticeItem from './components/NoticeItem'
import { useIMStore } from '../../store/imStore';
import useAuthStore from '../../utils/zustand'
import { initIM, connectIM, onConnectStatus,onMessageStatus,onMessage,
sendTextMessage,
 } from '../../utils/wukongim'
import request from '../../api/request'
import {
  Tooltip,
  Toast,
} from '@ant-design/react-native';
import Storage from '../../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import  chat  from '../../utils/im';
import TencentCloudChat from '@tencentcloud/chat';




      const actions = [
    {
      key: 'online',
      text: '客服在线',
    },
    {
      key: 'offline',
      text: '客服离线',
    },
  ];
  const statusTextMap = {
  online: '客服在线',
  offline: '客服离线',
};
export default function News({navigation}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const { conversationList, unreadCount } = useIMStore();
  const message = useAuthStore(state => state.isLogin);
  const messageChanged = useAuthStore(state => state.loginChanged);
  const setUnreadTotal = useAuthStore(
  state => state.setUnreadTotal
  );
    const unreadTotal = useAuthStore(
  state => state.unreadTotal
  );
      const isNewmessage = useAuthStore(
  state => state.isNewmessage
  );
  
    const [text, setText] = useState('')
const [visible, setVisible] = useState(false);
const [islogin, setIslogin] = useState(false); //是否登陆
const [status, setStatus] = useState('online');
const [iskefu, setIskefu] = useState(false); //是否是客服
const [kefuinfo, setKefuinfo] = useState({}); //客服角色详情
const [currentTab, setCurrentTab] = useState('service');
const [serviceList, setServiceList] = useState([]); //工作室会话列表
const [userList, setUserList] = useState([]); //用户会话列表
const [noticelist, setNoticelist] = useState({}); //公告列表


const appState = useRef(AppState.currentState);

useEffect(() => {
  const subscription = AppState.addEventListener(
    'change',
    nextAppState => {

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('APP回到前台');
 
        getclubpermission();
        getuserinfo();
        getnoticelist();
      }

      appState.current = nextAppState;
    },
  );

  return () => {
    subscription.remove();
  };
}, []);

   useFocusEffect(
     useCallback(() => {
     getclubpermission();
     getuserinfo();
     getnoticelist();
     }, [])
   );
useEffect(() => {
  Animated.timing(rotateAnim, {
    toValue: visible ? 1 : 0,
    duration: 200,
    useNativeDriver: true,
  }).start();
}, [visible]);

const rotate = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
});
  
  useEffect(() => {
    getclubpermission();
    getuserinfo();
    getnoticelist();
   console.log('conlist',conversationList);
   
  }, [conversationList,unreadCount,message,isNewmessage,unreadTotal])
  const getuntotal = async(e) => {
    console.log(e);
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
  
   const getuserinfo = async() => {
   const user = await Storage.get("userinfo");
   if(user==null){
    setIskefu(false)
    setIslogin(false)
    return
   }
   setIslogin(true)
    try {
    const response = await request({
      url: '/session/list',
      method: 'GET',
      data: {
        },
      query: {
        page:1,
        pageSize:20
      },
      });
      console.log('imlist',response);
      if (response.data !== null && response.code == 0) {
        if(response.data.list.length!==0){
        console.log('wgqwfqw',response.data.list);
        console.log('cruwgw',currentTab);
         
        setUserList(response.data.list)
        }else{
        setUserList([])
        }
      }
      } catch (error) {
      console.error(error);
      }

    };
  const handlegetservice = async(e) => { 
  console.log(e);
  
    try {
    const response = await request({
      url: '/customer/sessions',
      method: 'GET',
      data: {
        },
      query: {
        storeId:e.storeId,
        page:1,
        pageSize:20
      },
      });
      console.log('serimlist',response);
      if (response.data !== null && response.code == 0) {
      if(response.data.list!==null){
        setServiceList(response.data.list)
        }else{
          setServiceList([])
        }
      }else{
        setServiceList([])
      }
      } catch (error) {
      console.error(error);
      }

  };
    const handleAction = (item) => {
    console.log('当前状态:', item.key);

    if (item.key === 'online') {
      online(1);
      Toast.show('已切换为客服在线');
    } else {
      onlineoff();
      Toast.show('已切换为客服离线');
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    getclubpermission();
    getuserinfo();
    getnoticelist();
    // 模拟请求
    setTimeout(() => {
      console.log('刷新完成');
      setRefreshing(false);
    }, 1000);
  };   
const getnoticelist = async() => { 
  try { 
    const response = await request({ 
      url: '/notice/admin/list', 
      method: 'GET', 
      data: { }, 
      query: { page:1, pageSize:1 }, }); 
      console.log('noticelist',response); 
      if (response.data !== null && response.code == 0) { 
        if(response.data.list!==null&&response.data.list.length!==0){
        setNoticelist(response.data.list[0])
        }

       } 
      } catch (error) { console.error(error); } }
  
  const online = async(e) => { 
      try {
const response = await request({
  url: '/customer/online',
  method: 'POST',
  data: {

  },
   query: {
   storeId: kefuinfo.storeId,
   },
    }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0) {
       
      }
      } catch (error) {
      console.error(error);
      }
   };
  const onlineoff = async() => {
    console.log(kefuinfo);
    
          try {
  const response = await request({
    url: '/customer/offline',
    method: 'POST',
    data: {

    },
    query: {
    storeId: kefuinfo.storeId,
    },
      }); 
        console.log('address',response);
        if (response.data !== null && response.code == 0) {
        
        }
        } catch (error) {
        console.error(error);
        }
  }


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

console.log('cust2132131',customerServiceItem);
      const hasCustomerService = storelist.some(store =>
      store.users?.some(user => user.roleCode === 'STORE_CS')
    );
       console.log(hasCustomerService);
      //const hasCustomerService = !!customerServiceItem;
      console.log('haskefu',hasCustomerService);
      console.log(customerServiceItem);
      //   const hasCustomerService = storelist.some(item =>
      //   item.roleName?.includes('客服')
      // ); 
      //console.log(hasCustomerService);
      if (hasCustomerService) {
        getuntotal(customerServiceItem)
        handlegetservice(customerServiceItem)
        setCurrentTab('service');
      } else {
        setCurrentTab('user');
        getuntotal('user')
      }
      setIskefu(hasCustomerService)
      if(customerServiceItem){
      setKefuinfo(customerServiceItem)
      if(customerServiceItem.isOnline==1){
        setStatus('online')
      }else{
        setStatus('offline')
      } 
      }

      }else{
        setIskefu(false)
        setCurrentTab('user');
        getuntotal('user')
      }
      } catch (error) {
        console.error(error);
      }
    };
    const senmessage = async() => { 
      try {
        const response = await request({
          url: '/message/send',
          method: 'POST',
          data: {
          sessionId: 14,
          storeId: 105,
          contentType: "text",
          content: "你好，打手能安排吗？",
          duration: 0
          },
          query: {
        
          },
            }); 
              console.log('message',response);
              if (response.data !== null && response.code == 0) {
              
              }
      } catch (error) {
      console.error(error);
      }

     };
     const currentList =
     currentTab === 'service'
    ? serviceList
    : userList;

      useEffect(() => {
    // setTimeout(() => {
    //   scrollToBottomWithoutAnim();
    // }, 400);
   
  const onReceive = async(event) => {
    const user = await Storage.get("userinfo");
    if(user!==null){
      if(user.user.userId){

      }
    }
    //Vibration.vibrate();
    const msgs = event.data;
    console.log('消息123',msgs);
    const messageList = await chat.getMessageList({
  conversationID: 'C2C22',
  //count: 15, // 每次拉多少条
  });
  console.log('ewggq',messageList);

    getclubpermission();
    getuserinfo();

    //const newMsgs = msgs.map(formatMessage);
     //gethistory();
    //setMessages(prev => [...newMsgs,...prev]);
    // chat.setMessageRead({
    // conversationID: item.conversationID,
    // });
  };

  chat.on(
    TencentCloudChat.EVENT.MESSAGE_RECEIVED,
    onReceive
  );
  // chat.on(
  //   TencentCloudChat.EVENT.MESSAGE_REVOKED,
  //   //onRevoked
  // );
  return () => {
    chat.off(
      TencentCloudChat.EVENT.MESSAGE_RECEIVED,
      onReceive
    );
  };
      }, []);  

   const [isReady, setIsReady] = useState(false);
       useEffect(() => {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 1); // 0.5~1s 都可以
  
      return () => clearTimeout(timer);
    }, []);
    // ⭐ 1. 未就绪 -> 只渲染轻量 loading
if (!isReady) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <ActivityIndicator size="large" color="#FC9026" />
    </View>
  );
} 

  return (
    <View style={styles.container}>
      <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'center',paddingTop: px(65),
        //backgroundColor: 'red',
      }}>
    <Text style={[styles.title,{marginBottom: px(8),}]}>消息中心({unreadTotal})</Text>
    {iskefu&& 
      <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right:0,
        bottom:0,
        //height: 40,
      }}
    >
      <Tooltip.Menu
        actions={actions}
        trigger="onPress"
        //placement="top"
        crossOffset={{ top: 0, left: 0 }}
        mode="dark"
    visible={visible}
    onVisibleChange={(v) => {
      setVisible(v);
    }}
    onAction={(item) => {

      setStatus(item.key);
      handleAction(item);
      setVisible(false);
    }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            paddingHorizontal: px(16),
            flex: 1,
            height: px(40),
            //borderRadius: 20,
            //backgroundColor: '#1A1A1A',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={styles.comprehensive}
          >
            {statusTextMap[status]}
          </Text>
           <Animated.Image
            source={require('../../../assets/images/home/select.png')}
            style={{
              width: px(17),
              height: px(17),
              marginLeft: px(1),
              transform: [{ rotate }],
            // transform: [{ rotate }],
            }}
          />
        </TouchableOpacity>
      </Tooltip.Menu>
    </View>
}

      </View>


{/* <TouchableOpacity onPress={()=>senmessage()}
  style={{width: 100,height: 50,backgroundColor: 'red',}}>
        
</TouchableOpacity> */}
{iskefu && (
  <View style={styles.tabWrap}>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setCurrentTab('service')}
      style={styles.tabItem}
    >
      <Text
        style={[
          styles.tabText,
          currentTab === 'service' && styles.activeTabText,
        ]}
      >
      工作室
      </Text>

      {currentTab === 'service' && (
        <View style={styles.activeLine} />
      )}
    </TouchableOpacity>

    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setCurrentTab('user')}
      style={styles.tabItem}
    >
      <Text
        style={[
          styles.tabText,
          currentTab === 'user' && styles.activeTabText,
        ]}
      >
        用户
      </Text>

      {currentTab === 'user' && (
        <View style={styles.activeLine} />
      )}
    </TouchableOpacity>
  </View>
)}

<ScrollView contentContainerStyle={{paddingHorizontal:px(16),marginTop: px(8),
  paddingBottom:px(100)
}} showsVerticalScrollIndicator={false} 
 refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }> 

<View style={{paddingHorizontal:px(0)}}>
<NoticeItem
noticelist={noticelist}
navigation={navigation}
></NoticeItem>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: px(16),
              paddingBottom:px(16)
            }}
          >
            <View
              style={{
                width: px(304),
                height: px(1),
                backgroundColor: 'rgba(118, 118, 118,0.2)',
              }}
            />
          </View>
</View>

<View style={{ gap: px(12), flex: 1 }}>
  {/* 未登录 */}
  {!islogin ? (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>请先登录</Text>
    </View>
  ) : currentList?.length === 0 ? (
    /* 已登录但是没会话 */
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>暂无消息</Text>
    </View>
  ) : (
    /* 正常列表 */
    currentList?.map((item, index) => (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => navigation.navigate('OneChat', { item })}
      >
        <NewItem item={item} getuserinfo={getuserinfo}
        getclubpermission={getclubpermission}/>

        {currentList.length - 1 !== index && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: px(16),
            }}
          >
            <View
              style={{
                width: px(304),
                height: px(1),
                backgroundColor: 'rgba(118, 118, 118,0.2)',
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    ))
  )}
</View>
  </ScrollView>
        {/* <TextInput
        style={styles.input}
        placeholder="请输入消息"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.btnText}>发送</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  emptyWrap: {
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: px(120),
},

emptyText: {
 fontFamily: 'MiSans-Regular',
  fontSize:px(13),
  color:'#767676',
  fontWeight:400,
  lineHeight:px(17),
},
  tabWrap: {
  //backgroundColor: 'red',
  width: '100%',
  height: px(40),
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: px(16),
  //marginTop: px(10),
},

tabItem: {
  marginRight: px(28),
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},

tabText: {
  fontSize: px(16),
  color: '#999',
  fontFamily: 'MiSans-Regular',
},

activeTabText: {
  color: '#1A1A1A',
  fontFamily: 'MiSans-Medium',
},

activeLine: {
  position: 'absolute',
  bottom: px(0),
  width: px(20),
  height: px(3),
  borderRadius: px(2),
  backgroundColor: '#FF7A00',
},
      comprehensive:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
    },
    input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  button: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
  },


  title:{
fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(21),
  },
    container:{
    flex: 1,
    backgroundColor: '#fff',
  }
})