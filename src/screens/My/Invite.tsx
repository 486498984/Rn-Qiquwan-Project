import { StyleSheet, Text, View,Animated,Image,TouchableOpacity,ScrollView,Alert} from 'react-native'
import React,{useRef,useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
//import * as WeChat from 'react-native-wechat-lib';
import Storage from '../../utils/storage';
import Clipboard from '@react-native-clipboard/clipboard';
import {  Toast } from '@ant-design/react-native'
import  request  from '../../api/request';
import * as WeChat from 'react-native-wechat-lib';
import {
  Radio,Modal as Modalitem,
} from '@ant-design/react-native'


export default function Invite({navigation}) {
      const scrollY = useRef(new Animated.Value(0)).current;
      const [invitelist, setInvitelist] = useState([]);
      const [invitecode, setInvitecode] = useState(null); //邀请码
   const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     useEffect(() => {
       getinvitelist()
       getinvitecode()
     }, [])
     const getinvitelist = async() => {  //获取邀请列表
  const user = await Storage.get("userinfo");
       try {
    const response = await request({
      url: '/user/direct_invitees',
      method: 'GET',
      data:{
  
      },
      query: {userId:user.user.userId}
    });
    console.log(response);
    if(response.data!==null&&response.data!==undefined&&response.code==0){
     setInvitelist(response.data)
    }
    
  } catch (error) {
    console.error(error);
  } 
  };
  const getinvitecode = async() => { //获取邀请码
       const user = await Storage.get('userinfo');
       try {
        const response = await request({
          url: '/get/invite/info',
          method: 'GET',
          data:{},
          query: { userId: user.user.userId }
        });
        console.log(response);
        if(response.data!==undefined&&response.data!==null&&response.code==0){
        setInvitecode(response.data.inviteCode)
        }
      } catch (error) {
        console.error(error);
      }
};
  // 背景颜色透明度随滚动渐变
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150], // 0 到 150 像素滚动范围
    outputRange: [
      'rgba(255, 255, 255, 0)', // 起始：完全透明
      'rgba(255, 18, 80, 1)', // 结束：完全不透明
    ],
    extrapolate: 'clamp', // 限制范围
  });
  const handleshare = async() => {  //分享
    console.log(111);
  const userinfo = await Storage.get('userinfo');
  const shareUrl = `https://share.tourok.com.cn/share?code=${invitecode}`;
  Clipboard.setString(shareUrl);
       Modalitem.alert('提示', '复制成功,是否跳转到微信？', [
      { text: '不了', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '是的', onPress: () => handlesubmits(),
       style: { color: '#FC9026' },
       },
      ])
  //Toast.info({content:'复制成功,快去分享给朋友吧～',mask:false});
 
   };
   const handlesubmits = () => { 

 WeChat.openWXApp();
    };
   const changetuo = (phone) => { 
  if (!phone) return '无';

  const phoneStr = String(phone).trim();

  // 中国大陆手机号（11 位）
  const reg = /^1\d{10}$/;

  if (!reg.test(phoneStr)) return '无';

  return phoneStr.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
    };
    const handleinvite = () => {  //复制邀请码
    Clipboard.setString(invitecode);
      Toast.info({content:'已复制到剪切板',mask:false});
     };
  return (
    <View style={styles.container}>
        {/* 顶部透明渐变栏 */}
          <Animated.View
            style={[
              styles.header,
              {
                backgroundColor: headerBackgroundColor, // ✅ 动态背景颜色
              },
            ]}
          >
              <TouchableOpacity onPress={handleback} style={{marginLeft: px(18),}}>
               <Image source={require('../../../assets/images/my/inback.png')} 
               style={{width: px(36),height: px(36)}}></Image>
               </TouchableOpacity>
          </Animated.View>
            <Animated.ScrollView showsVerticalScrollIndicator={false} overScrollMode='never'
                  bounces={false}
                   onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } // ⚠️颜色动画不能用原生驱动
                  )}>
                  <Image source={require('../../../assets/images/my/inviback.png')} 
               style={{width: px(393),height: px(620)}}></Image>
               <View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',gap:px(8)}}>
               <Text style={styles.invitetext}>我的邀请码：{invitecode}</Text>
               <TouchableOpacity onPress={()=>handleinvite()} activeOpacity={0.5} style={styles.copybox}>
                <Text style={styles.copytext}>复制</Text>
               </TouchableOpacity>
               </View>
              <View style={{marginTop: px(13),flexDirection: 'column',alignItems: 'center',}}>
            <View style={{width:'100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
        <TouchableOpacity activeOpacity={0.8} onPress={()=>handleshare()}
        style={{borderWidth: px(2),borderColor: '#FFECDC',borderRadius: px(130),}}>
   <LinearGradient
        colors={['#FF535D', '#FD0C65']} // 渐变颜色
        start={{ x: 0, y: 0 }}        // 左 -> 右
        end={{ x: 0, y: 1 }}
        style={styles.gradientBox}
      >
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Text style={styles.invitetext}>复制并分享链接</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
            </View>
<View style={styles.invitelistbox}>
      <Image source={require('../../../assets/images/my/invitefone.png')} 
      style={{width: px(232),height: px(26),marginTop: px(15),}}></Image>
<ScrollView style={{marginTop:px(20),height: px(320),width: '100%',}} nestedScrollEnabled={true}>
    {invitelist && invitelist.length > 0 ? (
    invitelist.map((item,index)=>
    <View style={{height: px(64),width: '100%',backgroundColor: "#FFF7E5",
    flexDirection: 'row',alignItems: 'center',justifyContent:'space-between',}} key={index}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
      {/* {item.InviteeAvatarUrl!==""&&
       <Image source={{uri:item.InviteeAvatarUrl}} 
      style={{width: px(45),height: px(45),borderRadius:px(45)/2,marginLeft:px(8),}}></Image>  
      }
    {item.InviteeAvatarUrl==""&&
       <Image source={require('../../../assets/images/my/avtar.png')} 
      style={{width: px(45),height: px(45),borderRadius:px(45)/2,marginLeft:px(8),}}></Image>  
      } */}
      <View style={{flexDirection: 'column',gap:px(5),marginLeft:px(17),}}> 
<Text style={styles.ftitle}>{item.InviteeNickName}</Text>
<Text style={styles.ftitlew}>账号：{changetuo(item.InviteePhone)}</Text>
      </View></View>
      <Text style={[styles.ftitlews,{marginRight: px(10),}]}>{item.ShareBindTime}</Text>
    </View>
    ))
    :(
  <View
    style={{
      width: "100%",
      alignItems: "center",
      marginTop: px(18),
    }}
  >
    <Text style={styles.footerText}>
      暂无好友噢～
    </Text>
  </View>
    )
}
</ScrollView>
</View>
<View style={{width: px(355),backgroundColor: 'rgba(0, 0, 0, 0.2)',marginTop: px(15),
    flexDirection: 'column',borderRadius:px(10),alignItems: 'center',paddingBottom:px(16)
}}>
     <Image source={require('../../../assets/images/my/inviteftwo.png')} 
      style={{width: px(232),height: px(26),marginTop: px(23),}}></Image>

<View style={{marginTop:px(34),width: px(326),flexWrap: 'wrap',
    flexDirection: 'row',gap:px(18)}}>
<Text>
  <Text style={styles.bottomtitle}>1.参与方式：</Text>
  <Text style={styles.bottomstitle}>邀请活动采用一级分销模式，注册并成为“柒趣玩”用户后，可生成专属推广链接 / 海报进行分享。直接邀请新用户注册并完成有效订单，即可获得对应支付金额3%的佣金 / 奖励。</Text>

</Text>
    <Text>
    <Text style={styles.bottomtitle}>2.领取方式：</Text>
     <Text style={styles.bottomstitle}>奖励自动结算至个人中心-我的资产，可在平台规则内申请提现，佣金比例以页面公示为准。</Text>
    </Text>
        <Text>
    <Text style={styles.bottomtitle}>3.有效订单：</Text>
     <Text style={styles.bottomstitle}>指支付成功、无退款、无售后退单的正常订单；发生退款 / 售后的订单，不计入奖励结算，已发放奖励将予以扣回。</Text>
    </Text>
            <Text>
    <Text style={styles.bottomtitle}>4.活动时间：</Text>
     <Text style={styles.bottomstitle}>平台可根据运营需要调整规则，调整后将及时公示生效。</Text>
     
    </Text>
              <Text>
    <Text style={styles.bottomtitle}>5.注意事项：</Text>
     <Text style={styles.bottomstitle}>严禁刷单、虚假交易、恶意套利等违规行为，一经发现，取消分销资格，冻结全部收益，并追究法律责任。</Text>
     
    </Text>
</View>


</View>
            
              </View>
 <View style={{height: px(32),}}></View>
                  </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
          footerText: {
        marginTop: px(16),
    textAlign:'center',
     fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
  },
  copytext:{
  fontFamily: 'MiSans-Medium',
        lineHeight:px(20),
        fontSize:px(15),
        color:'#FFFFFF',
        fontWeight:500,
  },
  copybox:{
    borderRadius: px(8),
    borderWidth: px(1),
    borderColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
   width: px(52),
   height: px(32),
   backgroundColor: '#FF535D',
  },
  bottombtitle:{
    textDecorationLine: 'underline',
  fontFamily: 'MiSans-Bold',
        lineHeight:px(16),
        fontSize:px(12),
        color:'#FFFFFF',
        //fontWeight:400,
  },
  bottomstitle:{
   fontFamily: 'MiSans-Regular',
        lineHeight:px(16),
        fontSize:px(12),
        color:'#D8D8D8',
        fontWeight:400,
  },
    bottomtitle:{
  fontFamily: 'MiSans-Bold',
        lineHeight:px(16),
        fontSize:px(12),
        color:'#FBF1E2',
        //fontWeight:400,
    },
    ftitlews:{
    fontFamily: 'MiSans-Regular',
        lineHeight:px(16),
        fontSize:px(12),
        color:'#B32139',
        fontWeight:400,
    },
    ftitlew:{
        fontFamily: 'MiSans-Regular',
        lineHeight:px(19),
        fontSize:px(14),
        color:'#B32139',
        fontWeight:400,
    },
    ftitle:{
 fontFamily: 'MiSans-Bold',
        lineHeight:px(21),
        fontSize:px(16),
        color:'#B32139',
        //fontWeight:600,
    },
    invitelistbox:{
        flexDirection: 'column',
        alignItems: 'center',
width: px(355),
height: px(386),
backgroundColor: '#FFFCF5',
marginTop: px(13),
borderRadius: px(8),
borderWidth: px(4),
borderColor: '#FFDEAB',
    },
    invitetext:{
 fontFamily: 'MiSans-Medium',
        lineHeight:px(27),
        fontSize:px(20),
        color:'#FFFFFF',
        fontWeight:600,
    },
      gradientBox: {
        // borderWidth: px(2),
        // borderColor: '#FFECDC',
    width:px(357),
    height: px(56),
 
    borderRadius: px(130),
    justifyContent: 'center',
    alignItems: 'center',
  },
header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: px(90),
    backgroundColor: 'rgba(255, 255, 255, 1)', // 白色背景
  flexDirection: 'row',        // 横向排列
  alignItems: 'flex-end',      // ✅ 垂直方向靠底
  justifyContent: 'flex-start',// ✅ 水平方向靠左
  paddingBottom:px(8),
  zIndex: 10,
  },
    container:{
        flex: 1,
        backgroundColor: '#FF1250',
    }
})