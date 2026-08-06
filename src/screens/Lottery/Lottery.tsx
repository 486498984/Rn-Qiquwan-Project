import { StyleSheet, Text, View,Image,ScrollView,TouchableOpacity,
  RefreshControl,ActivityIndicator,
 } from 'react-native'
import React,{useEffect,useState,useCallback} from 'react'
import { px } from '../../utils/scaleUtils';
import request from '../../api/request';
import Wheel from "./components/Wheel";
import LotteryResultModal from "./components/LotteryResultModal";
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '../../components/My/CustomModal';
import Storage from '../../utils/storage';
import {  Toast } from '@ant-design/react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';


  const prizes = [
    { id: 1, prizeName: '5元全场优惠券',small:'价值29R跑刀',prizeType:'COUPON'},
    { id: 2, prizeName: '10元全场优惠券' ,small:'价值98R保618W',prizeType:'COIN'},
    { id: 3, prizeName: '500W哈佛币',small:'价值58R跑刀',prizeType:'COIN' },
    { id: 4, prizeName: '1000W哈佛币',small:'价值68R/小时',prizeType:'COIN' },
    { id: 5, prizeName: '价值68R娱乐陪玩单',small:'全品类优惠券',prizeType:'SERVICE' },
    { id: 6, prizeName: '价值98R护航单',small:'全品类优惠券',prizeType:'SERVICE' },
  ];


  const prizedemo={id:1,name:"5元全品类优惠券",prizeName:"5元全品类优惠券",
  sourceId:0,type:"COUPON"
  }
export default function Lottery({navigation}) {
  const insets = useSafeAreaInsets();
    const [visibleru, setVisibleru] = useState(false);
    const [prizenum, setPrizenum] = useState(0);
     const [listnum, setListnum] = useState(0); //已得到奖品
          const [prizeifo, setPrizeifo] = useState({}); //弹窗详情

   useFocusEffect(
     useCallback(() => {
     getprizelist();
    getusernumber(); //获取抽奖次数
    getprize(); //获取抽奖列表
     }, [])
   );
 
  useEffect(() => { 
    getprizelist();
    getusernumber(); //获取抽奖次数
    getprize(); //获取抽奖列表
  }, [])
  const getprizelist = async() => { 
  try {
    const response = await request({
      url: '/lottery/prize/list',
      method: 'GET',
    });
    console.log(response);
    if (response.data && response.code == 0&&response.data.list.length!==0) {
      console.log(response.data.list);
      
    setPrize(response.data.list)
    }
  } catch (error) {
    console.error(error);
  }

   };
   const getusernumber = async() => { 
  const user = await Storage.get("userinfo");
  if(user==null){
    return
  }
  try {
    const response = await request({
      url: '/lottery/tickets',
      method: 'GET',
        query: {
        userId: user.user.userId,
        status:'UNUSED',
      },
    });
    console.log(response);
   if (response.data && response.code == 0&&response.data!==null) {
      console.log(response.data);
      setPrizenum(response.data.length)
    }else{
       setPrizenum(0)
    }
  } catch (error) {
    console.error(error);
  }

    };
    const getprize = async() => { 
  const user = await Storage.get("userinfo");
  if(user==null){
    return
  }
  try {
    const response = await request({
      url: '/lottery/records',
      method: 'GET',
        query: {
        userId: user.user.userId,
        page:1,
        pageSize:10,
      },
    });
    console.log(response);
    if (response.data && response.code == 0&&response.data.list!==null) {
      console.log(response.data.list);
       const len = response.data.total;
      // 这里做上限处理
      //const showNum = len > 99 ? '99+' : len;
      setListnum(len);
      }
      } catch (error) {
        console.error(error);
      }
     }
    const [visible, setVisible] = useState(false);
    const [resultIndex, setResultIndex] = useState(0);
    const [prize, setPrize] = useState(prizes);
    const [spinning, setSpinning] =
    useState(false);

  const [targetIndex, setTargetIndex] =
    useState(0);



  // 开始抽奖
  const handleLottery = async () => {
  const user = await Storage.get("userinfo");
  if(user==null){
    Toast.info({content:'请先完成登陆',mask:false});
    return
  }
    if (spinning) return;
   
    getprizesub(); //抽奖
    // 模拟接口返回中奖位置
    const index = 2;

    // 5秒后恢复

  };
  const getprizesub = async() => { 
  const user = await Storage.get("userinfo");
  try {
    const response = await request({
      url: '/lottery/draw',
      method: 'POST',
        data: {
            userId: user.user.userId,
            ticketCode: "",
      }, 
    });
    console.log(response);
    if (response.data && response.code == 0) {
    if(response.data.isWin==true){
  setPrizeifo(response.data)
  const prizeId = response.data.prize.id;
    const index = prize.findIndex(
      item => item.id === prizeId
    );
    console.log(index);
    setTargetIndex(index);
    getusernumber(); //获取抽奖次数
    if(response.data.prize.type=="COUPON"){
    setResultIndex(0);
    }else if(response.data.prize.type=="COIN"){
    setResultIndex(1);
    }else if(response.data.prize.type=="SERVICE"){
    setResultIndex(2);
    }else if(response.data.prize.type=="NONE"){
    //setResultIndex(2);
    Toast.info({content:'未中奖，谢谢参与！',mask:false});
    }

    setSpinning(true);
    setTimeout(() => {
    getprize(); //获取奖品数量
    setSpinning(false);
    // 假设接口返回中奖类型
  
    setVisible(true);
    }, 5000);
    }else if(response.data.isWin==false){
      console.log(2131);
      if(response.data.message=="暂无抽奖机会"){
      Toast.info({content:'当前无抽奖机会',mask:false});
      }else{
      Toast.info({content:'未中奖，谢谢参与！',mask:false});
      }
    }
  
    }else{
    Toast.info({content:'抽奖失败，请稍后重试',mask:false});
    }
  } catch (error) {
    console.error(error);
  }
   };
   const handlegolist = async() => { 
      const user = await Storage.get("userinfo");
      if(user==null){
    Toast.info({content:'请先完成登陆',mask:false});
    return
      }
   navigation.navigate('Preze')
    };
      const [refreshing, setRefreshing] = useState(false);

  // 下拉触发
  const onRefresh = async () => {
    setRefreshing(true);
    getusernumber();
    getprize();
    // 模拟请求
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const handlegoinvit = async() => { 
     const user = await Storage.get("userinfo");
      if(user==null){
    Toast.info({content:'请先完成登陆',mask:false});
    return
      }
  navigation.navigate('Invite')
   };
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
      <LinearGradient
    colors={['#F9E7D2', '#F0CBA2', '#F0CA9E']}
    locations={[0, 0.3272, 1]}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}
    style={{ flex: 1 }}
  >
    <ScrollView showsVerticalScrollIndicator={false} 
    overScrollMode="never"
         refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      style={{marginTop:insets.top,}}
      contentContainerStyle={{paddingBottom:insets.top}}>
     
    <View style={styles.container}>
      <View style={{position: 'relative',width: '100%',}}>
      <Image source={require('../../../assets/images/lottery/back.png')} 
            style={{width:px(393),height:px(820),position: 'absolute',}}></Image>
                <View style={{position: 'absolute',top:px(148),
                  left:px(65)
                }}>
        <Wheel  
        data={prize}
        spinning={spinning}
        targetIndex={targetIndex}
        onStart={handleLottery}
        />
        </View> 
        <TouchableOpacity style={styles.rulerbox}
        onPress={()=>setVisibleru(true)}>
          <Text style={styles.rulertext}>活动规则</Text>
        </TouchableOpacity>
        <View style={{marginTop: px(432)}}>
        <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
          position: 'relative',height: px(43),
        }}>
          <View style={{position: 'absolute',left:px(35),flexDirection: 'row',
            alignItems: 'center',
          }}>
   <Image source={require('../../../assets/images/lottery/number.png')} 
    style={{width:px(43),height:px(43)}}></Image>
    <View style={{flexDirection: 'column',justifyContent: 'center',
      marginLeft: px(8),gap:px(1)
    }}>
      <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.bnumber}>{prizenum}</Text>
