import { StyleSheet, Text, View,ScrollView,TouchableOpacity,
  RefreshControl,TextInput,
 } from 'react-native'
import React,{useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import NewItem from './components/NewItem'
import { useIMStore } from '../../store/imStore';
import useAuthStore from '../../utils/zustand'
import { initIM, connectIM, onConnectStatus,onMessageStatus,onMessage,
sendTextMessage,
 } from '../../utils/wukongim'




export default function News({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const { conversationList, unreadCount } = useIMStore();
  const message = useAuthStore(state => state.isLogin);
  const messageChanged = useAuthStore(state => state.loginChanged);
    const [text, setText] = useState('')
  useEffect(() => {
   console.log('conlist',conversationList);
  }, [conversationList,unreadCount,message])
  
  const onRefresh = async () => {
    setRefreshing(true);

    // 模拟请求
    setTimeout(() => {
      console.log('刷新完成');
      setRefreshing(false);
    }, 1500);
  };

    useEffect(() => {
    // 1️⃣ 初始化
    initIM({
      uid: 'user123',
      token: 'your_token',
    })

    // 2️⃣ 监听连接状态
    onConnectStatus((status, reasonCode) => {
      if (status === 1) {
        console.log('✅ 连接成功')
      } else {
        console.log('❌ 连接失败', reasonCode)
      }
    })

    // 3️⃣ 发起连接
    connectIM()
  }, [])
  useEffect(() => {
  const off = onMessageStatus((packet) => {
    if (packet.reasonCode === 1) {
      console.log('发送成功')
    } else {
      console.log('发送失败')
    }
  })

  return off
}, [])
useEffect(() => {
  const off = onMessage((msg) => {
    console.log('新消息:', msg)
  })

  return off
}, [])
  const handleSend = () => {
  if (!text.trim()) return

  sendTextMessage(text, {
  channelId: '666',
  channelType: 1, // ChannelTypePerson
})

      // 4️⃣ 清空输入框
    setText('')
  };
  return (
    <View style={styles.container}>
      <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'center',marginTop: px(65),
      }}>
    <Text style={[styles.title,{marginBottom: px(8),}]}>消息中心({unreadCount})</Text>
      </View>
<ScrollView contentContainerStyle={{paddingHorizontal:px(16),marginTop: px(8),
  paddingBottom:px(100)
}} showsVerticalScrollIndicator={false} 
 refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
  <View style={{gap:px(12)}}>
    {conversationList?.map((item,index)=>
    <TouchableOpacity key={index} onPress={()=>navigation.navigate('OneChat',{item})}>
    <NewItem item={item}></NewItem>
    {conversationList.length-1!==index&&
     <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',
            marginTop: px(16),
        }}>
        <View style={{width: px(304),height: px(1),
          backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
        </View>
    }
    
    </TouchableOpacity>

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