<Text style={[styles.snumber,{marginLeft: px(3),}]}>次</Text>
      </View>
<Text style={styles.snumber}>剩余可抽奖次数</Text>
    </View>
          </View>
     <TouchableOpacity style={{position: 'absolute',left:px(230),
      flexDirection: 'row',alignItems: 'center',
     }} onPress={()=>handlegolist()}>
   <Image source={require('../../../assets/images/lottery/gift.png')} 
    style={{width:px(43),height:px(43)}}></Image>
        <View style={{flexDirection: 'column',justifyContent: 'center',
      marginLeft: px(8),gap:px(1)
    }}>
      <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.bnumber}>{listnum}</Text>
<Text style={[styles.snumber,{marginLeft: px(3),}]}>个</Text>
        </View>
   <Image source={require('../../../assets/images/lottery/right.png')} 
    style={{width:px(19),height:px(19)}}></Image>
      </View>
<Text style={styles.snumber}>已获得奖品</Text>
    </View>
          </TouchableOpacity>
        </View>

<TouchableOpacity style={{width: '100%',flexDirection: 'row',marginTop: px(25),
  justifyContent: 'center',alignItems: 'center',}} onPress={()=>handleLottery()}>
 <Image source={require('../../../assets/images/lottery/lobuttom.png')} 
    style={{width:px(340),height:px(73)}}></Image>
</TouchableOpacity>

<View style={{flexDirection: 'column',alignItems: 'center',
  marginTop: px(24),
}}>
<LinearGradient
  colors={['#FBEAC7', '#FCE5B7']}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1 }}
  style={{
    width: px(319),
    height: px(91),
    borderWidth: px(1.5),
    borderColor: '#fff',
    borderRadius: px(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
  <View style={{flexDirection: 'column',justifyContent: 'center',
    gap:px(6),marginLeft: px(15),
  }}>
    <Text style={styles.btitle}>游戏结单</Text>
    <Text style={[styles.bodes,{width: px(288),}]}>平台所有店铺下单并结单可获得一次抽奖机会，抽奖机会自动到账，无需手动领取。</Text>
  </View>
  {/* <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
  justifyContent: 'center',marginRight: px(34),
  }}>
 <Text style={styles.gettext}>领取</Text>
  <Image source={require('../../../assets/images/lottery/finish.png')} 
    style={{width:px(76),height:px(33),position: 'absolute',}}></Image>
  </TouchableOpacity> */}
     
</LinearGradient>

<LinearGradient
  colors={['#FBEAC7', '#FCE5B7']}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1 }}
  style={{
    width: px(319),
    height: px(91),
    borderWidth: px(1.5),
    borderColor: '#fff',
    borderRadius: px(12),
    marginTop: px(8),
        flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
    <View style={{flexDirection: 'column',justifyContent: 'center',
    gap:px(6),marginLeft: px(15),
  }}>
    <Text style={styles.btitle}>邀请下单</Text>
    <Text style={styles.bodes}>成功邀请好友注册并首次结单可获得一次抽奖机会，可重复领取。</Text>
  </View>
  <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
  justifyContent: 'center',marginRight: px(28),
  }} onPress={()=> handlegoinvit()}>
 <Text style={styles.gettext}>去完成</Text>
  <Image source={require('../../../assets/images/lottery/get.png')} 
    style={{width:px(76),height:px(33),position: 'absolute',}}></Image>
  </TouchableOpacity>
</LinearGradient>
</View>

        </View>
            </View>
  
    </View>
 


        <LotteryResultModal
        prizeifo={prizeifo}
        visible={visible}
        index={resultIndex}
        onClose={() => setVisible(false)}
      />
         <CustomModal visible={visibleru} onClose={() => setVisibleru(false)}
          width={px(323)} isclose={false}>

<View style={{flexDirection: 'column',alignItems: 'center',}}>
  <Text style={styles.bigtitle}>活动规则</Text>
  <Text style={styles.midtext}>本活动最终解释权归柒趣玩所有</Text>
  <Text style={styles.context}>1.活动期间，用户成功完成有效订单，即可获得 1 次大转盘抽奖机会，抽奖次数可累计使用，不清零 。 
      {'\n'}
    2.抽奖机会仅针对已支付、无退款、无售后维权的正常完结订单发放；发生全额/部分退款、售后退单退款的订单，不赠送抽奖机会，已发放的对应抽奖机会将自动失效/收回。 
      {'\n'}
    3.同一订单仅可获得 1 次抽奖机会，拆单、恶意下单等违规行为将取消抽奖及获奖资格。 
      {'\n'}
      4.奖品以实际抽中为准，中奖后请按提示完成领奖，逾期未领/未使用视为放弃。 
        {'\n'}
        5.平台有权对违规套现、作弊刷取次数行为进行处罚，包括但不限于撤销资格、收回奖品等。</Text>
</View>
            <TouchableOpacity onPress={() => setVisibleru(false)}>
             <LinearGradient
            colors={['#FEC525', '#FC9026']} // 渐变颜色
            start={{ x: 1, y: 0 }}   
            end={{ x: 0, y: 0 }}
            style={styles.gradientBox}
            >
                <View style={{flexDirection: 'row',alignItems: 'center',
                    justifyContent: 'center',
                }}>
            <Text style={styles.logintext}>知道了</Text>
            </View>
            </LinearGradient>
            </TouchableOpacity>
          </CustomModal>
    </ScrollView>
    </LinearGradient>
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
        marginTop: px(14),
    width:px(221),
    height: px(48),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  context:{
    marginTop: px(12),
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(21),
  },
  midtext:{
    marginTop: px(8),
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
  },
  bigtitle:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(19),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(25),
  },
  gettext:{
    zIndex: 999,
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(19),
  },
  bodes:{
    width: px(208),
  fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#8C6E50',
        fontWeight:400,
        lineHeight:px(18),
  },
  btitle:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#5C4129',
        //fontWeight:500,
        lineHeight:px(21),
  },
  snumber:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#8C6E50',
        fontWeight:400,
        lineHeight:px(19),
  },
  bnumber:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(14),
        color:'#5C4129',
        //fontWeight:400,
        lineHeight:px(19),
  },
  rulertext:{
     fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#8C6E50',
        fontWeight:400,
        lineHeight:px(16),
  },
  rulerbox:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right:0,
    top:px(95),
    width: px(68),
    height: px(26),
    backgroundColor: '#EFDDC9',
    borderWidth: px(1),
    borderColor: '#fff',
    borderTopLeftRadius: px(6),
    borderBottomLeftRadius: px(6),
    zIndex: 99,
  },
    container:{
      flex: 1,
    }
})